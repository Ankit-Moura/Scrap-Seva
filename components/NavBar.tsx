"use client"
import { useState } from "react";
import { AnimatePresence, easeInOut, motion } from "motion/react";

import IconRecycle from "./Icon";
import Link from "next/link";

import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { logout, user } = useAuthStore();
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link className="flex items-center gap-2.5 cursor-pointer" href="/#">
          <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center text-white">
            <IconRecycle />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            Scrap<span className="text-green-500">Seva</span>
          </span>
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {user && <Link href="/pickups" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">My Pickups</Link>}
          <li><Link href="/how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">How it works</Link></li>
          <Link href="/market-rates" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Rates & Categories</Link>
          <li><Link href="/contact-us" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Contact Us</Link></li>
        </ul>
        <div className="flex flex-row justify-between align-middle">
          
            <Link href={"/book-pickup"} className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
          Schedule pickup
        </Link>
            {user?<Link href={"/profile"} className="hidden md:flex flex-row cursor-pointer ml-4.5">
                <img className="text-green-400 w-8 h-8" src="/user.svg" alt="user-icon" />
                <p className=" ml-1 translate-y-1">My Profile</p>
            </Link>:<Link className="hidden md:flex flex-row cursor-pointer ml-4.5" href={"/auth/register"}>
                <img className="text-green-400 w-8 h-8" src="/user.svg" alt="user-icon" />
                <p className=" ml-1 translate-y-1">Sign In</p>
            </Link>}
        </div>
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setOpen(!open)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      <AnimatePresence>
      {open && (
        <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.40, ease: easeInOut }}
      className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
      onClick={(p)=>setOpen(!p)}
    >
      <div className="px-5 py-4 flex flex-col gap-4 list-none align-middle">

        <motion.li
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            >
            {user?<Link className="flex flex-row cursor-pointer -translate-x-1" href={"/profile"}>
            <img className="text-green-400 w-6 h-6" src="/user.svg" alt="user-icon" />
                <p className=" align-text-bottom">My Profile</p>
            </Link>
            :
            <Link className="flex flex-row cursor-pointer -translate-x-1" href={"auth/register"}>
                <img className="text-green-400 w-6 h-6" src="/user.svg" alt="user-icon" />
                <p className=" align-text-bottom">Register</p>
            </Link>}
            </motion.li>
        <motion.li
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            >

        <Link href={"/book-pickup"}  onClick={() => {
    setOpen(false)
  }} className="w-full text-green-500 font-semibold text-sm  py-3 rounded-xl">Schedule pickup</Link></motion.li>

   {user && <motion.li
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            >
                <Link href="/pickups"onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600">My pickups</Link>
            </motion.li>}
        <motion.li
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            >
                <Link href="/how-it-works"onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600">How it works</Link>
            </motion.li>
        <motion.li
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            >
                <Link href="/market-rates"onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600">Rates & Categories</Link>
            </motion.li>
        <motion.li
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            >
                <a href="/contact-us"onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600">Contact Us</a>
            </motion.li>
        
          
          
          
        </div>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
}