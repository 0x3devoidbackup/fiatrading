"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const SigupPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        router.push("/home");
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 text-white">
            <div className="bg-[#0c0e13] border border-[#1b1f29] py-10 px-5 rounded-2xl shadow-xl max-w-md w-full">
                <h2 className="text-3xl font-bold mb-8 text-center">Create Account</h2>

                <form onSubmit={handleSignUp}>
                    {/* Full Name */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="johndoe@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3 relative">
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                        <div
                            className="absolute right-3 top-[45px] cursor-pointer text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                        <div
                            className="absolute right-3 top-[45px] cursor-pointer text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-300">
                    Already have an account?{" "}
                    <Link href="/signin">
                        <button className="text-purple-600 cursor-pointer font-semibold hover:underline">
                            Sign In
                        </button>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SigupPage;
