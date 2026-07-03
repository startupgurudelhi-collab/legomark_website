/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useBooking } from "../hooks/useBooking.js";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, CalendarRange, PhoneCall, Globe, ArrowRight, Send, CheckCircle2, AlertCircle, Building, Briefcase, Map, ExternalLink, MessageCircle, ChevronDown, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const location = useLocation();
  const { handleBookConsultation } = useBooking();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    service: "",
    message: "",
    agreeToTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{ leadId: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (location.search.includes("consultation") || location.hash.includes("consultation")) {
      const el = document.getElementById("enquiry-form-container");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    }
  }, [location]);

  const faqItems = [
    {
      question: "How long does Company Registration take?",
      answer: "Typically, Private Limited company registration in India takes 7 to 10 business days, subject to Ministry of Corporate Affairs (MCA) approval timelines, name availability, and document validation."
    },
    {
      question: "What documents are required?",
      answer: "For directors: PAN Card, Aadhaar Card, Passport-size photos, and identity/address proof (such as Voter ID, Passport, Driving License, Bank Statement, or Utility Bill). For the registered business office: Rent agreement, NOC from the property owner, and a recent utility bill."
    },
    {
      question: "Do you provide PAN India services?",
      answer: "Yes, Legomark India provides completely online compliance and business advisory services across all 28 states and 8 union territories of India. You don't need to visit our offices physically."
    },
    {
      question: "How does the consultation process work?",
      answer: "Once you submit an enquiry on our portal, a dedicated corporate compliance executive will contact you to understand your specific requirements, suggest the optimal corporate structure, collect your documents digitally, and initiate the processing."
    },
    {
      question: "Can I complete everything online?",
      answer: "Absolutely! The entire process—from document upload, digital signature collection, name approval, up to receiving your Certificate of Incorporation, PAN, and TAN—is 100% digital, paperless, and secure."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!formData.agreeToTerms) {
      setSubmitError("Please agree to the privacy policy to submit your enquiry.");
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone) {
      setSubmitError("Name, Email Address, and Phone Number are required fields.");
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setSubmitError("Please enter a valid 10-digit phone number.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formType: "Free Consultation",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
          service: formData.service || "Free Consultation",
          message: formData.message
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSubmitSuccess({ leadId: result.data?.leadId || "N/A" });
        setFormData({
          name: "",
          phone: "",
          email: "",
          companyName: "",
          service: "",
          message: "",
          agreeToTerms: false
        });
      } else {
        setSubmitError(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setSubmitError("Failed to connect to the server. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const scrollToEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("enquiry-form-container");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const contactCards = [
    {
      id: "card-address",
      title: "Office Address",
      icon: MapPin,
      details: [
        "D-561, Pocket 11,",
        "DDA Janta Flats,",
        "Jasola,",
        "New Delhi - 110025"
      ],
      linkText: "Get Directions",
      href: "https://maps.google.com/?q=D-561,+Pocket+11,+DDA+Janta+Flats,+Jasola,+New+Delhi+-+110025",
      color: "from-blue-500/10 to-brand-primary-500/5",
      iconColor: "text-brand-secondary-500 bg-brand-secondary-50 border-brand-secondary-100",
    },
    {
      id: "card-phone",
      title: "Phone",
      icon: Phone,
      details: [
        "+91 75308 47878",
        "011-45768289"
      ],
      linkText: "Call Support",
      href: "tel:+917530847878",
      color: "from-emerald-500/10 to-brand-primary-500/5",
      iconColor: "text-emerald-500 bg-emerald-50 border-emerald-100",
    },
    {
      id: "card-email-web",
      title: "Email & Website",
      icon: Mail,
      details: [
        "info@legomarkindia.com",
        "www.legomarkindia.com",
        "www.legomark.com"
      ],
      linkText: "Send Email",
      href: "mailto:info@legomarkindia.com",
      color: "from-purple-500/10 to-brand-primary-500/5",
      iconColor: "text-brand-primary-500 bg-brand-primary-50 border-brand-primary-100",
    },
    {
      id: "card-hours",
      title: "Business Hours",
      icon: Clock,
      details: [
        "Monday to Sunday",
        "11:00 AM – 8:00 PM"
      ],
      linkText: "Schedule Call",
      href: "tel:+917530847878",
      color: "from-amber-500/10 to-brand-primary-500/5",
      iconColor: "text-amber-500 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 selection:bg-brand-secondary-200 selection:text-brand-secondary-950 overflow-hidden" id="contact-page-container">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION 1: HERO */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-6 mb-16 md:mb-24"
          id="contact-hero-section"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
            <span className="h-2 w-2 rounded-full bg-brand-secondary-500 animate-pulse" />
            Support Desk
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-brand-primary-950 leading-tight">
            Contact Legomark India
          </h1>
          
          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            We're here to help you with Company Registration, GST, Trademark Registration, Taxation, ROC Compliance and Business Advisory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={handleBookConsultation}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white font-sans font-bold rounded-xl shadow-lg shadow-brand-secondary-500/10 hover:shadow-brand-secondary-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              id="cta-book-consultation"
            >
              <CalendarRange className="h-5 w-5" />
              Book Free Consultation
            </button>
            <a 
              href="tel:+917530847878"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-primary-950 hover:bg-brand-primary-950 hover:text-white text-brand-primary-950 font-sans font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              id="cta-call-now"
            >
              <PhoneCall className="h-5 w-5" />
              Call Now
            </a>
          </div>
        </motion.div>

        {/* SECTION 2: CONTACT INFORMATION (4 PREMIUM CARDS) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto"
          id="contact-cards-grid"
        >
          {contactCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
                id={card.id}
              >
                {/* Subtle top decoration gradient matching the theme */}
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${card.color.includes("emerald") ? "from-emerald-500 to-teal-500" : card.color.includes("purple") ? "from-purple-500 to-indigo-500" : card.color.includes("amber") ? "from-amber-500 to-orange-500" : "from-brand-secondary-500 to-brand-primary-500"}`} />
                <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />

                <div className="space-y-5">
                  {/* Premium Icon Circle */}
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center border font-bold ${card.iconColor} shadow-inner`}>
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display font-black text-lg text-brand-primary-950 tracking-tight">
                      {card.title}
                    </h3>

                    {/* Details content */}
                    <div className="space-y-1.5 font-sans">
                      {card.details.map((line, idx) => {
                        const isLinkable = line.includes("@") || line.includes("www.") || line.startsWith("+91") || line.match(/^\d+-\d+/);
                        let element = <p key={idx} className="text-slate-600 text-sm leading-relaxed">{line}</p>;

                        if (line.includes("@")) {
                          element = (
                            <a 
                              key={idx} 
                              href={`mailto:${line}`} 
                              className="text-slate-600 hover:text-brand-secondary-500 hover:underline transition-colors text-sm font-semibold break-all"
                            >
                              {line}
                            </a>
                          );
                        } else if (line.includes("www.")) {
                          const webUrl = line.startsWith("http") ? line : `https://${line}`;
                          element = (
                            <a 
                              key={idx} 
                              href={webUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-slate-600 hover:text-brand-secondary-500 hover:underline transition-colors text-sm font-semibold block"
                            >
                              {line}
                            </a>
                          );
                        } else if (line.startsWith("+91") || line.match(/^\d+-\d+/)) {
                          const telNum = line.replace(/\s+/g, "");
                          element = (
                            <a 
                              key={idx} 
                              href={`tel:${telNum}`} 
                              className="text-slate-600 hover:text-brand-secondary-500 hover:underline transition-colors text-sm font-semibold block"
                            >
                              {line}
                            </a>
                          );
                        }

                        return element;
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA bar */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <a 
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 hover:text-brand-secondary-700 uppercase flex items-center gap-1.5 group/link cursor-pointer"
                  >
                    {card.linkText}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </a>
                  <span className="text-[10px] font-mono tracking-widest text-slate-300 font-bold uppercase select-none">
                    Legomark
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* SECTION 3 & SECTION 4: MAP & ENQUIRY FORM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mt-16 md:mt-24 max-w-6xl mx-auto" id="map-form-section">
          
          {/* SECTION 3: GOOGLE MAP */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between" id="google-map-container">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-brand-primary-600 bg-brand-primary-50 border border-brand-primary-200/50">
                <Map className="h-3.5 w-3.5 text-brand-primary-500" />
                Physical Location
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-brand-primary-950 leading-tight">
                Our Corporate Headquarters
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-sans">
                Visit us at our Jasola office in New Delhi for personalized compliance consultation, trademark registrations, and legal advisory sessions.
              </p>
            </div>

            {/* Map Frame Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden p-2.5 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1 min-h-[300px] flex flex-col relative group">
              <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-100 min-h-[250px]">
                {/* Standard precise interactive Google Maps embed */}
                <iframe
                  title="Legomark India Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.5165241804245!2d77.2917726!3d28.5385616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3fa43dfcc45%3A0xc3e4e7e6e5a6f2bb!2sPocket%2011%2C%20Jasola%20Vihar%2C%20Jasola%2C%20New%20Delhi%2C%20Delhi%20110025!5e0!3m2!1sen!2sin!4v1719645000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95"
                />
              </div>

              {/* Get Directions Button */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-semibold">Jasola Vihar, New Delhi</span>
                <a
                  href="https://maps.google.com/?q=D-561,+Pocket+11,+DDA+Janta+Flats,+Jasola,+New+Delhi+-+110025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary-950 hover:bg-brand-primary-900 text-white font-sans text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Get Directions
                  <ExternalLink className="h-3 w-3 text-brand-secondary-400" />
                </a>
              </div>
            </div>
          </div>

          {/* SECTION 4: CONTACT FORM */}
          <div className="lg:col-span-7" id="enquiry-form-container">
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-primary-950 to-brand-secondary-500" />
              <div className="p-6 md:p-8 space-y-6">
                
                <div className="space-y-1.5">
                  <h3 className="font-display font-black text-xl md:text-2xl text-brand-primary-950 tracking-tight">
                    Request a Free Consultation
                  </h3>
                  <p className="text-slate-500 text-xs font-medium font-sans">
                    Submit your query and our compliance executive will respond back within 2 business hours.
                  </p>
                </div>

                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-emerald-900 font-display font-bold text-lg">Enquiry Registered!</h4>
                      <p className="text-emerald-700 text-sm leading-relaxed max-w-md mx-auto font-sans">
                        Thank you for reaching out to Legomark India. Your lead ticket has been registered in our CRM with reference ID:
                      </p>
                      <div className="inline-block bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-lg text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider">
                        #{submitSuccess.leadId}
                      </div>
                    </div>
                    <button
                      onClick={() => setSubmitSuccess(null)}
                      className="text-xs font-bold text-brand-primary-950 hover:text-brand-secondary-500 transition-colors font-mono uppercase tracking-wider underline cursor-pointer pt-2 block mx-auto"
                    >
                      Submit Another Enquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                    
                    {submitError && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2 font-semibold">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {submitError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors"
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +91 75308 47878"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. rahul@legomark.com"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors"
                        />
                      </div>

                      {/* Business Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="companyName" className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          Business Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Building className="h-4 w-4 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            id="companyName"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            placeholder="e.g. Legomark India Pvt Ltd"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Service Required */}
                    <div className="space-y-1.5">
                      <label htmlFor="service" className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                        Service Required
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Briefcase className="h-4 w-4 text-slate-400" />
                        </div>
                        <select
                          id="service"
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors appearance-none"
                        >
                          <option value="">-- Select Required Corporate Service --</option>
                          <option value="Company Registration">Company Registration (Pvt Ltd / OPC / LLP)</option>
                          <option value="GST Registration & Filing">GST Registration & Monthly Filings</option>
                          <option value="Trademark Registration">Trademark & Intellectual Property</option>
                          <option value="Taxation & Accounting">Income Tax, TDS & Corporate Audit</option>
                          <option value="ROC Compliance">ROC Annual Filing & Compliance</option>
                          <option value="Business Advisory">FSSAI, MSME & Startup India Advisory</option>
                          <option value="Other Compliance">Other Allied Business Licenses</option>
                        </select>
                      </div>
                    </div>

                    {/* Message / Requirement */}
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                        Enquiry Message
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your requirement in detail..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors resize-none"
                      />
                    </div>

                    {/* Privacy Checkbox */}
                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-brand-secondary-500 focus:ring-brand-secondary-400 mt-0.5 accent-brand-secondary-500 cursor-pointer"
                      />
                      <label htmlFor="agreeToTerms" className="text-xs text-slate-500 leading-normal select-none cursor-pointer">
                        I agree to the Privacy Policy and authorize Legomark India to contact me.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-secondary-500 hover:bg-brand-secondary-600 disabled:bg-slate-300 text-white font-sans font-bold rounded-xl shadow-lg shadow-brand-secondary-500/10 hover:shadow-brand-secondary-500/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing Enquiry...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Request Free Consultation
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: PREMIUM WHATSAPP CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 md:mt-24 max-w-6xl mx-auto"
          id="whatsapp-cta-section"
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0b3c24] via-[#0e5131] to-[#128C7E] text-white p-8 md:p-12 shadow-xl border border-emerald-800/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-[0.04] [background-size:16px_16px]" />
            
            <div className="space-y-4 max-w-2xl relative z-10 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/50 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Advisor Support
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">
                Need Immediate Assistance?
              </h2>
              <p className="text-emerald-100 text-sm md:text-base leading-relaxed font-sans font-medium">
                Skip the queue. Connect with our dedicated legal and compliance advisor directly on WhatsApp for instantaneous solutions to all your corporate queries.
              </p>
            </div>

            <div className="relative z-10 shrink-0 w-full md:w-auto">
              <a
                href="https://wa.me/917530847878?text=Hi%20Legomark%20India,%20I%20want%20to%20enquire%20about%20business%20registration%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-sans font-extrabold rounded-xl shadow-lg shadow-emerald-950/20 hover:shadow-emerald-900/30 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                id="whatsapp-cta-button"
              >
                <MessageCircle className="h-6 w-6 fill-current" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        {/* SECTION 7: FREQUENTLY ASKED QUESTIONS */}
        <div className="mt-16 md:mt-24 max-w-4xl mx-auto space-y-8" id="faq-section">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
              <HelpCircle className="h-3.5 w-3.5 text-brand-secondary-500" />
              Information Center
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-brand-primary-950">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto font-sans font-medium">
              Find instant answers to the most common queries about registering and running a business in India.
            </p>
          </div>

          <div className="space-y-4" id="faq-accordion">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:border-slate-300"
                  id={`faq-item-${idx}`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left font-sans font-bold text-brand-primary-950 hover:text-brand-secondary-500 transition-colors gap-4 outline-none cursor-pointer"
                  >
                    <span className="text-sm md:text-base tracking-tight leading-snug">{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-secondary-500" : ""}`}
                    />
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 border-t border-slate-100 text-xs md:text-sm text-slate-600 leading-relaxed font-sans font-medium">
                      {item.answer}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 8: TRUST STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 md:mt-24 max-w-6xl mx-auto bg-white border border-slate-200/80 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden"
          id="trust-strip-section"
        >
          <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
            <div className="space-y-1 md:space-y-2">
              <p className="text-3xl md:text-4xl font-display font-black text-brand-secondary-500 tracking-tight">5000+</p>
              <p className="text-xs md:text-sm font-sans font-bold text-brand-primary-950 uppercase tracking-wider">Businesses Served</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-3xl md:text-4xl font-display font-black text-brand-secondary-500 tracking-tight">10000+</p>
              <p className="text-xs md:text-sm font-sans font-bold text-brand-primary-950 uppercase tracking-wider">Compliance Services</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-3xl md:text-4xl font-display font-black text-brand-secondary-500 tracking-tight">98%</p>
              <p className="text-xs md:text-sm font-sans font-bold text-brand-primary-950 uppercase tracking-wider">Client Satisfaction</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-3xl md:text-4xl font-display font-black text-brand-secondary-500 tracking-tight">8+</p>
              <p className="text-xs md:text-sm font-sans font-bold text-brand-primary-950 uppercase tracking-wider">Years of Experience</p>
            </div>
          </div>
        </motion.div>

        {/* SECTION 9: FINAL CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 md:mt-24 max-w-6xl mx-auto"
          id="final-cta-section"
        >
          <div className="relative rounded-2xl overflow-hidden bg-brand-primary-950 text-white p-8 md:p-14 text-center space-y-8 shadow-xl border border-brand-primary-800">
            {/* Subtle premium graphic elements */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute -left-20 -top-20 w-60 h-60 bg-brand-secondary-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-brand-secondary-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 max-w-3xl mx-auto relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-brand-secondary-400 bg-white/5 border border-brand-secondary-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary-400 animate-pulse" />
                Launch Your Venture
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
                Ready to Start Your Business?
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-sans max-w-2xl mx-auto font-medium">
                Speak with our experts today and get professional guidance for your legal, taxation and compliance requirements.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
              <button
                onClick={handleBookConsultation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white font-sans font-black rounded-xl shadow-lg shadow-brand-secondary-500/20 hover:shadow-brand-secondary-500/35 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                id="final-cta-book-consultation"
              >
                <CalendarRange className="h-5 w-5" />
                Book Free Consultation
              </button>
              <a
                href="tel:+917530847878"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 hover:border-white bg-white/5 hover:bg-white/10 text-white font-sans font-black rounded-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                id="final-cta-call-now"
              >
                <PhoneCall className="h-5 w-5 text-brand-secondary-400" />
                Call Now
              </a>
            </div>
          </div>
        </motion.div>

        {/* Brand Footprint Watermark */}
        <div className="mt-16 text-center text-xs font-mono text-slate-400">
          Legomark India &bull; ISO 9001:2015 Certified &bull; Corporate Compliance Office
        </div>

      </div>
    </div>
  );
}
