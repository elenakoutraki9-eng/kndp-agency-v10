import { motion, useScroll, useSpring } from "framer-motion";

// A thin blue bar pinned to the very top of the viewport that fills left-to-right
// as the visitor scrolls the page, giving a sense of reading progress.
// Decorative only (aria-hidden, pointer-events-none) and works with both the
// desktop smooth-scroll (Lenis drives real window scroll) and native mobile scroll.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // Springy fill so it eases toward the true progress rather than snapping.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      data-testid="scroll-progress-bar"
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-gradient-to-r from-baby to-baby-dark pointer-events-none"
    />
  );
}
