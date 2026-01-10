import React from "react";
import { Link } from "react-router";
import { FaPencilRuler } from "react-icons/fa";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Auth Form */}
      <div className="dark:bg-primary-bg-dark relative flex w-full flex-col items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">
        {/* Mobile Logo */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="flex items-center gap-x-2 outline-none">
            <span className="rounded-lg bg-blue-500 p-2">
              <FaPencilRuler size={18} className="text-white" />
            </span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">SketchBlade</span>
          </Link>
        </div>

        {/* Subtle Background Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl dark:bg-indigo-500/10" />
        </div>

        {/* Auth Content */}
        <div className="relative z-10 w-full max-w-md">{children}</div>

        {/* Footer */}
        <div className="absolute bottom-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} SketchBlade. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Branding & Decorative */}
      <div className="relative hidden w-1/2 overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 lg:flex lg:flex-col lg:justify-between">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/20 blur-2xl" />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col p-10">
          <Link to="/" className="flex items-center gap-x-3 outline-none">
            <span className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
              <FaPencilRuler size={24} className="text-white" />
            </span>
            <span className="text-2xl font-bold text-white">SketchBlade</span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-10">
          {/* Floating Cards Illustration */}
          <div className="relative h-80 w-full max-w-md">
            {/* Main Card */}
            <div className="absolute top-1/2 left-1/2 h-48 w-64 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
              <div className="mb-3 h-3 w-20 rounded-full bg-white/30" />
              <div className="mb-2 h-2 w-full rounded-full bg-white/20" />
              <div className="mb-2 h-2 w-3/4 rounded-full bg-white/20" />
              <div className="h-2 w-1/2 rounded-full bg-white/20" />
              <div className="mt-6 flex gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-400/40" />
                <div className="h-8 w-8 rounded-lg bg-indigo-400/40" />
                <div className="h-8 w-8 rounded-lg bg-purple-400/40" />
              </div>
            </div>
            {/* Floating Card 1 */}
            <div className="absolute top-4 right-8 h-24 w-32 rotate-12 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <div className="mb-2 h-2 w-12 rounded-full bg-white/20" />
              <div className="h-2 w-full rounded-full bg-white/10" />
            </div>
            {/* Floating Card 2 */}
            <div className="absolute bottom-8 left-4 h-20 w-28 -rotate-12 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <div className="mb-2 h-2 w-10 rounded-full bg-white/20" />
              <div className="h-2 w-full rounded-full bg-white/10" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-3xl font-bold text-white">{title || "Create & Collaborate"}</h2>
            <p className="mt-3 max-w-sm text-base text-blue-100/80">
              {subtitle ||
                "Design stunning diagrams and collaborate with your team in real-time. Your creative workspace awaits."}
            </p>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 flex justify-center gap-12 border-t border-white/10 p-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">10K+</p>
            <p className="text-sm text-blue-200/70">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">50K+</p>
            <p className="text-sm text-blue-200/70">Diagrams Created</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">99%</p>
            <p className="text-sm text-blue-200/70">Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
