"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Camera, ShieldCheck  } from "lucide-react";
import Image from "next/image";



import { AnimatePresence} from "framer-motion";
import HowItWorks from "@/components/HowItWorks";
import Link from "next/link";
import HomePage from "@/components/HomePage";

const BEFORE = "Turn your scrap into cash using ";

const ITEMS = [
  "paper",
  "plastic",
  "metal",
  "e-waste",
  "cardboard",
  "newspapers",
  "old furniture",
  "refrigerator",
  "washing machine",
  "air conditioner",
  "iron",
  "steel utensils",
  "old books",
  "copper wires",
  "brass items",
  "aluminium",
  "car battery",
  "inverter battery",
  "old mattress",
  "tyres",
  "glass bottles",
  "old clothes",
  "wooden furniture",
  "computer parts",
  "mobile phones",
];
function HeroHeading() {
  const fullHeading = BEFORE + ITEMS[0] ;

  const [typedText, setTypedText] = useState("");
  const [finishedTyping, setFinishedTyping] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);

  // Type the full heading once
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setTypedText(fullHeading.slice(0, index + 1));
      index++;

      if (index >= fullHeading.length) {
        clearInterval(interval);
        setFinishedTyping(true);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Rotate only the highlighted word
  useEffect(() => {
    if (!finishedTyping) return;

    const interval = setInterval(() => {
      setCurrentItem((prev) => (prev + 1) % ITEMS.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [finishedTyping]);

  // While typing
  if (!finishedTyping) {
    return (
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl sm:text-3xl md:text-5xl font-semibold leading-[1.15] sm:leading-[1.1] tracking-tight text-[var(--color-ink)]"
      >
        {typedText}
      </motion.h1>
    );
  }

  // After typing
  return (
    <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-2xl sm:text-3xl md:text-5xl xl:text-7xl font-semibold leading-[1.15] sm:leading-[1.1] tracking-tight text-[var(--color-ink)]"
    >
      {BEFORE}

      <span className="inline-block min-w-[110px] sm:min-w-[150px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={ITEMS[currentItem]}
            initial={{
              opacity: 0,
              y: 10,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -10,
              filter: "blur(4px)",
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="inline-block font-bold text-[var(--color-primary)]"
          >
            {ITEMS[currentItem]}
          </motion.span>
        </AnimatePresence>
      </span>

      {/* {AFTER} */}
    </motion.h1>
  );
}


export default function Home() {
   const [text, setText] = useState("");

  // useEffect(() => {
  //   let index = 0;

  //   const interval = setInterval(() => {
  //     setText(heading.slice(0, index + 1));
  //     index++;

  //     if (index === heading.length) {
  //       clearInterval(interval);
  //     }
  //   }, 45);

  //   return () => clearInterval(interval);
  // }, []);
  return (
    <>
      <section className="w-full bg-(--color-bg)">
        <div className="max-w-7xl mx-auto px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-24 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6 xl:gap-12 items-center">

          {/* LEFT: copy + CTA */}
          <div className="flex flex-col gap-5 sm:gap-6 max-w-xl">
            <motion.span
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex w-fit items-center gap-2 rounded-full bg-(--color-bg-deep) px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-(--color-primary-dark)"
      >
        Doorstep scrap pickup
      </motion.span>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-(--color-ink)"
      >
        <HeroHeading/>
        
      </motion.div>

      {/* Paragraph */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.5,
          ease: "easeOut",
        }}
        className="text-sm sm:text-base leading-relaxed text-(--color-ink-soft) md:text-lg"
      >
        Book a pickup, get instant fair rates, and let a verified kabadiwala
        handle the rest. Paper, plastic, metal, e-waste — weighed, priced, and
        paid on the spot.
      </motion.p>

            <motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeInOut" }}
className="flex flex-wrap gap-y-3 space-x-2.5 items-center" >
  <Link href={"/book-pickup"}>
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
      animate={{
        scale: [1,1.05, 1],
      }}
      transition={{
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        },
      }}
      whileHover={{
        scale: 1.05,
        y: -2,
        boxShadow: "0 18px 40px rgba(23,107,91,0.28)",
      }}
      whileTap={{
        scale: 0.97,
      }}
    >
      {/* Dark overlay */}
      <motion.span
        className="absolute inset-0 bg-(--color-primary-dark)"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{
          duration: 0.35,
          ease: "easeInOut",
        }}
        style={{ originX: 0 }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        Schedule Pickup

        <motion.span
          whileHover={{ x: 5 }}
          transition={{
            duration: 0.2,
          }}
        >
          <ArrowRight size={18} />
        </motion.span>
      </span>
    </motion.button>
    </Link>
            <Link
  
                href="/market-rates"
                className="text-xs sm:text-sm font-medium text-(--color-ink-soft) hover:text-(--color-ink) transition-colors underline underline-offset-4 decoration-(--color-line)"
              >
                See today's rates
              </Link>
</motion.div>
          </div>
          
          <div className="grid h-[300px] xs:h-[340px] sm:h-[420px] lg:h-140 w-full grid-cols-3 gap-2.5 sm:gap-3.5 lg:gap-5">

  {/* Top Image */}
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    whileHover={{ scale: 1.02, y: -4 }}
    className="
      relative col-span-2 overflow-hidden
      rounded-[2rem] sm:rounded-full
      border border-[var(--color-line)]
      shadow-[0_10px_35px_rgba(23,107,91,0.08)]
      bg-[var(--color-bg-card)]
      max-h-140
    "
  >
    <Image
      src="/moving.png"
      alt="Recycler Club doorstep pickup"
      fill
      priority
      className="object-cover brightness-[0.98] contrast-105"
    />
  </motion.div>

  {/* Camera Card */}
  <motion.div
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, delay: 0.1 }}
    whileHover={{ scale: 1.04, y: -4 }}
    className="
      flex flex-col items-center justify-center
      rounded-[2rem] sm:rounded-full
      border border-[var(--color-line)]
      bg-[var(--color-bg-card)]
      shadow-[0_10px_35px_rgba(23,107,91,0.08)]
      text-center
      p-2.5 sm:p-4 lg:p-6
      max-h-140
    "
  >
    <div
      className="
        mb-2 sm:mb-3 lg:mb-4
        flex h-8 w-8 sm:h-11 sm:w-11 lg:h-14 lg:w-14 items-center justify-center
        rounded-full
        bg-[var(--color-bg-deep)]
      "
    >
      <Camera
        size={18}
        strokeWidth={2.2}
        className="text-[var(--color-primary)] sm:hidden"
      />
      <Camera
        size={30}
        strokeWidth={2.2}
        className="text-[var(--color-primary)] hidden sm:block"
      />
    </div>

    <h3 className="text-xs sm:text-sm font-semibold text-[var(--color-ink)]">
      Snap a photo
    </h3>

    <p className="mt-1 max-w-[100px] sm:max-w-[140px] text-[10px] sm:text-xs leading-relaxed text-[var(--color-ink-soft)] hidden sm:block">
      Get an instant AI estimate
    </p>
  </motion.div>

  {/* Trust Card */}
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, delay: 0.2 }}
    whileHover={{ scale: 1.04, y: -4 }}
    className="
      flex flex-col items-center justify-center
      rounded-[2rem] sm:rounded-full
      max-h-140
      border border-[var(--color-line)]
      bg-[var(--color-bg-card)]
      shadow-[0_10px_35px_rgba(23,107,91,0.08)]
      text-center
      p-2.5 sm:p-4 lg:p-6
    "
  >
    <div
      className="
        mb-2 sm:mb-3 lg:mb-4
        flex h-8 w-8 sm:h-11 sm:w-11 lg:h-14 lg:w-14 items-center justify-center
        rounded-full
        bg-[var(--color-bg-deep)]
      "
    >
      <ShieldCheck
        size={18}
        strokeWidth={2.2}
        className="text-[var(--color-primary)] sm:hidden"
      />
      <ShieldCheck
        size={30}
        strokeWidth={2.2}
        className="text-[var(--color-primary)] hidden sm:block"
      />
    </div>

    <h3 className="text-xs sm:text-sm font-semibold text-[var(--color-ink)]">
      Verified Partners
    </h3>

    <p className="mt-1 max-w-[100px] sm:max-w-[140px] text-[10px] sm:text-xs leading-relaxed text-[var(--color-ink-soft)] hidden sm:block">
      No random visitors.
    </p>
  </motion.div>

  {/* Bottom Image */}
  <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.7, delay: 0.3 }}
    whileHover={{ scale: 1.02, y: -4 }}
    className="
      relative col-span-2 overflow-hidden
      rounded-[2rem] sm:rounded-full
      max-h-140
      border border-[var(--color-line)]
      shadow-[0_10px_35px_rgba(23,107,91,0.08)]
      bg-[var(--color-bg-card)]
    "
  >
    <Image
      src="/money.png"
      alt="Earn money by recycling"
      fill
      priority
      className="object-cover brightness-[0.98] contrast-105"
    />
  </motion.div>
</div>

        </div>
      </section>
      <HowItWorks/>
      <HomePage/>
    </>
  );
}