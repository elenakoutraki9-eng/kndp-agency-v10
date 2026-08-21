import { useEffect, useRef, useState } from "react";

/**
 * Fires once when the element first enters the viewport, using the
 * native IntersectionObserver API (no external libraries).
 * Returns [ref, inView].
 */
export default function useInViewOnce({
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    // SSR / unsupported fallback: show immediately.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, inView]);

  return [ref, inView];
}
