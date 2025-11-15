import Banner from "./Banner";
import StatManager from "./StatCard";
import { Outlet } from "react-router";

function Body() {
  return (
    <div className="flex flex-col gap-6 bg-linear-to-tl from-blue-500/15 to-white px-4 pt-[calc(2rem+var(--dashboard-header))] md:px-6">
      <div className="flex items-center justify-between">
        <Banner />
      </div>
      <div className="flex shrink flex-wrap gap-x-0 gap-y-3 sm:gap-x-4 sm:gap-y-4 xl:gap-x-12">
        <StatManager />
      </div>
      <div className="flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}

export default Body;
