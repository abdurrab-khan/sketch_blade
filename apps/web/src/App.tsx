import { Outlet } from "react-router";

import AppErrorBoundary from "@/components/AppErrorBoundary";

function App() {
  return (
    <main className="relative">
      <AppErrorBoundary>
        <Outlet />
      </AppErrorBoundary>
    </main>
  );
}

export default App;
