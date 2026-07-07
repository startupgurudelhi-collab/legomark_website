/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Types for CMS & Admin Panel Modules

export interface LeadAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
}

export interface LeadNoteLog {
  id: string;
  author: string;
  note: string;
  date: string;
}

export interface LeadStatusLog {
  id: string;
  fromStatus: string;
  toStatus: string;
  updatedBy: string;
  date: string;
}

export interface LeadFollowUpLog {
  id: string;
  date: string;
  type: string;
  outcome: string;
  description: string;
}

export interface AdminLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  source: string;
  date: string;
  status: "New" | "Contacted" | "Qualified" | "Proposal Sent" | "Negotiation" | "Payment Pending" | "Won" | "Lost" | "Closed";
  notes: string;
  companyName?: string;
  assignedExecutive?: string;
  priority?: "Low" | "Medium" | "High";
  followUpDate?: string;
  createdAt?: string;
  updatedAt?: string;
  attachments?: LeadAttachment[];
  notesHistory?: LeadNoteLog[];
  statusHistory?: LeadStatusLog[];
  followUpHistory?: LeadFollowUpLog[];
}

export interface AdminOrder {
  id: string;
  leadId?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
  };
  service: string;
  packageName: string;
  price: number;
  gst: number;
  discount: number;
  totalAmount: number;
  assignedExecutive: string;
  paymentStatus: "Pending" | "Partial" | "Paid" | "Refunded";
  serviceStatus: "Documents Pending" | "Documents Received" | "Work Started" | "Government Submission" | "Awaiting Approval" | "Completed" | "Delivered";
  createdAt: string;
  updatedAt: string;
  attachments?: LeadAttachment[];
  notesHistory?: LeadNoteLog[];
  statusHistory?: LeadStatusLog[];
}

export const initialOrders: AdminOrder[] = [
  {
    id: "ORD-2026-001",
    leadId: "lead-004",
    customer: {
      name: "Sunita Deshmukh",
      email: "sunita@deshmukhfoods.co",
      phone: "9444555666",
      companyName: "Deshmukh Foods Private Limited"
    },
    service: "FSSAI Food License",
    packageName: "Premium Growth Package",
    price: 8500,
    gst: 1530,
    discount: 500,
    totalAmount: 9530,
    assignedExecutive: "Rajesh Kumar",
    paymentStatus: "Paid",
    serviceStatus: "Government Submission",
    createdAt: "2026-06-20",
    updatedAt: "2026-06-25",
    attachments: [
      { id: "att-1", name: "PAN_Card.pdf", type: "document", size: "142 KB", uploadDate: "2026-06-21" },
      { id: "att-2", name: "Aadhaar_Card.pdf", type: "document", size: "185 KB", uploadDate: "2026-06-21" }
    ],
    notesHistory: [
      { id: "note-o1-1", author: "Rajesh Kumar", note: "Client provided NOC. Submitted to FSSAI portal.", date: "2026-06-24" }
    ],
    statusHistory: [
      { id: "sh-1", fromStatus: "Documents Pending", toStatus: "Documents Received", updatedBy: "Rajesh Kumar", date: "2026-06-21" },
      { id: "sh-2", fromStatus: "Documents Received", toStatus: "Work Started", updatedBy: "Rajesh Kumar", date: "2026-06-22" },
      { id: "sh-3", fromStatus: "Work Started", toStatus: "Government Submission", updatedBy: "Rajesh Kumar", date: "2026-06-24" }
    ]
  },
  {
    id: "ORD-2026-002",
    customer: {
      name: "Aman Malhotra",
      email: "aman@malhotrasports.com",
      phone: "9876543210",
      companyName: "Malhotra Sports PLC"
    },
    service: "Private Limited Company",
    packageName: "Standard Filing",
    price: 12000,
    gst: 2160,
    discount: 1000,
    totalAmount: 13160,
    assignedExecutive: "Sanjana Sen",
    paymentStatus: "Partial",
    serviceStatus: "Work Started",
    createdAt: "2026-06-27",
    updatedAt: "2026-06-28",
    attachments: [
      { id: "att-3", name: "Director_PAN.pdf", type: "document", size: "115 KB", uploadDate: "2026-06-27" }
    ],
    notesHistory: [
      { id: "note-o2-1", author: "Sanjana Sen", note: "DSC registration complete. SPICe+ Part A approved.", date: "2026-06-28" }
    ],
    statusHistory: [
      { id: "sh-4", fromStatus: "Documents Pending", toStatus: "Work Started", updatedBy: "Sanjana Sen", date: "2026-06-28" }
    ]
  }
];

export interface AdminBlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  status: "Published" | "Draft";
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  createdAt: string;
}

export interface AdminTestimonial {
  id: string;
  clientName: string;
  designation: string;
  company: string;
  rating: number;
  content: string;
  featured: boolean;
  sortOrder: number;
  serviceUsed?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  status?: "Published" | "Draft";
}

export interface AdminClientLogo {
  id: string;
  clientName: string;
  imageUrl: string;
  sortOrder: number;
  status: "Active" | "Inactive";
}

export interface AdminFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface MediaFile {
  id: string;
  name: string;
  folder: string;
  size: string;
  url: string;
  type: "image" | "document" | "other";
  createdAt: string;
}

export interface AdminPackage {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  discountPrice?: number;
  gstPercent: number;
  features: string[];
  displayOrder: number;
  cta: string;
}

// Initial Mock Seed Data
export const initialLeads: AdminLead[] = [
  {
    id: "lead-001",
    name: "Aman Malhotra",
    phone: "9876543210",
    email: "aman@malhotrasports.com",
    service: "Private Limited Company",
    source: "Google Search",
    date: "2026-06-27",
    status: "New",
    notes: "E-commerce startup selling sports equipment. Needs DSC for 2 directors."
  },
  {
    id: "lead-002",
    name: "Priyanka Sen",
    phone: "9123456789",
    email: "priyanka.sen@creativemedia.in",
    service: "GST Registration",
    source: "WhatsApp Assistant",
    date: "2026-06-25",
    status: "Contacted",
    notes: "Freelance copywriter crossing the 20L threshold. Wants GSTIN voluntarily to raise corporate tax invoices."
  },
  {
    id: "lead-003",
    name: "Karan Johar",
    phone: "8888888888",
    email: "karan@dharmaprod.co",
    service: "Trademark Registration",
    source: "Direct Referral",
    date: "2026-06-24",
    status: "Qualified",
    notes: "Logo trademark filing for new lifestyle brand. MSME certificate available for 50% govt discount."
  },
  {
    id: "lead-004",
    name: "Sunita Deshmukh",
    phone: "9444555666",
    email: "sunita@deshmukhfoods.co",
    service: "FSSAI Food License",
    source: "Instagram Lead",
    date: "2026-06-20",
    status: "Closed",
    notes: "Cloud kitchen setup in Pune. Approved FSSAI basic registration."
  }
];

export const initialBlogPosts: AdminBlogPost[] = [
  {
    id: "blog-001",
    title: "Guide to Startup Company Incorporation in India (2026)",
    category: "Company Registration",
    excerpt: "Learn the latest regulatory updates, fees structure, and SPICe+ MCA filing processes for incorporating a Private Limited Company in India.",
    content: "# Startup Company Incorporation in India\n\nIncorporating a startup is the first step towards building a legally compliant corporate empire. This guide explains SPICe+ Part A & B filings and DSC requisites...",
    featuredImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    status: "Published",
    seoTitle: "Startup Incorporation India 2026 Guide | Legomark",
    seoDescription: "Exhaustive step-by-step tutorial on incorporating Private Limited, LLP, and OPC businesses under Ministry of Corporate Affairs rules.",
    seoKeywords: ["startup registration", "pvt ltd incorporation", "spice+ form mca", "how to start business india"],
    createdAt: "2026-06-15"
  },
  {
    id: "blog-002",
    title: "Why Voluntarily GST Registration Can Benefit Tiny Businesses",
    category: "Taxation",
    excerpt: "Even if your annual turnover is below 20/40 Lakhs, voluntarily registering for GST unlocks Input Tax Credits and enables seamless interstate sales.",
    content: "# Voluntary GST Registration Benefits\n\nMany micro-entrepreneurs ask if registering for GST voluntarily is worth it. The answer is absolutely yes! It helps claim ITC on raw purchases and unlocks B2B scaling...",
    featuredImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
    status: "Published",
    seoTitle: "Benefits of Voluntary GST Registration | Legomark India",
    seoDescription: "Find out how voluntarily registering for Goods & Services Tax (GST) helps tiny startups secure large client contracts and optimize credits.",
    seoKeywords: ["voluntary gst", "gstin registration", "input tax credit benefits", "gst limit threshold"],
    createdAt: "2026-06-22"
  }
];

export const initialTestimonials: AdminTestimonial[] = [
  {
    id: "test-001",
    clientName: "Karan Johar",
    designation: "Director",
    company: "TechVeda Solutions",
    rating: 5,
    content: "Legomark India simplified our complete corporate incorporation under 8 days. Professional expertise and timely updates!",
    featured: true,
    sortOrder: 1,
    serviceUsed: "Company Registration",
    videoUrl: "/testimonials/video-1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400",
    status: "Published"
  },
  {
    id: "test-002",
    clientName: "Priyanka Sharma",
    designation: "Founder",
    company: "OrganicBasket",
    rating: 5,
    content: "Excellent experience securing our brand trademark. The process was entirely hands-off for us.",
    featured: true,
    sortOrder: 2,
    serviceUsed: "Trademark Protection",
    videoUrl: "/video-2.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400",
    status: "Published"
  },
  {
    id: "test-003",
    clientName: "Vikram Rathore",
    designation: "Founder",
    company: "Rathore Logistics",
    rating: 5,
    content: "Prompt GST filing setup and voluntary registration support. Zero compliance delays!",
    featured: true,
    sortOrder: 3,
    serviceUsed: "GST Registration",
    videoUrl: "/video-3.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400",
    status: "Published"
  },
  {
    id: "test-004",
    clientName: "Amit Verma",
    designation: "CEO",
    company: "AgriGrowth Partners",
    rating: 5,
    content: "Flawless annual bookkeeping and regular corporate compliance. High accuracy and transparency.",
    featured: true,
    sortOrder: 4,
    serviceUsed: "Tax & Compliance",
    videoUrl: "/video-4.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400",
    status: "Published"
  },
  {
    id: "test-005",
    clientName: "Rohan Mehta",
    designation: "Co-Founder",
    company: "Playverse Studios",
    rating: 5,
    content: "Absolutely brilliant end-to-end support for company formation. Everything from DSC registration to MCA approval was managed flawlessly. The client portal is incredibly simple to use!",
    featured: true,
    sortOrder: 5,
    serviceUsed: "Company Registration",
    videoUrl: "",
    thumbnailUrl: "",
    status: "Published"
  },
  {
    id: "test-006",
    clientName: "Ananya Deshmukh",
    designation: "Founder",
    company: "Zenith Legal Advisory",
    rating: 5,
    content: "Transitioning our company's accounting and quarterly GST returns to Legomark is the best operational decision we made. Professional, prompt, and highly knowledgeable accountants.",
    featured: true,
    sortOrder: 6,
    serviceUsed: "GST Filing",
    videoUrl: "",
    thumbnailUrl: "",
    status: "Published"
  },
  {
    id: "test-007",
    clientName: "Sameer Sengupta",
    designation: "CEO",
    company: "Eastern LogiTech",
    rating: 5,
    content: "Trademark filing can be quite stressful, but their lawyers handled the class search and trademark objection reply with absolute precision. Our brand logo is now registered!",
    featured: true,
    sortOrder: 7,
    serviceUsed: "Trademark Registration",
    videoUrl: "",
    thumbnailUrl: "",
    status: "Published"
  },
  {
    id: "test-008",
    clientName: "Meera Nair",
    designation: "Founder",
    company: "Heritage Foods",
    rating: 5,
    content: "Legomark made securing our FSSAI central license and MSME certificate extremely swift. Outstanding support, clear pricing, and continuous updates over WhatsApp!",
    featured: true,
    sortOrder: 8,
    serviceUsed: "FSSAI & Business License",
    videoUrl: "",
    thumbnailUrl: "",
    status: "Published"
  },
  {
    id: "test-009",
    clientName: "Rajesh Patel",
    designation: "Director",
    company: "Patel Pharma",
    rating: 5,
    content: "Their compliance automation is stellar. Director's KYC, annual board resolutions, and tax returns were completed well before deadlines. Excellent value!",
    featured: true,
    sortOrder: 9,
    serviceUsed: "Annual Compliance",
    videoUrl: "",
    thumbnailUrl: "",
    status: "Published"
  },
  {
    id: "test-010",
    clientName: "Sunita Rao",
    designation: "Founder",
    company: "Aura Organics",
    rating: 5,
    content: "Very satisfied with the speed and efficiency. We got our Private Limited incorporation documents in less than 9 days. Highly cooperative and humble consultants.",
    featured: true,
    sortOrder: 10,
    serviceUsed: "Company Registration",
    videoUrl: "",
    thumbnailUrl: "",
    status: "Published"
  }
];

export const initialClientLogos: AdminClientLogo[] = [
  { id: "logo-001", clientName: "Acme Corp", imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=150&auto=format&fit=crop", sortOrder: 1, status: "Active" },
  { id: "logo-002", clientName: "Venture Partners", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=150&auto=format&fit=crop", sortOrder: 2, status: "Active" }
];

export const initialGlobalFaqs: AdminFaq[] = [
  {
    id: "faq-001",
    question: "What is a Digital Signature Certificate (DSC)?",
    answer: "A DSC is an electronic signature format issued by certified authorities. It is mandatory for filing company incorporation documents securely on the MCA portal.",
    category: "General Filing",
    sortOrder: 1
  },
  {
    id: "faq-002",
    question: "Do I need a commercial office to register a company?",
    answer: "No. You can use any valid residential address as the registered office of your company in India. A utility bill (not older than 2 months) with NOC is required.",
    category: "Registration",
    sortOrder: 2
  }
];

export const initialMediaFiles: MediaFile[] = [
  { id: "media-001", name: "logo_legomark_dark.png", folder: "brand", size: "48 KB", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop", type: "image", createdAt: "2026-06-01" },
  { id: "media-002", name: "founder_agreement_draft.pdf", folder: "documents/templates", size: "245 KB", url: "#", type: "document", createdAt: "2026-06-10" },
  { id: "media-003", name: "banner_service_gst.jpg", folder: "services", size: "180 KB", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300&auto=format&fit=crop", type: "image", createdAt: "2026-06-15" }
];

// Complete Website Config states for Homepage, Contact and Navigation Customizations
export interface CmsHomepage {
  heroTitle: string;
  heroSub: string;
  heroBadge: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
  whyTitle: string;
  whyDesc: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaButtonText: string;
}

export const initialCmsHomepage: CmsHomepage = {
  heroTitle: "India's Smartest Legal & Company Filing Engine",
  heroSub: "Incorporate Private Limiteds, obtain GST registrations, secure trademarks, and execute annual tax returns with CA assisted automation.",
  heroBadge: "LEGAL MEETS SPEED",
  stat1Label: "Informed Startups",
  stat1Value: "25,000+",
  stat2Label: "Filing Accuracy",
  stat2Value: "99.9%",
  stat3Label: "Chartered Accountants",
  stat3Value: "150+",
  whyTitle: "Why Indian Founders Pick Legomark",
  whyDesc: "We eliminate bureaucratic bottlenecks. Enjoy real-time tracking, upfront transparent fees, and dedicated support from experienced corporate attorneys.",
  ctaTitle: "Ready to launch your Indian corporate entity?",
  ctaDesc: "Contact our dedicated legal experts today for a completely free strategy call.",
  ctaButtonText: "Incorporate Your Company"
};

export interface CmsContactInfo {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  googleMapEmbedUrl: string;
  socialFb: string;
  socialTw: string;
  socialIn: string;
  socialWa: string;
}

export const initialCmsContactInfo: CmsContactInfo = {
  phone: "+91 75308 47878",
  email: "info@legomarkindia.com",
  address: "D-561, Pocket 11, DDA Janta Flats, Jasola, New Delhi – 110025",
  workingHours: "Monday to Sunday: 11:00 AM - 8:00 PM",
  googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.6067341381145!2d77.28318357630444!3d28.551543375709564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3ee1d1d9145%3A0x600989f662be3ef!2sJasola%20Vihar%20Shaheen%20Bagh%20Metro%20Station!5e0!3m2!1sen!2sin!4v1719661500000",
  socialFb: "https://facebook.com/legomarkindia",
  socialTw: "https://twitter.com/legomarkindia",
  socialIn: "https://linkedin.com/company/legomarkindia",
  socialWa: "https://wa.me/917530847878"
};

// Nested menu definitions for Navigation Manager
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
}

export const initialHeaderMenu: MenuItem[] = [
  { id: "nav-1", label: "Company Registration", href: "/services/company-registration", children: [
    { id: "sub-1-1", label: "Private Limited Company", href: "/company-registration/private-limited-company" },
    { id: "sub-1-2", label: "One Person Company", href: "/company-registration/one-person-company" },
    { id: "sub-1-3", label: "Limited Liability Partnership", href: "/company-registration/llp-registration" }
  ]},
  { id: "nav-2", label: "Tax & Compliance", href: "/services/tax-compliance", children: [
    { id: "sub-2-1", label: "GST Registration", href: "/gst/gst-registration" },
    { id: "sub-2-2", label: "GST Return Filing", href: "/gst/gst-return-filing" },
    { id: "sub-2-3", label: "Income Tax Return", href: "/gst/income-tax-return" }
  ]},
  { id: "nav-3", label: "Trademark", href: "/services/trademark" },
  { id: "nav-4", label: "Licenses", href: "/services/licenses" },
  { id: "nav-5", label: "Blogs", href: "/blogs" },
  { id: "nav-6", label: "Contact", href: "/contact" }
];

export interface AdminSettings {
  siteName: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  googleReviewsId: string;
  whatsAppNumber: string;
  razorpayKeyId: string;
  calendlyLink: string;
}

export const initialAdminSettings: AdminSettings = {
  siteName: "Legomark India",
  seoMetaTitle: "Legomark India | Professional Company Registration & GST Filing Portal",
  seoMetaDescription: "Register your Private Limited, LLP, OPC, Trademark, and file tax returns online with expert corporate consultation.",
  smtpHost: "smtp.sendgrid.net",
  smtpPort: "587",
  smtpUser: "apikey",
  googleReviewsId: "ChIJRz_gXb0UrjsR2m0-LpP_A8o",
  whatsAppNumber: "+917530847878",
  razorpayKeyId: "rzp_live_vP3xyz321",
  calendlyLink: "https://calendly.com/legomark/15min"
};

// Simple synchronized localState helper
export function getStoredState<T>(key: string, initialValue: T): T {
  try {
    const item = localStorage.getItem(`legomark_admin_${key}`);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error("Error reading admin storage", error);
    return initialValue;
  }
}

export function setStoredState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`legomark_admin_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving admin storage", error);
  }
}

// ==========================================
// DC-007B FINANCIAL ENTITY SPECIFICATIONS
// ==========================================

export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface AdminQuotation {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
  };
  service: string;
  packageName: string;
  items: QuotationItem[];
  quantity: number;
  unitPrice: number;
  discount: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
  validUntil: string;
  notes: string;
  status: "Draft" | "Sent" | "Accepted" | "Rejected";
  createdAt: string;
}

export interface ProformaInvoice {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
  };
  service: string;
  packageName: string;
  price: number;
  discount: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
  terms: string;
  notes: string;
  status: "Draft" | "Sent" | "Paid" | "Cancelled";
  createdAt: string;
}

export interface TaxInvoice {
  id: string;
  invoiceDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    gstin?: string;
  };
  placeOfSupply: string;
  service: string;
  packageName: string;
  hsnSac: string;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalAmount: number;
  paymentStatus: "Unpaid" | "Paid" | "Partial" | "Refunded";
  paymentMethod?: string;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  customerEmail: string;
  method: "Razorpay" | "UPI" | "Bank Transfer" | "Cash" | "Manual Payment";
  amount: number;
  status: "Pending" | "Success" | "Failed" | "Refunded";
  transactionRef: string;
  paidDate: string;
}

export interface ReceiptRecord {
  id: string;
  paymentRef: string;
  amount: number;
  date: string;
  customer: {
    name: string;
    email: string;
    companyName?: string;
  };
  orderId?: string;
  invoiceId: string;
}

export interface RefundRecord {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy: string;
  date: string;
}

export interface CreditDebitNote {
  id: string;
  type: "Credit Note" | "Debit Note";
  originalInvoiceId: string;
  customer: {
    name: string;
    email: string;
    companyName?: string;
  };
  amount: number;
  reason: string;
  date: string;
}

export interface LedgerEntry {
  id: string;
  customerEmail: string;
  type: "Quotation" | "Order" | "Invoice" | "Payment" | "Refund" | "Credit Note" | "Debit Note";
  refId: string;
  date: string;
  description: string;
  amount: number;
  balanceEffect: "debit" | "credit" | "neutral";
}

// Initial Mock Seed Data for Financials
export const initialQuotations: AdminQuotation[] = [
  {
    id: "QT-2026-001",
    customer: {
      name: "Sunita Deshmukh",
      email: "sunita@deshmukhfoods.co",
      phone: "9444555666",
      companyName: "Deshmukh Foods Private Limited"
    },
    service: "FSSAI Food License",
    packageName: "Premium Growth Package",
    items: [
      { description: "FSSAI Central License Govt Filing Fee Assistance", quantity: 1, unitPrice: 7500, amount: 7500 },
      { description: "Professional Attorney Legal Consultations", quantity: 1, unitPrice: 1000, amount: 1000 }
    ],
    quantity: 2,
    unitPrice: 8500,
    discount: 500,
    gstPercent: 18,
    gstAmount: 1440,
    totalAmount: 9440,
    validUntil: "2026-07-20",
    notes: "Special discounted offer for central food licensing assistance.",
    status: "Accepted",
    createdAt: "2026-06-18"
  },
  {
    id: "QT-2026-002",
    customer: {
      name: "Aman Malhotra",
      email: "aman@malhotrasports.com",
      phone: "9876543210",
      companyName: "Malhotra Sports PLC"
    },
    service: "Private Limited Company",
    packageName: "Standard Filing",
    items: [
      { description: "Standard Pvt Ltd Incorporation Package", quantity: 1, unitPrice: 12000, amount: 12000 }
    ],
    quantity: 1,
    unitPrice: 12000,
    discount: 1000,
    gstPercent: 18,
    gstAmount: 1980,
    totalAmount: 12980,
    validUntil: "2026-07-25",
    notes: "Includes 2 DSCs, DINs, MoA and AoA draftings.",
    status: "Accepted",
    createdAt: "2026-06-25"
  },
  {
    id: "QT-2026-003",
    customer: {
      name: "Priyanka Sen",
      email: "priyanka.sen@creativemedia.in",
      phone: "9123456789",
      companyName: "Creative Media Solutions"
    },
    service: "GST Registration",
    packageName: "Express Filing Option",
    items: [
      { description: "Voluntary GST Registration consultancy + professional audit log", quantity: 1, unitPrice: 2500, amount: 2500 }
    ],
    quantity: 1,
    unitPrice: 2500,
    discount: 200,
    gstPercent: 18,
    gstAmount: 414,
    totalAmount: 2714,
    validUntil: "2026-07-15",
    notes: "Turnaround within 3-5 business days from document upload.",
    status: "Sent",
    createdAt: "2026-06-26"
  }
];

export const initialProformas: ProformaInvoice[] = [
  {
    id: "PRO-2026-001",
    customer: {
      name: "Sunita Deshmukh",
      email: "sunita@deshmukhfoods.co",
      phone: "9444555666",
      companyName: "Deshmukh Foods Private Limited"
    },
    service: "FSSAI Food License",
    packageName: "Premium Growth Package",
    price: 8500,
    discount: 500,
    gstPercent: 18,
    gstAmount: 1440,
    totalAmount: 9440,
    terms: "100% advance on governmental submission preparation.",
    notes: "Proforma generated based on Accepted Quotation QT-2026-001",
    status: "Paid",
    createdAt: "2026-06-19"
  },
  {
    id: "PRO-2026-002",
    customer: {
      name: "Aman Malhotra",
      email: "aman@malhotrasports.com",
      phone: "9876543210",
      companyName: "Malhotra Sports PLC"
    },
    service: "Private Limited Company",
    packageName: "Standard Filing",
    price: 12000,
    discount: 1000,
    gstPercent: 18,
    gstAmount: 1980,
    totalAmount: 12980,
    terms: "50% advance to start DSC filing, 50% post SPICe+ approval.",
    notes: "Proforma for corporate incorporation.",
    status: "Sent",
    createdAt: "2026-06-26"
  }
];

export const initialInvoices: TaxInvoice[] = [
  {
    id: "INV-2026-001",
    invoiceDate: "2026-06-20",
    customer: {
      name: "Sunita Deshmukh",
      email: "sunita@deshmukhfoods.co",
      phone: "9444555666",
      companyName: "Deshmukh Foods Private Limited",
      gstin: "27AABCD1234A1Z1"
    },
    placeOfSupply: "Maharashtra",
    service: "FSSAI Food License",
    packageName: "Premium Growth Package",
    hsnSac: "998222",
    taxableAmount: 8000,
    cgstRate: 9,
    cgstAmount: 720,
    sgstRate: 9,
    sgstAmount: 720,
    igstRate: 0,
    igstAmount: 0,
    totalAmount: 9440,
    paymentStatus: "Paid",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "INV-2026-002",
    invoiceDate: "2026-06-28",
    customer: {
      name: "Aman Malhotra",
      email: "aman@malhotrasports.com",
      phone: "9876543210",
      companyName: "Malhotra Sports PLC",
      gstin: "07AAACM9988A1Z2"
    },
    placeOfSupply: "Delhi",
    service: "Private Limited Company",
    packageName: "Standard Filing",
    hsnSac: "998221",
    taxableAmount: 11000,
    cgstRate: 0,
    cgstAmount: 0,
    sgstRate: 0,
    sgstAmount: 0,
    igstRate: 18,
    igstAmount: 1980,
    totalAmount: 12980,
    paymentStatus: "Partial",
    paymentMethod: "UPI"
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: "PAY-2026-001",
    invoiceId: "INV-2026-001",
    customerEmail: "sunita@deshmukhfoods.co",
    method: "Bank Transfer",
    amount: 9440,
    status: "Success",
    transactionRef: "UTR99882231144",
    paidDate: "2026-06-20"
  },
  {
    id: "PAY-2026-002",
    invoiceId: "INV-2026-002",
    customerEmail: "aman@malhotrasports.com",
    method: "UPI",
    amount: 6490,
    status: "Success",
    transactionRef: "UPI-667788112233",
    paidDate: "2026-06-28"
  }
];

export const initialReceipts: ReceiptRecord[] = [
  {
    id: "REC-2026-001",
    paymentRef: "PAY-2026-001",
    amount: 9440,
    date: "2026-06-20",
    customer: {
      name: "Sunita Deshmukh",
      email: "sunita@deshmukhfoods.co",
      companyName: "Deshmukh Foods Private Limited"
    },
    orderId: "ORD-2026-001",
    invoiceId: "INV-2026-001"
  },
  {
    id: "REC-2026-002",
    paymentRef: "PAY-2026-002",
    amount: 6490,
    date: "2026-06-28",
    customer: {
      name: "Aman Malhotra",
      email: "aman@malhotrasports.com",
      companyName: "Malhotra Sports PLC"
    },
    orderId: "ORD-2026-002",
    invoiceId: "INV-2026-002"
  }
];

export const initialRefunds: RefundRecord[] = [
  {
    id: "REF-2026-001",
    paymentId: "PAY-2026-001",
    amount: 500,
    reason: "Duplicate application filing correction waiver",
    status: "Approved",
    approvedBy: "Lead Admin",
    date: "2026-06-22"
  }
];

export const initialCreditDebitNotes: CreditDebitNote[] = [
  {
    id: "CN-2026-001",
    type: "Credit Note",
    originalInvoiceId: "INV-2026-001",
    customer: {
      name: "Sunita Deshmukh",
      email: "sunita@deshmukhfoods.co",
      companyName: "Deshmukh Foods Private Limited"
    },
    amount: 500,
    reason: "Waiver of professional document validation correction surcharge",
    date: "2026-06-21"
  }
];

export const initialLedgerEntries: LedgerEntry[] = [
  {
    id: "LDG-001",
    customerEmail: "sunita@deshmukhfoods.co",
    type: "Quotation",
    refId: "QT-2026-001",
    date: "2026-06-18",
    description: "Quotation QT-2026-001 issued and Accepted",
    amount: 9440,
    balanceEffect: "neutral"
  },
  {
    id: "LDG-002",
    customerEmail: "sunita@deshmukhfoods.co",
    type: "Invoice",
    refId: "INV-2026-001",
    date: "2026-06-20",
    description: "Tax Invoice INV-2026-001 generated under GST rules",
    amount: 9440,
    balanceEffect: "debit"
  },
  {
    id: "LDG-003",
    customerEmail: "sunita@deshmukhfoods.co",
    type: "Payment",
    refId: "PAY-2026-001",
    date: "2026-06-20",
    description: "Direct bank transfer received. Fully settled.",
    amount: 9440,
    balanceEffect: "credit"
  },
  {
    id: "LDG-004",
    customerEmail: "sunita@deshmukhfoods.co",
    type: "Credit Note",
    refId: "CN-2026-001",
    date: "2026-06-21",
    description: "Credit Note CN-2026-001 issued",
    amount: 500,
    balanceEffect: "credit"
  },
  {
    id: "LDG-005",
    customerEmail: "aman@malhotrasports.com",
    type: "Quotation",
    refId: "QT-2026-002",
    date: "2026-06-25",
    description: "Quotation QT-2026-002 issued and Accepted",
    amount: 12980,
    balanceEffect: "neutral"
  },
  {
    id: "LDG-006",
    customerEmail: "aman@malhotrasports.com",
    type: "Invoice",
    refId: "INV-2026-002",
    date: "2026-06-28",
    description: "Tax Invoice INV-2026-002 generated",
    amount: 12980,
    balanceEffect: "debit"
  },
  {
    id: "LDG-007",
    customerEmail: "aman@malhotrasports.com",
    type: "Payment",
    refId: "PAY-2026-002",
    date: "2026-06-28",
    description: "Part-payment UPI confirmation successful",
    amount: 6490,
    balanceEffect: "credit"
  }
];

// WORKFLOW & TASK ENGINE INTERFACES
export interface TaskDocumentChecklistItem {
  name: string;
  required: boolean;
  checked: boolean;
  uploadedUrl?: string;
}

export interface TaskActivityLog {
  id: string;
  action: string; // e.g. "Task Created", "Assigned", "Started", "Completed", "Status Updated"
  description: string;
  timestamp: string;
  performedBy: string;
}

export interface TaskComment {
  id: string;
  author: string;
  comment: string;
  timestamp: string;
}

export interface AdminTask {
  id: string;
  orderId: string;
  service: string; // e.g. "Private Limited Company"
  taskName: string;
  description: string;
  assignedExecutive: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Waiting Client" | "Waiting Government" | "Under Review" | "Completed" | "Cancelled";
  dueDate: string;
  completedDate?: string;
  notes: string;
  documentChecklist: TaskDocumentChecklistItem[];
  comments: TaskComment[];
  activityLog: TaskActivityLog[];
}

export interface WorkflowTemplateStep {
  name: string;
  description: string;
  durationDays: number;
  priority: "Low" | "Medium" | "High";
  documentChecklist: string[]; // e.g., ["PAN", "Aadhaar", "Utility Bill"]
}

export interface WorkflowTemplate {
  service: string; // e.g. "Private Limited Company", "GST Registration", "Trademark Registration"
  steps: WorkflowTemplateStep[];
}

// PREDEFINED REUSABLE WORKFLOW TEMPLATES
export const workflowTemplates: WorkflowTemplate[] = [
  {
    service: "Private Limited Company",
    steps: [
      { name: "Verify Documents", description: "Validate director identity documents and company proofs.", durationDays: 2, priority: "High", documentChecklist: ["PAN Card", "Aadhaar Card", "Director Passport Photo", "Registered Office Utility Bill"] },
      { name: "DIN Processing", description: "Process Director Identification Numbers for all proposed directors.", durationDays: 3, priority: "Medium", documentChecklist: ["DIN Declaration Form"] },
      { name: "DSC Preparation", description: "Acquire Class 3 Digital Signature Certificate for directors.", durationDays: 2, priority: "Medium", documentChecklist: ["DSC Video Verification"] },
      { name: "Name Approval", description: "Submit RUN (Reserve Unique Name) application to Ministry of Corporate Affairs (MCA).", durationDays: 3, priority: "High", documentChecklist: ["MCA Name Approval Letter"] },
      { name: "Incorporation Filing", description: "Draft and file SPICe+ (INC-32), e-MoA (INC-33), and e-AoA (INC-34).", durationDays: 5, priority: "High", documentChecklist: ["NOC from Property Owner", "Rental Agreement"] },
      { name: "Certificate Issued", description: "Receive Certificate of Incorporation, PAN, and TAN numbers from MCA.", durationDays: 2, priority: "High", documentChecklist: ["Certificate of Incorporation"] }
    ]
  },
  {
    service: "GST Registration",
    steps: [
      { name: "Verify Documents", description: "Authenticate business entity PAN, director identity, and business address proof.", durationDays: 1, priority: "High", documentChecklist: ["PAN Card of Promoter", "Aadhaar Card of Promoter", "Electricity Bill / Property Tax Receipt", "Bank Proof (Cancelled Cheque or Statement)"] },
      { name: "Prepare Application", description: "Fill GST REG-01 application with statutory details, trade names, and HSN codes.", durationDays: 2, priority: "Medium", documentChecklist: ["Authorized Signatory Letter"] },
      { name: "GST Submission", description: "Submit formal portal application and perform OTP-based e-verification.", durationDays: 1, priority: "High", documentChecklist: ["GST Submission Receipt"] },
      { name: "ARN Generated", description: "Receive Application Reference Number (ARN) and track department reviews.", durationDays: 4, priority: "Low", documentChecklist: ["ARN Notification Document"] },
      { name: "GST Certificate", description: "Download approved REG-06 Certificate of Registration and secure GSTIN.", durationDays: 1, priority: "High", documentChecklist: ["GST Registration Certificate"] }
    ]
  },
  {
    service: "Trademark Registration",
    steps: [
      { name: "Trademark Search", description: "Perform a comprehensive search on Indian Trademark Registry database for conflicts.", durationDays: 1, priority: "High", documentChecklist: ["Search Conflict Report"] },
      { name: "Prepare Application", description: "Draft Form TM-A with brand name, device mark/logo, and appropriate Class of goods/services.", durationDays: 2, priority: "Medium", documentChecklist: ["Brand Logo / Artwork", "Trademark User Affidavit", "Power of Attorney (TM-48)"] },
      { name: "Government Filing", description: "File portal application and pay statutory fees to receive trademark application receipt.", durationDays: 1, priority: "High", documentChecklist: ["TM-A Receipt"] },
      { name: "Objection Handling", description: "Review trademark examination report and draft comprehensive reply if objection is raised.", durationDays: 15, priority: "Medium", documentChecklist: ["Trademark Examination Reply"] },
      { name: "Registration", description: "Trademark advertisement in journal, wait for opposition period, and secure Certificate of Registration.", durationDays: 120, priority: "High", documentChecklist: ["Trademark Registration Certificate"] }
    ]
  }
];

// INITIAL MOCK TASK DATA
export const initialTasks: AdminTask[] = [
  {
    id: "TSK-001",
    orderId: "ORD-2026-001",
    service: "FSSAI Food License",
    taskName: "Verify Promoter PAN and Aadhaar",
    description: "Check promoter's identity and proof of address against GST and incorporation documents.",
    assignedExecutive: "Rajesh Kumar",
    priority: "High",
    status: "Completed",
    dueDate: "2026-06-22",
    completedDate: "2026-06-21",
    notes: "Documents checked and verified. All details match perfectly.",
    documentChecklist: [
      { name: "PAN Card", required: true, checked: true, uploadedUrl: "/uploads/pan_sunita.pdf" },
      { name: "Aadhaar Card", required: true, checked: true, uploadedUrl: "/uploads/aadhaar_sunita.pdf" }
    ],
    comments: [
      { id: "c-1", author: "Rajesh Kumar", comment: "Verified with Income Tax database.", timestamp: "2026-06-21T10:00:00Z" }
    ],
    activityLog: [
      { id: "act-1", action: "Task Created", description: "Task initialized by system.", timestamp: "2026-06-20T09:00:00Z", performedBy: "System" },
      { id: "act-2", action: "Assigned", description: "Assigned to Rajesh Kumar", timestamp: "2026-06-20T09:15:00Z", performedBy: "System" },
      { id: "act-3", action: "Started", description: "Task marked In Progress", timestamp: "2026-06-21T08:30:00Z", performedBy: "Rajesh Kumar" },
      { id: "act-4", action: "Completed", description: "Task completed successfully", timestamp: "2026-06-21T10:00:00Z", performedBy: "Rajesh Kumar" }
    ]
  },
  {
    id: "TSK-002",
    orderId: "ORD-2026-001",
    service: "FSSAI Food License",
    taskName: "FSSAI Application Submission",
    description: "Prepare and submit the food license application on the FoSCoS portal with water testing reports.",
    assignedExecutive: "Rajesh Kumar",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-06-29",
    notes: "Waiting on the latest water quality analysis report from the local certified lab.",
    documentChecklist: [
      { name: "Water Analysis Report", required: true, checked: false },
      { name: "NOC from Landlord", required: true, checked: true, uploadedUrl: "/uploads/noc_deshmukh.pdf" },
      { name: "Layout Plan of Food Unit", required: true, checked: true, uploadedUrl: "/uploads/layout_deshmukh.pdf" }
    ],
    comments: [
      { id: "c-2", author: "Rajesh Kumar", comment: "@Sanjana Sen, please follow up with Sunita regarding water analysis certificate.", timestamp: "2026-06-25T14:30:00Z" },
      { id: "c-3", author: "Sanjana Sen", comment: "Spoke to Sunita. Lab report will be dispatched by tomorrow afternoon.", timestamp: "2026-06-26T11:00:00Z" }
    ],
    activityLog: [
      { id: "act-5", action: "Task Created", description: "Task initialized by system.", timestamp: "2026-06-20T09:00:00Z", performedBy: "System" },
      { id: "act-6", action: "Assigned", description: "Assigned to Rajesh Kumar", timestamp: "2026-06-20T09:15:00Z", performedBy: "System" },
      { id: "act-7", action: "Started", description: "Task marked In Progress", timestamp: "2026-06-25T09:30:00Z", performedBy: "Rajesh Kumar" }
    ]
  },
  {
    id: "TSK-003",
    orderId: "ORD-2026-002",
    service: "GST Registration",
    taskName: "Prepare GST Application Form REG-01",
    description: "Fill promoter data, company name, address proof, and select matching HSN codes.",
    assignedExecutive: "Sanjana Sen",
    priority: "Medium",
    status: "Waiting Client",
    dueDate: "2026-06-30",
    notes: "Client needs to sign authorized signatory declaration.",
    documentChecklist: [
      { name: "Promoter Photo", required: true, checked: true, uploadedUrl: "/uploads/aman_photo.jpg" },
      { name: "Signed Auth Declaration", required: true, checked: false }
    ],
    comments: [
      { id: "c-4", author: "Sanjana Sen", comment: "Emailed the declaration template to Aman. Waiting for e-sign.", timestamp: "2026-06-28T09:00:00Z" }
    ],
    activityLog: [
      { id: "act-8", action: "Task Created", description: "Task initialized by system.", timestamp: "2026-06-28T08:30:00Z", performedBy: "System" },
      { id: "act-9", action: "Assigned", description: "Assigned to Sanjana Sen", timestamp: "2026-06-28T08:35:00Z", performedBy: "System" },
      { id: "act-10", action: "Status Updated", description: "Marked as Waiting Client", timestamp: "2026-06-28T09:00:00Z", performedBy: "Sanjana Sen" }
    ]
  }
];


