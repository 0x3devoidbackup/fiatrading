"use client";
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { api } from "@/api/axios";
import axios from "axios";
import CenterLoader from "@/utils/loader";
import { notify } from "@/utils/notify";
import { useRouter } from "next/navigation";

interface PaymentOpt {
  type: "paypal"; // can extend later
}

const PaymentOptions = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // Step state
  const [selectedOption, setSelectedOption] = useState<PaymentOpt | null>(
    null
  );

  // Form state
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GPB">("USD");

  // Handle deposit
  async function handleDeposit(opt: PaymentOpt) {
    if (!amount || Number(amount) <= 0) {
      notify("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);

      if (opt.type === "paypal") {
        const response = await createPaypalOrder();
        if (response?.status === 200) {
          const url = response.data.redirect_url;
          router.push(url);
        }
      }
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";
      console.log(error);

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }
      notify(message);
    } finally {
      setLoading(false);
    }
  }

  async function createPaypalOrder() {
    for (let i = 0; i < 2; i++) {
      try {
        const data = { amount: Number(amount), currency };
        return await api.post("/auth/paypal/order/create", data);
      } catch (err: any) {
        if (i === 1) throw err;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  // Step 1: Show payment options
  if (!selectedOption) {
    return (
      <div className="bg-[#1b1d22] p-4 mt-5 rounded-xl max-w-md mx-auto space-y-4">
        <div
          className="flex justify-between items-center cursor-pointer p-3 bg-neutral-900 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition"
          onClick={() => setSelectedOption({ type: "paypal" })}
        >
          <div className="flex space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="https://www.mintfiat.finance/images/paypal.png"
                alt=""
                width={40}
                height={40}
                className="object-contain rounded"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-lg">PayPal</h3>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white" />
        </div>

        {/* You can add more payment options here later */}
      </div>
    );
  }

  return (
    <>
      <CenterLoader show={loading} />
      <div className="bg-[#1b1d22] p-4 mt-5 rounded-xl max-w-md mx-auto space-y-4">
        <button
          onClick={() => setSelectedOption(null)}
          className="text-sm text-blue-500"
        >
          ← Back to payment options
        </button>

        <div className="flex items-center space-x-3">
          <img
            src={`https://www.mintfiat.finance/images/${selectedOption.type}.png`}
            alt=""
            width={40}
            height={40}
            className="object-contain rounded"
          />
          <h3 className="font-bold text-lg">{selectedOption.type}</h3>
        </div>

        {/* Amount input */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Amount</label>
          <input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#111318] border border-[#1f232d] rounded px-4 py-2 text-white focus:outline-none"
          />
        </div>

        {/* Currency selector */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Currency</label>
          <select
            value={currency}
            onChange={(e) =>
              setCurrency(e.target.value as "USD" | "EUR" | "GPB")
            }
            className="w-full bg-[#111318] border border-[#1f232d] rounded px-4 py-2 text-white focus:outline-none"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GPB">GPB</option>
          </select>
        </div>

        {/* Submit button */}
        <button
          onClick={() => handleDeposit(selectedOption)}
          disabled={loading}
          className={`w-full mt-3 text-sm py-2 rounded-xl font-bold cursor-pointer ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {loading ? "Processing..." : "Deposit"}
        </button>
      </div>
    </>
  );
};

export default PaymentOptions;
