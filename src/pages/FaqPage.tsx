/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Calendar,
  PhoneCall,
  Sparkles,
  Building,
  Coins,
  Shield,
  FileText,
  Award,
  Lock,
  Layers,
  ArrowRight,
  Users,
  CheckCircle2,
  Mail,
  Zap,
  Info
} from "lucide-react";
import { useToast } from "../contexts/ToastContext.js";
import { useBooking } from "../hooks/useBooking.js";

// Define strict types for FAQs
interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function FaqPage() {
  const toast = useToast();
  const { handleBookConsultation } = useBooking();
  
  // Category List
  const categories = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    { id: "company", label: "Company Registration", icon: Layers },
    { id: "gst", label: "GST", icon: FileText },
    { id: "trademark", label: "Trademark", icon: Shield },
    { id: "tax", label: "Income Tax", icon: Coins },
    { id: "fssai", label: "FSSAI", icon: Award },
    { id: "msme", label: "MSME", icon: Zap },
    { id: "roc", label: "ROC Compliance", icon: Building },
    { id: "portal", label: "Client Portal", icon: Lock },
    { id: "billing", label: "Billing", icon: Info },
    { id: "general", label: "General", icon: Users }
  ];

  // 30 Professional FAQs
  const faqData: FAQItem[] = [
    // Company Registration
    {
      id: "comp-1",
      category: "company",
      question: "How long does Private Limited Company registration take?",
      answer: "Typically, Private Limited company registration in India takes 7 to 10 business days. This timeframe is subject to approval timelines by the Ministry of Corporate Affairs (MCA), name availability, and promptness of document validation."
    },
    {
      id: "comp-2",
      category: "company",
      question: "What is the minimum capital required to start a Private Limited Company?",
      answer: "There is no minimum paid-up capital requirement to start a Private Limited Company in India. You can register your company with as little as ₹10,000 as authorized capital."
    },
    {
      id: "comp-3",
      category: "company",
      question: "Can a single person register a Private Limited Company?",
      answer: "No, a standard Private Limited Company requires at least two directors and shareholders. However, if you want a single-owner structure, you can register as a One Person Company (OPC) which provides similar corporate advantages."
    },

    // GST
    {
      id: "gst-1",
      category: "gst",
      question: "Is GST registration mandatory for all businesses?",
      answer: "GST registration is mandatory for service providers with annual turnover exceeding ₹20 Lakhs and goods suppliers exceeding ₹40 Lakhs (thresholds vary for special category states). It is also mandatory for e-commerce sellers and interstate traders regardless of turnover."
    },
    {
      id: "gst-2",
      category: "gst",
      question: "What is the penalty for not registering for GST?",
      answer: "Any business that fails to obtain a GST registration despite being liable under statutory thresholds faces a penalty of 10% of the tax due or ₹10,000, whichever is higher, along with potential interest charges on overdue taxes."
    },
    {
      id: "gst-3",
      category: "gst",
      question: "Can I apply for voluntary GST registration?",
      answer: "Yes, any business can register for GST voluntarily even if their turnover is below the threshold limit. This is often beneficial to claim Input Tax Credit (ITC) and build corporate credibility."
    },

    // Trademark
    {
      id: "tm-1",
      category: "trademark",
      question: "What is the difference between TM and ® symbols?",
      answer: "The 'TM' symbol is used once a trademark application is successfully filed with the Trademark Registry. The '®' (Registered) symbol can only be used after the trademark registration certificate is officially issued and the mark is fully registered."
    },
    {
      id: "tm-2",
      category: "trademark",
      question: "How long does a Trademark registration remain valid?",
      answer: "In India, a trademark registration is valid for 10 years from the date of application. It can be renewed indefinitely every 10 years by filing a renewal application and paying the prescribed fee."
    },
    {
      id: "tm-3",
      category: "trademark",
      question: "What happens if someone objects to my trademark application?",
      answer: "If an objection is raised by the examiner or a third party, we need to file a formal reply within 30 days explaining why the objection should be waived. If needed, we will represent you in trademark hearings."
    },

    // Income Tax
    {
      id: "tax-1",
      category: "tax",
      question: "What is the due date for filing corporate income tax returns (ITR)?",
      answer: "For companies in India, the statutory due date for filing corporate ITR is October 31st of the assessment year (or November 30th if transfer pricing provisions apply). For individuals and non-audit cases, it is July 31st."
    },
    {
      id: "tax-2",
      category: "tax",
      question: "What is tax audit and when is it applicable?",
      answer: "A tax audit is a verification of a business's accounts by a qualified CA to ensure compliance. It is mandatory if business turnover exceeds ₹1 Crore (or ₹10 Crore if cash transactions are under 5%) or professional receipts exceed ₹50 Lakhs."
    },
    {
      id: "tax-3",
      category: "tax",
      question: "Can I file my ITR if I have incurred business losses?",
      answer: "Yes, it is highly recommended to file your ITR in case of business losses as it allows you to carry forward the losses to offset against future profits, reducing your tax liability in subsequent years."
    },

    // FSSAI
    {
      id: "fssai-1",
      category: "fssai",
      question: "Who needs an FSSAI Food License in India?",
      answer: "Any business involved in food handling, manufacturing, processing, packaging, distributing, retailing, or catering must obtain an FSSAI License or Registration, depending on their turnover and production capacity."
    },
    {
      id: "fssai-2",
      category: "fssai",
      question: "What is the difference between FSSAI Registration and FSSAI License?",
      answer: "FSSAI Registration (Basic) is for small businesses with an annual turnover of up to ₹12 Lakhs. FSSAI State License is for mid-sized businesses with a turnover of ₹12 Lakhs to ₹20 Crores. FSSAI Central License is for large businesses with a turnover exceeding ₹20 Crores or those operating in multiple states."
    },
    {
      id: "fssai-3",
      category: "fssai",
      question: "How long is an FSSAI License valid?",
      answer: "An FSSAI license or registration can be issued for a period ranging from 1 year up to 5 years, as requested by the business owner. It must be renewed at least 30 days before its expiry date."
    },

    // MSME
    {
      id: "msme-1",
      category: "msme",
      question: "What is MSME / Udyam Registration?",
      answer: "Udyam Registration is a free government portal registration that issues a unique identification number and certificate to Micro, Small, and Medium Enterprises to certify their status and unlock government benefits."
    },
    {
      id: "msme-2",
      category: "msme",
      question: "What are the benefits of obtaining an MSME registration?",
      answer: "Benefits include easier access to bank loans at lower interest rates, collateral-free credit, protection against delayed payments (mandatory interest if not paid in 45 days), electricity tariff concessions, and preference in government tenders."
    },
    {
      id: "msme-3",
      category: "msme",
      question: "What is the classification criteria for Micro, Small, and Medium Enterprises?",
      answer: "Micro: Investment < ₹1 Cr & Turnover < ₹5 Cr. Small: Investment < ₹10 Cr & Turnover < ₹50 Cr. Medium: Investment < ₹50 Cr & Turnover < ₹250 Cr. Both investment and turnover metrics must be met."
    },

    // ROC
    {
      id: "roc-1",
      category: "roc",
      question: "What is ROC annual compliance and why is it mandatory?",
      answer: "Registrar of Companies (ROC) annual compliance refers to filing statutory returns (AOC-4 for financial statements, MGT-7 for annual return) every year with the Ministry of Corporate Affairs to keep the company active and compliant."
    },
    {
      id: "roc-2",
      category: "roc",
      question: "What are the consequences of non-compliance with ROC regulations?",
      answer: "Non-compliance attracts heavy daily penalties (₹100 per day per form), disqualification of directors, and risk of the company being struck off (de-registered) by the ROC."
    },
    {
      id: "roc-3",
      category: "roc",
      question: "What is Director's KYC (DIR-3 KYC) and when is the due date?",
      answer: "Every individual holding a Director Identification Number (DIN) must file DIR-3 KYC annually on or before September 30th to update their identity details and keep their DIN active."
    },

    // Client Portal
    {
      id: "portal-1",
      category: "portal",
      question: "How do I track the progress of my order or filings?",
      answer: "Simply log into the Legomark Client Portal using your credentials. Navigate to the 'Orders' page to view real-time task progress, milestone updates, and pending documents."
    },
    {
      id: "portal-2",
      category: "portal",
      question: "How do I upload my documents securely?",
      answer: "Inside your dashboard, go to the active order, click on 'Upload Documents', and drag-and-drop the required files (such as PAN, Aadhaar, etc.). All documents are encrypted and kept confidential."
    },
    {
      id: "portal-3",
      category: "portal",
      question: "Can I download my final certificates from the portal?",
      answer: "Yes, once our experts complete your filing, all incorporation certificates, tax returns, or trademark registrations are uploaded to your client portal under the 'Documents' or 'Orders' segment for permanent download."
    },

    // Billing
    {
      id: "bill-1",
      category: "billing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, Net Banking, UPI (GPay, PhonePe, Paytm), and direct bank transfers (NEFT/IMPS/RTGS). All payments are routed through secure, PCI-compliant gateways."
    },
    {
      id: "bill-2",
      category: "billing",
      question: "Are there any hidden charges in your service pricing?",
      answer: "No, transparency is our core principle. The prices displayed on our platform are final. Any professional fee, GST, or statutory government filing fees are clearly broken down before checkout."
    },
    {
      id: "bill-3",
      category: "billing",
      question: "What is your refund policy if my application gets rejected?",
      answer: "We offer a structured refund policy. If an application cannot be filed due to a technical error on our side, we will refund our professional fee in full. However, statutory government fees paid to the MCA/Tax department are non-refundable once processed."
    },

    // General
    {
      id: "gen-1",
      category: "general",
      question: "Who will handle my corporate filing or registration?",
      answer: "Your application will be handled by a dedicated corporate consultant and verified by qualified Chartered Accountants (CAs), Company Secretaries (CSs), and corporate lawyers in our expert compliance panel."
    },
    {
      id: "gen-2",
      category: "general",
      question: "Can I convert a Sole Proprietorship into a Private Limited Company?",
      answer: "Yes, a sole proprietorship can be easily converted into a Private Limited Company or LLP by incorporating a new company and executing an agreement to transfer assets and liabilities."
    },
    {
      id: "gen-3",
      category: "general",
      question: "How can I reach Legomark support for urgent issues?",
      answer: "You can contact us via our priority support desk at support@legomarkindia.com, call our office line at +91 75308 47878, or chat directly with your dedicated advisor on WhatsApp."
    }
  ];

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Modal Form State
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultName, setConsultName] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultDate, setConsultDate] = useState("");
  const [consultTime, setConsultTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle Accordion
  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Filter FAQs based on category & search
  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Free Consultation Booking
  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim()) {
      toast.error("Please enter your name", "Validation Error");
      return;
    }
    if (!consultPhone.trim() || consultPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number", "Validation Error");
      return;
    }
    if (!consultDate || !consultTime) {
      toast.error("Please select a date and time slot", "Validation Error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        `Consultation Booked! A senior legal advisor will call you on ${consultPhone} on ${consultDate} during the ${consultTime} slot.`,
        "Consultation Confirmed!"
      );
      setConsultName("");
      setConsultPhone("");
      setConsultDate("");
      setConsultTime("");
      setConsultModalOpen(false);
    }, 1200);
  };

  return (
    <div className="flex-1 bg-slate-50 font-sans" id="faq-page-container">
      {/* 1. HERO HEADER */}
      <section className="relative bg-brand-primary-950 text-white overflow-hidden py-20 lg:py-24" id="faq-hero">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Ambient background glow elements */}
        <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-brand-secondary-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest text-brand-secondary-400 bg-brand-secondary-500/10 border border-brand-secondary-500/20 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-brand-secondary-400 animate-pulse" />
            Instant Knowledge Desk
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-none">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-semibold">
            Find answers to the most common questions about our legal, taxation, and business consultancy services. Managed by expert CAs, CSs, and corporate attorneys.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-xl mx-auto relative mt-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search compliance topics, licenses, or portal terms..."
              className="w-full pl-12 pr-4.5 py-4 bg-slate-900/80 backdrop-blur border border-slate-700/60 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-secondary-500 focus:ring-1 focus:ring-brand-secondary-500 transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold font-mono text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTERS & ACCORDIONS CONTAINER */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="faq-interactive-catalog">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Category Navigation Buttons (Desktop) */}
          <div className="lg:col-span-3 space-y-2 lg:sticky lg:top-24 bg-white/50 border border-slate-200/60 p-4 rounded-2xl shadow-sm">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-extrabold px-3 mb-3">Topic Categories</p>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setOpenFaq(null);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer select-none ${
                      isActive
                        ? "bg-brand-primary-950 text-white shadow-md shadow-brand-primary-950/10"
                        : "bg-transparent text-slate-600 hover:bg-slate-200/50"
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 shrink-0 ${isActive ? "text-brand-secondary-400" : "text-slate-400"}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic FAQ List Accordions */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-display font-black text-brand-primary-950 tracking-tight">
                {categories.find((c) => c.id === activeCategory)?.label}
                <span className="ml-2 text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500">
                  {filteredFaqs.length} Questions
                </span>
              </h3>
              {searchQuery && (
                <p className="text-xs text-slate-500 font-semibold italic">
                  Showing results for "{searchQuery}"
                </p>
              )}
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl p-8 space-y-4">
                <div className="mx-auto h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h4 className="text-base font-extrabold text-brand-primary-950">No questions found matching your search</h4>
                <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto leading-normal">
                  Try widening your search terms, filtering by 'All Questions', or reach out to our legal advisors directly.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer font-mono uppercase tracking-wider"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3" id="faq-accordions-group">
                {filteredFaqs.map((faq) => {
                  const isOpen = openFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-md ${
                        isOpen ? "border-brand-secondary-300 ring-1 ring-brand-secondary-200" : "border-slate-200"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                      >
                        <span className="text-xs sm:text-sm font-extrabold text-brand-primary-950 tracking-tight pr-2">
                          {faq.question}
                        </span>
                        <div className={`h-6 w-6 rounded bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200/80 transition-transform duration-200 ${isOpen ? "rotate-180 bg-brand-secondary-50 text-brand-primary-950" : ""}`}>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </button>

                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-[300px] border-t border-slate-100" : "max-h-0 pointer-events-none opacity-0"
                        } overflow-hidden`}
                      >
                        <div className="p-5 bg-slate-50/60">
                          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. "STILL HAVE QUESTIONS?" SECTION */}
      <section className="bg-brand-primary-950 py-16 md:py-20 relative overflow-hidden" id="faq-still-have-questions">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />
        <div className="absolute top-0 left-10 h-64 w-64 rounded-full bg-brand-secondary-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="mx-auto h-12 w-12 bg-brand-secondary-500/10 border border-brand-secondary-500/20 text-brand-secondary-400 rounded-2xl flex items-center justify-center shadow-lg">
            <HelpCircle className="h-6 w-6 animate-pulse" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight">
              Still Have Questions?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-semibold">
              Don't stress over complex compliance codes or statutory legal forms. Get high-touch, offline-quality digital consultation from India's premium legal advisory desk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleBookConsultation}
              className="w-full sm:w-auto px-6 py-3.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-brand-primary-950 font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl shadow-brand-secondary-500/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Free Consultation</span>
            </button>
            
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-4 w-4 text-brand-secondary-400" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FREE CONSULTATION SCHEDULER MODAL */}
      {consultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-200 relative">
            {/* Top Color Ribbon */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-secondary-500 to-amber-500" />

            {/* Close Button */}
            <button
              onClick={() => setConsultModalOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
            >
              ✕
            </button>

            <form onSubmit={handleConsultSubmit} className="p-6 md:p-8 space-y-5 text-left">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 px-2 py-0.5 rounded border border-brand-secondary-100">
                  Priority Access
                </span>
                <h3 className="text-xl md:text-2xl font-display font-black text-brand-primary-950 tracking-tight mt-1">
                  Schedule Free Consultation
                </h3>
                <p className="text-slate-500 text-[11px] leading-normal font-semibold">
                  A corporate specialist will call you at your preferred slot.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-secondary-500 focus:ring-1 focus:ring-brand-secondary-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit phone number"
                    value={consultPhone}
                    onChange={(e) => setConsultPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-secondary-500 focus:ring-1 focus:ring-brand-secondary-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={consultDate}
                      onChange={(e) => setConsultDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-secondary-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Time Slot *</label>
                    <select
                      required
                      value={consultTime}
                      onChange={(e) => setConsultTime(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-secondary-500 transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.1em_1.1em] bg-[right_0.75rem_center] bg-no-repeat cursor-pointer"
                    >
                      <option value="">Select time</option>
                      <option value="10 AM - 12 PM">10 AM - 12 PM</option>
                      <option value="12 PM - 2 PM">12 PM - 2 PM</option>
                      <option value="2 PM - 4 PM">2 PM - 4 PM</option>
                      <option value="4 PM - 6 PM">4 PM - 6 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-brand-primary-950 hover:bg-brand-secondary-600 text-white hover:text-brand-primary-950 font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <span>Confirm Reservation</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400 font-semibold pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Secure details &middot; Zero consultation fee</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
