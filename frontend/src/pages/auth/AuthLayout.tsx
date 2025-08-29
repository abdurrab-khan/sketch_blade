import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-blue-500">{children}</div>
  );
}

export default AuthLayout;
