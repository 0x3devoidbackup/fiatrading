"use client";
import React, { useState } from "react";

const mockPairs = [
  { pair: "BTC/EUR", volume: "1.764M", price: 75708.27, change: 0.89 },
  { pair: "ETH/EUR", volume: "814.448K", price: 2518.65, change: 2.10 },
  { pair: "SOL/EUR", volume: "687.919K", price: 118.17, change: 3.33 },
  { pair: "USDC/EUR", volume: "928.523K", price: 0.868, change: 0.04 },
  { pair: "KAS/EUR", volume: "53.93K", price: 0.04563, change: 27.56 },

];


const PairSelector = () => {
  const [search, setSearch] = useState("");

  const filteredPairs = mockPairs.filter((p) =>
    p.pair.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto py-4 px-2 text-white">

      {/* Search */}
      <div className="bg-neutral-900 p-3 rounded-xl mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


      {/* Header */}
      <div className="flex justify-between text-neutral-500 text-xs mt-4 mb-2">
        <span>Pair / Vol</span>
        <span>Last Price / Change</span>
      </div>

      {/* Pair List */}
      <div className="space-y-4">
        {filteredPairs.map((p, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-neutral-900 p-3 rounded-xl border border-neutral-800 cursor-pointer"
          >
            <div>
              <div className="font-semibold text-white">{p.pair}</div>
              <div className="text-xs text-neutral-400">{p.volume}</div>
              <span className="text-blue-400 text-xs">0 Fees</span>
            </div>

            <div className="text-right">
              <div className="text-white font-semibold">{p.price}</div>
              <div
                className={`text-sm font-medium ${
                  p.change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {p.change >= 0 ? "+" : ""}
                {p.change}%
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PairSelector;
