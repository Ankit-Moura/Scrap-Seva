"use client"
// Fonts: add once in app/layout.tsx and pass the variables down —
//
//   import { Fraunces, Inter } from "next/font/google";
//   const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["500","600"] });
//   const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
//   <body className={`${fraunces.variable} ${inter.variable}`}>
//
// Fraunces gives the wordmark and heading some warmth (a scrap-paper, hand-set
// feel) without tipping into decorative; Inter stays out of the way for the
// numbers people are actually typing.

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/store/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const RESEND_SECONDS = 30;
const OTP_LENGTH = 6;

type Step = "phone" | "otp";

function Register() {
  const router = useRouter();
  const { user, setUser, setTokens } = useAuthStore();

  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (step === "otp") otpRefs.current[0]?.focus();
  }, [step]);

  const startResendCooldown = () => {
    setResendCooldown(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validatePhone = () => {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (!cleaned) {
      setError("Please enter your mobile number");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setError("Enter a valid Indian mobile number");
      return false;
    }

    setError("");
    return true;
  };

  const sendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE}/auth/request-otp/`, {
        phone_number: phoneNumber,
      });
      setStep("otp");
      startResendCooldown();
    } catch (err: any) {
      const message =
        err.response?.data?.phone_number?.[0] ||
        err.response?.data?.error ||
        "Failed to send OTP. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) return;
    sendOtp();
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0 || loading) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    sendOtp();
  };

  const setDigit = (index: number, value: string) => {
    const next = [...otp];
    next[index] = value;
    setOtp(next);
  };

  const handleOtpChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setDigit(index, "");
      return;
    }
    // handles both single keystrokes and a fast paste landing in one box
    const chars = digits.split("");
    const next = [...otp];
    let cursor = index;
    for (const ch of chars) {
      if (cursor >= OTP_LENGTH) break;
      next[cursor] = ch;
      cursor++;
    }
    setOtp(next);
    const focusTarget = Math.min(cursor, OTP_LENGTH - 1);
    otpRefs.current[focusTarget]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      setDigit(index - 1, "");
    }
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (!/^\d{6}$/.test(code)) {
      setError("Enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp/`, {
        phone_number: phoneNumber,
        code,
      });

      const { access, refresh, user: userData } = res.data;

      setTokens({ access, refresh });
      setUser(userData);

      router.push('/');
    } catch (err: any) {
      const message = err.response?.data?.error || "That code didn't match. Try again.";
      setError(message);
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-ink)]">
        {user.username || user.phone_number} logged in, go back to home page
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4 [font-family:var(--font-body,ui-sans-serif)]">
      <div className="w-full max-w-sm">
        <div className="relative rounded-[28px] bg-[var(--color-bg-card)] shadow-[0_20px_50px_-25px_rgba(23,35,27,0.35)] border border-[var(--color-line)] overflow-hidden">

          {/* signature: a loose recycling loop, drawn (not stock-icon), sitting
              behind the header like a watermark — a nod to scrap material
              being turned back into something, without illustrating a leaf
              or a globe like every other green app does */}
          <svg
            className="absolute -top-10 -right-14 w-44 h-44 opacity-[0.08] pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M100 20 C 40 20, 20 60, 30 100 C 38 132, 62 150, 90 156"
              stroke="var(--color-primary)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path d="M78 140 L90 156 L104 138" stroke="var(--color-primary)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path
              d="M100 180 C 160 180, 180 140, 170 100 C 162 68, 138 50, 110 44"
              stroke="var(--color-accent)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path d="M122 60 L110 44 L96 62" stroke="var(--color-accent)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          {/* header band */}
          <div className="relative px-7 pt-7 pb-6 bg-[var(--color-bg-deep)]">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.svg" alt="Recycler Club" width={36} height={36} className="shrink-0" priority />
              <div className="text-xl tracking-tight [font-family:var(--font-display,Georgia,serif)] font-medium text-[var(--color-ink)]">
                Recycler<span className="text-[var(--color-primary)]">Club</span>
              </div>
            </div>
          </div>

          {/* form area */}
          <div className="px-7 pt-6 pb-7">
            {step === "phone" ? (
              <form onSubmit={handleSendOtp} noValidate>
                <h1 className="text-[1.35rem] leading-snug [font-family:var(--font-display,Georgia,serif)] font-medium text-[var(--color-ink)]">
                  What's your number?
                </h1>
                <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
                  We'll text you a one-time code — no password to remember.
                </p>

                <label htmlFor="phone" className="sr-only">Mobile number</label>
                <div
                  className={`mt-6 flex items-center rounded-2xl bg-[var(--color-bg)] border transition-colors ${
                    error ? "border-red-400" : "border-[var(--color-line)] focus-within:border-[var(--color-primary)]"
                  }`}
                >
                  <div className="px-4 py-3.5 text-[var(--color-ink-soft)] font-medium border-r border-[var(--color-line)]">
                    +91
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    autoFocus
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="98765 43210"
                    className="flex-1 min-w-0 bg-transparent px-4 py-3.5 outline-none text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/60 tracking-wide"
                  />
                </div>

                {error && (
                  <p className="mt-2.5 text-sm text-red-600" role="alert">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full rounded-2xl bg-[var(--color-primary)] text-white py-3.5 font-medium tracking-wide active:scale-[0.98] transition disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Sending
                    </>
                  ) : (
                    "Send code"
                  )}
                </button>

                <p className="mt-5 text-center text-xs text-[var(--color-ink-soft)] leading-relaxed">
                  By continuing you agree to Recycler Club's Terms and Privacy Policy.
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} noValidate>
                <h1 className="text-[1.35rem] leading-snug [font-family:var(--font-display,Georgia,serif)] font-medium text-[var(--color-ink)]">
                  Enter the code
                </h1>
                <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
                  Sent to <span className="text-[var(--color-ink)] font-medium">+91 {phoneNumber}</span>
                </p>

                <div className="mt-6 flex justify-between gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-13 aspect-[0.85/1] text-center text-lg font-medium rounded-xl bg-[var(--color-bg)] border outline-none text-[var(--color-ink)] transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]/25 ${
                        error ? "border-red-400" : "border-[var(--color-line)]"
                      }`}
                    />
                  ))}
                </div>

                {error && (
                  <p className="mt-2.5 text-sm text-red-600" role="alert">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full rounded-2xl bg-[var(--color-primary)] text-white py-3.5 font-medium tracking-wide active:scale-[0.98] transition disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Verifying
                    </>
                  ) : (
                    "Verify & continue"
                  )}
                </button>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setOtp(Array(OTP_LENGTH).fill(""));
                      setError("");
                    }}
                    className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    Change number
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || loading}
                    className={
                      resendCooldown > 0
                        ? "text-[var(--color-ink-soft)]/50 cursor-not-allowed"
                        : "text-[var(--color-primary)] font-medium hover:text-[var(--color-primary-dark)]"
                    }
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export default Register;