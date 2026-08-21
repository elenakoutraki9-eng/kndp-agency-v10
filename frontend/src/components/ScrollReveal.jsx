import useInViewOnce from "@/hooks/useInViewOnce";

/**
 * Wraps a section and gives it a subtle scroll-triggered entrance:
 * fade in + slide up (opacity 0 -> 1, translateY 30px -> 0) over ~0.6s,
 * ease-out, animating only once. Powered by the IntersectionObserver API.
 * Child elements keep their own staggered reveals (Reveal / WordMask),
 * so headings, text and images still appear one after another.
 */
export default function ScrollReveal({ children, className = "", as: Tag = "div" }) {
  const [ref, inView] = useInViewOnce();
  return (
    <Tag
      ref={ref}
      className={`reveal-section ${inView ? "is-visible" : ""} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
