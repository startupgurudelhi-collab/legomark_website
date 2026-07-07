/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Production-ready InMemory Database Fallback to fulfill contract guidelines
// without active Cloud SQL connection.

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "CLIENT";
  createdAt: string;
  updatedAt: string;
}

export const usersDb = [
  {
    id: "usr-admin-01",
    email: "admin@legomark.com",
    fullName: "Lead Admin",
    passwordHash: "$2a$10$UnX6gO8HjZ9K2.fSgSgSgOnY.g9q8h7d6c5b4a3_placeholder_hash", // hashed
    role: "ADMIN",
    createdAt: new Date("2026-06-01T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-06-01T12:00:00Z").toISOString()
  },
  {
    id: "usr-client-sunita",
    email: "sunita@deshmukhfoods.co",
    fullName: "Sunita Deshmukh",
    passwordHash: "$2a$10$UnX6gO8HjZ9K2.fSgSgSgOnY.g9q8h7d6c5b4a3_placeholder_hash",
    role: "CLIENT",
    createdAt: new Date("2026-06-01T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-06-01T12:00:00Z").toISOString()
  },
  {
    id: "usr-client-aman",
    email: "aman@malhotrasports.com",
    fullName: "Aman Malhotra",
    passwordHash: "$2a$10$UnX6gO8HjZ9K2.fSgSgSgOnY.g9q8h7d6c5b4a3_placeholder_hash",
    role: "CLIENT",
    createdAt: new Date("2026-06-01T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-06-01T12:00:00Z").toISOString()
  },
  {
    id: "usr-client-example",
    email: "client@example.com",
    fullName: "Rahul Sharma",
    passwordHash: "$2a$10$UnX6gO8HjZ9K2.fSgSgSgOnY.g9q8h7d6c5b4a3_placeholder_hash",
    role: "CLIENT",
    createdAt: new Date("2026-06-01T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-06-01T12:00:00Z").toISOString()
  }
];

export const clientsDb = [
  {
    id: "cli-sunita",
    userId: "usr-client-sunita",
    phone: "9444555666",
    companyName: "Deshmukh Foods Private Limited",
    gstin: "27AABCD1234A1Z1"
  },
  {
    id: "cli-aman",
    userId: "usr-client-aman",
    phone: "9876543210",
    companyName: "Malhotra Sports PLC",
    gstin: "07AAACM9988A1Z2"
  }
];

export const leadsDb = [
  {
    id: "lead-001",
    name: "Aman Malhotra",
    phone: "9876543210",
    email: "aman@malhotrasports.com",
    service: "Private Limited Company",
    source: "Google Search",
    date: "2026-06-27",
    status: "New",
    notes: "E-commerce startup selling sports equipment. Needs DSC for 2 directors.",
    attachments: [],
    notesHistory: [],
    statusHistory: [],
    followUpHistory: []
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
    notes: "Freelance copywriter crossing the 20L threshold. Wants GSTIN voluntarily.",
    attachments: [],
    notesHistory: [],
    statusHistory: [],
    followUpHistory: []
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
    notes: "Logo trademark filing. MSME certificate available.",
    attachments: [],
    notesHistory: [],
    statusHistory: [],
    followUpHistory: []
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
    notes: "Cloud kitchen setup in Pune.",
    attachments: [],
    notesHistory: [],
    statusHistory: [],
    followUpHistory: []
  }
];

export const ordersDb = [
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

export const blogsDb = [
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

export const faqsDb = [
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

export const testimonialsDb = [
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

export const logosDb = [
  { id: "logo-001", clientName: "Acme Corp", imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=150&auto=format&fit=crop", sortOrder: 1, status: "Active" },
  { id: "logo-002", clientName: "Venture Partners", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=150&auto=format&fit=crop", sortOrder: 2, status: "Active" }
];

export const mediaDb = [
  { id: "media-001", name: "logo_legomark_dark.png", folder: "brand", size: "48 KB", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop", type: "image", createdAt: "2026-06-01" },
  { id: "media-002", name: "founder_agreement_draft.pdf", folder: "documents/templates", size: "245 KB", url: "#", type: "document", createdAt: "2026-06-10" },
  { id: "media-003", name: "banner_service_gst.jpg", folder: "services", size: "180 KB", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300&auto=format&fit=crop", type: "image", createdAt: "2026-06-15" }
];

export const quotationsDb = [
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
  }
];

export const proformasDb = [
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
  }
];

export const invoicesDb = [
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
  }
];

export const paymentsDb = [
  {
    id: "PAY-2026-001",
    invoiceId: "INV-2026-001",
    customerEmail: "sunita@deshmukhfoods.co",
    method: "Bank Transfer",
    amount: 9440,
    status: "Success",
    transactionRef: "UTR99882231144",
    paidDate: "2026-06-20"
  }
];

export const receiptsDb = [
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
  }
];

export const refundsDb = [
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

export const creditNotesDb = [
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

export const ledgerDb = [
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
  }
];

export const tasksDb = [
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
      { id: "c-2", author: "Rajesh Kumar", comment: "@Sanjana Sen, please follow up with Sunita regarding water analysis certificate.", timestamp: "2026-06-25T14:30:00Z" }
    ],
    activityLog: [
      { id: "act-5", action: "Task Created", description: "Task initialized by system.", timestamp: "2026-06-20T09:00:00Z", performedBy: "System" }
    ]
  }
];

export const ticketsDb = [
  {
    id: "TCK-001",
    clientEmail: "sunita@deshmukhfoods.co",
    subject: "FSSAI Portal Processing Query",
    category: "Technical Support",
    priority: "Medium",
    status: "Open",
    description: "Our water test reports were uploaded but are displaying a processing error status in FoSCoS.",
    messages: [
      { sender: "client", text: "Please look into why FoSCoS is throwing an unexpected error.", timestamp: "2026-06-28" }
    ]
  }
];

export const notificationsDb = [
  { id: "n-1", clientEmail: "sunita@deshmukhfoods.co", title: "New Document Requested", description: "Water analysis report is outstanding for FSSAI application ORD-2026-001.", type: "warning", date: "3 hours ago", read: false },
  { id: "n-2", clientEmail: "sunita@deshmukhfoods.co", title: "Document Action Needed", description: "Please upload self-attested PAN card draft.", type: "document", date: "1 day ago", read: false }
];

export const homepageCmsDb = {
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

export const contactInfoDb = {
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

export const adminSettingsDb = {
  siteName: "Legomark India",
  seoMetaTitle: "Legomark India | Professional Company Registration & GST Filing Portal",
  seoMetaDescription: "Register your Private Limited, LLP, OPC, Trademark, and file tax returns online with expert corporate consultation.",
  smtpHost: "smtp.sendgrid.net",
  smtpPort: "587",
  smtpUser: "apikey",
  googleReviewsId: "ChIJRz_gXb0UrjsR2m0-LpP_A8o",
  whatsAppNumber: "+919876543210",
  razorpayKeyId: "rzp_live_vP3xyz321",
  calendlyLink: "https://calendly.com/legomark/15min"
};

export const automationLogsDb: any[] = [];

export interface EmailQueueItem {
  id: string;
  recipient: string;
  subject: string;
  templateName: string;
  variables: Record<string, any>;
  status: "Pending" | "Sending" | "Delivered" | "Failed" | "Retry";
  attempts: number;
  lastAttemptAt?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: { filename: string; content?: string; path?: string }[];
}

export const emailsDb: EmailQueueItem[] = [
  {
    id: "EML-001",
    recipient: "sunita@deshmukhfoods.co",
    subject: "Welcome to Legomark India",
    templateName: "Welcome Email",
    variables: { fullName: "Sunita Deshmukh", clientEmail: "sunita@deshmukhfoods.co" },
    status: "Delivered",
    attempts: 1,
    lastAttemptAt: "2026-06-28T08:15:00Z",
    createdAt: "2026-06-28T08:14:50Z",
    updatedAt: "2026-06-28T08:15:00Z"
  },
  {
    id: "EML-002",
    recipient: "aman@malhotrasports.com",
    subject: "Tax Invoice Generated - ORD-2026-002",
    templateName: "Tax Invoice",
    variables: { fullName: "Aman Malhotra", amount: "₹13,160", orderId: "ORD-2026-002", invoiceId: "INV-2026-002" },
    status: "Pending",
    attempts: 0,
    createdAt: new Date("2026-06-28T09:10:00Z").toISOString(),
    updatedAt: new Date("2026-06-28T09:10:00Z").toISOString()
  }
];

export interface SessionRecord {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  userAgent: string;
  ipAddress: string;
  lastLogin: string;
  expiresAt: string;
  refreshToken: string;
  isRevoked: boolean;
}

export interface PasswordResetRecord {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  isUsed: boolean;
}

export interface EmailVerificationRecord {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  isUsed: boolean;
}

export interface FailedLoginRecord {
  email: string;
  count: number;
  lockUntil?: string;
}

export interface AuditLogRecord {
  id: string;
  email: string;
  event: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export const sessionsDb: SessionRecord[] = [
  {
    id: "sess-default-1",
    userId: "usr-admin-01",
    email: "admin@legomark.com",
    fullName: "Lead Admin",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0.0.0 Safari/537.36",
    ipAddress: "127.0.0.1",
    lastLogin: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    refreshToken: "ref-token-default-1",
    isRevoked: false
  }
];

export const passwordResetsDb: PasswordResetRecord[] = [];
export const emailVerificationsDb: EmailVerificationRecord[] = [];
export const failedLoginsDb: FailedLoginRecord[] = [];
export const auditLogsDb: AuditLogRecord[] = [
  {
    id: "aud-001",
    email: "admin@legomark.com",
    event: "LOGIN_SUCCESS",
    timestamp: new Date().toISOString(),
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0"
  }
];

export const userVerificationStatusDb: Record<string, boolean> = {
  "admin@legomark.com": true,
  "sunita@deshmukhfoods.co": true,
  "aman@malhotrasports.com": true,
  "client@example.com": false
};


