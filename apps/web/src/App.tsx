import DashboardLayout from "@/pages/home/DashboardLayout";
import SideBar from "@/components/dashboard/sidebar/SideBar";

function App() {
  return (
    <main className={"flex flex-row overflow-x-hidden size-screen"}>
      {/* <Nav />
      <AppSection /> */}
      <section className="w-(--side-bar) bg-primary-bg-light/90 border-r px-8 py-6 backdrop-blur-2xl hidden drop-shadow-2xl drop-shadow-black/25 border-white/50 left-0 h-full top-0 fixed hover:drop-shadow-black/30 dark:bg-primary-bg-dark  dark:border-slate-800/80 xl:block">
        <SideBar />
      </section>
      <section className="bg-linear-to-tl z-50 from-blue-500/10 to-white flex-1 ml-(--side-bar) dark:bg-secondary-bg-dark">
        <DashboardLayout />
      </section>
    </main>
  );
}

export default App;
