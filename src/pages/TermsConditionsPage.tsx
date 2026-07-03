/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  Clock,
  Printer,
  ChevronRight,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Building,
  ShieldAlert,
  FileText,
  BadgeAlert,
  FileSpreadsheet,
  Briefcase,
  Layers,
  ArrowLeft
} from "lucide-react";

export default function TermsConditionsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // SEO Info
  useEffect(() => {
    document.title = "Terms & Conditions - Legomark India | Corporate & Compliance Portal";
    
    // Add meta description dynamically
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Terms and Conditions for Legomark India. Read our user agreement, professional fees breakdown, client responsibilities, government portal liability, and statutory governing laws.');

    // Scroll listener for "Back to Top" button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Determine active section based on scroll position
      const sections = [
        "acceptance",
        "services",
        "responsibilities",
        "documentation",
        "gov-fees",
        "prof-fees",
        "timelines",
        "intellectual-property",
        "liability",
        "portals",
        "accounts",
        "prohibited",
        "changes",
        "governing-law",
        "contact"
      ];
      
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    window.print();
  };

  const sectionsList = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "services", label: "2. Services Offered" },
    { id: "responsibilities", label: "3. Client Responsibilities" },
    { id: "documentation", label: "4. Documentation" },
    { id: "gov-fees", label: "5. Government Fees" },
    { id: "prof-fees", label: "6. Professional Fees" },
    { id: "timelines", label: "7. Processing Timelines" },
    { id: "intellectual-property", label: "8. Intellectual Property" },
    { id: "liability", label: "9. Limitation of Liability" },
    { id: "portals", label: "10. Government Portals" },
    { id: "accounts", label: "11. Client Accounts" },
    { id: "prohibited", label: "12. Prohibited Activities" },
    { id: "changes", label: "13. Service Changes" },
    { id: "governing-law", label: "14. Governing Law" },
    { id: "contact", label: "15. Contact & Support" }
  ];

  return (
    <div className="flex-1 bg-slate-50 font-sans print:bg-white print:text-black" id="terms-page-root">
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-primary-950 text-white overflow-hidden py-16 md:py-20 print:bg-white print:text-black print:py-4 print:border-b" id="terms-hero">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 print:hidden" />
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-brand-secondary-500/10 blur-[100px] pointer-events-none print:hidden" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 print:text-left print:px-0">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-400 bg-brand-secondary-500/10 border border-brand-secondary-500/20 px-3 py-1 rounded-full w-fit mx-auto print:hidden">
            <Scale className="h-3.5 w-3.5 text-brand-secondary-400" />
            Statutory Client Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight leading-none text-white print:text-black print:text-3xl">
            Terms & Conditions
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-300 font-medium text-xs sm:text-sm print:text-slate-600 print:justify-start">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brand-secondary-400 print:hidden" />
              Last Updated: June 29, 2026
            </span>
            <span className="hidden sm:inline text-slate-500 print:hidden">&bull;</span>
            <span className="text-slate-200 font-semibold print:text-black">Legomark India Private Limited</span>
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMBS */}
      <div className="bg-white border-b border-slate-200/80 py-3.5 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-brand-primary-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-800">Terms & Conditions</span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer border border-slate-200"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Terms
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:px-0 print:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Table of Contents - Sticky Desktop Sidebar */}
          <div className="lg:col-span-1 print:hidden">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-extrabold border-b border-slate-100 pb-2">
                  Table of Contents
                </p>
                <nav className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1">
                  {sectionsList.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
                        activeSection === sec.id
                          ? "bg-brand-primary-50 text-brand-primary-950 border-l-2 border-brand-secondary-500 font-extrabold pl-4"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Legal Disclaimer Accent */}
              <div className="bg-brand-secondary-50 border border-brand-secondary-150 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="h-8 w-8 rounded-lg bg-brand-secondary-500/10 flex items-center justify-center text-brand-secondary-600 border border-brand-secondary-200">
                  <Scale className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-display font-black uppercase tracking-wider text-brand-primary-950">Statutory Notice</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  This document constitutes a legally binding service-level user agreement between you and Legomark India Private Limited.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Document Content Column */}
          <div className="lg:col-span-3 space-y-8 print:w-full">
            
            {/* Acceptance of Terms */}
            <div
              id="acceptance"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Scale className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  1. Acceptance of Terms
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  Welcome to the digital portal of <strong>Legomark India Private Limited</strong> ("Legomark India", "we", "us", "our"). By accessing, browsing, registering, or transacting on our website, or by engaging our compliance panels to perform regulatory filings, you agree to comply with and be bound by these Terms & Conditions ("Terms", "Agreement"), along with our Privacy Policy, Refund Policy, and Disclaimer.
                </p>
                <p>
                  If you represent a partnership firm, LLP, public or private limited company, or any other incorporated commercial entity, you warrant that you possess the requisite statutory corporate authority to bind such entity to these Terms. If you do not agree with any clause of this statutory agreement, you must immediately terminate use of our client portal and services.
                </p>
              </div>
            </div>

            {/* Services Offered */}
            <div
              id="services"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Building className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  2. Services Offered
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  Legomark India is a specialized, high-touch online business consultant and corporate filing helper. We coordinate with qualified corporate attorneys, Company Secretaries (CSs), and Chartered Accountants (CAs) to offer professional assistance across the following fields:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2 text-slate-500 font-bold print:text-black">
                  <li className="flex items-center gap-2 text-[11px] sm:text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 print:bg-white print:border-none"><ChevronRight className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" /> Company Registration</li>
                  <li className="flex items-center gap-2 text-[11px] sm:text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 print:bg-white print:border-none"><ChevronRight className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" /> LLP Registration</li>
                  <li className="flex items-center gap-2 text-[11px] sm:text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 print:bg-white print:border-none"><ChevronRight className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" /> GST Registration & Return Filing</li>
                  <li className="flex items-center gap-2 text-[11px] sm:text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 print:bg-white print:border-none"><ChevronRight className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" /> Trademark Registration (IP Protection)</li>
                  <li className="flex items-center gap-2 text-[11px] sm:text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 print:bg-white print:border-none"><ChevronRight className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" /> Income Tax Services (ITR & Audits)</li>
                  <li className="flex items-center gap-2 text-[11px] sm:text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 print:bg-white print:border-none"><ChevronRight className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" /> Registrar of Companies (ROC) Compliance</li>
                  <li className="flex items-center gap-2 text-[11px] sm:text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 print:bg-white print:border-none"><ChevronRight className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" /> FSSAI Food License / Registration</li>
                  <li className="flex items-center gap-2 text-[11px] sm:text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 print:bg-white print:border-none"><ChevronRight className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" /> MSME / Udyam Registration</li>
                  <li className="flex items-center gap-2 text-[11px] sm:text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 print:bg-white print:border-none"><ChevronRight className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" /> Import Export Code (IEC) Registration</li>
                  <li className="flex items-center gap-2 text-[11px] sm:text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 print:bg-white print:border-none"><ChevronRight className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" /> Comprehensive Business Consultancy</li>
                </ul>
              </div>
            </div>

            {/* Client Responsibilities */}
            <div
              id="responsibilities"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  3. Client Responsibilities
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                Clients must act in good faith and supply authentic, factual data throughout the consultation process. You are solely responsible for ensuring that the corporate titles, trademark logos, promoter coordinates, and business statements you provide do not infringe on third-party legal copyrights, violate regulatory restrictions, or deceive governmental agencies. Legomark India assumes no responsibility for compiling or correcting intentional inaccuracies in your data.
              </p>
            </div>

            {/* Documentation Requirements */}
            <div
              id="documentation"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  4. Documentation Requirements
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                To execute filings under MCA, GST, or Trademark frameworks, you must submit clear scans of legitimate personal and office documents (including PAN cards, Aadhaar cards, current utility bills, and signed NOCs) within our Client Portal. If files are blurry, incomplete, expired, or rejected by government portals, you must upload corrected copies within 3 business days of being notified. Delays in uploading valid documentation will automatically extend processing timelines.
              </p>
            </div>

            {/* Government Fees */}
            <div
              id="gov-fees"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <BadgeAlert className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  5. Government Fees
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                <strong>Statutory Government Fees</strong> represent the official payments mandated by regulatory registries (including MCA filing fees, GST stamp duty, trademark class fee, FSSAI portal charges, or PAN/TAN card print charges). Government fees are paid directly to state treasury routes through our integrated channels or official receipts. Please note that <strong>Government fees are strictly non-refundable</strong> once processed on statutory portals, regardless of whether your application is ultimately approved or rejected by government examiners.
              </p>
            </div>

            {/* Professional Fees */}
            <div
              id="prof-fees"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  6. Professional Fees
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                <strong>Professional Fees</strong> represent the commercial charges of Legomark India for service management, expert advisor review, CA/CS validation, document drafting, and portal filing execution. Our professional fee structure is displayed transparently at checkout and is subject to 18% GST as per statutory Indian tax mandates. If additional services, multiple trademark classes, or custom legal drafting are requested outside the initial order scope, supplementary invoices will be raised.
              </p>
            </div>

            {/* Processing Timelines */}
            <div
              id="timelines"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  7. Processing Timelines
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                All advertised completion timelines (e.g., "7 to 10 days for Company Registration") are estimated, average periods representing business days. They begin only after the client has uploaded all completed, verified documentation and paid the necessary professional and government fees. Timelines are subject to processing backlogs inside government departments, server downtime on statutory portals, and clarification queries (Resubmissions/Resubmits) raised by MCA or trademark registries.
              </p>
            </div>

            {/* Intellectual Property */}
            <div
              id="intellectual-property"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  8. Intellectual Property Rights
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                The visual layout, source code, graphic designs, calculator formulas, text content, brand slogans, and logo vectors featured on the Legomark India platform are the exclusive intellectual property of Legomark India Private Limited, protected under Indian and international copyright laws. Unauthorised replication, scraping, framing, or commercial redistribution of our website content without an explicit written license is strictly prohibited.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div
              id="liability"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  9. Limitation of Liability
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                To the maximum extent permitted under statutory Indian law, the maximum cumulative liability of Legomark India, including our directors, employees, or contracted CAs/CSs/attorneys, for any claim, loss, delay, or damage arising from service deficiency, errors in filings, or technical platform errors, shall be limited strictly to the <strong>amount of professional fees actually paid to Legomark India</strong> for that specific service. We shall not be liable for any indirect, consequential, incidental, exemplary, or punitive damages (including lost corporate profits, business interruptions, or tax penalties).
              </p>
            </div>

            {/* Third Party Government Portals */}
            <div
              id="portals"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Layers className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  10. Government Portals Liability
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                Legomark India acts as an intermediary filer on behalf of clients. We have zero regulatory control over the structural operations, web hosting, technical stability, API gateways, database speed, or examination decisions of state and central government portals (such as the Ministry of Corporate Affairs, GST portal, Income Tax e-Filing registry, FSSAI FoSCoS, or IP India database). We are not liable for delayed filings or system glitches caused by governmental server outages, scheduled maintenance, or updated schema validations.
              </p>
            </div>

            {/* User Accounts */}
            <div
              id="accounts"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Building className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  11. User Accounts
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                To access order tracking, upload document logs, or download tax receipts, clients must register a secure workspace account within our Client Portal. You are solely responsible for protecting your secure portal login password, session keys, and secondary authorization metrics. Any regulatory filing request or corporate communication logged under your credential will be deemed authorized by you. If you suspect unauthorized access, contact us immediately.
              </p>
            </div>

            {/* Prohibited Activities */}
            <div
              id="prohibited"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  12. Prohibited Activities
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  As an express condition of accessing the Legomark India platform, you agree NOT to perform any of the following restricted activities:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 print:text-black">
                  <li>Uploading counterfeit, modified, or forged resident proof scans or identity documents.</li>
                  <li>Registering companies or applying for trademarks under names that mimic existing entities with fraudulent intent.</li>
                  <li>Using automated scraping tools, python spiders, or background daemons to harvest professional prices or blogs.</li>
                  <li>Engaging in DDoS attacks, code injection vectors, or trying to bypass our secure TLS 1.3 firewalls.</li>
                  <li>Impersonating another promoter, company, or Legomark India official.</li>
                </ul>
              </div>
            </div>

            {/* Service Changes */}
            <div
              id="changes"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  13. Service Changes
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                Legomark India reserves the statutory right to alter, pause, retire, or modify any public service pricing, packages, portal features, or compliance checklists at any time without prior individual warning. Our consultancy fee updates are applied dynamically across the site. If you have an active paid order, your pricing remains locked and protected against downstream pricing changes for 30 calendar days.
              </p>
            </div>

            {/* Governing Law */}
            <div
              id="governing-law"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Scale className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  14. Governing Law & Dispute Jurisdiction
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                These Terms & Conditions, along with all active services contracted with Legomark India, shall be governed by, interpreted, and enforced in accordance with the laws of the <strong>Republic of India</strong>. In the event of any irreconcilable legal dispute, corporate claim, or statutory litigation arising from this Agreement, the courts of <strong>New Delhi, India</strong> shall possess exclusive territorial and subject-matter jurisdiction.
              </p>
            </div>

            {/* Contact Information */}
            <div
              id="contact"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Building className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  15. Contact & Support Desk
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                For administrative questions, formal disputes, legal summons, or clarifications regarding these Terms & Conditions, please contact our legal desk:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 hover:border-brand-secondary-300 transition-colors flex items-start gap-3 print:bg-white print:border-none">
                  <Building className="h-5 w-5 text-brand-secondary-500 mt-0.5 shrink-0 print:hidden" />
                  <div>
                    <h4 className="text-xs font-black text-brand-primary-950">Registered Office</h4>
                    <address className="text-[11px] text-slate-500 leading-normal not-italic font-semibold mt-1 print:text-black">
                      Legomark India<br />
                      D-561, Pocket 11,<br />
                      DDA Janta Flats, Jasola,<br />
                      New Delhi – 110025
                    </address>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 hover:border-brand-secondary-300 transition-colors flex items-start gap-3 print:bg-white print:border-none">
                  <Mail className="h-5 w-5 text-brand-secondary-500 mt-0.5 shrink-0 print:hidden" />
                  <div>
                    <h4 className="text-xs font-black text-brand-primary-950">Email Support</h4>
                    <p className="text-[11px] text-slate-500 leading-normal font-semibold mt-1 print:text-black">
                      <a href="mailto:info@legomarkindia.com" className="text-brand-primary-600 hover:underline">info@legomarkindia.com</a><br />
                      <a href="mailto:support@legomarkindia.com" className="text-brand-primary-600 hover:underline">support@legomarkindia.com</a>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 hover:border-brand-secondary-300 transition-colors flex items-start gap-3 print:bg-white print:border-none">
                  <Phone className="h-5 w-5 text-brand-secondary-500 mt-0.5 shrink-0 print:hidden" />
                  <div>
                    <h4 className="text-xs font-black text-brand-primary-950">Phone Coordinates</h4>
                    <p className="text-[11px] text-slate-500 leading-normal font-semibold mt-1 print:text-black">
                      <a href="tel:+917530847878" className="hover:underline">+91 75308 47878</a><br />
                      <a href="tel:01145768289" className="hover:underline">011-45768289</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-brand-primary-950 hover:bg-brand-secondary-500 text-white hover:text-brand-primary-950 rounded-full shadow-xl transition-all duration-300 z-50 cursor-pointer border border-brand-primary-800 focus:outline-none print:hidden animate-in fade-in zoom-in-50"
          title="Back to Top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
