import DashboardLayout from "@/pages/home/DashboardLayout";
import SideBar from "@/components/dashboard/sidebar/SideBar";

function App() {
  return (
    <main className={"size-screen flex flex-row overflow-x-hidden"}>
      <section className="bg-primary-bg-light/90 dark:bg-primary-bg-dark fixed top-0 left-0 z-50 hidden h-full w-(--side-bar) border-r border-l border-slate-300/20 drop-shadow-2xl drop-shadow-black/25 backdrop-blur-2xl hover:drop-shadow-black/25 xl:block dark:border-slate-800/80">
          <SideBar />
      </section>
      <section className="ml-0 size-full xl:ml-(--side-bar)">
        <DashboardLayout />
      </section>
    </main>
  );
}

export default App;
