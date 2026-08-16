// app/pickups/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL 
/* ---------- Types ---------- */
interface PickupItem {
  id: string;
  item_name: string;
  category_name: string;
  unit: string;
  estimated_weight: string | null;
  actual_weight: string | null;
  rate_applied: string | null;
}
interface PickupRequest {
  id: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  scheduled_slot: string | null;
  cancelled_reason: string;
  items: PickupItem[];
  created_at: string;
  address: string;
}

type FilterTab = "active" | "completed" | "cancelled";
type SlotKey = "morning" | "afternoon" | "evening";

/* ---------- Slot config (IST) ---------- */
const SLOT_DEFS: Record<SlotKey, { label: string; startHour: number; endHour: number }> = {
  morning: { label: "9 AM – 12 PM", startHour: 9, endHour: 12 },
  afternoon: { label: "1 PM – 4 PM", startHour: 13, endHour: 16 },
  evening: { label: "5 PM – 9 PM", startHour: 17, endHour: 21 },
};
const SLOT_ORDER: SlotKey[] = ["morning", "afternoon", "evening"];

// Assumes the browser is running in IST (true for the target India user base).
// If that ever stops holding, compute "now" via a proper IST-aware library instead.
function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

// Disable a slot if its start time has already arrived/passed today.
function isSlotDisabled(date: Date, slotKey: SlotKey) {
  const now = new Date();
  if (!isSameDay(date, now)) return false;
  return now.getHours() >= SLOT_DEFS[slotKey].startHour;
}

// Build the UTC ISO string for a chosen date + slot, anchored to IST (+05:30).
function slotToUTCISOString(date: Date, slotKey: SlotKey) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hour = String(SLOT_DEFS[slotKey].startHour).padStart(2, "0");
  return new Date(`${y}-${m}-${d}T${hour}:00:00+05:30`).toISOString();
}

/* ---------- Status config ---------- */
const STATUS_CONFIG: Record<
  PickupRequest["status"],
  {
    label: string;
    color: string;
    bg: string;
    icon: keyof typeof Icons;
  }
> = {
  pending: {
    label: "Awaiting pickup partner",
    color: "#B87A1A",
    bg: "#E8A33D1A",
    icon: "Clock",
  },
  accepted: {
    label: "Confirmed",
    color: "#228B57",
    bg: "#228B571A",
    icon: "CheckCircle2",
  },
  in_progress: {
    label: "On the way",
    color: "#228B57",
    bg: "#228B571A",
    icon: "Truck",
  },
  completed: {
    label: "Completed",
    color: "#5B6355",
    bg: "#F4F1EA",
    icon: "PackageCheck",
  },
  cancelled: {
    label: "Cancelled",
    color: "#B5AE9D",
    bg: "#F4F1EA",
    icon: "XCircle",
  },
};

function formatDate(iso: string | null) {
  if (!iso) return "No slot chosen";
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  }) + " · " + new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

function estimatedTotal(items: PickupItem[]) {
  return items.reduce((sum, i) => {
    const weight = parseFloat(i.actual_weight ?? i.estimated_weight ?? "0");
    const rate = parseFloat(i.rate_applied ?? "0");
    return sum + weight * rate;
  }, 0);
}

/* ---------- Empty state ---------- */
function EmptyState({ tab }: { tab: FilterTab }) {
  const router = useRouter();
  const copy = {
    active: {
      title: "No pickups yet",
      body: "Book your first pickup and see it show up here.",
      cta: true,
    },
    completed: { title: "Nothing completed yet", body: "Finished pickups will appear here.", cta: false },
    cancelled: { title: "No cancelled pickups", body: "Cancelled requests will show up here.", cta: false },
  }[tab];

  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#D8D2C2] px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#228B57]/10">
        <Icons.PackageSearch className="h-5 w-5 text-[#228B57]" />
      </div>
      <p className="mt-4 text-sm font-medium text-[#2B2B24]">{copy.title}</p>
      <p className="mt-1 max-w-xs text-sm text-[#8A8375]">{copy.body}</p>
      {copy.cta && (
        <button
          onClick={() => router.push("/book-pickup")}
          className="mt-4 rounded-xl bg-[#228B57] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1c6f47]"
        >
          Book a pickup
        </button>
      )}
    </div>
  );
}

/* ---------- Reschedule panel ---------- */
function ReschedulePanel({
  onConfirm,
  onCancel,
  saving,
}: {
  onConfirm: (iso: string) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const dates = useMemo(() => getAvailableDates(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState<SlotKey | null>(null);

  const handleConfirm = () => {
    if (!selectedSlot) return;
    onConfirm(slotToUTCISOString(selectedDate, selectedSlot));
  };

  return (
    <div className="mt-3 rounded-xl bg-[#F4F1EA] p-3">
      <p className="mb-2 text-xs font-medium text-[#5B6355]">Pick a new date</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {dates.map((d) => {
          const active = isSameDay(d, selectedDate);
          return (
            <button
              key={d.toDateString()}
              onClick={() => {
                setSelectedDate(d);
                setSelectedSlot(null);
              }}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${
                active ? "bg-[#228B57] text-white" : "bg-white text-[#2B2B24] border border-[#EBE6DA]"
              }`}
            >
              {d.toLocaleDateString("en-IN", { weekday: "short" })}
              <br />
              {d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </button>
          );
        })}
      </div>

      <p className="mb-2 mt-3 text-xs font-medium text-[#5B6355]">Pick a time slot</p>
      <div className="flex flex-col gap-1.5">
        {SLOT_ORDER.map((key) => {
          const disabled = isSlotDisabled(selectedDate, key);
          const active = selectedSlot === key;
          return (
            <button
              key={key}
              disabled={disabled}
              onClick={() => setSelectedSlot(key)}
              className={`rounded-lg px-3 py-2 text-left text-xs font-medium ${
                disabled
                  ? "cursor-not-allowed bg-white text-[#D8D2C2] border border-[#EBE6DA]"
                  : active
                  ? "bg-[#228B57] text-white"
                  : "bg-white text-[#2B2B24] border border-[#EBE6DA]"
              }`}
            >
              {SLOT_DEFS[key].label}
              {disabled && <span className="ml-1 text-[10px]">(passed)</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button onClick={onCancel} className="text-xs text-[#8A8375]">
          Never mind
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedSlot || saving}
          className="rounded-lg bg-[#228B57] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Confirm slot"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Pickup card ---------- */
function PickupCard({
  pickup,
  onCancel,
  onReschedule,
}: {
  pickup: PickupRequest;
  onCancel: (id: string, reason: string) => Promise<void>;
  onReschedule: (id: string, isoUTC: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);

  const config = STATUS_CONFIG[pickup.status];
  const StatusIcon = Icons[config.icon] as React.ElementType;
  const total = estimatedTotal(pickup.items);
  const canCancel = pickup.status === "pending" || pickup.status === "accepted";
  const canReschedule = pickup.status === "pending" || pickup.status === "accepted";

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await onCancel(pickup.id, "Cancelled by customer");
    } finally {
      setCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  const handleReschedule = async (iso: string) => {
    setRescheduling(true);
    try {
      await onReschedule(pickup.id, iso);
      setShowReschedule(false);
    } finally {
      setRescheduling(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-2xl border border-[#EBE6DA] bg-white"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{ color: config.color, backgroundColor: config.bg }}
            >
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </span>
          </div>
          <p className="mt-1.5 truncate text-sm text-[#2B2B24]">
            {pickup.items.length} item{pickup.items.length !== 1 ? "s" : ""} ·{" "}
            {pickup.items.slice(0, 2).map((i) => i.item_name).join(", ")}
            {pickup.items.length > 2 && ` +${pickup.items.length - 2} more`}
          </p>
          <p className="mt-0.5 text-xs text-[#8A8375]">{formatDate(pickup.scheduled_slot)}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="font-serif text-lg text-[#228B57]">
            ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <Icons.ChevronDown className="h-4 w-4 text-[#8A8375]" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[#EBE6DA]"
          >
            <div className="px-4 py-3">
              {pickup.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-[#F4F1EA] py-2.5 last:border-none"
                >
                  <div>
                    <p className="text-sm text-[#2B2B24]">{item.item_name}</p>
                    <p className="text-xs text-[#8A8375]">{item.category_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#2B2B24]">
                      {item.actual_weight ?? item.estimated_weight ?? "—"} {item.unit}
                    </p>
                    {!item.actual_weight && (
                      <p className="text-[11px] text-[#B5AE9D]">estimated</p>
                    )}
                  </div>
                </div>
              ))}

              {pickup.status === "cancelled" && pickup.cancelled_reason && (
                <p className="mt-2 rounded-lg bg-[#F4F1EA] px-3 py-2 text-xs text-[#8A8375]">
                  Reason: {pickup.cancelled_reason}
                </p>
              )}

              {(canCancel || canReschedule) && !showReschedule && (
                <div className="mt-3 flex items-center gap-4">
                  {canReschedule && (
                    <button
                      onClick={() => setShowReschedule(true)}
                      className="text-xs font-medium text-[#228B57] hover:underline"
                    >
                      Change slot
                    </button>
                  )}
                  {canCancel &&
                    (showCancelConfirm ? (
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5">
                        <span className="flex-1 text-xs text-red-700">Cancel this pickup?</span>
                        <button
                          onClick={handleCancel}
                          disabled={cancelling}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          {cancelling ? "..." : "Yes, cancel"}
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(false)}
                          className="text-xs text-[#8A8375]"
                        >
                          Keep it
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowCancelConfirm(true)}
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        Cancel pickup
                      </button>
                    ))}
                </div>
              )}

              {showReschedule && (
                <ReschedulePanel
                  onConfirm={handleReschedule}
                  onCancel={() => setShowReschedule(false)}
                  saving={rescheduling}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- Page ---------- */
export default function MyPickupsPage() {
  const { tokens } = useAuthStore();
  const headers = { Authorization: `Bearer ${tokens?.access}` };
  const router = useRouter();

  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<FilterTab>("active");

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const res = await axios.get(`${API_BASE}/pickup-requests/`, { headers });
        setPickups(res.data);
      } catch {
        setError("Couldn't load your pickups. Try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPickups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (id: string, reason: string) => {
    const res = await axios.patch(
      `${API_BASE}/pickup-requests/${id}/cancel/`,
      { reason },
      { headers }
    );
    setPickups((prev) => prev.map((p) => (p.id === id ? res.data : p)));
  };

  const handleReschedule = async (id: string, isoUTC: string) => {
    const res = await axios.patch(
      `${API_BASE}/pickup-requests/${id}/`,
      { scheduled_slot: isoUTC },
      { headers }
    );
    setPickups((prev) => prev.map((p) => (p.id === id ? res.data : p)));
  };

  const filtered = useMemo(() => {
    return pickups
      .filter((p) => {
        if (tab === "active") return ["pending", "accepted", "in_progress"].includes(p.status);
        if (tab === "completed") return p.status === "completed";
        return p.status === "cancelled";
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [pickups, tab]);

  const counts = useMemo(
    () => ({
      active: pickups.filter((p) => ["pending", "accepted", "in_progress"].includes(p.status)).length,
      completed: pickups.filter((p) => p.status === "completed").length,
      cancelled: pickups.filter((p) => p.status === "cancelled").length,
    }),
    [pickups]
  );

  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[28px] leading-tight text-[#2B2B24]">My pickups</h1>
            <p className="mt-1 text-sm text-[#8A8375]">Track and manage your requests</p>
          </div>
          <button
            onClick={() => router.push("/book-pickup")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#228B57] text-white hover:bg-[#1c6f47]"
          >
            <Icons.Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-1 rounded-xl bg-[#F0ECE1] p-1">
          {(["active", "completed", "cancelled"] as FilterTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? "text-[#2B2B24]" : "text-[#8A8375]"
              }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">
                {t} {counts[t] > 0 && `(${counts[t]})`}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-7 w-7 rounded-full border-2 border-[#228B57] border-t-transparent"
            />
          </div>
        ) : error ? (
          <p className="py-10 text-center text-sm text-[#8A8375]">{error}</p>
        ) : filtered.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((pickup) => (
                <PickupCard
                  key={pickup.id}
                  pickup={pickup}
                  onCancel={handleCancel}
                  onReschedule={handleReschedule}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}