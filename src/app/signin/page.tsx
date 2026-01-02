"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, UserToken } from "@/types";
import Image from "next/image";
import CenterLoader from "@/utils/loader";
import {api} from "@/api/axios";
import { notify } from "@/utils/notify";
import { useAuth } from "@/context/AuthContext";

const SiginPage = () => {
  const router = useRouter();
  const {login} = useAuth()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      notify("Email and password must be filled");
      return;
    }

    if (!isValidEmail(email)) {
      notify("Invalid email address");
      return;
    }

    try {
      setLoading(true);
     const res = await login(email, password);
 
     if(res){
      notify("Login successful");
      router.push("/home")
     }
    } catch (e: any) {
      console.log(e);
      const msg = e.response.data.message;
      notify(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-40">
      <CenterLoader show={loading} />

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <img
            src="https://violet-recent-skunk-362.mypinata.cloud/ipfs/bafkreih2bop2brxlarnn3mkpmaesju4wodw33lrqyfk4jvxxa6duki2cfa"
            className="w-10 h-10"
          />

          <Link href="/signup">
            <button className="text-white cursor-pointer font-semibold hover:underline">
              Sign Up
            </button>
          </Link>
        </div>

        <div className="mt-10">
          <h1 className="font-extrabold text-3xl">Sign In to MintFiat</h1>
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
              required
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
