import React, { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Wallet, DollarSign, ArrowUpRight, ArrowDownRight, LogOut } from 'lucide-react';
import Link from 'next/link';

const App = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-black">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Trade Crypto with Fiat
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            The simplest way to buy and sell tokens using your local currency
          </p>
          <div className="flex justify-center space-x-4">

            <Link href="/signup">
              <button className="bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 text-white px-8 py-2 rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/signin">
              <button className="bg-white cursor-pointer text-gray-800 px-8 py-2 rounded-xl font-semibold text-lg hover:shadow-xl transition-all border-2 border-gray-200">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Wallet className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Deposits</h3>
            <p className="text-gray-600">Deposit fiat currency directly using PayPal gateway</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Trading</h3>
            <p className="text-gray-600">Buy and sell tokens instantly at current market prices</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fiat Withdrawals</h3>
            <p className="text-gray-600">Convert your profits back to fiat anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;