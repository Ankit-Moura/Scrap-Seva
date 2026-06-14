"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import IconRecycle from "@/components/Icon";

type Step = "details" | "otp";

function useResendTimer(initial = 30) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!seconds) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const start = () => setSeconds(initial);

  return {
    seconds,
    start,
    active: seconds > 0,
  };
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("details");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const { seconds, start } = useResendTimer(30);

  const validateName = () => {
    const regex = /^[A-Za-z ]{3,50}$/;

    if (!fullName.trim()) {
      setNameError("Full name is required");
      return false;
    }

    if (!regex.test(fullName.trim())) {
      setNameError("Enter a valid full name");
      return false;
    }

    setNameError("");
    return true;
  };

  const validatePhone = () => {
    const regex = /^[6-9]\d{9}$/;

    if (!phone) {
      setPhoneError("Mobile number is required");
      return false;
    }

    if (!regex.test(phone)) {
      setPhoneError("Enter a valid Indian mobile number");
      return false;
    }

    setPhoneError("");
    return true;
  };

  const handleDetailsSubmit = async () => {
    const nameValid = validateName();
    const phoneValid = validatePhone();

    if (!nameValid || !phoneValid) return;

    setLoading(true);

    try {
      /*
      await sendOTP(phone);
      */

      start();
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const next = [...otp];
    next[index] = value.slice(-1);

    setOtp(next);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const verifyOTP = async () => {
    const code = otp.join("");

    if (!/^\d{6}$/.test(code)) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpError("");
    setLoading(true);

    try {
      /*
      await verifyOtp(phone, code);
      */

      setVerified(true);

      setTimeout(() => {
        console.log("redirect");
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setOtp(["", "", "", "", "", ""]);
    start();

    /*
    await resendOtp(phone);
    */
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
          <div className="mb-8">
             <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center text-white">
            <IconRecycle />
          </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Join Scrap Seva
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Create your account and start booking scrap pickups.
            </p>
          </div>

          <div className="flex items-center mb-8">
            <div
              className={`h-1 flex-1 rounded-full ${
                step === "details" ? "bg-green-500" : "bg-green-500"
              }`}
            />

            <div
              className={`h-1 flex-1 rounded-full ml-2 ${
                step === "otp" ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    value={fullName}
                    onBlur={validateName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                  />

                  {nameError && (
                    <p className="text-red-500 text-sm mt-1">{nameError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>

                  <div className="flex items-center border border-gray-300 rounded-xl px-4">
                    <span className="mr-3 text-gray-500">+91</span>

                    <input
                      value={phone}
                      maxLength={10}
                      inputMode="numeric"
                      onBlur={validatePhone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      placeholder="9876543210"
                      className="flex-1 py-3 outline-none"
                    />
                  </div>

                  {phoneError && (
                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                  )}
                </div>

                <button
                  onClick={handleDetailsSubmit}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <button
                    onClick={() => setStep("details")}
                    className="text-sm text-green-600 font-medium"
                  >
                    ← Change Number
                  </button>

                  <h2 className="font-semibold text-lg mt-3">
                    Verify Mobile Number
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    OTP sent to +91 {phone}
                  </p>
                </div>

                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      value={digit}
                      maxLength={1}
                      inputMode="numeric"
                      onChange={(e) =>
                        handleOTPChange(index, e.target.value)
                      }
                      className="w-12 h-14 rounded-xl border border-gray-300 text-center text-lg font-bold outline-none focus:border-green-500"
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-red-500 text-sm">{otpError}</p>
                )}

                <button
                  onClick={verifyOTP}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="text-center">
                  {seconds > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend OTP in {seconds}s
                    </p>
                  ) : (
                    <button
                      onClick={resendOTP}
                      className="text-green-600 font-medium text-sm"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"
                  >
                    <div className="text-3xl mb-2">✅</div>

                    <p className="font-medium text-green-700">
                      Mobile Number Verified
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}