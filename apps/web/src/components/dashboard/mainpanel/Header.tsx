import React from "react";

interface HeaderProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

function Header({ query, setQuery }: HeaderProps) {
  return (
    <header className="fixed top-0 z-50 h-(--dashboard-header) w-full border-b border-slate-300/20 bg-white/20 drop-shadow-2xl backdrop-blur-xl">
      {/* <div className="flex size-full gap-x-4"> */}
      {/* <div className="flex-1 bg-blue-500"></div> */}
      {/* <div className="w-32 bg-yellow-500">Hello world</div> */}
      {/* </div> */}
    </header>
  );
}

export default Header;
