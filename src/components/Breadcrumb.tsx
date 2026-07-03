/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  id?: string;
}

export function Breadcrumb({ items, id = "breadcrumb" }: BreadcrumbProps) {
  const location = useLocation();

  // If no items are explicitly passed, generate from current location pathname
  const breadcrumbItems = items || (() => {
    const paths = location.pathname.split("/").filter(Boolean);
    const generatedItems: BreadcrumbItem[] = [];

    let currentPath = "";
    paths.forEach((pathSegment) => {
      currentPath += `/${pathSegment}`;
      // Clean up segment name (e.g. company-registration -> Company Registration)
      const label = pathSegment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      generatedItems.push({
        label,
        href: currentPath,
      });
    });

    return generatedItems;
  })();

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 md:px-6 bg-slate-100/50 border-b border-slate-200/60" id={id}>
      <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs md:text-sm font-medium text-slate-500">
        <Link
          to="/"
          className="flex items-center gap-1 text-slate-600 hover:text-brand-secondary-500 transition-colors"
          id={`${id}-home-link`}
        >
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Link>

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
              {isLast || !item.href ? (
                <span className="text-slate-900 font-semibold" id={`${id}-item-${index}-active`}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-slate-600 hover:text-brand-secondary-500 transition-colors"
                  id={`${id}-item-${index}-link`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
