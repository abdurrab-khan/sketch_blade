import clsx from 'clsx'
import { IconType } from 'react-icons'

interface StatCardProps {
    icon: IconType
    count: number
    title: string
    style?: string
}

function StatCard({ icon: Icon, count, title, style = "" }: StatCardProps) {
    return (
        <div className='w-full sm:w-[calc(50%-1.25rem)] md:w-64 2xl:w-[20rem] px-8 py-6 h-50 bg-primary-bg-light shadow-lg shadow-slate-400/40 hover:shadow-slate-400/50 transition-shadow border border-slate-300/25 rounded-2xl'>
            <div className='size-full flex justify-center flex-col'>
                <div className={clsx(style, "w-12 h-12 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center")}>
                    <Icon className="text-white w-6 h-6" />
                </div>
                <div className='mt-2'>
                    <p className='text-primary-text-light text-4xl font-bold'>
                        {count}
                    </p>
                    <p className='text-secondary-text-light/70 font-medium text-md'>
                        {title}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default StatCard
