// app/book-pickup/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL

/* ---------- Types ---------- */
interface ScrapCategory {
  id: number;
  name: string;
  icon: string;
}
interface ScrapItem {
  id: string;
  name: string;
  unit: string;
  base_rate: string;
  max_rate: string | null;
  category: number;
  category_name?: string;
}
interface AddressItem {
  id: string;
  label: string;
  full_address: string;
  city: string;
  pincode: string;
  is_default: boolean;
}
interface SelectedItem {
  item: ScrapItem;
  quantity: number;
}

type Step = "items" | "review" | "logistics" | "confirm" | "success";

const SLOTS = [
  { key: "morning", label: "Morning", time: "9 AM – 12 PM", hour: 9 },
  { key: "afternoon", label: "Afternoon", time: "12 – 4 PM", hour: 13 },
  { key: "evening", label: "Evening", time: "4 – 7 PM", hour: 16 },
];

/* ---------- Helpers ---------- */
function toPascalCase(str: string) {
  return str.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}
function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as any)[toPascalCase(name)] || Icons.Package;
  return <Icon className={className} />;
}
function nextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });
}
function formatMoney(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
/** "₹33,600 – ₹43,000" for a vehicle model, "₹550" for everything else. The
 * low end is what totals use: it is what we pay at least. */
function priceText(item: ScrapItem, quantity = 1) {
  const low = `₹${formatMoney(quantity * parseFloat(item.base_rate))}`;
  return item.max_rate ? `${low} – ₹${formatMoney(quantity * parseFloat(item.max_rate))}` : low;
}

function QuantityStepper({
  value,
  unit,
  onChange,
}: {
  value: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const step = unit === "kg" ? 0.5 : 1;
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, +(value - step).toFixed(2)))}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-(--color-accent)/10 text-(--color-accent) hover:bg-(--color-accent)/20"
      >
        <Icons.Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-14 text-center text-sm tabular-nums text-(--color-ink)">
        {value} {unit}
      </span>
      <button
        onClick={() => onChange(+(value + step).toFixed(2))}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-(--color-accent) text-(--color-ink) hover:brightness-90"
      >
        <Icons.Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ---------- Step 1: Item picker ---------- */
function ItemPickerStep({
  categories,
  items,
  selected,
  setSelected,
}: {
  categories: ScrapCategory[];
  items: ScrapItem[];
  selected: Record<string, number>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const [openCategory, setOpenCategory] = useState<number | null>(categories[0]?.id ?? null);
  const [query, setQuery] = useState("");

  // Typing searches every category at once: Cars & SUVs alone is 250 lines.
  const matches = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return null;
    return items.filter((i) => {
      const name = i.name.toLowerCase();
      return words.every((w) => name.includes(w));
    });
  }, [items, query]);

  const itemsByCategory = useMemo(() => {
    const map: Record<number, ScrapItem[]> = {};
    for (const item of items) {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    }
    return map;
  }, [items]);

  const renderRow = (item: ScrapItem) => {
    const qty = selected[item.id] || 0;
    return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 border-b border-(--color-bg-deep) py-3 last:border-none"
                          >
                            <div className="min-w-0">
                              <p className="text-sm leading-snug text-(--color-ink)">{item.name}</p>
                              <p className="text-xs text-(--color-ink-soft)">
                                {priceText(item)}/{item.unit}
                              </p>
                            </div>

                            {qty > 0 ? (
                              <QuantityStepper
                                value={qty}
                                unit={item.unit}
                                onChange={(v) =>
                                  setSelected((prev) => {
                                    const next = { ...prev };
                                    if (v <= 0) delete next[item.id];
                                    else next[item.id] = v;
                                    return next;
                                  })
                                }
                              />
                            ) : (
                              <button
                                onClick={() =>
                                  setSelected((prev) => ({
                                    ...prev,
                                    [item.id]: item.unit === "kg" ? 1 : 1,
                                  }))
                                }
                                className="rounded-full border border-(--color-accent) px-3 py-1.5 text-xs font-medium text-(--color-accent) hover:bg-(--color-accent)/10"
                              >
                                Add
                              </button>
                            )}
                          </div>
    );
  };

  return (
    <div>
      <h1 className="font-serif text-[26px] leading-tight text-(--color-ink)">
        What are you giving away today?
      </h1>
      <p className="mt-1.5 text-sm text-(--color-ink-soft)">
        Pick what you have — we'll show you what it's worth as you go.
      </p>

      <div className="relative mt-6">
        <Icons.Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-ink-soft)" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search — e.g. Swift, Activa, split AC"
          className="w-full rounded-2xl border border-(--color-line) bg-(--color-bg-card) py-3 pl-10 pr-4 text-sm text-(--color-ink) outline-none placeholder:text-(--color-ink-soft)/70 focus:border-(--color-primary)"
        />
      </div>

      {matches ? (
        <div className="mt-3 rounded-2xl border border-(--color-line) bg-(--color-bg-card) px-4">
          {matches.length ? (
            matches.slice(0, 60).map(renderRow)
          ) : (
            <p className="py-6 text-center text-sm text-(--color-ink-soft)">
              Nothing matches &ldquo;{query}&rdquo;. Try the make or model, or browse below.
            </p>
          )}
        </div>
      ) : (
      <div className="mt-3 space-y-3">
        {categories.map((cat) => {
          const catItems = itemsByCategory[cat.id] || [];
          const selectedInCat = catItems.filter((i) => selected[i.id] > 0).length;
          const isOpen = openCategory === cat.id;

          return (
            <div
              key={cat.id}
              className="overflow-hidden rounded-2xl border border-(--color-line) bg-(--color-bg-card)"
            >
              <button
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                className="flex w-full items-center justify-between px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--color-primary)/10">
                    <CategoryIcon name={cat.icon} className="h-4.5 w-4.5 text-(--color-primary)" />
                  </div>
                  <span className="text-[15px] font-medium text-(--color-ink)">{cat.name}</span>
                  {selectedInCat > 0 && (
                    <span className="rounded-full bg-(--color-primary) px-2 py-0.5 text-[11px] font-medium text-white">
                      {selectedInCat}
                    </span>
                  )}
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <Icons.ChevronDown className="h-4 w-4 text-(--color-accent)" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-(--color-line) px-4">
                      {catItems.map(renderRow)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

/* ---------- Step 2: Review ---------- */
function ReviewStep({
  selectedItems,
  onRemove,
}: {
  selectedItems: SelectedItem[];
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <h1 className="font-serif text-[26px] leading-tight text-(--color-ink)">
        Here's what you'll get
      </h1>
      <p className="mt-1.5 text-sm text-(--color-ink-soft)">
        A starting estimate — the final amount is agreed with you at pickup.
      </p>

      <div className="mt-6 rounded-2xl border border-(--color-line) bg-(--color-bg-card) px-4">
        {selectedItems.map(({ item, quantity }) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-(--color-bg-deep) py-3.5 last:border-none"
          >
            <div>
              <p className="text-sm text-(--color-ink)">{item.name}</p>
              <p className="text-xs text-(--color-ink-soft)">
                {quantity} {item.unit} × {priceText(item)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-[15px] text-(--color-ink)">
                {priceText(item, quantity)}
              </span>
              <button onClick={() => onRemove(item.id)} className="text-(--color-accent) hover:text-red-500">
                <Icons.X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Step 3: Logistics ---------- */
function LogisticsStep({
  addresses,
  selectedAddress,
  setSelectedAddress,
  selectedDay,
  setSelectedDay,
  selectedSlot,
  setSelectedSlot,
}: {
  addresses: AddressItem[];
  selectedAddress: string | null;
  setSelectedAddress: (id: string) => void;
  selectedDay: number;
  setSelectedDay: (i: number) => void;
  selectedSlot: string;
  setSelectedSlot: (s: string) => void;
}) {
  const days = useMemo(() => nextDays(5), []);

  return (
    <div>
      <h1 className="font-serif text-[26px] leading-tight text-(--color-ink)">Where & when?</h1>
      <p className="mt-1.5 text-sm text-(--color-ink-soft)">
        A kabadiwala will arrive during your chosen window.
      </p>

      <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-(--color-ink-soft)">
        Pickup address
      </h2>
      {addresses.length === 0 ? (
        <Link
          href="/profile"
          className="mt-2 block rounded-xl border border-dashed border-(--color-accent)/40 px-4 py-5 text-center text-sm text-(--color-accent)"
        >
          Add an address in your profile to continue →
        </Link>
      ) : (
        <div className="mt-2 space-y-2">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => setSelectedAddress(addr.id)}
              className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                selectedAddress === addr.id
                  ? "border-(--color-accent) bg-(--color-accent)/10"
                  : "border-(--color-line) bg-(--color-bg-card)"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize text-(--color-ink)">{addr.label}</span>
                {addr.is_default && (
                  <span className="rounded-full bg-(--color-primary)/10 px-2 py-0.5 text-[10px] font-medium text-(--color-primary)">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-(--color-ink-soft)">
                {addr.full_address}, {addr.city}
              </p>
            </button>
          ))}
        </div>
      )}

      <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-(--color-ink-soft)">Day</h2>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`flex shrink-0 flex-col items-center rounded-xl border px-3.5 py-2.5 ${
              selectedDay === i ? "border-(--color-accent) bg-(--color-accent)/10" : "border-(--color-line) bg-(--color-bg-card)"
            }`}
          >
            <span className="text-[11px] text-(--color-ink-soft)">
              {d.toLocaleDateString("en-IN", { weekday: "short" })}
            </span>
            <span className="text-sm font-medium text-(--color-ink)">{d.getDate()}</span>
          </button>
        ))}
      </div>

      <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-(--color-ink-soft)">
        Time window
      </h2>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {SLOTS.map((slot) => (
          <button
            key={slot.key}
            onClick={() => setSelectedSlot(slot.key)}
            className={`rounded-xl border px-3 py-3 text-center ${
              selectedSlot === slot.key ? "border-(--color-accent) bg-(--color-accent)/10" : "border-(--color-line) bg-(--color-bg-card)"
            }`}
          >
            <span className="block text-sm font-medium text-(--color-ink)">{slot.label}</span>
            <span className="block text-[11px] text-(--color-ink-soft)">{slot.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Step 4: Confirm ---------- */
function ConfirmStep({
  selectedItems,
  total,
  address,
  day,
  slot,
}: {
  selectedItems: SelectedItem[];
  total: number;
  address: AddressItem;
  day: Date;
  slot: (typeof SLOTS)[number];
}) {
  return (
    <div>
      <h1 className="font-serif text-[26px] leading-tight text-(--color-ink)">Confirm your pickup</h1>
      <p className="mt-1.5 text-sm text-(--color-ink-soft)">Review before you send the request.</p>

      <div className="mt-6 rounded-2xl border border-(--color-line) bg-(--color-bg-card) p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-(--color-ink-soft)">Estimated payout</span>
          <span className="font-serif text-2xl text-(--color-primary)">₹{formatMoney(total)}</span>
        </div>
        <p className="mt-1 text-xs text-(--color-ink-soft)">
          {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} · confirmed on pickup
        </p>

        <div className="mt-4 border-t border-(--color-line) pt-4">
          <div className="flex items-start gap-2.5">
            <Icons.MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--color-ink-soft)" />
            <div>
              <p className="text-sm text-(--color-ink)">{address.full_address}</p>
              <p className="text-xs text-(--color-ink-soft)">{address.city} - {address.pincode}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <Icons.Clock className="h-4 w-4 shrink-0 text-(--color-ink-soft)" />
            <p className="text-sm text-(--color-ink)">
              {day.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}, {slot.label} ({slot.time})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// SuccessStep — accept an onBookAnother callback instead of using router directly
function SuccessStep({ total, onBookAnother }: { total: number; onBookAnother: () => void }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-primary)"
      >
        <Icons.Check className="h-8 w-8 text-white" />
      </motion.div>
      <h1 className="mt-5 font-serif text-2xl text-(--color-ink)">Pickup requested</h1>
      <p className="mt-1.5 max-w-xs text-sm text-(--color-ink-soft)">
        We'll notify you once a kabadiwala accepts. Estimated payout: ₹{formatMoney(total)}.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => router.push("/pickups")}
          className="rounded-xl bg-(--color-accent) px-5 py-2.5 text-sm font-medium text-(--color-ink) hover:brightness-90"
        >
          View my pickups
        </button>
        <button
          onClick={onBookAnother}
          className="rounded-xl px-5 py-2.5 text-sm font-medium text-(--color-ink-soft) hover:text-(--color-accent)"
        >
          Book another
        </button>
      </div>
    </div>
  );
}
/* ---------- Main page ---------- */
export default function BookPickupPage() {
  const { tokens } = useAuthStore();
  const headers = { Authorization: `Bearer ${tokens?.access}` };

  const [step, setStep] = useState<Step>("items");
  const [categories, setCategories] = useState<ScrapCategory[]>([]);
  const [items, setItems] = useState<ScrapItem[]>([]);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("morning");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, itemRes, addrRes] = await Promise.all([
          axios.get(`${API_BASE}/scrap-categories/`),
          axios.get(`${API_BASE}/scrap-items/`),
          axios.get(`${API_BASE}/addresses/`, { headers }),
        ]);
        setCategories(catRes.data);
        setItems(itemRes.data.results || itemRes.data);
        setAddresses(addrRes.data);
        const def = addrRes.data.find((a: AddressItem) => a.is_default);
        if (def) setSelectedAddress(def.id);
      } catch {
        setError("Couldn't load pickup details. Try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


    const resetFlow = () => {
    setStep("items");
    setSelected({});
    setSelectedAddress(addresses.find((a) => a.is_default)?.id ?? null);
    setSelectedDay(0);
    setSelectedSlot("morning");
    setError("");
  };

  const selectedItems: SelectedItem[] = useMemo(() => {
    return Object.entries(selected)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ item: items.find((i) => i.id === id)!, quantity: qty }))
      .filter((s) => s.item);
  }, [selected, items]);

  const total = useMemo(
    () => selectedItems.reduce((sum, s) => sum + s.quantity * parseFloat(s.item.base_rate), 0),
    [selectedItems]
  );

  const days = useMemo(() => nextDays(5), []);
  const currentSlot = SLOTS.find((s) => s.key === selectedSlot)!;
  const currentAddress = addresses.find((a) => a.id === selectedAddress);

  const stepOrder: Step[] = ["items", "review", "logistics", "confirm"];
  const stepIndex = stepOrder.indexOf(step);

  const goNext = () => {
    if (step === "items") setStep("review");
    else if (step === "review") setStep("logistics");
    else if (step === "logistics") setStep("confirm");
  };
  const goBack = () => {
    if (step === "review") setStep("items");
    else if (step === "logistics") setStep("review");
    else if (step === "confirm") setStep("logistics");
  };

  const canContinue =
    (step === "items" && selectedItems.length > 0) ||
    (step === "review" && selectedItems.length > 0) ||
    (step === "logistics" && !!selectedAddress);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    const scheduledDate = days[selectedDay];
    scheduledDate.setHours(currentSlot.hour, 0, 0, 0);

    try {
      await axios.post(
        `${API_BASE}/pickup-requests/`,
        {
          address: selectedAddress,
          scheduled_slot: scheduledDate.toISOString(),
          items_input: selectedItems.map((s) => ({
            item: s.item.id,
            estimated_weight: s.quantity,
          })),
        },
        { headers }
      );
      setStep("success");
    } catch (err: any) {
      setError(err.response?.data?.non_field_errors?.[0] || "Couldn't submit your request. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-(--color-bg)">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-(--color-accent) border-t-transparent"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--color-bg) px-4 pb-32 pt-8 sm:pt-14">
      <div className="mx-auto max-w-xl">
        {step !== "success" && (
          <div className="mb-6 flex gap-1.5">
            {stepOrder.map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= stepIndex ? "bg-(--color-primary-light)" : "bg-(--color-line)"
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {step === "items" && (
              <ItemPickerStep
                categories={categories}
                items={items}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {step === "review" && (
              <ReviewStep
                selectedItems={selectedItems}
                onRemove={(id) =>
                  setSelected((prev) => {
                    const next = { ...prev };
                    delete next[id];
                    return next;
                  })
                }
              />
            )}
            {step === "logistics" && (
              <LogisticsStep
                addresses={addresses}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
              />
            )}
            {step === "confirm" && currentAddress && (
              <ConfirmStep
                selectedItems={selectedItems}
                total={total}
                address={currentAddress}
                day={days[selectedDay]}
                slot={currentSlot}
              />
            )}
            {step === "success" && <SuccessStep total={total} onBookAnother={resetFlow} />}
          </motion.div>
        </AnimatePresence>

        {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
      </div>

      <AnimatePresence>
        {step !== "success" && (selectedItems.length > 0 || step !== "items") && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 border-t border-(--color-line) bg-(--color-bg-card)/95 px-4 py-3.5 backdrop-blur"
          >
            <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {step !== "items" && (
                  <button
                    onClick={goBack}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-(--color-line) text-(--color-accent)"
                  >
                    <Icons.ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                {selectedItems.length > 0 && step !== "confirm" && (
                  <div>
                    <p className="text-[11px] text-(--color-ink-soft)">Estimated</p>
                    <p className="font-serif text-lg leading-none text-(--color-ink)">
                      ₹{formatMoney(total)}
                    </p>
                  </div>
                )}
              </div>

              {step === "confirm" ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-(--color-accent) py-3 text-sm font-medium text-(--color-ink) hover:brightness-90 disabled:opacity-60"
                >
                  {submitting ? "Sending request..." : "Confirm pickup"}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  disabled={!canContinue}
                  className="rounded-xl bg-(--color-accent) px-6 py-3 text-sm font-medium text-(--color-ink) hover:brightness-90 disabled:opacity-40"
                >
                  Continue
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}