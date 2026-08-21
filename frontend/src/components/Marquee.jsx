import Marquee from "react-fast-marquee";
import { Asterisk } from "lucide-react";

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
  return (
    <div
      data-testid="services-marquee"
      className="bg-paper py-6 md:py-8 overflow-hidden"
    >
      <Marquee speed={32} gradient={false} pauseOnHover>
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
