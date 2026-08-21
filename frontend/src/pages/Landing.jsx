import { useEffect, useState } from "react";
import "@/App.css";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import IntroOverlay from "@/components/IntroOverlay";
import EditorialMarquee from "@/components/Marquee";
import ScrollReveal from "@/components/ScrollReveal";
import Hero from "@/sections/Hero";
import ProblemSolutionSection from "@/sections/ProblemSolutionSection";
import ServicesSection from "@/sections/ServicesSection";
import HowItWorksSection from "@/sections/HowItWorksSection";
import PortfolioSection from "@/sections/PortfolioSection";
import FaqSection from "@/sections/FaqSection";
import ContactSection from "@/sections/ContactSection";
import { setLenis } from "@/lib/scroll";
import useIsMobile from "@/hooks/useIsMobile";

export default function Landing() {
  const isMobile = useIsMobile();
  const [introDone, setIntroDone] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("kndp_intro_seen") === "1"
  );

  useEffect(() => {
    // On mobile, use native (instant) scrolling — no smooth-scroll inertia.
    if (isMobile) {
      setLenis(null);
      return;
    }
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    setLenis(lenis);
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      setLenis(null);
      lenis.destroy();
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <AnimatePresence>
        {!introDone && (
          <IntroOverlay
            key="intro"
            onComplete={() => {
              sessionStorage.setItem("kndp_intro_seen", "1");
              setIntroDone(true);
            }}
          />
        )}
      </AnimatePresence>
      <Cursor />
      <Navbar />
      <main>
        {/* Hero (+ partners marquee) keeps its blue-tinted backdrop */}
        <div className="relative bg-paper">
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-baby/25 blur-2xl" />
            <div className="absolute top-[38%] -left-40 h-[26rem] w-[26rem] rounded-full bg-baby/15 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-baby/20 blur-2xl" />
          </div>
          <div className="relative">
            <Hero />
            <EditorialMarquee />
          </div>
        </div>

        <ScrollReveal>
          <PortfolioSection />
        </ScrollReveal>
        <ScrollReveal>
          <ServicesSection />
        </ScrollReveal>
        <ScrollReveal>
          <ProblemSolutionSection />
        </ScrollReveal>
        <HowItWorksSection />
        <ScrollReveal>
          <FaqSection />
        </ScrollReveal>
        <ScrollReveal>
          <ContactSection />
        </ScrollReveal>
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
