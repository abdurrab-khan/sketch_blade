import React from "react";
import { Button } from "@/components/ui/button";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import { Settings } from "lucide-react";

interface HeaderProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

function Header({ query, setQuery }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 z-40 h-(--dashboard-header) w-full border-b border-slate-300/20 bg-white/20 drop-shadow-2xl backdrop-blur-xl">
      <div className="flex size-full items-center px-2.5 xl:pr-3 xl:pl-[calc(var(--side-bar)+12px)]">
        <div className="flex size-full flex-1 items-center py-2">
          <div className="flex size-full items-center rounded-lg border border-slate-300/50 bg-white px-3 focus-within:border-blue-500/50 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-500/80">
            <IoIosSearch size={22} className="text-slate-400/60" />
            <span className="block w-full flex-1">
              <input
                className="w-full border-none px-3 py-2.5 text-slate-900 ring-0 outline-none placeholder:font-semibold placeholder:text-slate-400/60 dark:text-slate-100"
                placeholder="Search Diagrams, folders..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </span>
          </div>
        </div>
        <div className="ml-3">
          <Button variant={"outline"} size={"icon"}>
            <IoMdNotificationsOutline />
          </Button>
          <Button variant={"outline"} size={"icon"} className="ml-1.5">
            <Settings />
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
