import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import SideBar from "@/pages/dashboard/components/sidebar/SideBar";

function App() {
  return (
    <main className={"size-screen flex flex-row overflow-x-hidden"}>
      <section className="bg-primary-bg-light/90 dark:bg-primary-bg-dark/95 fixed top-0 left-0 z-50 hidden h-full w-(--side-bar) border-r border-l border-slate-300/20 drop-shadow-2xl drop-shadow-black/25 backdrop-blur-2xl hover:drop-shadow-black/25 xl:block dark:border-blue-500/10">
        <SideBar />
      </section>
      <section className="ml-0 size-full xl:ml-(--side-bar)">
        <DashboardLayout />
      </section>
    </main>
  );
}

export default App;
