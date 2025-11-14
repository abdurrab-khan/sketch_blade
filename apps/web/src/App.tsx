import DashboardLayout from "@/pages/home/DashboardLayout";
import SideBar from "@/components/dashboard/sidebar/SideBar";

function App() {
  return (
    <main className={"flex flex-row overflow-x-hidden size-screen"}>
      <section className="w-(--side-bar) bg-primary-bg-light/90 border-r backdrop-blur-2xl hidden drop-shadow-2xl drop-shadow-black/25 border-l border-slate-300/20 left-0 h-full top-0 fixed hover:drop-shadow-black/25 dark:bg-primary-bg-dark  dark:border-slate-800/80 xl:block">
        <SideBar />
      </section>
      <section className="size-full ml-0 xl:ml-(--side-bar)">
        <DashboardLayout />
      </section>
    </main>
  );
}

export default App;
