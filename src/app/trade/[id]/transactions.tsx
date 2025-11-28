"use client"
import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from "lucide-react";
import { timeAgo } from '@/utils/useableComponents';

type Transaction = {
    amount: string;
    name: string;
    price: number | string;
    _id: string;
    type: "buy" | "sell";
    time: string;
    value: string;
    hash?: string;
};
const mock: Transaction[] = [
    {
        _id: "MF...a23d",
        name: "John",
        amount: "1200",
        price: 0.15,
        type: "buy",
        time: "2025-11-27 12:40",
        value: "180",
        hash: "0x91f3cfe321902a23d"
    },
    {
        _id: "MF...12ff",
        name: "Lola",
        amount: "800",
        price: 0.15,
        type: "sell",
        time: "2025-11-27 12:32",
        value: "120",
        hash: "0xa34beab90170212ff"
    },
    {
        _id: "MF...8842",
        name: "Mike",
        amount: "560",
        price: 0.15,
        type: "buy",
        time: "2025-11-27 12:20",
        value: "84",
        hash: "0x71ac9082d8728842"
    },
    {
        _id: "MF...cc11",
        name: "Ada",
        amount: "1500",
        price: 0.15,
        type: "sell",
        time: "2025-11-27 12:10",
        value: "225",
        hash: "0x33df9fedbb89cc11"
    },
    {
        _id: "MF...3bb1",
        name: "David",
        amount: "2200",
        price: 0.15,
        type: "buy",
        time: "2025-11-27 11:49",
        value: "330",
        hash: "0xcc9183dde0993bb1"
    },
    {
        _id: "MF...771a",
        name: "Henry",
        amount: "480",
        price: 0.15,
        type: "sell",
        time: "2025-11-27 11:45",
        value: "72",
        hash: "0x99d0ffdd2902771a"
    },
    {
        _id: "MF...992b",
        name: "Queen",
        amount: "2600",
        price: 0.15,
        type: "buy",
        time: "2025-11-27 11:40",
        value: "390",
        hash: "0x51c18d922314992b"
    },
    {
        _id: "MF...019a",
        name: "Samuel",
        amount: "1900",
        price: 0.15,
        type: "sell",
        time: "2025-11-27 11:30",
        value: "285",
        hash: "0x883dba119802019a"
    },
    {
        _id: "MF...9021",
        name: "Ope",
        amount: "700",
        price: 0.15,
        type: "buy",
        time: "2025-11-27 11:22",
        value: "105",
        hash: "0x71ab2ee003119021"
    },
    {
        _id: "MF...ee22",
        name: "Gideon",
        amount: "1300",
        price: 0.15,
        type: "sell",
        time: "2025-11-27 11:18",
        value: "195",
        hash: "0x1200af902211ee22"
    }
];


const Transactions = () => {

    const [tnx, setTnx] = useState<Transaction[]>(mock);

    return (
        <div className="bg-[#0c0e13] rounded-2xl border border-[#1b1f29] MF-5 w-full p-4  flex flex-col max-w-2xl mx-auto">
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
                Transactions
            </h3>

            <div className="overflow-y-auto overflow-x-auto max-h-100 scrollbar-thin scrollbar-thumb-[#1b1f29] scrollbar-track-transparent custom-scrollbar">
                <table className="w-full text-sm text-left text-gray-400 min-w-[600px]">
                    <thead className="text-xs uppercase text-gray-400 border-b border-gray-700">
                        <tr>
                            <th className="py-3 px-2">Trader</th>
                            <th className="py-3 px-2">Action</th>
                            <th className="py-3 px-2">USD</th>
                            <th className="py-3 px-2">LYMP</th>
                            <th className="py-3 px-2">Date</th>
                            <th className="py-3 px-2 text-right">Tx</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tnx.map((tx, i) => (
                            <tr
                                key={i}
                                className="border-b border-gray-800 hover:bg-[#12151c] transition duration-150"
                            >
                                <td className="py-3 px-2 flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                                        {tx._id[2]}
                                    </div>
                                    <span className="text-white">{tx._id}</span>
                                </td>

                                <td
                                    className={`py-3 px-2 font-medium ${tx.type === "buy" ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {tx.type}
                                </td>

                                {/* Pair amount/value */}
                                {tx.type === "buy" ? (
                                    <td className="py-3 px-2">{tx.value}</td>
                                ) : (
                                    <td className="py-3 px-2">{tx.amount}</td>
                                )}

                                {tx.type === "buy" ? (
                                    <td className="py-3 px-2">{tx.amount}</td>
                                ) : (
                                    <td className="py-3 px-2">{tx.value}</td>
                                )}

                                <td className="py-3 px-2">{timeAgo(tx.time)}</td>

                                <td className="py-3 px-2 text-right">
                                    <a
                                        href={`https://etherscan.io/tx/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-blue-400"
                                    >
                                        <ArrowUpRight
                                            className={`w-4 h-4 inline ${tx.type === "buy"
                                                ? "text-green-500"
                                                : "text-red-500"
                                                }`}
                                        />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
