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
import File from "./pages/file/File.tsx";
import NotFound from "./pages/NotFound.tsx";
import Sign_In from "@/pages/auth/Sign_In.tsx";
import Sign_Up from "@/pages/auth/Sign_Up.tsx";
import AuthProtection from "@/components/AuthProtection.tsx";
import { Files, Folder, FolderFiles, Shared, Favorite, Recent, Trash } from "@/pages/home";

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLIC_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        path="/"
        element={
          <AuthProtection>
            <App />
          </AuthProtection>
        }
      >
        <Route index element={<Files />} />
        <Route path="folders">
          <Route index element={<Folder />} />
          <Route path=":folderId" element={<FolderFiles />} />
        </Route>
        <Route path="shared-with-me" element={<Shared />} />
        <Route path="favorite" element={<Favorite />} />
        <Route path="recent" element={<Recent />} />
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
