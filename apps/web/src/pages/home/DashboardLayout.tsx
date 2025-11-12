import Header from '@/components/dashboard/Header'
import React from 'react'

function DashboardLayout() {
    return (
        <div className='size-full'>
            <Header />

            <div className='w-full flex flex-col gap-20'>
                {
                    Array(20).fill(0).map((v) => <div className='w-full h-30 bg-blue-500'></div>)
                }
            </div>
        </div>
    )
}

export default DashboardLayout
