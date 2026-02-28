import { FaPencilRuler } from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router";
import { MdGroups, MdSpaceDashboard } from "react-icons/md";
import { FaClockRotateLeft, FaFolder, FaStar, FaTrash } from "react-icons/fa6";
import clsx from "clsx";
import { SignedIn, SignOutButton, useUser } from "@clerk/clerk-react";
import DropdownLayout from "@/components/dropdown/DropdownLayout";
import { DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { IoLogOutOutline } from "react-icons/io5";

const NavLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: MdSpaceDashboard,
  },
  {
    name: "My Folders",
    href: "/dashboard/folders",
    icon: FaFolder,
  },
  {
    name: "Shared with me",
    href: "/dashboard/shared-with-me",
    icon: MdGroups,
  },
  {
    name: "Favorites",
    href: "/dashboard/favorite",
    icon: FaStar,
  },
  {
    name: "Recent",
    href: "/dashboard/recent",
    icon: FaClockRotateLeft,
  },
  {
    name: "Trash",
    href: "/dashboard/trash",
    icon: FaTrash,
  },
];

const ProfileButton = () => {
  const { user } = useUser();
  const fullName = user?.fullName?.toString() ?? "Unknown";
  const emailAddress = user?.emailAddresses[0]?.emailAddress ?? "Invalid email address";

  return (
    <DropdownLayout
      trigger={
        <button className="cursor-pointer rounded-lg px-2.5 py-2.5">
          <div className="flex items-center gap-x-2">
            <div className="aspect-square size-8 overflow-hidden rounded-lg bg-blue-500">
              <img className="object-fit size-full" src={user?.imageUrl} />
            </div>
            <div className="flex-1 text-start">
              <div className="text-primary-text-light text-sm font-semibold dark:text-white">
                {fullName.length > 24 ? fullName.slice(0, 24) + "..." : fullName}
              </div>
              <div className="text-secondary-text-light/80 text-xs dark:text-slate-400">
                {emailAddress.length > 30 ? emailAddress.slice(0, 30) + "..." : emailAddress}
              </div>
            </div>
          </div>
        </button>
      }
      triggerTitle="Profile options"
    >
      <DropdownMenuLabel className="text-secondary-text-light/80 text-xs font-normal dark:text-slate-400">
        Manage your account settings
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      {/* Sign out button using Clerk */}
      <SignedIn>
        <SignOutButton redirectUrl="/sign-in">
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
            <IoLogOutOutline className="h-4 w-4" />
            Sign out
          </button>
        </SignOutButton>
      </SignedIn>
    </DropdownLayout>
  );
};

function SideBar() {
  const location = useLocation();

  const pathname = location.pathname.replace(/\/+$/, "") || "/dashboard";

  return (
    <nav className="flex size-full flex-col justify-between overflow-y-auto px-4 py-6 xl:px-8">
      <div>
        <Link to={"/"} className="border-none outline-none">
          <div className="flex items-center gap-x-2.5">
            <span className="rounded-xl bg-blue-500 p-2.5">
              <FaPencilRuler className="text-xl text-white xl:text-2xl" />
            </span>
            <span className="text-xl font-bold xl:text-2xl">
              <p className="text-blue-600 dark:text-blue-400">SketchBlade</p>
            </span>
          </div>
        </Link>
        <div className="mt-10 flex flex-col gap-3">
          {NavLinks.map(({ name, href, icon: Icon }) => (
            <NavLink
              to={href}
              key={name}
              end
              className={clsx(
                pathname.startsWith(href) && (href !== "/dashboard" || href === pathname)
                  ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 dark:from-blue-600 dark:to-blue-700 dark:shadow-blue-500/20"
                  : "text-primary-text-light/85 bg-none hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-blue-500/10 dark:hover:text-white",
                "group cursor-pointer justify-start rounded-xl px-5 py-4 transition-all duration-200",
              )}
            >
              <div className="flex size-full items-center gap-3 xl:gap-4">
                <Icon className="h-5! w-5!" />
                <span className="text-base font-medium">{name}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <ProfileButton />
    </nav>
  );
}

export default SideBar;
