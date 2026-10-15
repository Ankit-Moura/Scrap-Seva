"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bike, Car, CarTaxiFront, Check, Loader2, Truck } from "lucide-react";
import { bodyType, splitBrand } from "@/lib/vehicles";
import { useAuthStore } from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type Item = { id: string; name: string; base_rate: string; max_rate: string | null; description: string | null; category: number };
type Category = { id: number; name: string };

// What the visitor picks first, and which slice of the rate card it means.
const KINDS = [
  { key: "car", label: "Car", Icon: Car, category: "Cars & SUVs", keep: () => true },
  { key: "bike", label: "Bike / Scooter", Icon: Bike, category: "Two-wheelers", keep: () => true },
  { key: "truck", label: "Truck / Van", Icon: Truck, category: "Commercial vehicles", keep: (t: string) => t !== "Three-wheeler" },
  { key: "three", label: "3-Wheeler", Icon: CarTaxiFront, category: "Commercial vehicles", keep: (t: string) => t === "Three-wheeler" },
] as const;
type KindKey = (typeof KINDS)[number]["key"];

const money = (v: string | number) => `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

/** Distinct values, most common first: SUV and Sedan before Estate. */
function byFrequency(values: string[]) {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v);
}

function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-(--color-primary) bg-(--color-primary) text-white"
          : "border-(--color-line) bg-white text-(--color-ink) hover:border-(--color-primary)"
      }`}
    >
      {children}
    </button>
  );
}

/** A finished step, folded to one line so only the next choice is open. */
function Done({ label, value, onChange }: { label: string; value: string; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-(--color-bg) px-3 py-2 text-sm">
      <span className="text-(--color-ink-soft)">
        {label}: <span className="font-semibold text-(--color-ink)">{value}</span>
      </span>
      <button type="button" onClick={onChange} className="text-xs font-semibold text-(--color-primary) hover:underline">
        Change
      </button>
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <p className="mb-2 text-sm font-semibold text-(--color-ink)">{title}</p>
      {children}
    </motion.div>
  );
}

export default function HeroValuation() {
  const [items, setItems] = useState<(Item & { categoryName: string })[]>([]);
  const [kind, setKind] = useState<KindKey | null>(null);
  const [body, setBody] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  // Phone check before the lead goes in: the same SMS code the sign-in page
  // uses. Verifying signs them in, so they can carry on and book.
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const { user, setTokens, setUser } = useAuthStore();

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/scrap-categories/`).then((r) => r.json()),
      fetch(`${API_BASE}/scrap-items/`).then((r) => r.json()),
    ])
      .then(([cats, list]: [Category[], Item[]]) => {
        const names = new Map(cats.map((c) => [c.id, c.name]));
        setItems(list.map((i) => ({ ...i, categoryName: names.get(i.category) ?? "" })));
      })
      .catch(() => setItems([]));
  }, []);

  // Each step narrows the last: kind -> body type -> brand -> model. Nothing
  // outside the current slice is ever offered.
  const kindDef = KINDS.find((k) => k.key === kind);
  const ofKind = useMemo(
    () => (kindDef ? items.filter((i) => i.categoryName === kindDef.category && kindDef.keep(bodyType(i.description))) : []),
    [items, kindDef],
  );
  const bodies = useMemo(() => byFrequency(ofKind.map((i) => bodyType(i.description))), [ofKind]);
  const ofBody = useMemo(
    () => (bodies.length === 1 ? ofKind : ofKind.filter((i) => bodyType(i.description) === body)),
    [ofKind, bodies, body],
  );
  const brands = useMemo(() => byFrequency(ofBody.map((i) => splitBrand(i.name).brand)), [ofBody]);
  const ofBrand = useMemo(
    () =>
      [...(brands.length === 1 ? ofBody : ofBody.filter((i) => splitBrand(i.name).brand === brand))].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    [ofBody, brands, brand],
  );
  const item = ofBrand.find((i) => i.id === itemId) ?? (ofBrand.length === 1 ? ofBrand[0] : undefined);

  // Steps with a single possible answer answer themselves.
  const bodyChosen = bodies.length === 1 || body !== null;
  const brandChosen = bodyChosen && (brands.length === 1 || brand !== null);

  const reset = (from: "kind" | "body" | "brand" | "item") => {
    if (from === "kind") setKind(null);
    if (from === "kind" || from === "body") setBody(null);
    if (from !== "item") setBrand(null);
    setItemId(null);
    setOtpSent(false);
    setCode("");
    setError("");
  };

  const post = async (path: string, body: object) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data.error || data.detail || data.phone_number?.[0] || data.phone?.[0];
      throw new Error(message || "Something went wrong. Please try again.");
    }
    return data;
  };

  const sendCode = async (digits: string) => {
    await post("/auth/request-otp/", { phone_number: digits });
    setOtpSent(true);
    setCode("");
    setResendIn(30);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) return setError("Enter a valid 10-digit mobile number");
    if (pincode && !/^\d{6}$/.test(pincode)) return setError("Enter a 6-digit pincode");
    if (otpSent && !/^\d{6}$/.test(code)) return setError("Enter the 6-digit code we sent you");
    setStatus("sending");
    setError("");
    try {
      // Already signed in with this number: it is verified, skip the SMS.
      const verified = user?.phone_number === digits;
      if (!verified && !otpSent) {
        await sendCode(digits);
        setStatus("idle");
        return;
      }
      if (!verified) {
        const auth = await post("/auth/verify-otp/", { phone_number: digits, code });
        setTokens({ access: auth.access, refresh: auth.refresh });
        setUser(auth.user);
      }
      await post("/leads/", { phone: digits, pincode, item: item?.name ?? kindDef?.label ?? "", source: "home_hero" });
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Couldn't send that. Please try again.");
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-7">
      <h2 className="text-center text-lg font-semibold text-(--color-ink) sm:text-xl">Get an instant valuation</h2>

      {status === "done" ? (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--color-bg-deep) text-(--color-primary)">
            <Check className="h-6 w-6" />
          </span>
          <p className="mt-3 font-semibold text-(--color-ink)">Thanks, we&apos;ll call you shortly</p>
          <p className="mt-1 text-sm text-(--color-ink-soft)">to confirm your offer and a free pickup slot.</p>
        </motion.div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-3">
          {!kindDef ? (
            <Step title="What are you selling?">
              <div className="grid grid-cols-2 gap-2">
                {KINDS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setKind(key)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-(--color-line) py-3 text-sm font-medium text-(--color-ink) transition-colors hover:border-(--color-primary) hover:bg-(--color-bg)"
                  >
                    <Icon className="h-4 w-4 text-(--color-primary)" /> {label}
                  </button>
                ))}
              </div>
            </Step>
          ) : (
            <Done label="Vehicle" value={kindDef.label} onChange={() => reset("kind")} />
          )}

          <AnimatePresence initial={false}>
            {kindDef && !items.length && (
              <p key="loading" className="text-center text-sm text-(--color-ink-soft)">
                <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> Loading models…
              </p>
            )}

            {kindDef && bodies.length > 1 &&
              (body ? (
                <Done key="body-done" label="Type" value={body} onChange={() => reset("body")} />
              ) : (
                <Step key="body" title="Which type?">
                  <div className="flex flex-wrap gap-2">
                    {bodies.map((b) => (
                      <Chip key={b} onClick={() => setBody(b)}>{b}</Chip>
                    ))}
                  </div>
                </Step>
              ))}

            {bodyChosen && brands.length > 1 &&
              (brand ? (
                <Done key="brand-done" label="Brand" value={brand} onChange={() => reset("brand")} />
              ) : (
                <Step key="brand" title="Which brand?">
                  <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto">
                    {brands.map((b) => (
                      <Chip key={b} onClick={() => setBrand(b)}>{b}</Chip>
                    ))}
                  </div>
                </Step>
              ))}

            {brandChosen && ofBrand.length > 1 &&
              (item ? (
                <Done key="model-done" label="Model" value={splitBrand(item.name).model} onChange={() => reset("item")} />
              ) : (
                <Step key="model" title="Which model?">
                  <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto">
                    {ofBrand.map((i) => (
                      <Chip key={i.id} onClick={() => setItemId(i.id)}>{splitBrand(i.name).model}</Chip>
                    ))}
                  </div>
                </Step>
              ))}

            {item && (
              <Step key="offer" title="">
                <div className="rounded-2xl bg-(--color-bg-deep) px-4 py-3 text-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-(--color-primary-dark)">
                    We pay for a {item.name}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-(--color-primary)">
                    {money(item.base_rate)}
                    {item.max_rate && <span className="text-(--color-ink-soft)"> – {money(item.max_rate)}</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-(--color-ink-soft)">Final price after a quick check at your door</p>
                </div>
                <div className={`mt-3 grid grid-cols-[1.4fr_1fr] gap-2 ${otpSent ? "hidden" : ""}`}>
                  <label className="flex items-center rounded-xl border border-(--color-line) px-3 focus-within:border-(--color-primary)">
                    <span className="mr-2 text-sm font-medium text-(--color-ink)">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoFocus
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Mobile number"
                      className="w-full bg-transparent py-3 text-sm outline-none"
                    />
                  </label>
                  <input
                    inputMode="numeric"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Pincode"
                    className="rounded-xl border border-(--color-line) px-3 py-3 text-sm outline-none focus:border-(--color-primary)"
                  />
                </div>
                {otpSent && (
                  <div className="mt-3">
                    <p className="text-center text-xs text-(--color-ink-soft)">
                      Code sent to +91 {phone}.{" "}
                      <button type="button" onClick={() => { setOtpSent(false); setCode(""); }} className="font-semibold text-(--color-primary) hover:underline">
                        Change number
                      </button>
                    </p>
                    <input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      autoFocus
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit code"
                      className="mt-2 w-full rounded-xl border border-(--color-line) py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-(--color-primary)"
                    />
                    <p className="mt-1.5 text-center text-xs text-(--color-ink-soft)">
                      {resendIn > 0 ? (
                        `Resend code in ${resendIn}s`
                      ) : (
                        <button
                          type="button"
                          onClick={() => sendCode(phone).catch((err) => setError(err.message))}
                          className="font-semibold text-(--color-primary) hover:underline"
                        >
                          Resend code
                        </button>
                      )}
                    </p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-accent) py-3.5 text-sm font-semibold text-(--color-ink) shadow-lg transition hover:brightness-95 disabled:opacity-60"
                >
                  {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{otpSent ? "Verify & get offer" : "Get my offer"} <ArrowRight className="h-4 w-4" /></>}
                </button>
              </Step>
            )}
          </AnimatePresence>

          {error && <p className="text-center text-xs font-medium text-red-600">{error}</p>}
        </form>
      )}
    </div>
  );
}
