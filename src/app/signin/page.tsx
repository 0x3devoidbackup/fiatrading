"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, UserToken } from "@/types";

const SiginPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

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
        <div className="min-h-screen flex items-center justify-center px-4 text-white">
            <div className="bg-[#0c0e13] border border-[#1b1f29] p-10 rounded-2xl shadow-xl max-w-md w-full">
                <h2 className="text-3xl font-bold mb-8 text-center">Welcome Back</h2>

                <form onSubmit={handleSignIn}>
                    {/* Email */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            placeholder="johndoe@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-11 text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-300">
                    Dont have an account?{" "}
                    <Link href="/signup">
                        <button className="text-purple-600 cursor-pointer font-semibold hover:underline">
                            Sign Up
                        </button>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SiginPage;
