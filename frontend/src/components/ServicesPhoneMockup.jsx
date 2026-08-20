import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  LayoutDashboard,
  Smartphone,
  AppWindow,
  CalendarClock,
  Wrench,
  Zap,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const SERVICES = [
  { icon: Globe, title: "Websites", desc: "Ένα website που φέρνει πελάτες." },
  { icon: LayoutDashboard, title: "Web Tools", desc: "Δες τα νούμερά σου σε ένα μέρος." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Οι πελάτες σου, πάντα ένα tap μακριά." },
  { icon: AppWindow, title: "Web Apps", desc: "Κρατήσεις και πληρωμές, αυτόματα." },
  { icon: CalendarClock, title: "Προγράμματα", desc: "Απόθεμα και πρόγραμμα χωρίς λάθη." },
  { icon: Wrench, title: "Έξυπνα Εργαλεία", desc: "Φτιαγμένο για τον τρόπο που δουλεύεις." },
  { icon: Zap, title: "Automations", desc: "Τα συστήματά σου μιλάνε μεταξύ τους." },
  { icon: Lightbulb, title: "Έξυπνες Ψηφιακές Λύσεις", desc: "Οποιοδήποτε πρόβλημα, λύση στα μέτρα σου." },
];

const BROWSE_MS = 900;
const TAP_MS = 280;
const DETAIL_MS = 2300;
const BACK_MS = 450;

const menuVariants = {
  initial: { x: -24, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -24, opacity: 0 },
};
const detailVariants = {
  initial: { x: 24, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 24, opacity: 0 },
};

export default function ServicesPhoneMockup() {
  const [screen, setScreen] = useState("menu");
  const [activeIndex, setActiveIndex] = useState(0);
  const [tapped, setTapped] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    const timers = [];
    const wait = (ms) =>
      new Promise((resolve) => {
        const t = setTimeout(resolve, ms);
        timers.push(t);
      });

    async function loop() {
      while (mounted) {
        setScreen("menu");
        setTapped(false);
        await wait(BROWSE_MS);
        if (!mounted) break;

        setTapped(true);
        await wait(TAP_MS);
        if (!mounted) break;

        setTapped(false);
        setScreen("detail");
        await wait(DETAIL_MS);
        if (!mounted) break;

        setScreen("menu");
        await wait(BACK_MS);
        if (!mounted) break;

        indexRef.current = (indexRef.current + 1) % SERVICES.length;
        setActiveIndex(indexRef.current);
      }
    }
    loop();
    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  const active = SERVICES[activeIndex];

  return (
    <div data-testid="services-phone-mockup" className="w-[220px] mx-auto">
      <div className="rounded-[2.4rem] bg-ink p-2 shadow-2xl shadow-ink/20">
        <div className="relative rounded-[1.9rem] bg-white overflow-hidden h-[420px]">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-4 w-16 rounded-full bg-ink z-20" />
          <AnimatePresence mode="wait">
            {screen === "menu" ? (
              <motion.div
                key="menu"
                data-testid="services-phone-screen-menu"
                variants={menuVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col pt-8 px-3.5"
              >
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-ink/40 px-1">
                  Υπηρεσίες
                </p>
                <div className="mt-2 flex-1 flex flex-col gap-1">
                  {SERVICES.map((s, i) => {
                    const isHot = tapped && i === activeIndex;
                    return (
                      <div
                        key={s.title}
                        data-testid={`services-phone-menu-item-${i}`}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-[background-color,transform] duration-200 ${
                          isHot ? "bg-baby-light scale-[0.97]" : "bg-transparent scale-100"
                        }`}
                      >
                        <span
                          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-200 ${
                            isHot ? "bg-baby text-ink" : "bg-mist text-ink/50"
                          }`}
                        >
                          <s.icon className="h-3 w-3" />
                        </span>
                        <span className="flex-1 text-[10px] font-semibold text-ink/80 leading-none truncate">
                          {s.title}
                        </span>
                        <ChevronRight className="h-3 w-3 text-ink/20 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                data-testid="services-phone-screen-detail"
                variants={detailVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col pt-8 px-4"
              >
                <div className="flex items-center gap-1.5 text-ink/40">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold">
                    Υπηρεσίες
                  </span>
                </div>
                <div className="mt-7 flex flex-col items-start">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-baby-light text-baby-dark">
                    <active.icon className="h-6 w-6" />
                  </span>
                  <h4
                    data-testid="services-phone-detail-title"
                    className="mt-4 font-display text-base font-semibold tracking-tight text-ink"
                  >
                    {active.title}
                  </h4>
                  <p
                    data-testid="services-phone-detail-desc"
                    className="mt-2 text-[11px] leading-relaxed text-ink/55"
                  >
                    {active.desc}
                  </p>
                </div>
                <div className="mt-auto mb-5 h-9 w-full rounded-full bg-baby/80" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="mt-4 text-center text-xs font-semibold text-ink/50">
        Όλες οι υπηρεσίες μας, σε μία οθόνη
      </p>
    </div>
  );
}
