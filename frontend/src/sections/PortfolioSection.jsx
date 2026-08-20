import { ArrowUpRight } from "lucide-react";
import { WordMask, Reveal, Kicker, Magnetic } from "@/components/Reveal";
import { StackPanel } from "@/components/StackSection";
import { scrollToId } from "@/lib/scroll";
import ProjectCarousel from "@/components/ProjectCarousel";

const projects = [
  {
    title: "Booking System για Εστιατόριο",
    desc: "Online κρατήσεις, διαχείριση τραπεζιών και αυτόματες υπενθυμίσεις για ένα πολυσύχναστο bistro.",
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

export default function PortfolioSection(props) {
  return (
    <StackPanel
      {...props}
      innerClassName="rounded-[2.5rem] bg-mist border border-ink/5 shadow-2xl shadow-ink/10 overflow-hidden"
    >
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
                text="έρχεται σύντομα."
                accent={["έρχεται", "σύντομα."]}
                delay={0.2}
                className="block"
              />
            </h2>
            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-ink/60">
              Δείτε το είδος των έργων που έχουμε αυτή τη στιγμή υπό εξέλιξη.
              Πλήρη case studies έρχονται σύντομα — ή το δικό σου έργο θα
              μπορούσε να είναι το πρώτο που θα παρουσιάσουμε.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ProjectCarousel projects={projects} />
          </Reveal>

          <Reveal className="mt-10 md:mt-12">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-ink text-white px-8 md:px-14 py-10 md:py-12 grain text-center">
              <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-baby/20 blur-3xl" />
              <p className="relative font-display text-xl md:text-3xl font-medium tracking-tight max-w-2xl mx-auto">
                Έρχονται περισσότερα έργα — το δικό σου μπορεί να είναι το επόμενο.
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
