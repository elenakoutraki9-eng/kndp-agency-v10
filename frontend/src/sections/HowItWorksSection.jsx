import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, MessageSquareText, FileText, Rocket } from "lucide-react";
import { WordMask, Reveal, Kicker, Magnetic } from "@/components/Reveal";
import { StackPanel } from "@/components/StackSection";
import { scrollToId } from "@/lib/scroll";
import useIsMobile from "@/hooks/useIsMobile";

const steps = [
  {
    n: "01",
    icon: MessageSquareText,
    side: "left",
    title: "Πες μας το πρόβλημά σου",
    text: "Περιγράψτε τι χρειάζεστε ή τι σας καθυστερεί — ένα σύντομο μήνυμα αρκεί.",
  },
  {
    n: "02",
    icon: FileText,
    side: "right",
    title: "Πάρε δωρεάν σχέδιο & προσφορά",
    text: "Σου στέλνουμε μια ξεκάθαρη πρόταση εντός 48 ωρών. Καμία δέσμευση, χωρίς μικρά γράμματα.",
  },
  {
    n: "03",
    icon: Rocket,
    side: "left",
    title: "Το χτίζουμε",
    text: "Η λύση σου βγαίνει live γρήγορα — φτιαγμένη αποκλειστικά για εσένα, δική σου εξ ολοκλήρου.",
  },
];

// Scroll-progress ranges where each card fades/slides in — timed so a card
// appears right as the drawing line reaches its position.
const REVEAL_RANGES = [
  [0.05, 0.24],
  [0.4, 0.58],
  [0.72, 0.9],
];

// Zigzag snake path (desktop) and a straight center line (mobile).
// viewBox is 0 0 100 100, stretched with preserveAspectRatio="none";
// vector-effect keeps the stroke width crisp/constant.
const DESKTOP_PATH = "M27 2 L27 17 C27 31 73 35 73 50 C73 65 27 69 27 83 L27 98";
const MOBILE_PATH = "M50 2 L50 98";

function StepCard({ step, index, progress, isMobile }) {
  const range = REVEAL_RANGES[index];
  const fromX = (step.side === "left" ? -1 : 1) * (isMobile ? 26 : 64);
  const opacity = useTransform(progress, range, [0, 1]);
  const x = useTransform(progress, range, [fromX, 0]);
  const Icon = step.icon;

  const alignment =
    step.side === "left" ? "mr-auto md:pr-6" : "ml-auto md:pl-6";

  return (
    <motion.div
      style={{ opacity, x }}
      className={`relative w-[86%] md:w-[54%] ${alignment}`}
    >
      <div
        data-testid={`how-step-${index + 1}`}
        className="group relative rounded-2xl bg-white/5 border border-white/10 p-6 md:p-7 backdrop-blur-sm transition-[background-color,border-color,transform] duration-500 hover:bg-white/10 hover:border-baby/40 hover:-translate-y-1"
      >
        <div className="flex items-center gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-baby/15 text-baby transition-[background-color,color,transform] duration-500 group-hover:bg-baby group-hover:text-ink group-hover:-rotate-12">
            <Icon className="h-5 w-5" />
          </span>
          <span className="font-display text-3xl md:text-4xl font-light text-baby leading-none">
            {step.n}
          </span>
        </div>
        <h3 className="mt-4 font-display text-lg md:text-xl font-medium tracking-tight">
          {step.title}
        </h3>
        <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{step.text}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorksSection(props) {
  const isMobile = useIsMobile();
  const stepsRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start 0.8", "end 0.45"],
  });
  // Smooth the raw scroll progress a touch for the line drawing.
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const linePath = isMobile ? MOBILE_PATH : DESKTOP_PATH;

  return (
    <StackPanel
      {...props}
      innerClassName="rounded-[2.5rem] bg-ink text-white shadow-2xl shadow-ink/20 overflow-hidden grain relative"
    >
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-baby/15 blur-3xl pointer-events-none" />
      <section id="how-it-works" data-testid="how-it-works-section" className="py-12 md:py-16 relative">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Reveal>
            <Kicker light>Πώς δουλεύουμε</Kicker>
            <h2
              data-testid="how-it-works-headline"
              className="mt-3 font-display font-medium tracking-tight text-3xl md:text-5xl"
            >
              <WordMask text="Τρία βήματα." className="inline-block" />{" "}
              <WordMask text="Καμία ταλαιπωρία." accent={["Καμία", "ταλαιπωρία."]} delay={0.2} className="inline-block" />
            </h2>
          </Reveal>

          {/* Zigzag steps with self-drawing snake line */}
          <div ref={stepsRef} className="relative mt-10 md:mt-16">
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              {/* faint static track */}
              <path
                d={linePath}
                stroke="rgba(137,207,240,0.16)"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* animated line that draws on scroll */}
              <motion.path
                d={linePath}
                stroke="#89cff0"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength }}
              />
            </svg>

            <div className="relative z-10 flex flex-col gap-10 md:gap-14">
              {steps.map((step, i) => (
                <StepCard
                  key={step.n}
                  step={step}
                  index={i}
                  progress={scrollYProgress}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>

          <Reveal className="mt-10 md:mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToId("#contact")}
                data-testid="how-it-works-cta-button"
                className="btn-shine group inline-flex items-center gap-2 rounded-full bg-baby px-6 py-3 text-sm font-bold text-ink transition-transform duration-300 hover:scale-105"
              >
                Ζήτησε Δωρεάν Προσφορά
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </button>
            </Magnetic>
            <p className="text-sm font-semibold text-white/50">
              Δωρεάν σχέδιο εντός 48 ωρών — χωρίς δέσμευση.
            </p>
          </Reveal>
        </div>
      </section>
    </StackPanel>
  );
}
