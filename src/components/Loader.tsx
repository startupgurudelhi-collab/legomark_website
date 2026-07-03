/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { useBrandMedia } from "../hooks/useBrandMedia.js";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "skeleton" | "fullscreen";
}

export function Loader({ size = "md", variant = "spinner" }: LoaderProps) {
  const { config: brandConfig } = useBrandMedia();
  const sizes = {
    sm: "h-4 w-4 stroke-[3]",
    md: "h-8 w-8 stroke-[2]",
    lg: "h-12 w-12 stroke-[2]",
  };

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-50">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-4"
        >
          {/* Official Brand Logo */}
          <div className="h-20 w-20 bg-white rounded-xl flex items-center justify-center shadow-lg p-1.5 border border-slate-100">
            <img
              key={brandConfig.logo.url}
              src={brandConfig.logo.url || "/logo.png"}
              alt="Legomark India Logo"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallback) {
                  target.dataset.fallback = "true";
                  target.src = "/logo.png";
                }
              }}
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 font-sans animate-pulse">
            Legomark India
          </p>
        </motion.div>
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className="animate-pulse space-y-3 w-full">
        <div className="h-4 bg-slate-200 rounded-md w-2/3" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded-md" />
          <div className="h-3 bg-slate-200 rounded-md w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <svg
        className={`animate-spin text-brand-primary-950 ${sizes[size]}`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}
