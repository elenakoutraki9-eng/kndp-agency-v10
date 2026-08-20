import {
  ArrowUpRight,
  Smartphone,
  UtensilsCrossed,
  Boxes,
  Users,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { Reveal, Kicker, WordMask, Magnetic } from "@/components/Reveal";
import { scrollToId } from "@/lib/scroll";
import ServicesPhoneMockup from "@/components/ServicesPhoneMockup";


const categories = [
  {
    slug: "customers",
    name: "Για τους Πελάτες σου",
    services: [
      {
        n: "01",
        title: "Websites",
        text: "Ένας γρήγορος, καλοσχεδιασμένος ιστότοπος που μετατρέπει επισκέπτες σε πελάτες.",
        who: "Για επιχειρήσεις που θέλουν περισσότερους πελάτες",
      },
      {
        n: "03",
        title: "Mobile Apps",
        text: "Κρατήσεις, παραγγελίες και λογαριασμός με λίγα πατήματα — ένας λόγος να επιστρέφουν.",
        who: "Για επιχειρήσεις που χτίζουν πίστη πελατών",
      },
      {
        n: "04",
        title: "Web Apps",
        text: "Οι πελάτες κρατούν, πληρώνουν και διαχειρίζονται τα πάντα μόνοι τους — λιγότερος χρόνος στο τηλέφωνο.",
        who: "Για επιχειρήσεις που πνίγονται στις συνεχείς επικοινωνίες",
      },
    ],
  },
  {
    slug: "team",
    name: "Για την Ομάδα σου",
    services: [
      {
        n: "02",
        title: "Web Tools",
        text: "Όλα τα νούμερα που μετράνε σε ένα μέρος — τέλος στα ατέλειωτα spreadsheets.",
        who: "Για ομάδες που κουράστηκαν από τη χειρωνακτική δουλειά",
      },
      {
        n: "06",
        title: "Έξυπνα Εργαλεία",
        text: "Ένα εργαλείο φτιαγμένο για τον τρόπο που δουλεύεις — η αγγαρεία εξαφανίζεται.",
        who: "Για ομάδες που έχουν πνιγεί σε επαναλαμβανόμενες εργασίες",
      },
    ],
  },
  {
    slug: "operations",
    name: "Για τη Λειτουργία σου",
    services: [
      {
        n: "05",
        title: "Προγράμματα",
        text: "Απόθεμα, πρόγραμμα και αναφορές πάντα σωστά και ενημερωμένα, αυτόματα.",
        who: "Για λειτουργίες που δεν έχουν περιθώριο για λάθη",
      },
      {
        n: "07",
        title: "Automations",
        text: "Συνδέουμε τα συστήματά σου ώστε τα δεδομένα να μετακινούνται μόνα τους, σωστά κάθε φορά.",
        who: "Για επιχειρήσεις που είναι έτοιμες να σταματήσουν την αγγαρεία",
      },
      {
        n: "08",
        title: "Έξυπνες Ψηφιακές Λύσεις",
        text: "Έχεις πρόβλημα εκτός κατηγορίας; Πες μας το και θα σχεδιάσουμε τη λύση.",
        who: "Για όποιον έχει ένα πρόβλημα που αξίζει να λυθεί",
      },
    ],
  },
];

const ideas = [
  { icon: UtensilsCrossed, text: "Ένα booking system για το εστιατόριό σου" },
  { icon: Boxes, text: "Ένα εργαλείο διαχείρισης αποθήκης" },
  { icon: Users, text: "Ένα custom CRM για την ομάδα πωλήσεων" },
  { icon: ShoppingBag, text: "Ένα online store για τα προϊόντα σου" },
  { icon: Smartphone, text: "Ένα mobile app για τους πελάτες σου" },
  { icon: Zap, text: "Έναν αυτοματισμό που σου εξοικονομεί ώρες κάθε εβδομάδα" },
];

export default function ServicesSection() {
  return (
    <section id="services" data-testid="services-section" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <Kicker>Υπηρεσίες</Kicker>
            <h2
              data-testid="services-headline"
              className="mt-3 font-display text-3xl md:text-5xl font-medium tracking-tight max-w-3xl"
            >
              <WordMask text="Αν υπάρχει σε μια οθόνη," className="block" />
              <WordMask text="μπορούμε να το χτίσουμε." accent={["χτίσουμε."]} delay={0.2} className="block" />
            </h2>
          </Reveal>

          <Reveal className="mt-10 md:mt-12">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-ink/50">
              Μερικά παραδείγματα
            </p>
          </Reveal>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" data-testid="ideas-grid">
            {ideas.map((idea, i) => (
              <Reveal key={idea.text} delay={0.05 * i}>
                <div
                  data-testid={`idea-card-${i}`}
                  className="group h-full rounded-xl border border-ink/8 bg-white p-3.5 flex items-center gap-3 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-baby/15 hover:border-baby/50"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-baby-light text-baby-dark transition-[background-color,color,transform] duration-500 group-hover:bg-baby group-hover:text-ink group-hover:-rotate-12">
                    <idea.icon className="h-4 w-4" />
                  </span>
                  <p className="font-display text-sm md:text-base font-medium tracking-tight leading-snug">
                    {idea.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 md:mt-12">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-ink/50">
              Η πλήρης λίστα — ομαδοποιημένη με βάση τι σημαίνει για εσένα
            </p>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-8 space-y-10" data-testid="services-categories">
              {categories.map((cat, ci) => (
                <div key={cat.slug} data-testid={`services-category-${cat.slug}`}>
                  <Reveal delay={0.05 * ci}>
                    <p className="text-sm font-display font-semibold text-baby-dark tracking-tight">
                      {cat.name}
                    </p>
                  </Reveal>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.services.map((s, i) => (
                      <Reveal key={s.n} delay={0.05 * i}>
                        <div
                          data-testid={`service-card-${s.n}`}
                          className="group h-full flex flex-col rounded-2xl border border-ink/8 bg-white p-5 md:p-6 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-baby/15 hover:border-baby/50"
                        >
                          <span className="font-display text-sm font-light text-baby-dark">{s.n}</span>
                          <h4 className="mt-2 font-display text-lg md:text-xl font-medium tracking-tight">
                            {s.title}
                          </h4>
                          <p className="mt-2 text-sm text-ink/60 leading-relaxed flex-1">{s.text}</p>
                          <p className="mt-3 text-xs font-semibold text-baby-dark/80 uppercase tracking-wide">
                            {s.who}
                          </p>
                          <Magnetic strength={0.2} className="mt-4 self-start">
                            <button
                              type="button"
                              onClick={() => scrollToId("#contact")}
                              data-testid={`service-lets-talk-${s.n}`}
                              className="group/btn inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-4 py-2 text-xs font-bold text-ink transition-[background-color,border-color,transform] duration-300 hover:scale-105 hover:bg-baby hover:border-baby"
                            >
                              Ας μιλήσουμε
                              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:rotate-45" />
                            </button>
                          </Magnetic>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-4">
              <Reveal delay={0.1} className="lg:sticky lg:top-28">
                <ServicesPhoneMockup />
              </Reveal>
            </div>
          </div>

          <Reveal className="mt-10 md:mt-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-[2rem] bg-baby-light border border-baby/40 px-6 md:px-10 py-7 md:py-9 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-baby/40 blur-3xl" />
              <div className="relative">
                <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tighter">
                  Δεν είσαι σίγουρος τι χρειάζεσαι;
                </h3>
                <p className="mt-2 text-sm text-ink/60 max-w-lg leading-relaxed">
                  Είναι φυσιολογικό. Πες μας το πρόβλημα — θα σου πούμε ειλικρινά
                  τι απαιτείται για να λυθεί.
                </p>
              </div>
              <Magnetic strength={0.25} className="relative shrink-0">
                <button
                  onClick={() => scrollToId("#contact")}
                  data-testid="services-cta-button"
                  className="btn-shine group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-transform duration-300 hover:scale-105"
                >
                  Ζήτησε Δωρεάν Προσφορά
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
    </section>
  );
}
