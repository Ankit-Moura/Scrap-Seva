// app/book-pickup/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
  category: number;
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

/* ---------- Quantity stepper ---------- */
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
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F1EA] text-[#2B2B24] hover:bg-[#EBE6DA]"
      >
        <Icons.Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-14 text-center text-sm tabular-nums text-[#2B2B24]">
        {value} {unit}
      </span>
      <button
        onClick={() => onChange(+(value + step).toFixed(2))}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#228B57] text-white hover:bg-[#1c6f47]"
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

  const itemsByCategory = useMemo(() => {
    const map: Record<number, ScrapItem[]> = {};
    for (const item of items) {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    }
    return map;
  }, [items]);

  return (
    <div>
      <h1 className="font-serif text-[26px] leading-tight text-[#2B2B24]">
        What are you giving away today?
      </h1>
      <p className="mt-1.5 text-sm text-[#8A8375]">
        Pick what you have — we'll show you what it's worth as you go.
      </p>

      <div className="mt-6 space-y-3">
        {categories.map((cat) => {
          const catItems = itemsByCategory[cat.id] || [];
          const selectedInCat = catItems.filter((i) => selected[i.id] > 0).length;
          const isOpen = openCategory === cat.id;

          return (
            <div
              key={cat.id}
              className="overflow-hidden rounded-2xl border border-[#EBE6DA] bg-white"
            >
              <button
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                className="flex w-full items-center justify-between px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#228B57]/10">
                    <CategoryIcon name={cat.icon} className="h-4.5 w-4.5 text-[#228B57]" />
                  </div>
                  <span className="text-[15px] font-medium text-[#2B2B24]">{cat.name}</span>
                  {selectedInCat > 0 && (
                    <span className="rounded-full bg-[#228B57] px-2 py-0.5 text-[11px] font-medium text-white">
                      {selectedInCat}
                    </span>
                  )}
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <Icons.ChevronDown className="h-4 w-4 text-[#8A8375]" />
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
                    <div className="border-t border-[#EBE6DA] px-4">
                      {catItems.map((item) => {
                        const qty = selected[item.id] || 0;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 border-b border-[#F4F1EA] py-3 last:border-none"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm text-[#2B2B24]">{item.name}</p>
                              <p className="text-xs text-[#8A8375]">
                                ₹{item.base_rate}/{item.unit}
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
                                className="rounded-full border border-[#228B57] px-3 py-1.5 text-xs font-medium text-[#228B57] hover:bg-[#228B57]/5"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
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
      <h1 className="font-serif text-[26px] leading-tight text-[#2B2B24]">
        Here's what you'll get
      </h1>
      <p className="mt-1.5 text-sm text-[#8A8375]">
        A rough estimate — final weight is confirmed at pickup.
      </p>

      <div className="mt-6 rounded-2xl border border-[#EBE6DA] bg-white px-4">
        {selectedItems.map(({ item, quantity }) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-[#F4F1EA] py-3.5 last:border-none"
          >
            <div>
              <p className="text-sm text-[#2B2B24]">{item.name}</p>
              <p className="text-xs text-[#8A8375]">
                {quantity} {item.unit} × ₹{item.base_rate}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-[15px] text-[#2B2B24]">
                ₹{formatMoney(quantity * parseFloat(item.base_rate))}
              </span>
              <button onClick={() => onRemove(item.id)} className="text-[#B5AE9D] hover:text-red-500">
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
      <h1 className="font-serif text-[26px] leading-tight text-[#2B2B24]">Where & when?</h1>
      <p className="mt-1.5 text-sm text-[#8A8375]">
        A kabadiwala will arrive during your chosen window.
      </p>

      <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#8A8375]">
        Pickup address
      </h2>
      {addresses.length === 0 ? (
        <Link
          href="/profile"
          className="mt-2 block rounded-xl border border-dashed border-[#D8D2C2] px-4 py-5 text-center text-sm text-[#228B57]"
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
                  ? "border-[#228B57] bg-[#228B57]/5"
                  : "border-[#EBE6DA] bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize text-[#2B2B24]">{addr.label}</span>
                {addr.is_default && (
                  <span className="rounded-full bg-[#228B57]/10 px-2 py-0.5 text-[10px] font-medium text-[#228B57]">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-[#8A8375]">
                {addr.full_address}, {addr.city}
              </p>
            </button>
          ))}
        </div>
      )}

      <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#8A8375]">Day</h2>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`flex shrink-0 flex-col items-center rounded-xl border px-3.5 py-2.5 ${
              selectedDay === i ? "border-[#228B57] bg-[#228B57]/5" : "border-[#EBE6DA] bg-white"
            }`}
          >
            <span className="text-[11px] text-[#8A8375]">
              {d.toLocaleDateString("en-IN", { weekday: "short" })}
            </span>
            <span className="text-sm font-medium text-[#2B2B24]">{d.getDate()}</span>
          </button>
        ))}
      </div>

      <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#8A8375]">
        Time window
      </h2>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {SLOTS.map((slot) => (
          <button
            key={slot.key}
            onClick={() => setSelectedSlot(slot.key)}
            className={`rounded-xl border px-3 py-3 text-center ${
              selectedSlot === slot.key ? "border-[#228B57] bg-[#228B57]/5" : "border-[#EBE6DA] bg-white"
            }`}
          >
            <span className="block text-sm font-medium text-[#2B2B24]">{slot.label}</span>
            <span className="block text-[11px] text-[#8A8375]">{slot.time}</span>
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
      <h1 className="font-serif text-[26px] leading-tight text-[#2B2B24]">Confirm your pickup</h1>
      <p className="mt-1.5 text-sm text-[#8A8375]">Review before you send the request.</p>

      <div className="mt-6 rounded-2xl border border-[#EBE6DA] bg-white p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-[#8A8375]">Estimated payout</span>
          <span className="font-serif text-2xl text-[#228B57]">₹{formatMoney(total)}</span>
        </div>
        <p className="mt-1 text-xs text-[#B5AE9D]">
          {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} · confirmed on pickup
        </p>

        <div className="mt-4 border-t border-[#EBE6DA] pt-4">
          <div className="flex items-start gap-2.5">
            <Icons.MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8A8375]" />
            <div>
              <p className="text-sm text-[#2B2B24]">{address.full_address}</p>
              <p className="text-xs text-[#8A8375]">{address.city} - {address.pincode}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <Icons.Clock className="h-4 w-4 shrink-0 text-[#8A8375]" />
            <p className="text-sm text-[#2B2B24]">
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
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#228B57]"
      >
        <Icons.Check className="h-8 w-8 text-white" />
      </motion.div>
      <h1 className="mt-5 font-serif text-2xl text-[#2B2B24]">Pickup requested</h1>
      <p className="mt-1.5 max-w-xs text-sm text-[#8A8375]">
        We'll notify you once a kabadiwala accepts. Estimated payout: ₹{formatMoney(total)}.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => router.push("/pickups")}
          className="rounded-xl bg-[#228B57] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1c6f47]"
        >
          View my pickups
        </button>
        <button
          onClick={onBookAnother}
          className="rounded-xl px-5 py-2.5 text-sm font-medium text-[#8A8375] hover:text-[#2B2B24]"
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
      <main className="flex min-h-screen items-center justify-center bg-[#FAF8F3]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-[#228B57] border-t-transparent"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 pb-32 pt-8 sm:pt-14">
      <div className="mx-auto max-w-xl">
        {/* Progress dots */}
        {step !== "success" && (
          <div className="mb-6 flex gap-1.5">
            {stepOrder.map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= stepIndex ? "bg-[#228B57]" : "bg-[#EBE6DA]"
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

      {/* Sticky bottom bar */}
      <AnimatePresence>
        {step !== "success" && (selectedItems.length > 0 || step !== "items") && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 border-t border-[#EBE6DA] bg-white/95 px-4 py-3.5 backdrop-blur"
          >
            <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {step !== "items" && (
                  <button
                    onClick={goBack}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EBE6DA] text-[#8A8375]"
                  >
                    <Icons.ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                {selectedItems.length > 0 && step !== "confirm" && (
                  <div>
                    <p className="text-[11px] text-[#8A8375]">Estimated</p>
                    <p className="font-serif text-lg leading-none text-[#228B57]">
                      ₹{formatMoney(total)}
                    </p>
                  </div>
                )}
              </div>

              {step === "confirm" ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-[#228B57] py-3 text-sm font-medium text-white hover:bg-[#1c6f47] disabled:opacity-60"
                >
                  {submitting ? "Sending request..." : "Confirm pickup"}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  disabled={!canContinue}
                  className="rounded-xl bg-[#228B57] px-6 py-3 text-sm font-medium text-white hover:bg-[#1c6f47] disabled:opacity-40"
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