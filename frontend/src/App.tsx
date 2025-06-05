import Nav from "./components/Nav.tsx";
import AppSection from "./components/AppSection.tsx";

function App() {
  return (
    <div
      className={
        "size-screen flex flex-col items-center bg-primary text-quaternary"
      }
    >
      <Nav />
      <AppSection />
    </div>
  );
}

export default App;
