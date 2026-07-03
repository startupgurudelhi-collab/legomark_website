/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Building,
  Lock,
  Shield,
  Home,
  Info,
  Layers,
  BookOpen,
  Briefcase,
  PhoneCall,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
  FileCheck,
  Scale,
  DollarSign,
  Heart,
  ExternalLink,
  MapPin,
  Clock,
  LayoutDashboard,
  FileText,
  Receipt,
  LifeBuoy,
  FileCode,
  Copy,
  Check
} from "lucide-react";
import { getEffectiveServices } from "../data/servicesData.js";
import { getEffectiveCategories, getEffectiveSubcategories } from "../data/categoriesData.js";

export default function SitemapPage() {
  
  const categories = getEffectiveCategories();
  const subcategories = getEffectiveSubcategories();
  const services = getEffectiveServices().filter(s => s.draftStatus === "Published");

  const [showXmlSitemap, setShowXmlSitemap] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);

  // Section 1: Main Website
  const mainPages = [
    { name: "Home", path: "/", desc: "Legomark India homepage with our dynamic compliance suite, active client stats, and latest announcements.", icon: Home },
    { name: "About Us", path: "/about", desc: "Our corporate journey, leadership, panels of CAs and lawyers, and our client service guarantee.", icon: Info },
    { name: "All Services", path: "/services", desc: "Catalog of company incorporation, tax compliance, intellectual property protection, and licenses.", icon: Layers },
    { name: "Knowledge Hub (Blogs)", path: "/blogs", desc: "The latest insights on GST modifications, MCA guidelines, trademark laws, and corporate filing dates.", icon: BookOpen },
    { name: "Career Opportunities", path: "/career", desc: "Join our fast-growing panel of CAs, CSs, and corporate consultants. Explore openings.", icon: Briefcase },
    { name: "Contact Desk", path: "/contact", desc: "Get priority phone, email, and WhatsApp coordinates of our regional hubs and helpdesk.", icon: PhoneCall }
  ];

  // Section 2: Services (Dynamically mapped from Category -> Subcategory -> Service Hierarchy)
  const servicesPages = services.map(s => {
    const cat = categories.find(c => c.id === s.categoryId) ||
                categories.find(c => c.urlSlug === s.categorySlug) ||
                { id: "", urlSlug: s.categorySlug || "services", categoryName: s.category || "Services" };
    const sub = subcategories.find(sub => sub.id === s.subcategoryId) ||
                subcategories.find(sub => sub.parentCategoryId === cat.id) ||
                { id: "", urlSlug: "general" };
                
    return {
      name: s.serviceName,
      path: `/${cat.urlSlug}/${sub.urlSlug}/${s.urlSlug}`,
      desc: s.shortDescription || "Corporate statutory filing and official registry approval service.",
      category: cat.categoryName
    };
  });

  // Section 3: Client Portal
  const clientPortalPages = [
    { name: "Client Dashboard", path: "/dashboard", desc: "Your primary workspace. Track active projects, view messages, and handle overall corporate setups.", icon: LayoutDashboard },
    { name: "Active Orders", path: "/dashboard", desc: "Real-time task tracking, checklist progress, and secure digital document uploads.", icon: FileCheck },
    { name: "Invoices & Payments", path: "/dashboard", desc: "Proforma and final tax invoices, payment histories, and secure payment pathways.", icon: Receipt },
    { name: "Priority Support Tickets", path: "/dashboard", desc: "Submit inquiries directly to your assigned CA/Lawyer and monitor response tickets.", icon: LifeBuoy }
  ];

  // Section 4: Legal & Policies
  const legalPages = [
    { name: "Privacy Policy", path: "/privacy-policy", desc: "Detailed breakdown of our top-tier user data encryption and corporate confidentiality protocols.", icon: Shield },
    { name: "Terms & Conditions", path: "/terms-conditions", desc: "The statutory framework governing the usage of our digital portal and consultancy services.", icon: Scale },
    { name: "Refund Policy", path: "/refund-policy", desc: "Our transparent professional fee refund policy and state-level statutory charge details.", icon: DollarSign },
    { name: "Legal Disclaimer", path: "/disclaimer", desc: "Statutory bar council and ICAI guidelines disclaimer regarding corporate online representation.", icon: FileText }
  ];

  const generateXmlSitemap = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    const domain = "https://www.legomarkindia.com";
    xml += `  <url>\n    <loc>${domain}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${domain}/about</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${domain}/services</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${domain}/blogs</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${domain}/career</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${domain}/contact</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;

    services.forEach(s => {
      const cat = categories.find(c => c.id === s.categoryId) ||
                  categories.find(c => c.urlSlug === s.categorySlug) ||
                  { id: "", urlSlug: s.categorySlug || "services" };
      const sub = subcategories.find(sub => sub.id === s.subcategoryId) ||
                  subcategories.find(sub => sub.parentCategoryId === cat.id) ||
                  { id: "", urlSlug: "general" };
      xml += `  <url>\n    <loc>${domain}/${cat.urlSlug}/${sub.urlSlug}/${s.urlSlug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  };

  const handleCopyXml = () => {
    navigator.clipboard.writeText(generateXmlSitemap());
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 font-sans" id="sitemap-page-root">
      {/* 1. HERO BANNER */}
      <section className="relative bg-brand-primary-950 text-white overflow-hidden py-16 md:py-20" id="sitemap-hero">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
        <div className="absolute top-1/2 left-10 h-64 w-64 rounded-full bg-brand-secondary-500/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-400 bg-brand-secondary-500/10 border border-brand-secondary-500/20">
            <Sparkles className="h-3.5 w-3.5 text-brand-secondary-400" />
            Website Index
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-none">
            Corporate Visual Sitemap
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-semibold leading-relaxed">
            Easily locate company registration pages, tax return portals, legal policy agreements, and our secure client dashboards in one unified map.
          </p>
        </div>
      </section>

      {/* 2. MAIN VISUAL SITEMAP GRID */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16" id="sitemap-visual-grid">
        
        {/* ROW 1: MAIN WEBSITE & CLIENT PORTAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card A: Main Website Directory */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-secondary-50 border border-brand-secondary-100 flex items-center justify-center text-brand-secondary-600">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-black text-brand-primary-950 tracking-tight leading-none">Main Website</h3>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase font-bold leading-none">Public Core Pages</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mainPages.map((page, idx) => {
                  const PageIcon = page.icon;
                  return (
                    <Link
                      key={idx}
                      to={page.path}
                      className="group p-4 bg-slate-50 hover:bg-brand-secondary-50/20 rounded-2xl border border-slate-200/60 hover:border-brand-secondary-300 transition-all flex flex-col justify-between space-y-2 text-left"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <PageIcon className="h-4 w-4 text-brand-primary-950 group-hover:text-brand-secondary-600 transition-colors shrink-0" />
                          <h4 className="text-xs font-black text-slate-800 group-hover:text-brand-secondary-600 transition-colors">{page.name}</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal font-semibold line-clamp-2">
                          {page.desc}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-slate-500 group-hover:text-brand-secondary-600 pt-1">
                        <span>Navigate</span>
                        <ChevronRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card B: Client Portal Pages */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-white flex flex-col justify-between hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary-500/5 blur-[50px] pointer-events-none" />
            
            <div className="space-y-6 z-10 relative">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-secondary-500/10 border border-brand-secondary-500/20 flex items-center justify-center text-brand-secondary-400">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-black text-white tracking-tight leading-none">Client Portal</h3>
                  <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase font-bold leading-none">Protected Workspaces</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clientPortalPages.map((page, idx) => {
                  const PageIcon = page.icon;
                  return (
                    <Link
                      key={idx}
                      to={page.path}
                      className="group p-4 bg-slate-800/60 hover:bg-slate-800 rounded-2xl border border-slate-800 hover:border-brand-secondary-500/30 transition-all flex flex-col justify-between space-y-2 text-left"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <PageIcon className="h-4 w-4 text-brand-secondary-400 shrink-0" />
                          <h4 className="text-xs font-black text-slate-100 group-hover:text-brand-secondary-400 transition-colors">{page.name}</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal font-semibold line-clamp-2">
                          {page.desc}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-slate-500 group-hover:text-brand-secondary-400 pt-1">
                        <span>Access Dashboard</span>
                        <ChevronRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: SERVICES DIRECTORY */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-brand-primary-950 tracking-tight leading-none">Services</h3>
                <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase font-bold leading-none">Our Corporate & Compliance Catalog</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {servicesPages.map((srv, idx) => (
                <Link
                  key={idx}
                  to={srv.path}
                  className="group p-4 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-200/50 hover:border-slate-300/80 transition-all flex flex-col justify-between space-y-3 text-left shadow-sm"
                >
                  <div className="space-y-2">
                    <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider text-brand-primary-900 bg-slate-200/60 px-2 py-0.5 rounded-full leading-none">
                      {srv.category}
                    </span>
                    <h4 className="text-xs font-black text-slate-800 group-hover:text-brand-secondary-600 transition-colors leading-snug">
                      {srv.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-normal font-semibold line-clamp-2">
                      {srv.desc}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-slate-400 group-hover:text-brand-secondary-600 pt-1 border-t border-slate-200/40">
                    <span>Explore Service</span>
                    <ChevronRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: LEGAL POLICIES */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-display font-black text-brand-primary-950 tracking-tight leading-none">Legal & Compliance Policies</h3>
                <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase font-bold leading-none">Statutory Frameworks & Agreements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {legalPages.map((page, idx) => {
                const PageIcon = page.icon;
                return (
                  <Link
                    key={idx}
                    to={page.path}
                    className="group p-4.5 bg-slate-50 hover:bg-purple-50/10 rounded-2xl border border-slate-200/50 hover:border-purple-200/50 transition-all flex flex-col justify-between space-y-3 text-left shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="h-8 w-8 bg-white border border-slate-200/60 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-purple-600 transition-colors">
                        <PageIcon className="h-4 w-4" />
                      </div>
                      <h4 className="text-xs font-black text-slate-800 group-hover:text-purple-600 transition-colors leading-tight">
                        {page.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-normal font-semibold line-clamp-2">
                        {page.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-slate-400 group-hover:text-purple-600 pt-1 border-t border-slate-200/40">
                      <span>View Policy</span>
                      <ChevronRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ROW 4: INTERACTIVE XML SITEMAP (IF AVAILABLE / DYNAMICALLY SYNCHRONIZED) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-secondary-400">
                  <FileCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-black text-brand-primary-950 tracking-tight leading-none">XML Sitemap Structure</h3>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase font-bold leading-none">Real-Time Search Engine Indexing (sitemap.xml)</p>
                </div>
              </div>
              <button
                onClick={() => setShowXmlSitemap(!showXmlSitemap)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary-950 hover:bg-brand-secondary-600 hover:text-brand-primary-950 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                {showXmlSitemap ? "Hide XML Code" : "Show XML Code"}
              </button>
            </div>

            {showXmlSitemap && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  This XML structure is dynamically computed from our master Category-Subcategory-Service registry. It automatically registers newly added published services to maintain high-priority crawling efficiency for search engines.
                </p>

                <div className="relative">
                  <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-2xl overflow-x-auto max-h-80 border border-slate-800 leading-relaxed shadow-inner">
                    <code>{generateXmlSitemap()}</code>
                  </pre>
                  
                  <button
                    onClick={handleCopyXml}
                    className="absolute top-3 right-3 p-2 bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-300 rounded-lg transition-all border border-slate-700/50 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {copiedXml ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy XML</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* 3. FOOTER TRUST CARD */}
      <section className="bg-slate-100 border-t border-slate-200 py-12" id="sitemap-trust-footer">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex justify-center gap-2 text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold">
            <span>Corporate Office</span>
            <span>&bull;</span>
            <span>Digital Consulting</span>
            <span>&bull;</span>
            <span>Secure TLS 1.3</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed font-semibold max-w-lg mx-auto">
            Legomark India is a premier corporate advisory and taxation consultant firm. Our digital portal offers secure encryption to host, track, and complete physical and statutory filings directly with government registries.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Verified CAs & Lawyers
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              100% Secure Portal
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
