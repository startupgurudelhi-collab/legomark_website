/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InputHTMLAttributes, forwardRef, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, id: customId, type = "text", ...props }, ref) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          <input
            id={id}
            type={type}
            ref={ref}
            className={`
              block w-full rounded-lg border px-3.5 py-2.5 text-sm font-sans text-slate-900 transition-colors
              placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0
              ${
                error
                  ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-300 focus:border-brand-primary-500 focus:ring-brand-primary-100"
              }
              disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
              ${className}
            `}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-red-600 font-sans">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 font-sans">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
