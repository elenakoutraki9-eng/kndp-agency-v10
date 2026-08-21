import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { scrollToId } from "@/lib/scroll";

const links = [
  { id: "#hero", label: "Αρχική", testid: "nav-link-home" },
  { id: "#portfolio", label: "Έργα", testid: "nav-link-portfolio" },
  { id: "#services", label: "Υπηρεσίες", testid: "nav-link-services" },
  { id: "#contact", label: "Επικοινωνία", testid: "nav-link-contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }),
      { rootMargin: "-35% 0px -55% 0px" }
    );
    links.forEach((l) => {
      const el = document.querySelector(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id) => {
    setOpen(false);
    setActive(id);
    scrollToId(id);
  };

  return (
    <header
      data-testid="site-navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/40"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">
        <button
          onClick={() => go("#hero")}
          data-testid="nav-logo"
          className="font-display font-bold text-2xl tracking-tighter flex items-center gap-1"
        >
          KNDP
          <span data-scroll-waypoint="logo-start" className="h-2.5 w-2.5 rounded-full bg-baby translate-y-1" />
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              data-testid={l.testid}
              className={`nav-underline relative text-sm font-semibold transition-colors duration-300 hover:text-ink ${
                active === l.id ? "text-ink" : "text-ink/50"
              }`}
            >
              {l.label}
              {active === l.id && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-baby"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => go("#contact")}
            data-testid="nav-cta-button"
            className="btn-shine hidden md:inline-flex items-center gap-1.5 rounded-full bg-baby px-5 py-2.5 text-sm font-bold text-ink transition-[transform,background-color] duration-300 hover:scale-105 hover:bg-baby-dark"
          >
            Ζήτησε Δωρεάν Προσφορά
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <button
            data-testid="mobile-menu-button"
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white"
            aria-label="Εναλλαγή μενού"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            data-testid="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute left-0 right-0 top-full bg-white/95 backdrop-blur-md border-b border-ink/5 shadow-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <button
                    onClick={() => go(l.id)}
                    data-testid={`mobile-${l.testid}`}
                    className={`block py-3 font-display text-2xl font-medium tracking-tight text-left w-full ${
                      active === l.id ? "text-baby-dark" : "text-ink"
                    }`}
                  >
                    {l.label}
                  </button>
                </motion.div>
              ))}
              <button
                onClick={() => go("#contact")}
                data-testid="mobile-nav-cta-button"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-baby px-6 py-3.5 font-bold text-ink"
              >
                Ζήτησε Δωρεάν Προσφορά
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
