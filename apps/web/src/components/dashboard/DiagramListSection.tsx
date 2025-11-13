import StatCard from './StatCard'
import { PlusIcon } from 'lucide-react'
import { MdGroups } from 'react-icons/md'
import { Button } from '@/components/ui/button'
import { FaFile, FaFolder, FaShareNodes } from 'react-icons/fa6'
import { All } from '@/pages/home'

function DiagramListSection() {
    return (
        <div className='bg-linear-to-tl from-blue-500/15 to-white px-4 md:px-6 flex flex-col gap-6 pt-[calc(2rem+var(--dashboard-header))]'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-4xl text-primary-text-light font-bold'>
                        My Diagrams
                    </h3>
                    <p className='text-secondary-text-light/75 text-xl font-normal mt-2.5'>
                        Manage and collaborate on your diagram projects
                    </p>
                </div>
                <Button
                    variant={"createDiagram"}
                    className='py-6 px-8 rounded-xl bg-linear-to-r from-blue-400 to-blue-600 shadow-xl shadow-slate-400/10 hover:scale-105 hover:shadow-2xl hover:shadow-slate-400'
                >
                    <PlusIcon className='h-6! w-6!' />
                    <span className='text-base'>
                        New Diagram
                    </span>
                </Button>
            </div>
            <div className='flex flex-wrap shrink gap-y-4 gap-x-0 sm:gap-x-10 xl:gap-x-12'>
                <StatCard
                    icon={FaFile}
                    count={200}
                    title='Total Diagrams'
                />
                <StatCard
                    icon={MdGroups}
                    count={18}
                    title='Collaborators'
                />
                <StatCard
                    icon={FaFolder}
                    count={80}
                    title='Folders'
                />
                <StatCard
                    icon={FaShareNodes}
                    count={64}
                    title='Shared Files'
                    style='from-red-400 to-red-500'
                />
            </div>
            <div className='flex flex-col'>
                <All />
            </div>
        </div >
    )
}

export default DiagramListSection
