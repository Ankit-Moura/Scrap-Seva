// app/how-it-works/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    icon: "ListChecks",
    title: "Tell us what you have",
    body: "Pick your categories — paper, metal, plastic, e-waste and more. See an estimate before you commit to anything.",
  },
  {
    icon: "CalendarClock",
    title: "Choose a time that works",
    body: "Pick your address and a pickup window. No fixed slots to work around — mornings, afternoons, evenings, your call.",
  },
  {
    icon: "Truck",
    title: "A kabadiwala comes to you",
    body: "They arrive in your window, weigh everything on the spot, and confirm the final amount with you before anything changes hands.",
  },
  {
    icon: "Wallet",
    title: "Get paid, your way",
    body: "Take cash on the spot, or add it to your ScrapSeva wallet — transfer to your bank whenever you like.",
  },
];

function StepRow({ step, index, isLast }: { step: typeof STEPS[0]; index: number; isLast: boolean }) {
  const Icon = (Icons as any)[step.icon] as React.ElementType;
  return (
    <div className="relative flex gap-5">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.35, delay: index * 0.05 }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#228B57] text-white"
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: index * 0.05 + 0.15 }}
            style={{ transformOrigin: "top" }}
            className="my-1 w-px flex-1 bg-[#D8D2C2]"
          />
        )}
      </div>

      <div className="pb-10">
        <span className="text-xs font-medium uppercase tracking-wide text-[#8A8375]">
          Step {index + 1}
        </span>
        <h3 className="mt-1 font-serif text-xl text-[#2B2B24]">{step.title}</h3>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[#8A8375]">{step.body}</p>
      </div>
    </div>
  );
}

function PaymentCard({
  icon,
  title,
  points,
  recommended,
}: {
  icon: keyof typeof Icons;
  title: string;
  points: string[];
  recommended?: boolean;
}) {
  const Icon = Icons[icon] as React.ElementType;
  return (
    <div
      className={`relative rounded-2xl border p-5 ${
        recommended ? "border-[#228B57] bg-[#228B57]/5" : "border-[#EBE6DA] bg-white"
      }`}
    >
      {recommended && (
        <span className="absolute -top-3 left-5 rounded-full bg-[#228B57] px-2.5 py-1 text-[11px] font-medium text-white">
          Most convenient
        </span>
      )}
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#228B57]/10">
        <Icon className="h-4.5 w-4.5 text-[#228B57]" />
      </div>
      <h3 className="mt-3 text-[15px] font-medium text-[#2B2B24]">{title}</h3>
      <ul className="mt-2.5 space-y-1.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-[#8A8375]">
            <Icons.Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#228B57]" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-[#228B57]">
            How it works
          </span>
          <h1 className="mt-2 font-serif text-[32px] leading-tight text-[#2B2B24] sm:text-[38px]">
            From clutter to cash,
            <br />
            in four steps
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-[#8A8375]">
            No haggling, no guesswork. See what your scrap is worth before a kabadiwala
            ever knocks on your door.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-14">
          {STEPS.map((step, i) => (
            <StepRow key={step.title} step={step} index={i} isLast={i === STEPS.length - 1} />
          ))}
        </div>

        {/* Payment choice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="font-serif text-2xl text-[#2B2B24]">Two ways to get paid</h2>
          <p className="mt-1.5 text-sm text-[#8A8375]">
            You decide at pickup — nothing is locked in beforehand.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <PaymentCard
              icon="Banknote"
              title="Cash on the spot"
              points={[
                "Paid the moment your scrap is weighed",
                "No app needed to receive it",
              ]}
            />
            <PaymentCard
              icon="Wallet"
              title="ScrapSeva Wallet"
              recommended
              points={[
                "Instantly added after every pickup",
                "Transfer to your bank whenever you like",
                "Full history of every pickup you've made",
              ]}
            />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35 }}
          className="mt-14 rounded-2xl border border-[#EBE6DA] bg-white p-6 text-center"
        >
          <h2 className="font-serif text-xl text-[#2B2B24]">Ready to clear some space?</h2>
          <p className="mt-1.5 text-sm text-[#8A8375]">
            Takes about two minutes to book.
          </p>
          <button
            onClick={() => router.push("/book-pickup")}
            className="mt-4 rounded-xl bg-[#228B57] px-6 py-3 text-sm font-medium text-white hover:bg-[#1c6f47]"
          >
            Schedule a pickup
          </button>
        </motion.div>
      </div>
    </main>
  );
}