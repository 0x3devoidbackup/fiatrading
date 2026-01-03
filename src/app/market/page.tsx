"use client"
import React, { useState, useEffect } from 'react';
import { Token } from '@/types';
import { ArrowUpRight, ArrowDownRight, Coins, Plus, Minus } from 'lucide-react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { mockTokens } from '@/data/mockData';




const MarketPage = () => {
    const router = useRouter();

    return (
        <div className='max-w-5xl mx-auto pb-20 px-2'>
            <div className="hidden lg:flex rounded-xl shadow-lg overflow-hidden">
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
                            <tr key={token._id} className=" hover:[#0c0e13]">
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
                                    <Link href={`/trade/${token._id}`}>
                                        <button className="bg-blue-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                            Trade
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 lg:hidden rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="">
                        <tr>
                            <th className="text-left text-sm font-semibold text-gray-600">Token</th>
                            <th className="text-left text-sm font-semibold text-gray-600">Price</th>
                            <th className=" text-right text-sm font-semibold text-gray-600">Change</th>

                        </tr>
                    </thead>
                    <tbody>
                        {mockTokens.map((token) => (
                            <tr
                                key={token._id}
                                onClick={() => router.push(`/trade/${token._id}`)}
                                className="cursor-pointer hover:bg-[#0c0e13]"
                            >
                                <td className='py-1'>
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

                                <td className="text-left  text-xs">
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
        </div>
    )
}

export default MarketPage
