import React from 'react'
import Swap from '@/components/Trade'
import Transactions from './transactions'
const TradePage = () => {
    return (
        <div>
            <Swap />
           <div className='p-4 pb-20'>
             <Transactions />
           </div>

        </div>
    )
}

export default TradePage
