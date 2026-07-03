/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HTMLAttributes, forwardRef } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  clean?: boolean;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className = "", clean = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full mx-auto ${clean ? "" : "max-w-7xl px-4 sm:px-6 lg:px-8"} ${className}`}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";
