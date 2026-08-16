// app/profile/page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface Profile {
  id: string;
  phone_number: string;
  phone_verified: boolean;
  username: string | null;
  email: string | null;
  is_business: boolean;
  is_goverment_entity: boolean;
  msme_number: string | null;
  gst_number: string | null;
  created_at: string;
}

interface AddressItem {
  id: string;
  label: string;
  full_address: string;
  pincode: string;
  city: string;
  latitude: string;
  longitude: string;
  is_default: boolean;
}

function useAuthHeader() {
  const { tokens } = useAuthStore();
  return { Authorization: `Bearer ${tokens?.access}` };
}

function initials(profile: Profile) {
  const source = profile.username || profile.phone_number;
  return source.slice(0, 2).toUpperCase();
}

function completeness(profile: Profile) {
  const checks = [
    profile.phone_verified,
    !!profile.username,
    !!profile.email,
  ];
  return checks.filter(Boolean).length / checks.length;
}

function formatMemberSince(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

/* ---------- Trust ring: signature element ---------- */
function TrustRing({ profile }: { profile: Profile }) {
  const pct = completeness(profile);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50" cy="50" r={radius}
          className="stroke-(--color-line)"
          strokeWidth="6" fill="none"
        />
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke="var(--color-primary)"
          strokeWidth="6" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-2 flex items-center justify-center rounded-full bg-(--color-primary) text-white">
        <span className="font-serif text-2xl tracking-tight">{initials(profile)}</span>
      </div>
      {profile.phone_verified && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.1, type: "spring", stiffness: 300, damping: 15 }}
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-(--color-primary-light) ring-4 ring-(--color-bg)"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-white">
            <path d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Inline-editable field ---------- */
function EditableField({
  label,
  value,
  placeholder,
  onSave,
  type = "text",
}: {
  label: string;
  value: string | null;
  placeholder: string;
  onSave: (val: string) => Promise<void>;
  type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => setDraft(value || ""), [value]);

  const handleSave = async () => {
    if (draft === (value || "")) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(draft);
      setEditing(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1600);
    } catch (err: any) {
      const msg =
        err.response?.data?.[label.toLowerCase()]?.[0] ||
        "Couldn't save. Try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-b border-(--color-line) py-4 last:border-none">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-(--color-ink-soft)">
          {label}
        </span>

        <AnimatePresence mode="wait">
          {justSaved && (
            <motion.span
              key="saved"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs font-medium text-(--color-primary)"
            >
              Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1.5 flex items-center gap-2"
          >
            <input
              autoFocus
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-(--color-line) bg-(--color-bg-card) px-3 py-2 text-sm text-(--color-ink) outline-none focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-(--color-accent) px-3 py-2 text-sm font-medium text-(--color-ink) transition hover:brightness-90 disabled:opacity-60"
            >
              {saving ? "..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setDraft(value || "");
                setError("");
              }}
              className="rounded-lg px-3 py-2 text-sm text-(--color-ink-soft) hover:text-(--color-accent)"
            >
              Cancel
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="view"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            onClick={() => setEditing(true)}
            className="mt-1 block w-full text-left"
          >
            <span
              className={
                value
                  ? "text-[15px] text-(--color-ink)"
                  : "text-[15px] italic text-(--color-ink-soft)"
              }
            >
              {value || placeholder}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}


function ToggleField({
  label,
  description,
  value,
  onSave,
}: {
  label: string;
  description: string;
  value: boolean;
  onSave: (val: boolean) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [checked, setChecked] = useState(value);

  useEffect(() => setChecked(value), [value]);

  const handleToggle = async () => {
    const next = !checked;
    setChecked(next); // optimistic
    setSaving(true);
    try {
      await onSave(next);
    } catch {
      setChecked(!next); // revert on failure
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-(--color-line) py-4 last:border-none">
      <div className="pr-4">
        <span className="block text-sm text-(--color-ink)">{label}</span>
        <span className="mt-0.5 block text-xs text-(--color-ink-soft)">{description}</span>
      </div>
      <button
        onClick={handleToggle}
        disabled={saving}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-(--color-accent)" : "bg-(--color-line)"
        } disabled:opacity-60`}
      >
        <motion.span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
          animate={{ left: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

/* ---------- Read-only row ---------- */
function StaticField({ label, value, badge }: { label: string; value: string; badge?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-(--color-line) py-4 last:border-none">
      <div>
        <span className="block text-xs font-medium uppercase tracking-wide text-(--color-ink-soft)">
          {label}
        </span>
        <span className="mt-1 block text-[15px] text-(--color-ink)">{value}</span>
      </div>
      {badge}
    </div>
  );
}

// Address card component — add to the same file

function AddressCard({
  address,
  onSetDefault,
  onDelete,
}: {
  address: AddressItem;
  onSetDefault: () => void;
  onDelete: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-(--color-line) bg-(--color-bg-card) p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium capitalize text-(--color-ink)">
              {address.label}
            </span>
            {address.is_default && (
              <span className="rounded-full bg-(--color-primary)/10 px-2 py-0.5 text-[11px] font-medium text-(--color-primary)">
                Default
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-sm text-(--color-ink-soft)">
            {address.full_address}, {address.city} - {address.pincode}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          {!address.is_default && (
            <button
              onClick={onSetDefault}
              className="text-xs font-medium text-(--color-accent) hover:underline"
            >
              Set default
            </button>
          )}
          <button
            onClick={async () => {
              setDeleting(true);
              await onDelete();
            }}
            disabled={deleting}
            className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}


// New address form — add form component

function AddAddressForm({ onAdd, onCancel }: { onAdd: (data: any) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState({
    label: "home",
    full_address: "",
    pincode: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError("Location isn't available on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
        lat: parseFloat(pos.coords.latitude.toFixed(6)),
        lng: parseFloat(pos.coords.longitude.toFixed(6)),
      });
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location. Enter the address manually.");
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coords) {
      setError("Please share your location so pickup can find you.");
      return;
    }
    if (!form.full_address || !form.pincode || !form.city) {
      setError("Fill in all fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onAdd({
        ...form,
        latitude: coords.lat,
        longitude: coords.lng,
        is_default: false,
      });
    } catch (err: any) {
      setError(err.response?.data?.non_field_errors?.[0] || "Couldn't save address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-xl border border-(--color-line) bg-(--color-bg-card) p-4"
    >
      <div className="flex gap-2">
        {["home", "office", "other"].map((l) => (
          <button
            type="button"
            key={l}
            onClick={() => setForm({ ...form, label: l })}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
              form.label === l
                ? "bg-(--color-accent) text-(--color-ink)"
                : "bg-(--color-bg-deep) text-(--color-ink-soft)"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <input
        value={form.full_address}
        onChange={(e) => setForm({ ...form, full_address: e.target.value })}
        placeholder="House no., street, landmark"
        className="mt-3 w-full rounded-lg border border-(--color-line) px-3 py-2 text-sm outline-none focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
      />
      <div className="mt-2 flex gap-2">
        <input
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          placeholder="City"
          className="flex-1 rounded-lg border border-(--color-line) px-3 py-2 text-sm outline-none focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
        />
        <input
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
          placeholder="Pincode"
          className="w-28 rounded-lg border border-(--color-line) px-3 py-2 text-sm outline-none focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
        />
      </div>

      <button
        type="button"
        onClick={captureLocation}
        disabled={locating}
        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-(--color-accent) disabled:opacity-60"
      >
        {locating ? "Getting location..." : coords ? "Location captured ✓" : "Share current location"}
      </button>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-ink) hover:brightness-90 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm text-(--color-ink-soft) hover:text-(--color-accent)"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

/* ---------- Page ---------- */
export default function ProfilePage() {

  const headers = useAuthHeader();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
    const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [addingAddress, setAddingAddress] = useState(false);
  const {logout} = useAuthStore();
  const [balance, setBalance] = useState<number | null>(null);

  const router = useRouter();

const handleLogout = () => {
  logout();
  router.replace("/");
};



  useEffect(() => {
  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${API_BASE}/wallet/`, { headers });
      setBalance(parseFloat(res.data.balance));
    } catch (err) {
      console.error("Failed to fetch wallet balance:", err);
    }
  };

  fetchBalance();
}, []);




  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/me/`, { headers });
        setProfile(res.data);
      } catch {
        setLoadError("Couldn't load your profile. Pull to refresh or try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    
  }, []);

  const updateField = async (field: string, value:  string | boolean) => {
    const res = await axios.patch(
      `${API_BASE}/users/me/update/`,
      { [field]: value },
      { headers }
    );
    setProfile(res.data);
  };

  const entityLabel = useMemo(() => {
    if (!profile) return "";
    if (profile.is_goverment_entity) return "Government entity";
    if (profile.is_business) return "Business account";
    return "Individual account";
  }, [profile]);


   useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${API_BASE}/addresses/`, { headers });
        setAddresses(res.data);
      } catch {
        // fail silently — address list is secondary to profile itself
      }
    };
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

// Handlers:
  const handleAddAddress = async (data: any) => {
    console.log(data)
    const res = await axios.post(`${API_BASE}/addresses/`, data, { headers });
    setAddresses((prev) => [...prev, res.data]);
    setAddingAddress(false);
  };

  const handleSetDefault = async (id: string) => {
    const res = await axios.patch(`${API_BASE}/addresses/${id}/`, { is_default: true }, { headers });
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? res.data : { ...a, is_default: false }))
    );
  };

  const handleDeleteAddress = async (id: string) => {
    await axios.delete(`${API_BASE}/addresses/${id}/`, { headers });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-(--color-bg)">
  <div
    className="h-8 w-8 animate-spin rounded-full border-2 border-(--color-accent) border-t-transparent"
  />
</main>
    );
  }

  if (loadError || !profile) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-(--color-bg) px-4 text-center">
      <div>
        <h1 className="font-serif text-xl text-(--color-ink)">Something went wrong</h1>
        <p className="mt-2 max-w-xs text-sm text-(--color-ink-soft)">
          Sorry about that — {loadError ? loadError.charAt(0).toLowerCase() + loadError.slice(1) : "we couldn't load your profile."}
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/contact-us"
          className="rounded-xl bg-(--color-accent) px-5 py-2.5 text-sm font-medium text-(--color-ink) hover:brightness-90"
        >
          Contact support
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-(--color-line) px-5 py-2.5 text-sm font-medium text-(--color-ink-soft) hover:text-(--color-accent)"
        >
          Go to home page
        </Link>
      </div>
    </main>
  );
}
  return (
    <main className="min-h-screen bg-(--color-bg) px-4 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-xl"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <TrustRing profile={profile} />

            <div>
              <h1 className="font-serif text-[26px] leading-tight text-(--color-ink)">
                {profile.username || "Your profile"}
              </h1>

              <p className="mt-1 text-sm text-(--color-ink-soft)">
                Member since {formatMemberSince(profile.created_at)}
              </p>

              <span className="mt-2 inline-flex items-center rounded-full bg-(--color-primary)/10 px-2.5 py-1 text-xs font-medium text-(--color-primary)">
                {entityLabel}
              </span>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <div className="rounded-2xl border border-(--color-line) bg-(--color-bg-deep) px-5 py-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:gap-1">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-(--color-ink-soft)">
                  Wallet Balance
                </span>

                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-(--color-primary)">₹</span>
                  <span className="font-serif text-3xl font-bold leading-none text-(--color-ink)">
                    {balance}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Identity card */}
        <section className="rounded-2xl border border-(--color-line) bg-(--color-bg-card) px-5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <h2 className="pt-3 pb-1 text-[13px] font-semibold uppercase tracking-wide text-(--color-primary)">
            Identity
          </h2>
          <StaticField
            label="Phone number"
            value={`+91 ${profile.phone_number}`}
            badge={
              profile.phone_verified ? (
                <span className="rounded-full bg-(--color-primary)/10 px-2.5 py-1 text-xs font-medium text-(--color-primary)">
                  Verified
                </span>
              ) : (
                <span className="rounded-full bg-(--color-accent-soft) px-2.5 py-1 text-xs font-medium text-(--color-ink)">
                  Unverified
                </span>
              )
            }
          />
          <EditableField
            label="Username"
            value={profile.username}
            placeholder="Add a username"
            onSave={(val) => updateField("username", val)}
          />
          <EditableField
            label="Email"
            value={profile.email}
            placeholder="Add an email address"
            type="email"
            onSave={(val) => updateField("email", val)}
          />
          <ToggleField
            label="Business account"
            description="For registered businesses buying or selling scrap"
            value={profile.is_business}
            onSave={(val) => updateField("is_business", val)}
          />
          <ToggleField
            label="Government entity"
            description="For municipal or government bodies"
            value={profile.is_goverment_entity}
            onSave={(val) => updateField("is_goverment_entity", val)}
          />
        </section>

        {/* Business details — only shown for business/govt accounts */}
        {(profile.is_business || profile.is_goverment_entity) && (
          <section className="mt-5 rounded-2xl border border-(--color-line) bg-(--color-bg-card) px-5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <h2 className="pt-3 pb-1 text-[13px] font-semibold uppercase tracking-wide text-(--color-primary)">
              Business details
            </h2>
            <EditableField
              label="MSME number"
              value={profile.msme_number}
              placeholder="Add your MSME registration"
              onSave={(val) => updateField("msme_number", val)}
            />
            <EditableField
              label="GST number"
              value={profile.gst_number}
              placeholder="Add your GST number"
              onSave={(val) => updateField("gst_number", val)}
            />
          </section>
        )}

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-(--color-primary)">
              Addresses
            </h2>
            {!addingAddress && (
              <button
                onClick={() => setAddingAddress(true)}
                className="text-xs font-medium text-(--color-accent) hover:underline"
              >
                + Add address
              </button>
            )}
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {addingAddress && (
                <AddAddressForm
                  onAdd={handleAddAddress}
                  onCancel={() => setAddingAddress(false)}
                />
              )}
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  onSetDefault={() => handleSetDefault(addr.id)}
                  onDelete={() => handleDeleteAddress(addr.id)}
                />
              ))}
              {addresses.length === 0 && !addingAddress && (
                <p className="rounded-xl border border-dashed border-(--color-line) px-4 py-6 text-center text-sm text-(--color-ink-soft)">
                  No addresses yet — add one so pickups know where to go.
                </p>
              )}
            </AnimatePresence>
          </div>
        </section>

        <div className="mt-10 rounded-2xl border border-(--color-line) bg-(--color-bg-deep) p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-serif text-lg text-(--color-ink)">
                Account
              </h3>
              <p className="mt-1 text-sm text-(--color-ink-soft)">
                Sign out of your account on this device.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={()=>handleLogout()}
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>


    </main>
  );
}