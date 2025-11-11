import React from 'react';
import { Network, Repeat, BarChart, Globe, Twitter, } from 'lucide-react';
import Image from 'next/image'

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 ">
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* About */}
                {/* <div className="space-y-4">
                    <h3 className="text-white text-2xl font-extrabold">GrantDAO</h3>
                    <p className="text-gray-400 text-sm">
                        GrantDAO is a decentralized platform for funding innovative projects through community governance. Our goal is to support creators and developers with transparency and efficiency.
                    </p>
                </div> */}

                {/* Links */}


                {/* Socials */}
                <div className="space-y-2">


                    <h4 className="text-white font-semibold">Buy $GRANT</h4>

                    <div className="flex space-x-4 mt-2">
                        <a
                            href="https://clanker.world/clanker/0x15c7E09fDB1c08590121259D7249628d5f476b07"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                        >
                            <Image src="/images/clanker.png" alt="logo" width={30} height={30} className='rounded-full' />

                        </a>

                        <a
                            href="https://dexscreener.com/base/0x86e728846e484e357fbf62b38d0bd18d4507b955711e7b8c2428cdd2c2329057"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                        >
                            <Image src="/images/dex.png" alt="logo" width={30} height={30} className='rounded-full'/>

                        </a>
                    </div>

                    <h4 className="text-white font-semibold mt-5">Connect with us</h4>
                    <p className="text-gray-500 text-xs mt-2">
                        Follow us to stay updated with the latest grants and community news.
                    </p>
                    <div className="flex space-x-4 mt-2">
                        <a href="https://x.com/grantdao31683?s=09" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <Twitter className="w-6 h-6" />
                        </a>


                        <a href="https://farcaster.xyz/grantdao" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <Image src="/images/farcast.png" alt="logo" width={30} height={30} className='rounded-full' />

                        </a>
                    </div>


                </div>


            </div>

            <div className=' px-6 py-2'>
                <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} GrantDao. All rights reserved.</p>

            </div>
        </footer>
    );
};

export default Footer;
