'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";


export default function RewardsHub() {
    const router = useRouter();
    const deposit = 32.86;
    const depositGoal = 3000;
    const traded = 4365;
    const tradedGoal = 30000000;

    const depositPct = Math.min(100, (deposit / depositGoal) * 100);
    const tradedPct = Math.min(100, (traded / tradedGoal) * 100);

    return (
        <div className=" text-white p-4 pb-20 flex justify-center">
            <div className="w-full max-w-xl">
                {/* Top nav */}
                <div className="flex items-center gap-3 mb-4">
                    <ArrowLeft className="w-5 h-5 mt-2 cursor-pointer" onClick={() => router.back()}
                    />
                    <h2 className="flex-1 text-center text-xl font-semibold">Rewards Hub</h2>
                </div>

                {/* Hero */}
                <div className="bg-gradient-to-b from-[#0b0b0b] to-[#070707] rounded-xl p-6 mb-6 relative overflow-hidden border border-neutral-800">
                    <h1 className="text-2xl font-bold text-center">Rewards Hub</h1>
                    <p className="text-center mt-2 text-indigo-300 font-semibold">10,000 <span className="text-xs text-white/60">USD bonus awaits!</span></p>

                    <div className="flex justify-center gap-3 mt-4">
                        <button className="px-4 py-2 cursor-pointer rounded-full bg-neutral-900 border border-neutral-800">My Rewards</button>
                        <button className="px-4 py-2  cursor-pointer rounded-full bg-neutral-900 border border-neutral-800">Share</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 text-sm mb-4">
                    <div className="border-b-2 border-white/90 pb-2">New User Exclusive</div>
                    {/* <div className="text-white/60">Advanced Challenges</div> */}
                </div>

                {/* Claim card */}
                <div className="bg-neutral-900 rounded-xl p-4 mb-4 border border-neutral-800">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-md bg-yellow-500/20 flex items-center justify-center">🏆</div>
                        <div className="flex-1">
                            <h3 className="font-semibold">Claim up to <span className="text-yellow-300">5 USD</span> in New User Rewards</h3>
                            <div className="mt-3 bg-neutral-800 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-white/80">Verify to Claim Rewards</div>
                                    </div>
                                    <button className="px-2 py-2 text-xs bg-blue-600 rounded cursor-pointer">Verify</button>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="text-xs text-white/60">5 USD voucher can only be used to offset trading fees</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unlock more rewards */}
                <h4 className="text-center text-sm text-white/80 mb-3">Unlock More Rewards</h4>

                <div className="bg-neutral-900 rounded-xl p-4 mb-6 border border-neutral-800">
                    <h5 className="font-semibold mb-3">Cumulative Net Deposits & Trades <span className="text-xs text-white/50">ⓘ</span></h5>

                    <div className="text-xs text-white/60 mb-2">Deposit <span className="text-blue-400">{deposit}/{depositGoal} USD</span></div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full mb-3 overflow-hidden">
                        <div style={{ width: `${depositPct}%` }} className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    </div>

                    <div className="text-xs text-white/60 mb-2">Traded <span className="text-blue-400">{traded}/{tradedGoal} USD</span></div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full mb-4 overflow-hidden">
                        <div style={{ width: `${tradedPct}%` }} className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-yellow-300 font-bold">Up to 4,000 USD</div>
                            <div className="text-xs text-white/50">Spot Bonus</div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 rounded-full">Trade</button>
                    </div>
                </div>



            </div>
        </div>
    );
}
