import Nav from "./components/Nav.tsx";
import AppSection from "./components/AppSection.tsx";

function App() {
  return (
    <div className={"size-screen flex flex-col items-center bg-primary text-quaternary"}>

      <div className="main-container group flex-center bg-secondary dark:bg-black h-20">
        <div data-current="yes" className="h-10 w-10 dark:lg:data-[current=yes]:hover:bg-orange-700 bg-yellow-500"></div>
      </div>

      <Nav />
      <AppSection />
    </div>
  );
}

export default App;
