import Banner from "./Banner";
import StatManager from "./StatCard";
import { Outlet } from "react-router";

interface BodyProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

function Body({ query, setQuery }: BodyProps) {
  return (
    <div className="flex w-full min-h-full flex-col gap-6 bg-linear-to-tl from-blue-500/15 to-white px-4 pt-[calc(2rem+var(--dashboard-header))] md:px-6">
      <Banner />
      <StatManager />
      <div className="size-full flex-1 bg-yellow-500">
        <Outlet context={[query, setQuery]} />
      </div>
    </div>
  );
}

export default Body;
