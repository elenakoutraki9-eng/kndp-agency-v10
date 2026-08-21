import { useEffect } from "react";
import { motion } from "framer-motion";
import useIsMobile from "@/hooks/useIsMobile";

const LETTERS = ["K", "N", "D", "P"];
const SNAP = [0.16, 1, 0.3, 1]; // sharp ease-out overshoot

/**
 * Bold glitch intro on desktop; a lightweight snap-in variant on mobile
 * (no mix-blend RGB ghosts, blur filters or scanlines — just fast, smooth
 * transforms + opacity flashes) so it stays fluid on phones.
 */
function GlitchLetter({ char, i, base, step, isMobile }) {
  const delay = base + i * step;

  if (isMobile) {
    // Cheap: transform + opacity only.
    return (
      <motion.span
        className="relative inline-block"
        initial={{ opacity: 0, scale: 1.6 }}
        animate={{ opacity: [0, 1, 1], scale: [1.6, 0.92, 1], skewX: [8, -3, 0] }}
        transition={{ delay, duration: 0.26, times: [0, 0.6, 1], ease: SNAP }}
      >
        {char}
      </motion.span>
    );
  }

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

export default function IntroOverlay({ onComplete, duration }) {
  const isMobile = useIsMobile();
  const base = isMobile ? 0.1 : 0.16;
  const step = isMobile ? 0.1 : 0.15;
  const totalMs = duration ?? (isMobile ? 1250 : 1950);

  useEffect(() => {
    // On mobile, skip the document-level scroll lock entirely — the overlay
    // is a fixed, fully opaque full-screen layer already, so nothing behind
    // it is visible. Locking html/body overflow here risks getting stuck if
    // the main thread is busy (slow first load), so we never touch it there.
    if (isMobile) {
      const id = setTimeout(() => onComplete?.(), totalMs);
      return () => clearTimeout(id);
    }

    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const id = setTimeout(() => onComplete?.(), totalMs);
    return () => {
      clearTimeout(id);
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [onComplete, totalMs, isMobile]);

  const impactDelays = LETTERS.map((_, i) => base + i * step + (isMobile ? 0.08 : 0.12));
  const finalFlashDelay = base + LETTERS.length * step + (isMobile ? 0.25 : 0.55);

  return (
    <motion.div
      data-testid="intro-overlay"
      role="presentation"
      className="fixed inset-0 z-[120] overflow-hidden bg-ink text-white flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={
        isMobile
          ? { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } }
          : { opacity: 0, filter: "blur(6px)", transition: { duration: 0.3, ease: "easeIn" } }
      }
    >
      {/* Desktop-only heavy decoration */}
      {!isMobile && (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 3px)",
            }}
          />
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
        </>
      )}

      {/* per-letter impact flashes (cheap: opacity only) */}
      {impactDelays.map((d, i) => (
        <motion.div
          key={`flash-${i}`}
          className="pointer-events-none absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, isMobile ? 0.22 : 0.32, 0] }}
          transition={{ delay: d, duration: 0.12, times: [0, 0.35, 1], ease: "linear" }}
        />
      ))}

      {/* peak / final flashes that carry into the site reveal */}
      {!isMobile && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-baby"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ delay: 1.0, duration: 0.2, times: [0, 0.4, 1], ease: "linear" }}
        />
      )}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ delay: finalFlashDelay, duration: isMobile ? 0.3 : 0.4, times: [0, 0.35, 1], ease: "easeIn" }}
      />

      {/* wordmark */}
      <motion.div
        className="relative z-10 flex items-end"
        animate={isMobile ? undefined : { x: [0, 0, -9, 8, -4, 0], skewX: [0, 0, -6, 5, -2, 0] }}
        transition={isMobile ? undefined : { duration: 1.45, times: [0, 0.62, 0.68, 0.74, 0.82, 0.92], ease: "linear" }}
      >
        <span
          aria-label="KNDP"
          className="flex items-end font-display font-extrabold tracking-tighter leading-none text-7xl sm:text-8xl md:text-9xl"
        >
          {LETTERS.map((c, i) => (
            <GlitchLetter key={c} char={c} i={i} base={base} step={step} isMobile={isMobile} />
          ))}
        </span>
        <motion.span
          className="mb-2 ml-2 md:mb-3 md:ml-3 inline-block h-3 w-3 md:h-5 md:w-5 rounded-full bg-baby"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.7, 1], opacity: [0, 1, 1] }}
          transition={{ delay: base + LETTERS.length * step, duration: 0.3, times: [0, 0.6, 1], ease: SNAP }}
        />
      </motion.div>
    </motion.div>
  );
}
