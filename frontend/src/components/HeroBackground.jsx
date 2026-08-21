import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const useMouseParallax = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };
  return { mx: smx, my: smy, onMouseMove, onMouseLeave };
};

const FloatingShape = ({ children, className = "", depth = 30, duration = 8, mx, my }) => {
  const x = useTransform(mx, [-1, 1], [-depth, depth]);
  const y = useTransform(my, [-1, 1], [-depth, depth]);
  return (
    <motion.div style={{ x, y }} className={`absolute will-change-transform ${className}`}>
      <motion.div
        className="will-change-transform"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default function HeroBackground({ mx, my }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="bg-grid absolute inset-0" />

      <FloatingShape mx={mx} my={my} depth={36} duration={8} className="top-[14%] right-[34%]">
        <div className="h-24 w-24 md:h-28 md:w-28 rounded-full border-[3px] border-baby-dark/30" />
      </FloatingShape>
      <FloatingShape mx={mx} my={my} depth={55} duration={7} className="top-[30%] right-[6%]">
        <div className="relative h-10 w-10">
          <span className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-baby-dark/50" />
          <span className="absolute top-1/2 left-0 w-full h-[3px] -translate-y-1/2 rounded-full bg-baby-dark/50" />
        </div>
      </FloatingShape>
      <FloatingShape mx={mx} my={my} depth={26} duration={9} className="bottom-[22%] left-[42%]">
        <div className="h-5 w-5 rounded-full bg-baby" />
      </FloatingShape>
    </div>
  );
}
