/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Command, ArrowRight } from "lucide-react";
import { websiteConfig } from "../config/websiteConfig.js";
import { getEffectiveServices } from "../data/servicesData.js";
import { getEffectiveCategories, getEffectiveSubcategories } from "../data/categoriesData.js";

interface SearchComponentProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
}

export function SearchComponent({ isOpen, onClose, id = "global-search" }: SearchComponentProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input when search overlay is opened
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Flatten config links to display "Suggested Searches" or match queries purely in UI for visual demonstration
  const configLinks = websiteConfig.navigation.flatMap((navItem) =>
    navItem.megaMenu
      ? navItem.megaMenu.flatMap((col) => col.links)
      : []
  );

  const services = getEffectiveServices();
  const categories = getEffectiveCategories();
  const subcategories = getEffectiveSubcategories();

  const dynamicSearchLinks = services.map((service) => {
    const cat = categories.find(c => c.id === service.categoryId) || 
                 categories.find(c => c.urlSlug === service.categorySlug) ||
                 { id: "", urlSlug: service.categorySlug || "services" };
                 
    const sub = subcategories.find(sub => sub.id === service.subcategoryId) ||
                 subcategories.find(sub => sub.parentCategoryId === cat.id) ||
                 { id: "", urlSlug: "general" };
                 
    return {
      label: service.serviceName,
      href: `/${cat.urlSlug}/${sub.urlSlug}/${service.urlSlug}`,
      description: service.shortDescription
    };
  });

  // Merge results, removing duplicate items based on label or href matching
  const allSubLinks = [...dynamicSearchLinks, ...configLinks].filter((link, idx, self) =>
    self.findIndex((l) => l.label.toLowerCase() === link.label.toLowerCase() || l.href === link.href) === idx
  );

  const filteredLinks = query.trim() === ""
    ? []
    : allSubLinks.filter((link) =>
        link.label.toLowerCase().includes(query.toLowerCase()) ||
        (link.description && link.description.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-900/40 backdrop-blur-sm p-4 md:p-10 justify-start pt-16 md:pt-24"
      id={id}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        id={`${id}-container`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-4 border-b border-slate-200 gap-3">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for company incorporation, tax compliance, trademarks..."
            className="flex-1 text-sm md:text-base outline-none text-slate-800 placeholder-slate-400 bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            id={`${id}-input`}
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
            <Command className="h-2.5 w-2.5" />
            <span>ESC</span>
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            id={`${id}-close`}
            title="Close Search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 max-h-[60vh] overflow-y-auto p-6 space-y-6">
          {query.trim() === "" ? (
            /* Recommendations when search is empty */
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Popular Queries
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "Private Limited Company",
                    "GST Registration",
                    "Trademark Application",
                    "FSSAI License",
                    "Annual Filing",
                  ].map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => setQuery(keyword)}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 hover:bg-brand-primary-50 text-slate-600 hover:text-brand-primary-950 border border-slate-200/60 hover:border-brand-primary-200 transition-all"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Search Architecture Notice
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  This component is wired as a reusable frontend architecture. Future search endpoints, indexing, or autocomplete logic will plug directly into this filtered list schema.
                </p>
              </div>
            </div>
          ) : (
            /* Results listing */
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Matching Services ({filteredLinks.length})
                </h3>
                <span className="text-[10px] font-mono text-slate-400">DEMO SEARCH UI</span>
              </div>

              {filteredLinks.length > 0 ? (
                <div className="mt-3 divide-y divide-slate-100">
                  {filteredLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.href}
                      onClick={() => {
                        onClose();
                      }}
                      className="flex items-start py-3 px-2 rounded-lg hover:bg-slate-50 group transition-colors gap-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-primary-950">
                          {link.label}
                        </p>
                        {link.description && (
                          <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                            {link.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-secondary-500 transition-colors shrink-0 align-self-center mt-1" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-8 text-center py-6">
                  <p className="text-sm text-slate-500">
                    No matching services found for &ldquo;<span className="font-semibold text-slate-700">{query}</span>&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try searching for wider terms such as &ldquo;Company&rdquo; or &ldquo;Tax&rdquo;.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer info bar */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Esc to exit</span>
          <span className="font-mono text-[10px] text-brand-primary-500">LEGM_SRCH_v1.0</span>
        </div>
      </div>
    </div>
  );
}
