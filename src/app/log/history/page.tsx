"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  Laptop,
  MapPin,
  Clock4,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface LoginEntry {
  id: number;
  device: string;
  location: string;
  time: string;
  status: "success" | "failed";
}

const mockLogins: LoginEntry[] = [
  {
    id: 1,
    device: "iPhone 14 Pro",
    location: "Lagos, Nigeria",
    time: "Today • 08:12 AM",
    status: "success",
  },
  {
    id: 2,
    device: "Windows Desktop",
    location: "Abuja, Nigeria",
    time: "Yesterday • 10:40 PM",
    status: "success",
  }
];

const LogHistory = () => {
  const router = useRouter();

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes("iphone")) return <Smartphone size={18} />;
    if (device.toLowerCase().includes("macbook")) return <Laptop size={18} />;
    if (device.toLowerCase().includes("windows")) return <Monitor size={18} />;
    return <Smartphone size={18} />;
  };

  return (
    <div className="min-h-screen text-white px-4 pb-20 max-w-xl mx-auto">

      {/* Back Button */}
      <ArrowLeft
        className="w-6 h-6 cursor-pointer text-neutral-300"
        onClick={() => router.back()}
      />

      {/* Title */}
      <h1 className="text-2xl font-semibold mt-6 mb-6">
        Recent Login Activity
      </h1>

      <div className="space-y-5">

        {mockLogins.map((log) => (
          <div
            key={log.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
          >
            {/* Device Info */}
            <div className="flex items-center gap-3">
              <div className="text-neutral-400">{getDeviceIcon(log.device)}</div>
              <p className="text-sm font-medium">{log.device}</p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mt-3 text-neutral-400 text-xs">
              <MapPin size={14} />
              <span>{log.location}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 mt-1 text-neutral-500 text-xs">
              <Clock4 size={14} />
              <span>{log.time}</span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mt-3">
              {log.status === "success" ? (
                <>
                  <CheckCircle2 size={15} className="text-green-500" />
                  <span className="text-xs text-green-500">Successful login</span>
                </>
              ) : (
                <>
                  <XCircle size={15} className="text-red-500" />
                  <span className="text-xs text-red-500">Failed login attempt</span>
                </>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default LogHistory;
