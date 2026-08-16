"use client"

import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate, AnimatePresence } from "motion/react";
import IconRecycle from "./Icon";
import Link from "next/link";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL 

const IMAGES = {
  hero: "./indian-faimly-task-picking.png",
  bookAppointment: "./bookAppointment.png",
  recycle: "./recycle.png",
  paperWaste: "./paperWaste.png",
  eWaste: "./eWaste.png ",
  cityView: "./cityView.png",
  plasticWaste: "./plasticWaste.png ",
  metalWaste: "./metalWaste.png",
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

const STEPS = [
  {
    num: "1",
    img: IMAGES.bookAppointment,
    imgAlt: "Booking a Recycler Club pickup slot on a phone",
    title: "Book your slot",
    desc: "Enter your Dehradun pincode and pick a time. Morning and evening slots, all week.",
  },
  {
    num: "2",
    img: IMAGES.homePickUp,
    imgAlt: "Recycler Club agent arriving at a home with a certified scale",
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
    tagBg: "bg-(--color-bg-deep) text-(--color-primary-dark)",
    ring: "hover:border-(--color-primary-light)",
  },
  {
    img: IMAGES.plasticWaste,
    imgAlt: "Bundle of plastic bottles and other waste tied with string",
    label: "Plastic",
    desc: "Bottles, containers, packaging material",
    tag: "Accepted",
    tagBg: "bg-(--color-primary-light)/15 text-(--color-primary-dark)",
    ring: "hover:border-(--color-primary)",
  },
  {
    img: IMAGES.eWaste,
    imgAlt: "Old phones, cables and light bulbs — e-waste collection",
    label: "E-waste",
    desc: "Old phones, cables, bulbs, appliances",
    tag: "Handle with care",
    tagBg: "bg-(--color-accent-soft) text-(--color-ink)",
    ring: "hover:border-(--color-accent)",
  },
  {
    img: IMAGES.metalWaste,
    imgAlt: "Old metal utensils, pipes and scrap iron",
    label: "Metal & iron",
    desc: "Old vessels, pipes, tins, scrap iron",
    tag: "Best value",
    tagBg: "bg-(--color-accent)/20 text-(--color-ink)",
    ring: "hover:border-(--color-accent)",
  },
];

const IMPACT = [
  { num: 3800, unit: "kg recycled", desc: "Scrap diverted from Dehradun landfills this month" },
  { num: 620, unit: "households served", desc: "Doon families who stopped haggling" },
  { num: 180, unit: "trees saved", desc: "Equivalent CO₂ offset from our pickups" },
];

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

function WhatWeTake() {
  return (
    <section id="what-we-take" className="bg-(--color-bg) py-16 sm:py-20 border-t border-(--color-line)">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="ss-slip text-xs font-semibold text-(--color-accent) uppercase tracking-[0.18em] mb-3">What we take</p>
          <h2 className="ss-display text-3xl sm:text-4xl font-semibold tracking-tight text-(--color-ink) mb-2">All kinds of household scrap</h2>
          <p className="text-(--color-ink-soft) mb-12 text-base">If it's lying around collecting dust, we'll weigh it and pay for it.</p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" stagger={0.09}>
          {CATEGORIES.map((cat, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -5, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className={`bg-(--color-bg-card) rounded-xl border border-(--color-line) ${cat.ring} transition-colors flex flex-col overflow-hidden cursor-pointer group h-full shadow-sm hover:shadow-lg`}
              >
                <div className="h-36 flex items-center justify-center overflow-hidden bg-(--color-bg)">
                  <img
                    src={cat.img}
                    alt={cat.imgAlt}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <h4 className="ss-display text-sm font-semibold text-(--color-ink)">{cat.label}</h4>
                  <p className="text-xs text-(--color-ink-soft) leading-relaxed">{cat.desc}</p>
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

function Impact() {
  return (
    <section id="impact" className="py-16 sm:py-20 border-t border-(--color-line) relative overflow-hidden ">
      <div className="absolute inset-0 z-0">
        <img src={IMAGES.cityView} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-(--color-ink)/70 via-(--color-ink)/55 to-(--color-ink)" />
      </div>
 
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="ss-slip text-xs font-semibold text-(--color-accent) uppercase tracking-[0.18em] mb-3">Our impact</p>
          <h2 className="ss-display text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">Fixing Dehradun's scrap game, one pickup at a time.</h2>
          <p className="text-(--color-bg)/70 mb-12 text-base">Real numbers from real pickups across the Doon valley.</p>
        </Reveal>
 
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-5" stagger={0.12}>
          {IMPACT.map((item, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(242,169,59,0.4)" }}
                className="bg-(--color-primary-light)/10 border border-(--color-primary-light)/20 rounded-xl p-8 text-center backdrop-blur-sm h-full"
              >
                <CountUp
                  value={item.num}
                  className="ss-slip text-4xl sm:text-5xl font-semibold text-(--color-accent) tracking-tight leading-none tabular-nums"
                />
                <p className="text-(--color-primary-light) font-semibold text-base mt-2">{item.unit}</p>
                <p className="text-(--color-bg)/70 text-xs mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
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
    <section id="book" className="bg-(--color-primary-dark) py-16 sm:py-20 relative overflow-hidden">
      <motion.div
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-(--color-accent)/10 blur-3xl"
      />

      <Reveal className="max-w-xl mx-auto px-5 sm:px-8 text-center relative">
        <h2 className="ss-display text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-3">Ready to stop haggling?</h2>
        <p className="text-(--color-bg)/70 text-base mb-8">Enter your number. We'll call to lock in your fair rate and a free pickup slot.</p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-(--color-bg-card) rounded-xl px-6 py-5 flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 16, delay: 0.1 }}
                className="w-10 h-10 bg-(--color-bg-deep) rounded-full flex items-center justify-center text-(--color-primary-dark) shrink-0"
              >
                <IconCheck />
              </motion.div>
              <div className="text-left">
                <p className="text-(--color-ink) font-semibold text-sm">We'll call you shortly!</p>
                <p className="text-(--color-ink-soft) text-xs mt-0.5">Our team will confirm your free pickup slot.</p>
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
                <div className="flex items-center bg-(--color-bg-card) rounded-lg pl-4 pr-2 flex-1 ring-2 ring-transparent focus-within:ring-(--color-accent)/50 transition-shadow">
                  <span className="text-(--color-ink-soft) mr-2"><IconPhone /></span>
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
                    className="ss-slip flex-1 py-4 text-sm text-(--color-ink) outline-none bg-transparent placeholder-(--color-ink-soft)/60 font-medium"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-(--color-accent) hover:brightness-90 text-(--color-ink) font-semibold text-sm px-6 py-4 rounded-lg transition-[filter] whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-(--color-ink)/30 border-t-(--color-ink)"
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
                  className="text-(--color-accent-soft) text-xs mt-2 font-medium"
                >
                  {error}
                </motion.p>
              )}
              <p className="text-(--color-bg)/70 text-xs mt-4">Free pickup · Fair, weighed rates · Across Dehradun</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}

function BusinessCTAStrip() {
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
        category: "business_inquiry",
        subject: "Callback request — business bulk pickup",
        description: "Requested a callback via the business page to discuss a bulk/recurring pickup contract.",
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
    <section id="book-business" className="bg-(--color-primary-dark) py-16 sm:py-20 relative overflow-hidden">
      <motion.div
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-(--color-accent)/10 blur-3xl"
      />

      <Reveal className="max-w-xl mx-auto px-5 sm:px-8 text-center relative">
        <h2 className="ss-display text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-3">Got scrap piling up at work?</h2>
        <p className="text-(--color-bg)/70 text-base mb-8">Enter your number. We'll call to set up recurring pickups and bulk rates for your business.</p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-(--color-bg-card) rounded-xl px-6 py-5 flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 16, delay: 0.1 }}
                className="w-10 h-10 bg-(--color-bg-deep) rounded-full flex items-center justify-center text-(--color-primary-dark) shrink-0"
              >
                <IconCheck />
              </motion.div>
              <div className="text-left">
                <p className="text-(--color-ink) font-semibold text-sm">We'll call you shortly!</p>
                <p className="text-(--color-ink-soft) text-xs mt-0.5">Our team will set up your business pickup plan.</p>
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
                <div className="flex items-center bg-(--color-bg-card) rounded-lg pl-4 pr-2 flex-1 ring-2 ring-transparent focus-within:ring-(--color-accent)/50 transition-shadow">
                  <span className="text-(--color-ink-soft) mr-2"><IconPhone /></span>
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
                    placeholder="Your business contact number"
                    className="ss-slip flex-1 py-4 text-sm text-(--color-ink) outline-none bg-transparent placeholder-(--color-ink-soft)/60 font-medium"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-(--color-accent) hover:brightness-90 text-(--color-ink) font-semibold text-sm px-6 py-4 rounded-lg transition-[filter] whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-(--color-ink)/30 border-t-(--color-ink)"
                    />
                  ) : (
                    <>Talk to sales <IconArrowRight /></>
                  )}
                </motion.button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-(--color-accent-soft) text-xs mt-2 font-medium"
                >
                  {error}
                </motion.p>
              )}
              <p className="text-(--color-bg)/70 text-xs mt-4">No minimum volume · Custom pickup schedule · Across Dehradun</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="ss-page min-h-screen bg-(--color-bg) antialiased">
      
      <WhatWeTake />
      <Impact />
      <BusinessCTAStrip/>
    </div>
  );
}