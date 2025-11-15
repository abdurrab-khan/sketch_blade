import React from "react";

interface HeaderProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

function Header({ query, setQuery }: HeaderProps) {
  return (
    <header className="fixed top-0 z-50 h-(--dashboard-header) w-full border-b border-slate-300/20 bg-white/20 drop-shadow-2xl backdrop-blur-xl"></header>
  );
}

export default Header;
