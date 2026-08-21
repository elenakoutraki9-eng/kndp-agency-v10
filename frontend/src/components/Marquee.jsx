import Marquee from "react-fast-marquee";

const brands = [
  "Glovo",
  "Gorillas",
  "Swappie",
  "Zettle",
  "Frichti",
  "Jow",
  "Doctolib",
  "Qonto",
  "Alma",
  "Pennylane",
];

export default function EditorialMarquee() {
  return (
    <div data-testid="services-marquee" className="py-8 md:py-10 overflow-hidden">
      <p className="mb-5 md:mb-6 text-center text-xs uppercase tracking-[0.3em] font-semibold text-ink/40">
        Έχουμε συνεργαστεί με κορυφαίες ομάδες
      </p>
      <Marquee speed={32} gradient={false} pauseOnHover>
        {brands.map((brand) => (
          <span key={brand} className="flex items-center">
            <span className="font-display text-2xl md:text-4xl font-semibold tracking-tight text-ink/50 px-8 md:px-14 transition-colors duration-300 hover:text-ink">
              {brand}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-baby-dark/50" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
