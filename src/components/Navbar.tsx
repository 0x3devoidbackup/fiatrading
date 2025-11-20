import React from 'react';
import { User, Headset, Home, Wallet, ArrowUpDown, ChartBarBig } from 'lucide-react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav className="w-full px-6 py-4 lg:bg-[#0c0e13] lg:mb-5 text-white">

            {/* DESKTOP NAVBAR */}
            <div className="hidden lg:flex max-w-6xl mx-auto justify-between items-center">

                {/* Left: Logo */}
                <div className="flex items-center space-x-4">
                    <h2 className="font-bold text-xl">FIATRADING</h2>
                </div>

                {/* Center: Navigation */}
                <div className="flex items-center space-x-8">
                    <Link href="/home">
                        <button className="hover:text-blue-400 transition">Home</button>
                    </Link>
                    <Link href="/market">
                        <button className="hover:text-blue-400 transition">Market</button>

                    </Link>
                    <Link href="/trade">
                        <button className="hover:text-blue-400 transition">Trade</button>
                    </Link>
                    <Link href="/portfolio">
                        <button className="hover:text-blue-400 transition">Portfolio</button>
                    </Link>

                </div>

                {/* Right: Icons */}
                <div className="flex items-center space-x-4">
                    <button className="bg-[#1b1d22] p-2 rounded-full hover:bg-[#23252b] transition">
                        <User className="w-5 h-5" />
                    </button>
                    <button className="bg-[#1b1d22] p-2 rounded-full hover:bg-[#23252b] transition">
                        <Headset className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* MOBILE TOP SECTION */}
            <div className="lg:hidden max-w-5xl mx-auto flex justify-between items-center">

                <div className="bg-[#1b1d22] p-2 rounded-full cursor-pointer hover:bg-[#23252b] transition">
                    <User className="w-5 h-5 text-white" />
                </div>

                <div className="border border-[#0c0e13] bg-[#1b1d22] py-2 px-4 rounded-xl">
                    <h2 className="font-bold text-sm text-white">FIATRADING</h2>
                </div>

                <div className="bg-[#1b1d22] p-2 rounded-full cursor-pointer hover:bg-[#23252b] transition">
                    <Headset className="w-5 h-5 text-white" />
                </div>
            </div>

            {/* MOBILE BOTTOM NAV */}
            <div className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 flex justify-between items-center 
                space-x-6 bg-[#1b1d22] px-6 py-1 w-full shadow-lg border border-[#0c0e13]">
                <Link href="/home">
                    <button className="p-2 flex flex-col space-y-1 items-center hover:bg-[#23252b] transition">
                        <Home className="w-4 h-4 text-white" />
                        <p className='text-[10px] text-gray-300'>Home</p>
                    </button></Link>

                <Link href="/market">
                    <button className="p-2 flex flex-col space-y-1 items-center hover:bg-[#23252b] transition">
                        <ChartBarBig className="w-4 h-4 text-white" />
                        <p className='text-[10px] text-gray-300'>Market</p>
                    </button></Link>

                <Link href="/trade">
                    <button className="p-2 flex flex-col space-y-1 items-center hover:bg-[#23252b] transition">
                        <ArrowUpDown className="w-4 h-4 text-white" />
                        <p className='text-[10px] text-gray-300'>Trade</p>
                    </button>
                    </Link>

                <Link href="/portfolio">
                    <button className="p-2 flex flex-col space-y-1 items-center hover:bg-[#23252b] transition">
                        <Wallet className="w-4 h-4 text-white" />
                        <p className='text-[10px] text-gray-300'>Portfolio</p>
                    </button>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
