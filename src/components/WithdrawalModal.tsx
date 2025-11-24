import React, { useState } from 'react';
import { ArrowLeft, Search, Trash2 } from 'lucide-react';

interface CryptoToken {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  usdValue: number;
  suspended?: boolean;
}

export default function CryptoSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchHistory = [ 'USD', 'EUR', 'NGN', 'GBP'];
  
  const cryptoList: CryptoToken[] = [
    { id: '1', symbol: 'USD', name: 'US dollar', icon: '$', balance: 0.00000097, usdValue: 0.0027 },
    { id: '2', symbol: 'NGN', name: 'Naira', icon: 'N', balance: 0, usdValue: 0 },
    { id: '3', symbol: 'EUR', name: 'Euro', icon: '₿', balance: 0, usdValue: 0 },
    { id: '4', symbol: 'GBP', name: 'British pound', icon: '◎', balance: 0, usdValue: 0 },
    { id: '5', symbol: 'AUD', name: 'Australian dollar', icon: '🔷', balance: 0, usdValue: 0 },
  
  ];

  const filteredCrypto = searchQuery
    ? cryptoList.filter(
        (token) =>
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cryptoList;

  return (
    <div className="min-h-screen text-white">

      {/* Search Header */}
      <div className="flex items-center gap-2 ">
       
        <div className="flex-1 flex items-center gap-2 bg-zinc-900 rounded-full px-4 py-3">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-400 placeholder-gray-600"
          />
        </div>
      </div>

      {/* Search History */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-500 text-sm">Search History</h2>
          <button>
            <Trash2 className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex gap-2">
          {searchHistory.map((term) => (
            <button
              key={term}
              className="px-4 py-2 bg-zinc-900 rounded-lg text-sm font-medium"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Crypto List */}
      <div className="mt-5">
        <h2 className="text-gray-500 text-sm mb-4">Fiat</h2>
        <div className="space-y-1">
          {filteredCrypto.map((token) => (
            <div
              key={token.id}
              className="flex items-center justify-between py-3 active:bg-zinc-900 rounded-lg px-2 -mx-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                  {token.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{token.symbol}</span>
                    
                  </div>
                  <span className="text-sm text-gray-500">{token.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {token.balance === 0 ? '0' : token.balance.toFixed(8)}
                </div>
                <div className="text-sm text-gray-500">
                  ≈{token.usdValue.toFixed(token.usdValue > 0 ? 4 : 0)} USD
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}