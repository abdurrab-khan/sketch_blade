import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { ArrowLeft, Home, LayoutDashboard, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <main className="relative min-h-screen overflow-hidden bg-(--primary-bg-light) text-(--primary-text-light) dark:bg-(--primary-bg-dark) dark:text-(--primary-text-dark)">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -right-16 bottom-8 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.08),transparent_40%)]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center">
        <div className="flex w-full items-center justify-end">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mb-5 inline-flex cursor-default items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold tracking-widest text-blue-600 uppercase dark:text-blue-300"
          >
            <Sparkles size={14} />
            Lost Canvas
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.1 }}
          className="mb-5"
        >
          <h1 className="bg-linear-to-r from-blue-600 via-cyan-500 to-blue-400 bg-clip-text text-center text-7xl leading-none font-black tracking-tight text-transparent sm:text-8xl">
            404
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="text-2xl font-bold text-slate-800 dark:text-slate-100"
        >
          This page drifted out of the workspace.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300"
        >
          We could not find
          <span className="mx-1 rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-800">
            {location.pathname}
          </span>
          . The route might have been moved, renamed, or never existed.
        </motion.p>

        <motion.div className="mt-8 flex min-w-full flex-col justify-center gap-6 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--border-light) bg-white px-5 py-3 font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-700 dark:border-(--border-dark) dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
          >
            <Home size={18} />
            Return Home
          </button>

          <SignedIn>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-5 py-3 font-semibold text-cyan-700 transition-all hover:-translate-y-0.5 hover:bg-cyan-500/20 dark:text-cyan-300"
            >
              <LayoutDashboard size={18} />
              Open Dashboard
            </button>
          </SignedIn>

          <SignedOut>
            <button
              onClick={() => navigate("/sign-up")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-5 py-3 font-semibold text-cyan-700 transition-all hover:-translate-y-0.5 hover:bg-cyan-500/20 dark:text-cyan-300"
            >
              <Sparkles size={18} />
              Start Sketching
            </button>
          </SignedOut>
        </motion.div>
      </section>
    </main>
  );
};

export default NotFound;
