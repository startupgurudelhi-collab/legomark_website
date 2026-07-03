/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Calendar,
  User,
  Clock,
  ArrowRight,
  ChevronRight,
  Download,
  Mail,
  Tag,
  Filter,
  CheckCircle2,
  Sparkles,
  X,
  Share2,
  Bookmark,
  ThumbsUp,
  Check,
  AlertCircle
} from "lucide-react";
import { useToast } from "../contexts/ToastContext.js";
import { Button } from "../components/Button.js";
import { Card } from "../components/Card.js";
import { Input } from "../components/Input.js";

// SEO & CMS BlogPost Interface definition
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  metaDescription: string;
  keywords: string[];
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readingTime: string;
  publishedDate: string;
  author: {
    name: string;
    avatarUrl: string;
    role: string;
  };
  featuredImage: string;
  canonicalUrl: string;
  isPlaceholder?: boolean;
}

// Premium Gradient Banner Component (Option B - CSS-based visual representation)
function BlogGradientBanner({
  title,
  category,
  readingTime,
  isFeatured = false
}: {
  title: string;
  category: string;
  readingTime: string;
  isFeatured?: boolean;
}) {
  let gradientClasses = "from-brand-primary-950 via-slate-900 to-brand-primary-900";
  let accentColor = "text-brand-secondary-400";
  let borderColor = "border-brand-secondary-500/20";
  let lightColor = "bg-brand-secondary-500/10";

  const catUpper = category.toUpperCase();
  if (catUpper.includes("COMPANY")) {
    gradientClasses = "from-blue-950 via-brand-primary-950 to-slate-900";
    accentColor = "text-blue-400";
    borderColor = "border-blue-500/20";
    lightColor = "bg-blue-500/10";
  } else if (catUpper.includes("GST")) {
    gradientClasses = "from-emerald-950 via-brand-primary-950 to-slate-900";
    accentColor = "text-emerald-400";
    borderColor = "border-emerald-500/20";
    lightColor = "bg-emerald-500/10";
  } else if (catUpper.includes("TAX") || catUpper.includes("INCOME")) {
    gradientClasses = "from-amber-950 via-brand-primary-950 to-slate-900";
    accentColor = "text-amber-400";
    borderColor = "border-amber-500/20";
    lightColor = "bg-amber-500/10";
  } else if (catUpper.includes("TRADEMARK")) {
    gradientClasses = "from-purple-950 via-brand-primary-950 to-slate-900";
    accentColor = "text-purple-400";
    borderColor = "border-purple-500/20";
    lightColor = "bg-purple-500/10";
  } else if (catUpper.includes("COMPLIANCE") || catUpper.includes("ROC")) {
    gradientClasses = "from-rose-950 via-brand-primary-950 to-slate-900";
    accentColor = "text-rose-400";
    borderColor = "border-rose-500/20";
    lightColor = "bg-rose-500/10";
  } else if (catUpper.includes("FSSAI")) {
    gradientClasses = "from-orange-950 via-brand-primary-950 to-slate-900";
    accentColor = "text-orange-400";
    borderColor = "border-orange-500/20";
    lightColor = "bg-orange-500/10";
  } else if (catUpper.includes("MSME")) {
    gradientClasses = "from-teal-950 via-brand-primary-950 to-slate-900";
    accentColor = "text-teal-400";
    borderColor = "border-teal-500/20";
    lightColor = "bg-teal-500/10";
  } else if (catUpper.includes("STARTUP")) {
    gradientClasses = "from-indigo-950 via-brand-primary-950 to-slate-900";
    accentColor = "text-indigo-400";
    borderColor = "border-indigo-500/20";
    lightColor = "bg-indigo-500/10";
  } else if (catUpper.includes("BUSINESS") || catUpper.includes("TIPS")) {
    gradientClasses = "from-pink-950 via-brand-primary-950 to-slate-900";
    accentColor = "text-pink-400";
    borderColor = "border-pink-500/20";
    lightColor = "bg-pink-500/10";
  } else if (catUpper.includes("LEGAL") || catUpper.includes("UPDATE")) {
    gradientClasses = "from-slate-800 via-brand-primary-950 to-slate-900";
    accentColor = "text-slate-400";
    borderColor = "border-slate-500/20";
    lightColor = "bg-slate-500/10";
  }

  return (
    <div className="relative flex flex-col justify-between p-6 md:p-8 h-full w-full bg-gradient-to-br text-white select-none overflow-hidden group min-h-[160px]">
      {/* Subtle graphic background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-secondary-500/5 rounded-full blur-2xl group-hover:bg-brand-secondary-500/10 transition-all duration-500" />
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses} transition-transform duration-500 group-hover:scale-105`} />
      
      {/* Top metadata row */}
      <div className="flex items-center justify-between z-10 w-full relative">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider ${lightColor} ${accentColor} border ${borderColor}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          {category}
        </span>
        <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-brand-secondary-400" />
          {readingTime}
        </span>
      </div>

      {/* Middle/Bottom Article Title text */}
      <div className="mt-6 z-10 space-y-2 relative">
        <h4 className={`font-display font-black tracking-tight text-white leading-snug group-hover:text-brand-secondary-300 transition-colors ${isFeatured ? 'text-2xl md:text-3xl' : 'text-sm md:text-base line-clamp-3'}`}>
          {title}
        </h4>
        <div className="h-1 w-12 bg-brand-secondary-500 rounded-full" />
      </div>

      {/* Bottom watermark decoration */}
      <div className="absolute bottom-4 right-4 text-[9px] font-mono tracking-widest text-white/10 uppercase font-bold select-none z-10">
        Legomark India
      </div>
    </div>
  );
}

// List of the 12 premium, fully-populated Indian legal & compliance articles
const activeArticles: BlogPost[] = [
  {
    id: 1,
    title: "Step-by-Step Guide to Registering a Private Limited Company in India (2026)",
    slug: "pvt-ltd-company-registration-guide",
    metaDescription: "Learn the complete step-by-step process of registering a Private Limited (Pvt Ltd) company with MCA in India. Documents, fees, timeline, and steps explained.",
    keywords: ["company registration", "pvt ltd", "mca filing", "incorporation", "startup india"],
    excerpt: "Learn about the complete MCA registration process, SPICe+ form requirements, digital signature certificates (DSC), and DIN setup for Indian founders.",
    category: "Company Registration",
    tags: ["Private Limited", "Startup India", "LLP"],
    readingTime: "8 min read",
    publishedDate: "June 25, 2026",
    author: {
      name: "Adv. Rahul Sharma",
      role: "Corporate Law Specialist",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/pvt-ltd-company-registration-guide",
    content: `
## Introduction to Private Limited Company Registration

Registering a **Private Limited (Pvt Ltd) Company** is the most popular corporate legal structure for startups and growing businesses in India. Governed by the **Ministry of Corporate Affairs (MCA)** under the Companies Act, 2013, a Private Limited structure offers credibility, limited liability protection, and seamless fundraising potential from Venture Capitalists.

In this comprehensive guide, we walk you through the complete step-by-step procedure to incorporate your company digitally through the **SPICe+ Portal** in 2026.

---

### Step 1: Obtain Digital Signature Certificates (DSC)
Since all MCA submissions are entirely online, the proposed directors must sign electronic applications using a Class-3 Digital Signature Certificate. 
- **Documents required:** PAN card, Aadhaar card, video verification, and mobile OTP verification.
- **Timeline:** Usually issued within 1–2 working days.

### Step 2: Apply for Name Approval (RUN Web Service)
Your company name must be unique, brandable, and compliant with MCA naming guidelines. You can propose up to two names in order of preference.
- Avoid generic terms or names matching existing trademarks.
- Name reservation is valid for **20 days** once approved.

### Step 3: Complete the SPICe+ Form (Part B)
This is the single-window application form that covers:
1. **Director Identification Number (DIN)** allocation.
2. **Incorporation** of the company.
3. **PAN & TAN** application for tax purposes.
4. **EPFO & ESIC** registration.
5. **Professional Tax** registration (state-specific).
6. **Bank Account Opening** facilitation.

### Step 4: Draft MoA and AoA
- **Memorandum of Association (MoA):** Defines the core objectives and business operations of the company.
- **Articles of Association (AoA):** Defines the internal regulations, management bylaws, and shareholder rights.

---

### Post-Incorporation Compliance Checklist
Once you receive your **Certificate of Incorporation (CoI)**, you must complete these immediate compliance steps:
1. **Open a Corporate Bank Account:** Deposit the paid-up capital within 180 days.
2. **File Commencement of Business (Form INC-20A):** Absolutely mandatory before starting operations or signing contracts.
3. **Appoint First Auditor:** Must be done within 30 days of incorporation.

*Need expert guidance? Use our chatbot or consultation form to connect with our legal advisors.*
    `
  },
  {
    id: 2,
    title: "GST Filing Checklist for Indian Small & Medium Enterprises",
    slug: "gst-filing-checklist-sme",
    metaDescription: "Avoid heavy penalties and late fees. Here is our monthly and quarterly GST reconciliation checklist for GSTR-1, GSTR-3B, and ITC claims for Indian SMEs.",
    keywords: ["gst filing", "gstr-1", "gstr-3b", "input tax credit", "sme compliance"],
    excerpt: "Avoid heavy penalties and late fees. Here is our monthly and quarterly GST reconciliation checklist for GSTR-1, GSTR-3B, and ITC claims.",
    category: "GST",
    tags: ["GST", "MSME", "Income Tax"],
    readingTime: "6 min read",
    publishedDate: "June 18, 2026",
    author: {
      name: "CA Priya Patel",
      role: "Indirect Tax Consultant",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/gst-filing-checklist-sme",
    content: `
## Streamlining GST Compliance for Your SME

Goods and Services Tax (GST) has transformed the tax landscape in India. While it simplifies inter-state trade, keeping up with GSTR filing schedules is vital for SMEs to maintain tax compliance and unlock **Input Tax Credit (ITC)**.

Failing to comply not only triggers daily late fees but also ruins your business credibility score on the GST portal.

---

### Monthly vs Quarterly GST Filing Pathways
Depending on your aggregate annual turnover, you fall under one of two major filing schemes:
1. **Regular Scheme (Monthly):** Mandatory for businesses with turnover > ₹5 Crores. Filings are due monthly.
2. **QRMP Scheme (Quarterly Return Monthly Payment):** Optional for taxpayers with turnover up to ₹5 Crores.

---

### Critical Monthly GST Checklist

#### 1. Outward Supplies (GSTR-1)
- **Due Date:** 11th of the succeeding month (monthly filers) or 13th of the month succeeding the quarter (QRMP).
- **Checks:** Reconcile your sales register with e-invoices, credit notes, and zero-rated export declarations.

#### 2. Input Tax Credit Reconciliation (GSTR-2B)
- **Action:** Compare your purchase register with GSTR-2B generated on the 14th of every month.
- **Rule:** Claim ITC *only* if the supplier has uploaded the invoice and paid their taxes. Under current GST laws, provisional ITC is completely blocked.

#### 3. Summary Return & Tax Payment (GSTR-3B)
- **Due Date:** 20th of the succeeding month (monthly) or 22nd/24th (quarterly depending on the state).
- **Checks:** Compute output liability, offset eligible ITC, and pay any remaining tax liability via net banking or UPI challans.

---

### Key Penalties for Late Filings
- **Nil returns:** ₹20 per day of delay (₹10 CGST + ₹10 SGST).
- **Active returns:** ₹50 per day of delay (₹25 CGST + ₹25 SGST), capped at a maximum limit of ₹5,000 per return.
- **Interest:** 18% per annum on the net cash liability paid late.
    `
  },
  {
    id: 3,
    title: "Secure Your Brand Name: The Complete Trademark Registration Process in India",
    slug: "trademark-registration-process-india",
    metaDescription: "A comprehensive guide on trademark class selection, logo searching, filling out TM-A, and resolving examiner trademark objections under Indian IP laws.",
    keywords: ["trademark registration", "ip protection", "brand protection", "trademark class", "tm objection"],
    excerpt: "A comprehensive guide on trademark class selection, logo searching, filling out TM-A, and resolving examiner trademark objections.",
    category: "Trademark",
    tags: ["Trademark", "Startup India", "LLP"],
    readingTime: "7 min read",
    publishedDate: "June 10, 2026",
    author: {
      name: "Adv. Amit Verma",
      role: "Intellectual Property Attorney",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/trademark-registration-process-india",
    content: `
## Brand Asset Protection: Trademark Filing in India

Your brand name, logo, slogan, or shape is your identity. In a highly competitive market, securing exclusive rights over your brand asset prevents competitors from copying your hard-earned reputation.

Under the **Trade Marks Act, 1999**, trademark registration in India grants you the sole right to use the symbol **®** and protect your business from legal infringement.

---

### The Trademark Registration Workflow

### Step 1: Comprehensive Trademark Public Search
Before filing, perform a thorough public search in the Intellectual Property India database.
- Search across the relevant **Class of Goods/Services** (Classes 1 to 45).
- Check for phonetically similar or identical names already registered or under process.

### Step 2: Preparing and Filing Form TM-A
Once you establish that your name is unique, submit the TM-A application on the IP India portal.
- **Documents needed:** Logo JPEG, User Affidavit (if brand is already in use), MSME Certificate (to get a 50% discount on government fees).
- Once submitted, you can immediately start using the **™** symbol next to your brand.

### Step 3: Vienna Codification
If your trademark contains visual elements or a logo, it undergoes Vienna Codification. The registry assigns a specific code based on international classifications.

### Step 4: Examination Report & Trademark Objections
The Registrar examines your application to check if it violates:
- **Section 9 (Absolute Grounds):** If the name is too generic, descriptive, or geographical.
- **Section 11 (Relative Grounds):** If the name is similar to existing registered trademarks.
*If objected, you must file a formal reply within 30 days.*

---

### Government Fee Breakdown (2026)
- **Individuals / Startups / MSMEs:** ₹4,500 per class (e-filing).
- **Corporates / Large Enterprises:** ₹9,000 per class (e-filing).
    `
  },
  {
    id: 4,
    title: "New MSME Registration Benefits & Udyam Portal Updates",
    slug: "msme-registration-udyam-benefits",
    metaDescription: "Discover how registering on the Udyam portal unlocks cheaper bank collateral-free loans, priority sector lending, and government tender subsidies for Indian MSMEs.",
    keywords: ["udyam registration", "msme benefits", "collateral free loan", "priority sector lending", "mca portal"],
    excerpt: "Discover how registering on the Udyam portal unlocks cheaper bank collateral-free loans, priority sector lending, and government tender subsidies.",
    category: "MSME",
    tags: ["MSME", "Business Tips", "Startup India"],
    readingTime: "5 min read",
    publishedDate: "June 04, 2026",
    author: {
      name: "Sanjay Mehta",
      role: "SME Advisory Director",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/msme-registration-udyam-benefits",
    content: `
## Unlocking Benefits with Udyam (MSME) Registration

The Government of India has introduced several schemes to support Micro, Small, and Medium Enterprises (MSMEs). The gateway to all government schemes, subsidies, and credit benefits is the **Udyam Registration Portal**.

Let's look at the updated classification of MSMEs and how your business can leverage its status to boost operational liquidity.

---

### Revised MSME Classification Criteria
Classification is based on a combined limit of **Investment in Plant & Machinery** and **Annual Turnover**:
- **Micro:** Investment ≤ ₹1 Crore AND Turnover ≤ ₹5 Crores.
- **Small:** Investment ≤ ₹10 Crores AND Turnover ≤ ₹50 Crores.
- **Medium:** Investment ≤ ₹50 Crores AND Turnover ≤ ₹250 Crores.

---

### Top 5 Benefits of Udyam MSME Registration

#### 1. Collateral-Free Bank Loans (CGTMSE)
Under the Credit Guarantee Fund Trust for Micro and Small Enterprises scheme, registered businesses can obtain credit facilities from public and private banks without offering collateral security.

#### 2. Protection Against Delayed Payments (MSME Samadhaan)
If a buyer fails to pay you within 45 days of receiving goods or services, the buyer is legally obligated to pay compound interest at three times the bank rate notified by RBI. You can file disputes easily on the Samadhaan Portal.

#### 3. 50% Subsidy on Patent & Trademark Fees
Filing intellectual property is highly subsidized for MSMEs. You get an automatic 50% discount on official government fees for patents, trademarks, and design applications.

#### 4. Subsidies on Electricity Bills & ISO Certifications
Most Indian state governments provide electricity bill discounts to MSMEs operating in designated manufacturing zones. Additionally, charges paid for obtaining ISO certification are fully reimbursable.
    `
  },
  {
    id: 5,
    title: "Demystifying ROC Compliance for Startups: Annual Filings Simplified",
    slug: "roc-compliance-startups-guide",
    metaDescription: "Key ROC compliance dates for AOC-4, MGT-7, and Director KYC filings. Stay 100% compliant and protect your active company status on the MCA.",
    keywords: ["roc compliance", "aoc-4", "mgt-7", "director kyc", "mca annual return"],
    excerpt: "Key ROC compliance dates for AOC-4, MGT-7, and Director KYC filings. Stay 100% compliant and protect your active company status.",
    category: "ROC Compliance",
    tags: ["ROC", "Private Limited", "LLP"],
    readingTime: "7 min read",
    publishedDate: "May 28, 2026",
    author: {
      name: "CS Divya Patel",
      role: "Company Secretary",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/roc-compliance-startups-guide",
    content: `
## Stay Compliant: Demystifying ROC Filings

Registering a Private Limited Company is just the first step. Every incorporated company is legally bound to file its financial health reports and administrative updates with the **Registrar of Companies (ROC)** every financial year.

Failing to submit these filings leads to massive daily penalties, disqualification of directors, and your company being struck off from the MCA register.

---

### Non-Negotiable Annual ROC Filings

#### 1. Form AOC-4 (Filing Financial Statements)
- **Purpose:** Submit Balance Sheet, Profit & Loss Statement, Auditor's Report, and Director's Report.
- **Due Date:** Within 30 days of holding your Annual General Meeting (AGM) (Typically by October 30th).

#### 2. Form MGT-7 (Filing Annual Return)
- **Purpose:** Report changes in shareholding pattern, directors, capital structure, and board meetings.
- **Due Date:** Within 60 days of holding the AGM (Typically by November 29th).

#### 3. DIR-3 KYC (Director KYC Verification)
- **Purpose:** Annual verification of active directors' email, mobile, and residential address.
- **Due Date:** Mandatory submission by September 30th of every financial year.

---

### Pitfalls of Non-Compliance
- **Financial Penalties:** Standard late fee of **₹100 per day** per form. Delayed filing of both AOC-4 and MGT-7 for 3 months can easily trigger ₹18,000+ in penalties.
- **Legal Strike-off:** If a company does not file returns for two consecutive years, ROC can strike off the company name and freeze bank accounts.
    `
  },
  {
    id: 6,
    title: "FSSAI Central vs State Food License: Which One Does Your Food Business Need?",
    slug: "fssai-central-vs-state-license-guide",
    metaDescription: "Crucial legal guide for food startups, cloud kitchens, and exporters regarding licensing eligibility, document uploads, and hygiene compliance under FSSAI.",
    keywords: ["fssai license", "food safety", "state license", "central fssai", "cloud kitchen license"],
    excerpt: "Crucial legal guide for food startups, cloud kitchens, and exporters regarding licensing eligibility, document uploads, and hygiene compliance.",
    category: "FSSAI",
    tags: ["FSSAI", "Business Tips", "GST"],
    readingTime: "6 min read",
    publishedDate: "May 20, 2026",
    author: {
      name: "Dr. K. Raghavan",
      role: "Food Safety Advisor",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/fssai-central-vs-state-license-guide",
    content: `
## Food Safety & Standards: Choosing the Right FSSAI License

If you are manufacturing, packaging, distributing, exporting, or selling food items in India, securing an **FSSAI License/Registration** is your first operational hurdle. Mandated by the **Food Safety and Standards Authority of India**, this license certifies that your food matches rigorous safety standards.

Let's break down the three distinct categories of FSSAI registrations so you apply for the correct license.

---

### The Three FSSAI License Categories

#### 1. FSSAI Basic Registration
- **Eligibility:** For small-scale food business operators (FBOs) with an annual turnover **under ₹12 Lakhs**.
- **Suitable for:** Petty retailers, temporary stallholders, local dairies, and micro cloud kitchens.

#### 2. FSSAI State License
- **Eligibility:** For medium-sized FBOs with an annual turnover between **₹12 Lakhs and ₹20 Crores**.
- **Suitable for:** Three-star hotels, medium restaurants, food caterers, warehouses, and state-level wholesalers.

#### 3. FSSAI Central License
- **Eligibility:** For large manufacturers, importers, multi-state operators, or businesses with turnover **exceeding ₹20 Crores**.
- **Suitable for:** Food exporters/importers, defense catering, airport retail, and franchises operating in multiple states.

---

### Checklist of Core Documents
- Photo identity proof of the promoter.
- Complete floor plan layout of the food production facility.
- Certificate of analysis for drinking water used in production.
- List of machinery and processing equipment with installed horsepower.
- Authority letter authorizing the compliance specialist.
    `
  },
  {
    id: 7,
    title: "Startup India DPIIT Recognition: How to Claim 3-Year Income Tax Exemption",
    slug: "startup-india-dpiit-recognition-benefits",
    metaDescription: "Unlock tax benefits, government funding, and intellectual property rebates by getting recognized as an innovative startup under DPIIT.",
    keywords: ["startup india", "dpiit recognition", "income tax exemption", "section 80iac", "startup funding"],
    excerpt: "Unlock tax benefits, government funding, and intellectual property rebates by getting recognized as an innovative startup under DPIIT.",
    category: "Startup India",
    tags: ["Startup India", "Income Tax", "Private Limited"],
    readingTime: "7 min read",
    publishedDate: "May 15, 2026",
    author: {
      name: "Ananya Sen",
      role: "Venture Advisor & Legal Consultant",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/startup-india-dpiit-recognition-benefits",
    content: `
## DPIIT Recognition: Elevating Your Innovative Venture

The **Startup India Initiative** was launched to foster innovation, create jobs, and scale sustainable businesses. By securing the formal **DPIIT (Department for Promotion of Industry and Internal Trade) Recognition**, startups unlock highly lucrative financial, tax, and procurement incentives.

---

### Step 1: Eligibility Check for DPIIT Recognition
Before applying, ensure your entity meets these conditions:
1. **Entity Type:** Registered as a Private Limited Company, LLP, or Registered Partnership.
2. **Age of Entity:** Incorporated for **less than 10 years**.
3. **Turnover Limit:** Annual turnover has never exceeded **₹100 Crores** in any preceding financial year.
4. **Innovation-Driven:** The business must be actively working towards development, commercialization, or improvement of products, processes, or services.

---

### Highly Coveted DPIIT Benefits

#### 1. 3-Year Income Tax Exemption (Section 80-IAC)
Once DPIIT recognized, startups can apply to the Inter-Ministerial Board for tax exemptions. Successful startups get a 100% tax holiday for three consecutive years out of their first ten years.

#### 2. Exemption from Angel Tax (Section 56(2)(viib))
Startups issuing shares above fair market value (FMV) to investors are completely exempted from Angel Tax, provided their aggregate paid-up share capital and premium doesn't exceed ₹25 Crores.

#### 3. Relaxed Public Procurement Norms
Government tenders can be extremely competitive. DPIIT-recognized startups get exempted from prior turnover and experience criteria, and they don't have to deposit earnest money deposit (EMD) to participate.
    `
  },
  {
    id: 8,
    title: "Essential Legal Agreements Every Indian Tech Startup Needs Before Launch",
    slug: "essential-legal-agreements-tech-startups",
    metaDescription: "A breakdown of non-disclosure agreements (NDAs), co-founder agreements, terms of service, and IP assignment clauses for Indian startups.",
    keywords: ["legal agreements", "co-founder agreement", "nda", "ip assignment", "terms of service"],
    excerpt: "A breakdown of non-disclosure agreements (NDAs), co-founder agreements, terms of service, and IP assignment clauses.",
    category: "Legal Updates",
    tags: ["Private Limited", "Business Tips", "LLP"],
    readingTime: "6 min read",
    publishedDate: "May 08, 2026",
    author: {
      name: "Adv. Meera Nair",
      role: "Corporate Counsel",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/essential-legal-agreements-tech-startups",
    content: `
## Legal Architecture: Contracts That Protect Your Tech Startup

In the fast-paced world of technology startups, code is written, domains are purchased, and capital is invested in a matter of days. However, operating without proper legal agreements leaves your brand open to devastating lawsuits, intellectual property theft, and equity disputes.

---

### 1. Co-Founder Agreement
The most critical initial document. Don't rely on oral understandings.
- **Must cover:** Equity splitting schedules, vesting periods (usually 4 years with a 1-year cliff), roles & responsibilities, and exit mechanisms if a co-founder leaves early.

### 2. Intellectual Property (IP) Assignment Agreement
An absolute prerequisite for raising venture capital.
- Ensures that all code, designs, algorithms, and patents created by founders, employees, and freelance contractors belong exclusively to the corporate entity, not the individual creators.

### 3. Non-Disclosure Agreement (NDA)
Protect your proprietary tech stacks, client lists, and strategic roadmaps.
- Sign a mutual or unilateral NDA before discussing partnership integrations, vendor terms, or raising seed capital from angels.

### 4. Terms of Service & Privacy Policy (IT Act, 2000 compliant)
Mandatory for any website or mobile application collecting user data.
- Must detail user data processing practices, cookies, payment gateways, liability limits, and dispute jurisdictions.
    `
  },
  {
    id: 9,
    title: "Income Tax Audit Limits and Rules for Indian Businesses (AY 2026-27)",
    slug: "income-tax-audit-limits-business",
    metaDescription: "Understand the threshold limits for tax audits under Section 44AB and how presumptive taxation under Section 44AD can save tax money for small businesses.",
    keywords: ["tax audit limits", "section 44ab", "section 44ad", "income tax audit", "presumptive taxation"],
    excerpt: "Understand the threshold limits for tax audits under Section 44AB and how presumptive taxation under Section 44AD can save tax money.",
    category: "Income Tax",
    tags: ["Income Tax", "MSME", "Business Tips"],
    readingTime: "5 min read",
    publishedDate: "April 30, 2026",
    author: {
      name: "CA Rajesh Patel",
      role: "Corporate Tax Auditor",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/income-tax-audit-limits-business",
    content: `
## Income Tax Audits: Limits, Thresholds & Presumptive Schemes

The Income Tax Act, 1961 requires certain categories of taxpayers to get their accounts audited by a qualified Chartered Accountant. This ensures that the financial declarations made in your Income Tax Returns (ITR) are completely transparent and verified.

Let's look at the limits under **Section 44AB** and how small businesses can bypass audit requirements using the presumptive taxation scheme.

---

### Tax Audit Threshold Limits under Section 44AB

#### For Business Entities:
- **General Threshold:** Tax Audit is mandatory if total sales or turnover exceeds **₹1 Crore** in a financial year.
- **Enhanced Threshold (95% Cashless Transactions):** If your cash receipts and cash payments are less than 5% of your total transactions, the audit threshold is raised to **₹10 Crores**.

#### For Professional Practices:
- **General Threshold:** Tax Audit is mandatory if gross receipts exceed **₹50 Lakhs** (raised to ₹75 Lakhs under cashless presumptive rules).

---

### Presumptive Taxation Scheme (Section 44AD)
To relieve small business taxpayers from the burden of maintaining exhaustive books of accounts, the Government introduced the **Section 44AD Presumptive Taxation Scheme**:
- Eligible for businesses with annual turnover **up to ₹3 Crores** (for AY 2026-27).
- You can declare a flat net profit of **8%** (or **6%** for digital receipts) on your turnover.
- No requirement to maintain account books or undergo a formal tax audit!
    `
  },
  {
    id: 10,
    title: "Getting an Import Export Code (IEC) in India: Documents and Fees",
    slug: "import-export-code-iec-registration",
    metaDescription: "A fast-track guide on DGFT portal application, bank certificate requirements, and custom clearance setup for international trade.",
    keywords: ["iec registration", "import export code", "dgft portal", "custom clearance", "international trade"],
    excerpt: "A fast-track guide on DGFT portal application, bank certificate requirements, and custom clearance setup for international trade.",
    category: "Legal Updates",
    tags: ["IEC", "Startup India", "GST"],
    readingTime: "4 min read",
    publishedDate: "April 22, 2026",
    author: {
      name: "Adv. Amit Verma",
      role: "Trade Law Consultant",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/import-export-code-iec-registration",
    content: `
## Accessing Global Markets: Securing Your Import Export Code

If your startup is looking to ship tech gadgets overseas, distribute organic foods internationally, or buy machinery from global vendors, you must secure an **Import Export Code (IEC)**.

Issued by the **Directorate General of Foreign Trade (DGFT)**, this 10-digit code acts as your business's permanent passport for trade activities.

---

### When is IEC Mandatory?
- When custom clearers require code validation for outward/inward shipments.
- When an exporter receives foreign exchange directly into their corporate bank account.
- When sending commercial samples or machinery parts.

---

### The Application Blueprint on the DGFT Portal

### Step 1: Register on DGFT website
- Register an account on the official DGFT portal using your Aadhaar or Digital Signature.

### Step 2: Fill out ANF-2A Form
- Input business details matching your PAN and GSTIN (if applicable).
- Provide branch details and bank details.

### Step 3: Document Uploads
- PAN Card of the company or individual.
- Cancelled Cheque leaf or Banker's Certificate with printed company name.
- Business Address proof (Rent agreement, electricity bill, or No Objection Certificate).

### Step 4: Pay Application Fees
- The government application fee is a nominal ₹500.

---

### Delivery of IEC Certificate
Once processed and verified by the regional DGFT desk (often completely automated within **24 hours**), the system generates an e-IEC certificate which you can download instantly. It has lifetime validity.
    `
  },
  {
    id: 11,
    title: "LLP vs Private Limited: Choosing the Right Business Structure",
    slug: "llp-vs-private-limited-comparison",
    metaDescription: "A thorough comparison of operational flexibility, compliance costs, capital raising, and liability structures between LLP and Pvt Ltd in India.",
    keywords: ["llp vs private limited", "limited liability partnership", "pvt ltd", "corporate structure", "business formation"],
    excerpt: "A thorough comparison of operational flexibility, compliance costs, capital raising, and liability structures between LLP and Pvt Ltd.",
    category: "Company Registration",
    tags: ["LLP", "Private Limited", "Startup India"],
    readingTime: "7 min read",
    publishedDate: "April 15, 2026",
    author: {
      name: "CS Divya Patel",
      role: "Company Secretary",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/llp-vs-private-limited-comparison",
    content: `
## Comparing LLP and Private Limited Companies

Deciding between a **Limited Liability Partnership (LLP)** and a **Private Limited (Pvt Ltd) Company** is a crucial choice that dictates your business's future operational costs, funding potential, and regulatory obligations.

Both structures offer limited liability protection, but they differ significantly in administration and capital structures.

---

| Core Feature | Limited Liability Partnership (LLP) | Private Limited Company (Pvt Ltd) |
|---|---|---|
| **Governing Law** | LLP Act, 2008 | Companies Act, 2013 |
| **Minimum Members** | 2 Partners (No Upper Limit) | 2 Directors (Max 200 Shareholders) |
| **Operational Costs** | Very low, minimal statutory audits | Medium to high, mandatory statutory audits |
| **Equity Funding** | Extremely hard, cannot issue shares | Highly seamless, easy to issue equity to VCs |
| **Annual AGM** | No mandatory requirement | Mandatory Board and Annual Meetings |

---

### When to Choose an LLP
- If you are a professional services firm, consultancy, or family business.
- If you want lower annual audit and compliance costs.
- If you do not plan to raise capital from venture funds or issue ESOPs to employees.

### When to Choose a Private Limited Company
- If you are a high-growth tech startup looking to pitch to Angel networks or Venture Capital funds.
- If you plan to issue Employee Stock Options (ESOPs) to attract top talent.
- If you want the maximum level of corporate credibility and brand prestige.
    `
  },
  {
    id: 12,
    title: "Understanding TDS and TCS: Corporate Tax Compliance in India",
    slug: "tds-tcs-tax-compliance-corporate",
    metaDescription: "Learn about tax deducted at source (TDS) rates, deposit deadlines, Form 24Q/26Q quarterly filings, and how to avoid interest penalties in India.",
    keywords: ["tds tcs", "tax deducted at source", "form 26q", "form 24q", "corporate taxation"],
    excerpt: "Learn about tax deducted at source (TDS) rates, deposit deadlines, Form 24Q/26Q quarterly filings, and how to avoid interest penalties.",
    category: "Income Tax",
    tags: ["Income Tax", "GST", "MSME"],
    readingTime: "6 min read",
    publishedDate: "April 05, 2026",
    author: {
      name: "CA Priya Patel",
      role: "Corporate Tax Specialist",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600",
    canonicalUrl: "https://legomark.in/blogs/tds-tcs-tax-compliance-corporate",
    content: `
## Navigating TDS and TCS: Corporate Tax Deductions

Tax Deducted at Source (TDS) and Tax Collected at Source (TCS) are mechanisms introduced by the Income Tax Department to collect tax right at the origin of income. As a business owner, you are legally designated as a withholding agent.

This means you must deduct tax before making specific payments (like salary, professional fees, or rent) and deposit it into the government treasury.

---

### Non-Negotiable Deadlines to Remember
- **Monthly Deposit:** TDS/TCS deducted in a month must be deposited on or before the **7th day of the succeeding month** (except for March, which is April 30th).
- **Quarterly Filings:** You must submit quarterly returns (Form 24Q for Salaries, Form 26Q for Non-Salaries) within 30 days of the quarter ending.

---

### Key TDS Sections & Rates (AY 2026-27)

#### 1. Section 194C (Contractual Payments)
- **Rate:** 1% for Individual/HUF vendors, 2% for corporate vendors.
- **Limit:** Deduct if single payment > ₹30,000 or aggregate > ₹1,00,000 in a FY.

#### 2. Section 194J (Professional & Technical Fees)
- **Rate:** 10% for professional services (reduced to 2% for technical or call center services).
- **Limit:** Deduct if annual aggregate > ₹30,000.

#### 3. Section 194I (Rent on Land & Building)
- **Rate:** 10% on payments exceeding ₹2,40,000 annually.

---

### Penalties for Defaults
- **Late Payment Interest:** 1.5% per month or part of a month on the tax deducted but paid late.
- **Late Deduction Interest:** 1% per month from the date on which tax was deductible to the date of actual deduction.
- **Late filing fees:** ₹200 per day of delay under Section 234E for delayed quarterly returns.
    `
  }
];

// Generate the remaining 38 empty placeholder slots to fulfill the 50 articles architecture
const placeholderArticles: BlogPost[] = Array.from({ length: 38 }).map((_, i) => {
  const cmsSlotNum = i + 13;
  const categoriesList = [
    "Company Registration", "GST", "Income Tax", "Trademark", 
    "ROC Compliance", "FSSAI", "MSME", "Startup India", 
    "Business Tips", "Legal Updates"
  ];
  const tagsList = ["GST", "Private Limited", "Trademark", "FSSAI", "Income Tax", "MSME", "LLP", "IEC", "Startup India", "ROC"];
  
  // Distribute categories and tags evenly across the placeholders
  const category = categoriesList[i % categoriesList.length];
  const tag = tagsList[i % tagsList.length];
  const secondaryTag = tagsList[(i + 2) % tagsList.length];

  return {
    id: cmsSlotNum,
    title: `Future Legal Article Slot #${cmsSlotNum} (CMS Ready)`,
    slug: `cms-legal-article-slot-${cmsSlotNum}`,
    metaDescription: `Placeholder for a future CMS-driven legal advisory article on ${category}. Once published, this metadata will sync with Google Search indexes automatically.`,
    keywords: [category.toLowerCase(), tag.toLowerCase(), "compliance", "india", "legal portal"],
    excerpt: `This article slot is pre-configured and fully schema-compliant. Once database credentials or API integrations are linked via the Admin Portal, this card will display full text, imagery, and interactive workflows.`,
    category: category,
    tags: [tag, secondaryTag],
    readingTime: "5 min read",
    publishedDate: "Pending CMS Sync",
    author: {
      name: "Legomark Admin Portal",
      role: "System Automation",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"
    },
    featuredImage: "",
    canonicalUrl: `https://legomark.in/blogs/cms-legal-article-slot-${cmsSlotNum}`,
    isPlaceholder: true,
    content: `
## Future Legal Article Slot #${cmsSlotNum}

This slot represents a fully functional structural placeholder within the Legomark Knowledge Hub. It is complete with all required SEO schema tags, slugs, canonical mapping, and category badges.

### Connecting Your CMS:
1. Navigate to the **Admin Portal / CMS Dashboard**.
2. Create an article entry with title, author details, content, and category set to **${category}**.
3. Link the backend database (Firestore or PostgreSQL) API endpoint.
4. The frontend will dynamically replace this placeholder with live editorial content instantly.
    `
  };
});

// Full consolidated list of 50 articles
const all50Articles = [...activeArticles, ...placeholderArticles];

// The 10 requested premium categories with custom stylings
const categories = [
  { name: "Company Registration", color: "from-blue-500/10 to-blue-600/10 text-blue-700 border-blue-200" },
  { name: "GST", color: "from-emerald-500/10 to-emerald-600/10 text-emerald-700 border-emerald-200" },
  { name: "Income Tax", color: "from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200" },
  { name: "Trademark", color: "from-purple-500/10 to-purple-600/10 text-purple-700 border-purple-200" },
  { name: "ROC Compliance", color: "from-red-500/10 to-red-600/10 text-red-700 border-red-200" },
  { name: "FSSAI", color: "from-orange-500/10 to-orange-600/10 text-orange-700 border-orange-200" },
  { name: "MSME", color: "from-teal-500/10 to-teal-600/10 text-teal-700 border-teal-200" },
  { name: "Startup India", color: "from-indigo-500/10 to-indigo-600/10 text-indigo-700 border-indigo-200" },
  { name: "Business Tips", color: "from-pink-500/10 to-pink-600/10 text-pink-700 border-pink-200" },
  { name: "Legal Updates", color: "from-slate-500/10 to-slate-600/10 text-slate-700 border-slate-200" }
];

// Popular Topics Tags Chips
const popularTags = ["GST", "Private Limited", "Trademark", "FSSAI", "Income Tax", "MSME", "LLP", "IEC", "Startup India", "ROC"];

export default function BlogsPage() {
  const toast = useToast();

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("legomark_recent_searches");
      return saved ? JSON.parse(saved) : ["Company Registration", "GST Check", "Trademark"];
    } catch {
      return ["Company Registration", "GST Check", "Trademark"];
    }
  });

  // Active article state for details modal reader
  const [activeReadingArticle, setActiveReadingArticle] = useState<BlogPost | null>(null);

  // Email state for subscription
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Free consultation state in sidebar
  const [consultationName, setConsultationName] = useState("");
  const [consultationPhone, setConsultationPhone] = useState("");
  const [consultationService, setConsultationService] = useState("Company Registration");
  const [isSubmittingConsultation, setIsSubmittingConsultation] = useState(false);

  // Checklist download state
  const [checklistEmail, setChecklistEmail] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // Save searches to storage
  useEffect(() => {
    try {
      localStorage.setItem("legomark_recent_searches", JSON.stringify(recentSearches));
    } catch (e) {
      console.error(e);
    }
  }, [recentSearches]);

  // Handle live search click & search action
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
  };

  const executeSearch = (term: string) => {
    if (!term.trim()) return;
    setSearchQuery(term);
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 5); // Keep top 5
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    toast.info("Recent searches cleared");
  };

  // Filtered list of articles
  const filteredArticles = useMemo(() => {
    // Select base list depending on whether placeholder toggle is active
    const baseList = showPlaceholders ? all50Articles : activeArticles;

    return baseList.filter((post) => {
      // 1. Category filter
      if (selectedCategory && post.category !== selectedCategory) {
        return false;
      }

      // 2. Tag filter
      if (selectedTag && !post.tags.includes(selectedTag)) {
        return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesCategory = post.category.toLowerCase().includes(query);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(query);
        const matchesTags = post.tags.some((t) => t.toLowerCase().includes(query));
        const matchesKeywords = post.keywords.some((k) => k.toLowerCase().includes(query));

        return matchesTitle || matchesCategory || matchesExcerpt || matchesTags || matchesKeywords;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedTag, showPlaceholders]);

  // Featured Article is always the first active article
  const featuredArticle = activeArticles[0];

  // Latest 4 posts for the sidebar (excluding featured article)
  const latestPostsForSidebar = useMemo(() => {
    return activeArticles.slice(1, 5);
  }, []);

  // Handle Newsletter subscribe
  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      toast.success("Subscription successful! Check your inbox for updates.");
      setNewsletterEmail("");
    }, 1200);
  };

  // Handle Consultation submit
  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!consultationPhone.trim() || consultationPhone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setIsSubmittingConsultation(true);
    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formType: "Blogs Quick Connect",
          name: consultationName,
          phone: consultationPhone,
          service: consultationService,
          message: `Inquiry for ${consultationService} from Blogs page Quick Connect.`
        })
      });
      
      const resData = await response.json();
      if (response.ok && resData.success) {
        toast.success(`Request registered! An expert for ${consultationService} will call you back within 15 minutes.`);
        setConsultationName("");
        setConsultationPhone("");
      } else {
        toast.error(resData.message || "Failed to register request. Please try again.");
      }
    } catch (err) {
      console.error("Consultation submission error:", err);
      toast.error("Network error. Could not connect to the server.");
    } finally {
      setIsSubmittingConsultation(false);
    }
  };

  // Handle Checklist Download
  const handleChecklistDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checklistEmail.trim() || !checklistEmail.includes("@")) {
      toast.error("Please enter a valid email to receive the PDF checklist.");
      return;
    }
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast.success("Checklist successfully sent to your email! Download started.");
      setChecklistEmail("");

      // Simulate browser trigger download of dummy checklist content
      const dummyChecklist = `LEGOMARK INDIA - COMPANY REGISTRATION CHECKLIST 2026\n\n1. PAN and Aadhaar Card of all Directors\n2. Passport Size Photos\n3. Bank Account Statement / Utility Bill for Address Proof\n4. Digital Signature Certificate (DSC)\n5. Proposed Unique Brand Names\n6. No Objection Certificate (NOC) from landlord\n\nVisit legomark.in for professional advisory.`;
      const blob = new Blob([dummyChecklist], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Legomark-Company-Registration-Checklist.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  return (
    <div className="bg-slate-50/70 min-h-screen pb-16 md:pb-24 font-sans" id="knowledge-hub-page">
      {/* 1. HERO SECTION */}
      <section className="bg-brand-primary-950 text-white py-16 md:py-24 relative overflow-hidden" id="blogs-hero">
        {/* Background visual graphics */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent_45%)]" />
        <div className="absolute left-0 bottom-0 right-0 h-24 bg-gradient-to-t from-slate-50/70 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-brand-secondary-500/10 text-brand-secondary-400 border border-brand-secondary-500/20">
              <Sparkles className="h-3 w-3" /> Legomark Advisory Portal
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-none text-white">
              Knowledge Hub
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-sans">
              Expert insights on Company Registration, GST, Trademark, Taxation, ROC Compliance, Startup Advisory and Business Growth.
            </p>

            {/* LIVE SEARCH BAR */}
            <div className="pt-4 max-w-2xl mx-auto" id="hub-search-box">
              <form onSubmit={(e) => { e.preventDefault(); executeSearch(searchQuery); }} className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles by title, category, tags, or keywords..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-xl pl-12 pr-28 py-4 text-sm md:text-base border border-slate-200/50 shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary-500 focus:border-brand-secondary-500 transition-all font-sans"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white text-xs md:text-sm font-bold font-sans rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Search
                </button>
              </form>
              
              {/* Active filters status indicators */}
              {(selectedCategory || selectedTag || searchQuery) && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-mono">
                  <span className="text-slate-400">Active Filters:</span>
                  {selectedCategory && (
                    <span className="bg-slate-800 text-brand-secondary-400 px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1">
                      Cat: {selectedCategory}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
                    </span>
                  )}
                  {selectedTag && (
                    <span className="bg-slate-800 text-brand-secondary-400 px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1">
                      Tag: #{selectedTag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedTag(null)} />
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-slate-800 text-brand-secondary-400 px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1">
                      Query: &quot;{searchQuery}&quot;
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedTag(null);
                      setSearchQuery("");
                    }}
                    className="text-slate-400 hover:text-white underline ml-1 cursor-pointer"
                  >
                    Reset All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES FILTER CARDS */}
      <section className="py-12 bg-white border-b border-slate-100" id="categories-section">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-secondary-600">Select Domain</h2>
              <h3 className="text-xl md:text-2xl font-display font-bold text-brand-primary-950">Popular Topics & Categories</h3>
            </div>
            
            {/* Toggle Placeholders to demonstrate the 50 cards layout */}
            <div className="flex items-center gap-2 self-start md:self-center">
              <span className="text-xs text-slate-500 font-mono font-medium">Include Future CMS Slots (38)</span>
              <button
                type="button"
                onClick={() => {
                  setShowPlaceholders(!showPlaceholders);
                  toast.info(
                    !showPlaceholders
                      ? "Showing all 50 slots! 12 populated + 38 dynamic placeholders."
                      : "Filtered back to 12 active legal articles."
                  );
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showPlaceholders ? "bg-brand-secondary-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showPlaceholders ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategory(isActive ? null : cat.name);
                    setSelectedTag(null);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between aspect-[4/3] ${
                    isActive
                      ? "bg-brand-primary-950 border-brand-primary-950 text-white shadow-lg ring-2 ring-brand-secondary-500"
                      : `bg-gradient-to-br ${cat.color} hover:shadow-md hover:scale-[1.02]`
                  }`}
                >
                  <BookOpen className={`h-5 w-5 ${isActive ? "text-brand-secondary-400" : "text-slate-600"}`} />
                  <div className="mt-4">
                    <span className={`block text-xs font-mono font-bold ${isActive ? "text-brand-secondary-300" : "text-slate-400"}`}>
                      Category
                    </span>
                    <span className="font-display font-bold text-xs md:text-sm block leading-tight mt-1">
                      {cat.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED ARTICLE & MAIN CONTENT GRID */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {/* ONLY DISPLAY FEATURED CARD IF NO ACTIVE CATEGORY/TAG/SEARCH FILTERS ARE CURRENTLY SELECTED */}
          {!selectedCategory && !selectedTag && !searchQuery && (
            <div className="mb-16" id="featured-article-container">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-brand-secondary-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-brand-secondary-600 uppercase tracking-widest">
                  Featured Publication
                </span>
              </div>

              {/* Large Premium Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-brand grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
                
                {/* Visual Image container - Replaced with Option B Premium CSS Gradient Banner */}
                <div className="lg:col-span-7 relative min-h-[300px] flex">
                  <BlogGradientBanner
                    title={featuredArticle.title}
                    category={featuredArticle.category}
                    readingTime={featuredArticle.readingTime}
                    isFeatured={true}
                  />
                </div>

                {/* Information container */}
                <div className="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between space-y-6 bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {featuredArticle.publishedDate}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featuredArticle.readingTime}</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-display font-extrabold text-brand-primary-950 tracking-tight leading-snug">
                      {featuredArticle.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 leading-relaxed font-sans">
                      {featuredArticle.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {featuredArticle.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-brand-primary-950 border border-slate-200 flex items-center justify-center text-white font-bold text-xs select-none shadow-inner">
                        {featuredArticle.author.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{featuredArticle.author.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{featuredArticle.author.role}</p>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="group cursor-pointer"
                      onClick={() => setActiveReadingArticle(featuredArticle)}
                    >
                      Read More <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TWO COLUMN GRID LAYOUT (Main Blog Grid vs Right Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* LEFT COLUMN: BLOG LISTING GRID (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-8" id="blog-listing-pane">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-display font-bold text-brand-primary-950">
                    Latest Articles {selectedCategory ? `in ${selectedCategory}` : ""}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing {filteredArticles.length} of {showPlaceholders ? "50" : "12"} structured slots
                  </p>
                </div>
                
                {/* Active Tag filter badge */}
                {selectedTag && (
                  <span className="text-xs bg-brand-secondary-50 text-brand-secondary-600 px-2.5 py-1 rounded-md border border-brand-secondary-200/50 flex items-center gap-1.5 font-mono">
                    Tag: #{selectedTag}
                    <X className="h-3 w-3 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setSelectedTag(null)} />
                  </span>
                )}
              </div>

              {filteredArticles.length === 0 ? (
                <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
                  <AlertCircle className="h-10 w-10 text-brand-secondary-500 mx-auto" />
                  <h4 className="font-display font-bold text-slate-800 text-lg">No Publications Match Your Filters</h4>
                  <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                    We couldn't find any articles matching &quot;{searchQuery}&quot; under the chosen filters. Try clearing some constraints or toggle the &quot;Include Future CMS Slots&quot; switch above.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedTag(null);
                      setSearchQuery("");
                      setShowPlaceholders(false);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                // RESPONSIVE GRID (Desktop 3 Cols, Tablet 2 Cols, Mobile 1 Col)
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="blog-grid">
                  <AnimatePresence mode="popLayout">
                    {filteredArticles.map((post) => {
                      // If it's a future CMS slot, render a gorgeous dashed placeholder
                      if (post.isPlaceholder) {
                        return (
                          <motion.div
                            key={post.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-5 hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col justify-between min-h-[340px] relative group"
                          >
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded uppercase tracking-wider">
                                  {post.category}
                                </span>
                                <span className="text-[10px] text-slate-300 font-mono flex items-center gap-0.5">
                                  <Clock className="h-3 w-3" /> {post.readingTime}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-display font-bold text-slate-400 text-sm leading-snug">
                                  {post.title}
                                </h4>
                                <p className="text-[11px] text-slate-300 line-clamp-3 font-sans leading-relaxed">
                                  {post.excerpt}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {post.tags.map((tag) => (
                                  <span key={tag} className="text-[9px] font-mono text-slate-300 border border-slate-200 px-1.5 py-0.5 rounded">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                              <span className="text-[10px] font-mono text-slate-400 italic">
                                CMS Ready
                              </span>
                              <button
                                onClick={() => setActiveReadingArticle(post)}
                                className="text-[10px] font-bold text-brand-primary-950 hover:text-brand-secondary-600 uppercase font-mono tracking-wider cursor-pointer"
                              >
                                View Specs
                              </button>
                            </div>
                          </motion.div>
                        );
                      }

                      // Render real, live premium blog cards
                      return (
                        <motion.div
                          key={post.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between h-full"
                        >
                          {/* Card Top / Premium CSS Gradient Banner - Replaced image for Option B */}
                          <div className="relative aspect-video w-full overflow-hidden flex">
                            <BlogGradientBanner
                              title={post.title}
                              category={post.category}
                              readingTime={post.readingTime}
                              isFeatured={false}
                            />
                          </div>

                          {/* Card Content */}
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                <span>{post.publishedDate}</span>
                                <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {post.readingTime}</span>
                              </div>

                              <h4 className="font-display font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-brand-secondary-600 transition-colors">
                                {post.title}
                              </h4>

                              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-sans">
                                {post.excerpt}
                              </p>
                            </div>

                            <div className="space-y-3">
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 pt-1">
                                {post.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTag(tag);
                                    }}
                                    className="text-[9px] font-mono text-slate-400 hover:text-brand-secondary-600 bg-slate-50 px-1.5 py-0.5 rounded cursor-pointer border border-slate-100"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>

                              {/* Card Bottom / Author & CTA */}
                              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-brand-primary-950 border border-slate-200 flex items-center justify-center text-white font-bold text-[9px] select-none shadow-inner">
                                    {post.author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-700 truncate max-w-[80px]">
                                    {post.author.name.split(" ")[1] ? `${post.author.name.split(" ")[0]} ${post.author.name.split(" ")[1][0]}.` : post.author.name}
                                  </span>
                                </div>

                                <button
                                  onClick={() => setActiveReadingArticle(post)}
                                  className="text-xs font-bold text-brand-secondary-600 hover:text-brand-secondary-700 flex items-center gap-0.5 transition-colors cursor-pointer"
                                >
                                  Read <ChevronRight className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: SIDEBAR (Desktop only - lg:col-span-4 hidden lg:block) */}
            <aside className="lg:col-span-4 space-y-8 hidden lg:block" id="blogs-sidebar">
              
              {/* LATEST POSTS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-brand-primary-950 text-sm pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-brand-secondary-500" /> Latest Insights
                </h4>
                
                <div className="space-y-4">
                  {latestPostsForSidebar.map((post) => (
                    <div
                      key={post.id}
                      className="group flex gap-3 items-start cursor-pointer hover:bg-slate-50/50 p-1.5 rounded-lg transition-colors"
                      onClick={() => setActiveReadingArticle(post)}
                    >
                      <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-brand-primary-950 via-slate-900 to-slate-800 flex items-center justify-center shrink-0 border border-slate-200 text-brand-secondary-400 font-bold text-xs select-none shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
                        <span className="relative z-10 font-mono tracking-wider">
                          {post.category.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="text-[9px] font-mono font-bold text-brand-secondary-600 uppercase tracking-wide">
                          {post.category}
                        </span>
                        <h5 className="font-display font-bold text-xs text-slate-800 line-clamp-2 leading-tight group-hover:text-brand-secondary-500 transition-colors">
                          {post.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {post.publishedDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* POPULAR CATEGORIES LIST */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                <h4 className="font-display font-bold text-brand-primary-950 text-sm pb-2 border-b border-slate-100">
                  Domain Categories
                </h4>
                <div className="space-y-1.5 text-xs">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setSelectedCategory(isSelected ? null : cat.name);
                          setSelectedTag(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer text-left ${
                          isSelected
                            ? "bg-brand-primary-950 text-white font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <ChevronRight className="h-3 w-3 shrink-0 opacity-70" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RECENT SEARCHES */}
              {recentSearches.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-display font-bold text-brand-primary-950 text-sm">
                      Recent Searches
                    </h4>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[10px] text-slate-400 hover:text-red-500 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => executeSearch(term)}
                        className="text-[10px] font-mono text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-brand-primary-950 px-2 py-1 rounded-md border border-slate-200/50 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Search className="h-2.5 w-2.5 text-slate-400" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* FREE CONSULTATION CTA */}
              <div className="bg-gradient-to-br from-brand-primary-950 to-slate-900 text-white border border-brand-primary-900 rounded-2xl p-6 shadow-md relative overflow-hidden" id="sidebar-consultation-cta">
                <div className="absolute right-0 bottom-0 opacity-10 font-display text-8xl font-black -mr-10 -mb-10 pointer-events-none select-none">
                  L
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="inline-flex px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-brand-secondary-500 text-white uppercase tracking-widest">
                    Quick Connect
                  </div>
                  <h4 className="font-display font-bold text-base tracking-tight leading-snug">
                    Need Help with Company Filings?
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Submit your query. Our senior advisors will review your company structure and call you back shortly.
                  </p>

                  <form onSubmit={handleConsultationSubmit} className="space-y-2.5 pt-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={consultationName}
                      onChange={(e) => setConsultationName(e.target.value)}
                      className="w-full bg-slate-800 text-white placeholder:text-slate-500 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary-500"
                    />
                    <input
                      type="tel"
                      placeholder="10-Digit Phone"
                      required
                      value={consultationPhone}
                      onChange={(e) => setConsultationPhone(e.target.value)}
                      className="w-full bg-slate-800 text-white placeholder:text-slate-500 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary-500"
                    />
                    <select
                      value={consultationService}
                      onChange={(e) => setConsultationService(e.target.value)}
                      className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary-500 font-sans cursor-pointer"
                    >
                      <option value="Company Registration">Company Registration</option>
                      <option value="GST Registration/Filing">GST Registration/Filing</option>
                      <option value="Trademark Protection">Trademark Protection</option>
                      <option value="ROC Compliance">ROC Compliance</option>
                      <option value="FSSAI Licensing">FSSAI Licensing</option>
                    </select>

                    <button
                      type="submit"
                      disabled={isSubmittingConsultation}
                      className="w-full py-2.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white text-xs font-bold font-sans rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingConsultation ? "Connecting..." : "Request Callback"}
                    </button>
                  </form>
                </div>
              </div>

              {/* DOWNLOAD COMPANY REGISTRATION CHECKLIST */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4" id="sidebar-download-checklist">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                    <Download className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-sm leading-none">Registration Blueprint</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Free PDF Download</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Get our exclusive 2026 checklist outlining every document, KYC proof and filing form required to incorporate a Pvt Ltd or LLP.
                </p>

                <form onSubmit={handleChecklistDownload} className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    required
                    value={checklistEmail}
                    onChange={(e) => setChecklistEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={isDownloading}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-sans rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isDownloading ? "Preparing PDF..." : "Download Checklist"}
                  </button>
                </form>
              </div>

            </aside>

          </div>

        </div>
      </section>

      {/* 4. POPULAR TOPICS (TAGS CHIPS AT BOTTOM FOR BOTH MOBILE/DESKTOP) */}
      <section className="py-8 bg-slate-100/50 border-t border-b border-slate-200/50" id="popular-topics-section">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 shrink-0">
              <Tag className="h-4 w-4 text-brand-secondary-500" />
              <span className="text-xs font-bold font-mono text-brand-primary-950 uppercase tracking-widest">
                Popular Topics
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 md:justify-end">
              {popularTags.map((tag) => {
                const isActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(isActive ? null : tag);
                      setSelectedCategory(null);
                    }}
                    className={`text-xs font-mono py-1 px-3.5 rounded-full border transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand-secondary-500 border-brand-secondary-500 text-white shadow-sm font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER SECTION */}
      <section className="py-16 md:py-20" id="newsletter-section">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-brand relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 bg-brand-secondary-500 rounded-b-full" />
            
            <div className="h-12 w-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-secondary-500 mx-auto">
              <Mail className="h-5 w-5" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-2xl font-display font-extrabold text-brand-primary-950 tracking-tight">
                Stay Updated
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                Subscribe to the Legomark Gazette. Get critical regulatory news, due-date reminders, and GST/Tax policy updates delivered direct to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribeNewsletter} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="email"
                placeholder="Enter your work email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-100 focus:border-brand-primary-500 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-3 bg-brand-primary-950 hover:bg-brand-primary-900 text-white text-sm font-bold font-sans rounded-xl transition-colors shrink-0 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>

            <p className="text-[10px] text-slate-400 font-sans">
              Zero spam. Unsubscribe anytime in one click. Your email is fully protected.
            </p>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE ARTICLE READER OVERLAY MODAL */}
      <AnimatePresence>
        {activeReadingArticle && (
          <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[200] p-4 overflow-y-auto" id="article-reader-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col relative border border-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150 bg-slate-50 sticky top-0 z-10">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-secondary-600">
                  <BookOpen className="h-4 w-4" />
                  <span>Legomark Legal Library</span>
                </div>
                <button
                  onClick={() => setActiveReadingArticle(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-150 transition-colors cursor-pointer"
                  aria-label="Close Reader"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Article Body */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
                
                {/* Meta details */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-brand-primary-950 text-brand-secondary-400 text-[10px] font-bold font-mono uppercase px-2.5 py-0.5 rounded">
                      {activeReadingArticle.category}
                    </span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded">
                      Canonical: {activeReadingArticle.slug}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-display font-black text-brand-primary-950 tracking-tight leading-snug">
                    {activeReadingArticle.title}
                  </h1>

                  <div className="flex items-center justify-between border-b border-slate-150 pb-5 pt-2 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brand-primary-950 border border-slate-200 flex items-center justify-center text-white font-bold text-sm select-none shadow-inner">
                        {activeReadingArticle.author.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{activeReadingArticle.author.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{activeReadingArticle.author.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span>{activeReadingArticle.publishedDate}</span>
                      <span>&bull;</span>
                      <span>{activeReadingArticle.readingTime}</span>
                    </div>
                  </div>
                </div>

                {/* Main Excerpt */}
                <div className="bg-slate-50 border-l-4 border-brand-secondary-500 p-4 rounded-r-xl">
                  <p className="text-sm font-sans italic text-slate-600 leading-relaxed">
                    &ldquo;{activeReadingArticle.excerpt}&rdquo;
                  </p>
                </div>

                {/* Article Content - Structured Markdown simulation */}
                <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4 font-sans">
                  {/* We split content by lines to render readable blocks since it contains standard titles and lists */}
                  {activeReadingArticle.content.split("\n").map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;

                    if (trimmed.startsWith("## ")) {
                      return (
                        <h2 key={idx} className="text-lg font-display font-extrabold text-brand-primary-950 pt-4 pb-1 border-b border-slate-100 tracking-tight">
                          {trimmed.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith("### ")) {
                      return (
                        <h3 key={idx} className="text-sm font-bold text-slate-800 pt-3 uppercase tracking-wider font-mono">
                          {trimmed.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                      return (
                        <li key={idx} className="list-disc list-inside ml-4 text-slate-600 leading-relaxed py-0.5">
                          {trimmed.slice(2)}
                        </li>
                      );
                    }
                    if (trimmed.startsWith("1. ") || trimmed.startsWith("2. ") || trimmed.startsWith("3. ") || trimmed.startsWith("4. ") || trimmed.startsWith("5. ")) {
                      return (
                        <div key={idx} className="pl-2 py-1 flex gap-2 items-start text-slate-600">
                          <span className="font-mono text-brand-secondary-600 font-bold shrink-0">{trimmed.slice(0, 3)}</span>
                          <span className="leading-relaxed">{trimmed.slice(3)}</span>
                        </div>
                      );
                    }
                    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
                      // Skip table parser simplify to keep clean
                      return null;
                    }

                    return (
                      <p key={idx} className="font-sans leading-relaxed text-slate-600">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>

                {/* Keywords Chips */}
                <div className="pt-6 border-t border-slate-150 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    SEO Targets & Meta Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeReadingArticle.keywords.map((key) => (
                      <span key={key} className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                        {key}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toast.success("Added to reading bookmarks!")}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-secondary-600 font-sans cursor-pointer"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden sm:inline">Bookmark</span>
                  </button>
                  <button
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(activeReadingArticle.canonicalUrl);
                        toast.success("Canonical URL copied to clipboard!");
                      } catch {
                        toast.info(activeReadingArticle.canonicalUrl);
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-secondary-600 font-sans cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share Link</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    Canonical: {activeReadingArticle.canonicalUrl}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setActiveReadingArticle(null)}
                  >
                    Close Reader
                  </Button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
