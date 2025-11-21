"use client"
import React, { useState } from 'react'
import { Rocket, Upload } from 'lucide-react'
import Image from 'next/image';

const LaunchPage = () => {
    const [image, setImage] = useState<string>("");
    const [tokenName, setTokenName] = useState("");
    const [ticker, setTicker] = useState("");
    const [description, setDescription] = useState("");
    const [initialBuy, setInitialBuy] = useState("")
    const [imageURL, setImageURL] = useState("");
    const [socials, setSocials] = useState({
        twitter: "",
        telegram: "",
        website: "",
    });

    const [loading, setLoading] = useState(false);
    return (
        <div className='max-w-3xl mx-auto px-4 mb-20'>

            <div className='flex items-center justify-center mt-10 space-x-2'>
                <Rocket className="w-7 h-7 text-white font-extrabold" />
                <h2 className='text-2xl font-extrabold'>Launchpad</h2>
            </div>

            <form>

                <div className="text-white flex  gap-6 items-start mt-8">
                    <label
                        htmlFor="logo-upload"
                        className="cursor-pointer w-30 h-30 border-2 border-dashed border-[#224930] rounded-xl flex flex-col justify-center items-center bg-[#0c0e13] hover:border-[#75ee9f] transition-colors"
                    >
                        {image ? (
                            <Image
                                src={image}
                                width={100}
                                height={100}
                                alt="Uploaded logo"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <>
                                <Upload size={28} className="text-[#0AFF5E]" />
                                <p className="text-sm mt-1">Upload</p>
                            </>
                        )}
                        <input
                            id="logo-upload"
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            className="hidden"
                            // onChange={handleImageChange}
                            required
                        />
                    </label>

                    <div className="text-sm text-gray-300 space-y-1">
                        <p className="text-[13px] font-semibold">
                            LOGO IMAGE <span className="text-red-500">*</span>
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>PNG, JPEG, WebP, or GIF</li>
                            <li>Max 5MB</li>
                            <li>Must be square (1:1 ratio)</li>
                        </ul>
                    </div>
                </div>

                {/* INPUTS */}

                <div className="grid sm:grid-cols-2 gap-2 mt-5">
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            TOKEN NAME <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            maxLength={60}
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                            required
                            placeholder="Bitcoin"
                            className="w-full bg-transparent border border-[#2c2f36] focus:border-[#224930] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">{tokenName.length}/60</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            SYMBOL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            maxLength={20}
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value)}
                            placeholder="BTC"
                            required
                            className="w-full bg-transparent border border-[#2c2f36] focus:border-[#224930] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">{ticker.length}/20</p>
                    </div>
                </div>

                {/* Description */}
                <div className='mt-1'>
                    <label className="block text-sm font-semibold mb-1">DESCRIPTION  <span className="text-red-500">*</span></label>
                    <textarea
                        required
                        maxLength={256}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your token..."
                        className="w-full bg-transparent border border-[#2c2f36] focus:border-[#224930] outline-none rounded-xl px-4 py-2 h-24 resize-none placeholder-gray-500 text-sm"
                    />

                    <p className="text-xs text-gray-500 mt-1">{description.length}/256</p>
                </div>

                {/* Social Links */}
                <div className='mt-5'>
                    <label className="block text-sm font-semibold mb-2">
                        SOCIAL LINKS
                    </label>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Twitter */}
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">
                                Twitter / X
                            </label>
                            <input
                                type="url"
                                placeholder="x.com/username"
                                value={socials.twitter}
                                onChange={(e) =>
                                    setSocials({ ...socials, twitter: e.target.value })
                                }
                                className="w-full bg-transparent border border-[#2c2f36] focus:border-[#224930] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                            />
                        </div>

                        {/* Telegram */}
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Telegram</label>
                            <input
                                type="url"
                                placeholder="t.me/username"
                                value={socials.telegram}
                                onChange={(e) =>
                                    setSocials({ ...socials, telegram: e.target.value })
                                }
                                className="w-full bg-transparent border border-[#2c2f36] focus:border-[#224930] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Website</label>
                            <input
                                type="url"
                                placeholder="example.com"
                                value={socials.website}
                                onChange={(e) =>
                                    setSocials({ ...socials, website: e.target.value })
                                }
                                className="w-full bg-transparent border border-[#2c2f36] focus:border-[#224930] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                            />
                        </div>

                    </div>
                </div>

                <button type='submit' disabled={loading} className={`${loading ? "bg-[#2c2f36] border border-[#2c2f36] text-[#fff]" : "bg-gradient-to-r from-blue-600 to-blue-600 text-white cursor-pointer"}  m-auto mt-5 space-x-3  font-extrabold py-2 px-6 text-sm rounded-2xl transition-colors w-full`}>
                    {loading ? "Creating..." : "Create Token"}
                </button>

            </form>

        </div>
    )
}

export default LaunchPage
