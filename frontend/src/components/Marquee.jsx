import Marquee from "react-fast-marquee";
import { Asterisk } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";

const items = [
  "Websites",
  "Web Apps",
  "Mobile Apps",
  "Έξυπνα Εργαλεία",
  "Automations",
  "Web Tools",
  "Προγράμματα",
  "Ψηφιακές Λύσεις",
];

export default function EditorialMarquee() {
  const isMobile = useIsMobile();
  return (
    <div
      data-testid="services-marquee"
      className="bg-baby-light border-y border-baby/30 py-6 md:py-8 overflow-hidden"
    >
      <Marquee speed={32} gradient={false} pauseOnHover play={!isMobile}>
        {items.map((item) => (
          <span key={item} className="flex items-center">
            <span className="font-display text-2xl md:text-4xl font-medium tracking-tight text-ink px-10 md:px-16">
              {item}
            </span>
            <Asterisk className="h-6 w-6 md:h-8 md:w-8 text-baby-dark" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
