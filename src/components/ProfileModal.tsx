import React from "react";
import {

    Gift,
    UserPlus,
    Shield,
    FileText,
    Settings,
    MessageCircle,
    Heart,

} from "lucide-react";
import Link from "next/link"

interface Profile {
    onComplete: () => void;
}

export default function SettingsModal({ onComplete }: Profile) {
    const menu = [
        { icon: Gift, label: "Rewards Hub", link: "/home" },
        { icon: UserPlus, label: "Referral", link: "/referral" },
        { icon: Shield, label: "Security", link: "/home" },
        { icon: FileText, label: "Transactions", dot: true, link: "/transactions" },
        { icon: Settings, label: "Settings", link: "/settings" },
        { icon: MessageCircle, label: "Join Community", link: "/home" },
        { icon: Heart, label: "Customer Service & Support", link: "/home" },
    ];

    return (
        <div className="w-full max-w-md mx-auto text-white rounded-2xl">

            {/* User */}
            <div className="mb-6">
                <div className="text-sm text-neutral-400">0x****...abcd</div>
                <div className="text-xs text-neutral-500">UID: 71694239</div>
            </div>

            {/* Menu List */}
            <div className="space-y-2 mb-6">
                {menu.map((item, i) => (
                    <Link
                        onClick={onComplete}
                        href={item.link}
                        key={i}
                        className="flex cursor-pointer items-center justify-between p-3 bg-neutral-900 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition"
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-neutral-300" />
                            <span className="text-sm">{item.label}</span>
                        </div>

                        {item.dot && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}

                        <span className="text-neutral-500">›</span>
                    </Link>
                ))}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
                <p className="text-[10px] text-neutral-500 text-center mt-4">
                    Please do not disclose your password, SMS codes or Google Authenticator
                    codes to anyone.
                </p>
                <Link href="/">
                    <button className="w-full cursor-pointer py-3 rounded-xl border border-neutral-700 text-sm font-medium hover:bg-neutral-800">
                        Log Out
                    </button>
                </Link>
            </div>


        </div>
    );
}
