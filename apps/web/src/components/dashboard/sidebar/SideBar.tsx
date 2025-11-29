import { FaPencilRuler } from "react-icons/fa";
import { Link, NavLink } from "react-router";
import { MdGroups, MdSpaceDashboard } from "react-icons/md";
import { FaClockRotateLeft, FaFolder, FaStar, FaTrash } from "react-icons/fa6";
import AuthBtn from "@/components/AuthBtn.tsx";
import clsx from "clsx";
import { useUser } from "@clerk/clerk-react";

const NavLinks = [
  {
    name: "Dashboard",
    href: "/",
    icon: MdSpaceDashboard,
  },
  {
    name: "My Folders",
    href: "folders",
    icon: FaFolder,
  },
  {
    name: "Shared with me",
    href: "/shared-with-me",
    icon: MdGroups,
  },
  {
    name: "Favorites",
    href: "/favorite",
    icon: FaStar,
  },
  {
    name: "Recent",
    href: "/recent",
    icon: FaClockRotateLeft,
  },
  {
    name: "Trash",
    href: "/trash",
    icon: FaTrash,
  },
];

function SideBar() {
  const { user } = useUser();

  const fullName = user?.fullName?.toString() ?? "Unknown";
  const emailAddress = user?.emailAddresses[0]?.emailAddress ?? "Invalid email address";

  return (
    <nav className="flex size-full flex-col justify-between overflow-y-auto px-8 py-6">
      <div>
        <Link to={"/"} className="border-none outline-none">
          <div className="flex items-center gap-x-4">
            <span className="rounded-xl bg-blue-500 p-2.5">
              <FaPencilRuler size={26} className="text-white" />
            </span>
            <span className="text-3xl font-bold">
              <p className="text-blue-900">SketchBlade</p>
            </span>
          </div>
        </Link>
        <div className="mt-10 flex flex-col gap-3">
          {NavLinks.map(({ name, href, icon: Icon }) => (
            <NavLink
              to={href}
              key={name}
              className={({ isActive }) =>
                clsx(
                  isActive
                    ? "bg-linear-to-r from-blue-400 to-blue-600 text-white/95 shadow-xl shadow-slate-300/50"
                    : "text-primary-text-light/85 bg-none",
                  "group cursor-pointer justify-start rounded-xl px-5 py-4",
                )
              }
            >
              <div className="flex size-full items-center gap-4">
                <Icon className="h-5! w-5!" />
                <span className="text-base font-medium">{name}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <AuthBtn />
      <button className="cursor-pointer rounded-lg px-2.5 py-2.5">
        <div className="flex items-center gap-x-2">
          <div className="size-9 overflow-hidden rounded-lg bg-blue-500">
            <img className="size-full object-contain" src={user?.imageUrl} />
          </div>
          <div className="flex-1 text-start">
            <div className="text-primary-text-light text-sm font-semibold">
              {fullName.length > 24 ? fullName.slice(0, 24) + "..." : fullName}
            </div>
            <div className="text-secondary-text-light/80 text-xs">
              {emailAddress.length > 30 ? emailAddress.slice(0, 30) + "..." : emailAddress}
            </div>
          </div>
        </div>
      </button>
    </nav>
  );
}

export default SideBar;
