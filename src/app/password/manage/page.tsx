"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, Info, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
  const router = useRouter();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen text-white px-4 pb-20 max-w-xl mx-auto">
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

      <div className="space-y-6">
        {/* OLD PASSWORD */}
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
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-3 pl-10 pr-10 text-sm"
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
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-3 pl-10 pr-10 text-sm"
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

      {/* SUBMIT BUTTON */}
      <button className="mt-10 w-full bg-blue-600 py-3 rounded-lg text-sm font-medium">
        Update Password
      </button>
    </div>
  );
};

export default ChangePassword;
