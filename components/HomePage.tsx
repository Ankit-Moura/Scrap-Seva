"use client"

import { useState } from "react";

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

// ── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconRecycle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
    <path d="m14 16-3 3 3 3" />
    <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
    <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
    <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
  </svg>
);
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
const IconTruck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
  </svg>
);
const IconBottle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M15 11h.01" /><path d="M11 15h.01" /><path d="M16 16h.01" />
    <path d="m2 2 20 20" />
    <path d="M20.11 15.11A6 6 0 0 1 9 9.11M15.56 4.44A6 6 0 0 1 21 9.11" />
    <path d="M3 3a6 6 0 0 0 8.11 8.11" />
  </svg>
);
const IconWrench = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
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
  { num: "12,400", unit: "kg recycled", desc: "Total scrap diverted from landfills" },
  { num: "2,100", unit: "households served", desc: "Families who said yes to recycling" },
  { num: "840", unit: "trees saved", desc: "Equivalent CO₂ offset from our pickups" },
];



// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-gray-100 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3">How it works</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">3 steps. Zero effort.</h2>
        <p className="text-gray-500 mb-12 text-base">The whole thing takes less than a minute to set up.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="relative bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
              {/* Image or icon visual */}
              <div className="w-full h-48 bg-green-50 flex items-center justify-center overflow-hidden">
                
                  <img src={step.img} alt={step.imgAlt} className="w-full h-full object-cover" />
              
              </div>
              {/* Card content */}
              <div className="p-6 flex flex-col gap-2 flex-1">
                <div className="w-7 h-7 bg-green-100 text-green-700 text-xs font-bold rounded-lg flex items-center justify-center mb-1">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
              {/* Connector arrow */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex absolute -right-3.5 top-24 z-10 w-7 h-7 bg-white border border-gray-100 rounded-full items-center justify-center text-gray-400 shadow-sm">
                  <IconChevronRight />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── What We Take ──────────────────────────────────────────────────────────────
function WhatWeTake() {
  return (
    <section id="what-we-take" className="bg-gray-50 py-16 sm:py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3">What we take</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">All kinds of household scrap</h2>
        <p className="text-gray-500 mb-12 text-base">If it's lying around collecting dust, we'll take it.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className={`bg-white rounded-2xl border border-gray-100 ${cat.border} transition-colors flex flex-col overflow-hidden cursor-pointer group`}>
              {/* Image or icon */}
              <div className="h-36 flex items-center justify-center overflow-hidden bg-gray-50">
                  <img src={cat.img} alt={cat.imgAlt} className="w-full h-full object-cover" />
                
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h4 className="text-sm font-bold text-gray-900">{cat.label}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
                <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${cat.tagBg}`}>{cat.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Impact ────────────────────────────────────────────────────────────────────
function Impact() {
  return (
    <section id="impact" className="py-16 sm:py-20 border-t border-gray-100 relative overflow-hidden">
      {/* City view background */}
      <div className="absolute inset-0 z-0">
        <img src={IMAGES.cityView} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gray-900/90" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Our impact</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">Fixing India, one pickup at a time.</h2>
        <p className="text-gray-400 mb-12 text-base">Real numbers from real pickups across India.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {IMPACT.map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
              <p className="text-4xl sm:text-5xl font-extrabold text-lime-400 tracking-tight leading-none">{item.num}</p>
              <p className="text-green-400 font-semibold text-base mt-2">{item.unit}</p>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Strip ─────────────────────────────────────────────────────────────────
function CTAStrip() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => { if (phone.trim().length >= 10) setSubmitted(true); };

  return (
    <section id="book" className="bg-green-500 py-16 sm:py-20">
      <div className="max-w-xl mx-auto px-5 sm:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">Ready to clean up?</h2>
        <p className="text-green-100 text-base mb-8">Enter your number. We'll call you to confirm a free pickup slot.</p>
        {submitted ? (
          <div className="bg-white rounded-2xl px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0"><IconCheck /></div>
            <div className="text-left">
              <p className="text-gray-900 font-bold text-sm">We'll call you shortly!</p>
              <p className="text-gray-500 text-xs mt-0.5">Our team will confirm your free pickup slot.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 flex-col md:flex-row">
              <div className="flex items-center bg-white rounded-xl pl-4 pr-2 flex-1">
                <span className="text-gray-400 mr-2"><IconPhone /></span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your mobile number"
                  className="flex-1 py-4 text-sm text-gray-900 outline-none bg-transparent placeholder-gray-400 font-medium"
                />
              </div>
              <button onClick={handleSubmit} className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm px-6 py-4 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2">
                Book now <IconArrowRight />
              </button>
            </div>
            <p className="text-green-100 text-xs mt-4">Free pickup · No minimum quantity · Available across major Indian cities</p>
          </>
        )}
      </div>
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



// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ onBookClick}: {onBookClick: ()=>void}) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center text-white">
            <IconRecycle />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            Scrap<span className="text-green-500">Seva</span>
          </span>
        </div>
        <ul className="hidden md:flex items-center gap-8">
          {["How it works", "What we take", "Our impact"].map((l) => (
            <li key={l}><a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{l}</a></li>
          ))}
        </ul>
        <button onClick={onBookClick} className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          Schedule pickup
        </button>
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setOpen(!open)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-100 px-5 py-4 flex flex-col gap-4 bg-white">
          {["How it works", "What we take", "Our impact"].map((l) => (
            <a key={l} href="#" className="text-sm font-medium text-gray-600">{l}</a>
          ))}
          <button onClick={onBookClick} className="w-full bg-green-500 text-white text-sm font-semibold py-3 rounded-xl">Schedule pickup</button>
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ onBookClick, onLearnClick }: {onBookClick: ()=>void, onLearnClick: ()=> void}) {
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* Left copy */}
      <div>
        <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide">
          <IconMapPin /> Now serving India
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.08] tracking-tight text-gray-900 mb-5">
          We pick up your <span className="text-green-500">scrap.</span><br />You save the planet.
        </h1>
        <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
          Book a free home pickup in 60 seconds. We collect your old newspapers, bottles, metal, and e-waste — and make sure every bit gets recycled properly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button onClick={onBookClick} className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-base px-7 py-4 rounded-xl transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            Book free pickup
          </button>
          <button onClick={onLearnClick} className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-base px-7 py-4 rounded-xl border border-gray-200 transition-colors">
            See how it works
          </button>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {["100% free pickup", "Same-day slots", "Certified recycling"].map((t) => (
            <div key={t} className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="flex items-center justify-center w-4 h-4 bg-green-100 rounded-full text-green-600"><IconCheck /></span>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Right — real image */}
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
        <img
          src={IMAGES.hero}
          alt="Indian family sorting scrap — newspapers, bottles and cans — for recycling at home"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient for readability of floating cards */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Floating stat — bottom left */}
        <div className="absolute bottom-4 left-4 bg-white rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-md">
          <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
            <IconWeight />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">12,400 kg</p>
            <p className="text-xs text-gray-400 mt-0.5">recycled this month</p>
          </div>
        </div>

        {/* Floating badge — top right */}
        <div className="absolute top-4 right-4 bg-gray-900 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-lime-400"><IconTrendUp /></span>
          <span className="text-white text-xs font-semibold">500+ happy families</span>
        </div>
      </div>
    </section>
  );
}


// ── App ───────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const scrollTo = (id: string) => {
    console.log("pressed"+ id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })};
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar onBookClick={() => scrollTo("book")} />
      <Hero onBookClick={() => scrollTo("book")} onLearnClick={() => scrollTo("how-it-works")} />
      <HowItWorks />
      <WhatWeTake />
      <Impact />
      <CTAStrip />
      <Footer />
    </div>
  );
}