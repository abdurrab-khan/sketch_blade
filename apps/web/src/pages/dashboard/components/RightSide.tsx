import { useState } from "react";
import Body from "./mainpanel/Body";
import Header from "./mainpanel/Header";

function RightSide() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative size-full">
      <Header query={query} setQuery={setQuery} />
      <Body query={query} setQuery={setQuery} />
    </div>
  );
}

export default RightSide;
