import { useState } from "react";
import Body from "@/components/dashboard/mainpanel/Body";
import Header from "@/components/dashboard/mainpanel/Header";

function DashboardLayout() {
  const [query, setQuery] = useState("");

  return (
    <div className="size-full">
      <Header query={query} setQuery={setQuery} />
      <Body />
    </div>
  );
}

export default DashboardLayout;
