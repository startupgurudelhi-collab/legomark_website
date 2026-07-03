/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";
import { Loader } from "../components/Loader.js";
import { PublicLayout } from "../layouts/PublicLayout.js";
import HomePage from "../pages/HomePage.js";
import NotFoundPage from "../pages/NotFoundPage.js";
import ServerErrorPage from "../pages/ServerErrorPage.js";
import ServicePage from "../pages/ServicePage.js";
import LoginPage from "../pages/LoginPage.js";
import AdminPage from "../pages/AdminPage.js";
import ClientPortalPage from "../pages/ClientPortalPage.js";
import AboutPage from "../pages/AboutPage.js";
import BlogsPage from "../pages/BlogsPage.js";
import ContactPage from "../pages/ContactPage.js";
import CareerPage from "../pages/CareerPage.js";
import FaqPage from "../pages/FaqPage.js";
import SitemapPage from "../pages/SitemapPage.js";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage.js";
import TermsConditionsPage from "../pages/TermsConditionsPage.js";
import RefundPolicyPage from "../pages/RefundPolicyPage.js";
import DisclaimerPage from "../pages/DisclaimerPage.js";

// A clean, generic page placeholder for demonstration of the public framework
function PublicPagePlaceholder({ title }: { title: string }) {
  const location = useLocation();
  return (
    <PublicLayout id={`layout-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex-1 flex items-center justify-center py-20 px-4 bg-slate-50">
        <div className="max-w-xl w-full text-center space-y-4">
          <div className="inline-flex px-3 py-1 text-xs font-mono font-semibold text-brand-secondary-600 bg-brand-secondary-50 rounded-full border border-brand-secondary-200/50">
            FRAMEWORK PLACEHOLDER
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-brand-primary-950">
            {title}
          </h1>
          <p className="text-sm font-mono text-slate-500 bg-slate-100 py-1 px-3 rounded-lg inline-block">
            Path: {location.pathname}
          </p>
          <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
            This screen represents a clean routing target within the Public Website Framework. Business-specific layouts, marketing segments, and interactive forms will be introduced in subsequent development contracts.
          </p>
          <div className="pt-4 text-xs text-slate-400 font-mono">
            Legomark India &bull; DC-002 Ready
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Loader variant="fullscreen" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout id="homepage-layout"><HomePage /></PublicLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<PublicLayout id="about-layout"><AboutPage /></PublicLayout>} />
      <Route path="/blogs" element={<PublicLayout id="blogs-layout"><BlogsPage /></PublicLayout>} />
      <Route path="/career" element={<PublicLayout id="career-layout"><CareerPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout id="contact-layout"><ContactPage /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout id="faq-layout"><FaqPage /></PublicLayout>} />
      <Route path="/sitemap" element={<PublicLayout id="sitemap-layout"><SitemapPage /></PublicLayout>} />
      <Route path="/privacy-policy" element={<PublicLayout id="privacy-layout"><PrivacyPolicyPage /></PublicLayout>} />
      <Route path="/terms-conditions" element={<PublicLayout id="terms-layout"><TermsConditionsPage /></PublicLayout>} />
      <Route path="/refund-policy" element={<PublicLayout id="refund-layout"><RefundPolicyPage /></PublicLayout>} />
      <Route path="/disclaimer" element={<PublicLayout id="disclaimer-layout"><DisclaimerPage /></PublicLayout>} />

      {/* Dynamic Sub-services mapping to test Breadcrumb and Navigation */}
      <Route path="/services" element={<PublicPagePlaceholder title="All Services" />} />
      <Route path="/services/company-registration" element={<PublicPagePlaceholder title="Company Registration" />} />
      <Route path="/services/company-registration/:serviceId" element={<ServicePage />} />
      <Route path="/services/tax-compliance" element={<PublicPagePlaceholder title="Tax & Compliance" />} />
      <Route path="/services/tax-compliance/:serviceId" element={<ServicePage />} />
      <Route path="/services/trademark" element={<PublicPagePlaceholder title="Trademark & IP Protection" />} />
      <Route path="/services/trademark/:serviceId" element={<ServicePage />} />
      <Route path="/services/licenses" element={<PublicPagePlaceholder title="Business Licensing" />} />
      <Route path="/services/licenses/:serviceId" element={<ServicePage />} />
      <Route path="/services/:serviceId" element={<ServicePage />} />

      {/* Flexible two-segment slug mapping (e.g. /company-registration/private-limited-company) */}
      <Route path="/:categorySlug/:serviceSlug" element={<ServicePage />} />

      {/* Flexible three-segment slug mapping (e.g. /company-registration/corporate-entities/private-limited-company) */}
      <Route path="/:categorySlug/:subcategorySlug/:serviceSlug" element={<ServicePage />} />

      {/* Error Pages testing routes */}
      <Route path="/500" element={<ServerErrorPage />} />

      {/* Client Dashboard (Protected - Live Portal) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["CLIENT", "ADMIN", "CONSULTANT"]}>
            <ClientPortalPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard (Protected - Admin Only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
