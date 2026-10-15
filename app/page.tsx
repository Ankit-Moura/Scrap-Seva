"use client";

import { motion } from "framer-motion";
import { ArrowRight, Truck } from "lucide-react";
import Image from "next/image";
import HowItWorks from "@/components/HowItWorks";
import Link from "next/link";
import HomePage from "@/components/HomePage";
import SoldPopup from "@/components/SoldPopup";

// Each tile gets its own wobbly outline and tilt so the collage reads hand-placed.
const TILES = [
  {
    src: "/hero/car.webp",
    label: "Cars & Vehicles",
    shape: "rounded-[38%_26%_30%_22%/26%_32%_26%_36%] -rotate-3",
  },
  {
    src: "/hero/appliances.webp",
    label: "Large Appliances",
    shape: "rounded-[24%_36%_24%_32%/30%_24%_36%_26%] rotate-2",
  },
  {
    src: "/hero/scrap.webp",
    label: "Bulky Scrap",
    shape: "rounded-[30%_22%_36%_26%/34%_26%_30%_24%] rotate-2",
  },
  {
    src: "/hero/ewaste.webp",
    label: "Electronics & E-waste",
    shape: "rounded-[22%_34%_26%_38%/26%_36%_24%_32%] -rotate-2",
  },
];

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
              <Link href="/book-pickup">
              <motion.button
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-full
                  bg-(--color-accent)
                  px-5
                  py-3
                  sm:px-7
                  sm:py-4
                  text-sm
                  sm:text-base
                  font-semibold
                  text-white
                  shadow-lg
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-(--color-primary)
                  focus-visible:ring-offset-2
                "
                initial="rest"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ scale: { duration: 2, repeat: Infinity, ease: "easeOut" } }}
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 18px 40px rgba(23,107,91,0.28)" }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="absolute inset-0 bg-(--color-primary-dark)"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  style={{ originX: 0 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Get a free quote
                  <motion.span whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <ArrowRight size={18} />
                  </motion.span>
                </span>
              </motion.button>
              </Link>
              <Link
                href="/market-rates"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-(--color-ink-soft) hover:text-(--color-ink) transition-colors underline underline-offset-4 decoration-(--color-line)"
              >
                See today&apos;s rates <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: photo collage on the teal sweep */}
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

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 pb-4">
              {TILES.map((tile, i) => (
                <motion.div
                  key={tile.label}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                  className="relative"
                >
                  <div
                    className={`relative aspect-[1.05] overflow-hidden border-4 sm:border-[6px] border-white shadow-[0_20px_40px_-18px_rgba(0,0,0,0.55)] ${tile.shape}`}
                  >
                    <Image
                      src={tile.src}
                      alt={tile.label}
                      fill
                      priority
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-sm font-semibold text-(--color-ink) shadow-md">
                    {tile.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>
      <HowItWorks/>
      <HomePage/>
      <SoldPopup/>
    </>
  );
}
