import Banner from "./Banner";
import StatManager from "./StatCard";
import { Outlet } from "react-router";

function Body() {
  return (
    <div className="flex size-full flex-col gap-6 bg-linear-to-tl from-blue-500/15 to-white px-4 pt-[calc(2rem+var(--dashboard-header))] md:px-6">
      <Banner />
      <StatManager />
      <div className="size-full flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default Body;
