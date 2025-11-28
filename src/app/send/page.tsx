"use client"
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from "next/navigation";


export default function SendPage() {
    const router = useRouter();

    const [tab, setTab] = useState('mexc');

    return (
        <div className="min-h-screen bg-black text-white p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <ArrowLeft
                    className="w-6 h-6 cursor-pointer text-neutral-300"
                    onClick={() => router.back()}
                />
                <h1 className="text-lg font-bold">Send</h1>
            </div>
            {/* Token Selector */}
            <div className="bg-[#0e1014] border border-[#1b1e25] rounded-2xl mb-6">

                <div className="relative w-full">
                    <select
                        required
                        className="w-full appearance-none bg-[#13151b] border border-[#262a33] hover:border-[#2f343d] transition-colors
                       rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-[#224930]/40 focus:border-[#224930]"
                    >
                        <option value="" className="bg-[#0e1014]">Select Token</option>
                        <option value="USD" className="bg-[#0e1014]">USD</option>
                        <option value="EUR" className="bg-[#0e1014]">EUR</option>
                        <option value="GBP" className="bg-[#0e1014]">GBP</option>
                        <option value="NGN" className="bg-[#0e1014]">NGN</option>
                        <option value="ZAR" className="bg-[#0e1014]">ZAR</option>
                        <option value="JPY" className="bg-[#0e1014]">JPY</option>
                    </select>

                    {/* Custom Arrow */}
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        ▼
                    </span>
                </div>

            </div>


            {/* Tabs */}
            <div className="flex items-center gap-6 mb-6 text-sm">

                MintFiat UID
            </div>

            {/* Recipient Input */}
            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="MintFiat UID"
                    className="w-full bg-[#111318] border border-[#1f232d] rounded-xl px-4 py-4 focus:outline-none"
                />
            </div>

            {/* Quantity */}
            <div className="mb-1 text-sm text-gray-400">Quantity</div>
            <div className="mb-2 relative">
                <input
                    type="number"
                    placeholder="Please enter quantity"
                    className="w-full bg-[#111318] border border-[#1f232d] rounded-xl px-4 py-4 focus:outline-none"
                />
                <button className="absolute right-4 top-4 text-blue-500 text-sm">All</button>
            </div>
            <div className="text-sm text-gray-500 mb-6">Available 50,000 USD</div>

            {/* Submit Button */}
            <div className="mt-10">
                <button className="w-full bg-[#1a1c22] text-gray-600 py-3 rounded-xl cursor-not-allowed">
                    Submit
                </button>
            </div>
        </div>
    );
}
