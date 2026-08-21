import { useEffect } from "react";
import "@/App.css";
import Lenis from "lenis";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import EditorialMarquee from "@/components/Marquee";
import { StackedPanels } from "@/components/StackSection";
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
      <Cursor />
      <Navbar />
      <main>
        {/* Hero + the three sections directly below share ONE continuous
            blue-tinted background so all four flow together with no seams. */}
        <div className="relative bg-paper">
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-baby/25 blur-2xl" />
            <div className="absolute top-[28%] -left-40 h-[26rem] w-[26rem] rounded-full bg-baby/15 blur-3xl" />
            <div className="absolute top-[60%] -right-44 h-[26rem] w-[26rem] rounded-full bg-baby/15 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-baby/20 blur-2xl" />
          </div>
          <div className="relative">
            <StackedPanels>
              <Hero />
              <ScrollReveal>
                <ProblemSolutionSection />
              </ScrollReveal>
            </StackedPanels>
            <EditorialMarquee />
            <ScrollReveal>
              <ServicesSection />
            </ScrollReveal>
          </div>
        </div>
        <HowItWorksSection />
        <ScrollReveal>
          <PortfolioSection />
        </ScrollReveal>
        <ScrollReveal>
          <ContactSection />
        </ScrollReveal>
        <ScrollReveal>
          <FaqSection />
        </ScrollReveal>
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
