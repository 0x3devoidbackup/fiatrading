"use client"
import React, { useState, useEffect } from 'react';
import { Token } from '@/types';
import { ArrowUpRight, ArrowDownRight, Coins, Plus, Minus } from 'lucide-react';
import { useRouter } from "next/navigation";

// Mock data
const mockTokens: Token[] = [
    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 45000, change24h: 2.5, marketCap: 850000000000, supply: 19000000, pair: "USD" },
    { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3200, change24h: -1.2, marketCap: 380000000000, supply: 120000000, pair: "EURO" },
    { id: '3', name: 'Solana', symbol: 'SOL', price: 105, change24h: 5.8, marketCap: 45000000000, supply: 430000000, pair: "NGN" },
    { id: '4', name: 'Cardano', symbol: 'ADA', price: 0.65, change24h: 3.2, marketCap: 23000000000, supply: 35000000000, pair: "AUD" },
    { id: '5', name: 'Polkadot', symbol: 'DOT', price: 8.5, change24h: -0.8, marketCap: 12000000000, supply: 1400000000, pair: "CAD" },

    { id: '6', name: 'Ripple', symbol: 'XRP', price: 0.52, change24h: 1.1, marketCap: 28000000000, supply: 52000000000, pair: "USD" },
    { id: '7', name: 'Dogecoin', symbol: 'DOGE', price: 0.085, change24h: -2.3, marketCap: 12000000000, supply: 140000000000, pair: "GBP" },
    { id: '8', name: 'Avalanche', symbol: 'AVAX', price: 38, change24h: 4.7, marketCap: 14000000000, supply: 360000000, pair: "CNY" },
    { id: '9', name: 'Chainlink', symbol: 'LINK', price: 17.5, change24h: 0.9, marketCap: 9000000000, supply: 600000000, pair: "JPY" },
    { id: '10', name: 'Litecoin', symbol: 'LTC', price: 95, change24h: -1.9, marketCap: 7000000000, supply: 73000000, pair: "USD" },

    { id: '11', name: 'Polygon', symbol: 'MATIC', price: 0.92, change24h: 2.6, marketCap: 8800000000, supply: 10000000000, pair: "NGN" },
    { id: '12', name: 'Tron', symbol: 'TRX', price: 0.14, change24h: 1.4, marketCap: 12000000000, supply: 87000000000, pair: "USD" },
    { id: '13', name: 'Toncoin', symbol: 'TON', price: 5.1, change24h: 7.3, marketCap: 18000000000, supply: 3400000000, pair: "RUB" },
    { id: '14', name: 'Cosmos', symbol: 'ATOM', price: 9.8, change24h: -0.4, marketCap: 3500000000, supply: 370000000, pair: "PHP" },
    { id: '15', name: 'Uniswap', symbol: 'UNI', price: 6.3, change24h: 3.9, marketCap: 4500000000, supply: 580000000, pair: "KES" },

    { id: '16', name: 'Aptos', symbol: 'APT', price: 9.1, change24h: -1.7, marketCap: 3400000000, supply: 320000000, pair: "BRL" },
    { id: '17', name: 'Arbitrum', symbol: 'ARB', price: 1.45, change24h: 2.2, marketCap: 1800000000, supply: 13000000000, pair: "ZAR" },
    { id: '18', name: 'Optimism', symbol: 'OP', price: 2.8, change24h: 0.5, marketCap: 2600000000, supply: 9000000000, pair: "HKD" },
    { id: '19', name: 'Near', symbol: 'NEAR', price: 7.4, change24h: 6.1, marketCap: 7600000000, supply: 970000000, pair: "SGD" },
    { id: '20', name: 'Stellar', symbol: 'XLM', price: 0.12, change24h: -0.9, marketCap: 3300000000, supply: 27000000000, pair: "INR" },

    { id: '21', name: 'VeChain', symbol: 'VET', price: 0.028, change24h: 3.1, marketCap: 2000000000, supply: 72000000000, pair: "MXN" },
    { id: '22', name: 'Render', symbol: 'RNDR', price: 6.8, change24h: 5.4, marketCap: 2500000000, supply: 360000000, pair: "USD" },
    { id: '23', name: 'Hedera', symbol: 'HBAR', price: 0.10, change24h: -1.1, marketCap: 3300000000, supply: 33000000000, pair: "AED" },
    { id: '24', name: 'Sui', symbol: 'SUI', price: 1.6, change24h: 4.3, marketCap: 1900000000, supply: 9000000000, pair: "NGN" },
    { id: '25', name: 'Injective', symbol: 'INJ', price: 38, change24h: 8.2, marketCap: 3300000000, supply: 90000000, pair: "EUR" },

    { id: '26', name: 'Aave', symbol: 'AAVE', price: 112, change24h: 1.9, marketCap: 1600000000, supply: 14000000, pair: "USD" },
];


const MarketPage = () => {
    const router = useRouter();

    return (
        <div className='max-w-5xl mx-auto py-2 px-4'>
            <div className="mt-5 hidden lg:flex rounded-xl shadow-lg overflow-hidden">
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

            <div className="mt-5 lg:hidden rounded-xl shadow-lg overflow-hidden">
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
        </div>
    )
}

export default MarketPage
