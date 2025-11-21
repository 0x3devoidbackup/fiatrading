"use client"
import React, { useState, useEffect } from 'react';
import { User, Token } from '@/types';
import { Send, Rocket, X, Gift, ArrowUpRight, ArrowDownRight, Coins, Plus, Minus, ArrowBigRight, ChevronRight } from 'lucide-react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';


import PaymentOptions from '@/components/PaymentOptions';
// Mock data
const mockTokens: Token[] = [
    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 45000, change24h: 2.5, marketCap: 850000000000, supply: 19000000, pair: "USD" },
    { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3200, change24h: -1.2, marketCap: 380000000000, supply: 120000000, pair: "EURO" },
    { id: '3', name: 'Solana', symbol: 'SOL', price: 105, change24h: 5.8, marketCap: 45000000000, supply: 430000000, pair: "NGN" },
    { id: '4', name: 'Cardano', symbol: 'ADA', price: 0.65, change24h: 3.2, marketCap: 23000000000, supply: 35000000000, pair: "AUD" },
    { id: '5', name: 'Polkadot', symbol: 'DOT', price: 8.5, change24h: -0.8, marketCap: 12000000000, supply: 1400000000, pair: "CAD" },
];

const TokensPage = () => {
    const router = useRouter();
    const [addFunds, setAddFunds] = useState(false)

    return (<div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-4">
            <div>

            </div>
            <div className='max-w-2xl mx-auto'>
                <p className='text-xs font-bold'>Total Asset</p>

                <div className='flex justify-between items-center mt-1'>
                    <div className='flex space-x-1'>
                        <h1 className='text-2xl font-extrabold'>100</h1>
                        <span className='text-gray-500 mt-3 font-bold text-sm'>USD</span>
                    </div>

                    <button onClick={(() => setAddFunds(!addFunds))} className="cursor-pointer w-fit bg-gradient-to-r from-blue-600 to-blue-600 text-white text-xs py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all">Add Funds</button>

                </div>

            </div>

            <div className='max-w-2xl mx-auto flex justify-between items-center mt-10'>


                <Link href='/launch'>
                    <div className='flex flex-col items-center space-y-1'>
                        <div className="bg-[#1b1d22] p-2 w-fit rounded-full cursor-pointer hover:bg-[#23252b] transition">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <p className='text-xs text-gray-300'>Launch</p>
                    </div>
                </Link>

                <div className='flex flex-col items-center space-y-1'>
                    <div className="bg-[#1b1d22] p-2 w-fit rounded-full cursor-pointer hover:bg-[#23252b] transition">
                        <Gift className="w-5 h-5 text-white" />
                    </div>
                    <p className='text-xs text-gray-300'>Rewards</p>
                </div>
                <div className='flex flex-col items-center space-y-1'>
                    <div className="bg-[#1b1d22] p-2 w-fit rounded-full cursor-pointer hover:bg-[#23252b] transition">
                        <Send className="w-5 h-5 text-white" />
                    </div>
                    <p className='text-xs text-gray-300'>Referrals</p>
                </div>
                <div className='flex flex-col items-center space-y-1'>
                    <div className="bg-[#1b1d22] p-2 w-fit rounded-full cursor-pointer hover:bg-[#23252b] transition">
                        <Coins className="w-5 h-5 text-white" />
                    </div>
                    <p className='text-xs text-gray-300'>Earn</p>
                </div>
              

            </div>
            <div className="mt-10 hidden lg:flex rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Token</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Price</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">24h Change</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Market Cap</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Buy/Sell</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTokens.map((token) => (
                            <tr key={token.id} className=" hover:[#0c0e13]">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-[#1b1d22] rounded-full flex items-center justify-center text-white font-bold">
                                            {token.symbol.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">{token.name.toUpperCase()} /<span className='text-gray-400 text-xs'>{token.pair.toUpperCase()}</span></div>
                                            <span className='text-gray-500 text-xs'>SPOT</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-semibold">${token.price.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`flex items-center justify-end space-x-1 ${token.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {token.change24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                        <span className="font-semibold">{Math.abs(token.change24h)}%</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-600">${(token.marketCap / 1000000000).toFixed(2)}B</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="bg-blue-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        Trade
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-10 lg:hidden rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="">
                        <tr>
                            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-600">Spot</th>
                            <th className="px-2 py-2 text-right text-sm font-semibold text-gray-600">Last Price</th>
                            <th className="px-2 py-2 text-right text-sm font-semibold text-gray-600"> Change</th>

                        </tr>
                    </thead>
                    <tbody>
                        {mockTokens.map((token) => (
                            <tr
                                key={token.id}
                                onClick={() => router.push(`/trade/${token.name}`)}
                                className="cursor-pointer hover:bg-[#0c0e13]"
                            >
                                <td className='py-2'>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-10 h-10 bg-[#1b1d22] text-sm rounded-full flex items-center justify-center text-white font-bold">
                                            {token.symbol.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-xs">
                                                {token.name.toUpperCase()} /
                                                <span className='text-gray-400 text-[10px]'>{token.pair.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="text-right  text-xs">
                                    ${token.price.toLocaleString()}
                                </td>

                                <td className="text-right">
                                    <span
                                        className={`flex items-center justify-end space-x-1 text-xs ${token.change24h >= 0
                                            ? 'bg-green-600 w-fit float-end py-1 px-2 rounded-xl'
                                            : 'bg-red-500 w-fit float-end py-1 px-2 rounded-xl'
                                            }`}
                                    >
                                        {token.change24h >= 0 ? (
                                            <Plus className="w-3 h-3" />
                                        ) : (
                                            <Minus className="w-3 h-3" />
                                        )}
                                        <span className="font-semibold">{Math.abs(token.change24h)}%</span>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {addFunds && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center
                 md:items-center z-50"

                >
                    <div
                        className="
                   bg-[#0c0e13]  rounded-t-2xl md:rounded-2xl shadow-xl 
                    w-full md:w-[450px] 
                    p-6 
                    fixed bottom-0 md:static
                    animate-slideUp md:animate-fadeIn
                    "
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex justify-between items-center'>
                            <div></div>
                            <h2 className='text-center font-extrabold'>Please Select Deposit Method</h2>
                            <X className="w-5 h-5 text-white cursor-pointer" onClick={(() => setAddFunds(!addFunds))} />

                        </div>


                        <PaymentOptions />

                    </div>
                </div>
            )}

        </div>
    </div>
    )
};

export default TokensPage