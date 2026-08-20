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

export default function Landing() {
  useEffect(() => {
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
  }, []);

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
