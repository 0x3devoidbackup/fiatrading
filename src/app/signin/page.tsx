"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, UserToken } from "@/types";
import Image from "next/image";
import CenterLoader from "@/utils/loader";

const SiginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [userTokens, setUserTokens] = useState<UserToken[]>([]);

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      fiatBalance: 10000,
    };

    setUser(mockUser);
    setUserTokens([
      { tokenId: "1", amount: 0.5 },
      { tokenId: "2", amount: 2.3 },
    ]);

    router.push("/home");
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 pb-40">
      <CenterLoader show={loading} />

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <Image src="/images/logo.png" alt="." width={20} height={20} />

          <Link href="/signup">
            <button className="text-white cursor-pointer font-semibold hover:underline">
              Sign Up
            </button>
          </Link>
        </div>

        <div className="mt-10">
          <h1 className="font-extrabold text-3xl">Sign In to MINTFIAT</h1>
        </div>
      </div>
      <div className="mt-10">
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#111] border border-[#333] rounded-xl px-3 py-2 pr-12 focus:outline-none focus:border-blue-500"
            required
          />

          <div className="relative mb-6 mt-5">
            <input
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111] border border-[#333] rounded-xl px-3 py-2 pr-12 focus:outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-white/60"
            >
              {show ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="w-full text-sm cursor-pointer bg-blue-600 py-3 rounded-full font-semibold "
            >
              Sign In
            </button>
          </div>

          <Link href="/reset-password">
            <p className="text-start font-bold mt-5 text-blue-600 text-sm">
             Forget password ?
            </p>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SiginPage;
