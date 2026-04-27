import { type ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router";
import { AlertTriangle, ArrowLeft, Home, RotateCcw, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDevelopment = import.meta.env.DEV;

  const err = error instanceof Error ? error : new Error(String(error));

  return (
    <main className="relative min-h-screen overflow-hidden bg-(--primary-bg-light) text-(--primary-text-light) dark:bg-(--primary-bg-dark) dark:text-(--primary-text-dark)">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: "easeOut" }}
          className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-400/12 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.08),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(148,163,184,0.05)_50%,transparent_100%)] bg-size-[28px_28px] opacity-40" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 18 }}
          className="relative w-full overflow-hidden rounded-4xl border border-(--border-light) bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8 lg:p-10 dark:border-(--border-dark-subtle) dark:bg-(--secondary-bg-dark)/85 dark:shadow-[0_24px_80px_rgba(15,23,42,0.45)]"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/60 to-transparent" />

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-6">
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-semibold tracking-[0.26em] text-blue-700 uppercase dark:text-blue-300"
              >
                <Sparkles size={13} />
                Boundary triggered
              </motion.span>

              <div className="space-y-3">
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="max-w-2xl text-4xl leading-tight font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white"
                >
                  The canvas cracked while rendering this route.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                  className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300"
                >
                  Something in the current route failed while loading or rendering. You can retry,
                  step back to the previous screen, or jump home to recover.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.24 }}
                className="flex flex-col flex-wrap gap-3 sm:flex-row"
              >
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={resetErrorBoundary}
                  className="rounded-full px-6"
                >
                  <RotateCcw size={18} />
                  Try again
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(-1)}
                  className="rounded-full px-6"
                >
                  <ArrowLeft size={18} />
                  Go back
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/")}
                  className="rounded-full px-6"
                >
                  <Home size={18} />
                  Home
                </Button>
              </motion.div>
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 px-5 py-5 text-slate-100 shadow-2xl shadow-slate-950/25 sm:px-6 sm:py-6 dark:border-blue-500/20 dark:bg-slate-950/95"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_48%)]" />
              <div className="relative space-y-5">
                <div className="flex items-center gap-3 text-blue-200">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.28em] text-blue-200/75 uppercase">
                      Error snapshot
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{location.pathname}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold tracking-[0.24em] text-slate-400 uppercase">
                    Message
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-100/90">
                    {err?.message || "An unexpected error interrupted the workspace."}
                  </p>
                </div>

                {isDevelopment ? (
                  <details className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                    <summary className="cursor-pointer list-none font-semibold text-blue-200">
                      Technical details
                    </summary>
                    <pre className="mt-4 max-h-64 overflow-auto text-xs leading-6 wrap-break-word whitespace-pre-wrap text-slate-300">
                      {err?.stack || err?.name}
                    </pre>
                  </details>
                ) : null}
              </div>
            </motion.aside>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

type AppErrorBoundaryProps = {
  children: ReactNode;
};

function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  const location = useLocation();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      resetKeys={[location.pathname]}
      onReset={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export default AppErrorBoundary;
