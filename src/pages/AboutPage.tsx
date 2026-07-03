/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  BadgeCheck,
  Shield,
  Coins,
  MapPin,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  FileCheck,
  Zap,
  Check,
  PhoneCall,
  Lock,
  Monitor,
  Smile,
  Compass,
  Eye,
  Globe,
  ConciergeBell
} from "lucide-react";
import { useToast } from "../contexts/ToastContext.js";
import { useBrandMedia } from "../hooks/useBrandMedia.js";
import { useBooking } from "../hooks/useBooking.js";
import { Button } from "../components/Button.js";
import { Card, CardContent } from "../components/Card.js";
import { Modal } from "../components/Modal.js";

const testimonials = [
  {
    name: "Karan Johar",
    role: "Co-Founder, TechVeda Solutions",
    content: "Incorporating our tech firm was incredibly easy with Legomark. We received our Certificate of Incorporation and TAN in less than 10 days! Honest, responsive, and completely digital.",
    stars: 5,
    location: "Bengaluru",
  },
  {
    name: "Priyanka Sharma",
    role: "Proprietor, OrganicBasket",
    content: "Getting my FSSAI and trademark registration done through them saved me from months of bureaucracy. Their dedicated manager took care of everything while keeping me informed via WhatsApp.",
    stars: 5,
    location: "Mumbai",
  },
  {
    name: "Vikram Rathore",
    role: "Director, Rathore Logistics",
    content: "We transitioned our compliance and GST filings to Legomark last year. Their accountants are prompt, professional, and very knowledgeable. Highly recommended for annual compliance.",
    stars: 5,
    location: "New Delhi",
  },
];

const services = [
  {
    title: "Company Registration",
    icon: Layers,
    description: "Incorporate Private Limited, One Person Company (OPC), LLP, or Partnership firms with seamless online documentation and rapid MCA approvals.",
    href: "/services/company-registration",
    color: "text-brand-primary-600 bg-brand-primary-50 border-brand-primary-100"
  },
  {
    title: "GST Registration & Filings",
    icon: FileCheck,
    description: "Fast-tracked GST registration, monthly/quarterly tax return filing, GST reconciliation, and compliance updates managed by expert accountants.",
    href: "/services/tax-compliance/gst-reg",
    color: "text-brand-secondary-600 bg-brand-secondary-50 border-brand-secondary-100"
  },
  {
    title: "Trademark Protection",
    icon: Shield,
    description: "Secure your brand identity, business logo, or slogan. We manage the entire trademark search, class selection, filing, and attorney representation.",
    href: "/services/trademark/registration",
    color: "text-green-600 bg-green-50 border-green-100"
  },
  {
    title: "Business Licenses",
    icon: Award,
    description: "Acquire mandatory operational permits including FSSAI food certificates, MSME/Udyam registration, Import Export Codes (IEC), and trade licenses.",
    href: "/services/licenses",
    color: "text-purple-600 bg-purple-50 border-purple-100"
  },
  {
    title: "Tax & Compliance",
    icon: FileText,
    description: "End-to-end accounting assistance, corporate annual filings, Director's KYC, Income Tax Return (ITR) preparation, and TDS filings.",
    href: "/services/tax-compliance",
    color: "text-blue-600 bg-blue-50 border-blue-100"
  }
];

export default function AboutPage() {
  const { config: brandConfig } = useBrandMedia();
  const toast = useToast();
  const { handleBookConsultation } = useBooking();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  
  // Lead form state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadService, setLeadService] = useState("Company Registration");

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !leadEmail) {
      toast.error("Please fill in all the required fields.", "Form Incomplete");
      return;
    }
    // Phone validation
    const cleanPhone = leadPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number.", "Invalid Phone");
      return;
    }

    toast.success(
      "Thank you for reaching out. A Legomark Advisor will contact you within 15 minutes.",
      "Request Submitted!"
    );
    setIsConsultationModalOpen(false);
    // Clear form
    setLeadName("");
    setLeadPhone("");
    setLeadEmail("");
  };

  return (
    <div className="flex-1 bg-slate-50 font-sans" id="about-page-root">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-primary-950 text-white overflow-hidden py-20 lg:py-28" id="about-hero">
        {/* Abstract background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Soft radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-secondary-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex px-3 py-1 text-xs font-mono font-semibold text-brand-secondary-400 bg-brand-primary-900/60 rounded-full border border-brand-secondary-500/20 mb-6">
            ESTABLISHED CORPORATE ADVISORY
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-none">
            About <span className="text-brand-secondary-400">Legomark India</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Helping Entrepreneurs, Startups and Businesses Build, Protect & Grow.
          </p>
        </div>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="who-we-are">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase block">
                  Introduction
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
                  Simplifying Corporate Law &amp; Operational Compliance
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-base">
                Legomark India is a premier enterprise-grade corporate legal advisory and compliance platform designed to automate and simplify business startup processes across India. By combining deep legal experience with technology-driven automation, we enable entrepreneurs, startups, and established companies to easily navigate the complex landscapes of company registration, intellectual property protection, tax filing, and corporate governance.
              </p>
              <p className="text-slate-600 leading-relaxed text-base">
                Our core operational thesis is anchored on trust, absolute transparency, technology enablement, and robust statutory compliance. We have built an integrated digital ecosystem where founders can securely upload documentation, interact directly with senior corporate consultants, monitor government filing updates in real-time, and download verified compliance certificates without leaving their desks.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full bg-brand-secondary-50 flex items-center justify-center text-brand-secondary-600 shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Technology Driven</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Automated document engines and instant tracking.</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full bg-brand-secondary-50 flex items-center justify-center text-brand-secondary-600 shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Attorney Backed</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Every single file verified by a professional.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-150 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-brand-primary-950 text-white rounded-lg flex items-center justify-center">
                    <Award className="h-5.5 w-5.5" />
                  </div>
                  <h4 className="text-lg font-bold font-display text-slate-950">Corporate Compliance Partner</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Startups prefer Legomark India because we eliminate the traditionally complex back-and-forth email chains, hidden agent fee structures, and government follow-up headaches. Our digital workflow secures direct liaison with statutory authorities for seamless name approvals, GST certs, and trademark allotments.
                </p>
                <div className="border-t border-slate-200/60 pt-6 flex items-center gap-6 justify-between">
                  <div>
                    <span className="text-3xl font-display font-black text-brand-primary-950">100%</span>
                    <span className="text-xs text-slate-500 block font-mono font-medium mt-1 uppercase">Paperless Workflow</span>
                  </div>
                  <div>
                    <span className="text-3xl font-display font-black text-brand-primary-950">24/7</span>
                    <span className="text-xs text-slate-500 block font-mono font-medium mt-1 uppercase">Client Portal Access</span>
                  </div>
                  <div>
                    <span className="text-3xl font-display font-black text-brand-primary-950">Zero</span>
                    <span className="text-xs text-slate-500 block font-mono font-medium mt-1 uppercase">Hidden Service Fees</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-100" id="mission-vision">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Mission Card */}
            <Card className="border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow bg-white rounded-2xl flex flex-col h-full" id="mission-card">
              <CardContent className="p-8 md:p-10 flex flex-col h-full space-y-6">
                <div className="h-12 w-12 rounded-xl bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                  <Compass className="h-6 w-6 text-brand-secondary-600" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-2xl font-bold font-display text-slate-900">Our Mission</h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                    Our mission is to simplify business registration and statutory compliance for startups and SMEs across India by merging professional legal expertise with modern, transparent, technology-driven automated workflows. We strive to reduce entry barriers for aspiring entrepreneurs, ensuring legal documentation and company filings are rapid, robust, and 100% digital.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow bg-white rounded-2xl flex flex-col h-full" id="vision-card">
              <CardContent className="p-8 md:p-10 flex flex-col h-full space-y-6">
                <div className="h-12 w-12 rounded-xl bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                  <Eye className="h-6 w-6 text-brand-secondary-600" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-2xl font-bold font-display text-slate-900">Our Vision</h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                    Our vision is to be India's most trusted corporate legal and advisory platform, enabling every aspiring entrepreneur to seamlessly launch, grow, and scale their enterprise without compliance hurdles. We look forward to a digitized corporate environment where filing and government compliance transition from operational burdens to strategic advantages.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* 4. MEET OUR FOUNDER */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="meet-our-founder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            
            {/* Founder Image column */}
            <div className="md:col-span-5 flex justify-center order-2 md:order-1">
              <div className="relative group">
                {/* Decorative element */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-brand-secondary-500 to-brand-primary-900 opacity-20 blur-lg transition duration-500 group-hover:opacity-30" />
                
                {/* Image container */}
                <div className="relative h-64 w-64 md:h-72 md:w-72 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md">
                  <img
                    src={brandConfig.founderPhoto.url}
                    alt="Nomaan Rizvi - Founder & Managing Director of Legomark India"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Founder Details column */}
            <div className="md:col-span-7 space-y-6 order-1 md:order-2">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase block">
                  Meet Our Founder
                </span>
                <h3 className="text-3xl font-display font-extrabold text-brand-primary-950 tracking-tight">Nomaan Rizvi</h3>
                <p className="text-sm font-semibold text-brand-secondary-600 font-mono">Founder &amp; Managing Director</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Legomark India</p>
              </div>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-sans">
                Leading Legomark India with a vision to simplify company registration, taxation, trademark protection and business compliance through transparent, technology-driven professional services.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-50 text-slate-800 border border-slate-200 shrink-0">
                    <Check className="h-3 w-3 text-brand-secondary-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Specialized Legal &amp; Corporate Expertise</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-50 text-slate-800 border border-slate-200 shrink-0">
                    <Check className="h-3 w-3 text-brand-secondary-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Direct Compliance Integration Advisory</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE LEGOMARK INDIA */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-100" id="why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase block">
              Core Strengths
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Why Choose Legomark India
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Providing modern enterprise-grade legal, business, and taxation advisory services across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                <Users className="h-5 w-5 text-brand-secondary-600" />
              </div>
              <h4 className="text-base font-bold font-display text-slate-950">Experienced Professionals</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                Our in-house CA, CS, and corporate law attorneys review every file to ensure compliant statutory application filing.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                <Coins className="h-5 w-5 text-brand-secondary-600" />
              </div>
              <h4 className="text-base font-bold font-display text-slate-950">Transparent Pricing</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                No hidden state duties, no surprise billing cycles. Honest consultation fees displayed upfront prior to checking out.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                <FileCheck className="h-5 w-5 text-brand-secondary-600" />
              </div>
              <h4 className="text-base font-bold font-display text-slate-950">End-to-End Compliance</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                From basic formation and PAN/TAN allocations to complex GST returns, trademarks, audits, and statutory board resolutions.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                <PhoneCall className="h-5 w-5 text-brand-secondary-600" />
              </div>
              <h4 className="text-base font-bold font-display text-slate-950">Dedicated Support</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                Get assigned a designated account manager on call and WhatsApp to handhold your inquiries throughout the process.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                <Lock className="h-5 w-5 text-brand-secondary-600" />
              </div>
              <h4 className="text-base font-bold font-display text-slate-950">Secure Documentation</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                Your private corporate data, identity, PAN/Aadhaar credentials, and draft files are kept under strict operational security guidelines.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                <Globe className="h-5 w-5 text-brand-secondary-600" />
              </div>
              <h4 className="text-base font-bold font-display text-slate-950">Pan India Services</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                servicing client filing needs dynamically across all 28 Indian states, union territories, and global business entries.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. OUR SERVICES */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="our-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase block">
              Capabilities
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Our Services Portfolio
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              A comprehensive view of the legal, financial, and regulatory automation services we deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => {
              const IconComponent = svc.icon;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-start text-left hover:border-brand-primary-200 hover:shadow-sm transition-all group">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center border shrink-0 mb-5 ${svc.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-bold font-display text-slate-950 group-hover:text-brand-secondary-600 transition-colors">
                    {svc.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed mt-2 flex-1">
                    {svc.description}
                  </p>
                  <Link to={svc.href} className="mt-5 text-xs font-bold font-mono text-brand-secondary-600 hover:text-brand-secondary-700 flex items-center gap-1.5 uppercase tracking-wider">
                    Learn More <ChevronRight className="h-3 w-3 stroke-[2.5]" />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. OFFICE SHOWCASE */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-100" id="office-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column (Content) - 45% */}
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase block">
                  Our Office
                </span>
                <h3 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight leading-tight">
                  Professional Workspace.<br />
                  <span className="text-brand-secondary-600">Trusted Environment.</span>
                </h3>
                <p className="text-slate-600 leading-relaxed font-sans text-sm md:text-base">
                  Step inside Legomark India and experience a professional workspace designed to deliver reliable legal, taxation and business consultancy services with complete transparency and client confidence.
                </p>
              </div>

              {/* Left Column Trust Badges */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary-50 text-brand-primary-900 border border-brand-primary-100 shrink-0">
                    <Check className="h-3 w-3 text-brand-secondary-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">New Delhi Headquarters</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary-50 text-brand-primary-900 border border-brand-primary-100 shrink-0">
                    <Check className="h-3 w-3 text-brand-secondary-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">State-of-the-Art Operations Centre</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary-50 text-brand-primary-900 border border-brand-primary-100 shrink-0">
                    <Check className="h-3 w-3 text-brand-secondary-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Strict Data Privacy Guardrails</span>
                </div>
              </div>
            </div>

            {/* Right Column (Image Container) - 55% */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md aspect-[16/10] w-full">
                <img
                  src={brandConfig.officeMain.url}
                  alt="Legomark India Office Premises"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.015]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>

          {/* Premium Feature Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-12 md:mt-16">
            
            {/* Card 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                <ConciergeBell className="h-5 w-5 text-brand-secondary-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display text-slate-900 leading-snug">
                  Professional Reception
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans mt-1">
                  Welcoming guest lounge and professional helpdesk.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                <Lock className="h-5 w-5 text-brand-secondary-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display text-slate-900 leading-snug">
                  Private Consultation Cabin
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans mt-1">
                  Confidential meeting rooms for private corporate advising.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                <Monitor className="h-5 w-5 text-brand-secondary-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display text-slate-900 leading-snug">
                  Dedicated Workspace
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans mt-1">
                  Modern technology-enabled systems for rapid execution.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-brand-primary-50 text-brand-primary-900 flex items-center justify-center border border-brand-primary-100 shrink-0">
                <Smile className="h-5 w-5 text-brand-secondary-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display text-slate-900 leading-snug">
                  Client Friendly Environment
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans mt-1">
                  Humble, professional team focusing on seamless client onboarding.
                </p>
              </div>
            </div>

          </div>

          {/* Trust Strip */}
          <div className="mt-12 bg-white border border-slate-200 rounded-xl px-6 py-4 flex flex-wrap justify-center md:justify-between items-center gap-y-3 gap-x-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-brand-secondary-500 shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-slate-700">Experienced Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-brand-secondary-500 shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-slate-700">Confidential Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-brand-secondary-500 shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-slate-700">Comfortable Meeting Space</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-brand-secondary-500 shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-slate-700">Technology Enabled Services</span>
            </div>
          </div>

        </div>
      </section>

      {/* 8. HOW WE WORK (TIMELINE) */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="how-we-work">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase block">
              Our Process
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              A Seamless Advisory Timeline
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              From our first diagnostic call to government certification delivery.
            </p>
          </div>

          {/* Timeline Structure */}
          <div className="relative max-w-5xl mx-auto pt-6" id="process-timeline">
            
            {/* Horizontal line for desktop, hidden on mobile */}
            <div className="hidden lg:block absolute top-[68px] left-8 right-8 h-0.5 bg-slate-150 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-3 bg-slate-50 lg:bg-transparent p-5 lg:p-0 rounded-xl border border-slate-150 lg:border-none">
                <div className="h-14 w-14 rounded-full bg-brand-primary-950 text-white flex items-center justify-center font-display font-black text-lg border-4 border-white shadow-md">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-display text-slate-900">Consultation</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Schedule a free online diagnostic call to discuss your business filing needs.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-3 bg-slate-50 lg:bg-transparent p-5 lg:p-0 rounded-xl border border-slate-150 lg:border-none">
                <div className="h-14 w-14 rounded-full bg-brand-primary-950 text-white flex items-center justify-center font-display font-black text-lg border-4 border-white shadow-md">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-display text-slate-900">Documentation</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload your digital KYC documents securely to our client panel.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-3 bg-slate-50 lg:bg-transparent p-5 lg:p-0 rounded-xl border border-slate-150 lg:border-none">
                <div className="h-14 w-14 rounded-full bg-brand-primary-950 text-white flex items-center justify-center font-display font-black text-lg border-4 border-white shadow-md">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-display text-slate-900">Verification</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our CAs and attorneys review and verify all operational papers for zero errors.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center space-y-3 bg-slate-50 lg:bg-transparent p-5 lg:p-0 rounded-xl border border-slate-150 lg:border-none">
                <div className="h-14 w-14 rounded-full bg-brand-primary-950 text-white flex items-center justify-center font-display font-black text-lg border-4 border-white shadow-md">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-display text-slate-900">Government Filing</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Legomark submits filings directly on government MCA/IP/GST servers.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center space-y-3 bg-slate-50 lg:bg-transparent p-5 lg:p-0 rounded-xl border border-slate-150 lg:border-none">
                <div className="h-14 w-14 rounded-full bg-brand-primary-950 text-white flex items-center justify-center font-display font-black text-lg border-4 border-white shadow-md">
                  5
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-display text-slate-900">Approval</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tracking of department processing with quick query resolution.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col items-center text-center space-y-3 bg-slate-50 lg:bg-transparent p-5 lg:p-0 rounded-xl border border-slate-150 lg:border-none">
                <div className="h-14 w-14 rounded-full bg-brand-secondary-500 text-white flex items-center justify-center font-display font-black text-lg border-4 border-white shadow-md">
                  6
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-display text-slate-900">Certificate Delivery</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Download your approved certificates immediately from the client portal.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 9. COMPANY HIGHLIGHTS */}
      <section className="bg-brand-primary-950 text-white py-16 relative overflow-hidden" id="company-highlights">
        {/* Decorative circle glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-secondary-500/10 rounded-full blur-[80px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
          
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary-400 uppercase block">
              Performance Track Record
            </span>
            <h2 className="text-3xl font-display font-extrabold tracking-tight">
              Legomark India in Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            
            {/* Stat 1 */}
            <div className="bg-brand-primary-900/40 border border-brand-primary-800 p-5 rounded-xl text-center space-y-1.5">
              <Users className="h-5 w-5 text-brand-secondary-400 mx-auto" />
              <span className="block text-3xl font-display font-black text-white">5000+</span>
              <span className="block text-[11px] uppercase tracking-wider font-semibold font-mono text-slate-400">
                Businesses Served
              </span>
            </div>

            {/* Stat 2 */}
            <div className="bg-brand-primary-900/40 border border-brand-primary-800 p-5 rounded-xl text-center space-y-1.5">
              <FileText className="h-5 w-5 text-brand-secondary-400 mx-auto" />
              <span className="block text-3xl font-display font-black text-white">10000+</span>
              <span className="block text-[11px] uppercase tracking-wider font-semibold font-mono text-slate-400">
                Compliance Filings
              </span>
            </div>

            {/* Stat 3 */}
            <div className="bg-brand-primary-900/40 border border-brand-primary-800 p-5 rounded-xl text-center space-y-1.5">
              <Smile className="h-5 w-5 text-brand-secondary-400 mx-auto" />
              <span className="block text-3xl font-display font-black text-white">98%</span>
              <span className="block text-[11px] uppercase tracking-wider font-semibold font-mono text-slate-400">
                Client Satisfaction
              </span>
            </div>

            {/* Stat 4 */}
            <div className="bg-brand-primary-900/40 border border-brand-primary-800 p-5 rounded-xl text-center space-y-1.5">
              <Calendar className="h-5 w-5 text-brand-secondary-400 mx-auto" />
              <span className="block text-3xl font-display font-black text-white">8+</span>
              <span className="block text-[11px] uppercase tracking-wider font-semibold font-mono text-slate-400">
                Years of Experience
              </span>
            </div>

            {/* Stat 5 */}
            <div className="col-span-2 md:col-span-1 bg-brand-primary-900/40 border border-brand-primary-800 p-5 rounded-xl text-center space-y-1.5">
              <MapPin className="h-5 w-5 text-brand-secondary-400 mx-auto" />
              <span className="block text-3xl font-display font-black text-white">Pan India</span>
              <span className="block text-[11px] uppercase tracking-wider font-semibold font-mono text-slate-400">
                Service Network
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-100" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase block">
              Client Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Testimonials from Indian Founders
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Read real-life reviews from Indian entrepreneurs who automated their statutory filings via Legomark.
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative px-10" id="testimonials-slider-box">
            
            {/* Active Testimonial Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm relative z-10 text-center space-y-5">
              <div className="flex justify-center gap-1">
                {Array.from({ length: testimonials[currentTestimonial].stars }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-brand-secondary-500 fill-current" />
                ))}
              </div>

              <p className="text-slate-700 font-sans italic text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                &ldquo;{testimonials[currentTestimonial].content}&rdquo;
              </p>

              <div>
                <h4 className="font-display font-bold text-slate-900 text-base">
                  {testimonials[currentTestimonial].name}
                </h4>
                <p className="text-xs text-brand-secondary-600 font-semibold font-mono mt-0.5">
                  {testimonials[currentTestimonial].role}
                </p>
                <span className="inline-block mt-2 bg-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono px-2 py-0.5 rounded">
                  {testimonials[currentTestimonial].location}
                </span>
              </div>
            </div>

            {/* Slider Controls */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              aria-label="Previous Testimonial"
              id="testimonial-prev-btn"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              aria-label="Next Testimonial"
              id="testimonial-next-btn"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Slider Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentTestimonial === idx ? "bg-brand-secondary-500 w-4" : "bg-slate-300 w-2"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="py-16 md:py-20 bg-brand-primary-950 text-white relative overflow-hidden" id="final-cta">
        {/* Soft radial glowing spheres */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-secondary-500/10 rounded-full blur-[100px]" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Ready to Start Your Business?
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base max-w-lg mx-auto">
            Get absolute legal guidance and professional statutory filing in India. Speak with our experts and launch your compliance journey online today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto font-semibold tracking-wide"
              onClick={handleBookConsultation}
              id="final-cta-primary"
            >
              Book Free Consultation
            </Button>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto font-semibold border-brand-primary-800 text-slate-300 hover:bg-brand-primary-900 hover:text-white"
                id="final-cta-secondary"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* LEAD CONSULTATION MODAL DIALOG */}
      <Modal
        isOpen={isConsultationModalOpen}
        onClose={() => {
          setIsConsultationModalOpen(false);
        }}
        title="Book Free Diagnostic Consultation"
        size="md"
      >
        <form onSubmit={handleLeadSubmit} className="space-y-4" id="consultation-lead-form">
          <p className="text-xs text-slate-500 leading-relaxed">
            Fill in your details below. A senior compliance advisor from Legomark India will contact you within 15 working minutes to help with your corporate filing questions.
          </p>

          <div className="space-y-1">
            <label htmlFor="lead-name" className="text-xs font-mono font-bold text-slate-500 block">
              Full Name *
            </label>
            <input
              type="text"
              id="lead-name"
              required
              placeholder="e.g. Rahul Sharma"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-brand-secondary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="lead-phone" className="text-xs font-mono font-bold text-slate-500 block">
                Mobile Number *
              </label>
              <input
                type="tel"
                id="lead-phone"
                required
                placeholder="e.g. 9876543210"
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-brand-secondary-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="lead-email" className="text-xs font-mono font-bold text-slate-500 block">
                Email Address *
              </label>
              <input
                type="email"
                id="lead-email"
                required
                placeholder="e.g. rahul@example.com"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-brand-secondary-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="lead-service" className="text-xs font-mono font-bold text-slate-500 block">
              Service Requested
            </label>
            <select
              id="lead-service"
              value={leadService}
              onChange={(e) => setLeadService(e.target.value)}
              className="w-full border border-slate-200 bg-white rounded-lg p-2 text-sm outline-none focus:border-brand-secondary-500"
            >
              <option value="Company Registration">Company Registration</option>
              <option value="GST Registration & Return">GST Registration &amp; Return</option>
              <option value="Trademark Protection">Trademark Protection</option>
              <option value="Business Licenses (FSSAI, IEC)">Business Licenses (FSSAI, IEC)</option>
              <option value="Tax & Compliance (ITR, TDS)">Tax &amp; Compliance (ITR, TDS)</option>
            </select>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="secondary" className="w-full font-bold">
              Submit Request
            </Button>
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center pt-2">
            By submitting, you agree to receive official callbacks and WhatsApp alerts from Legomark representatives.
          </div>
        </form>
      </Modal>

    </div>
  );
}
