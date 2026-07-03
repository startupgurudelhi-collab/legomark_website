/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout.js";
import { Button } from "../components/Button.js";

export default function ServerErrorPage() {
  useEffect(() => {
    document.title = "500 Server Error | Legomark India Support";
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <PublicLayout id="servererror-layout">
      <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-md w-full text-center space-y-6" id="servererror-content">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-2">
            <ShieldAlert className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold tracking-tight text-brand-primary-950">
              500 - Server Error
            </h1>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-wider">
              Error Code: INTERNAL_SERVER_ERROR
            </p>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            An unexpected error occurred while processing your request. Our technical staff has been notified. Please try reloading the page or check back shortly.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              onClick={handleReload}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reload Page</span>
            </Button>
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Home className="h-4 w-4 text-brand-secondary-500" />
                <span>Go to Home</span>
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-200/80 text-xs text-slate-400 font-mono">
            Security &amp; Compliance Integrity System
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
