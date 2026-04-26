import RightSide from "./components/RightSide";
import SideBar from "./components/sidebar/SideBar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full flex-row overflow-y-auto">
      <section className="bg-primary-bg-light/90 dark:bg-primary-bg-dark/95 fixed top-0 left-0 z-50 hidden h-full w-(--side-bar) border-r border-l border-slate-300/20 drop-shadow-2xl drop-shadow-black/25 backdrop-blur-2xl hover:drop-shadow-black/25 xl:block dark:border-blue-500/10">
        <SideBar />
      </section>
      <section className="ml-0 min-h-screen w-full xl:ml-(--side-bar)">
        <RightSide />
      </section>
    </div>
  );
}

export default DashboardLayout;
