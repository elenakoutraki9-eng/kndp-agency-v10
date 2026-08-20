import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const imageVariants = {
  enter: (dir) => ({ x: dir > 0 ? "55%" : "-55%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? "-45%" : "45%", opacity: 0 }),
};

const detailVariants = {
  enter: { opacity: 0, y: 18 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
};

export default function ProjectCarousel({ projects }) {
  const [[index, direction], setState] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const total = projects.length;
  const active = projects[index];

  const paginate = useCallback(
    (dir) => setState(([i]) => [(i + dir + total) % total, dir]),
    [total]
  );

  const goTo = useCallback(
    (next) => setState(([i]) => [next, next > i ? 1 : -1]),
    []
  );

  // Gentle autoplay that pauses on hover / drag / touch.
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) paginate(1);
    }, 5200);
    return () => clearInterval(id);
  }, [paginate]);

  const handleDragEnd = (_e, info) => {
    const power = info.offset.x + info.velocity.x * 0.25;
    if (power < -70) paginate(1);
    else if (power > 70) paginate(-1);
  };

  return (
    <div
      data-testid="portfolio-carousel"
      className="mt-6 md:mt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch max-w-5xl mx-auto">
        {/* Image stage */}
        <div className="lg:col-span-7 order-1">
          <motion.div
            data-testid="portfolio-carousel-track"
            className="group relative rounded-[1.5rem] overflow-hidden bg-ink/5 shadow-xl shadow-ink/15 aspect-[16/9] cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragStart={() => setPaused(true)}
            onDragEnd={handleDragEnd}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={active.title}
                data-testid={`portfolio-card-${index}`}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 220, damping: 30 },
                  opacity: { duration: 0.45, ease: EASE },
                }}
                className="absolute inset-0"
              >
                {/* Ken Burns zoom */}
                <motion.img
                  src={active.img}
                  alt={active.title}
                  draggable={false}
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 6.5, ease: "linear" }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />

                <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/85 backdrop-blur px-3.5 py-1.5 text-xs font-bold text-ink/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-baby-dark animate-pulse" />
                  Σε εξέλιξη
                </span>
                <span className="absolute top-5 right-5 inline-flex rounded-full bg-ink/70 backdrop-blur px-3.5 py-1.5 text-xs font-bold text-white">
                  {active.tag}
                </span>

                {/* Title overlay on the image for mobile-friendly context */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 lg:hidden">
                  <h3 className="font-display text-2xl font-medium tracking-tight text-white">
                    {active.title}
                  </h3>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Arrows over the image */}
            <button
              type="button"
              onClick={() => paginate(-1)}
              data-testid="portfolio-carousel-prev"
              aria-label="Προηγούμενο έργο"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur border border-white/60 shadow-lg text-ink transition-[background-color,transform,opacity] duration-300 hover:bg-baby hover:scale-105 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              data-testid="portfolio-carousel-next"
              aria-label="Επόμενο έργο"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur border border-white/60 shadow-lg text-ink transition-[background-color,transform,opacity] duration-300 hover:bg-baby hover:scale-105 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>

        {/* Editorial detail panel */}
        <div className="lg:col-span-5 order-2 flex">
          <div className="relative w-full rounded-[1.5rem] border border-ink/8 bg-white p-4 md:p-5 flex flex-col overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-baby/25 blur-3xl" />

            <div className="relative flex items-center justify-between">
              <span className="font-display text-3xl md:text-4xl font-light leading-none text-baby-dark">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold text-ink/40">
                / {String(total).padStart(2, "0")}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.title}
                variants={detailVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: EASE }}
                className="relative mt-3 flex-1"
              >
                <span className="inline-flex rounded-full bg-baby-light border border-baby/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-baby-dark">
                  {active.tag}
                </span>
                <h3 className="mt-2.5 font-display text-lg md:text-xl font-medium tracking-tight leading-tight">
                  {active.title}
                </h3>
                <p className="mt-2 text-xs md:text-sm leading-relaxed text-ink/60">
                  {active.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress segments */}
            <div
              data-testid="portfolio-carousel-dots"
              className="relative mt-4 flex items-center gap-1.5"
            >
              {projects.map((p, i) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => goTo(i)}
                  data-testid={`portfolio-dot-${i}`}
                  aria-label={`Μετάβαση στο έργο ${i + 1}`}
                  className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10"
                >
                  <motion.span
                    className="absolute inset-0 rounded-full bg-baby-dark origin-left"
                    initial={false}
                    animate={{ scaleX: i === index ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </button>
              ))}
            </div>

            <div className="relative mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => paginate(-1)}
                  aria-label="Προηγούμενο"
                  className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 text-ink transition-[background-color,border-color,transform] duration-300 hover:bg-ink hover:text-white hover:scale-105"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={() => paginate(1)}
                  aria-label="Επόμενο"
                  className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 text-ink transition-[background-color,border-color,transform] duration-300 hover:bg-ink hover:text-white hover:scale-105"
                >
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-baby text-ink">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail filmstrip */}
      <div className="mt-3 flex justify-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        {projects.map((p, i) => (
          <button
            key={p.title}
            type="button"
            onClick={() => goTo(i)}
            aria-label={p.title}
            className={`relative shrink-0 h-10 w-16 md:h-11 md:w-20 rounded-lg overflow-hidden transition-[transform,box-shadow] duration-300 ${
              i === index
                ? "ring-2 ring-baby-dark ring-offset-2 ring-offset-mist scale-100"
                : "opacity-60 hover:opacity-100 hover:scale-[1.03]"
            }`}
          >
            <img
              src={p.img}
              alt={p.title}
              draggable={false}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            {i !== index && <div className="absolute inset-0 bg-ink/20" />}
          </button>
        ))}
      </div>
    </div>
  );
}
