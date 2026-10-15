"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, X } from "lucide-react";

type Sale = { name: string; area: string; item: string; amount: string; ago: string; img: string };

// UI experiment only: sample data so the design can be judged. These people
// and sales are not real, which is why the component renders nothing in a
// production build. To ship it, replace SAMPLE with a fetch of real completed
// pickups (first name + initial, area, item, amount, time) and delete the
// NODE_ENV guard below.
const SAMPLE: Sale[] = [
  // Amounts are the live card's rates, so nobody is shown a number we would not pay.
  { name: "Rohit N.", area: "Rajpur Road", item: "his old SUV", amount: "₹32,000", ago: "2 hours ago", img: "/hero/car.webp" },
  { name: "Gurpreet S.", area: "Selaqui", item: "a mini truck", amount: "₹40,000", ago: "5 hours ago", img: "/hero/car.webp" },
  { name: "Priya S.", area: "Prem Nagar", item: "60 kg of copper", amount: "₹33,000", ago: "yesterday", img: "/hero/scrap.webp" },
  { name: "Arjun T.", area: "Sahastradhara Road", item: "his old sedan", amount: "₹24,000", ago: "yesterday", img: "/hero/car.webp" },
  { name: "Meena K.", area: "Clement Town", item: "two cassette ACs", amount: "₹12,000", ago: "2 days ago", img: "/take/cooling.webp" },
];

const SHOW_MS = 6000;
const GAP_MS = 4000;

export default function SoldPopup() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      setVisible(true);
      timer = setTimeout(hide, SHOW_MS);
    };
    const hide = () => {
      setVisible(false);
      timer = setTimeout(() => {
        setIndex((i) => (i + 1) % SAMPLE.length);
        show();
      }, GAP_MS);
    };
    timer = setTimeout(show, 3000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (process.env.NODE_ENV === "production") return null;

  const sale = SAMPLE[index];

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {visible && !dismissed && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            role="status"
            className="pointer-events-auto relative flex w-[390px] max-w-[calc(100vw-2rem)] items-center gap-4 overflow-hidden rounded-2xl bg-white p-4 pl-5 pr-10 shadow-[0_24px_60px_-12px_rgba(15,81,69,0.55)] ring-1 ring-(--color-primary)/15"
          >
            <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-(--color-accent)" />
            <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl">
              <Image src={sale.img} alt="" fill sizes="72px" className="object-cover" />
            </span>
            <div className="min-w-0 text-[15px] leading-snug">
              <p className="text-(--color-ink)">
                <span className="font-semibold">{sale.name}</span> from {sale.area}
              </p>
              <p className="text-(--color-ink-soft)">
                sold {sale.item} for{" "}
                <span className="text-lg font-bold text-(--color-primary)">{sale.amount}</span>
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-(--color-primary)">
                <BadgeCheck className="h-4 w-4" />
                {sale.ago}
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="absolute right-2 top-2 rounded-full p-1 text-(--color-ink-soft) hover:bg-(--color-bg-deep) hover:text-(--color-ink)"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
