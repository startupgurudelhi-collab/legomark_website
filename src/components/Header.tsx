/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Phone, ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import { websiteConfig, NavigationItem } from "../config/websiteConfig.js";
import { SearchComponent } from "./SearchComponent.js";
import { Button } from "./Button.js";
import { useBrandMedia } from "../hooks/useBrandMedia.js";
import { useBooking } from "../hooks/useBooking.js";
import { getEffectiveServices } from "../data/servicesData.js";
import { getEffectiveCategories, getEffectiveSubcategories } from "../data/categoriesData.js";

interface HeaderProps {
  id?: string;
}

export function Header({ id = "main-header" }: HeaderProps) {
  const { config: brandConfig } = useBrandMedia();
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileExpandedIndices, setMobileExpandedIndices] = useState<Record<number, boolean>>({});

  const location = useLocation();
  const navigate = useNavigate();
  const { handleBookConsultation } = useBooking();

  // Scroll handler for sticky header decoration (shadow & size)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
  }, [location]);

  // Toggle mobile accordion
  const toggleMobileSubmenu = (idx: number) => {
    setMobileExpandedIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const categories = useMemo(() => getEffectiveCategories(), []);
  const subcategories = useMemo(() => getEffectiveSubcategories(), []);
  const services = useMemo(() => getEffectiveServices(), []);

  const dynamicNavItems = useMemo(() => {
    // 1. Get active categories, sorted by displayOrder
    const activeCats = categories
      .filter((c) => c.activeStatus)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    // 2. Map categories to NavigationItem
    const items: NavigationItem[] = activeCats.map((cat) => {
      // Find active subcategories for this category, sorted by displayOrder
      const catSubcats = subcategories
        .filter((sub) => sub.parentCategoryId === cat.id && sub.activeStatus)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      const megaMenuColumns = catSubcats
        .map((sub) => {
          // Find published services for this subcategory, sorted by displayOrder
          const subServices = services
            .filter(
              (s) =>
                s.draftStatus === "Published" &&
                (s.subcategoryId === sub.id || s.subcategory === sub.subcategoryName)
            )
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

          if (subServices.length === 0) return null;

          return {
            title: sub.subcategoryName,
            links: subServices.map((srv) => ({
              label: srv.serviceName,
              href: `/${cat.urlSlug}/${sub.urlSlug}/${srv.urlSlug}`,
              description: srv.shortDescription || "",
            })),
          };
        })
        .filter(Boolean) as any[];

      return {
        label: cat.categoryName,
        href: megaMenuColumns.length > 0 && megaMenuColumns[0].links.length > 0 
          ? megaMenuColumns[0].links[0].href 
          : `/services`,
        megaMenu: megaMenuColumns.length > 0 ? megaMenuColumns : undefined,
      };
    });

    // 3. Append static items at the end
    items.push({
      label: "About Us",
      href: "/about",
    });

    items.push({
      label: "Sitemap",
      href: "/sitemap",
    });

    return items;
  }, [categories, subcategories, services]);

  const navItems = dynamicNavItems;
  const { phone } = websiteConfig.topBar;

  return (
    <>
      <header
        id={id}
        className={`w-full z-40 transition-all duration-200 ${
          isSticky
            ? "sticky top-0 bg-white shadow-md border-b border-slate-200 py-2.5"
            : "relative bg-white border-b border-slate-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Official Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group shrink-0"
              id={`${id}-logo-container`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-0.5 border border-slate-150 shadow-sm transition-transform group-hover:scale-105">
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
              <div>
                <span className="font-display font-bold text-lg md:text-xl tracking-tight text-brand-primary-950 group-hover:text-brand-secondary-600 transition-colors">
                  LEGOMARK
                </span>
                <span className="font-sans text-[10px] block tracking-widest text-slate-400 -mt-1 font-bold uppercase">
                  India
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1" id={`${id}-nav-desktop`}>
              {navItems.map((item: NavigationItem, idx: number) => {
                const hasMega = item.megaMenu && item.megaMenu.length > 0;
                return (
                  <div
                    key={idx}
                    className="relative group"
                    onMouseEnter={() => hasMega && setActiveMegaMenu(idx)}
                    onMouseLeave={() => hasMega && setActiveMegaMenu(null)}
                  >
                    {hasMega ? (
                      <button
                        className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-brand-secondary-500 rounded-md ${
                          activeMegaMenu === idx ? "text-brand-secondary-500 bg-slate-50" : "text-slate-700"
                        }`}
                        id={`${id}-navitem-${idx}`}
                        aria-expanded={activeMegaMenu === idx}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-hover:rotate-180" />
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-secondary-500 transition-colors rounded-md hover:bg-slate-50"
                        id={`${id}-navitem-${idx}`}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Desktop Mega Menu Dropdown */}
                    {hasMega && activeMegaMenu === idx && (
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 ${
                          item.megaMenu && item.megaMenu.length > 2 ? "w-[900px]" : "w-[680px]"
                        }`}
                        id={`${id}-megamenu-${idx}`}
                      >
                        <div 
                          className="bg-white rounded-xl shadow-xl border border-slate-200/80 p-6 grid gap-8"
                          style={{ gridTemplateColumns: `repeat(${item.megaMenu?.length || 1}, minmax(0, 1fr))` }}
                        >
                          {item.megaMenu?.map((column, colIdx) => (
                            <div key={colIdx} className="space-y-3">
                              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                                <LayoutGrid className="h-3 w-3 text-brand-secondary-500" />
                                {column.title}
                              </h4>
                              <ul className="space-y-2">
                                {column.links.map((link, linkIdx) => (
                                  <li key={linkIdx}>
                                    <Link
                                      to={link.href}
                                      className="block group/link p-2 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                      <p className="text-sm font-semibold text-slate-800 group-hover/link:text-brand-primary-950 flex items-center gap-1">
                                        <span>{link.label}</span>
                                        <ChevronRight className="h-3.5 w-3.5 text-slate-300 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
                                      </p>
                                      {link.description && (
                                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                          {link.description}
                                        </p>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Desktop Action & Search buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Phone Line */}
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200/50"
                id={`${id}-call-action`}
              >
                <Phone className="h-3.5 w-3.5 text-brand-secondary-500" />
                <span>Call: {phone}</span>
              </a>

              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-brand-primary-950 hover:bg-slate-100 rounded-lg transition-all"
                title="Search Site"
                id={`${id}-search-trigger`}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Login Placeholder Link */}
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-brand-primary-950 px-3 py-2 rounded-lg transition-colors"
                id={`${id}-login-link`}
              >
                Login
              </Link>

              {/* Free Consultation Button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBookConsultation}
                id={`${id}-consultation-action`}
              >
                Book Free Consultation
              </Button>
            </div>

            {/* Mobile Actions Toolbar */}
            <div className="flex xl:hidden items-center gap-2">
              {/* Mobile Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-brand-primary-950 hover:bg-slate-100 rounded-lg transition-all"
                title="Search Site"
                id={`${id}-mobile-search`}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Mobile Hamburger menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-brand-primary-950 hover:bg-slate-100 rounded-lg transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
                id={`${id}-hamburger`}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div
            className="xl:hidden bg-white border-t border-slate-200 shadow-lg absolute left-0 right-0 top-full max-h-[85vh] overflow-y-auto z-40 animate-in slide-in-from-top-1 duration-200"
            id={`${id}-mobile-drawer`}
          >
            <div className="px-4 py-4 space-y-4">
              
              {/* Inline navigation links list */}
              <div className="space-y-1 divide-y divide-slate-100">
                {navItems.map((item: NavigationItem, idx: number) => {
                  const hasMega = item.megaMenu && item.megaMenu.length > 0;
                  const isExpanded = !!mobileExpandedIndices[idx];

                  return (
                    <div key={idx} className="pt-2 pb-1">
                      {hasMega ? (
                        <div>
                          <button
                            onClick={() => toggleMobileSubmenu(idx)}
                            className="w-full flex items-center justify-between py-2 text-base font-semibold text-slate-800 hover:text-brand-secondary-500 transition-colors"
                            id={`${id}-mob-navitem-${idx}`}
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-brand-secondary-500" : ""
                              }`}
                            />
                          </button>

                          {/* Mobile Submenu Accordion Items */}
                          {isExpanded && (
                            <div className="mt-2 pl-3 space-y-4 border-l-2 border-slate-200">
                              {item.megaMenu?.map((column, colIdx) => (
                                <div key={colIdx} className="space-y-1.5">
                                  <h5 className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                                    {column.title}
                                  </h5>
                                  <div className="space-y-1 pl-1">
                                    {column.links.map((link, linkIdx) => (
                                      <Link
                                        key={linkIdx}
                                        to={link.href}
                                        className="block py-1.5 text-sm text-slate-600 hover:text-brand-primary-950 font-medium"
                                      >
                                        {link.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.href}
                          className="block py-2 text-base font-semibold text-slate-800 hover:text-brand-secondary-500 transition-colors"
                          id={`${id}-mob-navitem-${idx}`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CTA and Login in Mobile menu */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                >
                  <Phone className="h-4 w-4 text-brand-secondary-500" />
                  <span>Call: {phone}</span>
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="flex items-center justify-center py-2.5 px-4 text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors text-center"
                  >
                    Login
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleBookConsultation();
                    }}
                    className="py-2.5 px-4 text-sm font-semibold text-white bg-brand-secondary-500 hover:bg-brand-secondary-600 rounded-lg transition-colors text-center"
                  >
                    Free Consultation
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </header>

      {/* Embedded Search Component overlay */}
      <SearchComponent isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
