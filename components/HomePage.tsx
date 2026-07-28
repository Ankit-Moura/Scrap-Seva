"use client"

import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate, AnimatePresence } from "motion/react";
import IconRecycle from "./Icon";
import Link from "next/link";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// ── Image imports ────────────────────────────────────────────────────────────
// Drop generated/photographed files into your public/assets folder with these
// exact names, or update the paths below. See the AI generation prompts next
// to each key if you're using Midjourney / Ideogram / ChatGPT images — they're
// written to match this page's palette (deep pine #1B4332, brass #C08A2E,
// warm paper #F4F5F0) and its Dehradun setting.
const IMAGES = {
  // "A Dehradun household on their balcony/porch, Himalayan foothills soft-focus
  //  in the background, morning light, handing a bundle of newspapers and a
  //  small e-waste box to a ScrapSeva agent in a pine-green uniform holding a
  //  handheld digital scale. Documentary photo, natural light, warm and candid,
  //  no text overlays."
  hero: "./indian-faimly-task-picking.png",
  // "Close-up of a hand booking a pickup slot on a phone, calendar/time-slot UI
  //  visible, warm indoor light, shallow depth of field."
  bookAppointment: "./bookAppointment.png",
  // "Certified recycling facility, workers sorting paper/plastic/metal on a
  //  conveyor, pine-green and brass safety signage, clean industrial daylight."
  recycle: "./recycle.png",
  // "Tied bundle of newspapers, magazines and flattened cardboard boxes, top-
  //  down flat lay on a wooden or concrete surface, soft natural light."
  paperWaste: "./paperWaste.png",
  // "Old phones, tangled cables, a CFL bulb and a small circuit board arranged
  //  on a neutral surface, slightly moody lighting to signal 'handle with care'."
  eWaste: "./eWaste.png ",
  // "Dehradun skyline or Rajpur Road / Clock Tower area with the Himalayan
  //  foothills behind it, dusk, muted desaturated tones so it can sit under a
  //  dark overlay."
  cityView: "./cityView.png",
  // "Bundle of crushed plastic bottles and containers, tied together, top-down
  //  flat lay, natural light, slightly cool tone."
  plasticWaste: "./plasticWaste.png ",
  // "Old brass and steel utensils, pipe fittings and scrap iron pieces, top-
  //  down flat lay, warm light that catches the brass tones."
  metalWaste: "./metalWaste.png",
  // "ScrapSeva agent on a bicycle or small cart with collection bags, arriving
  //  at a residential gate in Dehradun, morning light, in motion."
  homePickUp: "./homePickUp.png",
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
const IconScale = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 3v18" /><path d="M5 8h14" /><path d="M5 8 2.5 14a2.5 2.5 0 0 0 5 0Z" /><path d="M19 8l-2.5 6a2.5 2.5 0 0 0 5 0Z" /><path d="M8 21h8" />
  </svg>
);
const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "1",
    img: IMAGES.bookAppointment,
    imgAlt: "Booking a ScrapSeva pickup slot on a phone",
    title: "Book your slot",
    desc: "Enter your Dehradun pincode and pick a time. Morning and evening slots, all week.",
  },
  {
    num: "2",
    img: IMAGES.homePickUp,
    imgAlt: "ScrapSeva agent arriving at a home with a certified scale",
    title: "We weigh it, fair and square",
    desc: "Our agent brings a certified scale to your door. You watch the reading — no eyeballing, no lowballing.",
  },
  {
    num: "3",
    img: IMAGES.recycle,
    imgAlt: "Certified recycling facility sorting paper, plastic and metal",
    title: "Get paid, then and there",
    desc: "Cash or UPI, paid on the spot at the day's rate — plus a printed slip for your records.",
  },
];

const CATEGORIES = [
  {
    img: IMAGES.paperWaste,
    imgAlt: "Bundle of newspapers and cardboard tied with string",
    label: "Paper & cardboard",
    desc: "Newspapers, books, boxes, magazines",
    tag: "Most common",
    tagBg: "bg-[#E7ECE1] text-[#3F5A3C]",
    ring: "hover:border-[#8FAE86]",
  },
  {
    img: IMAGES.plasticWaste,
    imgAlt: "Bundle of plastic bottles and other waste tied with string",
    label: "Plastic",
    desc: "Bottles, containers, packaging material",
    tag: "Accepted",
    tagBg: "bg-[#E5EAEE] text-[#3D5570]",
    ring: "hover:border-[#8FA6BC]",
  },
  {
    img: IMAGES.eWaste,
    imgAlt: "Old phones, cables and light bulbs — e-waste collection",
    label: "E-waste",
    desc: "Old phones, cables, bulbs, appliances",
    tag: "Handle with care",
    tagBg: "bg-[#F3E7D2] text-[#8A5A1E]",
    ring: "hover:border-[#C9A662]",
  },
  {
    img: IMAGES.metalWaste,
    imgAlt: "Old metal utensils, pipes and scrap iron",
    label: "Metal & iron",
    desc: "Old vessels, pipes, tins, scrap iron",
    tag: "Best value",
    tagBg: "bg-[#F1E3C4] text-[#8A6A1E]",
    ring: "hover:border-[#C08A2E]",
  },
];

const IMPACT = [
  { num: 3800, unit: "kg recycled", desc: "Scrap diverted from Dehradun landfills this month" },
  { num: 620, unit: "households served", desc: "Doon families who stopped haggling" },
  { num: 180, unit: "trees saved", desc: "Equivalent CO₂ offset from our pickups" },
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

function CountUp({ value, className, style }: { value: number; className?: string; style?: React.CSSProperties }) {
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

  return <p ref={ref} className={className} style={style}>{display}</p>;
}

// ── Global type + color tokens ──────────────────────────────────────────────
// Fraunces (display serif, used sparingly for headlines) + Work Sans (body) +
// IBM Plex Mono (the "weigh-slip" numerals). If you're using next/font, move
// these into your root layout instead of the @import below.
function BrandTokens() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500..700&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
      :root {
        --font-display: 'Fraunces', ui-serif, Georgia, serif;
        --font-body: 'Work Sans', ui-sans-serif, system-ui, sans-serif;
        --font-slip: 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace;
        --pine: #1b4332;
        --pine-dark: #12291d;
        --brass: #c08a2e;
        --ink: #1e2a1f;
      }
      .ss-page { font-family: var(--font-body); color: var(--ink); }
      .ss-display { font-family: var(--font-display); }
      .ss-slip { font-family: var(--font-slip); }
    `}</style>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-[#E4E1D3] py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="ss-slip text-xs font-semibold text-[#C08A2E] uppercase tracking-[0.18em] mb-3">How it works</p>
          <h2 className="ss-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#1E2A1F] mb-2">Three steps. No drama.</h2>
          <p className="text-[#5B6558] mb-12 text-base">Booking takes less than a minute. The haggling part just doesn't happen.</p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.12}>
          {STEPS.map((step, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative bg-[#FAF9F4] rounded-xl border border-[#E4E1D3] overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg hover:border-[#8FAE86] transition-shadow"
              >
                <div className="w-full h-48 bg-[#EFEDE2] flex items-center justify-center overflow-hidden group">
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
                    className="ss-slip w-7 h-7 bg-[#1B4332] text-white text-xs font-semibold rounded-md flex items-center justify-center mb-1"
                  >
                    {step.num}
                  </motion.div>
                  <h3 className="ss-display text-base font-semibold text-[#1E2A1F]">{step.title}</h3>
                  <p className="text-sm text-[#5B6558] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
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
    <section id="what-we-take" className="bg-[#F4F5F0] py-16 sm:py-20 border-t border-[#E4E1D3]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="ss-slip text-xs font-semibold text-[#C08A2E] uppercase tracking-[0.18em] mb-3">What we take</p>
          <h2 className="ss-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#1E2A1F] mb-2">All kinds of household scrap</h2>
          <p className="text-[#5B6558] mb-12 text-base">If it's lying around collecting dust, we'll weigh it and pay for it.</p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" stagger={0.09}>
          {CATEGORIES.map((cat, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -5, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className={`bg-white rounded-xl border border-[#E4E1D3] ${cat.ring} transition-colors flex flex-col overflow-hidden cursor-pointer group h-full shadow-sm hover:shadow-lg`}
              >
                <div className="h-36 flex items-center justify-center overflow-hidden bg-[#F4F5F0]">
                  <img
                    src={cat.img}
                    alt={cat.imgAlt}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <h4 className="ss-display text-sm font-semibold text-[#1E2A1F]">{cat.label}</h4>
                  <p className="text-xs text-[#5B6558] leading-relaxed">{cat.desc}</p>
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
    <section id="impact" className="py-16 sm:py-20 border-t border-[#E4E1D3] relative overflow-hidden ">
      <div className="absolute inset-0 z-0">
        <img src={IMAGES.cityView} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#12291d]/70 via-[#12291d]/55 to-[#12291d]" />
      </div>
 
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="ss-slip text-xs font-semibold text-[#D9A94A] uppercase tracking-[0.18em] mb-3">Our impact</p>
          <h2 className="ss-display text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">Fixing Dehradun's scrap game, one pickup at a time.</h2>
          <p className="text-[#A9B6A6] mb-12 text-base">Real numbers from real pickups across the Doon valley.</p>
        </Reveal>
 
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-5" stagger={0.12}>
          {IMPACT.map((item, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(217,169,74,0.4)" }}
                className="bg-white/5 border border-white/10 rounded-xl p-8 text-center backdrop-blur-sm h-full"
              >
                <CountUp
                  value={item.num}
                  className="ss-slip text-4xl sm:text-5xl font-semibold text-[#D9A94A] tracking-tight leading-none tabular-nums"
                />
                <p className="text-[#8FAE86] font-semibold text-base mt-2">{item.unit}</p>
                <p className="text-[#A9B6A6] text-xs mt-2 leading-relaxed">{item.desc}</p>
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
    <section id="book" className="bg-[#1B4332] py-16 sm:py-20 relative overflow-hidden">
      <motion.div
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#D9A94A]/10 blur-3xl"
      />

      <Reveal className="max-w-xl mx-auto px-5 sm:px-8 text-center relative">
        <h2 className="ss-display text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-3">Ready to stop haggling?</h2>
        <p className="text-[#B9CFB6] text-base mb-8">Enter your number. We'll call to lock in your fair rate and a free pickup slot.</p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white rounded-xl px-6 py-5 flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 16, delay: 0.1 }}
                className="w-10 h-10 bg-[#E7ECE1] rounded-full flex items-center justify-center text-[#1B4332] shrink-0"
              >
                <IconCheck />
              </motion.div>
              <div className="text-left">
                <p className="text-[#1E2A1F] font-semibold text-sm">We'll call you shortly!</p>
                <p className="text-[#5B6558] text-xs mt-0.5">Our team will confirm your free pickup slot.</p>
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
                <div className="flex items-center bg-white rounded-lg pl-4 pr-2 flex-1 ring-2 ring-transparent focus-within:ring-[#D9A94A]/50 transition-shadow">
                  <span className="text-[#8B9A87] mr-2"><IconPhone /></span>
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
                    className="ss-slip flex-1 py-4 text-sm text-[#1E2A1F] outline-none bg-transparent placeholder-[#9AA396] font-medium"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#D9A94A] hover:bg-[#C79936] text-[#1E2A1F] font-semibold text-sm px-6 py-4 rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-[#1E2A1F]/30 border-t-[#1E2A1F]"
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
                  className="text-[#F3D9A6] text-xs mt-2 font-medium"
                >
                  {error}
                </motion.p>
              )}
              <p className="text-[#B9CFB6] text-xs mt-4">Free pickup · Fair, weighed rates · Across Dehradun</p>
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
    <footer className="border-t border-[#E4E1D3] px-5 sm:px-8 py-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1B4332] rounded-lg flex items-center justify-center text-white"><IconRecycle /></div>
          <span className="ss-display text-sm font-semibold text-[#1E2A1F]">Scrap<span className="text-[#C08A2E]">Seva</span></span>
          <span className="text-[#C7C3B3] mx-2">·</span>
          <span className="text-xs text-[#8B9A87]">Fixing Dehradun's scrap game, one pickup at a time</span>
        </div>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" className="text-xs text-[#8B9A87] hover:text-[#1E2A1F] transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── Weigh-slip (signature element) ──────────────────────────────────────────
// The one memorable visual on the page: a printed weighing slip, standing in
// for the honest, watched-scale reading ScrapSeva promises instead of a
// kabadiwala's eyeballed guess.
function WeighSlip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: -3 }}
      transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, y: -4 }}
      className="ss-slip absolute bottom-4 left-4 bg-white rounded-md shadow-lg px-4 py-3 w-[192px]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, transparent, transparent 15px, #F4F5F0 15px, #F4F5F0 16px)",
      }}
    >
      <p className="text-[9px] uppercase tracking-[0.14em] text-[#8B9A87] mb-1.5">ScrapSeva · Weigh Slip</p>
      <div className="flex items-center justify-between text-[11px] text-[#1E2A1F]">
        <span>Newspaper</span><span>4.2 kg</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-[#1E2A1F]">
        <span>Rate/kg</span><span>₹12</span>
      </div>
      <div className="border-t border-dashed border-[#D8D4C3] my-1.5" />
      <div className="flex items-center justify-between text-sm font-semibold text-[#1B4332]">
        <span>Paid</span><span>₹50.40</span>
      </div>
    </motion.div>
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
          className="ss-slip inline-flex items-center gap-1.5 bg-[#E7ECE1] text-[#1B4332] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide"
        >
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <IconMapPin />
          </motion.span>
          Now serving Dehradun
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="ss-display text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-[1.08] tracking-tight text-[#1E2A1F] mb-5"
        >
          Stop haggling with the <span className="text-[#1B4332]">kabadiwala.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-lg text-[#5B6558] leading-relaxed mb-8 max-w-md"
        >
          ScrapSeva weighs it fair on a watched scale, pays the day's rate on the spot, and picks it up free — right from your Dehradun doorstep.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={"/book-pickup"}
              className="cursor-pointer flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#163828] text-white font-semibold text-base px-7 py-4 rounded-lg transition-colors shadow-lg shadow-[#1B4332]/20"
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
            className="flex items-center justify-center gap-2 bg-white hover:bg-[#FAF9F4] text-[#1E2A1F] font-semibold text-base px-7 py-4 rounded-lg border border-[#E4E1D3] transition-colors"
          >
            <Link href={"/how-it-works"}>See how it works</Link>
          </motion.button>
        </motion.div>

        <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-wrap gap-x-6 gap-y-2">
          {["Fair, weighed rates", "Free doorstep pickup", "Paid on the spot"].map((t) => (
            <div key={t} className="flex items-center gap-1.5 text-sm text-[#5B6558]">
              <span className="flex items-center justify-center w-4 h-4 bg-[#E7ECE1] rounded-full text-[#1B4332]"><IconCheck /></span>
              {t}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right — hero image + weigh-slip signature element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, x: 24 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative rounded-xl overflow-hidden aspect-[4/3]"
      >
        <img
          src={IMAGES.hero}
          alt="A Dehradun family handing scrap to a ScrapSeva agent weighing it on a handheld scale"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12291d]/40 via-transparent to-transparent" />

        <WeighSlip />

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-4 right-4 bg-[#12291d] rounded-lg px-3 py-2 flex items-center gap-2"
        >
          <span className="text-[#D9A94A]"><IconScale /></span>
          <span className="text-white text-xs font-semibold">500+ families in Dehradun</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="ss-page min-h-screen bg-white antialiased">
      <BrandTokens />
      <Hero />
      <HowItWorks />
      <WhatWeTake />
      <Impact />
      <CTAStrip />
      <Footer />
    </div>
  );
}