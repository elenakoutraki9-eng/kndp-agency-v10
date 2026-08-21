import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { WordMask, Reveal, Kicker, Magnetic } from "@/components/Reveal";
import { StackPanel } from "@/components/StackSection";
import { scrollToId } from "@/lib/scroll";
import useIsMobile from "@/hooks/useIsMobile";

const projects = [
  {
    title: "Booking System για Εστιατόριο",
    desc: "Online κρατήσεις, διαχείριση τραπεζιών και αυτόματες υπενθυμίσεις για ένα πολυσύχναστο bistro — μηδέν χαμένες κρατήσεις.",
    tag: "Web App",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "E-commerce App",
    desc: "Ένα γρήγορο online store με καλάθι, ολοκλήρωση παραγγελίας και συγχρονισμό αποθέματος για μια αναπτυσσόμενη επιχείρηση λιανικής.",
    tag: "E-commerce",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Προσαρμοσμένο Dashboard Επιχείρησης",
    desc: "Πωλήσεις, λειτουργίες και αναφορές σε πραγματικό χρόνο, όλα μαζί σε ένα καθαρό εσωτερικό εργαλείο.",
    tag: "Internal Tool",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Mobile App για Τοπικό Γυμναστήριο",
    desc: "Κρατήσεις μαθημάτων, συνδρομές και παρακολούθηση προπόνησης στην τσέπη των μελών.",
    tag: "Mobile App",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Σουίτα Αυτοματισμού Εργασιών",
    desc: "Τιμολόγηση, παρακολούθηση πελατών και καταχώρηση δεδομένων αυτοματοποιημένα σε όλο το back office.",
    tag: "Automation",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Πλατφόρμα Αγγελιών Ακινήτων",
    desc: "Αγγελίες με δυνατότητα αναζήτησης, ενσωματωμένες εικονικές περιηγήσεις και εργαλεία για μεσίτες, για ένα τοπικό γραφείο.",
    tag: "Web Platform",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
  },
];

function StackCard({ p, i, total, progress, isMobile }) {
  // Earlier cards recede (scale down) as later ones stack over them.
  const targetScale = 1 - (total - 1 - i) * 0.035;
  const scale = useTransform(progress, [i / total, 1], [1, targetScale]);
  const imageRight = i % 2 === 1;
  // Each card sticks slightly lower than the previous so the stack "peeks".
  const top = 88 + i * 26;

  return (
    <div className="sticky" style={{ top: `${top}px` }}>
      <motion.article
        data-testid={`case-study-${i}`}
        style={{ scale: isMobile ? 1 : scale }}
        className="group origin-top grid grid-cols-1 md:grid-cols-2 items-center gap-5 md:gap-10 rounded-3xl border border-ink/8 bg-white p-4 md:p-6 shadow-xl shadow-ink/10"
      >
        {/* Image / mockup */}
        <div
          className={`relative overflow-hidden rounded-2xl bg-mist ${
            imageRight ? "md:order-2" : "md:order-1"
          }`}
        >
          <div className="aspect-[16/11] w-full">
            <img
              src={p.img}
              alt={p.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink/5" />
        </div>

        {/* Details */}
        <div className={`px-1 md:px-4 ${imageRight ? "md:order-1" : "md:order-2"}`}>
          <span className="inline-flex items-center rounded-full bg-baby-light border border-baby/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-baby-dark">
            {p.tag}
          </span>
          <h3 className="mt-4 font-display text-2xl md:text-3xl font-medium tracking-tight leading-tight">
            {p.title}
          </h3>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-ink/60">{p.desc}</p>
          <button
            type="button"
            onClick={() => scrollToId("#contact")}
            data-testid={`case-study-cta-${i}`}
            className="group/btn mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-ink"
          >
            Θέλω κάτι παρόμοιο
            <ArrowUpRight className="h-4 w-4 text-baby-dark transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        </div>
      </motion.article>
    </div>
  );
}

export default function PortfolioSection(props) {
  const isMobile = useIsMobile();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <StackPanel {...props} innerClassName="">
      <section id="portfolio" data-testid="portfolio-section" className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <Kicker>Έργα</Kicker>
            <h2
              data-testid="portfolio-headline"
              className="mt-3 font-display font-medium tracking-tight text-3xl md:text-5xl"
            >
              <WordMask text="Η δουλειά μας" className="block" />
              <WordMask
                text="μιλάει από μόνη της."
                accent={["μιλάει", "από", "μόνη", "της."]}
                delay={0.2}
                className="block"
              />
            </h2>
            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-ink/60">
              Επιλεγμένα case studies — από booking systems και e-shops μέχρι
              custom dashboards και automations. Κάνε scroll: κάθε κάρτα
              φεύγει για να αποκαλύψει την επόμενη.
            </p>
          </Reveal>

          {/* Sticky stacking case study cards */}
          <div ref={containerRef} className="relative mt-10 md:mt-14 pb-10">
            {projects.map((p, i) => (
              <StackCard
                key={p.title}
                p={p}
                i={i}
                total={projects.length}
                progress={scrollYProgress}
                isMobile={isMobile}
              />
            ))}
          </div>

          <Reveal className="mt-10 md:mt-14">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-ink text-white px-8 md:px-14 py-10 md:py-12 grain text-center">
              <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-baby/20 blur-3xl" />
              <p className="relative font-display text-xl md:text-3xl font-medium tracking-tight max-w-2xl mx-auto">
                Θες κάτι παρόμοιο για την επιχείρησή σου; Ας το φτιάξουμε μαζί.
              </p>
              <Magnetic strength={0.25} className="relative">
                <button
                  onClick={() => scrollToId("#contact")}
                  data-testid="portfolio-cta-button"
                  className="btn-shine group mt-7 inline-flex items-center gap-2 rounded-full bg-baby px-8 py-3.5 text-sm font-bold text-ink transition-transform duration-300 hover:scale-105"
                >
                  Ζήτησε Δωρεάν Προσφορά
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </StackPanel>
  );
}
