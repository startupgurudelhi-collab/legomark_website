/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, PhoneCall } from "lucide-react";
import { PublicLayout } from "../layouts/PublicLayout.js";
import { Button } from "../components/Button.js";
import { websiteConfig } from "../config/websiteConfig.js";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 Page Not Found | Legomark India";
  }, []);

  const { phone } = websiteConfig.topBar;

  return (
    <PublicLayout id="notfound-layout">
      <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-md w-full text-center space-y-6" id="notfound-content">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-secondary-100 text-brand-secondary-500 mb-2">
            <AlertCircle className="h-10 w-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold tracking-tight text-brand-primary-950">
              404 - Page Not Found
            </h1>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-wider">
              Error Code: PAGE_NOT_FOUND
            </p>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Please verify the URL or navigate back home.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Homepage</span>
              </Button>
            </Link>
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <PhoneCall className="h-4 w-4 text-brand-secondary-500" />
                <span>Call Help Desk</span>
              </Button>
            </a>
          </div>

          <div className="pt-6 border-t border-slate-200/80 text-xs text-slate-400 font-mono">
            Legomark India &bull; Public Website Framework v1.0
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
