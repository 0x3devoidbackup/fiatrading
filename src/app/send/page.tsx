"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiatCurrency } from "@/types";
import { api } from "@/api/axios";
import CenterLoader from "@/utils/loader";
import { notify } from "@/utils/notify";
import axios from "axios";

export default function SendPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [currency, setCurrency] = useState<FiatCurrency | "">("");
  const [quantity, setQuantity] = useState<string>("");
  const [recipientUID, setRecipientUID] = useState<string>("");

  const [available, setAvailable] = useState<number>(0);
  const [loading, setLoading] = useState(false);

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
    const amount = Number(quantity); // convert here

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
        recipientUID,
        currency,
        amount: quantity,
      };

      const res = await api.post("/users/assets/send/fiat", payload);
      notify("Transaction successful!");
      console.log(res.data);

      // Reset form
      setQuantity("");
      setRecipientUID("");
      setCurrency("");
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";
      console.log(error)

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.response?.data?.errors[0].path + ": " + error.response?.data?.errors[0].msg || message;
      }
      notify(message);
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
    </div>
  );
}
