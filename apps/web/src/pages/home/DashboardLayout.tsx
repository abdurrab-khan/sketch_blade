import React from 'react'
import Header from '@/components/dashboard/Header'
import DiagramListSection from '@/components/dashboard/DiagramListSection'

function DashboardLayout() {
    return (
        <div className='size-full'>
            <Header />
            <DiagramListSection />
        </div>
    )
}

export default DashboardLayout
