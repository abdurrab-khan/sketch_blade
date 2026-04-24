import { StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store.ts";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { createBrowserRouter } from "react-router";
import { Toaster } from "@/components/ui/toaster.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoutesFromElements, Route, RouterProvider } from "react-router";

import "./index.css";
import App from "@/App.tsx";

import HomeLayout from "@/pages/home/HomeLayout";
import { Files, Folders, Shared, Trash, Favorite, FolderFiles } from "@/pages/dashboard";
import AuthProtection from "@/components/AuthProtection.tsx";
import Home from "./pages/home/Home";
import AboutUs from "./pages/home/AboutUs";
import File from "./pages/file/File";
import SignInPage from "./pages/auth/SignIn";
import NotFound from "./pages/NotFound";
import SignUpPage from "./pages/auth/SignUp";
import { ThemeProvider } from "./context/ThemeProvider";

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLIC_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <AuthProtection>
            <App />
          </AuthProtection>
        }
      >
        <Route index element={<Files />} />
        <Route path="folders">
          <Route index element={<Folders />} />
          <Route path=":folderId" element={<FolderFiles />} />
        </Route>
        <Route path="shared-with-me" element={<Shared />} />
        <Route path="favorite" element={<Favorite />} />
        <Route path="trash" element={<Trash />} />
      </Route>

      <Route
        path="file/:id"
        element={
          <AuthProtection>
            <File />
          </AuthProtection>
        }
      />

      <Route path="sign-in" element={<SignInPage />} />
      <Route path="sign-up" element={<SignUpPage />} />

      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl={"/dashboard"}
      signUpForceRedirectUrl={"/dashboard"}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RouterProvider router={router} />
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ClerkProvider>
  </StrictMode>,
);
