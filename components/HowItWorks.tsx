"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  Camera,
  Truck,
  Wallet,
  ArrowDown,
} from "lucide-react";

const textContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const textItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const card: Variants = {
  hidden: {
    opacity: 0,
    y: 70,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const image: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};



export default function HowItWorks() {
  return (
    <section
      id="HowItWorks"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 space-y-10 sm:space-y-12 lg:space-y-4">

        {/* Heading */}

        <motion.div
          variants={textContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mb-12 sm:mb-16 lg:mb-24 max-w-3xl text-center"
        >
          <motion.span
            variants={textItem}
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[var(--color-primary)]"
          >
            HOW IT WORKS
          </motion.span>

          <motion.h2
            variants={textItem}
            className="mt-4 sm:mt-6 text-3xl font-semibold tracking-tight text-[var(--color-ink)] md:text-6xl"
          >
            From your doorstep
            <br />
            to your wallet.
          </motion.h2>

          <motion.p
            variants={textItem}
            className="mx-auto mt-5 sm:mt-8 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-[var(--color-ink-soft)]"
          >
            Sell the big stuff in three simple steps: a published rate,
            a verified partner at your door, and money in your hand.
          </motion.p>
        </motion.div>

        {/* Timeline starts here */}


        {/* STEP 01 */}

<motion.div
  variants={card}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  className="grid items-center gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-[1.05fr_0.95fr]"
>
  {/* Card */}

  <div className="group relative overflow-hidden rounded-3xl lg:rounded-[42px] border border-[var(--color-line)] bg-[var(--color-bg-card)] p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

    <div className="mb-6 lg:mb-8 flex items-center gap-3 sm:gap-4">

      <div className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
        <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>

      <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[var(--color-accent)]">
        01
      </span>

    </div>

    <h3 className="max-w-sm text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-[var(--color-ink)]">
      Tell us what
      <br />
      you have
    </h3>

    <p className="mt-4 lg:mt-6 max-w-lg text-base sm:text-lg leading-7 sm:leading-8 text-[var(--color-ink-soft)]">
      Pick what you&apos;re selling: a fridge, an AC, a television, a
      car. See the published rate before you commit, and add a photo
      so your partner brings the right vehicle.
    </p>

    <div className="mt-6 sm:mt-8 lg:mt-10 inline-flex items-center gap-3 rounded-full bg-[var(--color-bg)] px-4 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-[var(--color-primary)]">

      Published rates, per piece

    </div>

    {/* Decorative Circle */}

    <div className="absolute -right-10 -bottom-10 sm:-right-16 sm:-bottom-16 h-32 w-32 sm:h-52 sm:w-52 rounded-full bg-[var(--color-primary)]/5 transition-transform duration-700 group-hover:scale-125" />

  </div>

  {/* Image */}

  <motion.div
    variants={image}
    className="relative aspect-[1.15] overflow-hidden rounded-3xl lg:rounded-[60px]"
  >
    <Image
      src="/how-photo.webp"
      alt="Customer photographing an old fridge and AC for a Recycler Club pickup."
      fill
      priority={false}
      className="object-cover transition-transform duration-700 group-hover:scale-105"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
  </motion.div>

</motion.div>

<div className="hidden justify-center lg:flex">
  <motion.div
    initial={{ opacity: 0, scaleY: 0 }}
    whileInView={{ opacity: 1, scaleY: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="flex flex-col items-center"
  >
    <div className="h-24 w-px bg-[var(--color-line)]" />

    <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-line)] bg-white">
      <ArrowDown className="h-5 w-5 text-[var(--color-primary)]" />
    </div>
  </motion.div>
</div>
{/* STEP 02 */}

<motion.div
  variants={card}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  className="flex flex-col-reverse items-stretch gap-6 sm:gap-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12"
>
  {/* Image */}
  <motion.div
    variants={image}
    className="relative w-full aspect-[1.05] overflow-hidden rounded-3xl lg:rounded-[60px]"
  >
    <Image
      src="/hero/appliances.webp"
      alt="Verified Recycler Club partner wheeling an old fridge to the pickup truck."
      fill
      className="object-cover transition-transform duration-700 hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
  </motion.div>

  {/* Capsule */}
  <div className="group relative w-full overflow-hidden rounded-3xl lg:rounded-[60px] border border-[var(--color-line)] bg-[var(--color-bg-card)] px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-16 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

    <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[var(--color-accent)]">
      02
    </span>

    <div className="mt-6 lg:mt-8 flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
      <Truck className="h-6 w-6 lg:h-7 lg:w-7" />
    </div>

    <h3 className="mt-6 lg:mt-8 text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-[var(--color-ink)]">
      Schedule
      <br />
      a pickup
    </h3>

    <p className="mt-4 lg:mt-6 max-w-md text-base sm:text-lg leading-7 sm:leading-8 text-[var(--color-ink-soft)]">
      Pick a convenient date and time. A verified Recycler Club
      partner arrives with the right vehicle, checks the condition
      with you, and confirms the final amount before anything moves.
    </p>

    {/* Features */}

    <div className="mt-6 sm:mt-8 lg:mt-10 space-y-3 sm:space-y-4">

      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
        <span className="text-sm sm:text-[15px] text-[var(--color-ink-soft)]">
          Verified pickup partners
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
        <span className="text-sm sm:text-[15px] text-[var(--color-ink-soft)]">
          The right vehicle for the job
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
        <span className="text-sm sm:text-[15px] text-[var(--color-ink-soft)]">
          No bargaining or hidden charges
        </span>
      </div>

    </div>

    {/* Decorative Blob */}

    <div className="absolute -right-12 top-10 sm:-right-20 h-40 w-40 sm:h-64 sm:w-64 rounded-full bg-[var(--color-primary)]/5 transition-transform duration-700 group-hover:scale-110" />

  </div>

</motion.div>

{/* arrow down */}
<div className="hidden justify-center lg:flex">
  <motion.div
    initial={{ opacity: 0, scaleY: 0 }}
    whileInView={{ opacity: 1, scaleY: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="flex flex-col items-center"
  >
    <div className="h-24 w-px bg-[var(--color-line)]" />

    <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-line)] bg-white">
      <ArrowDown className="h-5 w-5 text-[var(--color-primary)]" />
    </div>
  </motion.div>
</div>

{/* STEP 03 */}

<motion.div
  variants={card}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  className="grid items-center gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-[1.05fr_0.95fr]"
>
  {/* Card */}

  <div className="group relative overflow-hidden rounded-3xl lg:rounded-[42px] border border-[var(--color-line)] bg-[var(--color-bg-card)] p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

    <div className="mb-6 lg:mb-8 flex items-center gap-3 sm:gap-4">

      <div className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
        <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>

      <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[var(--color-accent)]">
        03
      </span>

    </div>

    <h3 className="max-w-sm text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-[var(--color-ink)]">
      Get paid
      <br />
      instantly
    </h3>

    <p className="mt-4 lg:mt-6 max-w-lg text-base sm:text-lg leading-7 sm:leading-8 text-[var(--color-ink-soft)]">
      Take cash on the spot, or add it to your Recycler Club wallet
      and transfer it to your bank whenever you like. Either way,
      you&apos;re paid before anything leaves your door.
    </p>

    <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap gap-2 sm:gap-3">

      <span className="rounded-full bg-[var(--color-bg)] px-4 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-[var(--color-primary)]">
        Cash on the spot
      </span>

      <span className="rounded-full bg-[var(--color-bg)] px-4 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-[var(--color-primary)]">
        Digital wallet
      </span>

    </div>

    <div className="absolute -left-12 -bottom-12 sm:-left-20 sm:-bottom-20 h-40 w-40 sm:h-72 sm:w-72 rounded-full bg-[var(--color-primary)]/5 transition-transform duration-700 group-hover:scale-125" />

  </div>

  {/* Image */}

  <motion.div
    variants={image}
    className="relative aspect-[1.15] overflow-hidden rounded-3xl lg:rounded-[60px]"
  >
    <Image
      src="/tick.png"
      alt="Customer receiving payment after recycling pickup."
      fill
      className="object-cover transition-transform duration-700 hover:scale-105"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
  </motion.div>

</motion.div>
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
  className="mt-16 sm:mt-20 lg:mt-32 rounded-3xl lg:rounded-[40px] border border-[var(--color-line)] bg-[var(--color-bg-card)] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-10"
>
  <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 md:gap-10">

    {[
      {
        title: "Verified Partners",
        text: "Every pickup is handled by trusted and verified recyclers.",
      },
      {
        title: "Fair Pricing",
        text: "Published rates, and the final price agreed with you at the door.",
      },
      {
        title: "Instant Payments",
        text: "Receive your money immediately after successful collection.",
      },
      {
        title: "Greener Planet",
        text: "Every pickup helps reduce landfill waste and increase recycling.",
      },
    ].map((item) => (
      <div key={item.title}>
        <h4 className="text-base sm:text-lg font-semibold text-[var(--color-ink)]">
          {item.title}
        </h4>

        <p className="mt-2 sm:mt-3 text-sm sm:text-[15px] leading-6 sm:leading-7 text-[var(--color-ink-soft)]">
          {item.text}
        </p>
      </div>
    ))}

  </div>
</motion.div>
      </div>
    </section>
  );
}