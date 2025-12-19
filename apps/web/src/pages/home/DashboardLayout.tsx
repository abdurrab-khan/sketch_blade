import { useState } from "react";
import Body from "@/components/dashboard/mainpanel/Body";
import Header from "@/components/dashboard/mainpanel/Header";

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
