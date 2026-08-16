"use client"
import { useState } from "react";
import { AnimatePresence, easeInOut, motion } from "motion/react";

import IconRecycle from "./Icon";
import Link from "next/link";

import { useAuthStore } from "@/store/authStore";

import { label } from "framer-motion/client"
import { Recycle, UserCircle2, Menu, X } from "lucide-react"


const navLinks = [{label: "How it works", href: "/how-it-works"}, {label: "Today's rates", href: "/market-rates"}, {label: "Contact Us", href: "/contact-us"}]


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { logout, user } = useAuthStore();
  const [open, setOpen] = useState(false);
  return (
    <nav className="w-full bg-(--color-bg) border-b border-(--color-line) relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 py-3.5 md:py-4">

        {/* Logo */}
        <Link href={"/"}>
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div  className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center">
            <img className="w-full h-full object-contain" src="./logo.svg" alt="recycler club logo" />
          </div>
          <span className="text-lg md:text-xl font-semibold tracking-tight text-(--color-ink)">
            RecyclerClub
          </span>
        </motion.div>
        </Link>

        {/* Middle: nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-(--color-ink-soft)">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="relative group py-1 hover:text-(--color-ink) transition-colors focus-visible:outline-none focus-visible:text-(--color-ink)"
            >
              {link.label}
              <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-full origin-left scale-x-0 bg-(--color-primary) transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </Link>
          ))}
        </div>

        {/* Right: user icon + schedule pickup */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <Link href={"/profile"}>
          <motion.button
            aria-label="Account"
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-(--color-ink-soft) hover:text-(--color-ink) hover:bg-(--color-bg-deep) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
            whileHover={{ scale: 1.08, rotate: -6 }}
            whileTap={{ scale: 0.92 }}
          >
            <UserCircle2 className="w-6 h-6" strokeWidth={1.8} />
          </motion.button>
          </Link>
          <Link href={"/book-pickup"}>
          <motion.button
            className="hidden md:block relative overflow-hidden rounded-full px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium border border-(--color-accent) text-(--color-ink) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 whitespace-nowrap"
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.96 }}
            animate="rest"
          >
            <motion.span
              className="absolute inset-0 bg-(--color-primary)"
              variants={{
                rest: { scaleX: 0 },
                hover: { scaleX: 1 },
              }}
              style={{ originX: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            />
            <motion.span
              className="relative z-10"
              variants={{
                rest: { color: "var(--color-primary-dark)" },
                hover: { color: "var(--color-accent)" },
              }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <span className="sm:hidden">Pickup</span>
              <span className="hidden sm:inline">Schedule pickup</span>
            </motion.span>
          </motion.button>
          </Link>

          {/* Hamburger — mobile only */}
          <motion.button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-(--color-ink-soft) hover:text-(--color-ink) hover:bg-(--color-bg-deep) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
            whileTap={{ scale: 0.92 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <X className="w-5 h-5" strokeWidth={1.8} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <Menu className="w-5 h-5" strokeWidth={1.8} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-(--color-line) bg-(--color-bg)"
          >
            <div className="flex flex-col px-4 sm:px-6 py-3 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 text-sm font-medium text-(--color-ink-soft) hover:text-(--color-ink) transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="sm:hidden flex items-center gap-2 py-2.5 text-sm font-medium text-(--color-ink-soft) hover:text-(--color-ink) transition-colors"
              >
                <UserCircle2 className="w-4 h-4" strokeWidth={1.8} />
                Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}