"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Check } from "lucide-react";
import { api } from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { notify } from "@/utils/notify";
import axios from "axios";
import CenterLoader from "@/utils/loader";

const SigupPage = () => {
  const router = useRouter();
  const [emailContinue, setEmailContinue] = useState<boolean>(false);
  const [passwordContinue, setPasswordContinue] = useState<boolean>(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralUID, setReferralUID] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const rules = {
    length: password.length >= 10 && password.length <= 128,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
  const isPasswordValid = Object.values(rules).every(Boolean);
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleEmailContinuation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email) return;

    if (!isValidEmail(email)) {
      notify("Invalid email address");
      return;
    }

    try {
      setLoading(true);
      const data = { email: email.trim().toLowerCase() };
      const response = await api.post("/auth/signup", data);
      const responseData = response.data;
      if (
        response.status === 201 &&
        responseData.otpSendingStatus.status === 200
      ) {
        setEmailContinue(true);
      }
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }
      notify(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCodeContinuation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const isComplete =
      Array.isArray(code) &&
      code.length === 6 &&
      code.every((digit) => digit !== "");

    if (!isComplete) {
      notify("OTP code is incomplete");
      return;
    }
    const otpCode = code.join("");
    try {
      setLoading(true);
      const data = { email: email.trim().toLowerCase(), otp: otpCode };
      const response = await api.post("/auth/verify-otp/verify-email", data);
      console.log(response);
      if (response.status === 200) {
        setPasswordContinue(true);
      }
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }
      notify(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPasswordValid) {
      notify("Password does not meet requirements");
      return;
    }

    try {
      setLoading(true);

      //input data
      const data = {
        email: email.trim().toLowerCase(),
        password,
        referralId: referralUID,
      };
      const response = await api.post("/auth/complete-registration", data);
      console.log(response);
      if (response.status === 200) {
        notify(response.data.message);
        router.push("/signin");
      }
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }
      notify(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-40">
      <CenterLoader show={loading} />

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <img
            src="https://violet-recent-skunk-362.mypinata.cloud/ipfs/bafkreih2bop2brxlarnn3mkpmaesju4wodw33lrqyfk4jvxxa6duki2cfa"
            className="w-10 h-10"
          />
          <Link href="/signin">
            <button className="text-white cursor-pointer font-semibold hover:underline">
              Sign In
            </button>
          </Link>
        </div>

        <div className="mt-30">
          <h1 className="font-extrabold text-3xl">
            Mint Your Growth with Fiat
          </h1>

          <p className="text-[#9DD1F1] font-bold mt-3">Sign Up</p>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <form onSubmit={handleEmailContinuation}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#1f1f1f] rounded-3xl"
              required
            />

            <div className="mt-5">
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-white text-black py-2 rounded-3xl font-semibold hover:shadow-lg transition-all"
              >
                Continue
              </button>
            </div>
          </form>

          <div className="text-start mt-6 text-white opacity-50 text-[12px] flex items-start space-x-2 mb-5">
            <input type="checkbox" checked readOnly className="mt-1" />
            <p>
              I have read and agree to the MINTFIAT User Agreement and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>

      {emailContinue && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50">
          <div className="max-w-md mx-auto px-4 pb-40 mt-5">
            <div className="flex items-center justify-end mb-4">
              <X
                className="w-6 h-6 font-bold text-neutral-300 cursor-pointer"
                onClick={() => setEmailContinue(false)}
              />
            </div>
            <CenterLoader show={loading} />

            <h2 className="text-xl font-bold">You're Almost There</h2>

            <p className="text-sm mt-3 opacity-70 mb-1">
              Enter the 6-digit verification code for the email
            </p>

            <p className="text-sm font-semibold mb-8">
              {email}
              <span className="opacity-60">(valid for 15 minutes)</span>
            </p>

            <form onSubmit={handleCodeContinuation}>
              <div className="flex items-center justify-between m-auto mb-4 max-w-sm">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputsRef.current[i] = el;
                    }}
                    id={`otp-${i}`}
                    type="number"
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleCodeChange(e.target.value, i)}
                    className="w-12 h-12 text-center text-xl font-semibold bg-[#111] border border-[#222] rounded-xl focus:outline-none focus:border-blue-500"
                  />
                ))}
              </div>

              <div className="mb-10 text-sm">
                {/* <p className="opacity-50 ">
                  Get code again after <span className="text-white">7s</span>
                </p> */}
                <button type="button" className="text-[#9DD1F1] cursor-pointer">
                  Request Again
                </button>
              </div>

              <div className="px-5 pb-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer bg-blue-600 py-2 rounded-full font-semibold text-sm"
                >
                  Next
                </button>

                <p className="text-center mt-5 text-blue-600 text-sm">
                  Didn't Receive Verification Code ?
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {passwordContinue && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50">
          <div className="max-w-md mx-auto px-4 pb-40 mt-5">
            <div className="flex items-center justify-start mb-4">
              <ArrowLeft
                className="w-6 h-6 font-bold text-neutral-300 cursor-pointer"
                onClick={() => setPasswordContinue(false)}
              />
            </div>
            <CenterLoader show={loading} />

            <h2 className="text-xl font-bold">All Set! Enter Password</h2>

            <p className="text-sm mt-3 opacity-70 mb-6">
              Set a password to complete sign-up
            </p>

            <form onSubmit={handleSignUp}>
              {/* Password Input */}
              <div className="relative mb-6">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Set your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-white/60"
                >
                  {show ? "🙈" : "👁️"}
                </button>
              </div>

              <ul className="space-y-2 text-sm mb-20">
                <Rule active={rules.length} text="10–128 characters" />
                <Rule active={rules.upper} text="At least 1 uppercase letter" />
                <Rule active={rules.lower} text="At least 1 lowercase letter" />
                <Rule active={rules.number} text="At least 1 number" />
              </ul>

              <div className=" mt-10">
                <button className="w-full text-sm cursor-pointer bg-blue-600 py-3 rounded-full font-semibold ">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SigupPage;

function Rule({ active, text }: { active: boolean; text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`text-lg ${active ? "text-blue-500" : "text-white/30"}`}>
        <Check className="w-5 h-5" />
      </span>
      <span className={`${active ? "text-white" : "text-white/40"}`}>
        {text}
      </span>
    </li>
  );
}
