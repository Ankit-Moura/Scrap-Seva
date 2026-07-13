"use client"
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import IconRecycle from '@/components/Icon';
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/store/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const RESEND_SECONDS = 30;

type Step = "phone" | "otp";

function Register() {
  const router = useRouter();
  const { user, setUser, setTokens } = useAuthStore();

  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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
    setOtp("");
    sendOtp();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp/`, {
        phone_number: phoneNumber,
        code: otp,
      });

      const { access, refresh, user: userData } = res.data;

      setTokens({ access, refresh });
      setUser(userData);

      router.push('/');
    } catch (err: any) {
      const message = err.response?.data?.error || "Invalid or expired OTP. Please try again.";
      setError(message);
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <>
        <div>{user.username || user.phone_number} logged in</div>
        <div>{user.phone_number}</div>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl bg-white shadow-lg border border-slate-200 p-6">
          {step === "phone" ? (
            <form onSubmit={handleSendOtp}>
              <div className="mb-8">
                <div className='flex flex-row space-x-2 items-center'>
                  <div className='text-white p-2.5 bg-green-500 w-fit rounded-2xl'><IconRecycle/></div>
                  <div className='text-xl font-bold'><span>Scrap</span><span className='text-green-500'>Seva</span></div>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Enter your mobile number to continue
                </p>
              </div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile Number
              </label>

              <div className="flex items-center border rounded-xl bg-white overflow-hidden">
                <div className="px-4 py-3 bg-slate-100 border-r text-slate-600 font-medium">
                  +91
                </div>

                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="9876543210"
                  className="flex-1 px-4 py-3 outline-none"
                />
              </div>

              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-green-500 text-white py-3.5 font-medium active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Verify OTP</h1>
                <p className="mt-2 text-sm text-slate-500">
                  OTP sent to +91 {phoneNumber}
                </p>
              </div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] border rounded-xl px-4 py-3 outline-none text-lg"
              />

              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-green-500 text-white py-3.5 font-medium active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="mt-3 flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setError("");
                  }}
                  className="text-slate-500"
                >
                  Change Number
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className={resendCooldown > 0 ? "text-slate-400 cursor-not-allowed" : "text-green-600 font-medium"}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default Register;