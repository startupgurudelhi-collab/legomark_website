/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Check,
  Clock,
  Coins,
  Shield,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Calendar,
  FileText,
  Phone,
  MessageSquare,
  Users,
  Award,
  Zap,
  Briefcase,
  FileCheck,
  Building2,
  FileUp,
  Percent,
  TrendingUp,
  MapPin,
  Building,
  Scale,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Send,
  DollarSign,
  Laptop,
  Plus,
  Star,
  CheckSquare,
  ArrowUpRight,
  PhoneCall,
  Mail
} from "lucide-react";
import { useToast } from "../contexts/ToastContext.js";
import { useBooking } from "../hooks/useBooking.js";
import { getServiceBySlug, findServiceBySlugOnly, getEffectiveServices } from "../data/servicesData.js";
import { getEffectiveCategories, getEffectiveSubcategories } from "../data/categoriesData.js";
import { autoHyperlinkText } from "../utils/hyperlink.js";
import { PublicLayout } from "../layouts/PublicLayout.js";
import { Button } from "../components/Button.js";
import { Card, CardContent } from "../components/Card.js";
import { Input } from "../components/Input.js";

export default function ServicePage() {
  const { categorySlug, serviceSlug, serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { handleBookConsultation } = useBooking();

  // Find service dynamically using any available URL route params
  const effectiveServiceSlug = serviceSlug || serviceId || "";
  const effectiveCategorySlug = categorySlug || "";

  let service = getServiceBySlug(effectiveCategorySlug, effectiveServiceSlug);
  if (!service && effectiveServiceSlug) {
    service = findServiceBySlugOnly(effectiveServiceSlug);
  }

  const services = getEffectiveServices();
  const categories = getEffectiveCategories();
  const subcategories = getEffectiveSubcategories();

  // FAQ interactive state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Enquiry Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Consultation Modal state
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultDate, setConsultDate] = useState("");
  const [consultTime, setConsultTime] = useState("");

  // Document checklist state for progress bar tracking
  const [collectedDocs, setCollectedDocs] = useState<Record<string, boolean>>({});

  // SPRINT 7B State Variables
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [exitPromptOpen, setExitPromptOpen] = useState(false);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  // Inline callback form states
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackTime, setCallbackTime] = useState("");
  const [isCallbackSubmitting, setIsCallbackSubmitting] = useState(false);

  // Exit modal form state
  const [exitPhone, setExitPhone] = useState("");
  const [isExitSubmitting, setIsExitSubmitting] = useState(false);
  
  // Bundle submission state
  const [isBundleSubmitting, setIsBundleSubmitting] = useState(false);

  // Packages CMS state
  const [allPackages, setAllPackages] = useState<any[]>([]);
  const [cmsPackages, setCmsPackages] = useState<any[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);

  // Fetch packages from Packages CMS
  useEffect(() => {
    if (!service) return;
    setIsLoadingPackages(true);
    fetch("/api/cms/packages")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          // Support legacy records: resolve service name to Service ID once and save back
          let hasLegacy = false;
          const mapped = res.data.map((pkg: any) => {
            const matchingService = (services || []).find(
              (s: any) =>
                s.serviceName.toLowerCase() === pkg.serviceId.toLowerCase() ||
                s.id.toLowerCase() === pkg.serviceId.toLowerCase() ||
                (pkg.serviceId.toLowerCase() === "srv-pvt-ltd" && s.id === "pvt-ltd")
            );
            if (matchingService && matchingService.id !== pkg.serviceId) {
              hasLegacy = true;
              const token = localStorage.getItem("efilingg_token");
              const headers: any = { "Content-Type": "application/json" };
              if (token) headers["Authorization"] = `Bearer ${token}`;

              fetch(`/api/cms/packages/${pkg.id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                  name: pkg.name,
                  serviceId: matchingService.id,
                  price: Number(pkg.price),
                  discountPrice: pkg.discountPrice ? Number(pkg.discountPrice) : null,
                  gstPercent: Number(pkg.gstPercent),
                  displayOrder: Number(pkg.displayOrder),
                  features: pkg.features,
                  cta: pkg.cta || null
                })
              })
              .then((r) => r.json())
              .then((result) => {
                if (result.success) {
                  console.log(`Auto-migrated legacy package in ServicePage: ${pkg.id} to service ID ${matchingService.id}`);
                }
              })
              .catch((err) => console.error("Failed to migrate legacy package in ServicePage:", err));

              return { ...pkg, serviceId: matchingService.id };
            }
            return pkg;
          });

          setAllPackages(mapped);

          // Render ONLY the Packages CMS records for the current service (strictly matching service.id)
          const filtered = mapped.filter((pkg: any) => {
            return (
              pkg.serviceId === service.id ||
              (pkg.serviceId && pkg.serviceId.toLowerCase() === service.id.toLowerCase())
            );
          }).sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));

          setCmsPackages(filtered);
        } else {
          setAllPackages([]);
          setCmsPackages([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load CMS packages on ServicePage:", err);
        setAllPackages([]);
        setCmsPackages([]);
      })
      .finally(() => {
        setIsLoadingPackages(false);
      });
  }, [service?.id, service?.serviceName, services]);

  const getPrimaryServicePrice = (): number => {
    if (cmsPackages.length > 0) {
      return cmsPackages[0]?.discountPrice || cmsPackages[0]?.price;
    }
    const rawVal = service?.packages && service.packages.length > 0
      ? (service.packages[0]?.discountPrice || service.packages[0]?.price)
      : (service?.professionalFees || 0);

    if (typeof rawVal === "number") return rawVal;
    if (typeof rawVal === "string") {
      const cleaned = rawVal.replace(/[^\d]/g, "");
      return cleaned ? parseInt(cleaned, 10) : 0;
    }
    return 0;
  };

  const getRelatedServicePrice = (rel: any): number => {
    const relPkgs = allPackages.filter((pkg: any) => {
      return (
        pkg.serviceId === rel.id ||
        (pkg.serviceId && pkg.serviceId.toLowerCase() === rel.id.toLowerCase())
      );
    }).sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));

    if (relPkgs.length > 0) {
      return relPkgs[0]?.discountPrice || relPkgs[0]?.price;
    }

    const rawVal = rel.packages && rel.packages.length > 0
      ? (rel.packages[0]?.discountPrice || rel.packages[0]?.price)
      : (rel.professionalFees || 0);

    if (typeof rawVal === "number") return rawVal;
    if (typeof rawVal === "string") {
      const cleaned = rawVal.replace(/[^\d]/g, "");
      return cleaned ? parseInt(cleaned, 10) : 0;
    }
    return 0;
  };

  // Scroll listener for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Exit intent trigger
  useEffect(() => {
    if (!service) return;
    const sessionKey = `exit-prompt-shown-${service.id}`;
    const hasShown = sessionStorage.getItem(sessionKey);
    if (hasShown) return;

    // Wait at least 10 seconds for meaningful page engagement
    const timer = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY < 30) { // Cursor exits top of viewport
          const alreadyShown = sessionStorage.getItem(sessionKey);
          if (!alreadyShown) {
            setExitPromptOpen(true);
            sessionStorage.setItem(sessionKey, "true");
          }
        }
      };

      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, 10000);

    return () => clearTimeout(timer);
  }, [service?.id]);

  // Reset state when the current service changes
  useEffect(() => {
    if (service) {
      setCollectedDocs({});
      setSelectedAddons({});
    }
  }, [service?.id]);

  // Handle Inline Callback Request Submission
  const handleCallbackSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!callbackName.trim()) {
      toast.error("Please enter your name", "Validation Error");
      return;
    }
    if (!callbackPhone.trim() || callbackPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number", "Validation Error");
      return;
    }
    if (!callbackTime) {
      toast.error("Please select your preferred time slot", "Validation Error");
      return;
    }

    setIsCallbackSubmitting(true);
    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formType: "Service Page Callback",
          name: callbackName,
          phone: callbackPhone,
          service: service?.serviceName || "Callback Request",
          message: `Inline callback requested. Preferred time slot: ${callbackTime}`
        })
      });
      
      const resData = await response.json();
      if (response.ok && resData.success) {
        toast.success(
          `Callback scheduled! A verified Legomark expert will call you on ${callbackPhone} during the ${callbackTime} slot.`,
          "Callback Confirmed!"
        );
        setCallbackName("");
        setCallbackPhone("");
        setCallbackTime("");
      } else {
        toast.error(resData.message || "Failed to schedule callback. Please try again.", "Error");
      }
    } catch (err) {
      console.error("Callback submission error:", err);
      toast.error("Network error. Could not connect to the server.", "Error");
    } finally {
      setIsCallbackSubmitting(false);
    }
  };

  // Handle Exit Callback Submission
  const handleExitCallbackSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!exitPhone.trim() || exitPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number", "Validation Error");
      return;
    }

    setIsExitSubmitting(true);
    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formType: "Exit Intent Callback",
          name: "Exit Visitor",
          phone: exitPhone,
          service: service?.serviceName || "Exit Callback",
          message: `Urgent callback requested for ${service?.serviceName} from exit intent popup.`
        })
      });
      
      const resData = await response.json();
      if (response.ok && resData.success) {
        toast.success(
          `We have received your urgent request. We will call you back on ${exitPhone} immediately to answer your queries regarding ${service?.serviceName}.`,
          "Expert Callback Scheduled!"
        );
        setExitPhone("");
        setExitPromptOpen(false);
      } else {
        toast.error(resData.message || "Failed to schedule callback. Please try again.", "Error");
      }
    } catch (err) {
      console.error("Exit callback error:", err);
      toast.error("Network error. Could not connect to the server.", "Error");
    } finally {
      setIsExitSubmitting(false);
    }
  };

  // Handle Bundle Advisory Inquiry
  const handleBundleEnquirySubmit = async () => {
    if (!name.trim() || !phone.trim() || phone.length < 10) {
      toast.error("Please fill in your Contact Details in the Consultation Form first to get your custom quotation.", "Details Required");
      scrollToEnquiry();
      return;
    }

    setIsBundleSubmitting(true);
    
    // Compile selected add-on names
    const activeAddons = relatedServicesList.filter(rel => selectedAddons[rel.id]);
    const addonNames = activeAddons.map(rel => rel.serviceName).join(", ");

    const basePrice = getPrimaryServicePrice();
    const addonsPrice = relatedServicesList
      .filter(rel => selectedAddons[rel.id])
      .reduce((sum, rel) => sum + getRelatedServicePrice(rel), 0);
    const subtotal = basePrice + addonsPrice;
    const discount = addonsPrice > 0 ? Math.round(subtotal * 0.1) : 0;
    const estimatedPrice = subtotal - discount + govtFeesValue;
    
    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formType: "Bundle Advisory Quotation",
          name: name,
          email: email || `visitor-${phone}@legomarkindia.com`,
          phone: phone,
          companyName: companyName,
          service: service?.serviceName || "Bundle Advisory",
          message: `Custom bundle requested.\nBase Service: ${service?.serviceName}\nSelected Add-ons: ${addonNames || "None"}\nEstimated Bundle Price: ₹${estimatedPrice.toLocaleString("en-IN")}`
        })
      });
      
      const resData = await response.json();
      if (response.ok && resData.success) {
        toast.success(
          `Bundle lead generated! Your inquiry for ${service?.serviceName} ${addonNames ? `along with ${addonNames}` : ""} has been received. Our expert will contact you with a customized multi-service proposal.`,
          "Bundle Lead Submitted!"
        );
      } else {
        toast.error(resData.message || "Failed to submit bundle enquiry. Please try again.", "Error");
      }
    } catch (err) {
      console.error("Bundle enquiry error:", err);
      toast.error("Network error. Could not connect to the server.", "Error");
    } finally {
      setIsBundleSubmitting(false);
    }
  };

  // Dynamic SEO & JSON-LD updates on load/change
  useEffect(() => {
    if (service) {
      // 1. Tab Title
      document.title = service.seoMetaTitle;

      // 2. Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", service.seoDescription);

      // 3. Meta Keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", service.seoKeywords.join(", "));

      // 4. Canonical Link
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", window.location.href);

      // 5. Inject JSON-LD Schema
      const scriptId = "jsonld-service-schema";
      let schemaScript = document.getElementById(scriptId) as HTMLScriptElement;
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = scriptId;
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify({
        ...service.jsonLdSchema,
        "url": window.location.href
      });

      // Cleanup schema script on unmount
      return () => {
        const existing = document.getElementById(scriptId);
        if (existing) {
          existing.remove();
        }
      };
    }
  }, [service, location.pathname]);

  // Handle Enquiry submit (simulated DB connectivity)
  const handleEnquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter your name", "Validation Error");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address", "Validation Error");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number", "Validation Error");
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
          formType: "Service Enquiry",
          name: name,
          email: email,
          phone: phone,
          companyName: companyName,
          service: service?.serviceName || "Service Consultation",
          message: message || `Inquiry for ${service?.serviceName}`
        })
      });
      
      const resData = await response.json();
      if (response.ok && resData.success) {
        toast.success(
          `Thank you ${name}. Your request for ${service?.serviceName} has been recorded in our lead management system. Our team will contact you shortly.`,
          "Enquiry Submitted!"
        );
        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setCompanyName("");
        setMessage("");
      } else {
        toast.error(resData.message || "Failed to submit enquiry. Please try again.", "Submission Failed");
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      toast.error("Network error. Could not connect to the server.", "Submission Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Book Consultation submit
  const handleConsultSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!consultDate || !consultTime) {
      toast.error("Please pick a valid date and time slot", "Scheduling Error");
      return;
    }

    toast.success(
      `Your Free Consultation for ${service?.serviceName} is scheduled on ${consultDate} at ${consultTime}. A confirmation SMS/Email has been dispatched.`,
      "Consultation Booked!"
    );
    setConsultModalOpen(false);
    setConsultDate("");
    setConsultTime("");
  };

  // Trigger smooth scroll to enquiry form
  const scrollToEnquiry = () => {
    const el = document.getElementById("enquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // If service is draft or not found, show elegant redirection page or 404
  if (!service || service.draftStatus === "Draft") {
    return (
      <PublicLayout id="service-not-found-layout">
        <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 bg-slate-50 text-center">
          <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 mb-6">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Service Not Found
          </h1>
          <p className="mt-2 text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
            We couldn't locate the dynamic service &ldquo;{effectiveServiceSlug}&rdquo; under category &ldquo;{effectiveCategorySlug}&rdquo;. It may be currently offline or a draft.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link to="/">
              <Button variant="outline" size="sm">Go Back Home</Button>
            </Link>
            <button
              onClick={() => navigate("/contact")}
              className="px-4 py-2 bg-brand-primary-950 text-white rounded-lg text-sm font-semibold hover:bg-brand-secondary-600 transition-all"
            >
              Contact Support
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Related services query (exactly 4 dynamic services prioritized by: 1. Same Subcategory, 2. Same Category, 3. Latest Published Services)
  const relatedServicesList = (() => {
    if (!service) return [];

    // 1. Same Subcategory (excluding current service)
    const sameSub = services.filter(s => 
      s.draftStatus === "Published" && 
      s.id !== service.id && 
      ((s.subcategoryId && s.subcategoryId === service.subcategoryId) || 
       (s.subcategory && s.subcategory === service.subcategory))
    );

    // 2. Same Category (excluding those already in sameSub and current service)
    const sameCat = services.filter(s => 
      s.draftStatus === "Published" && 
      s.id !== service.id && 
      ((s.categoryId && s.categoryId === service.categoryId) || 
       (s.category && s.category === service.category)) &&
      !sameSub.some(subSrv => subSrv.id === s.id)
    );

    // 3. Latest Published Services (excluding current and already collected)
    const latestSrv = services.filter(s => 
      s.draftStatus === "Published" && 
      s.id !== service.id && 
      !sameSub.some(subSrv => subSrv.id === s.id) &&
      !sameCat.some(catSrv => catSrv.id === s.id)
    );

    return [
      ...sameSub,
      ...sameCat,
      ...latestSrv
    ].slice(0, 4);
  })();

  // Helper to parse numeric digits from government fees string (e.g. "₹1,500 (Approx)" -> 1500)
  const parseGovtFeesNumeric = (feesStr: string): number => {
    if (!feesStr) return 0;
    const cleaned = feesStr.replace(/,/g, "");
    const match = cleaned.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const govtFeesValue = parseGovtFeesNumeric(
    typeof service.governmentFees === "number" 
      ? String(service.governmentFees) 
      : (service.governmentFees || "")
  );

  // Helper to get exactly 6 benefit cards (dynamic + premium fallbacks)
  const defaultBenefits = [
    "Transparent pricing with clear statutory stamp duties and professional fee breakdowns.",
    "Dedicated Account Manager for real-time filing coordination and statutory updates.",
    "Data privacy and corporate protection backed by military-grade digital confidentiality.",
    "Lifetime post-incorporation advisory support from verified CAs, CSs, and attorneys.",
    "Prompt end-to-end liaison with the Registrar of Companies and government offices.",
    "100% digital, paperless workflow optimized for fast processing and remote onboarding."
  ];

  const getSixBenefits = () => {
    const combined = [...(service?.benefits || [])];
    let fallbackIdx = 0;
    while (combined.length < 6 && fallbackIdx < defaultBenefits.length) {
      if (!combined.includes(defaultBenefits[fallbackIdx])) {
        combined.push(defaultBenefits[fallbackIdx]);
      }
      fallbackIdx++;
    }
    return combined.slice(0, 6);
  };

  const activeBenefits = getSixBenefits();

  // Dynamically resolve Category and Subcategory for clickable dynamic breadcrumbs
  const currentCat = categories.find(c => c.id === service?.categoryId) || 
                     categories.find(c => c.urlSlug === service?.categorySlug) ||
                     { id: "", urlSlug: service?.categorySlug || "services", categoryName: service?.category || "Services" };
                     
  const currentSub = subcategories.find(sub => sub.id === service?.subcategoryId) ||
                     subcategories.find(sub => sub.parentCategoryId === currentCat.id) ||
                     { id: "", urlSlug: "general", subcategoryName: service?.subcategory || "General" };

  // Document checklist progress calculation
  const totalRequiredDocs = service.requiredDocuments?.length || 0;
  const checkedDocsCount = Object.values(collectedDocs).filter(Boolean).length;
  const docProgressPercent = totalRequiredDocs > 0 ? Math.round((checkedDocsCount / totalRequiredDocs) * 100) : 0;

  // Toggle checklist item
  const handleToggleDoc = (docName: string) => {
    setCollectedDocs(prev => ({
      ...prev,
      [docName]: !prev[docName]
    }));
  };

  return (
    <PublicLayout id={`service-layout-${service.id}`}>
      {/* SECTION 1: PREMIUM HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 md:py-28" id={`hero-${service.id}`}>
        {/* Abstract geometric grid design */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 z-0" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-secondary-500/10 rounded-full blur-3xl z-0 -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-primary-500/10 rounded-full blur-3xl z-0 translate-y-24 -translate-x-24" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero main content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-400 bg-brand-secondary-500/10 border border-brand-secondary-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {service.category}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-slate-300 bg-slate-800 border border-slate-700">
                  {service.subcategory}
                </span>
              </div>

              {/* Service Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-tight animate-fade-in">
                {service.serviceName}
              </h1>

              {/* Short Description */}
              <p className="text-slate-300 text-sm md:text-lg leading-relaxed max-w-2xl font-sans">
                {autoHyperlinkText(service.shortDescription, service.id, services, categories, subcategories)}
              </p>

              {/* Government Timeline & Pricing Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 pb-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Clock className="h-5 w-5 text-brand-secondary-500 shrink-0 mb-2" />
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Govt. Timeline</p>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5">{service.timeline}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Coins className="h-5 w-5 text-brand-secondary-500 shrink-0 mb-2" />
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Starting Price</p>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    ₹{getPrimaryServicePrice().toLocaleString("en-IN")}*
                  </p>
                </div>

                <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Shield className="h-5 w-5 text-brand-secondary-500 shrink-0 mb-2" />
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Filing Assist</p>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5">Legomark Confirmed</p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={handleBookConsultation}
                  className="px-6 py-3.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-brand-primary-950 font-extrabold rounded-xl text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-brand-secondary-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="h-4.5 w-4.5" />
                  <span>Book Free Consultation</span>
                </button>

                <a
                  href="tel:+917530847878"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="h-4.5 w-4.5 text-brand-secondary-500" />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://wa.me/917530847878?text=Hi%20Legomark,%20I%20am%20interested%20in%20the%20${encodeURIComponent(service.serviceName)}%20service.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="h-4.5 w-4.5 fill-white text-[#25D366]" />
                  <span>WhatsApp Expert</span>
                </a>
              </div>
            </div>

            {/* Sticky Sidebar form preview (Right 5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-brand-secondary-500/5 rounded-3xl blur-2xl -z-10" />
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-secondary-500 to-emerald-500" />
                <h3 className="text-lg font-display font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-secondary-500" />
                  Request Call Back
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Provide your contact details below. A dedicated CA/CS or legal associate will call you within 15 minutes.
                </p>

                <form onSubmit={handleEnquirySubmit} className="mt-6 space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-secondary-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. anand@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-secondary-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-secondary-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Company / Entity Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="Proposed company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-secondary-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Requirements / Message</label>
                    <textarea
                      rows={2}
                      placeholder="Optional details or instructions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-secondary-500 resize-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-brand-primary-950 text-xs font-black font-mono uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Consultation Request</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SPRINT 7B - SECTION 3: TRUST BADGES RIBBON */}
      <section className="bg-slate-50 border-b border-slate-200/60 py-6" id="trust-badges-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-4 gap-x-6 justify-items-center items-center">
            {[
              { text: "Experienced Professionals", desc: "CA, CS & Lawyers" },
              { text: "Transparent Pricing", desc: "No Hidden Costs" },
              { text: "Government Compliant", desc: "100% Secure Filing" },
              { text: "Secure Documentation", desc: "Confidential & Safe" },
              { text: "Dedicated Support", desc: "24/7 Priority Desk" },
              { text: "Pan India Services", desc: "Serving All States" }
            ].map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2.5 group">
                <div className="h-7 w-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-black text-brand-primary-950 tracking-tight leading-none">{badge.text}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-none">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPRINT 7B - SECTION 4: WHY BUSINESSES TRUST LEGOMARK (STATISTICS) */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-100" id="statistics-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "5000+", label: "Businesses Served", detail: "Startups & SMEs incorporated nationwide" },
              { value: "10000+", label: "Compliance Services", detail: "GST, tax filings & statutory audits completed" },
              { value: "98%", label: "Client Satisfaction", detail: "Consistent five-star reviews on Google" },
              { value: "8+", label: "Years of Experience", detail: "Delivering statutory excellence since 2018" }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <p className="text-4xl md:text-5xl font-display font-black text-brand-primary-950 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-600 mt-2">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-400 font-semibold mt-1 leading-normal max-w-xs mx-auto">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY CHOOSE THIS SERVICE */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-100" id="why-choose-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
              Statutory Excellence
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Why Choose This Service?
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              We deliver premium, robust corporate compliance services backed by technology, transparent pricing, and expert legal counsels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeBenefits.map((benefit, idx) => {
              // Custom matching icons for variety and rhythm
              const icons = [ShieldCheck, Award, Zap, Users, Building2, TrendingUp];
              const BenefitIcon = icons[idx] || ShieldCheck;
              const colors = [
                "text-emerald-600 bg-emerald-50 border-emerald-100/50",
                "text-amber-600 bg-amber-50 border-amber-100/50",
                "text-purple-600 bg-purple-50 border-purple-100/50",
                "text-blue-600 bg-blue-50 border-blue-100/50",
                "text-indigo-600 bg-indigo-50 border-indigo-100/50",
                "text-rose-600 bg-rose-50 border-rose-100/50"
              ];
              const iconColor = colors[idx] || colors[0];

              return (
                <div
                  key={idx}
                  className="bg-slate-50/50 rounded-2xl border border-slate-200/40 p-6 md:p-8 space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${iconColor}`}>
                    <BenefitIcon className="h-5.5 w-5.5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-sm md:text-base text-brand-primary-950 tracking-tight">
                      Key Benefit #{idx + 1}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-semibold">
                      {benefit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: ELIGIBILITY */}
      <section className="py-20 md:py-28 bg-slate-50 border-b border-slate-100" id="eligibility-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-primary-950 bg-slate-200/50 border border-slate-300/50">
              Prerequisites & Compliance
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Service Eligibility Criteria
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              Review the statutory and legal requirements below to confirm if your business entity is ready for this service filing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {service.eligibility?.map((criterion, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-primary-50 text-brand-primary-950 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5 text-brand-primary-900" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-sm md:text-base text-brand-primary-950 tracking-tight">
                    Statutory Criterion {idx + 1}
                  </h4>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-semibold">
                    {autoHyperlinkText(criterion, service.id, services, categories, subcategories)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPRINT 7B - SECTION 2: REQUEST A CALLBACK (PREMIUM INLINE CARD) */}
      <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-100" id="callback-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 shadow-xl animate-fade-in">
            {/* Elegant accent border at top */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-secondary-500 via-amber-500 to-brand-primary-950" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Heading and info */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/40">
                  <Phone className="h-3 w-3 animate-pulse" />
                  Instant Compliance Support
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold text-brand-primary-950 tracking-tight leading-tight">
                  Speak with a Legal Expert Today
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-semibold">
                  Have doubts about {service.serviceName}? Fill out this quick callback form. A verified corporate consultant will contact you within your selected timeframe.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1.5 leading-none">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    100% Free Consultation
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1.5 leading-none">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    No Obligation Advisory
                  </p>
                </div>
              </div>

              {/* Right Column: Interactive Form */}
              <div className="lg:col-span-7 bg-slate-50/50 rounded-2xl border border-slate-200/50 p-6">
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Sharma"
                        value={callbackName}
                        onChange={(e) => setCallbackName(e.target.value)}
                        className="w-full px-4.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-secondary-500 focus:ring-1 focus:ring-brand-secondary-500 transition-all shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={callbackPhone}
                        onChange={(e) => setCallbackPhone(e.target.value)}
                        className="w-full px-4.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-secondary-500 focus:ring-1 focus:ring-brand-secondary-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Preferred Time *</label>
                    <select
                      required
                      value={callbackTime}
                      onChange={(e) => setCallbackTime(e.target.value)}
                      className="w-full px-4.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-secondary-500 focus:ring-1 focus:ring-brand-secondary-500 transition-all shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_1rem_center] bg-no-repeat"
                    >
                      <option value="">-- Select Time Slot --</option>
                      <option value="Urgent Callback (Within 10 Mins)">⚡ Urgent Callback (Within 10 Mins)</option>
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                      <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isCallbackSubmitting}
                    className="w-full py-3 px-4 bg-brand-primary-950 hover:bg-brand-secondary-600 text-white hover:text-brand-primary-950 text-xs font-black font-mono uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isCallbackSubmitting ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <span>Request Callback Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: REQUIRED DOCUMENTS (CHECKLIST & PROGRESS STYLING) */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-100" id="documents-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
              Interactive Checklist
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Required Documentation
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Toggle the checkboxes next to each document below to verify your readiness progress. Our specialists can assist with drafting NOCs and Rent Agreements.
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Document collection readiness</p>
                <h4 className="text-lg md:text-xl font-display font-extrabold text-brand-primary-950 tracking-tight mt-1">
                  {checkedDocsCount} of {totalRequiredDocs} Documents Ready
                </h4>
              </div>
              <span className="inline-flex px-3 py-1 bg-brand-primary-950 text-brand-secondary-400 font-mono text-xs font-bold rounded-lg shadow-sm">
                {docProgressPercent}% Ready
              </span>
            </div>

            {/* Custom styled progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden relative border border-slate-300/30">
              <div
                className="bg-gradient-to-r from-brand-primary-950 to-brand-secondary-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${docProgressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 font-semibold leading-normal">
              💡 Tip: Clear scans in PDF, JPEG, or PNG format under 5 MB are required. Tap on the items below once collected.
            </p>
          </div>

          {/* Responsive checklist grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.requiredDocuments?.map((doc, idx) => {
              const isChecked = !!collectedDocs[doc];
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleToggleDoc(doc)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 select-none cursor-pointer ${
                    isChecked
                      ? "border-emerald-500 bg-emerald-50/10"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                  }`}>
                    {isChecked && <Check className="h-3.5 w-3.5 font-bold" />}
                  </div>
                  <div className="space-y-0.5">
                    <span 
                      className={`text-xs md:text-sm font-bold block leading-relaxed ${isChecked ? "text-slate-800 line-through decoration-slate-400/70" : "text-slate-700"}`}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).tagName === "A") {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {autoHyperlinkText(doc, service.id, services, categories, subcategories)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 font-semibold">
                      <FileUp className="h-3 w-3" />
                      Statutory ID / Local Premise Premise Proof
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: STEP-BY-STEP PROCESS TIMELINE */}
      <section className="py-20 md:py-28 bg-slate-50 border-b border-slate-100" id="process-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-primary-950 bg-slate-200/50 border border-slate-300/50">
              Statutory Operations Map
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              End-to-End Process Timeline
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              We manage the entire pipeline from preliminary advisory to government clearance and certificate release.
            </p>
          </div>

          {/* Premium Desktop Horizontal / Mobile Vertical Pipeline Ribbon */}
          <div className="relative max-w-6xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-primary-950 via-brand-secondary-500 to-emerald-500" />
            
            {/* Desktop Timeline Flow Indicator */}
            <div className="hidden lg:grid grid-cols-6 gap-4 relative">
              {[
                { label: "Consultation", desc: "Expert Onboarding", icon: MessageSquare },
                { label: "Doc Collection", desc: "Digital Checklist", icon: FileText },
                { label: "Verification", desc: "CA/CS Validation", icon: ShieldCheck },
                { label: "Govt Filing", desc: "Official Submission", icon: Send },
                { label: "Approval", desc: "Statutory Clearance", icon: CheckCircle },
                { label: "Certificate", desc: "Final Dispatch", icon: Sparkles }
              ].map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center relative group">
                    {/* Connecting dashed line */}
                    {idx < 5 && (
                      <div className="absolute top-6 left-1/2 w-full h-0.5 border-t border-dashed border-slate-200" />
                    )}

                    <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 text-brand-secondary-400 flex items-center justify-center relative z-10 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-black text-brand-primary-950 tracking-tight mt-3">{step.label}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Flow Indicator */}
            <div className="lg:hidden space-y-6">
              {[
                { label: "Consultation", desc: "Expert Onboarding", icon: MessageSquare },
                { label: "Doc Collection", desc: "Digital Checklist", icon: FileText },
                { label: "Verification", desc: "CA/CS Validation", icon: ShieldCheck },
                { label: "Govt Filing", desc: "Official Submission", icon: Send },
                { label: "Approval", desc: "Statutory Clearance", icon: CheckCircle },
                { label: "Certificate", desc: "Final Dispatch", icon: Sparkles }
              ].map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 text-brand-secondary-400 flex items-center justify-center shadow-md shrink-0">
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-brand-primary-950 tracking-tight">{step.label}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic detailed steps timeline */}
          <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-y-0 before:left-4 before:md:left-1/2 before:w-0.5 before:bg-slate-200">
            {service.stepByStepProcess?.map((proc, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`relative flex flex-col md:flex-row items-start ${isEven ? "md:flex-row-reverse" : ""} justify-between`}>
                  {/* Timeline bullet */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-brand-primary-950 border-4 border-slate-50 text-brand-secondary-400 font-mono text-xs font-black flex items-center justify-center z-10 shadow-sm">
                    {proc.step}
                  </div>

                  {/* Empty block for balancing the symmetric timeline */}
                  <div className="hidden md:block w-5/12" />

                  {/* Content block */}
                  <div className="w-full md:w-5/12 pl-12 md:pl-0">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <span className="inline-block text-[10px] font-mono font-bold text-brand-secondary-600 uppercase bg-brand-secondary-50 border border-brand-secondary-100/50 px-2.5 py-0.5 rounded-full mb-3">
                        Filing Step #{proc.step}
                      </span>
                      <h4 className="text-sm md:text-base font-extrabold text-slate-800 tracking-tight">
                        {proc.title}
                      </h4>
                      <p className="text-slate-500 text-xs md:text-sm leading-relaxed mt-2 font-semibold">
                        {proc.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: PRICING (PREMIUM PACKAGES & COMPARISON) */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-100" id="pricing-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
              Upfront Transparent Quotes
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Compare Our Packages & pricing
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              We believe in 100% upfront pricing clarity. Choose the package that fits your operational needs, and verify the statutory fee breakdown below.
            </p>
          </div>

          <div className={`grid ${cmsPackages.length > 2 || (service?.packages && service.packages.length > 2) ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl"} gap-8 mx-auto items-stretch`}>
            {isLoadingPackages ? (
              <div className="col-span-full py-12 text-center text-slate-400 font-mono text-xs">
                Loading packages from CMS...
              </div>
            ) : (
              (() => {
                const displayPackages = cmsPackages.length > 0 ? cmsPackages : (service?.packages || []);
                if (displayPackages.length === 0) {
                  return (
                    <div className="col-span-full py-12 text-center text-slate-400 font-mono text-xs">
                      No packages configured for this service.
                    </div>
                  );
                }
                return displayPackages.map((pkg, idx) => {
                  // Highlight the recommended package (usually the premium startup suite, or second package)
                  const isRecommended = displayPackages.length > 1 ? idx === 1 : true;
                  const displayPrice = pkg.discountPrice || pkg.price;
                  const hasDiscount = !!pkg.discountPrice;
                  const gstValue = pkg.gstPercent ? Math.round(displayPrice * (pkg.gstPercent / 100)) : 0;
                  const totalPriceEstimated = displayPrice + gstValue + govtFeesValue;

                  return (
                    <div
                      key={idx}
                      className={`rounded-3xl p-6 md:p-10 border-2 flex flex-col justify-between transition-all duration-300 relative ${
                        isRecommended
                          ? "border-brand-primary-950 bg-slate-950 text-white shadow-xl shadow-brand-primary-950/10"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-800"
                      }`}
                    >
                      {isRecommended && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-secondary-500 to-amber-500 text-brand-primary-950 font-black font-mono text-[10px] uppercase px-4 py-1.5 rounded-full shadow-md tracking-wider">
                          ★ Recommended Package
                        </div>
                      )}

                      <div className="space-y-6">
                        {/* Header */}
                        <div className="border-b border-slate-200/20 pb-6 space-y-2">
                          <h4 className={`text-xl md:text-2xl font-display font-extrabold ${isRecommended ? "text-white" : "text-brand-primary-950"}`}>
                            {pkg.name}
                          </h4>
                          <p className={`text-xs ${isRecommended ? "text-slate-400" : "text-slate-500"} font-semibold`}>
                            Complete package inclusions with no hidden advisory charges.
                          </p>
                        </div>

                        {/* Detailed Fee Breakdown */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className={isRecommended ? "text-slate-400" : "text-slate-500"}>Professional Fees:</span>
                            <div className="flex items-center gap-1.5 font-bold">
                              {hasDiscount && (
                                <span className="text-[10px] text-slate-500 line-through">₹{pkg.price.toLocaleString("en-IN")}</span>
                              )}
                              <span>₹{displayPrice.toLocaleString("en-IN")}</span>
                            </div>
                          </div>

                          {pkg.gstPercent && (
                            <div className="flex justify-between text-xs font-semibold">
                              <span className={isRecommended ? "text-slate-400" : "text-slate-500"}>GST ({pkg.gstPercent}%):</span>
                              <span className="font-bold">₹{gstValue.toLocaleString("en-IN")}</span>
                            </div>
                          )}

                          <div className="flex justify-between text-xs font-semibold">
                            <span className={isRecommended ? "text-slate-400" : "text-slate-500"}>Government Fees:</span>
                            <span className="font-bold">{service.governmentFees || "NIL"}</span>
                          </div>

                          {/* Total Price Itemized Breakdown */}
                          <div className={`flex justify-between items-baseline pt-4 border-t ${isRecommended ? "border-slate-800" : "border-slate-200"} mt-2`}>
                            <span className={`text-xs font-black ${isRecommended ? "text-brand-secondary-400" : "text-brand-primary-950"}`}>Total Price (Est):</span>
                            <div className="text-right">
                              <span className="text-2xl md:text-3xl font-display font-black">
                                ₹{totalPriceEstimated.toLocaleString("en-IN")}
                              </span>
                              <p className={`text-[9px] font-mono mt-0.5 ${isRecommended ? "text-slate-500" : "text-slate-400"} font-semibold`}>
                                (Inclusive of government fee and taxes)
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Inclusions features list */}
                        <div className={`pt-4 border-t ${isRecommended ? "border-slate-800" : "border-slate-200"}`}>
                          <p className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-4 ${isRecommended ? "text-brand-secondary-400" : "text-slate-400"}`}>
                            Package Inclusions:
                          </p>
                          <ul className="space-y-3">
                            {(Array.isArray(pkg.features) ? pkg.features : []).map((feature: string, fIdx: number) => (
                              <li key={fIdx} className="flex gap-2.5 items-start">
                                <Check className={`h-4 w-4 shrink-0 mt-0.5 ${isRecommended ? "text-brand-secondary-400" : "text-brand-primary-950"}`} />
                                <span className={`text-xs md:text-sm font-semibold leading-relaxed ${isRecommended ? "text-slate-300" : "text-slate-600"}`}>
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-8">
                        <button
                          onClick={scrollToEnquiry}
                          className={`w-full py-4 text-xs font-black font-mono uppercase tracking-widest rounded-xl transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer ${
                            isRecommended
                              ? "bg-brand-secondary-500 hover:bg-brand-secondary-600 text-brand-primary-950 shadow-lg shadow-brand-secondary-500/20"
                              : "bg-brand-primary-950 hover:bg-slate-800 text-white shadow-md"
                          }`}
                        >
                          <span>{pkg.cta || "Enquire Now"}</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </div>
        </div>
      </section>

      {/* SECTION 7: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 md:py-28 bg-slate-50 border-b border-slate-100" id="faqs-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
              Expert Answers Hub
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Clear your legal compliance doubts before submitting applications. Our experts have curated primary regulatory answers below.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {service.faqs?.sort((a, b) => a.displayOrder - b.displayOrder).map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-sm md:text-base text-brand-primary-950 hover:text-brand-secondary-500 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span 
                      className="pr-4"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).tagName === "A") {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {autoHyperlinkText(faq.question, service.id, services, categories, subcategories)}
                    </span>
                    <span className="shrink-0 ml-4 p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-500">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 text-xs md:text-sm text-slate-500 leading-relaxed font-semibold font-sans animate-fade-in">
                      {autoHyperlinkText(faq.answer, service.id, services, categories, subcategories)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SPRINT 7B - SECTION 5: FREQUENTLY CHOSEN TOGETHER (INTERACTIVE COMPLEMENTARY BUNDLES) */}
      {relatedServicesList.length > 0 && (
        <section className="py-20 md:py-28 bg-slate-50 border-b border-slate-200/60" id="frequently-chosen-together">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
                <Sparkles className="h-3.5 w-3.5 text-brand-secondary-500" />
                Frequently Chosen Together
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight animate-fade-in">
                Build Your Corporate Growth Bundle
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Combine complementary statutory registrations and corporate services to unlock a <strong className="text-brand-secondary-600 font-bold">10% bundle discount</strong> on professional fees. Select add-ons below to customize.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Side: Complementary Service Cards */}
              <div className="lg:col-span-7 space-y-4">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 font-extrabold">Available complementary services:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedServicesList.map((rel) => {
                    const isChecked = !!selectedAddons[rel.id];
                    const relPrice = getRelatedServicePrice(rel);
                    
                    const relCat = categories.find(c => c.id === rel.categoryId) || 
                                   categories.find(c => c.urlSlug === rel.categorySlug) ||
                                   { id: "", urlSlug: rel.categorySlug || "services" };
                                   
                    const relSub = subcategories.find(sub => sub.id === rel.subcategoryId) ||
                                   subcategories.find(sub => sub.parentCategoryId === relCat.id) ||
                                   { id: "", urlSlug: "general" };
                    
                    return (
                      <div
                        key={rel.id}
                        onClick={() => setSelectedAddons(prev => ({ ...prev, [rel.id]: !prev[rel.id] }))}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md select-none ${
                          isChecked
                            ? "border-brand-secondary-500 bg-brand-secondary-500/5"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <span className="text-[9px] font-mono font-bold uppercase text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-100/50 px-2 py-0.5 rounded-full">
                              {rel.subcategory}
                            </span>
                            <div className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                              isChecked ? "bg-brand-secondary-500 border-brand-secondary-500 text-brand-primary-950" : "border-slate-300"
                            }`}>
                              {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            </div>
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-800 line-clamp-1">{rel.serviceName}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-semibold">
                            {rel.shortDescription}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-200/50 flex items-center justify-between">
                          <span className="text-xs font-black text-slate-700">₹{relPrice.toLocaleString("en-IN")}</span>
                          <Link
                            to={`/${relCat.urlSlug}/${relSub.urlSlug}/${rel.urlSlug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-bold text-brand-secondary-500 hover:text-brand-secondary-600 inline-flex items-center gap-0.5 group"
                          >
                            <span>Details</span>
                            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Interactive Bundle Constructor */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-secondary-500 to-amber-500" />
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Coins className="h-5 w-5 text-brand-secondary-500" />
                    <h3 className="text-base font-display font-black uppercase tracking-wider text-white">Smart Bundle Summary</h3>
                  </div>

                  <div className="space-y-4 divide-y divide-slate-800">
                    {/* Primary Service Item */}
                    <div className="pb-3 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-slate-400 font-mono font-bold uppercase leading-none">Primary Registration</p>
                        <h5 className="text-xs font-black text-white mt-1.5">{service.serviceName}</h5>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-200">
                        ₹{getPrimaryServicePrice().toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Selected Addons list */}
                    <div className="py-3 space-y-2">
                      <p className="text-[10px] text-slate-400 font-mono font-bold uppercase leading-none">Selected Add-ons</p>
                      
                      {relatedServicesList.filter(rel => selectedAddons[rel.id]).length === 0 ? (
                        <p className="text-xs text-slate-500 italic pt-1">No complementary services checked. Tick boxes on the left to add.</p>
                      ) : (
                        relatedServicesList.filter(rel => selectedAddons[rel.id]).map(rel => {
                          const relPrice = getRelatedServicePrice(rel);
                          return (
                            <div key={rel.id} className="flex justify-between items-center text-xs">
                              <span className="text-slate-300 font-medium truncate max-w-[200px]">+ {rel.serviceName}</span>
                              <span className="font-mono text-slate-300 font-bold">₹{relPrice.toLocaleString("en-IN")}</span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Live Calculation */}
                    <div className="pt-4 space-y-2.5">
                      {/* Subtotal */}
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Total Professional Fee:</span>
                        <span className="font-mono text-slate-200">
                          ₹{(() => {
                            const basePrice = getPrimaryServicePrice();
                            const addonsPrice = relatedServicesList
                              .filter(rel => selectedAddons[rel.id])
                              .reduce((sum, rel) => sum + getRelatedServicePrice(rel), 0);
                            return (basePrice + addonsPrice).toLocaleString("en-IN");
                          })()}
                        </span>
                      </div>

                      {/* Discount if 1 or more add-on selected */}
                      {relatedServicesList.filter(rel => selectedAddons[rel.id]).length > 0 && (
                        <div className="flex justify-between text-xs text-emerald-400 font-bold">
                          <span>10% Bundle Discount:</span>
                          <span>
                            - ₹{(() => {
                              const basePrice = getPrimaryServicePrice();
                              const addonsPrice = relatedServicesList
                                .filter(rel => selectedAddons[rel.id])
                                .reduce((sum, rel) => sum + getRelatedServicePrice(rel), 0);
                              return Math.round((basePrice + addonsPrice) * 0.1).toLocaleString("en-IN");
                            })()}
                          </span>
                        </div>
                      )}

                      {/* Government Fee */}
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Govt. Charges & Duties:</span>
                        <span className="font-mono text-slate-200">
                          {govtFeesValue > 0 ? `₹${govtFeesValue.toLocaleString("en-IN")}` : "As per actuals / NIL"}
                        </span>
                      </div>

                      {/* Total Bundle Est */}
                      <div className="flex justify-between items-baseline pt-4 border-t border-slate-800">
                        <span className="text-xs font-black text-brand-secondary-400">Estimated Bundle Price:</span>
                        <div className="text-right">
                          <span className="text-2xl font-display font-black text-white">
                            ₹{(() => {
                              const basePrice = getPrimaryServicePrice();
                              const addonsPrice = relatedServicesList
                                .filter(rel => selectedAddons[rel.id])
                                .reduce((sum, rel) => sum + getRelatedServicePrice(rel), 0);
                              const subtotal = basePrice + addonsPrice;
                              const discount = addonsPrice > 0 ? Math.round(subtotal * 0.1) : 0;
                              return (subtotal - discount + govtFeesValue).toLocaleString("en-IN");
                            })()}
                          </span>
                          <p className="text-[9px] font-mono text-slate-500 mt-1 leading-none">Inclusive of discount & statutory estimations</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBundleEnquirySubmit}
                    disabled={isBundleSubmitting}
                    className="w-full mt-6 py-3.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-brand-primary-950 text-xs font-black font-mono uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-brand-secondary-500/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isBundleSubmitting ? (
                      <span>Submitting Proposal...</span>
                    ) : (
                      <>
                        <span>Get Bundle Quotation</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 9: FINAL CTA */}
      <section className="relative overflow-hidden bg-brand-primary-950 py-20 md:py-24" id="final-cta-section">
        {/* Subtle glowing accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-brand-secondary-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-none">
              Need Professional Assistance?
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed font-semibold">
              Join hands with India's leading corporate compliance consultants. Our network of verified Chartered Accountants and corporate attorneys will manage your paperwork while you scale your company.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleBookConsultation}
              className="w-full sm:w-auto px-8 py-4 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-brand-primary-950 font-bold text-sm rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-brand-secondary-500/20 cursor-pointer"
            >
              Book Free Consultation
            </button>
            <a
              href="tel:+917530847878"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-bold text-sm rounded-xl transition-all duration-300 text-center cursor-pointer"
            >
              Talk to an Expert
            </a>
          </div>
        </div>
      </section>

      {/* Consultation Booking Modal (Standard Client simulation) */}
      {consultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-brand-primary-950 text-white p-6 relative">
              <h3 className="text-lg font-display font-bold">Book Free Video Consultation</h3>
              <p className="text-xs text-slate-300 mt-1">Schedule a 15-minute slot with a Chartered Accountant regarding {service.serviceName}.</p>
              <button
                onClick={() => setConsultModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConsultSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  className="w-full text-xs md:text-sm rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-primary-500 bg-white"
                  value={consultDate}
                  onChange={(e) => setConsultDate(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Preferred Time Slot
                </label>
                <select
                  className="w-full text-xs md:text-sm rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-primary-500 bg-white"
                  value={consultTime}
                  onChange={(e) => setConsultTime(e.target.value)}
                  required
                >
                  <option value="">-- Choose Slot --</option>
                  <option value="10:00 AM - 10:15 AM">10:00 AM - 10:15 AM</option>
                  <option value="11:30 AM - 11:45 AM">11:30 AM - 11:45 AM</option>
                  <option value="02:00 PM - 02:15 PM">02:00 PM - 02:15 PM</option>
                  <option value="04:30 PM - 04:45 PM">04:30 PM - 04:45 PM</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setConsultModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-brand-primary-950 text-xs font-bold rounded-lg transition-all"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scroll padding block to prevent overlapping bottom content */}
      <div className="h-20 md:h-16" />

      {/* SPRINT 7B - SECTION 1: STICKY RESPONSIVE CONSULTATION BAR */}
      <div
        className={`fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-45 transition-all duration-300 transform p-4 md:py-3 md:px-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 ${
          showStickyBar ? "translate-y-0 opacity-100 animate-slide-up" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-8.5 w-8.5 rounded-lg bg-brand-secondary-500/10 border border-brand-secondary-500/20 flex items-center justify-center text-brand-secondary-400 shrink-0">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div className="text-left hidden md:block">
            <h5 className="text-xs font-black text-white tracking-tight leading-none">Need guidance with {service.serviceName}?</h5>
            <p className="text-[10px] text-slate-400 font-mono mt-1 leading-none">CAs & Lawyers ready to assist you</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
          {/* Book Free Consultation */}
          <button
            onClick={handleBookConsultation}
            className="px-4 py-2.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-brand-primary-950 font-mono text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-center shrink-0"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Book Consultation</span>
          </button>

          {/* WhatsApp Expert */}
          <a
            href={`https://wa.me/917530847878?text=Hi%20Legomark,%20I%20need%20expert%20assistance%20for%20the%20${encodeURIComponent(service.serviceName)}%20service.`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-mono text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-center shrink-0"
          >
            <MessageSquare className="h-3.5 w-3.5 fill-white text-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          {/* Call Now */}
          <a
            href="tel:+917530847878"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-mono text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-center shrink-0"
          >
            <PhoneCall className="h-3.5 w-3.5 text-brand-secondary-400" />
            <span>Call Now</span>
          </a>

          {/* Request Callback */}
          <button
            onClick={() => {
              const el = document.getElementById("callback-section");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-center shrink-0"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Request Callback</span>
          </button>
        </div>
      </div>

      {/* SPRINT 7B - SECTION 6: FLOATING CONTACT WIDGET */}
      <div className="fixed bottom-20 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {/* Expanded panel with options */}
        <div
          className={`flex flex-col gap-2 items-end transition-all duration-300 transform origin-bottom ${
            isFloatingOpen ? "translate-y-0 opacity-100 scale-100 pointer-events-auto" : "translate-y-4 opacity-0 scale-90 pointer-events-none"
          }`}
        >
          {/* WhatsApp Option */}
          <a
            href={`https://wa.me/917530847878?text=Hi%20Legomark,%20I%20am%20interested%20in%20the%20${encodeURIComponent(service.serviceName)}%20service.`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-lg text-slate-700 hover:text-[#25D366] transition-all group pointer-events-auto"
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">WhatsApp Expert</span>
            <div className="h-8 w-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-4.5 w-4.5 fill-white text-[#25D366]" />
            </div>
          </a>

          {/* Phone Call Option */}
          <a
            href="tel:+917530847878"
            className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-lg text-slate-700 hover:text-brand-secondary-500 transition-all group pointer-events-auto"
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Call Agent</span>
            <div className="h-8 w-8 rounded-lg bg-brand-primary-950 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <PhoneCall className="h-4.5 w-4.5 text-brand-secondary-400" />
            </div>
          </a>

          {/* Email Option */}
          <a
            href="mailto:info@legomarkindia.com?subject=Inquiry%20regarding%20corporate%20filings"
            className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-lg text-slate-700 hover:text-brand-secondary-500 transition-all group pointer-events-auto"
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Email Support</span>
            <div className="h-8 w-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Mail className="h-4.5 w-4.5 text-slate-300" />
            </div>
          </a>

          {/* Book Consultation Option */}
          <button
            onClick={() => {
              handleBookConsultation();
              setIsFloatingOpen(false);
            }}
            className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-lg text-slate-700 hover:text-brand-secondary-500 transition-all group cursor-pointer pointer-events-auto"
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Book Free Video Slot</span>
            <div className="h-8 w-8 rounded-lg bg-brand-secondary-500 text-brand-primary-950 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Calendar className="h-4.5 w-4.5" />
            </div>
          </button>
        </div>

        {/* Trigger Bubble Button */}
        <button
          type="button"
          onClick={() => setIsFloatingOpen(!isFloatingOpen)}
          className="h-14 w-14 rounded-full bg-brand-primary-950 text-white border-2 border-brand-secondary-500 flex items-center justify-center shadow-2xl relative cursor-pointer pointer-events-auto hover:scale-105 transition-transform active:scale-95 group z-50"
        >
          {/* Ripple Ring Effect */}
          <span className="absolute inset-0 rounded-full bg-brand-secondary-500/10 animate-ping duration-1000 -z-10" />
          
          {isFloatingOpen ? (
            <span className="text-xl font-bold font-mono text-brand-secondary-400">✕</span>
          ) : (
            <MessageSquare className="h-6 w-6 text-brand-secondary-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* SPRINT 7B - SECTION 7: LEAD CAPTURE EXIT PROMPT MODAL */}
      {exitPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-200 relative">
            {/* Top color ribbon */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-secondary-500 via-amber-500 to-brand-primary-950" />
            
            {/* Close Button */}
            <button
              onClick={() => setExitPromptOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="p-8 md:p-10 text-center space-y-6">
              <div className="mx-auto h-16 w-16 bg-brand-secondary-50 text-brand-secondary-600 rounded-2xl flex items-center justify-center border border-brand-secondary-100 shrink-0">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-display font-extrabold text-brand-primary-950 tracking-tight leading-tight">
                  Before You Go...
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-semibold max-w-sm mx-auto">
                  Don't leave with unanswered compliance queries! Get an immediate free consultation regarding <strong className="text-brand-primary-950">{service.serviceName}</strong>.
                </p>
              </div>

              {/* Offer Blocks */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { title: "Free Consultation", desc: "with verified CAs" },
                  { title: "Quick Callback", desc: "within 10 mins" },
                  { title: "Expert Assistance", desc: "end-to-end guidance" }
                ].map((offer, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center space-y-1">
                    <p className="text-[10px] font-black text-brand-primary-950 leading-none">{offer.title}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-1 leading-none">{offer.desc}</p>
                  </div>
                ))}
              </div>

              {/* Exit Callback capture form */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <form onSubmit={handleExitCallbackSubmit} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Enter Your Mobile Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs font-mono">
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={exitPhone}
                        onChange={(e) => setExitPhone(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-secondary-500 focus:ring-1 focus:ring-brand-secondary-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setExitPromptOpen(false)}
                      className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all font-mono uppercase tracking-wider"
                    >
                      No Thanks
                    </button>
                    <button
                      type="submit"
                      disabled={isExitSubmitting}
                      className="flex-1 py-3 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-brand-primary-950 text-xs font-black rounded-xl transition-all font-mono uppercase tracking-wider shadow-md shadow-brand-secondary-500/15"
                    >
                      {isExitSubmitting ? "Scheduling..." : "Call Me Back"}
                    </button>
                  </div>
                </form>
              </div>

              <p className="text-[10px] text-slate-400 font-semibold">
                🔒 Your digital details are encrypted under our corporate privacy policy.
              </p>
            </div>
          </div>
        </div>
      )}

    </PublicLayout>
  );
}
