/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Coins,
  Clock,
  Printer,
  ChevronRight,
  ArrowUp,
  Mail,
  Phone,
  Building,
  HelpCircle,
  AlertTriangle,
  Receipt,
  FileText,
  DollarSign,
  Undo2,
  CalendarDays
} from "lucide-react";

export default function RefundPolicyPage() {
  const [activeSection, setActiveSection] = useState("scope");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // SEO Info
  useEffect(() => {
    document.title = "Refund Policy - Legomark India | Corporate & Compliance Portal";
    
    // Add meta description dynamically
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Refund Policy for Legomark India. Learn the difference between refundable professional fees and non-refundable government fees, cancellation terms, and processing timelines.');

    // Scroll listener for "Back to Top" button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Determine active section based on scroll position
      const sections = [
        "scope",
        "prof-fees",
        "gov-fees",
        "cancel-before",
        "cancel-after",
        "duplicate",
        "timeline",
        "non-refundable",
        "exceptional",
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
    { id: "scope", label: "1. Policy Scope" },
    { id: "prof-fees", label: "2. Professional Fees" },
    { id: "gov-fees", label: "3. Government Fees" },
    { id: "cancel-before", label: "4. Cancellation Before Filing" },
    { id: "cancel-after", label: "5. Cancellation After Filing" },
    { id: "duplicate", label: "6. Duplicate Payments" },
    { id: "timeline", label: "7. Processing Timeline" },
    { id: "non-refundable", label: "8. Non-Refundable Services" },
    { id: "exceptional", label: "9. Exceptional Cases" },
    { id: "contact", label: "10. Refund Support Desk" }
  ];

  return (
    <div className="flex-1 bg-slate-50 font-sans print:bg-white print:text-black" id="refund-page-root">
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-primary-950 text-white overflow-hidden py-16 md:py-20 print:bg-white print:text-black print:py-4 print:border-b" id="refund-hero">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 print:hidden" />
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-brand-secondary-500/10 blur-[100px] pointer-events-none print:hidden" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 print:text-left print:px-0">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-400 bg-brand-secondary-500/10 border border-brand-secondary-500/20 px-3 py-1 rounded-full w-fit mx-auto print:hidden">
            <Coins className="h-3.5 w-3.5 text-brand-secondary-400" />
            Financial Security & Transparency
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight leading-none text-white print:text-black print:text-3xl">
            Refund & Cancellation Policy
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
            <span className="text-slate-800">Refund Policy</span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer border border-slate-200"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Policy
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

              {/* Secure Shield Accent Widget */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-200">
                  <Receipt className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-display font-black uppercase tracking-wider text-brand-primary-950">Guaranteed Escrow</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  Refundable balances are credited back to the original source payment route within our statutory processing timelines.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Document Content Column */}
          <div className="lg:col-span-3 space-y-8 print:w-full">
            
            {/* Scope */}
            <div
              id="scope"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Coins className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  1. Policy Scope
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  At <strong>Legomark India Private Limited</strong>, transparency, and consumer protection are at the core of our business values. This Refund & Cancellation Policy sets forth the clear, statutory terms under which client refund claims, transaction disputes, and order cancellations are processed.
                </p>
                <p>
                  This policy covers all service categories published on our portal, including <strong>Company Incorporation (Pvt Ltd, OPC, LLP), GST Registrations & Filings, Trademark protection, Income Tax Return services, ROC compliant filing audits, FSSAI licenses, MSME certificates, and IEC licenses</strong>. By purchasing a service or checking out on our platform, you accept these terms in full.
                </p>
              </div>
            </div>

            {/* Professional Fees */}
            <div
              id="prof-fees"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <DollarSign className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  2. Professional Fees (Refundable Status)
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  <strong>Professional Fees</strong> represent the commercial charges invoiced by Legomark India to cover portal operations, administrative review, document drafting, and advisor consultation.
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 print:text-black">
                  <li><strong>Full Refund:</strong> If a client requests cancellation within 24 hours of payment and before our specialists have initiated document review or drafting.</li>
                  <li><strong>Partial Refund (Up to 50%):</strong> If cancellation is requested after 24 hours but before filing. This covers hours spent on name searches, drafting MOA/AOA, partner deeds, or compiling FSSAI/GST document folders.</li>
                  <li><strong>Non-Refundable:</strong> Professional fees are strictly non-refundable once our compliance panel has filed the regulatory form on government servers.</li>
                </ul>
              </div>
            </div>

            {/* Government Fees */}
            <div
              id="gov-fees"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  3. Government Fees (Non-Refundable Status)
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  <strong>Government Fees / Statutory Fees</strong> represent payments paid directly to central and state treasuries (including MCA incorporation stamp duty, GSTN registration fees, IP India trademark class fee, PAN/TAN print charges, or food license fees).
                </p>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 print:bg-white print:border-none">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 print:hidden" />
                  <p className="text-[11px] sm:text-xs text-amber-800 font-bold leading-relaxed print:text-black">
                    CRITICAL CLEARITY: Government fees are strictly non-refundable once they are remitted to government systems or once the official statutory challan receipt is issued. Legomark India acts solely as an intermediary transferring agent and cannot request or extract refunds from government ministries, treasury routes, or tax departments under any circumstances.
                  </p>
                </div>
              </div>
            </div>

            {/* Cancellation Before Filing */}
            <div
              id="cancel-before"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Undo2 className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  4. Cancellation Before Filing
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                If you wish to cancel your service purchase before the application is filed with the government, you must submit a formal ticket inside the Legomark Client Portal or email our billing desk at <strong>billing@legomarkindia.com</strong>. Refund calculation will depend on the phase of your file processing. If we have already prepared digital signatures (DSC), paid for notary stamps, or executed name reservation queries, those specific real costs will be deducted from your refundable professional fee balance.
              </p>
            </div>

            {/* Cancellation After Filing */}
            <div
              id="cancel-after"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  5. Cancellation After Filing
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                Once an incorporation form, tax audit, trademark file, FSSAI registration, or ROC compliance document is successfully filed on statutory servers, the service is deemed completed and <strong>no cancellation or refund requests can be entertained</strong>. If the government examiner subsequently rejects, abandons, or marks your file as "Withdrawn" due to naming collisions, trademark conflicts, or lack of corporate qualifications, Legomark India will not refund professional or government fees.
              </p>
            </div>

            {/* Duplicate Payments */}
            <div
              id="duplicate"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Receipt className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  6. Duplicate Payments
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                In the event of a technical network error or double-click checkout, if your bank account is charged twice for the same transaction order, you are protected. Please notify our support desk with screenshots of your bank transaction logs or Razorpay IDs. Once verified, the duplicate payment will be <strong>refunded in full (100% of both professional and statutory components)</strong> within our standard processing timeline.
              </p>
            </div>

            {/* Refund Processing Timeline */}
            <div
              id="timeline"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  7. Refund Processing Timeline
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                Approved refunds will be processed within <strong>7 to 10 business days</strong> from the date of official validation. The refund amount will be credited back via the same payment route (Credit/Debit Card, UPI, Net Banking, or Wallet) used during checkout. Please note that banks, credit card networks, and payment gateways can take an additional 3 to 5 business days to clear the funds and display them in your statement.
              </p>
            </div>

            {/* Non-Refundable Services */}
            <div
              id="non-refundable"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  8. Non-Refundable Services
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  Certain high-touch bespoke packages involve non-recoverable operational layouts from day one. These are strictly <strong>non-refundable</strong> immediately after payment is confirmed:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 print:text-black">
                  <li>Digital Signature Certificate (DSC) token creation and validation keys.</li>
                  <li>Company Name Search Reservation applications filed on the MCA portal.</li>
                  <li>Expedited corporate advisory consultation sessions with a senior Chartered Accountant (CA).</li>
                  <li>Purchase of third-party templates, custom legal drafts, or physical notary stamps.</li>
                </ul>
              </div>
            </div>

            {/* Exceptional Cases */}
            <div
              id="exceptional"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  9. Exceptional Cases
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                Our management retains absolute authority to assess exceptional refunds under unforeseen events (such as the sudden critical illness or death of a primary director before filings are completed). If Legomark India fails to file your application within 45 days of receiving valid, complete documentation due to internal processing failures, a full refund of professional fees will be offered as a matter of service-level guarantee.
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
                  10. Refund Support Desk
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                To initiate a cancellation, trace refund dispatch, or dispute a corporate bill, reach out to our accounts team:
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
                    <h4 className="text-xs font-black text-brand-primary-950">Email Accounts</h4>
                    <p className="text-[11px] text-slate-500 leading-normal font-semibold mt-1 print:text-black">
                      <a href="mailto:billing@legomarkindia.com" className="text-brand-primary-600 hover:underline">billing@legomarkindia.com</a><br />
                      <a href="mailto:info@legomarkindia.com" className="text-brand-primary-600 hover:underline">info@legomarkindia.com</a>
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
