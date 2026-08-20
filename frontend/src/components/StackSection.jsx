import { Children, cloneElement, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";

const NAV_OFFSET = 96;
const STACK_GAP = 12;
const MAX_DEPTH = 3;

export const StackedPanels = ({ children, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const total = Children.count(children);
  return (
    <div ref={ref} data-testid="stacked-panels" className={`relative ${className}`}>
      {Children.map(children, (child, i) =>
        cloneElement(child, { progress: scrollYProgress, index: i, total })
      )}
    </div>
  );
};

export const StackPanel = ({
  children,
  progress,
  index = 0,
  total = 1,
  className = "",
  innerClassName = "",
}) => {
  const contentRef = useRef(null);
  const [top, setTop] = useState(NAV_OFFSET);
  const stacked = Boolean(progress);
  const fallback = useMotionValue(0);
  const source = progress || fallback;

  useEffect(() => {
    const measure = () => {
      const h = contentRef.current?.offsetHeight || 0;
      const base = Math.min(NAV_OFFSET, window.innerHeight - h);
      setTop(base + Math.min(index, 4) * STACK_GAP);
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [index]);

  const depth = Math.min(total - 1 - index, MAX_DEPTH);
  const targetScale = 1 - depth * 0.04;
  const scale = useTransform(source, [index / total, 1], [1, targetScale]);
  const dimOpacity = useTransform(source, [index / total, 1], [0, depth * 0.15]);

  // Rendered outside a StackedPanels wrapper: plain, non-sticky section.
  if (!stacked) {
    return (
      <div className={className}>
        <div className={`relative ${innerClassName}`}>{children}</div>
      </div>
    );
  }

  return (
    <div className={`sticky ${className}`} style={{ top, zIndex: index + 1 }}>
      <motion.div
        ref={contentRef}
        style={{ scale }}
        className={`origin-top will-change-transform relative ${innerClassName}`}
      >
        {children}
        <motion.div
          aria-hidden
          style={{ opacity: dimOpacity }}
          className="absolute inset-0 z-40 bg-black rounded-[inherit] pointer-events-none"
        />
      </motion.div>
    </div>
  );
};
