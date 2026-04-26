import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { useNavigate } from "react-router";
import { SignedIn } from "@clerk/clerk-react";
import { FaPencil, FaUsers, FaShare, FaLightbulb, FaShield } from "react-icons/fa6";
import {
  ArrowRight,
  Zap,
  Check,
  Sparkles,
  Paintbrush,
  Globe,
  MoveRight,
  Palette,
  Loader,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Intuitive Drawing Tools",
    description: "Professional-grade sketching tools with smooth strokes and precision control.",
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/20",
  },
  {
    icon: FaUsers,
    title: "Real-time Collaboration",
    description: "Work together seamlessly with instant canvas synchronization across users.",
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/20",
  },
  {
    icon: FaShare,
    title: "Easy Sharing",
    description: "Share your sketches and designs with customizable permission levels.",
    color: "from-emerald-400 to-teal-500",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: FaLightbulb,
    title: "Smart Organization",
    description: "Organize your work into folders and manage favorites for quick access.",
    color: "from-orange-400 to-red-500",
    shadow: "shadow-orange-500/20",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance for smooth, lag-free drawing experience.",
    color: "from-yellow-400 to-orange-500",
    shadow: "shadow-yellow-500/20",
  },
  {
    icon: FaShield,
    title: "Secure & Reliable",
    description: "Your sketches are securely stored with enterprise-grade encryption.",
    color: "from-indigo-400 to-blue-500",
    shadow: "shadow-indigo-500/20",
  },
];

const stats = [
  { label: "Active Users", value: "10K+" },
  { label: "Sketches Created", value: "100K+" },
  { label: "Collaborations", value: "50K+" },
  { label: "Uptime", value: "99.9%" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function Home() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Setup high DPI canvas
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#3b82f6"; // Tailwind blue-500
      }
    }
  }, []);

  const handleStartDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    setIsDrawing(true);
    handleDraw(e);
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.beginPath(); // Reset path to start a new line later
  };

  const handleDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      // Prevent scrolling while drawing on mobile
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    setIsSuccess(true);
    setFeedback("");
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 font-sans text-slate-50 selection:bg-blue-500/30">
      {/* Dynamic Background Effect */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.05,
            y: mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", bounce: 0, duration: 1 }}
          className="absolute top-1/4 -right-[10%] size-150 rounded-full bg-blue-600/10 blur-[120px]"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -0.05,
            y: mousePosition.y * -0.05,
          }}
          transition={{ type: "spring", bounce: 0, duration: 1 }}
          className="absolute bottom-1/4 -left-[10%] size-150 rounded-full bg-purple-600/10 blur-[120px]"
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20">
        <motion.div
          style={{ y, opacity }}
          className="relative z-10 mx-auto w-full max-w-5xl text-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.div
              variants={itemVariants}
              className="group mb-8 cursor-pointer rounded-full border border-slate-700/50 bg-slate-800/30 px-5 py-2 backdrop-blur-md transition-colors hover:border-slate-500 hover:bg-slate-800/80"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Sparkles size={16} className="text-blue-400 group-hover:animate-pulse" />
                V2.0 is now live — Discover what's new
                <ArrowRight
                  size={16}
                  className="ml-1 text-slate-500 transition-transform group-hover:translate-x-1"
                />
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-6 text-6xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl"
            >
              Imagine. Draw.
              <br />
              <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                Collaborate.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl"
            >
              Bring your ideas to life on an infinite canvas that connects you with your team
              instantly. The modern whiteboard designed for creative minds and remote teams.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center gap-4 sm:flex-row"
            >
              <SignedIn>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-slate-50 px-8 py-4 font-semibold text-slate-900 transition-all hover:scale-105 hover:bg-white hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] focus:outline-none sm:w-auto"
                >
                  Go to Dashboard
                  <MoveRight size={20} className="transition-transform group-hover:translate-x-1" />
                </button>
              </SignedIn>

              {!window.location.pathname.includes("dashboard") && (
                <button
                  onClick={() => navigate("/sign-up")}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-slate-50 px-8 py-4 font-semibold text-slate-900 transition-all hover:scale-105 hover:bg-white hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] focus:outline-none sm:w-auto"
                >
                  Start Sketching Free
                  <Paintbrush size={20} className="transition-transform group-hover:rotate-12" />
                </button>
              )}

              <button
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
                className="group flex w-full items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-800/30 px-8 py-4 font-semibold text-slate-300 backdrop-blur-sm transition-all hover:border-slate-500 hover:bg-slate-800 focus:outline-none sm:w-auto"
              >
                Explore Features
              </button>
            </motion.div>

            {/* Interface preview mock */}
            <motion.div
              variants={itemVariants}
              className="group perspective-1000 relative mt-20 w-full max-w-4xl"
            >
              <div className="pointer-events-none absolute inset-0 z-10 h-full bg-linear-to-t from-slate-950 via-transparent to-transparent" />
              <motion.div
                whileHover={{ rotateX: 2, rotateY: 2, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="w-full transform-gpu overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/80 p-2 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] backdrop-blur-xl"
              >
                <div className="flex h-10 items-center space-x-2 border-b border-slate-700/50 bg-slate-950/50 px-4">
                  <div className="flex w-full space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <div className="mx-auto h-5 w-1/3 rounded bg-slate-800/80"></div>
                  <div className="flex w-full justify-end">
                    <div className="h-5 w-16 rounded bg-slate-800/80"></div>
                  </div>
                </div>
                <div className="relative flex aspect-video w-full cursor-crosshair flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-800 to-slate-950 opacity-90">
                  <div className="pointer-events-none absolute inset-0 flex -rotate-12 items-center justify-center font-mono text-[20rem] leading-none font-bold text-blue-500/10 blur-sm select-none">
                    UI
                  </div>
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-20 h-full w-full touch-none"
                    onMouseDown={handleStartDrawing}
                    onMouseUp={handleStopDrawing}
                    onMouseOut={handleStopDrawing}
                    onMouseMove={handleDraw}
                    onTouchStart={handleStartDrawing}
                    onTouchEnd={handleStopDrawing}
                    onTouchCancel={handleStopDrawing}
                    onTouchMove={handleDraw}
                  />
                  <div className="pointer-events-none absolute z-10 flex flex-col items-center justify-center">
                    <Palette size={80} className="mb-4 text-slate-600/50 drop-shadow-2xl" />
                    <p className="rounded-full border border-slate-700/50 bg-slate-900/50 px-4 py-2 text-sm font-medium tracking-widest text-slate-400 uppercase shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                      Try Drawing Here
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 border-y border-slate-800/60 bg-slate-900/30 py-16 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center justify-center p-4 text-center"
              >
                <span className="mb-2 font-mono text-4xl font-black tracking-tight text-white md:text-5xl">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold tracking-widest text-slate-400 uppercase">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20 flex flex-col items-center text-center"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 uppercase">
            <Zap size={14} className="text-blue-400" />
            Powerful Features
          </span>
          <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Everything you need for perfect designs & remote work.
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-4xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-xl transition-all duration-300 hover:bg-slate-800/60 hover:shadow-2xl"
              >
                <div
                  className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-linear-to-br opacity-20 blur-3xl transition-all duration-500 group-hover:opacity-60 ${feature.color}`}
                />
                <div className="relative z-10">
                  <div
                    className={`mb-6 inline-flex rounded-2xl bg-linear-to-br p-4 ${feature.shadow} shadow-lg ${feature.color} text-white transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={28} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-slate-100">{feature.title}</h3>
                  <p className="leading-relaxed font-medium text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Feedback Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-700/50 bg-linear-to-br from-slate-800/50 to-slate-900/50 p-8 shadow-xl backdrop-blur-lg md:p-12"
          >
            <h2 className="mb-2 text-center text-3xl font-bold text-white md:text-4xl">
              We'd Love Your Feedback
            </h2>
            <p className="mb-8 text-center text-slate-400">
              Help us improve SketchBlade by sharing your thoughts and suggestions.
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think..."
                disabled={isLoading || isSuccess}
                className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-white transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                rows={4}
              />

              <motion.button
                whileHover={{ scale: isLoading || isSuccess ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || isSuccess || !feedback.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/40 transition-all hover:shadow-blue-500/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Loader size={20} className="text-white" />
                  </motion.span>
                ) : isSuccess ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={20} />
                    Thank you for your feedback!
                  </span>
                ) : (
                  "Send Feedback"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 mb-10 px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="group relative overflow-hidden rounded-[3rem] border border-blue-500/20 bg-linear-to-b from-blue-900/40 to-indigo-900/10 px-6 py-20 text-center shadow-2xl backdrop-blur-2xl md:px-12"
          >
            <div className="absolute inset-x-0 top-0 h-px w-full bg-linear-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
            <div className="absolute inset-x-0 bottom-0 h-px w-full bg-linear-to-r from-transparent via-purple-400 to-transparent opacity-30"></div>

            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[50%] -left-[10%] size-75 rounded-full bg-blue-500/20 blur-[100px]"
            />

            <div className="relative z-10">
              <h2 className="mx-auto mb-6 max-w-2xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                Ready to Start Sketching?
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-lg font-medium text-blue-100/70">
                Join thousands of creative professionals using SketchBlade to bring their ideas to
                life.
              </p>

              <button
                onClick={() => navigate("/sign-up")}
                className="group relative inline-flex items-center gap-2 rounded-full bg-blue-600 px-10 py-5 font-bold text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.8)] focus:outline-none"
              >
                Get Started Now
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-slate-800/60 pb-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-linear-to-br from-blue-500 to-purple-600 p-2 text-white shadow-lg shadow-blue-500/20">
                  <FaPencil size={24} />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">SketchBlade</span>
              </div>
              <p className="mb-6 max-w-sm leading-relaxed text-slate-400">
                The future of collaborative sketching. Built to scale your imagination.
              </p>
              <div className="flex gap-4 text-slate-500">
                <a
                  href="#"
                  className="rounded-full bg-slate-900 p-2 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <Globe size={18} />
                </a>
                <a
                  href="#"
                  className="rounded-full bg-slate-900 p-2 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <FaShare size={18} />
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-semibold tracking-wide text-white">Product</h4>
              <a
                href="#"
                className="text-sm font-medium text-slate-400 transition-colors hover:text-blue-400"
              >
                Features
              </a>
              <a
                href="#"
                className="text-sm font-medium text-slate-400 transition-colors hover:text-blue-400"
              >
                Pricing
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-semibold tracking-wide text-white">Company</h4>
              <a
                href="#"
                className="text-sm font-medium text-slate-400 transition-colors hover:text-blue-400"
              >
                About
              </a>
              <a
                href="#"
                className="text-sm font-medium text-slate-400 transition-colors hover:text-blue-400"
              >
                Blog
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-semibold tracking-wide text-white">Legal</h4>
              <a
                href="#"
                className="text-sm font-medium text-slate-400 transition-colors hover:text-blue-400"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm font-medium text-slate-400 transition-colors hover:text-blue-400"
              >
                Terms
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between text-sm font-medium text-slate-500 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} SketchBlade. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
