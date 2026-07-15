"use client"

import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate, AnimatePresence } from "motion/react";
import IconRecycle from "./Icon";
import Link from "next/link";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// ── Image imports (update paths to match your project's public/assets folder) ──
const IMAGES = {
  hero: "./indian-faimly-task-picking.png",
  bookAppointment: "./bookAppointment.png",
  recycle: "./recycle.png",
  paperWaste: "./paper-waste.png",
  eWaste: "./electonic-waste.png",
  cityView: "./city_top_view.png",
  plasticWaste: "./plastic.png",
  metalWaste: "./metal.png",
  homePickUp: "./we-come-u.png"
};

const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.46-.46a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />
  </svg>
);
const IconTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
  </svg>
);
const IconWeight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="5" r="3" /><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.46A2 2 0 0 0 17.48 8Z" />
  </svg>
);
const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "1",
    img: IMAGES.bookAppointment,
    imgAlt: "Book a pickup slot on the ScrapSeva app",
    title: "Book your slot",
    desc: "Enter your pincode and pick a time. Morning and evening slots available 7 days a week.",
  },
  {
    num: "2",
    img: IMAGES.homePickUp,
    useIcon: false,
    title: "We come to you",
    desc: "Our trained agent arrives at your door with a bag. Just hand over your scrap — no sorting needed.",
  },
  {
    num: "3",
    img: IMAGES.recycle,
    imgAlt: "Certified recycling facility sorting paper, plastic and metal",
    title: "It gets recycled right",
    desc: "Every kilogram goes to a certified facility. You get a digital receipt showing your exact impact.",
  },
];

const CATEGORIES = [
  {
    img: IMAGES.paperWaste,
    imgAlt: "Bundle of newspapers and cardboard tied with string",
    label: "Paper & cardboard",
    desc: "Newspapers, books, boxes, magazines",
    tag: "Most common",
    tagBg: "bg-green-100 text-green-700",
    border: "hover:border-green-300",
  },
  {
    img: IMAGES.plasticWaste,
    imgAlt: "Bundle of plastic bottles and other wastes tied with string",
    iconBg: "bg-blue-50 text-blue-600",
    label: "Plastic",
    desc: "Bottles, containers, packaging material",
    tag: "Accepted",
    tagBg: "bg-blue-100 text-blue-700",
    border: "hover:border-blue-300",
  },
  {
    img: IMAGES.eWaste,
    imgAlt: "Old phones, cables and light bulbs — e-waste collection",
    label: "E-waste",
    desc: "Old phones, cables, bulbs, appliances",
    tag: "Handle with care",
    tagBg: "bg-amber-100 text-amber-700",
    border: "hover:border-amber-300",
  },
  {
    img: IMAGES.metalWaste,
    useIcon: false,
    imgAlt: "Old metal utensils and other metal stuff",
    iconBg: "bg-rose-50 text-rose-600",
    label: "Metal & iron",
    desc: "Old vessels, pipes, tins, scrap iron",
    tag: "Best value",
    tagBg: "bg-rose-100 text-rose-700",
    border: "hover:border-rose-300",
  },
];

const IMPACT = [
  { num: 12400, suffix: "", unit: "kg recycled", desc: "Total scrap diverted from landfills" },
  { num: 2100, suffix: "", unit: "households served", desc: "Families who said yes to recycling" },
  { num: 840, suffix: "", unit: "trees saved", desc: "Equivalent CO₂ offset from our pickups" },
];

// ── Motion primitives ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString("en-IN")),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <p ref={ref} className={className}>{display}</p>;
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-gray-100 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">3 steps. Zero effort.</h2>
          <p className="text-gray-500 mb-12 text-base">The whole thing takes less than a minute to set up.</p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.12}>
          {STEPS.map((step, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg hover:border-green-200 transition-shadow"
              >
                <div className="w-full h-48 bg-green-50 flex items-center justify-center overflow-hidden group">
                  <img
                    src={step.img}
                    alt={step.imgAlt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.15 }}
                    className="w-7 h-7 bg-green-100 text-green-700 text-xs font-bold rounded-lg flex items-center justify-center mb-1"
                  >
                    {step.num}
                  </motion.div>
                  <h3 className="text-base font-bold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>

              {i < STEPS.length - 1 && (
                <div className="hidden md:flex absolute translate-x-[calc(33.33vw-3.5rem)] xl:translate-x-0" />
              )}
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

// ── What We Take ──────────────────────────────────────────────────────────────
function WhatWeTake() {
  return (
    <section id="what-we-take" className="bg-gray-50 py-16 sm:py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3">What we take</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">All kinds of household scrap</h2>
          <p className="text-gray-500 mb-12 text-base">If it's lying around collecting dust, we'll take it.</p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" stagger={0.09}>
          {CATEGORIES.map((cat, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -5, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className={`bg-white rounded-2xl border border-gray-100 ${cat.border} transition-colors flex flex-col overflow-hidden cursor-pointer group h-full shadow-sm hover:shadow-lg`}
              >
                <div className="h-36 flex items-center justify-center overflow-hidden bg-gray-50">
                  <img
                    src={cat.img}
                    alt={cat.imgAlt}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-gray-900">{cat.label}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
                  <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${cat.tagBg}`}>{cat.tag}</span>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

// ── Impact ────────────────────────────────────────────────────────────────────
function Impact() {
  return (
    <section id="impact" className="py-16 sm:py-20 border-t border-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={IMAGES.cityView} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gray-900/90" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Our impact</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">Fixing India, one pickup at a time.</h2>
          <p className="text-gray-400 mb-12 text-base">Real numbers from real pickups across India.</p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-5" stagger={0.12}>
          {IMPACT.map((item, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(163,230,53,0.4)" }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm h-full"
              >
                <CountUp
                  value={item.num}
                  className="text-4xl sm:text-5xl font-extrabold text-lime-400 tracking-tight leading-none tabular-nums"
                />
                <p className="text-green-400 font-semibold text-base mt-2">{item.unit}</p>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

// ── CTA Strip ─────────────────────────────────────────────────────────────────
function CTAStrip() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePhone = (value: string) => /^[6-9]\d{9}$/.test(value.replace(/\D/g, ""));

  const handleSubmit = async () => {
    const cleaned = phone.replace(/\D/g, "");
    if (!validatePhone(cleaned)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE}/contact-us/`, {
        category: "general_inquiry",
        subject: "Callback request — free pickup slot",
        description: "Requested a callback via the homepage to confirm a free pickup slot.",
        contact_phone: cleaned,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.non_field_errors?.[0] || "Couldn't submit. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book" className="bg-green-500 py-16 sm:py-20 relative overflow-hidden">
      {/* ambient glow */}
      <motion.div
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
      />

      <Reveal className="max-w-xl mx-auto px-5 sm:px-8 text-center relative">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">Ready to clean up?</h2>
        <p className="text-green-100 text-base mb-8">Enter your number. We'll call you to confirm a free pickup slot.</p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white rounded-2xl px-6 py-5 flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 16, delay: 0.1 }}
                className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0"
              >
                <IconCheck />
              </motion.div>
              <div className="text-left">
                <p className="text-gray-900 font-bold text-sm">We'll call you shortly!</p>
                <p className="text-gray-500 text-xs mt-0.5">Our team will confirm your free pickup slot.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex gap-2 flex-col md:flex-row">
                <div className="flex items-center bg-white rounded-xl pl-4 pr-2 flex-1 ring-2 ring-transparent focus-within:ring-gray-900/20 transition-shadow">
                  <span className="text-gray-400 mr-2"><IconPhone /></span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                      if (error) setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Your mobile number"
                    className="flex-1 py-4 text-sm text-gray-900 outline-none bg-transparent placeholder-gray-400 font-medium"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm px-6 py-4 rounded-xl transition-colors whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                    />
                  ) : (
                    <>Book now <IconArrowRight /></>
                  )}
                </motion.button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-xs mt-2 font-medium"
                >
                  {error}
                </motion.p>
              )}
              <p className="text-green-100 text-xs mt-4">Free pickup · No minimum quantity · Available across major Indian cities</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-gray-100 px-5 sm:px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center text-white"><IconRecycle /></div>
          <span className="text-sm font-bold text-gray-900">Scrap<span className="text-green-500">Seva</span></span>
          <span className="text-gray-300 mx-2">·</span>
          <span className="text-xs text-gray-400">Fixing India, one pickup at a time 🇮🇳</span>
        </div>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center overflow-hidden">
      {/* Left copy */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
      >
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide"
        >
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <IconMapPin />
          </motion.span>
          Now serving India
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.08] tracking-tight text-gray-900 mb-5"
        >
          We pick up your <span className="text-green-500">scrap.</span><br />You save the planet.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-md"
        >
          Book a free home pickup in 60 seconds. We collect your old newspapers, bottles, metal, and e-waste — and make sure every bit gets recycled properly.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={"/book-pickup"}
             
              className="cursor-pointer flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-base px-7 py-4 rounded-xl transition-colors shadow-lg shadow-green-500/25"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              Book free pickup
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-base px-7 py-4 rounded-xl border border-gray-200 transition-colors"
          >
            <Link href={"/how-it-works"}>See how it works</Link>
          </motion.button>
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-wrap gap-x-6 gap-y-2">
          {["100% free pickup", "Same-day slots", "Certified recycling"].map((t) => (
            <div key={t} className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="flex items-center justify-center w-4 h-4 bg-green-100 rounded-full text-green-600"><IconCheck /></span>
              {t}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right — real image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, x: 24 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative rounded-2xl overflow-hidden aspect-[4/3]"
      >
        <img
          src={IMAGES.hero}
          alt="Indian family sorting scrap — newspapers, bottles and cans — for recycling at home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-4 left-4 bg-white rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-md"
        >
          <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
            <IconWeight />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">12,400 kg</p>
            <p className="text-xs text-gray-400 mt-0.5">recycled this month</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-4 right-4 bg-gray-900 rounded-xl px-3 py-2 flex items-center gap-2"
        >
          <span className="text-lime-400"><IconTrendUp /></span>
          <span className="text-white text-xs font-semibold">500+ happy families</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Hero  />
      <HowItWorks />
      <WhatWeTake />
      <Impact />
      <CTAStrip />
      <Footer />
    </div>
  );
}