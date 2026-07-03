/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { ToastMessage } from "../types/index.js";

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const { id, type, title, message, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const styles = {
    success: {
      bg: "bg-white border-green-200",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      text: "text-green-800",
    },
    error: {
      bg: "bg-white border-red-200",
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      text: "text-red-800",
    },
    warning: {
      bg: "bg-white border-amber-200",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      text: "text-amber-800",
    },
    info: {
      bg: "bg-white border-blue-200",
      icon: <Info className="h-5 w-5 text-blue-500" />,
      text: "text-blue-800",
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex items-start gap-3 w-full max-w-sm rounded-xl border p-4 shadow-xl pointer-events-auto ${currentStyle.bg}`}
    >
      <div className="flex-shrink-0 mt-0.5">{currentStyle.icon}</div>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-xs font-bold font-sans text-slate-800 leading-snug">
            {title}
          </h4>
        )}
        <p className="text-xs text-slate-600 font-sans leading-normal mt-0.5">
          {message}
        </p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
}
