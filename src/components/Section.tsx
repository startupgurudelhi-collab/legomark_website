/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HTMLAttributes, forwardRef } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: "default" | "muted" | "dark" | "brand";
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className = "", background = "default", ...props }, ref) => {
    const backgrounds = {
      default: "bg-transparent",
      muted: "bg-slate-50/50 border-y border-slate-100",
      dark: "bg-slate-900 text-white",
      brand: "bg-brand-primary-950 text-white",
    };

    return (
      <section
        ref={ref}
        className={`py-12 md:py-20 lg:py-24 ${backgrounds[background]} ${className}`}
        {...props}
      />
    );
  }
);

Section.displayName = "Section";
