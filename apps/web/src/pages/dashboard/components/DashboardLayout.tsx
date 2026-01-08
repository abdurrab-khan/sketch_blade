import { useEffect, useState } from "react";
import Body from "./mainpanel/Body";
import Header from "./mainpanel/Header";

function DashboardLayout() {
  const [query, setQuery] = useState("");

  return (
    <div className="size-full">
      <Header query={query} setQuery={setQuery} />
      <Body query={query} setQuery={setQuery} />
    </div>
  );
}

export default DashboardLayout;
