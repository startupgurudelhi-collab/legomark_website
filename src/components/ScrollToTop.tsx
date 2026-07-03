/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

/**
 * Component that resets scroll position to top on route change.
 * Mount this at the root layout or routes level.
 */
export function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

/**
 * Floating "Scroll to Top" button that appears after scrolling down.
 */
export function ScrollToTopButton({ id = "scroll-to-top-btn" }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-brand-primary-950 text-white shadow-lg border border-brand-primary-800 hover:bg-brand-secondary-500 hover:border-brand-secondary-500 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-secondary-500 hover:scale-105"
      id={id}
      aria-label="Scroll to top"
      title="Scroll to Top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
