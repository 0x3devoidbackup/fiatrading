"use client";

import { useState } from "react";
import { ChevronDown, Info, Plus, Minus, X, } from "lucide-react";
import PairSelector from "./SelectPairs"

export default function Swap() {
    const [tab, setTab] = useState<"buy" | "sell">("buy");
    const [orderType, setOrderType] = useState("Market");
    const [price, setPrice] = useState(689.1);
    const [amount, setAmount] = useState(8.003192);
    const [total, setTotal] = useState(5515);
    const [slider, setSlider] = useState(0);
    const [pair, setPair] = useState("HIPP/USD")
    const [isSlectingpair, setSelectinPair] = useState(false)


    const mockSpot = [
        {
            pair: "BTC/EUR",
            side: "BUY",
            price: "45000",
            amount: "0.001",
            time: "2025-11-11 09:30:14",
        },
        {
            pair: "ETH/USD",
            side: "SELL",
            price: "2300",
            amount: "0.05",
            time: "2025-11-09 15:22:58",
        },
    ];

    const Section = ({ children }: { children: React.ReactNode }) => (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
            {children}
        </div>
    );

    return (
        <div className="max-w-lg mx-auto  text-white px-6 py-3 space-y-2">

            {/* Pair + Change */}
            <button className="flex items-center space-x-.5 cursor-pointer" onClick={() => setSelectinPair(true)}>
                <h1 className="text-sm font-semibold">{pair}</h1>
                <ChevronDown className="w-5 h-5 text-white" />
                <span className="bg-green-700 text-[10px] px-1.5 py-0.5 rounded">+0.41%</span>
            </button>

            {/* BUY / SELL TABS */}
            <div className="flex bg-[#15161a] p-0.5 rounded-lg">
                <button
                    onClick={() => setTab("buy")}
                    className={`flex-1 py-1.5 rounded text-xs font-medium transition ${tab === "buy" ? "bg-green-600" : ""
                        }`}
                >
                    Buy
                </button>
                <button
                    onClick={() => setTab("sell")}
                    className={`flex-1 py-1.5 rounded text-xs font-medium transition ${tab === "sell" ? "bg-red-500" : ""
                        }`}
                >
                    Sell
                </button>
            </div>

            {/* ORDER TYPE */}
            <div className="flex items-center justify-between bg-[#15161a] px-2.5 py-1.5 rounded-lg">
                <div className="flex items-center space-x-1.5">
                    <Info className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-300">{orderType}</span>
                </div>
                <ChevronDown className="text-gray-400 w-3.5 h-3.5" />
            </div>

            {/* PRICE INPUT */}
            <div className="bg-[#15161a] px-2.5 py-2 rounded-lg space-y-0.5">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setPrice((p) => Math.max(0, p - 1))}
                        className="p-1 bg-[#101113] rounded"
                    >
                        <Minus className="w-3 h-3 text-gray-300" />
                    </button>

                    <div className="text-center">
                        <input
                            type="number"
                            step="any"
                            className="w-full bg-transparent text-white text-center text-sm font-medium outline-none"
                            placeholder="Price (USD)"

                        />
                    </div>

                    <button
                        onClick={() => setPrice((p) => p + 1)}
                        className="p-1 bg-[#101113] rounded"
                    >
                        <Plus className="w-3 h-3 text-gray-300" />
                    </button>
                </div>
            </div>
            <p className="text-gray-500 text-[12px] text-start">≈ ${(price - 0.76).toFixed(2)}</p>


            {/* AMOUNT INPUT */}
            <div className="bg-[#15161a] px-2.5 py-2 rounded-lg">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setAmount((a) => Math.max(0, a - 0.1))}
                        className="p-1 bg-[#101113] rounded"
                    >
                        <Minus className="w-3 h-3 text-gray-300" />
                    </button>

                    <div className="text-center">
                        <input
                            type="number"
                            step="any"
                            className="w-full bg-transparent text-white text-center text-sm font-medium outline-none"
                            placeholder="Quantity (HIPP)"

                        // onChange={(e) => setTotal(Number(e.target.value))}
                        />
                    </div>

                    <button
                        onClick={() => setAmount((a) => a + 0.1)}
                        className="p-1 bg-[#101113] rounded"
                    >
                        <Plus className="w-3 h-3 text-gray-300" />
                    </button>
                </div>
            </div>

            {/* SLIDER */}
            <div className="w-full px-1 py-1">
                <input
                    type="range"
                    className="w-full h-1 accent-green-500"
                    min={0}
                    max={100}
                    value={slider}
                    onChange={(e) => setSlider(Number(e.target.value))}
                />
                <div className="flex justify-between text-[9px] text-gray-500 mt-0.5">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* TOTAL INPUT */}
            <div className="bg-[#15161a] px-2.5 py-2 rounded-lg">
                <input
                    type="number"
                    className="w-full bg-transparent text-white text-center text-sm font-medium outline-none"
                    placeholder="Total (USD)"
                    step="any"

                // onChange={(e) => setTotal(Number(e.target.value))}
                />
            </div>


            {/* AVAILABLE */}
            <div className="flex items-center justify-between text-[11px]  px-2.5 py-1.5 rounded-lg">
                <div className="text-gray-400 space-y-0.5">
                    <p>Avail.</p>
                    <p>Best Bid</p>
                </div>
                <div className="text-right space-y-0.5">
                    <p className="text-gray-300 font-bold">0 USD</p>
                    <p className="text-gray-300 font-bold">703.64 USD</p>
                </div>
            </div>

            {/* BUY BUTTON */}
            <button className={`w-full py-2.5 rounded-lg text-sm font-medium mt-2 ${tab === "buy" ? "bg-green-600" : "bg-red-500"
                }`}>
                {tab === "buy" ? "Buy" : "Sell"} HIPP
            </button>



            {isSlectingpair && (
                <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="max-w-md mx-auto px-2 pt-4">
                        <div className="flex items-center justify-end mb-4">
                            <X
                                className="w-6 h-6 text-neutral-300 cursor-pointer"
                                onClick={() => setSelectinPair(false)}
                            />
                        </div>

                        <PairSelector />
                    </div>
                </div>
            )}
        </div>
    );
}