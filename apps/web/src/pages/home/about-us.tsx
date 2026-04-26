import { useState, useEffect } from "react";
import { motion, type Variants } from "motion/react";
import { useNavigate } from "react-router";
import { FaPencil, FaUsers, FaLightbulb, FaShield, FaRocket, FaHeart } from "react-icons/fa6";
import { ArrowRight, Sparkles, Globe, Briefcase } from "lucide-react";

const values = [
  {
    icon: FaLightbulb,
    title: "Innovation First",
    description: "We constantly push the boundaries of what's possible on the web canvas.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: FaUsers,
    title: "Community Driven",
    description: "Built for creatives, by creatives. Our community guides our roadmap.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: FaShield,
    title: "Trust & Security",
    description:
      "Your intellectual property is sacred. We protect it with enterprise-grade security.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: FaRocket,
    title: "High Performance",
    description: "Speed is a feature. We deliver lag-free experiences no matter your team size.",
    color: "from-orange-400 to-red-500",
  },
];

const containerVariants = {
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

export default function AboutUs() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
      <section className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-4 pt-32 pb-20">
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 uppercase"
            >
              <Globe size={14} className="text-blue-400" />
              Our Mission
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
            >
              Redefining the way <br />
              <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                creatives collaborate.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl"
            >
              SketchBlade was born from a simple idea: that distance shouldn't dictate creativity.
              We built this platform so teams around the world can sketch, ideate, and build the
              future together, on a single infinite canvas.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="relative z-10 border-y border-slate-800/60 bg-slate-900/30 py-24 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid items-center gap-12 md:grid-cols-2"
          >
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                The Story Behind SketchBlade
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-slate-400">
                <p>
                  It all started in 2023 when a group of designers and developers realized how
                  frustrating remote brainstorming had become. Existing whiteboard tools were either
                  too clunky or too complex.
                </p>
                <p>
                  We wanted a tool that feels as natural as putting a marker to a whiteboard, but
                  supercharged with the power of modern web technologies. Something that instantly
                  syncs, securely stores, and visually inspires.
                </p>
                <p>
                  Today, SketchBlade empowers thousands of users globally. Our journey is just
                  beginning, and we are obsessively focused on building the ultimate workspace for
                  visual thinkers.
                </p>
              </div>
            </div>

            {/* Story Visual Mock */}
            <div className="group perspective-1000 relative">
              <motion.div
                whileHover={{ rotateX: 2, rotateY: -2, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="transform-gpu rounded-2xl border border-slate-700/50 bg-slate-800/80 p-6 shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] backdrop-blur-xl"
              >
                <div className="relative flex aspect-4/3 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-700/50 bg-linear-to-br from-slate-900 to-slate-950">
                  <FaHeart className="absolute text-9xl text-purple-500/20" />
                  <Sparkles className="z-10 mb-4 text-purple-400" size={40} />
                  <span className="z-10 text-lg font-medium text-slate-300">
                    Built with Passion
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20 flex flex-col items-center text-center"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-purple-400 uppercase">
            <FaHeart size={14} />
            Our Values
          </span>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            What drives us forward.
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group flex flex-col items-start gap-6 rounded-4xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-xl transition-all duration-300 hover:bg-slate-800/60 hover:shadow-2xl sm:flex-row"
              >
                <div
                  className={`shrink-0 rounded-2xl bg-linear-to-br p-4 shadow-lg ${item.color} text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-bold text-slate-100">{item.title}</h3>
                  <p className="leading-relaxed font-medium text-slate-400">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
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

            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[50%] -left-[10%] size-75 rounded-full bg-blue-500/20 blur-[100px]"
            />

            <div className="relative z-10">
              <h2 className="mx-auto mb-6 max-w-2xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                Join our journey.
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-lg font-medium text-blue-100/70">
                We're always looking for brilliant minds to help us build the next generation of
                creative tools.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => navigate("/sign-up")}
                  className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.8)] focus:outline-none"
                >
                  Try SketchBlade
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
                <button className="group relative inline-flex items-center justify-center gap-2 rounded-full border border-slate-600 bg-slate-800/50 px-8 py-4 font-bold text-slate-300 transition-all hover:scale-105 hover:bg-slate-700 focus:outline-none">
                  <Briefcase
                    size={20}
                    className="text-slate-400 transition-colors group-hover:text-white"
                  />
                  View Open Roles
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer remains consistent */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-slate-800/60 pb-12 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-linear-to-br from-blue-500 to-purple-600 p-2 text-white shadow-lg shadow-blue-500/20">
                  <FaPencil size={24} />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">SketchBlade</span>
              </div>
              <p className="max-w-sm leading-relaxed text-slate-400">
                The ultimate collaborative whiteboard platform designed for creatives, educators,
                and visionaries alike.
              </p>
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
