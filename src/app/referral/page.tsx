import React from "react";
import { ArrowLeft, Copy } from "lucide-react";
import Link from "next/link";

export default function ReferralModal() {
    return (
        <div className="w-full max-w-md mx-auto p-4 bg-black text-white rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Link href="/home">
                    <ArrowLeft className="w-5 h-5 text-neutral-300" />
                </Link>
                <h2 className="text-lg font-semibold">Referral</h2>
            </div>

            {/* My Invites */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-4">
                <div className="text-sm font-medium mb-3">My Invites</div>

                <div className="flex justify-between text-center py-3 border border-neutral-800 rounded-xl mb-4">
                    <div className="flex-1">
                        <div className="text-xs text-neutral-400">Total (USDT)</div>
                        <div className="text-xl font-bold">0</div>
                    </div>
                    <div className="w-px bg-neutral-800" />
                    <div className="flex-1">
                        <div className="text-xs text-neutral-400">Total Referrals</div>
                        <div className="text-xl font-bold">0</div>
                    </div>
                </div>




                <p className="text-center text-xs text-neutral-400 mt-3">
                    Just one step to start earning commissions! Copy your referral link and invite friends
                </p>

                <button className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm font-medium">
                    <Copy className="w-4 h-4" />
                    Copy & Invite
                </button>
            </div>

            {/* Level Up Button */}
            <button className="w-full rounded-xl bg-blue-700 hover:bg-blue-800 text-white py-3 text-sm font-medium">
                Refer to Level Up
            </button>
        </div>
    );
}