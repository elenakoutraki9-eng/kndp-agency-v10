import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

// A small floating dot — the same blue dot from the KNDP logo — that stays
// visible for the whole page and drifts along with scroll. Purely decorative
// (aria-hidden, pointer-events-none) so it can never intercept clicks/touch.
export default function ScrollCompanion() {
  const { scrollYProgress } = useScroll();
  // Springy lag behind the raw scroll value so it feels fluid, not 1:1-robotic.
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 45, damping: 20, mass: 0.4 });
  const top = useTransform(smoothProgress, [0, 1], ["14vh", "88vh"]);

  // A gentle sideways nudge in the direction of scroll speed — a hint of life
  // reacting to the user, not a literal 1:1 tracking.
  const velocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(velocity, { stiffness: 40, damping: 18 });
  const x = useTransform(smoothVelocity, [-3, 0, 3], [12, 0, -12]);

  return (
    <motion.div
      aria-hidden="true"
      data-testid="scroll-companion-dot"
      className="fixed right-4 md:right-8 z-40 pointer-events-none"
      style={{ top }}
    >
      <motion.div style={{ x }} className="scroll-companion-drift relative h-3 w-3 md:h-3.5 md:w-3.5">
        <span className="absolute -inset-2 rounded-full bg-baby/30 blur-md scroll-companion-pulse" />
        <span className="absolute inset-0 rounded-full bg-baby shadow-[0_0_10px_rgba(137,207,240,0.7)]" />
      </motion.div>
    </motion.div>
  );
}
