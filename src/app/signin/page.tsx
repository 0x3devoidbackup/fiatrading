"use client"
import React, { useState, useEffect } from 'react';
import { User, UserToken } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const SiginPage = () => {
    const router = useRouter()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [userTokens, setUserTokens] = useState<UserToken[]>([]);

    const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            fiatBalance: 10000
        };
        setUser(mockUser);
        setUserTokens([
            { tokenId: '1', amount: 0.5 },
            { tokenId: '2', amount: 2.3 }
        ]);
        router.push("/launches")

    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 text-black">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
                <h2 className="text-3xl font-bold mb-8 text-center">Welcome Back</h2>
                <form onSubmit={handleSignIn}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                        <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <button type='submit' className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                        Sign In
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    Dont have an account?{' '}
                    <Link href="/signup">
                        <button className="text-blue-600 cursor-pointer font-semibold hover:underline">
                            Sign Up
                        </button>
                    </Link>

                </p>
            </div>
        </div>
    );
}

export default SiginPage
