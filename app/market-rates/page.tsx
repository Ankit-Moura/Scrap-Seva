// app/market-rates/page.tsx
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import axios from "axios";
import * as LucideIcons from "lucide-react";
import { Package, Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL 
interface ScrapCategory {
  id: number;
  name: string;
  icon: string | null;
  is_active: boolean;
}

interface ScrapItem {
  id: number;
  category: number;
  category_name: string;
  name: string;
  unit: string;
  base_rate: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type Ordering = "name" | "-name" | "base_rate" | "-base_rate" | "created_at" | "-created_at";

/* ---------- Icon resolution ---------- */
function toPascalCase(str: string) {
  return str
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function getLucideIcon(name: string | null) {
  if (!name) return Package;
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<any>>)[toPascalCase(name)];
  return Icon || Package;
}

/* ---------- Animated counter ---------- */
function RateCount({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(2));
  const [display, setDisplay] = useState("0.00");

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
    const unsub = rounded.on("change", setDisplay);
    return () => {
      controls.stop();
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display}</>;
}

/* ---------- Rate card (grid item on desktop, row on mobile) ---------- */
function RateCard({ item, iconName, index }: { item: ScrapItem; iconName: string | null; index: number }) {
  const Icon = getLucideIcon(iconName);
  const rate = parseFloat(item.base_rate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: Math.min(index, 10) * 0.03, duration: 0.25, ease: "easeOut" }}
      className="flex items-start justify-between gap-3 rounded-xl border border-[#EBE6DA] bg-white p-3.5 transition-colors hover:border-[#228B57]/40 sm:p-4"
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#228B57]/10 sm:h-11 sm:w-11">
          <Icon className="h-[18px] w-[18px] text-[#228B57] sm:h-5 sm:w-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="break-words text-sm font-medium leading-snug text-[#2B2B24] sm:text-[15px]">{item.name}</p>
          <p className="mt-0.5 text-xs text-[#8A8375]">
            {item.category_name} · /{item.unit}
          </p>
        </div>
      </div>

      <p className="mt-0.5 shrink-0 whitespace-nowrap font-serif text-lg tabular-nums text-[#2B2B24] sm:text-xl">
        ₹<RateCount value={isNaN(rate) ? 0 : rate} />
      </p>
    </motion.div>
  );
}

/* ---------- Category button (shared between sidebar + mobile drawer) ---------- */
function CategoryButton({
  category,
  active,
  onClick,
}: {
  category: ScrapCategory | { id: null; name: "All items"; icon: null };
  active: boolean;
  onClick: () => void;
}) {
  const Icon = getLucideIcon(category.icon);
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        active ? "bg-[#228B57] text-white" : "text-[#4A4638] hover:bg-[#F1EEE4]"
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span className="leading-snug">{category.name}</span>
    </button>
  );
}

export default function MarketRatesPage() {
  const [categories, setCategories] = useState<ScrapCategory[]>([]);
  const [items, setItems] = useState<ScrapItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [ordering, setOrdering] = useState<Ordering>("-base_rate");
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/scrap-categories/`)
      .then((res) => {
        const data: ScrapCategory[] = res.data.results ?? res.data;
        setCategories(data.filter((c) => c.is_active));
      })
      .catch(() => {});
  }, []);

  const fetchItems = useCallback(async () => {
    setLoadingItems(true);
    setError("");
    try {
      const params: Record<string, string> = { ordering };
      if (activeCategory) params.category = String(activeCategory);
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await axios.get(`${API_BASE}/scrap-items/`, { params });
      setItems(res.data.results ?? res.data);
    } catch {
      setError("Couldn't load today's rates. Try again in a moment.");
    } finally {
      setLoadingItems(false);
    }
  }, [activeCategory, debouncedSearch, ordering]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const iconByCategory = useMemo(() => {
    const map = new Map<number, string | null>();
    categories.forEach((c) => map.set(c.id, c.icon));
    return map;
  }, [categories]);

  const activeCategoryName = categories.find((c) => c.id === activeCategory)?.name ?? "All items";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const orderingOptions: { value: Ordering; label: string }[] = [
    { value: "-base_rate", label: "Rate: high to low" },
    { value: "base_rate", label: "Rate: low to high" },
    { value: "name", label: "Name: A–Z" },
    { value: "-name", label: "Name: Z–A" },
    { value: "-created_at", label: "Newest first" },
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="h-2 w-2 rounded-full bg-[#228B57]"
              />
              <span className="text-xs font-medium uppercase tracking-wide text-[#228B57]">
                Today's rates
              </span>
            </div>
            <h1 className="mt-2 font-serif text-2xl leading-tight text-[#2B2B24] sm:text-[32px]">
              Market rates
            </h1>
            <p className="mt-1 text-sm text-[#8A8375]">{today}</p>
          </div>

          {/* Search + sort — full width on mobile, inline on desktop */}
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64 sm:flex-none">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B5AE9D]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search an item..."
                className="w-full rounded-xl border border-[#D8D2C2] bg-white py-2.5 pl-9 pr-3 text-sm text-[#2B2B24] outline-none placeholder:text-[#B5AE9D] focus:border-[#228B57] focus:ring-2 focus:ring-[#228B57]/20"
              />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#D8D2C2] bg-white px-3 py-2.5 text-sm text-[#2B2B24] sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            {/* Desktop sort */}
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value as Ordering)}
              className="hidden rounded-xl border border-[#D8D2C2] bg-white px-3 py-2.5 text-sm text-[#2B2B24] outline-none focus:border-[#228B57] focus:ring-2 focus:ring-[#228B57]/20 sm:block"
            >
              {orderingOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr] lg:gap-8">
          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-2xl border border-[#EBE6DA] bg-white p-3">
              <p className="px-3 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-[#B5AE9D]">
                Categories
              </p>
              <div className="flex flex-col gap-0.5">
                <CategoryButton
                  category={{ id: null, name: "All items", icon: null }}
                  active={activeCategory === null}
                  onClick={() => setActiveCategory(null)}
                />
                {categories.map((c) => (
                  <CategoryButton
                    key={c.id}
                    category={c}
                    active={activeCategory === c.id}
                    onClick={() => setActiveCategory((prev) => (prev === c.id ? null : c.id))}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile category chips */}
          {categories.length > 0 && (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  activeCategory === null
                    ? "border-[#228B57] bg-[#228B57] text-white"
                    : "border-[#D8D2C2] bg-white text-[#2B2B24]"
                }`}
              >
                All
              </button>
              {categories.map((c) => {
                const Icon = getLucideIcon(c.icon);
                const active = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory((prev) => (prev === c.id ? null : c.id))}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                      active
                        ? "border-[#228B57] bg-[#228B57] text-white"
                        : "border-[#D8D2C2] bg-white text-[#2B2B24]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {c.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Content */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-[#8A8375]">
                {activeCategoryName} · {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>

            {loadingItems ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[68px] animate-pulse rounded-xl bg-[#EBE6DA]/60 sm:h-[76px]" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-[#EBE6DA] bg-white py-16 text-center">
                <p className="text-sm text-[#8A8375]">{error}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-[#EBE6DA] bg-white py-16 text-center">
                <p className="text-sm text-[#8A8375]">No items match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <RateCard
                      key={item.id}
                      item={item}
                      iconName={iconByCategory.get(item.category) ?? null}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#B5AE9D]">
          Rates may vary slightly at pickup based on quality and quantity.
        </p>
      </div>

      {/* Mobile filter drawer (sort options) */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 sm:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white p-5 sm:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-serif text-lg text-[#2B2B24]">Sort by</p>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="h-5 w-5 text-[#8A8375]" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {orderingOptions.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => {
                      setOrdering(o.value);
                      setFiltersOpen(false);
                    }}
                    className={`rounded-lg px-3 py-2.5 text-left text-sm ${
                      ordering === o.value
                        ? "bg-[#228B57] text-white"
                        : "text-[#2B2B24] hover:bg-[#F1EEE4]"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}