"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, Info, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { notify } from "@/utils/notify";
import { api } from "@/api/axios";
import axios from "axios";
import CenterLoader from "@/utils/loader";
import { useAuth } from "@/context/AuthContext";

const ChangePassword = () => {
  const router = useRouter();
  const {user} = useAuth()
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldpassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const rules = {
    length: password.length >= 10 && password.length <= 128,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
  const isPasswordValid = Object.values(rules).every(Boolean);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPasswordValid) {
      notify("Password does not meet requirements");
      return;
    }
    if (password.toLowerCase() !== confirmPassword.toLowerCase()) {
      notify("New Password and Confirm password must be the same.");
      return;
    }

    try {
      setLoading(true);

      const data = { newPassword: password, oldPassword: oldpassword, email: user?.email };
      const response = await api.post("/auth/update-password", data);
      if (response.status === 200) {
        notify(response.data.message);
        router.push("/home");
      }
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }
      notify(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white px-4 pb-20 max-w-xl mx-auto">
      <CenterLoader show={loading} />

      <ArrowLeft
        className="w-5 h-5 mt-2 cursor-pointer"
        onClick={() => router.back()}
      />

      <h1 className="text-2xl font-semibold mb-1 mt-5">Change Password</h1>
      <div className="bg-[#492211] p-2 mt-2 flex items-center gap-2 rounded">
        <Info className=" text-[#FE4E00]" size={16} />

        <p className="text-xs ">
          The Fiat withdrawal will be prohibited for 24 hours after changing the
          password.
        </p>
      </div>

      <form onSubmit={handlePasswordChange}>
        <div className="space-y-2 mt-5">
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Old Password</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-neutral-500"
                size={18}
              />
              <input
                type={showOld ? "text" : "password"}
                placeholder="Enter old password"
                value={oldpassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-3 pl-10 pr-10 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-3 text-neutral-400"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">New Password</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-neutral-500"
                size={18}
              />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-3 pl-10 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-neutral-400"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Confirm Password</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-neutral-500"
                size={18}
              />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-3 pl-10 pr-10 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-neutral-400"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <ul className="space-y-2 text-sm mt-5">
          <Rule active={rules.length} text="10–128 characters" />
          <Rule active={rules.upper} text="At least 1 uppercase letter" />
          <Rule active={rules.lower} text="At least 1 lowercase letter" />
          <Rule active={rules.number} text="At least 1 number" />
        </ul>

        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full bg-blue-600 py-3 rounded-lg text-sm font-medium"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

function Rule({ active, text }: { active: boolean; text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`text-lg ${active ? "text-blue-500" : "text-white/30"}`}>
        <Check className="w-5 h-5" />
      </span>
      <span className={`${active ? "text-white" : "text-white/40"}`}>
        {text}
      </span>
    </li>
  );
}
