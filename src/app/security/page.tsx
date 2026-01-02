"use client";

import { ChevronRight, ArrowLeft, Mail, ShieldCheck, ShieldClose } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SecurityPage() {
  const router = useRouter();
  const { user } = useAuth();
  return (
    <div className="min-h-screen text-white px-4 pb-20 max-w-xl mx-auto">
      <ArrowLeft
        className="w-5 h-5 mt-2 cursor-pointer"
        onClick={() => router.back()}
      />
      {/* Header */}
      <div className="pt-5 pb-4">
        <h1 className="text-3xl font-semibold">Security</h1>
      </div>

      {/* Recommendation bar */}
      <div className="w-full h-1 bg-neutral-800 rounded mb-6 overflow-hidden">
        <div className="h-1 bg-green-400 w-full"></div>
      </div>

      <Section>
        <SecurityItem
          icon={<Mail className="w-5 h-5" />}
          label="Email"
          checked
        />
      </Section>

      <div className="mt-6 space-y-4">
        <LinkItem label="Password" value="Change" link="/password/manage" />
        <LinkItem label="Recent Login History" link="/log/history" />
        <LinkItem label="Manage Account" link="/manage/account" />
      </div>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-3">
      {children}
    </div>
  );
}

function SecurityItem({
  icon,
  label,
  checked = false,
  tag,
}: {
  icon: React.ReactNode;
  label: string;
  checked?: boolean;
  tag?: string;
}) {
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <p className="text-sm">{label}</p>
        {tag && (
          <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-md">
            {tag}
          </span>
        )}
      </div>
      {user?.emailVerified && <ShieldCheck className="w-5 h-5 text-green-400" />}
      {!user?.emailVerified && <ShieldClose className="w-5 h-5 text-red-600" />}
    </div>
  );
}

function LinkItem({
  label,
  value,
  link,
}: {
  label: string;
  value?: string;
  link?: string;
}) {
  return (
    <Link href={`${link}`}>
      <div className="flex items-center justify-between py-3 cursor-pointer">
        <p className="text-sm text-neutral-300">{label}</p>
        <div className="flex items-center gap-2">
          {value && <p className="text-sm text-neutral-500">{value}</p>}
          <ChevronRight className="w-4 h-4 text-neutral-600" />
        </div>
      </div>
    </Link>
  );
}
