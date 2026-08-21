import { Children } from "react";

// Stacked/sticky panel animations have been removed site-wide.
// These components now render their children as plain, non-sticky sections
// so the whole page scrolls naturally with no scale/dim/stacking effect.

export const StackedPanels = ({ children, className = "" }) => (
  <div data-testid="stacked-panels" className={`relative ${className}`}>
    {Children.map(children, (child) => child)}
  </div>
);

export const StackPanel = ({ children, className = "", innerClassName = "" }) => (
  <div className={className}>
    <div className={`relative ${innerClassName}`}>{children}</div>
  </div>
);
