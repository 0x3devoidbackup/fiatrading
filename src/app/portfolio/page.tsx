"use client";
import React, { useState, useEffect } from "react";
import PaymentOptions from "@/components/PaymentOptions";
import { Eye, Clock, X, Search } from "lucide-react";
import CryptoSearchPage from "@/components/WithdrawalModal";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { handleFormat } from "@/utils/useableComponents";

export default function PortfolioPage() {
  const { user } = useAuth();
  const [addFunds, setAddFunds] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const fiatAssets = [
    {
      _id: 1,
      name: "USD",
      full: "Dollar",
      amount: user?.fiat?.usd_balance ?? 0,
      usd: user?.fiat?.usd_balance ?? 0,
      icon: "🟢",
    },
    {
      _id: 2,
      name: "EURO",
      full: "EURO",
      amount: user?.fiat?.eur_balance ?? 0,
      usd: (user?.fiat?.eur_balance ?? 0) * 1.09,
      icon: "🟠",
    },
    {
      _id: 3,
      name: "GBP",
      full: "Pounds",
      amount: user?.fiat?.gpb_balance ?? 0,
      usd: (user?.fiat?.gpb_balance ?? 0) * 1.27,
      icon: "🟢",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto text-white px-2 py-4 pb-20 space-y-6">
      {/* TOP SECTION */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <span>Equity Value</span>
          <Eye className="w-4 h-4" />
        </div>

        <h1 className="text-3xl font-bold">
          {handleFormat(user?.fiat?.usd_balance ?? 0)}{" "}
          <span className="text-gray-400 text-sm">USD</span>
        </h1>

        <div className="flex items-center space-x-2 text-sm text-white mt-2">
          <div className="bg-[#141519] px-3 py-2 rounded-lg flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>PNL Analysis</span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-3 gap-3">
        <button
          className="bg-blue-600 py-2 rounded-xl font-semibold text-sm cursor-pointer w-full"
          onClick={() => setAddFunds(!addFunds)}
        >
          Add Funds
        </button>

        <button
          className="bg-[#1b1d22] py-2 rounded-xl font-semibold text-sm cursor-pointer w-full"
          onClick={() => setWithdraw(!withdraw)}
        >
          Withdraw
        </button>

        <Link href="/send">
          <button className="bg-[#1b1d22] py-2 rounded-xl font-semibold text-sm cursor-pointer w-full">
            Send
          </button>
        </Link>
      </div>

      {/* ASSETS LIST HEADER */}
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-lg font-bold">Assets List</h2>
      </div>

      {/* FILTERS */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-gray-400 text-sm">
            <input type="checkbox" className="form-checkbox" />
            <span>Hide small balances</span>
          </label>
        </div>

        <Search className="w-5 h-5 text-gray-400" />
      </div>

      {/* ASSETS LIST */}
      <div className="space-y-6 mt-4">
        {fiatAssets.map((asset) => (
          <div
            key={asset._id}
            className="flex items-center justify-between border-b border-[#1c1d20] pb-4"
          >
            {/* LEFT */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src={`https://www.mintfiat.finance/images/${asset.name.toLowerCase()}.png`}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="font-semibold">{asset.name}</p>
                <p className="text-gray-500 text-xs">{asset.full}</p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <p className="font-semibold text-sm">
                {handleFormat(asset.amount)}
              </p>
              <p className="text-gray-500 text-xs">
                ≈ {handleFormat(asset.usd)} USD
              </p>
            </div>

            {/* TRADE BUTTON */}
            <Link href={`/trade/${asset._id}`}>
              <button className="bg-[#1b1d22] px-4 py-2 rounded-xl font-semibold text-sm">
                Trade
              </button>
            </Link>
          </div>
        ))}
      </div>

      {addFunds && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center
                 md:items-center z-50"
        >
          <div
            className="
                   bg-[#0c0e13]  rounded-t-2xl md:rounded-2xl shadow-xl 
                    w-full md:w-[450px] 
                    p-6 
                    fixed bottom-0 md:static
                    animate-slideUp md:animate-fadeIn
                    "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div></div>
              <h2 className="text-center font-extrabold">
                Please Select Deposit Method
              </h2>
              <X
                className="w-5 h-5 text-white cursor-pointer"
                onClick={() => setAddFunds(!addFunds)}
              />
            </div>

            <PaymentOptions />
          </div>
        </div>
      )}

      {withdraw && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-md mx-auto p-4 pt-4">
            {/* Close Button */}
            <div className="flex items-center justify-end mb-4">
              <X
                className="w-6 h-6 text-neutral-300 cursor-pointer"
                onClick={() => setWithdraw(!withdraw)}
              />
            </div>

            <CryptoSearchPage />
          </div>
        </div>
      )}
    </div>
  );
}
