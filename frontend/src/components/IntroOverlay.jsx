import { useEffect } from "react";
import { motion } from "framer-motion";

const LETTERS = ["K", "N", "D", "P"];
const BASE = 0.16; // first letter delay
const STEP = 0.15; // gap between letters (fast)
const SNAP = [0.16, 1, 0.3, 1]; // sharp ease-out overshoot

/**
 * Bold, high-energy glitch intro. Each letter snaps in with an RGB-split
 * shatter, punctuated by light flashes and glitch bars, peaks with a whole
 * word shudder, then a white flash transitions into the site.
 */
function GlitchLetter({ char, i }) {
  const delay = BASE + i * STEP;
  return (
    <span className="relative inline-block">
      {/* cyan ghost slice */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 text-baby mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.95, 0.4, 0.7, 0],
          x: [10, 12, -8, 4, 0],
          clipPath: [
            "inset(30% 0 30% 0)",
            "inset(8% 0 62% 0)",
            "inset(55% 0 8% 0)",
            "inset(0% 0 0% 0)",
            "inset(0% 0 0% 0)",
          ],
        }}
        transition={{ delay, duration: 0.5, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear" }}
      >
        {char}
      </motion.span>

      {/* red ghost slice */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 text-[#ff3b4e] mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.95, 0.5, 0.6, 0],
          x: [-10, -12, 8, -4, 0],
          clipPath: [
            "inset(20% 0 50% 0)",
            "inset(62% 0 8% 0)",
            "inset(0% 0 45% 0)",
            "inset(0% 0 0% 0)",
            "inset(0% 0 0% 0)",
          ],
        }}
        transition={{ delay, duration: 0.5, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear" }}
      >
        {char}
      </motion.span>

      {/* solid letter snapping into place */}
      <motion.span
        className="relative inline-block"
        initial={{ opacity: 0, scale: 2.2, filter: "blur(12px)" }}
        animate={{
          opacity: [0, 1, 1, 1],
          scale: [2.2, 0.84, 1.09, 1],
          filter: ["blur(12px)", "blur(0px)", "blur(0px)", "blur(0px)"],
          x: [0, -7, 5, 0],
          skewX: [16, -9, 3, 0],
        }}
        transition={{ delay, duration: 0.32, times: [0, 0.55, 0.8, 1], ease: SNAP }}
      >
        {char}
      </motion.span>
    </span>
  );
}

export default function IntroOverlay({ onComplete, duration = 1950 }) {
  useEffect(() => {
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

  const impactDelays = LETTERS.map((_, i) => BASE + i * STEP + 0.12);

  return (
    <motion.div
      data-testid="intro-overlay"
      role="presentation"
      className="fixed inset-0 z-[120] overflow-hidden bg-ink text-white flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.3, ease: "easeIn" } }}
    >
      {/* scanline texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* moving glitch bars */}
      <motion.div
        className="pointer-events-none absolute left-0 right-0 h-[3px] bg-baby/70"
        style={{ top: "37%" }}
        initial={{ opacity: 0, x: "-100%" }}
        animate={{ opacity: [0, 1, 0, 1, 0], x: ["-100%", "-30%", "10%", "-10%", "100%"] }}
        transition={{ delay: 0.85, duration: 0.55, times: [0, 0.2, 0.45, 0.7, 1], ease: "linear" }}
      />
      <motion.div
        className="pointer-events-none absolute left-0 right-0 h-[2px] bg-[#ff3b4e]/70"
        style={{ top: "61%" }}
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: [0, 1, 0, 1, 0], x: ["100%", "30%", "-15%", "12%", "-100%"] }}
        transition={{ delay: 1.0, duration: 0.55, times: [0, 0.2, 0.45, 0.7, 1], ease: "linear" }}
      />

      {/* per-letter impact flashes */}
      {impactDelays.map((d, i) => (
        <motion.div
          key={`flash-${i}`}
          className="pointer-events-none absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.32, 0] }}
          transition={{ delay: d, duration: 0.12, times: [0, 0.35, 1], ease: "linear" }}
        />
      ))}

      {/* peak colour + white flashes */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-baby"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ delay: 1.0, duration: 0.2, times: [0, 0.4, 1], ease: "linear" }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ delay: 1.32, duration: 0.22, times: [0, 0.4, 1], ease: "linear" }}
      />
      {/* final flash that carries into the site reveal */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ delay: 1.55, duration: 0.4, times: [0, 0.35, 1], ease: "easeIn" }}
      />

      {/* wordmark — stays still, then shudders at the peak */}
      <motion.div
        className="relative z-10 flex items-end"
        animate={{ x: [0, 0, -9, 8, -4, 0], skewX: [0, 0, -6, 5, -2, 0] }}
        transition={{ duration: 1.45, times: [0, 0.62, 0.68, 0.74, 0.82, 0.92], ease: "linear" }}
      >
        <span
          aria-label="KNDP"
          className="flex items-end font-display font-extrabold tracking-tighter leading-none text-7xl sm:text-8xl md:text-9xl"
        >
          {LETTERS.map((c, i) => (
            <GlitchLetter key={c} char={c} i={i} />
          ))}
        </span>
        {/* brand dot punch-in */}
        <motion.span
          className="mb-2 ml-2 md:mb-3 md:ml-3 inline-block h-3 w-3 md:h-5 md:w-5 rounded-full bg-baby"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.7, 1], opacity: [0, 1, 1] }}
          transition={{ delay: BASE + LETTERS.length * STEP, duration: 0.3, times: [0, 0.6, 1], ease: SNAP }}
        />
      </motion.div>
    </motion.div>
  );
}
