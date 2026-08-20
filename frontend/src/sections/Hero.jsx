import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { Kicker, WordMask, Magnetic } from "@/components/Reveal";
import HeroBackground, { useMouseParallax } from "@/components/HeroBackground";
import ChatPhone from "@/components/ChatPhone";
import { StackPanel } from "@/components/StackSection";
import { scrollToId } from "@/lib/scroll";

const rotatingWords = ["Websites", "Web Apps", "Έξυπνα Εργαλεία", "Automations"];

export default function Hero(props) {
  const heroRef = useRef(null);
  const { mx, my, onMouseMove, onMouseLeave } = useMouseParallax();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const imgMX = useTransform(mx, [-1, 1], [-10, 10]);
  const imgMY = useTransform(my, [-1, 1], [-8, 8]);

  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setWordIndex((v) => (v + 1) % rotatingWords.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <StackPanel {...props} innerClassName="bg-paper">
      <section
        id="hero"
      ref={heroRef}
      data-testid="hero-section"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative min-h-[100svh] flex items-center pt-24 pb-10 overflow-hidden"
    >
      <HeroBackground mx={mx} my={my} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Kicker>KNDP — Ψηφιακό Στούντιο</Kicker>
          </motion.div>
          <h1
            data-testid="hero-headline"
            className="mt-5 font-display font-bold tracking-tighter leading-[0.95] text-5xl sm:text-6xl lg:text-6xl"
          >
            <WordMask text="Χτίζουμε" delay={0.2} className="block" />
            <WordMask text="Ό,τι" accent={["Ό,τι"]} delay={0.4} className="block" />
            <WordMask text="Χρειάζεσαι." delay={0.6} className="block" />
          </h1>
          <motion.p
            data-testid="hero-subheading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-ink/60"
          >
            Από ιστοσελίδες και εφαρμογές έως έξυπνα εργαλεία και αυτοματισμούς,
            χτίζουμε τις ψηφιακές λύσεις που η επιχείρησή σου χρειάζεται για να αναπτυχθεί.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToId("#contact")}
                data-testid="hero-cta-primary"
                className="btn-shine group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-white transition-[transform,background-color] duration-300 hover:scale-105 hover:bg-baby-dark hover:text-ink"
              >
                Ζήτησε Δωρεάν Προσφορά
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToId("#services")}
                data-testid="hero-cta-secondary"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/60 backdrop-blur px-7 py-3.5 text-sm font-bold text-ink transition-[transform,background-color,border-color] duration-300 hover:scale-105 hover:border-baby-dark hover:bg-baby-light"
              >
                Δες Τι Χτίζουμε
              </button>
            </Magnetic>
          </motion.div>
        </div>

        <div className="lg:col-span-5 relative top-[4px] md:-top-[4px] lg:-top-[12px]">
          <motion.div
            style={{ x: imgMX, y: imgMY }}
            className="[zoom:0.89] sm:[zoom:0.87] lg:[zoom:0.8] origin-top"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full flex justify-center"
            >
              <motion.div style={{ y: phoneY }} className="will-change-transform">
                <ChatPhone />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              data-testid="hero-rotating-chip"
              className="absolute -top-5 -right-2 md:-right-6 rounded-full bg-ink text-white pl-4 pr-5 py-2.5 flex items-center gap-2.5 shadow-xl text-sm font-semibold"
            >
              <span className="h-2 w-2 rounded-full bg-baby animate-pulse" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[wordIndex]}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="inline-block"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.25 }}
              className="absolute -bottom-6 -left-4 md:-left-10 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl px-6 py-5 animate-float-soft"
            >
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-ink/50">
                Ολοκληρωμένη υπηρεσία
              </p>
              <p className="mt-1 font-display font-semibold tracking-tight">
                Σχεδίαση → Ανάπτυξη → Κυκλοφορία
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-ink/40"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">Κύλιση</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.div>
      </section>
    </StackPanel>
  );
}
