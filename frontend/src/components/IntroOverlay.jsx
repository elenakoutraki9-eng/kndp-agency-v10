import { useEffect } from "react";
import { motion } from "framer-motion";

const LETTERS = ["K", "N", "D", "P"];

const EASE = [0.22, 1, 0.36, 1];

/**
 * Fullscreen premium intro animation shown on first landing.
 * Dark backdrop with flowing baby-blue blobs, an animated grid, drifting
 * geometric shapes and a clip-reveal KNDP wordmark. Calls onComplete after
 * the sequence; the curtain-up exit is handled by the `exit` variant via the
 * parent's <AnimatePresence>.
 */
export default function IntroOverlay({ onComplete, duration = 2600 }) {
  useEffect(() => {
    // Lock scroll while the intro plays.
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const id = setTimeout(() => onComplete?.(), duration);
    return () => {
      clearTimeout(id);
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [onComplete, duration]);

  return (
    <motion.div
      data-testid="intro-overlay"
      role="presentation"
      className="fixed inset-0 z-[120] overflow-hidden bg-ink text-white flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* animated grid texture */}
      <motion.div
        className="bg-grid absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* flowing colour blobs */}
      <motion.div
        className="absolute -top-48 -left-40 h-[38rem] w-[38rem] rounded-full bg-baby/25 blur-3xl"
        animate={{ x: [0, 70, 10, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-48 -right-40 h-[42rem] w-[42rem] rounded-full bg-baby-dark/25 blur-3xl"
        animate={{ x: [0, -60, -10, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-baby/10 blur-3xl"
        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* drifting geometric shapes */}
      <motion.div
        className="absolute top-[18%] left-[16%] h-20 w-20 rounded-full border-2 border-baby/40"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1, y: [0, -16, 0] }}
        transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[18%] h-10 w-10 rounded-md bg-baby/50"
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: 1, rotate: [0, 90, 0] }}
        transition={{ opacity: { duration: 0.8, delay: 0.3 }, rotate: { duration: 9, repeat: Infinity, ease: "easeInOut" } }}
      />
      <motion.div
        className="absolute top-[26%] right-[24%] h-3 w-3 rounded-full bg-baby-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 1], y: [0, 18, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* centre wordmark */}
      <div className="relative z-10 flex flex-col items-center">
        {/* rotating dashed ring behind the logo */}
        <motion.svg
          className="absolute -z-10 h-[16rem] w-[16rem] md:h-[22rem] md:w-[22rem] text-baby/30"
          viewBox="0 0 100 100"
          fill="none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 1 },
            scale: { duration: 1, ease: EASE },
            rotate: { duration: 22, repeat: Infinity, ease: "linear" },
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="4 6"
          />
        </motion.svg>

        <div className="flex items-end overflow-hidden py-2" aria-label="KNDP">
          {LETTERS.map((c, i) => (
            <span key={c} className="overflow-hidden inline-block">
              <motion.span
                className="inline-block font-display text-6xl sm:text-7xl md:text-9xl font-bold tracking-tighter leading-none"
                initial={{ y: "115%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.75, ease: EASE }}
              >
                {c}
              </motion.span>
            </span>
          ))}
          {/* brand dot */}
          <motion.span
            className="mb-3 ml-2 md:ml-3 inline-block h-3 w-3 md:h-4 md:w-4 rounded-full bg-baby"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + LETTERS.length * 0.12, duration: 0.5, ease: EASE }}
          />
        </div>

        {/* accent underline */}
        <motion.div
          className="mt-4 h-[3px] w-44 origin-left rounded-full bg-gradient-to-r from-baby via-baby-dark to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.05, duration: 0.7, ease: EASE }}
        />

        <motion.p
          className="mt-5 text-[0.7rem] md:text-xs uppercase tracking-[0.45em] text-white/55"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.6, ease: EASE }}
        >
          Digital Studio
        </motion.p>
      </div>
    </motion.div>
  );
}
