import { motion } from "framer-motion";
import { ArrowUpRight, MessageSquareText, FileText, Rocket } from "lucide-react";
import { WordMask, Reveal, Kicker, Magnetic } from "@/components/Reveal";
import { StackPanel } from "@/components/StackSection";
import { scrollToId } from "@/lib/scroll";

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

function StepCard({ step, index }) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className="w-full"
    >
      <div
        data-testid={`how-step-${index + 1}`}
        className="group relative rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6 backdrop-blur-sm transition-[background-color,border-color,transform] duration-500 hover:bg-white/10 hover:border-baby/40 hover:-translate-y-1"
      >
        <div className="flex items-center gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-baby/15 text-baby transition-[background-color,color,transform] duration-500 group-hover:bg-baby group-hover:text-ink group-hover:-rotate-12">
            <Icon className="h-5 w-5" />
          </span>
          <span className="font-display text-3xl md:text-4xl font-light text-baby leading-none">
            {step.n}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg md:text-xl font-medium tracking-tight">
          {step.title}
        </h3>
        <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{step.text}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorksSection(props) {
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

          {/* Compact stacked step cards */}
          <div className="mt-8 md:mt-10 flex flex-col gap-4 md:gap-5 max-w-2xl">
            {steps.map((step, i) => (
              <StepCard key={step.n} step={step} index={i} />
            ))}
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
