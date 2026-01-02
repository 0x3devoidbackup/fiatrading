import React, { useState } from "react";
import {
  User,
  Headset,
  Home,
  Wallet,
  ArrowUpDown,
  ChartBarBig,
  X,
} from "lucide-react";
import Link from "next/link";
import SettingsModal from "@/components/ProfileModal";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [modal, setModal] = useState(false);

  return (
    <nav className="w-full px-6 py-4 lg:bg-[#0c0e13] lg:mb-5 text-white">
      {/* DESKTOP NAVBAR */}
      <div className="hidden lg:flex max-w-6xl mx-auto justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          {/* <Image src="/images/logo.png" className='rounded' alt='.' width={50} height={50} /> */}
          <img
            src="https://violet-recent-skunk-362.mypinata.cloud/ipfs/bafkreih2bop2brxlarnn3mkpmaesju4wodw33lrqyfk4jvxxa6duki2cfa"
            className="w-10 h-10"
          />
        </div>

        {/* Center: Navigation */}
        <div className="flex items-center space-x-8">
          <Link href="/home">
            <button className="hover:text-blue-400 transition">Home</button>
          </Link>
          <Link href="/market">
            <button className="hover:text-blue-400 transition">Market</button>
          </Link>
          <Link href="/trade/86736716">
            <button className="hover:text-blue-400 transition">Trade</button>
          </Link>
          <Link href="/portfolio">
            <button className="hover:text-blue-400 transition">
              Portfolio
            </button>
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          <button
            className="bg-[#1b1d22] p-2 rounded-full hover:bg-[#23252b] transition cursor-pointer"
            onClick={() => setModal(!modal)}
          >
            <User className="w-5 h-5" />
          </button>
          <Link href="https://farcaster.xyz/support">
            <button className="bg-[#1b1d22] p-2 rounded-full hover:bg-[#23252b] transition cursor-pointer">
              <Headset className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      {/* MOBILE TOP SECTION */}
      <div className="lg:hidden max-w-5xl mx-auto flex justify-between items-center">
        <button
          className="bg-[#1b1d22] p-2 rounded-full hover:bg-[#23252b] transition cursor-pointer"
          onClick={() => setModal(!modal)}
        >
          <User className="w-5 h-5" />
        </button>

        {/* <div className="border border-[#0c0e13] bg-[#1b1d22] py-2 px-4 rounded-xl">
                    <h2 className="font-bold text-sm text-white">FIATRADING</h2>
                </div> */}

        <div className="flex items-center space-x-4">
          <img
            src="https://violet-recent-skunk-362.mypinata.cloud/ipfs/bafkreih2bop2brxlarnn3mkpmaesju4wodw33lrqyfk4jvxxa6duki2cfa"
            className="w-10 h-10"
          />
        </div>
        <Link href="https://farcaster.xyz/support">
          <button className="bg-[#1b1d22] p-2 rounded-full hover:bg-[#23252b] transition">
            <Headset className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div
        className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 flex justify-between items-center 
                space-x-6 bg-[#1b1d22] px-6 py-1 w-full shadow-lg border border-[#0c0e13]"
      >
        <Link href="/home">
          <button className="p-2 flex flex-col space-y-1 items-center hover:bg-[#23252b] transition">
            <Home className="w-4 h-4 text-white" />
            <p className="text-[10px] text-gray-300">Home</p>
          </button>
        </Link>

        <Link href="/market">
          <button className="p-2 flex flex-col space-y-1 items-center hover:bg-[#23252b] transition">
            <ChartBarBig className="w-4 h-4 text-white" />
            <p className="text-[10px] text-gray-300">Market</p>
          </button>
        </Link>

        <Link href="/trade/8437398">
          <button className="p-2 flex flex-col space-y-1 items-center hover:bg-[#23252b] transition">
            <ArrowUpDown className="w-4 h-4 text-white" />
            <p className="text-[10px] text-gray-300">Trade</p>
          </button>
        </Link>

        <Link href="/portfolio">
          <button className="p-2 flex flex-col space-y-1 items-center hover:bg-[#23252b] transition">
            <Wallet className="w-4 h-4 text-white" />
            <p className="text-[10px] text-gray-300">Portfolio</p>
          </button>
        </Link>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-md mx-auto p-4 pt-4">
            {/* Close Button */}
            <div className="flex items-center justify-end mb-4">
              <X
                className="w-6 h-6 text-neutral-300 cursor-pointer"
                onClick={() => setModal(false)}
              />
            </div>

            <SettingsModal onComplete={() => setModal(false)} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
