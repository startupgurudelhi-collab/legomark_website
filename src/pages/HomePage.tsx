/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  BadgeCheck,
  Shield,
  Clock,
  Coins,
  MapPin,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  FileCheck,
  Zap,
  Check,
  PhoneCall,
  Phone,
  Mail,
  Globe,
  ConciergeBell,
  Lock,
  Monitor,
  Smile,
  Play,
  X,
  Quote
} from "lucide-react";
import { useToast } from "../contexts/ToastContext.js";
import { initialTestimonials } from "../data/adminStore.js";
import { useBrandMedia } from "../hooks/useBrandMedia.js";
import { useBooking } from "../hooks/useBooking.js";
import { Button } from "../components/Button.js";
import { Card, CardContent } from "../components/Card.js";
import { Section } from "../components/Section.js";
import { Modal } from "../components/Modal.js";

// --- Sub-data structures for Future CMS Alignment ---

const popularCategories = [
  {
    id: "company",
    title: "Company Registration",
    icon: Layers,
    description: "Incorporate Private Limited, OPC, LLP, or Partnership firms with seamless documentation and state approvals.",
    href: "/services/company-registration",
    color: "bg-brand-primary-50 text-brand-primary-600 border-brand-primary-100",
  },
  {
    id: "gst",
    title: "GST Registration & Filings",
    icon: FileCheck,
    description: "Fast-tracked GST certificate allocation, periodic return filings, and seamless state/central compliance management.",
    href: "/services/tax-compliance/gst-reg",
    color: "bg-brand-secondary-50 text-brand-secondary-600 border-brand-secondary-100",
  },
  {
    id: "trademark",
    title: "Trademark Protection",
    icon: Shield,
    description: "Guard your unique business name, logo, and slogan against duplication with expert legal filing and representation.",
    href: "/services/trademark/registration",
    color: "bg-green-50 text-green-600 border-green-100",
  },
  {
    id: "licenses",
    title: "Business Licenses",
    icon: Award,
    description: "Procure mandatory regional trade permits, FSSAI food certificates, MSME registration, and IEC import-export codes.",
    href: "/services/licenses",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    id: "compliance",
    title: "Tax & Compliance",
    icon: FileText,
    description: "End-to-end accounting assistance, annual corporate filings, income tax return preparation, and TDS reporting.",
    href: "/services/tax-compliance",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
];

const whyChooseUs = [
  {
    title: "Expert Professionals",
    description: "Our dedicated network of Chartered Accountants, Company Secretaries, and legal attorneys manage your filings professionally.",
    icon: Users,
  },
  {
    title: "Fast Processing",
    description: "Powered by smart automation and optimized filing pipelines to eliminate unnecessary delay in company or brand setup.",
    icon: Zap,
  },
  {
    title: "Transparent Pricing",
    description: "Upfront pricing schedules with no hidden statutory surcharges or unannounced service fees. Honest legal consultation.",
    icon: Coins,
  },
  {
    title: "PAN India Services",
    description: "Completely digital and remote processing. No physical courier runs, servicing startups in all 28 states and 8 union territories.",
    icon: MapPin,
  },
  {
    title: "Dedicated Support",
    description: "Every client is assigned a designated relationship manager who provides real-time updates and handholds your onboarding.",
    icon: MessageSquare,
  },
  {
    title: "Secure Process",
    description: "We employ banking-grade cloud security standards. Your proprietary documents, trade files, and PAN data are fully encrypted.",
    icon: Shield,
  },
];

const steps = [
  {
    num: "01",
    title: "Free Expert Consultation",
    description: "Schedule an introductory discussion to define matching legal structures and compliance checklist for your model.",
  },
  {
    num: "02",
    title: "Secure Document Collection",
    description: "Upload basic credentials, identity proofs, and landlord agreements on our secure portals under expert guidance.",
  },
  {
    num: "03",
    title: "Government Processing",
    description: "Our legal consultants draft paperwork, apply for digital tokens, and coordinate with administrative registrars.",
  },
  {
    num: "04",
    title: "Delivery & Compliance",
    description: "Receive certified government documents, corporate IDs, active certificates, and customized compliance calendars.",
  },
];

const stats = [
  { label: "Happy Corporate Clients", count: "25,000+", icon: Users },
  { label: "Businesses Registered", count: "12,000+", icon: CheckCircle2 },
  { label: "GST Returns Handled", count: "18,000+", icon: FileCheck },
  { label: "Trademarks Protected", count: "5,500+", icon: Shield },
];

const packages = [
  {
    name: "Private Limited Startup Pack",
    price: "₹4,999",
    billing: "excluding government stamp duty",
    popular: true,
    features: [
      "2 Digital Signature Certificates (DSC)",
      "2 Director Identification Numbers (DIN)",
      "Name Approval application draft",
      "Spice+ Form Filing with MCA",
      "Corporate PAN & TAN Allocation",
      "Standard Memorandum & Articles drafting",
      "EPFO & ESIC registration codes",
    ],
  },
  {
    name: "GST Registration Package",
    price: "₹999",
    billing: "All inclusive setup fee",
    popular: false,
    features: [
      "Expert verification of rent/utility proof",
      "GST application preparation",
      "Filing on the official GST Common Portal",
      "Handling official clarification queries",
      "GST Registration Certificate delivery",
      "Initial GST return filing handbook",
    ],
  },
  {
    name: "Trademark Application Pack",
    price: "₹1,999",
    billing: "plus official government fees",
    popular: false,
    features: [
      "Comprehensive trademark search report",
      "Accurate trademark class selection",
      "Filing Form TM-A with IP India",
      "Use of 'TM' symbol allocation",
      "Regular tracking updates",
      "Initial attorney drafting and verification",
    ],
  },
];

// Testimonial CMS values are fetched dynamically from the backend and initialized using the admin store default list.

const faqs = [
  {
    question: "What is a Private Limited Company, and why should I choose it?",
    answer: "A Private Limited Company is India's most popular business structure. It offers limited liability protection to its shareholders, has a distinct legal identity, and is highly preferred by venture capitalists and financial institutions for funding.",
  },
  {
    question: "How long does it take to register a company in India?",
    answer: "On average, it takes about 7 to 12 working days to get a company registered, depending on government processing speeds, prompt document submission, and MCA name approval cycles.",
  },
  {
    question: "What documents are required for GST registration?",
    answer: "You typically need the owner/partners' PAN card, Aadhaar card, photograph, proof of business address (like a recent utility bill, municipal khata, or rent agreement along with a No Objection Certificate from the property owner).",
  },
  {
    question: "Can I register a company completely online?",
    answer: "Yes, the entire company registration process is 100% digital. You do not need to physically visit our office or any government building. You can securely upload and sign documents electronically.",
  },
  {
    question: "Are there any hidden costs in the packages listed?",
    answer: "No, we maintain absolute pricing transparency. Our service fee is fixed. State-specific government stamp duties, MCA portal fees, and statutory fees are calculated transparently and shown to you before final submission.",
  },
  {
    question: "What happens after my company is registered?",
    answer: "After registration, you must open a corporate bank account, appoint the first auditor within 30 days, deposit the share capital, and file for Commencement of Business (Form INC-20A) before starting operations.",
  },
];

const blogPosts = [
  {
    title: "Understanding GST Return Filing: A Guide for MSMEs",
    excerpt: "Learn the difference between GSTR-1, GSTR-3B, and GSTR-4, and discover how to avoid common penalties under India's Goods and Services Tax law.",
    date: "June 24, 2026",
    readTime: "5 min read",
    category: "Taxation",
  },
  {
    title: "How to Protect Your Brand Name: Trademark Registration 101",
    excerpt: "Your brand is your identity. Learn the step-by-step process of securing your trademark under the Trade Marks Act, 1999 and handling examiner objections.",
    date: "June 18, 2026",
    readTime: "7 min read",
    category: "Intellectual Property",
  },
  {
    title: "LLP vs Private Limited Company: Which is Right for Your Startup?",
    excerpt: "An in-depth comparison of LLP and Pvt Ltd regarding tax implications, funding flexibility, annual compliance requirements, and setup costs.",
    date: "June 10, 2026",
    readTime: "6 min read",
    category: "Business Setup",
  },
];

const clientLogos = [
  "Tata Group (Partner)", "Mahindra Co.", "Swiggy Delivery", "Zomato India", "Razorpay Tech", "HDFC Corporate"
];

const optimizeLogoUrl = (url: string): string => {
  if (!url) return "";
  if (url.includes("unsplash.com")) {
    let optimized = url.replace(/w=\d+/g, "w=600");
    optimized = optimized.replace(/q=\d+/g, "q=90");
    return optimized;
  }
  return url;
};

export default function HomePage() {
  const { config: brandConfig } = useBrandMedia();
  const toast = useToast();
  const { handleBookConsultation } = useBooking();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [buyNowDetails, setBuyNowDetails] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: ""
  });
  const [isProcessingBuyNow, setIsProcessingBuyNow] = useState(false);
  const [enquiredPackage, setEnquiredPackage] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string | null>(null);
  const [textCarouselIndex, setTextCarouselIndex] = useState(0);
  const [logosList, setLogosList] = useState<any[]>([]);
  const [dynamicTestimonials, setDynamicTestimonials] = useState<any[]>(initialTestimonials);

  // Load client logos and testimonials from CMS on mount
  useEffect(() => {
    fetch("/api/cms/config")
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          if (res.data.logos) {
            setLogosList(res.data.logos.filter((l: any) => l.status !== "Inactive"));
          }
          if (res.data.testimonials) {
            setDynamicTestimonials(res.data.testimonials);
          }
        }
      })
      .catch(err => console.error("Failed to load CMS config on homepage", err));
  }, []);

  const videoTestimonials = dynamicTestimonials.filter(t => t.videoUrl && t.videoUrl.trim() !== "" && t.status !== "Draft");
  const textTestimonials = dynamicTestimonials.filter(t => (!t.videoUrl || t.videoUrl.trim() === "") && t.status !== "Draft");

  const videoDisplayList = [...videoTestimonials];
  if (videoDisplayList.length < 4) {
    const needed = 4 - videoDisplayList.length;
    for (let i = 0; i < needed; i++) {
      videoDisplayList.push({
        id: `placeholder-${i}`,
        isPlaceholder: true
      });
    }
  }

  const handleNextText = () => {
    if (textTestimonials.length === 0) return;
    setTextCarouselIndex((prev) => (prev + 1) % textTestimonials.length);
  };

  const handlePrevText = () => {
    if (textTestimonials.length === 0) return;
    setTextCarouselIndex((prev) => (prev - 1 + textTestimonials.length) % textTestimonials.length);
  };

  const getVisibleCards = () => {
    if (textTestimonials.length === 0) return [];
    const cards = [];
    const limit = Math.min(3, textTestimonials.length);
    for (let i = 0; i < limit; i++) {
      cards.push(textTestimonials[(textCarouselIndex + i) % textTestimonials.length]);
    }
    return cards;
  };
  const visibleCards = getVisibleCards();

  // Dynamic SEO & JSON-LD updates on load/change
  useEffect(() => {
    // 1. Tab Title
    document.title = "Legomark India | Private Limited Company Registration & GST Filing";

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Legomark India (Efilingg) is India's premier online legal and business consultancy, managing corporate formation, private limited registration, trademark registry, and tax filing.");

    // 3. Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", "Company Registration, Private Limited Company, GST Registration, GST Filing, Trademark, MSME License, FSSAI, Legomark, Efilingg");

    // 4. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", window.location.origin + "/#/");

    // 5. Inject JSON-LD Schema
    const scriptId = "jsonld-home-schema";
    let schemaScript = document.getElementById(scriptId) as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = scriptId;
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LegalService",
      "name": "Legomark India",
      "alternateName": "Efilingg",
      "description": "Enterprise-grade digital legal and business filing consultancy in India, facilitating instant incorporation, trademarking, and tax filings.",
      "url": window.location.origin + "/#/",
      "logo": window.location.origin + (brandConfig.logo.url || "/logo.png"),
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-75308-47878",
        "contactType": "Customer Service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "D-561, Pocket 11, DDA Janta Flats, Jasola",
        "addressLocality": "New Delhi",
        "addressRegion": "Delhi",
        "postalCode": "110025",
        "addressCountry": "IN"
      },
      "priceRange": "₹999 - ₹15000"
    });

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  // Lead capture states
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadService, setLeadService] = useState("Company Registration");

  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !leadEmail) {
      toast.error("Please fill in all the required fields.", "Form Incomplete");
      return;
    }
    // Validation matches corporate standards
    if (leadPhone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit phone number.", "Invalid Phone");
      return;
    }
    
    setIsSubmittingLead(true);
    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formType: "Homepage Enquiry",
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          service: leadService,
          message: `Interested in package/service: ${leadService}`
        })
      });
      
      const resData = await response.json();
      if (response.ok && resData.success) {
        toast.success(
          `Thank you ${leadName}! Our expert advisor will call you within 15 minutes regarding ${leadService}.`,
          "Consultation Booked!"
        );
        // Clear form
        setLeadName("");
        setLeadPhone("");
        setLeadEmail("");
        setIsConsultationModalOpen(false);
        setEnquiredPackage(null);
      } else {
        toast.error(resData.message || "Failed to submit enquiry. Please try again.", "Submission Failed");
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      toast.error("Network error. Could not connect to the server.", "Submission Failed");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleEnquiryClick = (packageName: string) => {
    setEnquiredPackage(packageName);
    setLeadService(packageName);
    setIsConsultationModalOpen(true);
  };

  // Helper to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNowClick = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsBuyNowOpen(true);
  };

  const handleBuyNowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    if (!buyNowDetails.name || !buyNowDetails.email || !buyNowDetails.phone) {
      toast.error("Please fill in all required fields.", "Incomplete Form");
      return;
    }

    setIsProcessingBuyNow(true);

    try {
      // Extract price digits
      const priceDigits = selectedPackage.price.replace(/[^\d]/g, "");
      const numericPrice = parseInt(priceDigits, 10);

      let associatedService = "Company Setup";
      let packageId = "pkg_pvt_ltd";

      if (selectedPackage.name.toLowerCase().includes("gst")) {
        associatedService = "GST Registration";
        packageId = "pkg_gst_reg";
      } else if (selectedPackage.name.toLowerCase().includes("trademark")) {
        associatedService = "Trademark Registration";
        packageId = "pkg_tm_app";
      }

      // Create Razorpay public order
      const orderRes = await fetch("/api/payments/public-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          packageName: selectedPackage.name,
          price: numericPrice,
          service: associatedService,
          customerDetails: buyNowDetails
        })
      }).then(r => r.json());

      if (!orderRes.success) {
        throw new Error(orderRes.message || "Failed to initiate Razorpay order");
      }

      const { order, keyId, customer } = orderRes.data;

      // Load checkout script
      const scriptLoaded = await loadRazorpayScript();
      const RazorpayConstructor = (window as any).Razorpay;

      if (scriptLoaded && RazorpayConstructor) {
        const options = {
          key: keyId,
          amount: order.amount,
          currency: order.currency,
          name: "Legomark India",
          description: `Package Purchase: ${selectedPackage.name}`,
          order_id: order.id,
          prefill: {
            name: customer.name || "",
            email: customer.email || "",
            contact: customer.phone || ""
          },
          theme: {
            color: "#0F172A"
          },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch("/api/payments/public-verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  packageId,
                  packageName: selectedPackage.name,
                  price: numericPrice,
                  service: associatedService,
                  customerDetails: buyNowDetails
                })
              }).then(r => r.json());

              if (verifyRes.success) {
                toast.success(`Payment successful! Your order has been registered under invoice ${verifyRes.data?.payment?.invoiceId}.`, "Success");
                setIsBuyNowOpen(false);
                setBuyNowDetails({ name: "", email: "", phone: "", companyName: "" });
              } else {
                toast.error(verifyRes.message || "Verification failed.", "Signature Alert");
              }
            } catch (err) {
              toast.error("Internal payment verification response failed.", "Error");
            }
          }
        };

        const rzp = new RazorpayConstructor(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error(`Payment failed: ${response.error.description}`, "Transaction Terminated");
        });
        rzp.open();
      } else {
        // Fallback simulation mode
        toast.info("Opening Razorpay Sandbox Simulation", "Sandbox Active");
        
        const mockPaymentId = `pay_sim_${Math.random().toString(36).substring(2, 10)}`;
        const mockSignature = `sig_sim_${Math.random().toString(36).substring(2, 20)}`;

        const verifyRes = await fetch("/api/payments/public-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: order.id,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: mockSignature,
            packageId,
            packageName: selectedPackage.name,
            price: numericPrice,
            service: associatedService,
            customerDetails: buyNowDetails
          })
        }).then(r => r.json());

        if (verifyRes.success) {
          toast.success(`Razorpay simulation payment verified! Your order has been registered successfully.`, "Success");
          setIsBuyNowOpen(false);
          setBuyNowDetails({ name: "", email: "", phone: "", companyName: "" });
        } else {
          toast.error(verifyRes.message || "Simulation failed.", "Signature Failure");
        }
      }

    } catch (err: any) {
      toast.error(err.message || "Failed to initialize Razorpay checkout");
    } finally {
      setIsProcessingBuyNow(false);
    }
  };

  const nextTestimonial = () => {
    if (textTestimonials.length === 0) return;
    setCurrentTestimonial((prev) => (prev + 1) % textTestimonials.length);
  };

  const prevTestimonial = () => {
    if (textTestimonials.length === 0) return;
    setCurrentTestimonial((prev) => (prev - 1 + textTestimonials.length) % textTestimonials.length);
  };

  return (
    <div className="font-sans selection:bg-brand-secondary-100 selection:text-brand-secondary-950" id="homepage-root">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white pt-12 md:pt-20 lg:pt-24 pb-16 md:pb-24 border-b border-slate-100" id="hero-section">
        {/* Abstract subtle background decorations (No flashy gradients or glassmorphism) */}
        <div className="absolute top-0 right-0 h-[450px] w-[450px] bg-slate-50 rounded-full blur-3xl -z-10 opacity-70" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] bg-slate-100 rounded-full blur-2xl -z-10 opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
              
              {/* Trust Badge / Google Rating */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 bg-slate-100/80 border border-slate-200/50 px-3.5 py-1.5 rounded-full" id="google-rating-badge">
                <div className="flex items-center gap-0.5 text-brand-secondary-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  Rated 4.8★ by 5,000+ Indian Businesses
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-extrabold tracking-tight text-brand-primary-950 leading-[1.15]">
                India&apos;s Premier Corporate Advisory &amp;{" "}
                <span className="text-brand-secondary-500">Compliance Partner</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                We streamline Private Limited incorporations, GST filings, trademark registrations, and annual corporate compliance. Handled completely online by expert Chartered Accountants and Company Secretaries.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto font-semibold tracking-wide flex items-center gap-2 shadow-sm"
                  onClick={handleBookConsultation}
                  id="hero-primary-cta"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Book Free Consultation</span>
                </Button>
                <a href="#popular-services" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto font-semibold border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                    id="hero-secondary-cta"
                  >
                    Explore Services
                  </Button>
                </a>
              </div>

              {/* Trust badges row */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-left" id="hero-trust-badges">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-brand-secondary-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">ISO 9001:2015 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-brand-secondary-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">100% Secure Process</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="h-4.5 w-4.5 text-brand-secondary-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">No Hidden Statutory Costs</span>
                </div>
              </div>

            </div>

            {/* Right Column: Premium Corporate Presentation Panel */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end" id="hero-graphics-container">
              <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-xl p-6 md:p-8 space-y-6 transition-all hover:shadow-2xl">
                
                {/* Logo & Branding */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100" id="hero-corporate-logo-block">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-0.5 border border-slate-150 shadow-md">
                    <img
                      key={brandConfig.logo.url}
                      src={brandConfig.logo.url || "/logo.png"}
                      alt="Legomark India Logo"
                      className="h-full w-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = "true";
                          target.src = "/logo.png";
                        }
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg tracking-tight text-brand-primary-950">
                      LEGOMARK <span className="text-brand-secondary-500">INDIA</span>
                    </h3>
                    <p className="font-sans text-[10px] tracking-wider text-slate-500 uppercase font-semibold">
                      Legal, Taxation &amp; Corporate Advisory
                    </p>
                  </div>
                </div>

                {/* Office Details */}
                <div className="space-y-4" id="hero-corporate-office-info">
                  <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                    National Headquarters
                  </h4>

                  <div className="space-y-3.5">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-brand-primary-950 shrink-0">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider">Office Address</span>
                        <span className="text-xs text-slate-700 font-medium leading-relaxed">
                          D-561, Pocket 11, DDA Janta Flats, Jasola, New Delhi – 110025
                        </span>
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-brand-primary-950 shrink-0">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider">Contact Number</span>
                        <div className="flex flex-col">
                          <a href="tel:+917530847878" className="text-xs text-brand-primary-950 hover:text-brand-secondary-500 font-bold transition-colors">
                            +91 75308 47878 (Mobile)
                          </a>
                          <a href="tel:01145768289" className="text-xs text-brand-primary-950 hover:text-brand-secondary-500 font-bold transition-colors">
                            011-45768289 (Landline)
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Official Email */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-brand-primary-950 shrink-0">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider">Official Email</span>
                        <a href="mailto:info@legomarkindia.com" className="text-xs text-slate-700 hover:text-brand-secondary-500 font-medium transition-colors">
                          info@legomarkindia.com
                        </a>
                      </div>
                    </div>

                    {/* Website */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-brand-primary-950 shrink-0">
                        <Globe className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider">Official Websites</span>
                        <div className="flex flex-col gap-0.5">
                          <a href="https://www.legomarkindia.com" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-700 hover:text-brand-secondary-500 font-medium transition-colors">
                            www.legomarkindia.com
                          </a>
                          <a href="https://www.legomark.com" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-700 hover:text-brand-secondary-500 font-medium transition-colors">
                            www.legomark.com
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Office Hours */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-brand-primary-950 shrink-0">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider">Office Hours</span>
                        <span className="text-xs text-slate-700 font-medium">
                          Monday to Sunday: 11:00 AM - 8:00 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2" id="hero-panel-rating-block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">4.8★ Rating</span>
                    <div className="flex items-center gap-0.5 text-brand-secondary-500">
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    Google Verified
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.5 MEET OUR FOUNDER SECTION */}
      <section className="py-16 bg-white border-b border-slate-100" id="meet-our-founder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 p-8 md:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
              
              {/* Founder Image column */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative group">
                  {/* Decorative border */}
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand-primary-950 to-brand-secondary-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                  
                  {/* Image container */}
                  <div className="relative h-64 w-64 md:h-72 md:w-72 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md">
                    <img
                      src={brandConfig.founderPhoto.url}
                      alt="Nomaan Rizvi - Founder & Managing Director of Legomark India"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105 animate-fade-in"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Trust Badge overlay */}
                  <div className="absolute -bottom-4 right-4 bg-brand-primary-950 text-white text-[10px] font-bold font-mono tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-lg border border-brand-primary-800">
                    LEGOMARK FOUNDER
                  </div>
                </div>
              </div>

              {/* Founder Details column */}
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-brand-secondary-600 uppercase">Leadership</span>
                  <h3 className="text-2xl md:text-3xl font-display font-extrabold text-brand-primary-950 tracking-tight">
                    Meet Our Founder
                  </h3>
                  <div className="h-1 w-12 bg-brand-secondary-500 rounded" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-bold font-display text-slate-950">Nomaan Rizvi</h4>
                  <p className="text-sm font-semibold text-brand-secondary-600 font-mono">Founder &amp; Managing Director</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Legomark India</p>
                </div>

                <p className="text-sm md:text-base text-slate-600 leading-relaxed font-sans">
                  Leading Legomark India with a vision to simplify company registration, taxation, trademark protection and business compliance through transparent, technology-driven professional services.
                </p>

                {/* Expertise grid */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Core Expertise</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Company Registration",
                      "GST Compliance",
                      "Trademark Protection",
                      "Taxation Services",
                      "Corporate Compliance",
                      "Business Advisory"
                    ].map((exp, expIdx) => (
                      <div key={expIdx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-150/60 shadow-sm hover:border-brand-secondary-300 transition-colors">
                        <Check className="h-4 w-4 text-brand-secondary-500 shrink-0" />
                        <span className="text-xs font-semibold text-slate-700">{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* OFFICE SHOWCASE SECTION */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="office-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column (Content) - 45% / 5 cols on lg */}
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

            {/* Right Column (Image Container) - 55% / 7 cols on lg */}
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
          <div className="mt-12 bg-slate-50 border border-slate-150 rounded-xl px-6 py-4 flex flex-wrap justify-center md:justify-between items-center gap-y-3 gap-x-6">
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

      {/* 2. POPULAR SERVICES SECTION */}
      <section className="py-16 md:py-24 bg-slate-50/50 border-b border-slate-100" id="popular-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 md:mb-16">
            <h2 className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase">Our Offerings</h2>
            <h3 className="text-3xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Popular Service Categories
            </h3>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              We manage all your government-related compliance under a single roof, backed by transparent workflows. Select a category below to explore details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6" id="popular-services-grid">
            {popularCategories.map((category) => {
              const IconComp = category.icon;
              return (
                <Card
                  key={category.id}
                  className="flex flex-col h-full bg-white transition-all hover:translate-y-[-4px] border border-slate-200/80 hover:border-brand-primary-200 shadow-sm"
                  id={`service-category-card-${category.id}`}
                >
                  <CardContent className="flex flex-col h-full p-6 space-y-4">
                    {/* Icon container */}
                    <div className={`h-11 w-11 rounded-lg border flex items-center justify-center shrink-0 ${category.color}`}>
                      <IconComp className="h-5.5 w-5.5" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <h4 className="text-base font-bold font-display text-slate-900 leading-snug">
                        {category.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-4">
                        {category.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-50">
                      <Link
                        to={category.href}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary-950 hover:text-brand-secondary-500 transition-colors"
                      >
                        <span>Explore Fees &amp; Docs</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. WHY CHOOSE LEGOMARK */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 md:mb-16">
            <h2 className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase">The Legomark Edge</h2>
            <h3 className="text-3xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Why Corporate Leaders Choose Legomark India
            </h3>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              We stand apart through digital-first processing, clear fee structures, and end-to-end support for your startup venture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="why-choose-us-grid">
            {whyChooseUs.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="flex gap-4 p-5 rounded-xl hover:bg-slate-50/50 transition-colors border border-transparent hover:border-slate-100" id={`why-us-item-${idx}`}>
                  <div className="h-10 w-10 rounded-lg bg-brand-primary-50 text-brand-primary-950 flex items-center justify-center shrink-0 border border-brand-primary-100/50">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold font-display text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. OUR PROCESS TIMELINE */}
      <section className="py-16 md:py-24 bg-slate-50/50 border-b border-slate-100" id="our-process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 md:mb-16">
            <h2 className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase">Seamless Setup</h2>
            <h3 className="text-3xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Our 4-Step Onboarding Pipeline
            </h3>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              Our refined digital process makes legal setup convenient, transparent, and absolutely stress-free.
            </p>
          </div>

          <div className="relative" id="process-timeline-container">
            {/* Horizontal connect line for desktop layout */}
            <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-slate-200 -z-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4" id={`process-step-${idx}`}>
                  {/* Number Bubble */}
                  <div className="h-14 w-14 rounded-full bg-brand-primary-950 text-white font-display font-bold text-lg flex items-center justify-center border-4 border-white shadow-md relative">
                    <span>{step.num}</span>
                    <span className="absolute -bottom-1 h-1.5 w-1.5 bg-brand-secondary-500 rounded-full" />
                  </div>

                  {/* Step Info */}
                  <div className="space-y-2 max-w-xs px-2 lg:px-0">
                    <h4 className="text-base font-bold font-display text-slate-900 leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-500 font-sans">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. BUSINESS STATISTICS */}
      <section className="bg-brand-primary-950 text-white py-12 md:py-16 border-y border-brand-primary-900 relative overflow-hidden" id="business-stats">
        {/* Subtle grid decoration */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center" id="stats-grid">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div key={idx} className="space-y-2 p-4 rounded-xl hover:bg-white/5 transition-colors" id={`stat-box-${idx}`}>
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary-900 text-brand-secondary-400 border border-brand-primary-800/40">
                    <IconComp className="h-4.5 w-4.5" />
                  </div>
                  <p className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                    {stat.count}
                  </p>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FEATURED PACKAGES */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="featured-packages">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 md:mb-16">
            <h2 className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase">Fixed Pricing</h2>
            <h3 className="text-3xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Featured Setup Packages
            </h3>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              We believe in complete pricing honesty. Clear inclusions with no unannounced fee escalations. Select a package to secure an advisor call.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto" id="pricing-packages-grid">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col rounded-2xl border bg-white p-6 md:p-8 space-y-6 transition-all hover:shadow-xl ${
                  pkg.popular
                    ? "border-brand-secondary-500 shadow-md ring-1 ring-brand-secondary-500/20"
                    : "border-slate-200/80 shadow-sm"
                }`}
                id={`package-card-${idx}`}
              >
                {pkg.popular && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 bg-brand-secondary-500 text-white text-[10px] font-bold font-mono tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}

                <div className="space-y-2">
                  <h4 className="text-lg font-bold font-display text-brand-primary-950 leading-tight">
                    {pkg.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-display font-extrabold text-slate-900">{pkg.price}</span>
                    <span className="text-[11px] text-slate-400 font-mono">service fee</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase italic">{pkg.billing}</p>
                </div>

                {/* Features Checklist */}
                <div className="flex-1 space-y-4">
                  <div className="h-px bg-slate-100" />
                  <p className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Inclusions</p>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-600 font-sans">
                        <Check className="h-4 w-4 text-brand-secondary-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-50 space-y-2">
                  <Button
                    variant={pkg.popular ? "secondary" : "primary"}
                    className="w-full font-bold text-xs py-2.5"
                    onClick={() => handleBuyNowClick(pkg)}
                    id={`package-buy-now-${idx}`}
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full font-bold text-xs py-2"
                    onClick={() => handleEnquiryClick(pkg.name)}
                    id={`package-enquiry-${idx}`}
                  >
                    Enquire About Pack
                  </Button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-slate-50/50 border-b border-slate-100" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 md:mb-16">
            <h2 className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase">Reviews</h2>
            <h3 className="text-3xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Client Success Stories
            </h3>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              See what entrepreneurs, startups and businesses across India say about their experience with Legomark India.
            </p>
          </div>

          {/* TRUST BAR */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 md:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center max-w-5xl mx-auto mb-16" id="testimonial-trust-bar">
            <div className="flex flex-col items-center justify-center space-y-1 p-2">
              <div className="flex items-center gap-1 text-orange-500 text-lg justify-center">
                <Star className="h-4.5 w-4.5 fill-current" />
                <span className="font-bold text-slate-900 font-display text-base">4.9 Rating</span>
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-mono font-medium">★★★★★ Average</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1 p-2 border-l border-slate-100 max-sm:border-l-0">
              <span className="text-2xl font-black text-brand-primary-950 font-display">5000+</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-mono font-medium">Happy Clients</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1 p-2 border-l border-slate-100 max-lg:border-l-0 max-sm:border-t max-sm:pt-4">
              <span className="text-2xl font-black text-brand-primary-950 font-display">10000+</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-mono font-medium">Compliance Services</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1 p-2 border-l border-slate-100 max-sm:border-l-0 max-sm:border-t max-sm:pt-4">
              <span className="text-2xl font-black text-brand-primary-950 font-display">98%</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-mono font-medium">Client Satisfaction</span>
            </div>
          </div>

          {/* VIDEO TESTIMONIALS GALLERY */}
          <div className="space-y-6 mb-16" id="video-testimonials-section">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <div>
                <h4 className="text-lg font-bold font-display text-brand-primary-950">Video Testimonials</h4>
                <p className="text-xs text-slate-500">Watch founders share their digital transformation story.</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest px-2.5 py-1 bg-white border border-slate-200 rounded-md">
                {videoTestimonials.length} Active • {Math.max(0, 4 - videoTestimonials.length)} Pending
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoDisplayList.map((video) => {
                if (video.isPlaceholder) {
                  return (
                    <div
                      key={video.id}
                      className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center aspect-[4/3] bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 mb-2">
                        <Play className="h-4 w-4 stroke-[1.5]" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Future Video Slot</span>
                      <span className="text-[10px] text-slate-300 mt-1">Placeholder ready</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={video.id}
                    className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                    onClick={() => {
                      setActiveVideoUrl(video.videoUrl || "");
                      setActiveVideoTitle(`${video.clientName || "Client"} - ${video.company || "Company"}`);
                    }}
                  >
                    <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden bg-slate-900">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={`${video.clientName || "Client"}'s video story`}
                          className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary-900/40 to-brand-secondary-900/20 opacity-80" />
                      )}
                      <div className="absolute inset-0 bg-slate-950/20" />
                      
                      <div className="h-12 w-12 rounded-full bg-white/95 text-brand-primary-950 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 z-10">
                        <Play className="h-5 w-5 fill-current ml-0.5 text-brand-secondary-600" />
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wider">
                          {video.serviceUsed || "Company registration"}
                        </span>
                        <h5 className="font-display font-bold text-slate-900 text-sm mt-2 leading-tight">
                          {video.clientName}
                        </h5>
                        <p className="text-xs text-slate-500 font-medium">
                          {video.company}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono font-medium">
                        <span>{video.designation || "Director"}</span>
                        <span className="text-brand-secondary-600 font-bold group-hover:underline flex items-center gap-0.5">
                          Watch story <ArrowRight className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TEXT TESTIMONIALS CAROUSEL */}
          <div className="space-y-6" id="text-testimonials-section">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <div>
                <h4 className="text-lg font-bold font-display text-brand-primary-950">Written Endorsements</h4>
                <p className="text-xs text-slate-500">Verified reviews from SME owners and founders across India.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevText}
                  className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-brand-secondary-500 shadow-sm transition-colors cursor-pointer"
                  aria-label="Previous Text Testimonial"
                  id="text-testimonial-prev-btn"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextText}
                  className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-brand-secondary-500 shadow-sm transition-colors cursor-pointer"
                  aria-label="Next Text Testimonial"
                  id="text-testimonial-next-btn"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCards.map((review, index) => {
                const displayClass = index === 0 ? "block" : index === 1 ? "hidden md:block" : "hidden lg:block";
                
                return (
                  <div
                    key={review.id || index}
                    className={`${displayClass} bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col h-full justify-between`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-0.5 text-orange-500">
                        {Array.from({ length: review.rating || review.stars || 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>

                      <p className="text-slate-600 text-xs md:text-sm italic font-sans leading-relaxed relative z-10">
                        &ldquo;{review.content}&rdquo;
                      </p>
                    </div>

                    <div className="border-t border-slate-150 pt-4 mt-6 flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {review.thumbnailUrl && (
                            <img
                              src={review.thumbnailUrl}
                              alt={review.clientName || review.name}
                              className="h-10 w-10 rounded-full object-cover border border-slate-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div>
                            <h5 className="font-display font-bold text-slate-900 text-sm">
                              {review.clientName || review.name}
                            </h5>
                            <p className="text-[11px] text-slate-500">
                              {review.company}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-100 py-0.5 px-2 rounded-full shrink-0">
                          {review.designation || review.location || "Founder"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                        <span className="text-brand-secondary-600 font-bold">{review.serviceUsed || review.service || "Consultancy"}</span>
                        <span>{review.date || "Verified Client"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-4">
              {textTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTextCarouselIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    textCarouselIndex === idx ? "bg-brand-secondary-500 w-4" : "bg-slate-300 w-1.5"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 8. CLIENT LOGOS */}
      {(() => {
        const marqueeItems = logosList.length > 0
          ? logosList.map(logo => ({ id: logo.id, clientName: logo.clientName, imageUrl: logo.imageUrl }))
          : clientLogos.map((name, i) => ({ id: `fallback-${i}`, clientName: name, imageUrl: "" }));
        
        if (marqueeItems.length === 0) return null;

        // Duplicate list until we have at least 15 items to ensure seamless animation loop width
        let repeated = [...marqueeItems];
        while (repeated.length < 15) {
          repeated = [...repeated, ...marqueeItems];
        }

        return (
          <section className="py-16 bg-white border-b border-slate-100 overflow-hidden" id="client-logos">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
              <p className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                TRUSTED BY CORPORATE BRANDS &amp; SME ALLIANCES
              </p>
              
              <div 
                className="relative w-full overflow-hidden flex flex-nowrap items-center whitespace-nowrap" 
                id="client-logos-marquee-wrapper"
              >
                <div className="flex flex-nowrap items-center w-max animate-marquee">
                  {/* Group 1 */}
                  <div className="flex flex-nowrap items-center gap-10 md:gap-16 shrink-0 pr-10 md:pr-16">
                    {repeated.map((logo, idx) => (
                      <div
                        key={`g1-${logo.id || idx}-${idx}`}
                        className="flex items-center justify-center h-20 md:h-28 px-4 transition-all duration-300 hover:scale-105 shrink-0"
                        style={{ transform: "none" }}
                      >
                        {logo.imageUrl ? (
                          <img
                            src={optimizeLogoUrl(logo.imageUrl)}
                            alt={logo.clientName}
                            className="h-[75%] md:h-[80%] max-w-[200px] md:max-w-[320px] object-contain select-none"
                            style={{ transform: "none" }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-lg md:text-2xl font-display font-extrabold text-slate-500 tracking-tight transition-colors duration-300 hover:text-brand-primary-950">
                            {logo.clientName}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Group 2 */}
                  <div className="flex flex-nowrap items-center gap-10 md:gap-16 shrink-0 pr-10 md:pr-16" aria-hidden="true">
                    {repeated.map((logo, idx) => (
                      <div
                        key={`g2-${logo.id || idx}-${idx}`}
                        className="flex items-center justify-center h-20 md:h-28 px-4 transition-all duration-300 hover:scale-105 shrink-0"
                        style={{ transform: "none" }}
                      >
                        {logo.imageUrl ? (
                          <img
                            src={optimizeLogoUrl(logo.imageUrl)}
                            alt={logo.clientName}
                            className="h-[75%] md:h-[80%] max-w-[200px] md:max-w-[320px] object-contain select-none"
                            style={{ transform: "none" }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-lg md:text-2xl font-display font-extrabold text-slate-500 tracking-tight transition-colors duration-300 hover:text-brand-primary-950">
                            {logo.clientName}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 9. GOOGLE REVIEWS UI PLACEHOLDER */}
      <section className="py-12 bg-slate-50 border-b border-slate-100" id="google-reviews">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1">
                <span className="text-2xl font-bold text-slate-800">4.8</span>
                <div className="flex items-center text-brand-secondary-500">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <h4 className="text-lg font-bold font-display text-brand-primary-950">Google Business Verified Profile</h4>
              <p className="text-xs text-slate-500">Based on verified audits of 5,000+ client submissions in Karnataka, Maharashtra, Delhi &amp; Tamil Nadu.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
              <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100 min-w-[120px]">
                <span className="block text-2xl font-bold font-display text-brand-primary-950">99.2%</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Success Rate</span>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100 min-w-[120px]">
                <span className="block text-2xl font-bold font-display text-brand-primary-950">&lt; 12 Days</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Avg Clearance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. LATEST BLOGS */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="latest-blogs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 md:mb-16">
            <h2 className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase">Knowledge Center</h2>
            <h3 className="text-3xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Latest Legal Insights &amp; Updates
            </h3>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              Stay ahead of company law revisions, GST notification updates, and IP protection guidelines in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blogs-grid">
            {blogPosts.map((post, idx) => (
              <Card
                key={idx}
                className="flex flex-col bg-white border border-slate-200/85 hover:border-brand-primary-200 shadow-sm transition-all hover:shadow-md"
                id={`blog-card-${idx}`}
              >
                <CardContent className="p-6 flex flex-col h-full space-y-4">
                  {/* Category & Read Time header */}
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="text-brand-secondary-600 font-bold uppercase">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <h4 className="text-base font-bold font-display text-slate-900 leading-snug hover:text-brand-secondary-500 transition-colors">
                      <Link to={`/blogs`}>{post.title}</Link>
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {post.date}
                    </span>
                    <Link
                      to={`/blogs`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary-950 hover:text-brand-secondary-500 transition-colors"
                    >
                      <span>Read More</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* 11. FAQ ACCORDION PREVIEW */}
      <section className="py-16 md:py-24 bg-slate-50/50 border-b border-slate-100" id="faqs-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 md:mb-16">
            <h2 className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase">Support Hub</h2>
            <h3 className="text-3xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              Have questions about corporate registration steps, statutory requirements, or taxation limits? Find quick answers below.
            </p>
          </div>

          <div className="space-y-3" id="faq-accordion-list">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/80 rounded-xl overflow-hidden transition-all shadow-sm hover:border-slate-300"
                  id={`faq-item-${idx}`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-sm md:text-base text-slate-800 hover:text-brand-secondary-500 transition-colors cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-slate-400 shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-brand-secondary-500" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-500 leading-relaxed border-t border-slate-50 font-sans animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 12. FINAL CTA CONVERSION BANNER */}
      <section className="py-16 md:py-20 bg-brand-primary-950 text-white relative overflow-hidden" id="final-cta">
        {/* Subtle geometric circle details */}
        <div className="absolute top-0 right-0 h-[250px] w-[250px] bg-brand-primary-900 rounded-full blur-3xl -z-10 opacity-40" />
        <div className="absolute bottom-0 left-0 h-[200px] w-[200px] bg-brand-secondary-950 rounded-full blur-3xl -z-10 opacity-30" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-xs font-mono font-bold tracking-widest text-brand-secondary-400 uppercase">
            SPEAK WITH AN ADVISOR
          </h2>
          <h3 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-snug max-w-2xl mx-auto">
            Ready to Incorporate Your Business or File Compliance Returns?
          </h3>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Schedule a completely free, 15-minute diagnostic call with our legal consultants to establish matching classes, check name availability, and map registration compliance.
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

      {/* VIDEO PLAYER OVERLAY MODAL */}
      {activeVideoUrl && (
        <div className="fixed inset-0 bg-slate-950/85 flex items-center justify-center z-[150] p-4 animate-in fade-in duration-200" id="video-player-modal">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full relative border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150 bg-slate-50">
              <h3 className="font-display font-bold text-slate-900 text-sm md:text-base truncate">
                {activeVideoTitle || "Client Success Story"}
              </h3>
              <button
                onClick={() => {
                  setActiveVideoUrl(null);
                  setActiveVideoTitle(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-150 transition-colors cursor-pointer"
                aria-label="Close Video Player"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-slate-950 flex items-center justify-center">
              <video
                src={activeVideoUrl}
                controls
                className="w-full h-full max-h-[60vh] outline-none"
                controlsList="nodownload"
                playsInline
              >
                Your browser does not support HTML5 video streaming.
              </video>
            </div>
            
            {/* Modal Footer Info */}
            <div className="px-6 py-4 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 font-bold" />
                <span>Verified Legomark India Success Story</span>
              </div>
              <button
                onClick={() => {
                  setActiveVideoUrl(null);
                  setActiveVideoTitle(null);
                }}
                className="text-xs font-bold text-brand-secondary-600 hover:text-brand-secondary-700 uppercase font-mono tracking-wider cursor-pointer"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 13. FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/917530847878?text=Hi%20Legomark%20India,%20I%20want%20to%20enquire%20about%20business%20registration%20services."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 p-3 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20ba59] transition-all duration-200 cursor-pointer hover:scale-105 group font-sans"
        id="whatsapp-floating-action"
        title="WhatsApp Consultation Support"
      >
        <MessageSquare className="h-5.5 w-5.5 fill-current shrink-0" />
        <span className="hidden md:inline text-xs font-bold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap pr-1">
          WhatsApp Advisor
        </span>
      </a>

      {/* LEAD CONSULTATION MODAL DIALOG */}
      <Modal
        isOpen={isConsultationModalOpen}
        onClose={() => {
          setIsConsultationModalOpen(false);
          setEnquiredPackage(null);
        }}
        title={enquiredPackage ? `Enquire: ${enquiredPackage}` : "Book Free Diagnostic Consultation"}
        size="md"
      >
        <form onSubmit={handleLeadSubmit} className="space-y-4" id="consultation-lead-form">
          <p className="text-xs text-slate-500 leading-relaxed">
            Fill in your operational details below. A designated senior consultant from our Bengaluru/Delhi team will call you within 15 working minutes to handhold your inquiries.
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
              {enquiredPackage && <option value={enquiredPackage}>{enquiredPackage}</option>}
            </select>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="secondary" className="w-full font-bold" disabled={isSubmittingLead}>
              {isSubmittingLead ? "Submitting Request..." : "Submit Request"}
            </Button>
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center pt-2">
            By submitting, you agree to receive official call backs and WhatsApp alerts from Legomark representatives.
          </div>
        </form>
      </Modal>

      {/* 2. Buy Now Customer Details Modal */}
      <Modal
        isOpen={isBuyNowOpen}
        onClose={() => setIsBuyNowOpen(false)}
        title={selectedPackage ? `Checkout: ${selectedPackage.name}` : "Secure Package Purchase"}
        size="md"
      >
        <form onSubmit={handleBuyNowSubmit} className="space-y-4" id="buy-now-form">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-xs font-mono font-bold text-slate-400 uppercase">Package Selected</p>
              <h4 className="text-sm font-bold text-brand-primary-950 font-display">
                {selectedPackage?.name}
              </h4>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono font-bold text-slate-400 uppercase">Service Fee</p>
              <p className="text-base font-extrabold text-slate-900 font-display">
                {selectedPackage?.price}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="buy-now-name" className="text-xs font-mono font-bold text-slate-500 block">
                Full Name *
              </label>
              <input
                type="text"
                id="buy-now-name"
                required
                placeholder="e.g. Vikram Aditya"
                value={buyNowDetails.name}
                onChange={(e) => setBuyNowDetails({ ...buyNowDetails, name: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-brand-secondary-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="buy-now-email" className="text-xs font-mono font-bold text-slate-500 block">
                Email Address *
              </label>
              <input
                type="email"
                id="buy-now-email"
                required
                placeholder="e.g. vikram@adityatech.in"
                value={buyNowDetails.email}
                onChange={(e) => setBuyNowDetails({ ...buyNowDetails, email: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-brand-secondary-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="buy-now-phone" className="text-xs font-mono font-bold text-slate-500 block">
                Phone Number *
              </label>
              <input
                type="tel"
                id="buy-now-phone"
                required
                placeholder="e.g. 9876543210"
                value={buyNowDetails.phone}
                onChange={(e) => setBuyNowDetails({ ...buyNowDetails, phone: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-brand-secondary-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="buy-now-company" className="text-xs font-mono font-bold text-slate-500 block">
                Company / Organization Name (Optional)
              </label>
              <input
                type="text"
                id="buy-now-company"
                placeholder="e.g. Aditya Tech Private Limited"
                value={buyNowDetails.companyName}
                onChange={(e) => setBuyNowDetails({ ...buyNowDetails, companyName: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-brand-secondary-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              className="w-full font-bold flex items-center justify-center gap-2"
              isLoading={isProcessingBuyNow}
            >
              Proceed to Secure Payment
            </Button>
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center pt-2">
            🔒 Fully Encrypted 256-bit SSL Connection. Legomark processes payments securely via Razorpay sandbox portals.
          </div>
        </form>
      </Modal>

    </div>
  );
}
