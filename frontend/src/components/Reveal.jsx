import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import useIsMobile from "@/hooks/useIsMobile";

const EASE = [0.22, 1, 0.36, 1];

export const MaskLine = ({ children, delay = 0, className = "" }) => {
  const isMobile = useIsMobile();
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={isMobile ? { opacity: 0 } : { y: "110%" }}
        animate={isMobile ? { opacity: 1 } : { y: 0 }}
        transition={{ duration: isMobile ? 0.35 : 0.9, delay: isMobile ? 0 : delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
};

export const WordMask = ({ text, accent = [], delay = 0, stagger = 0.07, className = "" }) => {
  const isMobile = useIsMobile();
  const words = text.split(" ");
  const dur = isMobile ? 0.35 : 0.75;
  const stag = isMobile ? 0 : stagger;
  const baseDelay = isMobile ? 0 : delay;
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden align-bottom pt-[0.1em] -mt-[0.1em] pb-[0.22em] -mb-[0.22em]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.span
            className={`inline-block will-change-transform ${
              accent.includes(w) ? "text-baby-dark italic" : ""
            }`}
            variants={
              isMobile
                ? {
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { duration: dur, delay: baseDelay, ease: EASE },
                    },
                  }
                : {
                    hidden: { y: "115%", rotate: 3 },
                    show: {
                      y: 0,
                      rotate: 0,
                      transition: { duration: dur, delay: baseDelay + i * stag, ease: EASE },
                    },
                  }
            }
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
};

export const Reveal = ({ children, delay = 0, y = 28, x = 0, scale = 1, className = "" }) => {
  const isMobile = useIsMobile();
  return (
    <motion.div
      className={className}
      initial={isMobile ? { opacity: 0 } : { opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: isMobile ? 0.35 : 0.8, delay: isMobile ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

export const ParallaxY = ({ children, distance = 40, className = "" }) => {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRange = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} style={{ y: isMobile ? 0 : yRange }} className={className}>
      {children}
    </motion.div>
  );
};

export const Counter = ({ to, suffix = "", className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, to, mv]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

export const Magnetic = ({ children, strength = 0.3, className = "" }) => {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 200, damping: 16, mass: 0.2 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  // No cursor on touch devices — render static wrapper to avoid pointer transforms.
  if (isMobile) {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const Kicker = ({ children, className = "", light = false }) => (
  <span
    className={`inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.25em] font-semibold ${
      light ? "text-white/60" : "text-ink/60"
    } ${className}`}
  >
    <motion.span
      className="h-2 w-2 rounded-full bg-baby"
      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    />
    {children}
  </span>
);
