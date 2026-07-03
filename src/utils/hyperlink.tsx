/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { ServiceData, Category, Subcategory } from "../types/service.js";

/**
 * Automatically scans text to find exact matches of other Published Service titles
 * and converts them into internal React Router Links.
 */
export function autoHyperlinkText(
  text: string,
  currentServiceId: string,
  services: ServiceData[],
  categories: Category[],
  subcategories: Subcategory[]
): React.ReactNode {
  if (!text) return "";

  // Only scan for other Published Services
  const otherServices = services.filter(
    (s) => s.draftStatus === "Published" && s.id !== currentServiceId
  );

  if (otherServices.length === 0) return text;

  // Sort other services by name length in descending order to match longest phrases first
  const sortedServices = [...otherServices].sort(
    (a, b) => b.serviceName.length - a.serviceName.length
  );

  // Initial part list: just the input text
  let parts: (string | React.ReactElement)[] = [text];

  for (const service of sortedServices) {
    const term = service.serviceName;
    const nextParts: (string | React.ReactElement)[] = [];

    // Find URLs
    const cat = categories.find((c) => c.id === service.categoryId) ||
      categories.find((c) => c.urlSlug === service.categorySlug) || {
        id: "",
        urlSlug: service.categorySlug || "uncategorized",
      };
    const sub = subcategories.find((s) => s.id === service.subcategoryId) ||
      subcategories.find((s) => s.parentCategoryId === cat.id) || {
        id: "",
        urlSlug: "general",
      };
    
    const serviceUrl = `/${cat.urlSlug}/${sub.urlSlug}/${service.urlSlug}`;

    for (const part of parts) {
      if (typeof part !== "string") {
        nextParts.push(part);
        continue;
      }

      // Escape special characters for regex safety
      const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`\\b(${escapedTerm})\\b`, "g");

      const splitText = part.split(regex);
      if (splitText.length === 1) {
        nextParts.push(part);
      } else {
        for (let i = 0; i < splitText.length; i++) {
          if (i % 2 === 1) {
            nextParts.push(
              <Link
                key={`${service.id}-${i}-${Math.random()}`}
                to={serviceUrl}
                className="text-brand-secondary-600 hover:text-brand-secondary-700 hover:underline font-semibold"
              >
                {splitText[i]}
              </Link>
            );
          } else {
            if (splitText[i]) {
              nextParts.push(splitText[i]);
            }
          }
        }
      }
    }
    parts = nextParts;
  }

  return <>{parts}</>;
}
