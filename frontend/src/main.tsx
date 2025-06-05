import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { createRoutesFromElements, Route, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router";
import Sign_In from "./pages/auth/Sign_In.tsx";
import Sign_Up from "./pages/auth/Sign_Up.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { All, CreatedByMe, Folder } from "./pages/home/index";
import File from "./pages/file/File.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProtection from "./components/AuthProtection.tsx";
import NotFound from "./pages/NotFound.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        path=""
        element={
          <AuthProtection>
            <App />
          </AuthProtection>
        }
      >
        <Route index element={<All />} />
        <Route path="folder" element={<Folder />} />
        <Route path="created-by-me" element={<CreatedByMe />} />
        <Route
          path="folder/:id"
          element={<div className={"main-container bg-blue-500"}></div>}
        />
      </Route>
      <Route
        path="file/:id"
        element={
          <AuthProtection>
            <File />
          </AuthProtection>
        }
      />
      <Route path="sign-in" element={<Sign_In />} />
      <Route path="sign-up" element={<Sign_Up />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/sign-in"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl={"/"}
      signUpForceRedirectUrl={"/"}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </Provider>
    </ClerkProvider>
  </StrictMode>,
);
