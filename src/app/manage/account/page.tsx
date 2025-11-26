"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";

const ManageAccount = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen text-white px-4  pb-20 max-w-xl mx-auto">

      {/* Back Button */}
      <ArrowLeft
        className="w-6 h-6 cursor-pointer text-neutral-300"
        onClick={() => router.back()}
      />

      {/* Title */}
      <h1 className="text-2xl font-semibold mt-6 mb-6">
        Manage Account
      </h1>

      <div className="space-y-8">

        {/* FREEZE ACCOUNT */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <button className="w-full flex items-center justify-between">
            <p className="text-sm text-amber-300 font-medium">Freeze Account</p>
            <ChevronRight className="text-neutral-500 w-4 h-4" />
          </button>

          <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
            Once your account is frozen, most actions will be disabled, including:
            login, deposit, withdrawal, and trading.  
            You can unfreeze your account at any time.
          </p>
        </div>

        {/* DELETE ACCOUNT */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <button className="w-full flex items-center justify-between">
            <p className="text-sm text-red-500 font-medium">Delete Account</p>
            <ChevronRight className="text-neutral-500 w-4 h-4" />
          </button>

          <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
            Once your account is deleted, <span className="text-red-400">all your data will be permanently removed</span>.
            This process cannot be undone. Please proceed with caution.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ManageAccount;
