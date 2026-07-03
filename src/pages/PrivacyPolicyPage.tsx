/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Clock,
  Printer,
  ChevronRight,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Building,
  Lock,
  UserCheck,
  FileCheck,
  Eye,
  Briefcase,
  Layers,
  ArrowLeft
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // SEO Info
  useEffect(() => {
    document.title = "Privacy Policy - Legomark India | Corporate & Compliance Portal";
    
    // Add meta description dynamically
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Privacy Policy for Legomark India. Learn how we collect, protect, and handle your corporate documents, personal information, and business records for company registration, GST, and trademark services.');

    // Scroll listener for "Back to Top" button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Determine active section based on scroll position
      const sections = [
        "intro",
        "info-collect",
        "personal-info",
        "business-info",
        "documents",
        "payment",
        "cookies",
        "use-info",
        "security",
        "third-party",
        "sharing",
        "retention",
        "rights",
        "contact",
        "updates"
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
    { id: "intro", label: "1. Introduction" },
    { id: "info-collect", label: "2. Information We Collect" },
    { id: "personal-info", label: "3. Personal Information" },
    { id: "business-info", label: "4. Business Information" },
    { id: "documents", label: "5. Uploaded Documents" },
    { id: "payment", label: "6. Payment Information" },
    { id: "cookies", label: "7. Cookies & Analytics" },
    { id: "use-info", label: "8. How We Use Information" },
    { id: "security", label: "9. Data Security Protocols" },
    { id: "third-party", label: "10. Third-Party Services" },
    { id: "sharing", label: "11. Information Sharing" },
    { id: "retention", label: "12. Data Retention Policy" },
    { id: "rights", label: "13. Your Statutory Rights" },
    { id: "contact", label: "14. Contact Information" },
    { id: "updates", label: "15. Policy Updates" }
  ];

  return (
    <div className="flex-1 bg-slate-50 font-sans print:bg-white print:text-black" id="privacy-policy-root">
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-primary-950 text-white overflow-hidden py-16 md:py-20 print:bg-white print:text-black print:py-4 print:border-b" id="privacy-hero">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 print:hidden" />
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-brand-secondary-500/10 blur-[100px] pointer-events-none print:hidden" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 print:text-left print:px-0">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-400 bg-brand-secondary-500/10 border border-brand-secondary-500/20 px-3 py-1 rounded-full w-fit mx-auto print:hidden">
            <Shield className="h-3.5 w-3.5 text-brand-secondary-400" />
            Client Data Security Charter
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight leading-none text-white print:text-black print:text-3xl">
            Privacy Policy
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
            <span className="text-slate-800">Privacy Policy</span>
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
              <div className="bg-brand-primary-950 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary-500/5 blur-[30px]" />
                <div className="h-8 w-8 rounded-lg bg-brand-secondary-500/20 flex items-center justify-center text-brand-secondary-400 border border-brand-secondary-500/20">
                  <Lock className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-display font-black uppercase tracking-wider text-white">TLS 1.3 Certified</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                  All documents and payment credentials uploaded on the Legomark India Client Portal are governed by top-tier military-grade 256-bit AES encryption protocols.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Document Content Column */}
          <div className="lg:col-span-3 space-y-8 print:w-full">
            
            {/* Introductory Card */}
            <div
              id="intro"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  1. Introduction
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  Welcome to <strong>Legomark India Private Limited</strong> (referred to as "Legomark India", "the Company", "We", "Us", or "Our"). Legomark India is a premier corporate advisory and taxation consultancy firm registered in India. We operate through our online corporate portal, providing simplified, high-touch, offline-quality digital services including <strong>Company Registration, LLP Registration, GST Registration & Returns, Trademark Protection, Income Tax Filings, ROC compliance, FSSAI Licenses, MSME certifications, and Import Export Codes (IEC)</strong>.
                </p>
                <p>
                  This Privacy Policy sets out how we collect, store, utilize, share, and protect your personal and corporate information when you visit our website, register a client account, submit regulatory documents, or purchase our professional consultancy services. By accessing our platform or engaging our compliance panels of Chartered Accountants (CAs), Company Secretaries (CSs), and corporate attorneys, you explicitly consent to the terms of this Policy.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div
              id="info-collect"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Building className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  2. Information We Collect
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                To process business registrations and deliver compliance services under MCA, GSTN, and IP India statutory requirements, Legomark India must gather essential personal, corporate, and financial records. We do not collect information that is not critical to completing your corporate filing. This collection takes place through client registration, dynamic service request forms, document uploads, and direct consultation communication.
              </p>
            </div>

            {/* Personal Information */}
            <div
              id="personal-info"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  3. Personal Information
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  We collect personal identity details of business promoters, directors, partners, shareholders, and single proprietors to verify identities and prepare statutory government filings (such as Spice+ forms, DIR-3, and partner deeds). This includes:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 print:text-black">
                  <li>Full legal name, alias, and gender</li>
                  <li>Permanent residential address and correspondence address</li>
                  <li>Personal email addresses and active mobile numbers</li>
                  <li>Date of birth, nationality, and educational qualifications</li>
                  <li>Director Identification Number (DIN) and Digital Signature Certificate (DSC) files where applicable</li>
                </ul>
              </div>
            </div>

            {/* Business Information */}
            <div
              id="business-info"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Layers className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  4. Business Information
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  To draft corporate documents (MOA/AOA, LLP agreements) and complete licensing applications, we collect critical details about your existing or proposed commercial venture:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 print:text-black">
                  <li>Proposed company/LLP names, business models, and industry classifications</li>
                  <li>Registered office address, utility bills, and landlord NOC agreements</li>
                  <li>Permanent Account Number (PAN), Tax Deduction Account Number (TAN), and GSTIN</li>
                  <li>Trademark names, logo artwork files, brand descriptions, and date of first commercial use</li>
                  <li>FSSAI food categories, manufacturing capacity, or MSME investment and turnover figures</li>
                </ul>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div
              id="documents"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <FileCheck className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  5. Uploaded Documents
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  Our client portal allows clients to securely drag-and-drop or upload document scans requested by government registries for verification. These documents include, but are not limited to:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 print:text-black">
                  <li>PAN Card, Aadhaar Card, Passport, or Voter ID for identity verification</li>
                  <li>Bank Statement, Electricity Bill, Mobile Bill, or Telephone Bill (not older than 2 months) for proof of address</li>
                  <li>Passport-sized photographs of directors/partners</li>
                  <li>No Objection Certificate (NOC) signed by the registered office property owner</li>
                  <li>Statutory affidavits, declarations, and board resolution drafts</li>
                </ul>
                <p className="text-xs text-amber-600 font-bold bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl mt-2 print:bg-white print:text-black">
                  Important: Legomark India guarantees that uploaded documents are strictly restricted to assigned CA/CS/legal advisors and are never sold or shared with third-party advertising brokers.
                </p>
              </div>
            </div>

            {/* Payment Information */}
            <div
              id="payment"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  6. Payment Information
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                When you purchase our services, we collect transaction billing names, billing addresses, and payment modes. Note that <strong>Legomark India does not collect, log, or store sensitive credit card numbers, CVVs, or Net Banking PINs</strong>. All financial transactions are safely rerouted through PCI-DSS compliant, fully encrypted payment gateways (Razorpay/PayU). Your invoices clearly itemize the separate components of <strong>Professional Fees</strong> (services rendered) and <strong>Statutory Government Fees</strong>.
              </p>
            </div>

            {/* Cookies & Analytics */}
            <div
              id="cookies"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  7. Cookies & Analytics
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                We utilize essential cookies to keep you logged into the secure client dashboard, track dynamic order progress, and preserve form data before checkout. Additionally, we use Google Analytics and similar tracking tags to collect anonymous visitor data including IP address, geographic location, device browser type, and page interaction times. This helps us optimize user flows and protect our portal from fraudulent multi-login attempts or robotic scrapers.
              </p>
            </div>

            {/* How We Use Information */}
            <div
              id="use-info"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  8. How We Use Information
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  Legomark India process your details for the following direct professional activities:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 print:text-black">
                  <li>Preparing and drafting corporate documents, partner deeds, and board resolutions.</li>
                  <li>Filing authorized applications on official Ministry of Corporate Affairs (MCA), Goods and Services Tax Network (GSTN), and Trademark Registry systems.</li>
                  <li>Enabling our internal Chartered Accountants, Company Secretaries, and legal consultants to review information for physical accuracy.</li>
                  <li>Sending critical email/SMS alerts regarding active milestone updates, government clarifications, or annual ROC compliance timelines.</li>
                  <li>Generating tax invoices, managing payment reconciliation, and resolving refund requests.</li>
                  <li>Authenticating user access within our secure Legomark Client Portal.</li>
                </ul>
              </div>
            </div>

            {/* Data Security Protocols */}
            <div
              id="security"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  9. Data Security Protocols
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                We prioritize user data privacy. All external connections are secured via <strong>TLS 1.3 encryption</strong>, routing documents securely to cloud-hosted servers configured with strict Access Control Lists (ACLs). Our servers are guarded by redundant firewalls, preventing brute force vectors. Access to your uploaded PDFs, PAN scans, and DSC details is strictly logged and restricted to authorized professional advisors on a need-to-know basis.
              </p>
            </div>

            {/* Third-Party Services */}
            <div
              id="third-party"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Layers className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  10. Third-Party Services
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                To process your filings, our internal panels must transmit your information and document files directly to statutory government servers (including MCA portal, GSTN portal, Income Tax e-filing hub, FSSAI portal, DGFT portal, and MSME Udyam registry). We do not control the privacy protocols of these government-run interfaces, and they process data in accordance with their respective national digital mandates. We also utilize secure corporate notification servers to deliver automated WhatsApp/email alert logs to our registered clients.
              </p>
            </div>

            {/* Information Sharing */}
            <div
              id="sharing"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  11. Information Sharing
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  Legomark India does not sell, lease, or distribute customer profiles or emails to third-party ad networks. We share details solely under the following parameters:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 print:text-black">
                  <li><strong>Professional Advisors:</strong> Qualified CAs, Company Secretaries, tax auditors, and legal draftsmen under direct NDA to execute your compliance filing.</li>
                  <li><strong>Government Registries:</strong> Official submittals required to obtain corporate certificates, GSTINs, food licenses, or MSME registrations.</li>
                  <li><strong>Statutory Mandates:</strong> If mandated by law enforcement, judicial decrees, or tax inspection summons under Indian corporate statutes.</li>
                </ul>
              </div>
            </div>

            {/* Data Retention Policy */}
            <div
              id="retention"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  12. Data Retention Policy
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                We store your business profile and document logs on our servers as long as your client portal account remains active, or to comply with statutory record-keeping periods under the <strong>Indian Companies Act, 2013</strong> and <strong>Income Tax Act, 1961</strong> (which generally require keeping accounting records and regulatory filings for a minimum of 8 financial years). Once your business is incorporated or compliance completed, you can request manual removal of redundant file uploads (like resident proof scans) from active server view.
              </p>
            </div>

            {/* Your Statutory Rights */}
            <div
              id="rights"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  13. Your Statutory Rights
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  As a registered Legomark India client, you possess statutory rights regarding data visibility:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 print:text-black">
                  <li><strong>Access:</strong> The right to view and export all your registered files and corporate data on our dashboard.</li>
                  <li><strong>Rectification:</strong> The right to update inaccurate details, residential address shifts, or promoter telephone entries.</li>
                  <li><strong>Consent Withdrawal:</strong> The right to restrict promotional alert notifications. Note that this does not stop critical transaction messages.</li>
                  <li><strong>Data Erasure:</strong> The right to close your client portal account, subject to statutory tax audit requirements.</li>
                </ul>
              </div>
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
                  14. Contact Information
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                For queries regarding this Privacy Policy, your uploaded documents, or security protocols, please reach out to our grievance desk during business hours (10:00 AM to 6:30 PM, Monday to Saturday):
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

            {/* Policy Updates */}
            <div
              id="updates"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  15. Policy Updates
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                Legomark India may modify this Privacy Policy as required by changes in Indian corporate law, statutory regulations under MCA/GST, or portal security updates. Significant alterations will be highlighted via site banners, email alerts, or client portal logs. The "Last Updated" date at the top of this document indicates when the latest revisions took effect. We encourage clients to periodically review this policy to stay fully informed.
              </p>
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
