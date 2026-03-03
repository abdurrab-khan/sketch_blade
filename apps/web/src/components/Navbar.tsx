import { Link, useNavigate } from "react-router";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { FaPencil } from "react-icons/fa6";

function Navbar() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  const rawBorderRadius = useTransform(scrollY, [0, 80], [0, 100]); // Max rounded when scrolled
  const rawMarginTop = useTransform(scrollY, [0, 80], [0, 24]); // Add margin when scrolled
  const rawWidth = useTransform(scrollY, [0, 80], [100, 85]);

  const borderRadius = useSpring(rawBorderRadius, { stiffness: 120, damping: 20 });
  const marginTop = useSpring(rawMarginTop, { stiffness: 120, damping: 20 });
  const widthPercent = useSpring(rawWidth, { stiffness: 120, damping: 20 });
  const width = useTransform(widthPercent, (v) => `${v}%`);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ borderRadius, marginTop, width }}
      className="fixed top-0 left-1/2 z-50 -translate-x-1/2 overflow-hidden border-b border-slate-800/80 bg-slate-950/70 shadow-lg shadow-black/20 backdrop-blur-xl"
    >
      {/* Top highlight gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2 text-white shadow-lg shadow-blue-500/30 transition-all group-hover:shadow-blue-500/50"
            >
              <FaPencil size={20} className="text-white" />
            </motion.div>
            <span className="hidden bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-sm sm:block">
              SketchBlade
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              to="/"
              className="text-sm font-semibold text-slate-300 transition-colors hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-semibold text-slate-300 transition-colors hover:text-white"
            >
              About Us
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <SignInButton>
                  <button className="hidden rounded-full border border-slate-700 bg-slate-800/40 px-6 py-2.5 text-sm font-semibold text-slate-300 backdrop-blur-md transition-all hover:border-slate-500 hover:bg-slate-800 hover:text-white focus:ring-2 focus:ring-slate-700 focus:outline-none sm:block">
                    Sign In
                  </button>
                </SignInButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.6)] transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.8)] focus:outline-none"
                >
                  Start for Free
                </button>
              </motion.div>
            </SignedOut>
            <SignedIn>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard")}
                className="mr-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.6)] transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.8)] focus:outline-none"
              >
                Dashboard
              </motion.button>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-10 h-10 border-2 border-slate-700/60 rounded-full transition-colors hover:border-blue-500/50",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
