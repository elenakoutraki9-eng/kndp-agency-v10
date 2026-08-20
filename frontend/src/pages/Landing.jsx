import { useEffect } from "react";
import "@/App.css";
import Lenis from "lenis";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import EditorialMarquee from "@/components/Marquee";
import { StackedPanels } from "@/components/StackSection";
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
        <StackedPanels>
          <Hero />
          <ProblemSolutionSection />
        </StackedPanels>
        <EditorialMarquee />
        <ServicesSection />
        <HowItWorksSection />
        <PortfolioSection />
        <ContactSection />
        <FaqSection />
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
