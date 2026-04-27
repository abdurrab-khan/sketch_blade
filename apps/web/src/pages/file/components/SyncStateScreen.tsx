import { motion } from "motion/react";
import { AlertCircle, ArrowLeft, Loader2, RefreshCcw, Sparkles } from "lucide-react";

type SyncState = "loading" | "error";

interface ISyncStateScreenProps {
  fileName: string;
  isDarkMode: boolean;
  state: SyncState;
  onRetry?: () => void;
}

function SyncStateScreen({ fileName, isDarkMode, state, onRetry }: ISyncStateScreenProps) {
  const isError = state === "error";
  console.log("Window is: ", window);

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-(--primary-bg-light) text-(--primary-text-light) dark:bg-(--primary-bg-dark) dark:text-(--primary-text-dark)">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.05 }}
          className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.09),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.1),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.08),transparent_32%)]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
        <div className="flex w-full items-center justify-end">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04 }}
            className={
              "mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.22em] uppercase " +
              (isError
                ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                : "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300")
            }
          >
            {isError ? <AlertCircle size={13} /> : <Sparkles size={13} />}
            {isError ? "Sync interrupted" : "Opening canvas"}
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200"
            >
              {fileName}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="mt-6 text-4xl leading-tight font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white"
            >
              {isError ? "We could not sync this file." : "Preparing your collaborative canvas."}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300"
            >
              {isError
                ? "The live connection dropped before the board could finish syncing. Refreshing usually brings the file back online."
                : "Hang tight while we connect to the shared room, load the latest state, and get the editor ready."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-700 dark:text-cyan-300">
                {isError ? "Connection needs a refresh" : "Syncing live document"}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200/80 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                {isDarkMode
                  ? "Dark workspace styling is active."
                  : "Light workspace styling is active."}
              </span>
            </motion.div>

            {isError ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.34 }}
                className="mt-7 flex flex-col gap-3 sm:flex-row"
              >
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  <RefreshCcw size={16} />
                  Retry sync
                </button>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
                >
                  <ArrowLeft size={16} />
                  Go back
                </button>
              </motion.div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.38 }}
              className="mt-9 grid gap-3 text-sm text-slate-600 dark:text-slate-300"
            >
              <p className="inline-flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                Connecting to the shared room for real-time updates.
              </p>
              <p className="inline-flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                Syncing the newest board snapshot before editing starts.
              </p>
              <p className="inline-flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                Keeping your current workspace theme and editor preferences.
              </p>
            </motion.div>
          </div>

          <div className="relative flex shrink-0 items-center justify-center self-center lg:self-auto">
            <motion.div
              animate={isError ? { rotate: 0 } : { rotate: 360 }}
              transition={
                isError ? { duration: 0 } : { duration: 16, repeat: Infinity, ease: "linear" }
              }
              className={
                "absolute h-44 w-44 rounded-full border border-dashed opacity-55 blur-[0.2px] " +
                (isError ? "border-rose-400/45" : "border-blue-400/45")
              }
            />
            <motion.div
              animate={{ scale: isError ? [1, 1.04, 1] : [1, 1.06, 1] }}
              transition={{ duration: isError ? 2.8 : 2.2, repeat: Infinity, ease: "easeInOut" }}
              className={
                "relative z-10 flex h-32 w-32 items-center justify-center rounded-full border backdrop-blur-md " +
                (isError
                  ? "border-rose-500/18 bg-[radial-gradient(circle_at_30%_30%,rgba(251,113,133,0.16),rgba(136,19,55,0.12)_55%,rgba(15,23,42,0.16)_100%)] text-rose-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_40px_rgba(244,63,94,0.12)]"
                  : "border-blue-500/18 bg-[radial-gradient(circle_at_30%_30%,rgba(96,165,250,0.18),rgba(30,64,175,0.14)_55%,rgba(15,23,42,0.16)_100%)] text-blue-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_40px_rgba(59,130,246,0.12)]")
              }
            >
              {isError ? (
                <AlertCircle size={54} strokeWidth={1.9} />
              ) : (
                <Loader2
                  size={54}
                  className="animate-spin drop-shadow-[0_0_10px_rgba(96,165,250,0.18)]"
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>
    </section>
  );
}

export default SyncStateScreen;
