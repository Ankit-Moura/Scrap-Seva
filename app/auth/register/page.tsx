"use client"
import React, { useState, useEffect, useRef } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import IconRecycle from '@/components/Icon';
import { useRouter } from "next/navigation";






type Step = "phone" | "otp";

function Register() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const [loading, setLoading] = useState(false);
  
  


 const initRecaptcha = () => {
    // If one already exists, kill it first to avoid duplicates
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
      const container = document.getElementById('recaptcha-container');
      if (container) container.innerHTML = '';
    }

    try {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log("reCAPTCHA solved silently!");
        },
        'expired-callback': () => {
          console.log("reCAPTCHA expired. Recycling instance safely...");
          // Cleanly call the same function to reset the cycle
          initRecaptcha();
        }
      });
      console.log("captcha init")
    } catch (error) {
      console.error("Failed to initialize reCAPTCHA:", error);
    }
  };

  // 2. Setup on initial page mount
  useEffect(() => {
    initRecaptcha();

    // Cleanup when the user leaves the page
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);



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

  

  const handleOtpSubmit = (e: React.FormEvent) => {
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits");
      return;
    }

    setError("");

    // Verify OTP API
    console.log("Verifying OTP", otp);
    handleVerifyOtp(e)
  };

  
const handleVerifyOtp = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!confirmationResult) {
    setError("Session expired. Please request a new OTP.");
    return;
  }

  if (otp.length !== 6) {
    setError("Please enter a valid 6-digit code.");
    return;
  }

  setLoading(true);
  try {
    // This transmits the OTP to Firebase to validate the handshake
    const result = await confirmationResult.confirm(otp);
    
    // Success! The user is securely authenticated
    const user = result.user;
    console.log(`Successfully logged in! Phone: ${user.phoneNumber}`);
    
    // Redirect your user to the dashboard or home page here
    router.push('/');

  } catch (error: any) {
    console.error("OTP Verification Error:", error.message);
    setError("Invalid verification code. Please try again.");
    setOtp(''); // Clear input on failure so they can retry
  } finally {
    setLoading(false);
  }
};


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaVerifierRef.current) return;
    if(!validatePhone()) return;

    try {
      setLoading(true)
      const Ph = "+91" + phoneNumber
      const confirmation = await signInWithPhoneNumber(auth, Ph, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
      setStep("otp");

    } catch (error: any) {
      console.error("SMS Send Error:", error.message);
      // If the handshake fails, wipe the slate clean for another try
      initRecaptcha();
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl bg-white shadow-lg border border-slate-200 p-6">
          {step === "phone" ? (
            <form>
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
                    setPhoneNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="9876543210"
                  className="flex-1 px-4 py-3 outline-none"
                />
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              )}

              <button
  onClick={handleSendOtp}
  disabled={loading}
  className="mt-6 w-full rounded-xl bg-green-500 text-white py-3.5 font-medium active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {loading ? (
    <>
      <svg
        className="h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      Sending...
    </>
  ) : (
    "Send OTP"
  )}
</button>
              <div id='recaptcha-container'></div>
            </form>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                  Verify OTP
                </h1>

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
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] border rounded-xl px-4 py-3 outline-none text-lg"
              />

              {error && (
                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              )}

              <button
  onClick={handleOtpSubmit}
  disabled={loading}
  className="mt-6 w-full rounded-xl bg-green-500 text-white py-3.5 font-medium active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {loading ? (
    <>
      <svg
        className="h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      Verifying...
    </>
  ) : (
    "Verify OTP"
  )}
</button>

              <button
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError("");
                }}
                className="mt-3 w-full text-sm text-slate-500"
              >
                Change Number
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Register;