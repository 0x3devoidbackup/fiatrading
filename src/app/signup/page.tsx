"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SigupPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
      
    
        router.push("/launches")
    };
    const [name, setName] = useState('');


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4 text-black">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
                <h2 className="text-3xl font-bold mb-8 text-center">Create Account</h2>
                <form onSubmit={handleSignUp}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                    </div>
                    <button type='submit' className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                        Sign Up
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{' '}
                    <Link href="/signin">
                        <button className="text-purple-600 cursor-pointer font-semibold hover:underline">
                            Sign In
                        </button>
                    </Link>

                </p>
            </div>
        </div>
    );
}

export default SigupPage
