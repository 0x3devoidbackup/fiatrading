"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiatCurrency } from "@/types";
import { api } from "@/api/axios";
import CenterLoader from "@/utils/loader";
import { notify } from "@/utils/notify";
import axios from "axios";
import { X } from "lucide-react";

export default function SendPage() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();

  const [currency, setCurrency] = useState<FiatCurrency | "">("");
  const [quantity, setQuantity] = useState<string>("");
  const [recipientUID, setRecipientUID] = useState<string>("");

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [available, setAvailable] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [otpContinue, setOtpContinuation] = useState<boolean>(false);

  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Update available balance whenever user or currency changes
  useEffect(() => {
    if (!user || !currency) {
      setAvailable(0);
      return;
    }

    switch (currency) {
      case "USD":
        setAvailable(user.fiat.usd_balance ?? 0);
        break;
      case "EUR":
        setAvailable(user.fiat.eur_balance ?? 0);
        break;
      case "GBP":
        setAvailable(user.fiat.gpb_balance ?? 0);
        break;
      default:
        setAvailable(0);
    }
  }, [currency, user]);

  // Submit transaction
  const handleSubmit = async () => {
    const amount = Number(quantity);

    if (!currency || !amount || !recipientUID) {
      notify("Please fill all fields");
      return;
    }

    if (amount > available) {
      notify("Quantity exceeds available balance");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        receiverId: recipientUID,
        currency,
        amount,
      };

      const res = await api.post("/users/assets/send/fiat", payload);
      console.log(res);
      if (res.status === 201 || res.data.otpSendingStatus.status === 200) {
        setOtpContinuation(true);
      }
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";
      console.log(error);

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.errors[0].path +
            ": " +
            error.response?.data?.errors[0].msg ||
          message;
      }
      notify(message);
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
      const data = {
        otp: otpCode,
        email: user?.email
      };
      const response = await api.post("/auth/verify-otp/transaction", data);
      console.log(response);
      if (response.status === 200) {
        notify("Transaction successful")
        setQuantity("");
        setRecipientUID("");
        setCurrency("");
        setOtpContinuation(false)
        await checkAuth();
        router.push("/portfolio")
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
    <div className="max-w-3xl mx-auto px-2 py-4 pb-20 text-white">
      <CenterLoader show={loading} />
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <ArrowLeft
          className="w-6 h-6 cursor-pointer text-neutral-300"
          onClick={() => router.back()}
        />
        <h1 className="text-lg font-bold">Send</h1>
      </div>

      {/* Currency Selector */}
      <div className="bg-[#0e1014] border border-[#1b1e25] rounded-2xl mb-6">
        <div className="relative w-full">
          <select
            required
            value={currency}
            onChange={(e) => setCurrency(e.target.value as FiatCurrency)}
            className="w-full appearance-none bg-[#13151b] border border-[#262a33] hover:border-[#2f343d] transition-colors
                       rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-[#224930]/40 focus:border-[#224930]"
          >
            <option value="">Select Currency</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>

          {/* Custom Arrow */}
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            ▼
          </span>
        </div>
      </div>

      {/* Recipient Input */}
      <p className="mb-3 text-sm">MintFiat UID</p>
      <div className="mb-3 relative">
        <input
          type="text"
          placeholder="MintFiat UID"
          value={recipientUID}
          onChange={(e) => setRecipientUID(e.target.value)}
          className="w-full bg-[#111318] border border-[#1f232d] rounded px-4 py-2 focus:outline-none"
        />
      </div>

      {/* Quantity */}
      <div className="mb-1 text-sm text-gray-400">Quantity</div>
      <div className="mb-2 relative">
        <input
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)} // keep string
          className="w-full bg-[#111318] border border-[#1f232d] rounded px-4 py-2 focus:outline-none"
        />

        <button
          type="button"
          onClick={() => setQuantity(available.toString())} // convert to string
          className="absolute right-4 top-3 text-blue-500 text-sm"
        >
          All
        </button>
      </div>

      <div className="text-sm text-gray-500 mb-3">
        Available {available} {currency || "—"}
      </div>

      {/* Submit Button */}
      <div className="mt-10">
        <button
          disabled={
            loading || !currency || !recipientUID || Number(quantity) <= 0
          }
          onClick={handleSubmit}
          className={`w-full bg-white text-black font-bold py-2 text-sm rounded-xl ${
            loading || !currency || !recipientUID || Number(quantity) <= 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>

      {otpContinue && (
        <div className="fixed inset-0 bg-[#0a0a0a] z-50">
          <div className="max-w-md mx-auto px-4 pb-40 mt-5">
            <div className="flex items-center justify-end mb-4">
              <X
                className="w-6 h-6 font-bold text-neutral-300 cursor-pointer"
                onClick={() => setOtpContinuation(false)}
              />
            </div>
            <CenterLoader show={loading} />

            <h2 className="text-xl font-bold">You're Almost There</h2>

            <p className="text-sm mt-3 opacity-70 mb-1">
              Enter the 6-digit verification code for the email
            </p>

            <p className="text-sm font-semibold mb-8">
              {user?.email}
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
                    type="text"
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
                  className="w-full  cursor-pointer bg-blue-600 py-2 rounded-full font-semibold text-sm"
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
    </div>
  );
}
