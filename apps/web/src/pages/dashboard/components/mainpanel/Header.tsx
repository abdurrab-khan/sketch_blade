import React, { useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import ThemeToggle from "@/components/ThemeToggle";
import Notification from "@/components/dropdown/Notification";
import { useLocation } from "react-router";

interface HeaderProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

function Header({ query, setQuery }: HeaderProps) {
  const { pathname } = useLocation();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    const url = new URL(window.location.href);

    if (e.target.value) {
      url.searchParams.set("q", e.target.value);
    } else {
      url.searchParams.delete("q");
    }

    window.history.replaceState({}, "", url.toString());
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("q") || "";

    setQuery(q);
  }, [setQuery, pathname]);

  return (
    <header className="dark:bg-primary-bg-dark/90 fixed top-0 left-0 z-40 h-(--dashboard-header) w-full border-b border-slate-300/20 bg-white/80 drop-shadow-2xl backdrop-blur-xl dark:border-blue-500/10">
      <div className="flex size-full items-center px-2.5 xl:pr-3 xl:pl-[calc(var(--side-bar)+12px)]">
        <div className="flex size-full flex-1 items-center py-2">
          <div className="dark:border-border-dark dark:bg-secondary-bg-dark/80 flex size-full items-center rounded-lg border border-slate-300/50 bg-white px-3 focus-within:border-blue-500/50 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-500/80 dark:focus-within:border-blue-500/40">
            <IoIosSearch size={22} className="text-slate-400/60 dark:text-blue-400" />
            <span className="block w-full flex-1">
              <input
                className="w-full border-none bg-transparent px-3 py-2.5 text-slate-900 ring-0 outline-none placeholder:font-semibold placeholder:text-slate-400/60 dark:text-white dark:placeholder:text-slate-500"
                placeholder="Search Diagrams, folders..."
                value={query}
                onChange={handleOnChange}
              />
            </span>
          </div>
        </div>
        <div className="ml-3">
          <Notification />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
