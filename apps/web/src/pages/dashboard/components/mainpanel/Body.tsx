import Banner from "./Banner";
import StatManager from "./StatCard";
import { Outlet } from "react-router";

interface BodyProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

function Body({ query, setQuery }: BodyProps) {
  return (
    <div className="dark:to-primary-bg-dark dark:from-secondary-bg-dark flex min-h-full w-full flex-col bg-linear-to-tl from-blue-500/15 to-white">
      <div className="mt-(--dashboard-header) flex flex-1 flex-col gap-6 px-4 pt-8 pb-4 md:px-6">
        <Banner />
        <StatManager />
        <div className="flex flex-1 flex-col">
          <Outlet context={[query, setQuery]} />
        </div>
      </div>
    </div>
  );
}

export default Body;
