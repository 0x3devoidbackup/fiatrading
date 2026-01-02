"use client";
import React, { useState } from "react";
import {
  Gift,
  UserPlus,
  Shield,
  FileText,
  Settings,
  MessageCircle,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/api/axios";
import axios from "axios";
import { notify } from "@/utils/notify";
import CenterLoader from "@/utils/loader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Profile {
  onComplete: () => void;
}

export default function SettingsModal({ onComplete }: Profile) {
  const [loading, setLoading] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();

  async function handleLogOut() {
    try {
      setLoading(true);
      await logout();
      notify("Logged out successfully");
      router.push("/signin");
    } catch (error: any) {
      console.error("Logout error:", error);

      let message = "Something went wrong during logout.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }
      notify(message);
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  }
  const menu = [
    { icon: Gift, label: "Rewards Hub", link: "/rewards" },
    { icon: UserPlus, label: "Referral", link: "/referral" },
    { icon: Shield, label: "Security", link: "/security" },
    { icon: FileText, label: "Transactions", dot: true, link: "/transactions" },
    {
      icon: MessageCircle,
      label: "Join Community",
      link: "https://telegram.org/",
    },
    {
      icon: Heart,
      label: "Customer Service & Support",
      link: "https://farcaster.xyz/",
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto text-white rounded-2xl">
      <CenterLoader show={loading} />
      {/* User */}
      <div className="mb-6">
        <div className="text-sm text-neutral-400">{user?.email}</div>
        <div className="text-xs text-neutral-500">UID: {user?.id}</div>
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

            {item.dot && (
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}

            <span className="text-neutral-500">›</span>
          </Link>
        ))}
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <p className="text-[10px] text-neutral-500 text-center mt-4">
          Please do not disclose your password or Email codes codes to anyone.
        </p>
        <button
          onClick={handleLogOut}
          className="w-full cursor-pointer py-3 rounded-xl border border-neutral-700 text-sm font-medium hover:bg-neutral-800"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
