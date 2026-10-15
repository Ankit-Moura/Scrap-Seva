"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Truck } from "lucide-react";
import HowItWorks from "@/components/HowItWorks";
import HeroValuation from "@/components/HeroValuation";
import Link from "next/link";
import HomePage from "@/components/HomePage";
import SoldPopup from "@/components/SoldPopup";


export default function Home() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-(--color-bg)">
        {/* Deep teal sweep behind the collage (desktop) */}
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 hidden w-[47%] rounded-l-[48%_50%] bg-(--color-primary-dark) lg:block"
        />

        <div className="relative max-w-7xl mx-auto px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-24 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6 xl:gap-12 items-center">

          {/* LEFT: copy + CTA */}
          <div className="flex flex-col gap-5 sm:gap-6 max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-(--color-bg-deep) px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-(--color-primary-dark)"
            >
              <Truck size={14} strokeWidth={2.2} />
              Doorstep scrap pickup
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight text-(--color-ink)"
            >
              Old stuff doesn&rsquo;t belong in landfills.{" "}
              <span className="block text-(--color-primary)">It belongs in your wallet.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="max-w-md text-sm sm:text-base leading-relaxed text-(--color-ink-soft) md:text-lg"
            >
              We collect cars, large appliances, electronics, and more — right
              from your doorstep. Fast, fair rates. No hassle.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-wrap gap-y-3 space-x-2.5 items-center"
            >
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-(--color-ink)">
                {["Free pickup", "Paid at your door", "Verified partners"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-(--color-primary)" /> {t}
                  </li>
                ))}
              </ul>
              <Link
                href="/market-rates"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-(--color-ink-soft) hover:text-(--color-ink) transition-colors underline underline-offset-4 decoration-(--color-line)"
              >
                See today&apos;s rates <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: valuation form on the teal sweep */}
          <div className="relative rounded-[2rem] bg-(--color-primary-dark) p-5 sm:p-8 lg:rounded-none lg:bg-transparent lg:p-0 lg:pl-10">
            {/* Doodle sparks */}
            <svg
              aria-hidden
              viewBox="0 0 40 40"
              className="absolute -left-6 -top-8 hidden h-12 w-12 stroke-(--color-ink) lg:block"
              fill="none"
              strokeWidth={3}
              strokeLinecap="round"
            >
              <path d="M6 26l10 4M14 10l8 14M30 4l-2 16" />
            </svg>

            <HeroValuation />
          </div>

        </div>
      </section>
      <HowItWorks/>
      <HomePage/>
      <SoldPopup/>
    </>
  );
}
