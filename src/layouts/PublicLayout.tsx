/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { TopBar } from "../components/TopBar.js";
import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { Breadcrumb } from "../components/Breadcrumb.js";
import { ScrollToTopOnNavigate, ScrollToTopButton } from "../components/ScrollToTop.js";

interface PublicLayoutProps {
  children: ReactNode;
  id?: string;
}

export function PublicLayout({ children, id = "public-layout" }: PublicLayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-brand-secondary-100" id={id}>
      {/* Route-level scroll auto-reset */}
      <ScrollToTopOnNavigate />

      {/* Top Bar Contacts / Working Hours */}
      <TopBar />

      {/* Primary Sticky Header */}
      <Header />

      {/* Breadcrumb - Only display on subpages */}
      {!isHomePage && <Breadcrumb />}

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col" id={`${id}-content-main`}>
        {children}
      </main>

      {/* Global Corporate Footer */}
      <Footer />

      {/* Scroll-to-Top Action Button */}
      <ScrollToTopButton />
    </div>
  );
}
export default PublicLayout;
