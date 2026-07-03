/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Subcategory } from "../types/service.js";

export const initialCategories: Category[] = [
  {
    id: "cat-company-reg",
    categoryName: "Company Registration",
    urlSlug: "company-registration",
    description: "Incorporate Private Limited, One Person Company, LLP, Partnership Firms and more with MCA certified expert backing.",
    displayOrder: 1,
    icon: "Building2",
    bannerImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    seoTitle: "Online Company Incorporation Services in India | Legomark India",
    metaDescription: "Register your business online with certified legal partners. LLP registration, Pvt Ltd Incorporation, and corporate structuring guidance.",
    showInMegaMenu: true,
    activeStatus: true,
  },
  {
    id: "cat-tax-compliance",
    categoryName: "Tax & Compliance",
    urlSlug: "tax-compliance",
    description: "End-to-end statutory taxation filing, accounting compliance, GST filing, and expert business corporate returns.",
    displayOrder: 2,
    icon: "FileText",
    bannerImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
    seoTitle: "GST Registration & Corporate Compliance Filings | Legomark India",
    metaDescription: "Secure professional GST return filing, Income Tax filings, TDS returns and periodic audit reports in a simplified portal.",
    showInMegaMenu: true,
    activeStatus: true,
  },
  {
    id: "cat-trademark",
    categoryName: "Trademark",
    urlSlug: "trademark",
    description: "Secure your brand name, logo design, device marks, and obtain intellectual property legal protection.",
    displayOrder: 3,
    icon: "Award",
    bannerImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
    seoTitle: "Trademark Registration & IP Protection | Legomark India",
    metaDescription: "File your trademark class selection and get government application receipts in 24 hours. Robust IP protection with zero-stress legal backup.",
    showInMegaMenu: true,
    activeStatus: true,
  },
  {
    id: "cat-licenses",
    categoryName: "Licenses",
    urlSlug: "licenses",
    description: "FSSAI Food License, IEC Import Export Code, MSME Udyam, shop establishment and ISO regulatory certificates.",
    displayOrder: 4,
    icon: "Scale",
    bannerImage: "https://images.unsplash.com/photo-1505664194779-8bebcb95c539?q=80&w=600&auto=format&fit=crop",
    seoTitle: "Business Licenses & Regulatory Permits | Legomark India",
    metaDescription: "Acquire mandatory enterprise certifications, MSME approvals, import-export clearances and professional shop licenses swiftly.",
    showInMegaMenu: true,
    activeStatus: true,
  },
];

export const initialSubcategories: Subcategory[] = [
  {
    id: "sub-corp-entities",
    parentCategoryId: "cat-company-reg",
    subcategoryName: "Corporate Entities",
    urlSlug: "corporate-entities",
    description: "Standard registered structures offering limited liability protection.",
    displayOrder: 1,
    seoTitle: "Corporate Incorporation & Setup | Legomark India",
    metaDescription: "Setup private limited or limited liability companies in India.",
    activeStatus: true,
  },
  {
    id: "sub-indirect-tax",
    parentCategoryId: "cat-tax-compliance",
    subcategoryName: "Indirect Taxation",
    urlSlug: "indirect-taxation",
    description: "Filing and registration for goods, sales, and service tax regulations.",
    displayOrder: 1,
    seoTitle: "Indirect Taxation & GST Services | Legomark India",
    metaDescription: "Manage GST registration, amendments, annual returns, and GSTR filing.",
    activeStatus: true,
  },
  {
    id: "sub-direct-tax",
    parentCategoryId: "cat-tax-compliance",
    subcategoryName: "Direct Taxation",
    urlSlug: "direct-taxation",
    description: "Corporate and individual income tax structuring and return filing.",
    displayOrder: 2,
    seoTitle: "Direct Tax Filings & ITR Advisory | Legomark India",
    metaDescription: "Income tax return filings, corporate compliance and advanced income tax calculations.",
    activeStatus: true,
  },
  {
    id: "sub-intellectual-prop",
    parentCategoryId: "cat-trademark",
    subcategoryName: "Intellectual Property",
    urlSlug: "intellectual-property",
    description: "Protection mechanisms for creative, visual, and conceptual corporate branding assets.",
    displayOrder: 1,
    seoTitle: "Intellectual Property Rights and Trademarks | Legomark India",
    metaDescription: "TRADEMARK filing, objection response, copyright services, patent consultations.",
    activeStatus: true,
  },
  {
    id: "sub-reg-permissions",
    parentCategoryId: "cat-licenses",
    subcategoryName: "Regulatory Permissions",
    urlSlug: "regulatory-permissions",
    description: "Licensing clearance structures required by government authorities to operate legally.",
    displayOrder: 1,
    seoTitle: "Statutory Licensing and Business Certifications | Legomark India",
    metaDescription: "FSSAI registration, MSME certificates, IEC, ISO certification and Shop Act registrations.",
    activeStatus: true,
  },
];

export function getEffectiveCategories(): Category[] {
  try {
    const custom = typeof window !== "undefined" ? localStorage.getItem("legomark_admin_categories") : null;
    if (custom) {
      return JSON.parse(custom);
    }
  } catch (e) {
    console.error("Failed to parse custom categories:", e);
  }
  return initialCategories;
}

export function getEffectiveSubcategories(): Subcategory[] {
  try {
    const custom = typeof window !== "undefined" ? localStorage.getItem("legomark_admin_subcategories") : null;
    if (custom) {
      return JSON.parse(custom);
    }
  } catch (e) {
    console.error("Failed to parse custom subcategories:", e);
  }
  return initialSubcategories;
}
