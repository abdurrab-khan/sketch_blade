import { FaPencilRuler } from 'react-icons/fa'
import { Link, NavLink } from 'react-router'
import { MdGroups, MdSpaceDashboard } from 'react-icons/md'
import { FaClockRotateLeft, FaFolder, FaStar, FaTrash } from 'react-icons/fa6'
import clsx from 'clsx'
import { useUser } from '@clerk/clerk-react'

const NavLinks = [
    {
        name: 'Dashboard',
        href: '/',
        icon: MdSpaceDashboard,
    },
    {
        name: "My Files",
        href: "/my-files",
        icon: FaFolder
    },
    {
        name: "Shared with me",
        href: "/shared-with-me",
        icon: MdGroups
    },
    {
        name: "Favorites",
        href: "/favorite",
        icon: FaStar
    },
    {
        name: "Recent",
        href: "/recent",
        icon: FaClockRotateLeft
    },
    {
        name: "Trash",
        href: "/trash",
        icon: FaTrash
    }
]

function SideBar() {
    const { user } = useUser();

    return (
        <nav className='size-full flex px-8 py-6 flex-col justify-between overflow-y-auto'>
            <div>
                <Link to={"/"} className='outline-none border-none'>
                    <div className='flex gap-x-4 items-center'>
                        <span className='bg-blue-500 p-2.5 rounded-xl'>
                            <FaPencilRuler size={26} className='text-white' />
                        </span>
                        <span className='text-3xl font-bold'>
                            <p className='text-blue-900'>
                                SketchBlade
                            </p>
                        </span>
                    </div>
                </Link>
                <div className='flex flex-col gap-3 mt-10'>
                    {
                        NavLinks.map(({ name, href, icon: Icon }) => (
                            <NavLink
                                to={href}
                                className={({ isActive }) =>
                                    clsx(
                                        isActive ? "text-white/95 bg-linear-to-r from-blue-400 to-blue-600 shadow-xl shadow-slate-300/80" : "bg-none text-primary-text-light/85",
                                        "py-4 px-5 rounded-xl group justify-start cursor-pointer"
                                    )
                                }
                            >
                                <div className='flex items-center gap-4 size-full'>
                                    <Icon className='h-5! w-5!' />
                                    <span className='text-base font-medium'>
                                        {name}
                                    </span>
                                </div>
                            </NavLink>
                        ))
                    }
                </div>
            </div>
            <button className='cursor-pointer px-2.5 py-2 rounded-lg border'>
                <div className='flex gap-x-2 items-center'>
                    <div className='size-9 bg-blue-500 overflow-hidden rounded-lg'>
                        <img className='size-full object-contain' src={user?.imageUrl} />
                    </div>
                    <div className='flex-1 text-start'>
                        <div className='text-sm text-primary-text-light'>
                            {
                                (user?.fullName.length ?? "") > 24 ? user.fullName.slice(0, 24) + "..." : user?.fullName
                            }
                        </div>
                        <div className='text-xs text-primary-text-light/90'>
                            {
                                (user?.emailAddresses[0]?.emailAddress.length ?? "") > 30 ? user?.emailAddresses[0].emailAddress.slice(0, 30) + "..." : user?.emailAddresses[0].emailAddress
                            }
                        </div>
                    </div>
                </div>
            </button>
        </nav>
    )
}

export default SideBar
