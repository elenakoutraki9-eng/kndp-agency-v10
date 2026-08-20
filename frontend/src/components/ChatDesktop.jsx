import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  UtensilsCrossed,
  Scissors,
  Dumbbell,
  ShoppingBag,
  CalendarCheck,
  Gift,
  Users,
  MessageSquare,
  TrendingUp,
  Bell,
  Boxes,
  CreditCard,
  Lock,
  Sparkles,
} from "lucide-react";

const BUSINESSES = [
  {
    name: "Εστιατόριο",
    icon: UtensilsCrossed,
    results: [
      { label: "Online Μενού & Παραγγελίες", icon: UtensilsCrossed },
      { label: "Booking System", icon: CalendarCheck },
      { label: "Loyalty Program", icon: Gift },
      { label: "Εργαλείο Προγραμματισμού Προσωπικού", icon: Users },
    ],
  },
  {
    name: "Κομμωτήριο",
    icon: Scissors,
    results: [
      { label: "Online Κράτηση Ραντεβού", icon: CalendarCheck },
      { label: "Loyalty Program", icon: Gift },
      { label: "Διαχείριση Προγράμματος Προσωπικού", icon: Users },
      { label: "Υπενθυμίσεις Ραντεβού με SMS", icon: MessageSquare },
    ],
  },
  {
    name: "Γυμναστήριο",
    icon: Dumbbell,
    results: [
      { label: "Κράτηση & Πρόγραμμα Μαθημάτων", icon: CalendarCheck },
      { label: "Πλατφόρμα Διαχείρισης Συνδρομών", icon: CreditCard },
      { label: "Εφαρμογή Παρακολούθησης Προόδου", icon: TrendingUp },
      { label: "Αυτόματες Υπενθυμίσεις Ανανέωσης", icon: Bell },
    ],
  },
  {
    name: "Κατάστημα Λιανικής",
    icon: ShoppingBag,
    results: [
      { label: "Online Store", icon: ShoppingBag },
      { label: "Εργαλείο Διαχείρισης Αποθήκης", icon: Boxes },
      { label: "Loyalty Program", icon: Gift },
      { label: "POS Integration", icon: CreditCard },
    ],
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Cursor = () => (
  <motion.span
    animate={{ opacity: [1, 1, 0, 0] }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className="inline-block w-[2px] h-4 bg-baby-dark ml-0.5 align-middle"
  />
);

export default function ChatDesktop() {
  const [bizIndex, setBizIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [phase, setPhase] = useState("empty");
  const [resultsShown, setResultsShown] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      let biz = 0;
      while (!cancelled) {
        const business = BUSINESSES[biz % BUSINESSES.length];
        setBizIndex(biz % BUSINESSES.length);
        setPhase("empty");
        setTypedText("");
        setResultsShown(0);
        await sleep(500);
        if (cancelled) return;

        setPhase("typing");
        for (let i = 1; i <= business.name.length; i++) {
          if (cancelled) return;
          setTypedText(business.name.slice(0, i));
          await sleep(90);
        }
        if (cancelled) return;
        await sleep(500);

        setPhase("button");
        await sleep(900);
        if (cancelled) return;

        setPhase("tap");
        await sleep(350);
        if (cancelled) return;

        setPhase("results");
        for (let i = 1; i <= business.results.length; i++) {
          if (cancelled) return;
          setResultsShown(i);
          await sleep(450);
        }
        if (cancelled) return;

        await sleep(2800);
        biz += 1;
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const business = BUSINESSES[bizIndex];
  const showResults = phase === "results";

  return (
    <div data-testid="hero-desktop" className="relative w-full max-w-[560px] mx-auto">
      <div className="rounded-2xl bg-white shadow-2xl shadow-ink/20 border border-ink/10 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ink/5 bg-mist/70">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-1.5 rounded-full bg-white border border-ink/10 px-4 py-1.5 text-[11px] font-medium text-ink/50 max-w-[220px] w-full justify-center">
              <Lock className="h-3 w-3 text-ink/35" />
              kndp.studio
            </div>
          </div>
          <div className="w-[52px]" />
        </div>

        {/* App content */}
        <div className="flex flex-col">
          {/* App header */}
          <div className="flex items-center gap-2.5 px-6 pt-4 pb-4 border-b border-ink/5">
            <span className="h-8 w-8 rounded-full bg-baby flex items-center justify-center font-display font-bold text-xs text-ink">
              K
            </span>
            <div>
              <p className="text-xs font-bold text-ink leading-tight">KNDP Studio</p>
              <p className="text-[10px] text-ink/45">Τι μπορούμε να χτίσουμε για εσένα;</p>
            </div>
          </div>

          {/* Body: two columns */}
          <div
            data-testid="hero-business-demo"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 min-h-[300px]"
          >
            {/* Left: input */}
            <div
              data-testid="hero-demo-input-screen"
              className="flex flex-col justify-center gap-4"
            >
              <p className="text-[11px] font-bold text-ink/50 uppercase tracking-[0.15em]">
                Τι επιχείρηση έχεις;
              </p>
              <div className="w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3.5 flex items-center">
                {typedText ? (
                  <span className="text-sm font-semibold text-ink">{typedText}</span>
                ) : (
                  <span className="text-sm font-medium text-ink/35">
                    Γράψε την επιχείρησή σου...
                  </span>
                )}
                <Cursor />
              </div>
              <motion.button
                data-testid="hero-demo-cta"
                animate={{
                  opacity: phase === "button" || phase === "tap" || showResults ? 1 : 0.45,
                  scale: phase === "tap" ? 0.94 : 1,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-baby px-5 py-2.5 text-xs font-extrabold text-ink"
              >
                Δες τι μπορούμε να χτίσουμε
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            {/* Right: results panel */}
            <div className="rounded-2xl bg-mist/50 border border-ink/5 p-4 flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                {showResults ? (
                  <motion.div
                    key="results"
                    data-testid="hero-demo-results-screen"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col h-full"
                  >
                    <p className="text-[11px] font-bold text-ink/50 flex items-center gap-1.5">
                      <business.icon className="h-3.5 w-3.5 text-baby-dark" />
                      Ιδανικό για {business.name}
                    </p>
                    <div className="mt-3 flex-1 flex flex-col gap-2">
                      {business.results.slice(0, resultsShown).map((r, i) => (
                        <motion.div
                          key={`${business.name}-${i}`}
                          data-testid={`hero-demo-result-${i}`}
                          initial={{ opacity: 0, scale: 0.85, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="flex items-center gap-3 rounded-xl bg-white border border-ink/5 p-2.5"
                        >
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-baby text-ink">
                            <r.icon className="h-3.5 w-3.5" />
                          </span>
                          <p className="text-[11px] font-semibold text-ink leading-snug">
                            {r.label}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center h-full text-center gap-2 py-6"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-ink/5 text-baby-dark">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <p className="text-[11px] font-medium text-ink/40 max-w-[160px] leading-snug">
                      Οι προτάσεις μας θα εμφανιστούν εδώ
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
