/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  Printer,
  ChevronRight,
  ArrowUp,
  Mail,
  Phone,
  Building,
  AlertOctagon,
  Scale,
  ShieldAlert,
  ServerCrash,
  UserCheck,
  ExternalLink
} from "lucide-react";

export default function DisclaimerPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // SEO Info
  useEffect(() => {
    document.title = "Legal Disclaimer - Legomark India | Corporate & Compliance Portal";
    
    // Add meta description dynamically
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Official legal disclaimer for Legomark India. Read our guidelines regarding information accuracy, no legal or tax opinions without active contracts, and government approval dependencies.');

    // Scroll listener for "Back to Top" button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Determine active section based on scroll position
      const sections = [
        "general",
        "no-legal",
        "no-tax",
        "gov-approval",
        "processing-time",
        "third-party-portal",
        "client-docs",
        "external-links",
        "liability",
        "updates",
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
    { id: "general", label: "1. General Information" },
    { id: "no-legal", label: "2. No Legal Opinion" },
    { id: "no-tax", label: "3. No Tax Opinion" },
    { id: "gov-approval", label: "4. Government Approvals" },
    { id: "processing-time", label: "5. Processing Timelines" },
    { id: "third-party-portal", label: "6. Third Party Portals" },
    { id: "client-docs", label: "7. Accuracy of Documents" },
    { id: "external-links", label: "8. External Links Disclaimer" },
    { id: "liability", label: "9. Limitation of Liability" },
    { id: "updates", label: "10. Policy Updates" },
    { id: "contact", label: "11. Corporate Coordinates" }
  ];

  return (
    <div className="flex-1 bg-slate-50 font-sans print:bg-white print:text-black" id="disclaimer-page-root">
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-primary-950 text-white overflow-hidden py-16 md:py-20 print:bg-white print:text-black print:py-4 print:border-b" id="disclaimer-hero">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 print:hidden" />
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-brand-secondary-500/10 blur-[100px] pointer-events-none print:hidden" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 print:text-left print:px-0">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-400 bg-brand-secondary-500/10 border border-brand-secondary-500/20 px-3 py-1 rounded-full w-fit mx-auto print:hidden">
            <AlertOctagon className="h-3.5 w-3.5 text-brand-secondary-400" />
            Statutory Legal Notice
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight leading-none text-white print:text-black print:text-3xl">
            Legal Disclaimer
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
            <span className="text-slate-800">Legal Disclaimer</span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer border border-slate-200"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Notice
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

              {/* Bar Council Warning */}
              <div className="bg-amber-50 border border-amber-150 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-200">
                  <Scale className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-display font-black uppercase tracking-wider text-brand-primary-950">Bar Council Compliant</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  This platform does not solicit clients or offer direct advocacy representations. It serves solely as an online corporate filing consulting portal.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Document Content Column */}
          <div className="lg:col-span-3 space-y-8 print:w-full">
            
            {/* General Information */}
            <div
              id="general"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  1. General Information Only
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  The information, guides, calculation tools, blogs, and advisory content published on the platform of <strong>Legomark India Private Limited</strong> ("Legomark India") are intended strictly for general educational purposes. While we strive to ensure that the descriptions of corporate frameworks, taxation thresholds, and statutory licenses are accurate, comprehensive, and up-to-date, they do not constitute absolute legal guarantees.
                </p>
                <p>
                  Corporate compliance regulations, MCA filing rules, tax slabs, and intellectual property classes in India are updated frequently. Legomark India assumes no liability for immediate updates or errors in pricing, statutory fees, or checklist formats.
                </p>
              </div>
            </div>

            {/* No Legal Opinion */}
            <div
              id="no-legal"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Scale className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  2. No Legal Opinion (No Attorney-Client Relationship)
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                Accessing this website, browsing our compliance resources, booking free consultation slots, or downloading generic documentation templates does not establish a formal <strong>Attorney-Client Relationship</strong> between you and Legomark India or any corporate lawyer on our panel. No element of this portal should be construed as formal legal advice or representation. You are strongly advised to execute individual, formal consultancy agreements before acting on complex legal situations.
              </p>
            </div>

            {/* No Tax Opinion */}
            <div
              id="no-tax"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  3. No Tax Opinion (No Accountant-Client Relationship)
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                The tax calculators, GST threshold guides, and accounting summaries featured on Legomark India's portal are intended solely for basic estimation. They are not to be used as authoritative tax planning schemes, corporate valuation audits, or official accounting reports. Acting upon generic tax information without formal review of your entity's ledgers by our panel of Chartered Accountants (CAs) may attract audit challenges.
              </p>
            </div>

            {/* Government Approval Disclaimer */}
            <div
              id="gov-approval"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <AlertOctagon className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  4. Government Approvals & Rejections
                </h2>
              </div>
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold print:text-black">
                <p>
                  Legomark India manages the meticulous collection, validation, structural packaging, and filing of corporate documents before official registries. However, <strong>the final authority to grant or reject applications lies solely with government officials and statutory registries</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 print:text-black">
                  <li><strong>Company Names:</strong> The Ministry of Corporate Affairs (MCA) Registrar retains final discretion on company/LLP name approval based on active guidelines.</li>
                  <li><strong>GSTIN Issuance:</strong> State and Central GST officers evaluate premises proof scans and may issue clarifications (GST REG-03) or reject applications.</li>
                  <li><strong>Trademarks:</strong> The Intellectual Property India Examiner holds absolute jurisdiction to raise trademark objections or decline marks based on similar generic names.</li>
                  <li><strong>FSSAI & MSME:</strong> Food inspectors or state industrial commissioners hold final approval rights on active licenses.</li>
                </ul>
              </div>
            </div>

            {/* Processing Time Disclaimer */}
            <div
              id="processing-time"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  5. Processing Time Disclaimers
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                Legomark India lists average completion timelines based on historical averages (e.g. "7 to 10 days"). However, we do not guarantee these timelines. Delays arising from governmental backlogs, registry queue freezes, holiday periods, MCA portal migrations, or pending physical clarifications from client-end are completely outside our operational control and we cannot be held responsible for statutory consequences of such delays.
              </p>
            </div>

            {/* Third Party Portal Disclaimer */}
            <div
              id="third-party-portal"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <ServerCrash className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  6. Government Portals Liability
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                To execute filings, we must transmit documents onto official central portal infrastructures (including MCA V2/V3 system, GSTN hub, IP India database, or FoSCoS portal). Legomark India holds zero control or responsibility for technical glitches, system outages, session losses, data failures, or incorrect statutory receipts generated by official central systems.
              </p>
            </div>

            {/* Accuracy of Client Documents */}
            <div
              id="client-docs"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  7. Accuracy of Client Documents
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                We prepare legal drafts, partner agreements, and application files based solely on the data and identity document logs uploaded by the client. Legomark India does not possess statutory investigative authority to audit, double-check, or cross-verify the authenticity of client records. The client is solely liable for legal penalties, tax prosecution, or business closure resulting from submitting fake, counterfeit, forged, or altered Aadhaar, PAN, premises electricity bills, or NOC agreements.
              </p>
            </div>

            {/* External Links */}
            <div
              id="external-links"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <ExternalLink className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  8. External Links Disclaimer
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                Our platform and blog insights may feature hyperlink redirects to external third-party compliance blogs, national tax registries, official government notification pages, or partner payment interfaces. Legomark India does not verify, monitor, or endorse the content quality, security policies, cookies usage, or advertising metrics of external websites. Accessing external links is strictly at the client's risk.
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
                To the fullest extent authorized by Indian corporate laws, Legomark India Private Limited, including its directors, corporate officers, or contracted professionals, shall not be held liable for any direct, indirect, incidental, special, consequential, or punitive damages (including but not limited to business revenue losses, delay penalties, regulatory notices, or litigation costs) resulting from portal downtime, registry rejections, document inaccuracies, or reliance on information published across our public pages.
              </p>
            </div>

            {/* Updates */}
            <div
              id="updates"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 scroll-mt-20 print:border-none print:shadow-none print:p-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-secondary-50 border border-brand-secondary-100 rounded-xl flex items-center justify-center text-brand-secondary-600 print:hidden">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-lg md:text-xl font-display font-black text-brand-primary-950 tracking-tight">
                  10. Disclaimer Updates
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                Legomark India retains the statutory power to revise this disclaimer notice dynamically as corporate filing schemas, central taxation portals, or legal advisory compliance requirements change. Updated disclaimers take effect immediately upon public upload. Promoters are recommended to check this page frequently to maintain compliance with our digital frameworks.
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
                  11. Corporate Coordinates
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold print:text-black">
                For statutory queries, formal notices, or classifications regarding our Legal Disclaimer, please reach out to our registered office:
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
                    <h4 className="text-xs font-black text-brand-primary-950">Email Channels</h4>
                    <p className="text-[11px] text-slate-500 leading-normal font-semibold mt-1 print:text-black">
                      <a href="mailto:info@legomarkindia.com" className="text-brand-primary-600 hover:underline">info@legomarkindia.com</a><br />
                      <a href="mailto:support@legomarkindia.com" className="text-brand-primary-600 hover:underline">support@legomarkindia.com</a>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 hover:border-brand-secondary-300 transition-colors flex items-start gap-3 print:bg-white print:border-none">
                  <Phone className="h-5 w-5 text-brand-secondary-500 mt-0.5 shrink-0 print:hidden" />
                  <div>
                    <h4 className="text-xs font-black text-brand-primary-950">Direct Lines</h4>
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
