import { NavLink, Outlet, useLocation } from "react-router";
import { motion } from "motion/react";

type NavLinks = {
  name: string;
  pathName: string;
}[];

const navLinks: NavLinks = [
  {
    name: "All",
    pathName: "",
  },
  {
    name: "Folder",
    pathName: "folder",
  },
  {
    name: "Created by me",
    pathName: "created-by-me",
  },
];

const AppSection = () => {
  const { pathname } = useLocation();

  return (
    <div className={"main-container"} style={{ height: "calc(100vh - 5rem)" }}>
      <div className={"flex size-full flex-col gap-y-5 px-4 pt-9 md:px-0"}>
        <div className={"flex w-full flex-col gap-y-4 overflow-y-hidden"}>
          <div
            className={"border-tertiary dark:border-border-dark w-full rounded-md border px-4 py-2"}
          >
            <div>
              <ul className={"flex-start flex-wrap gap-4 capitalize select-none"}>
                {navLinks.map(({ pathName, name }) => (
                  <li key={pathName} className="relative rounded-md py-1.5 text-sm">
                    <NavLink
                      to={pathName}
                      className="text-quaternary hover:text-tertiary dark:text-secondary-text-dark dark:hover:text-primary-text-dark relative z-20 px-8 transition-colors"
                    >
                      {name}
                    </NavLink>
                    {pathname.split("/")[1] === pathName && (
                      <motion.span
                        layoutId="active"
                        className="bg-secondary absolute top-0 left-0 z-10 size-full rounded-md"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={"size-full flex-1 overflow-y-auto"}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AppSection;
