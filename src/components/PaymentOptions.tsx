import React from 'react'
import { Send, Rocket, X, Gift, ArrowUpRight, ArrowDownRight, Coins, Plus, Minus, ArrowBigRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';
const PaymentOptions = () => {
    return (
        <div className='bg-[#1b1d22] p-2 mt-5 rounded-xl'>

            <div className='flex justify-between items-center'>
                <div className='flex space-x-3'>
                    <div className="w-10 h-10 flex items-center justify-center ">
                        <Image
                            src="/images/paypal.png"
                            alt="PayPal"
                            width={40}
                            height={40}
                            className="object-contain rounded"
                        />
                    </div>

                    <div className='flex flex-col'>
                        <h3 className='font-bold'>PayPal</h3>

                    </div>
                </div>

                <ChevronRight className="w-5 h-5 text-white" />
            </div>

            <div className='flex justify-between items-center mt-2'>
                <div className='flex space-x-3'>
                    <div className="w-10 h-10 flex items-center justify-center ">
                        <Image
                            src="/images/opay.png"
                            alt="p"
                            width={40}
                            height={40}
                            className="object-contain rounded"
                        />
                    </div>



                    <div className='flex flex-col'>
                        <h3 className='font-bold'>Opay</h3>
                        <p className='text-[8px] text-gray-400'>

                        </p>

                    </div>
                </div>

                <ChevronRight className="w-5 h-5 text-white" />
            </div>

            <div className='flex justify-between items-center mt-2'>
                <div className='flex space-x-3'>
                    <div className="w-10 h-10 flex items-center justify-center ">
                        <Image
                            src="/images/cashapp.png"
                            alt="p"
                            width={40}
                            height={40}
                            className="object-contain rounded"
                        />
                    </div>

                    <div className='flex flex-col'>
                        <h3 className='font-bold'>Cash App</h3>
                        <p className='text-[8px] text-gray-400'>

                        </p>

                    </div>
                </div>

                <ChevronRight className="w-5 h-5 text-white" />
            </div>

            <div className='flex justify-between items-center mt-2'>
                <div className='flex space-x-3'>
                    <div className="w-10 h-10 flex items-center justify-center ">
                        <Image
                            src="/images/revolut.png"
                            alt="p"
                            width={40}
                            height={40}
                            className="object-contain rounded"
                        />
                    </div>

                    <h3 className='font-bold'>Revolut</h3>
                </div>

                <ChevronRight className="w-5 h-5 text-white" />
            </div>




        </div>
    )
}

export default PaymentOptions
