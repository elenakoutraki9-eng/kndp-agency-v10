import { useEffect, useRef } from "react";

// The blue dot from the KNDP logo, turned into a scroll-driven "journey" element.
// It starts next to the logo (top-left) and, as the user scrolls, smoothly travels
// to each accent dot / marker across the page sections in order — the three window
// dots in the hero, then each section's Kicker accent dot — merging onto each one
// when that section reaches the reading zone. Movement is tied to scroll position
// (not time): the TARGET is derived purely from scrollY, and a light per-frame
// smoothing gives it a fluid, living feel while settling (no idle drift) when the
// user stops. Purely decorative: aria-hidden + pointer-events-none so it can never
// intercept clicks/touch on desktop or mobile.

// Waypoints, in the order the dot should visit them (matches section order).
const ORDER = ["hero", "portfolio", "services", "problems", "howitworks", "faq", "contact"];

// Fraction of the viewport height where a waypoint is considered "arrived at".
const ARRIVE_FRAC = 0.42;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t); // smoothstep for the intro segment

export default function ScrollCompanion() {
  const dotRef = useRef(null);
  const rafRef = useRef(0);
  // Rendered (smoothed) position in viewport px. null until first frame.
  const pos = useRef({ x: null, y: null });

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const centerOf = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    const computeTarget = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || 1;
      const arriveY = vh * ARRIVE_FRAC;
      const minGap = vh * 0.12; // keep waypoints from bunching / staying monotonic

      // Waypoint 0 = the logo dot (top-left, position:fixed). It anchors the very
      // start of the journey at scroll 0. Because it's fixed, its viewport position
      // is constant regardless of scroll, so we store it as a fixed point.
      const logoEl = document.querySelector('[data-scroll-waypoint="logo-start"]');
      const logo = logoEl ? centerOf(logoEl) : { x: 44, y: 44 };

      const pts = [
        { x: logo.x, fixedY: logo.y, anchor: 0 },
      ];

      // Subsequent waypoints: each section's accent dot. Their arrival scroll is
      // when the marker crosses the reading line; clamped so it always comes after
      // the previous one (monotonic) with a minimum travel gap.
      for (const key of ORDER) {
        const el = document.querySelector(`[data-scroll-waypoint="${key}"]`);
        if (!el) continue;
        const c = centerOf(el);
        const docY = scrollY + c.y; // scroll-invariant absolute doc Y
        const natural = docY - arriveY;
        const prev = pts[pts.length - 1].anchor;
        const anchor = Math.max(natural, prev + minGap);
        pts.push({ x: c.x, docY, anchor });
      }
      if (pts.length < 2) return { x: logo.x, y: logo.y };

      // Viewport Y of a waypoint right now.
      const yOf = (p, s) => (p.fixedY !== undefined ? p.fixedY : p.docY - s);

      // Find the segment [i, i+1] the current scroll falls into.
      let i = pts.length - 1;
      for (let k = 0; k < pts.length - 1; k++) {
        if (scrollY >= pts[k].anchor && scrollY < pts[k + 1].anchor) {
          i = k;
          break;
        }
      }

      // Past the last waypoint — rest on it (follows it as it scrolls).
      if (i === pts.length - 1) {
        const last = pts[i];
        return { x: last.x, y: yOf(last, scrollY) };
      }

      const a = pts[i];
      const b = pts[i + 1];
      const raw = clamp((scrollY - a.anchor) / (b.anchor - a.anchor), 0, 1);
      // Ease the first (logo -> hero) leg for a graceful launch.
      const t = i === 0 ? smooth(raw) : raw;
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(yOf(a, scrollY), yOf(b, scrollY), t),
      };
    };

    const tick = () => {
      const target = computeTarget();
      const dot = dotRef.current;
      if (target && dot) {
        if (pos.current.x === null) {
          // Initialise directly on target to avoid a fly-in from the corner.
          pos.current.x = target.x;
          pos.current.y = target.y;
        } else {
          const ease = prefersReduced ? 1 : 0.14;
          pos.current.x += (target.x - pos.current.x) * ease;
          pos.current.y += (target.y - pos.current.y) * ease;
        }
        dot.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      aria-hidden="true"
      data-testid="scroll-companion-dot"
      className="fixed left-0 top-0 z-40 pointer-events-none"
    >
      <div ref={dotRef} className="relative h-3 w-3 md:h-3.5 md:w-3.5 will-change-transform">
        <span className="absolute -inset-2 rounded-full bg-baby/30 blur-md scroll-companion-pulse" />
        <span className="absolute inset-0 rounded-full bg-baby shadow-[0_0_12px_rgba(137,207,240,0.75)]" />
      </div>
    </div>
  );
}
