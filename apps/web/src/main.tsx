import { StrictMode, useContext, type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store.ts";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { createBrowserRouter } from "react-router";
import { Toaster } from "@/components/ui/toaster.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoutesFromElements, Route, RouterProvider } from "react-router";

import "./index.css";
import App from "@/App.tsx";

import HomeLayout from "@/pages/home/HomeLayout";
import AuthProtection from "@/components/AuthProtection.tsx";
import DashboardLayout from "./pages/dashboard/layout";
import TableSkeleton from "./pages/dashboard/components/mainpanel/table/TableSkeleton";

import { ThemeContext, ThemeProvider } from "./context/ThemeProvider";

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLIC_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Home Layout */}
      <Route path="/" element={<HomeLayout />}>
        <Route
          index
          lazy={async () => {
            const module = await import("./pages/home/Home");
            return { Component: module.default };
          }}
        />

        <Route
          path="about"
          lazy={async () => {
            const module = await import("./pages/home/about-us");
            return { Component: module.default };
          }}
        />
      </Route>

      {/* Protected Routes */}
      <Route element={<AuthProtection />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route
            index
            lazy={async () => {
              const module = await import("./pages/dashboard/Files");
              return { Component: module.default };
            }}
            hydrateFallbackElement={<TableSkeleton />}
          />

          <Route path="folders">
            <Route
              index
              lazy={async () => {
                const module = await import("./pages/dashboard/Folders");
                return { Component: module.default };
              }}
              hydrateFallbackElement={<TableSkeleton />}
            />

            <Route
              path=":folderId"
              lazy={async () => {
                const module = await import("./pages/dashboard/folder/folder-files");
                return { Component: module.default };
              }}
              hydrateFallbackElement={<TableSkeleton />}
            />
          </Route>

          <Route
            path="shared-with-me"
            lazy={async () => {
              const module = await import("./pages/dashboard/Shared");
              return { Component: module.default };
            }}
            hydrateFallbackElement={<TableSkeleton />}
          />

          <Route
            path="favorite"
            lazy={async () => {
              const module = await import("./pages/dashboard/Favorite");
              return { Component: module.default };
            }}
            hydrateFallbackElement={<TableSkeleton />}
          />

          <Route
            path="trash"
            lazy={async () => {
              const module = await import("./pages/dashboard/Trash");
              return { Component: module.default };
            }}
            hydrateFallbackElement={<TableSkeleton />}
          />
        </Route>

        <Route
          path="file/:id"
          lazy={async () => {
            const module = await import("./pages/file/File");
            return { Component: module.default };
          }}
        />
      </Route>

      {/* Auth Pages */}
      <Route
        path="sign-in"
        lazy={async () => {
          const module = await import("./pages/auth/sign-in");
          return { Component: module.default };
        }}
        hydrateFallbackElement={<></>}
      />

      <Route
        path="sign-up"
        lazy={async () => {
          const module = await import("./pages/auth/sign-up");
          return { Component: module.default };
        }}
        hydrateFallbackElement={<></>}
      />

      {/* Not Found */}
      <Route
        path="*"
        lazy={async () => {
          const module = await import("./pages/NotFound");
          return { Component: module.default };
        }}
        hydrateFallbackElement={<></>}
      />
    </Route>,
  ),
);

function ThemedClerkProvider({ children }: { children: ReactNode }) {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ThemeContext is unavailable");
  }

  const isDarkMode = themeContext.mode === "dark";

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: isDarkMode ? dark : undefined,
      }}
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ThemedClerkProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster />
          </QueryClientProvider>
        </Provider>
      </ThemedClerkProvider>
    </ThemeProvider>
  </StrictMode>,
);
