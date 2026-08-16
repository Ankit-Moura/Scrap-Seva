"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import Image from "next/image";

const productLinks = [
  { name: "How it works", href: "/how-it-works" },
  { name: "Today's rates", href: "/market-rates" },
  { name: "Business", href: "/contact-us" },
  { name: "Schedule Pickup", href: "/book-pickup" },
];

const companyLinks = [
  { name: "About", href: "#" },
  { name: "Partners", href: "#" },
  { name: "Careers", href: "#" },
  { name: "Contact", href: "/contact-us" },
];

const legalLinks = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  
];



export default function Footer() {
  return (
    <footer className="pt-16 md:pt-40 pb-12 md:pb-20 border-t border-[var(--color-line)] bg-[var(--color-bg)]">
      <section className="mx-auto max-w-7xl px-5 md:px-6 pb-10 md:pb-12">
        <div className="grid gap-12 md:gap-16 grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand + app badges */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Recycler Club logo"
                width={48}
                height={48}
                priority
                className="h-10 w-10 md:h-12 md:w-12"
              />
              <h3 className="text-xl md:text-2xl font-bold text-[var(--color-ink)]">
                Recycler Club
              </h3>
            </div>

            <p className="mt-5 md:mt-6 max-w-sm leading-7 text-[var(--color-ink-soft)] text-sm md:text-base">
              Making recycling simpler, one pickup at a time. Earn more from
              your recyclable waste with verified partners.
            </p>

            <div className="mt-6 md:mt-8 space-y-3 text-sm text-[var(--color-ink-soft)]">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[var(--color-primary)] shrink-0" />
                <span>admin@recyclerclub.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[var(--color-primary)] shrink-0" />
                <span>Serving cities across India</span>
              </div>
            </div>
          </div>

          {/* Links — 2-col grid on mobile, 3 separate cols on desktop */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            <div>
              <h4 className="mb-4 md:mb-5 font-semibold text-[var(--color-ink)] text-sm md:text-base">
                Product
              </h4>
              <div className="space-y-3">
                {productLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-sm md:text-base text-[var(--color-ink-soft)] transition hover:text-[var(--color-primary)]"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 md:mb-5 font-semibold text-[var(--color-ink)] text-sm md:text-base">
                Company
              </h4>
              <div className="space-y-3">
                {companyLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-sm md:text-base text-[var(--color-ink-soft)] transition hover:text-[var(--color-primary)]"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 md:mb-5 font-semibold text-[var(--color-ink)] text-sm md:text-base">
                Legal
              </h4>
              <div className="space-y-3">
                {legalLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-sm md:text-base text-[var(--color-ink-soft)] transition hover:text-[var(--color-primary)]"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar: copyright + social (left), app badges (right) */}
        <div className="mt-12 md:mt-16 flex flex-col gap-8 border-t border-[var(--color-line)] pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
            <p className="text-sm text-[var(--color-ink-soft)] order-2 md:order-1">
              © {new Date().getFullYear()} Recycler Club. All rights reserved.
            </p>

            <div className="flex items-center gap-6 md:gap-8 text-sm order-1 md:order-2">
              <Link href="#" className="text-[var(--color-ink-soft)] transition hover:text-[var(--color-primary)]">
                Instagram
              </Link>
              <Link href="#" className="text-[var(--color-ink-soft)] transition hover:text-[var(--color-primary)]">
                LinkedIn
              </Link>
              <Link href="#" className="text-[var(--color-ink-soft)] transition hover:text-[var(--color-primary)]">
                X
              </Link>
            </div>
          </div>

             {/* App store badges */}
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Link
              href="#"
              className="flex items-center gap-2.5 rounded-xl bg-black px-4 py-2.5 text-white transition hover:bg-black/85"
            >
              <Image src="/apple-logo.svg" className="text-white" alt="Apple logo" width={20} height={20} />
              <span className="flex flex-col leading-tight">
                <span className="text-[10px] text-white/70">Download on the</span>
                <span className="text-sm font-semibold -mt-0.5">App Store</span>
              </span>
            </Link>
 
            <Link
              href="#"
              className="flex items-center gap-2.5 rounded-xl bg-black px-4 py-2.5 text-white transition hover:bg-black/85"
            >
              <Image src="/playstore-logo.svg" alt="Google Play logo" width={20} height={20} />
              <span className="flex flex-col leading-tight">
                <span className="text-[10px] text-white/70">Get it on</span>
                <span className="text-sm font-semibold -mt-0.5">Google Play</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}