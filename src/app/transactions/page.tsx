"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";

const mockAll = [
    {
        type: "Deposit",
        asset: "USD",
        amount: "0.03",
        progress: "60 / 60",
        time: "2025-11-03 22:40:46",
    },
    {
        type: "Deposit",
        asset: "GBP",
        amount: "0.94",
        progress: "67 / 20",
        time: "2025-11-03 22:39:49",
    },
    {
        type: "Deposit",
        asset: "EUR",
        amount: "0.0075",
        progress: "99 / 61",
        time: "2025-11-03 22:39:20",
    },
];

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

const mockDepWith = [
    {
        type: "Deposit",
        asset: "EUR",
        amount: "0.03",
        status: "Successful",
        time: "2025-11-03 22:40:46",
    },
    {
        type: "Withdrawal",
        asset: "USD",
        amount: "200",
        status: "Pending",
        time: "2025-11-01 18:20:12",
    },
];

const Transactions = () => {
    const router = useRouter();

    const [All, setAll] = useState(false);
    const [spot, setSpot] = useState(false);
    const [depWith, setDepWith] = useState(false);

    const Section = ({ children }: { children: React.ReactNode }) => (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
            {children}
        </div>
    );

    return (
        <div className=" text-white px-4 pb-20 max-w-xl mx-auto">
            <ArrowLeft
                className="w-6 h-6 cursor-pointer text-neutral-300"
                onClick={() => router.back()}
            />
            <h2 className=" font-extrabold text-2xl mt-5">Transactions</h2>

            {/* Main Options */}
            <div className="space-y-2 mb-6 mt-5">
                <div
                    onClick={() => setAll(true)}
                    className="flex cursor-pointer items-center justify-between p-3 bg-neutral-900 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition"
                >
                    <span className="text-sm">All</span>
                    <span className="text-neutral-500">›</span>
                </div>

                <div
                    onClick={() => setSpot(true)}
                    className="flex cursor-pointer items-center justify-between p-3 bg-neutral-900 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition"
                >
                    <span className="text-sm">Spot Orders</span>
                    <span className="text-neutral-500">›</span>
                </div>

                <div
                    onClick={() => setDepWith(true)}
                    className="flex cursor-pointer items-center justify-between p-3 bg-neutral-900 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition"
                >
                    <span className="text-sm">Deposit/Withdrawals</span>
                    <span className="text-neutral-500">›</span>
                </div>
            </div>

            {/* ALL TRANSACTIONS */}
            {All && (
                <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="max-w-md mx-auto px-2 pt-4">
                        <div className="flex items-center justify-end mb-4">
                            <X
                                className="w-6 h-6 text-neutral-300 cursor-pointer"
                                onClick={() => setAll(false)}
                            />
                        </div>

                        <h3 className="font-bold mb-3">All Transactions</h3>

                        {mockAll.map((item, i) => (
                            <Section key={i}>
                                <div className="flex justify-between">
                                    <span className="font-semibold">{item.asset}</span>
                                    <span className="text-xs text-green-400">{item.type}</span>
                                </div>

                                <p className="text-sm mt-1">Amount: {item.amount}</p>

                                <p className="text-xs text-neutral-500 mt-1">
                                    Progress: {item.progress}
                                </p>

                                <p className="text-xs text-neutral-500 mt-1">{item.time}</p>
                            </Section>
                        ))}
                    </div>
                </div>
            )}

            {/* SPOT */}
            {spot && (
                <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="max-w-md mx-auto  pt-4">
                        <div className="flex items-center justify-end mb-4">
                            <X
                                className="w-6 h-6 text-neutral-300 cursor-pointer"
                                onClick={() => setSpot(false)}
                            />
                        </div>

                        <h3 className="font-bold mb-3">Spot Orders</h3>

                        {mockSpot.map((item, i) => (
                            <Section key={i}>
                                <div className="flex justify-between">
                                    <span className="font-semibold">{item.pair}</span>
                                    <span
                                        className={`text-xs ${item.side === "BUY" ? "text-green-400" : "text-red-400"
                                            }`}
                                    >
                                        {item.side}
                                    </span>
                                </div>

                                <p className="text-sm mt-1">Price: {item.price}</p>
                                <p className="text-sm">Amount: {item.amount}</p>

                                <p className="text-xs text-neutral-500 mt-1">{item.time}</p>
                            </Section>
                        ))}
                    </div>
                </div>
            )}

            {/* DEPOSIT / WITHDRAWALS */}
            {depWith && (
                <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="max-w-md mx-auto pt-4">
                        <div className="flex items-center justify-end mb-4">
                            <X
                                className="w-6 h-6 text-neutral-300 cursor-pointer"
                                onClick={() => setDepWith(false)}
                            />
                        </div>

                        <h3 className="font-bold mb-3">Deposit / Withdrawals</h3>

                        {mockDepWith.map((item, i) => (
                            <Section key={i}>
                                <div className="flex justify-between">
                                    <span className="font-semibold">{item.asset}</span>
                                    <span
                                        className={`text-xs ${item.type === "Deposit"
                                            ? "text-green-400"
                                            : "text-red-400"
                                            }`}
                                    >
                                        {item.type}
                                    </span>
                                </div>

                                <p className="text-sm mt-2">Amount: {item.amount}</p>

                                <p className="text-xs mt-1 text-neutral-500">
                                    Status:    <span
                                        className={`text-xs ${item.status === "Successful"
                                            ? "text-green-400"
                                            : "text-yellow-400"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </p>

                                <p className="text-xs text-neutral-500 mt-1">{item.time}</p>
                            </Section>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
