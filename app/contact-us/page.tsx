// app/contact-us/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import * as Icons from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL 

const CATEGORIES = [
  { value: "general_inquiry", label: "General inquiry", icon: "MessageCircle" },
  { value: "pickup_issue", label: "Pickup issue", icon: "Truck" },
  { value: "payment_issue", label: "Payment / Wallet", icon: "Wallet" },
  { value: "account_issue", label: "Account issue", icon: "UserCircle" },
  { value: "app_bug", label: "Report a bug", icon: "Bug" },
  { value: "kabadiwala_signup", label: "Become a kabadiwala", icon: "HandCoins" },
  { value: "business_inquiry", label: "Business / bulk pickup", icon: "Building2" },
  { value: "other", label: "Something else", icon: "MoreHorizontal" },
] as const;

type CategoryValue = (typeof CATEGORIES)[number]["value"];

export default function ContactUsPage() {
  const { user, tokens } = useAuthStore();

  const [category, setCategory] = useState<CategoryValue | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isLoggedIn = !!user;

  const validate = () => {
    if (!category) return "Choose what this is about.";
    if (!subject.trim()) return "Give it a short subject.";
    if (!description.trim()) return "Tell us a bit more.";
    if (!isLoggedIn && !contactEmail.trim() && !contactPhone.trim()) {
      return "Share an email or phone number so we can get back to you.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const headers = isLoggedIn ? { Authorization: `Bearer ${tokens?.access}` } : {};
      await axios.post(
        `${API_BASE}/contact-us/`,
        {
          category,
          subject,
          description,
          ...(isLoggedIn ? {} : {
            contact_name: contactName,
            contact_email: contactEmail,
            contact_phone: contactPhone,
          }),
        },
        { headers }
      );
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Couldn't send your message. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF8F3] px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-sm text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#228B57]"
          >
            <Icons.Check className="h-7 w-7 text-white" />
          </motion.div>
          <h1 className="mt-5 font-serif text-2xl text-[#2B2B24]">Message sent</h1>
          <p className="mt-2 text-sm text-[#8A8375]">
            We'll get back to you {isLoggedIn ? "soon" : "at the contact you shared"}.
            {isLoggedIn && " You can also track this in your ticket history."}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setCategory(null);
              setSubject("");
              setDescription("");
              setContactName("");
              setContactEmail("");
              setContactPhone("");
            }}
            className="mt-6 text-sm font-medium text-[#228B57] hover:underline"
          >
            Send another message
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-xl"
      >
        <div className="text-center">
          <span className="text-xs font-medium uppercase tracking-wide text-[#228B57]">
            Get in touch
          </span>
          <h1 className="mt-2 font-serif text-[30px] leading-tight text-[#2B2B24]">
            How can we help?
          </h1>
          <p className="mt-2 text-sm text-[#8A8375]">
            Questions, complaints, ideas — we read everything.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-9">
          {/* Category picker */}
          <span className="text-xs font-semibold uppercase tracking-wide text-[#8A8375]">
            What's this about
          </span>
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const Icon = (Icons as any)[cat.icon] as React.ElementType;
              const active = category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition ${
                    active ? "border-[#228B57] bg-[#228B57]/5" : "border-[#EBE6DA] bg-white"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${active ? "text-[#228B57]" : "text-[#8A8375]"}`} />
                  <span className={`text-[11px] leading-tight ${active ? "text-[#228B57] font-medium" : "text-[#8A8375]"}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subject + description */}
          <div className="mt-6">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#8A8375]">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary"
              maxLength={200}
              className="mt-1.5 w-full rounded-xl border border-[#D8D2C2] bg-white px-4 py-2.5 text-sm text-[#2B2B24] outline-none placeholder:text-[#B5AE9D] focus:border-[#228B57] focus:ring-2 focus:ring-[#228B57]/20"
            />
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#8A8375]">
              Tell us more
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened, or what you'd like to know"
              rows={5}
              className="mt-1.5 w-full resize-none rounded-xl border border-[#D8D2C2] bg-white px-4 py-2.5 text-sm text-[#2B2B24] outline-none placeholder:text-[#B5AE9D] focus:border-[#228B57] focus:ring-2 focus:ring-[#228B57]/20"
            />
          </div>

          {/* Contact details — only for logged-out visitors */}
          <AnimatePresence>
            {!isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden rounded-xl border border-[#EBE6DA] bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8A8375]">
                  How should we reach you
                </p>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Name"
                  className="mt-2.5 w-full rounded-lg border border-[#D8D2C2] px-3.5 py-2 text-sm outline-none focus:border-[#228B57] focus:ring-2 focus:ring-[#228B57]/20"
                />
                <div className="mt-2 flex gap-2">
                  <input
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    className="flex-1 rounded-lg border border-[#D8D2C2] px-3.5 py-2 text-sm outline-none focus:border-[#228B57] focus:ring-2 focus:ring-[#228B57]/20"
                  />
                  <input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Phone"
                    type="tel"
                    className="w-32 rounded-lg border border-[#D8D2C2] px-3.5 py-2 text-sm outline-none focus:border-[#228B57] focus:ring-2 focus:ring-[#228B57]/20"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-xl bg-[#228B57] py-3 text-sm font-medium text-white transition hover:bg-[#1c6f47] disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}