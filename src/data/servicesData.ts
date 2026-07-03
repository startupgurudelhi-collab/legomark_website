/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceData } from "../types/service.js";

export const servicesData: ServiceData[] = [
  {
    id: "pvt-ltd",
    category: "Company Registration",
    categorySlug: "company-registration",
    subcategory: "Corporate Entities",
    serviceName: "Private Limited Company",
    urlSlug: "private-limited-company",
    shortDescription: "Incorporate a Private Limited Company (Pvt Ltd) in India. The most popular legal structure for startups and growing businesses offering limited liability and high credibility.",
    fullDescription: "A Private Limited Company is India's most popular corporate structure, highly favored by tech startups, venture capitalists, and foreign investors. It provides limited liability protection to its shareholders, establishes a completely separate legal entity, and allows easy raising of equity funds. Legomark India's Dynamic Engine helps you navigate the entire Ministry of Corporate Affairs (MCA) registration seamlessly, from DSC to Certificate of Incorporation.",
    benefits: [
      "Separate Legal Entity status ensuring independent existence",
      "Limited Liability protection protecting personal assets of founders",
      "Easy Funding access as investors prefer Pvt Ltd structure",
      "Dual credibility with clients, suppliers, and financial institutions",
      "Perpetual Succession ensuring company exists even if owners change"
    ],
    eligibility: [
      "Minimum 2 Directors (at least one must be an Indian Resident)",
      "Minimum 2 Shareholders (can be same as directors, max 200)",
      "No minimum paid-up capital requirement to start",
      "Registered office address within India"
    ],
    requiredDocuments: [
      "PAN Card and Aadhaar Card of all Directors",
      "Passport size photos of all Directors",
      "Latest bank statement or utility bill as proof of address (not older than 2 months)",
      "Voter ID, Passport, or Driving License for identity proof",
      "Utility bill (electricity/gas) of the registered office premise",
      "NOC from the property owner if rented, along with rent agreement"
    ],
    stepByStepProcess: [
      {
        step: 1,
        title: "Digital Signature Certificate (DSC)",
        description: "Obtain class-3 DSC for all proposed directors to securely sign electronic applications."
      },
      {
        step: 2,
        title: "Name Approval (RUN/SPICe+)",
        description: "Submit 2 unique name preferences for the company to the MCA via SPICe+ Part A web service."
      },
      {
        step: 3,
        title: "Document Drafting (MoA & AoA)",
        description: "Draft Memorandum of Association (MoA) defining company scope and Articles of Association (AoA) for internal rules."
      },
      {
        step: 4,
        title: "Incorporate Filing (SPICe+ Part B)",
        description: "File the final integration form SPICe+ Part B for incorporation, PAN, TAN, EPFO, ESIC, and bank account allocation."
      },
      {
        step: 5,
        title: "Certificate of Incorporation (COI)",
        description: "The Registrar of Companies (RoC) reviews documents and issues the official Certificate of Incorporation."
      }
    ],
    timeline: "7 - 10 working days",
    governmentFees: "₹1,500 (Approx, depends on authorized capital and state)",
    professionalFees: "₹4,999",
    packages: [
      {
        name: "Standard Package",
        price: 5999,
        gstPercent: 18,
        discountPrice: 4999,
        features: [
          "2 Digital Signature Certificates (DSC)",
          "1 Name Approval Application (RUN)",
          "Drafting of MoA and AoA",
          "Government Stamp Duty & PAN/TAN",
          "Free Spice+ Incorporation Filing",
          "EPFO & ESIC Registrations",
          "Zero-balance Corporate Bank Account setup assist"
        ],
        cta: "Incorporate Standard",
        displayOrder: 1
      },
      {
        name: "Premium (Startup Suite)",
        price: 11999,
        gstPercent: 18,
        discountPrice: 8999,
        features: [
          "Everything in Standard Package",
          "MSME / Udyam Registration certificate",
          "GST Registration for company",
          "Drafting of standard founder's agreement",
          "3 months dedicated post-incorporation consultancy",
          "1-year intellectual property trademark filing assistant"
        ],
        cta: "Go Premium Startup",
        displayOrder: 2
      }
    ],
    faqs: [
      {
        question: "Can an NRI or Foreign National be a Director in a Pvt Ltd Company?",
        answer: "Yes, NRIs and Foreign Nationals can become directors in an Indian Private Limited Company. However, at least one director must be a resident of India (present in India for over 182 days in the previous calendar year).",
        displayOrder: 1
      },
      {
        question: "Is a physical office required during incorporation?",
        answer: "Yes, you must provide a valid physical address as the registered office of the company. A residential address is also acceptable as a registered office in India.",
        displayOrder: 2
      },
      {
        question: "Can a single person start a Private Limited Company?",
        answer: "No, a Private Limited Company requires a minimum of 2 directors/shareholders. If you are a single founder, you should choose a One Person Company (OPC) or a LLP with another nominee.",
        displayOrder: 3
      }
    ],
    relatedServices: ["one-person-company", "llp-registration", "trademark-registration"],
    seoMetaTitle: "Pvt Ltd Company Registration India | Incorporate Startup | Legomark",
    seoDescription: "Register your Private Limited Company (Pvt Ltd) in India easily with Legomark. Clear, fast process including DSC, PAN, TAN, and Certificate of Incorporation.",
    seoKeywords: ["private limited company", "pvt ltd registration", "mca company registration", "incorporation", "register startup india"],
    jsonLdSchema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Private Limited Company Registration",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Legomark India"
      },
      "areaServed": "IN",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "4999.00"
      }
    },
    featuredStatus: true,
    draftStatus: "Published",
    displayOrder: 1
  },
  {
    id: "opc",
    category: "Company Registration",
    categorySlug: "company-registration",
    subcategory: "Corporate Entities",
    serviceName: "One Person Company",
    urlSlug: "one-person-company",
    shortDescription: "Form a One Person Company (OPC) to enjoy all benefits of a Private Limited Company with sole ownership and complete operational authority.",
    fullDescription: "A One Person Company is a revolutionary legal hybrid introduced under the Companies Act 2013. It allows a single business owner to run a corporate entity with limited liability protection, eliminating the requirement of finding a co-founder or second partner. It combines the ease of a sole proprietorship with the legal sanctity and protection of a private limited company.",
    benefits: [
      "100% single owner control over business decisions",
      "Limited liability ensures personal assets are fully shielded",
      "Easier compliance structure compared to standard Pvt Ltd",
      "Separate legal existence and high credibility for corporate clients",
      "Easier transferability of shares through nominee arrangement"
    ],
    eligibility: [
      "Only a natural person who is an Indian citizen and resident in India",
      "One single shareholder/director",
      "Must appoint one Nominee Director during registration",
      "Maximum paid-up capital of ₹50 Lakhs (no minimum limit)"
    ],
    requiredDocuments: [
      "PAN Card and Aadhaar of the Director & Nominee",
      "Passport size photos of director",
      "Latest address proof of director & nominee (bank statement/utility bill)",
      "Registered office premises address proof along with Rent agreement & NOC"
    ],
    stepByStepProcess: [
      {
        step: 1,
        title: "Acquire DSC & DIN",
        description: "Obtain the Digital Signature Certificate and Director Identification Number for the single founder."
      },
      {
        step: 2,
        title: "Name Reservation",
        description: "Apply for a unique corporate name reservation through the RUN (Reserve Unique Name) MCA portal."
      },
      {
        step: 3,
        title: "Prepare Nominee Consent",
        description: "Obtain written consent from the nominated individual in Form INC-3 to act as nominee in case of emergencies."
      },
      {
        step: 4,
        title: "SPICe+ Registration",
        description: "File SPICe+ form with detailed drafts of MoA, AoA, Nominee documents, and registered office proof."
      }
    ],
    timeline: "8 - 12 working days",
    governmentFees: "₹1,200 (Approx, depends on capital size)",
    professionalFees: "₹3,999",
    packages: [
      {
        name: "OPC Essential Plan",
        price: 4999,
        gstPercent: 18,
        discountPrice: 3999,
        features: [
          "1 DSC (Digital Signature)",
          "1 Name Reservation Application",
          "Preparation of MoA & AoA and INC-3 Nominee Form",
          "PAN, TAN and ESIC/EPFO registrations",
          "Registrar of Companies (ROC) government stamp duty"
        ],
        cta: "Register OPC",
        displayOrder: 1
      }
    ],
    faqs: [
      {
        question: "Who is a Nominee in an OPC?",
        answer: "A Nominee is a person nominated by the single shareholder of an OPC. If the sole member dies or becomes incapacitated, the nominee takes over the ownership and management of the company.",
        displayOrder: 1
      },
      {
        question: "Can an OPC be converted to a Private Limited Company?",
        answer: "Yes, an OPC can convert voluntarily into a Private Limited Company at any time. Earlier compulsory conversion limits on turnover have been relaxed by the government to foster startup ease.",
        displayOrder: 2
      }
    ],
    relatedServices: ["private-limited-company", "llp-registration"],
    seoMetaTitle: "One Person Company Registration | OPC India | Legomark",
    seoDescription: "Start a One Person Company (OPC) in India with sole ownership and limited liability. Fast-track process, professional guidance and expert support by Legomark.",
    seoKeywords: ["one person company", "opc registration online", "single director company", "mca opc filing", "proprietorship to opc"],
    jsonLdSchema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "One Person Company Registration",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Legomark India"
      },
      "areaServed": "IN",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "3999.00"
      }
    },
    featuredStatus: false,
    draftStatus: "Published",
    displayOrder: 2
  },
  {
    id: "llp",
    category: "Company Registration",
    categorySlug: "company-registration",
    subcategory: "Corporate Entities",
    serviceName: "Limited Liability Partnership",
    urlSlug: "llp-registration",
    shortDescription: "Incorporate a Limited Liability Partnership (LLP) to combine the structural flexibility of a partnership with the limited liability benefits of a company.",
    fullDescription: "A Limited Liability Partnership is a modern corporate vehicle governed by the LLP Act 2008. It is highly suitable for professional services, consultants, family-owned enterprises, and medium-sized firms who want a structured corporate existence with minimal regulatory compliances and dual-level flexibility.",
    benefits: [
      "No audit required if turnover is under ₹40 Lakhs or capital is under ₹25 Lakhs",
      "Liability of partners is strictly limited to their agreed capital contribution",
      "Fewer administrative compliance formalities than a Pvt Ltd company",
      "No Dividend Distribution Tax (DDT) on sharing profits with partners",
      "Highly flexible management structure defined in the LLP agreement"
    ],
    eligibility: [
      "Minimum 2 Partners (No maximum limit)",
      "Minimum 2 Designated Partners (at least one must be Indian resident)",
      "Written LLP Partnership Agreement drawn within 30 days of incorporation",
      "Registered office address in India"
    ],
    requiredDocuments: [
      "PAN and Aadhaar card of all partners",
      "Address proof of partners (Utility bill, bank statement, or passport)",
      "Passport size photographs",
      "Registered premises utility bill with NOC and rent agreement"
    ],
    stepByStepProcess: [
      {
        step: 1,
        title: "Acquire Partner DSC",
        description: "Obtain Class 3 digital signatures for all proposed designated partners."
      },
      {
        step: 2,
        title: "Name Approval (FiLLiP)",
        description: "Submit unique name reservations to the MCA via the integrated FiLLiP registration form."
      },
      {
        step: 3,
        title: "Filing for Incorporation",
        description: "File FiLLiP forms with Registrar of Companies to request the Certificate of Incorporation."
      },
      {
        step: 4,
        title: "Draft & File LLP Agreement",
        description: "Draft the LLP agreement defining rights, duties, and profits, and submit online in Form 3 within 30 days."
      }
    ],
    timeline: "8 - 12 working days",
    governmentFees: "₹1,000 (Approx, depends on capital size)",
    professionalFees: "₹3,499",
    packages: [
      {
        name: "Standard LLP Package",
        price: 4999,
        gstPercent: 18,
        discountPrice: 3999,
        features: [
          "2 Designated Partner DSCs",
          "LLP Name reservation filing",
          "FiLLiP Incorporation Application",
          "Integrated PAN & TAN request",
          "Custom Drafting of the legally compliant LLP Agreement",
          "Filing of Form 3 with RoC"
        ],
        cta: "Register LLP",
        displayOrder: 1
      }
    ],
    faqs: [
      {
        question: "Can an existing traditional Partnership Firm convert into an LLP?",
        answer: "Yes, you can convert an existing partnership firm into an LLP by filing Form 17 along with Form FiLLiP on the MCA portal, ensuring asset and debt transitions remain seamless.",
        displayOrder: 1
      },
      {
        question: "Is there a minimum capital requirement for an LLP?",
        answer: "No, there is no minimum capital requirement to form an LLP. Partners can begin with any nominal capital (e.g. ₹5,000 or ₹10,000 total).",
        displayOrder: 2
      }
    ],
    relatedServices: ["private-limited-company", "partnership-firm"],
    seoMetaTitle: "LLP Registration India Online | Limited Liability Partnership | Legomark",
    seoDescription: "Register a Limited Liability Partnership (LLP) in India with Legomark. Secure limited liability for partners with minimal compliance and cost-effective packages.",
    seoKeywords: ["llp registration", "limited liability partnership", "fillip mca form", "llp agreement", "register partnership india"],
    jsonLdSchema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "LLP Registration",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Legomark India"
      },
      "areaServed": "IN",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "3999.00"
      }
    },
    featuredStatus: false,
    draftStatus: "Published",
    displayOrder: 3
  },
  {
    id: "gst-reg",
    category: "Tax & Compliance",
    categorySlug: "gst",
    subcategory: "Indirect Taxation",
    serviceName: "GST Registration",
    urlSlug: "gst-registration",
    shortDescription: "Get your Goods and Services Tax (GST) registration number for your business within days. Stay compliant, claim Input Tax Credits (ITC), and sell interstate.",
    fullDescription: "GST is the single biggest indirect tax reform in India, merging multiple state and central taxes under one roof. Legomark India's GST registration engine guides startups, proprietors, and partnership firms to quickly obtain their 15-digit GSTIN, helping them join the mainstream economy and claim valuable tax credits on business purchases.",
    benefits: [
      "Legally recognized business operations enabling large client contracts",
      "Eligibility to collect GST from buyers and issue proper tax invoices",
      "Ability to claim Input Tax Credit (ITC) on all business purchases & capital goods",
      "No restriction on interstate sales or online e-commerce trading",
      "Seamless and fully transparent online tax ecosystem"
    ],
    eligibility: [
      "Service businesses with turnover exceeding ₹20 Lakhs (₹10 Lakhs in Special States)",
      "Goods manufacturing/trading businesses with turnover exceeding ₹40 Lakhs",
      "Any business engaging in interstate supplies of goods",
      "E-commerce sellers, non-resident taxable persons, and voluntary registrants"
    ],
    requiredDocuments: [
      "PAN Card of the Business / Proprietor",
      "Aadhaar Card or ID proof of all owners / partners / directors",
      "Proof of Business Registration (COI, Partnership Deed, etc.)",
      "Address proof of principal place of business (Utility bill or property tax receipt)",
      "Rent agreement and NOC if property is rented",
      "Cancelled cheque or front page of bank passbook showing IFSC & Account number"
    ],
    stepByStepProcess: [
      {
        step: 1,
        title: "Apply TRN (Temporary Reference Number)",
        description: "Verify email and mobile number via OTP on the GST portal to generate a TRN."
      },
      {
        step: 2,
        title: "Fill GST Application Part B",
        description: "Submit details of business, stakeholders, authorized signatory, and uploading of core documents using TRN."
      },
      {
        step: 3,
        title: "Aadhaar Authentication",
        description: "Perform biometric or e-KYC Aadhaar authentication via the link dispatched by the GST department to fast-track approvals."
      },
      {
        step: 4,
        title: "ARN Generation & Approval",
        description: "On submission, an Application Reference Number (ARN) is generated. The tax officer reviews and approves within 3-7 working days."
      }
    ],
    timeline: "3 - 5 working days",
    governmentFees: "₹0 (No government fee for GST registration)",
    professionalFees: "₹1,499",
    packages: [
      {
        name: "Standard GST Package",
        price: 1999,
        gstPercent: 18,
        discountPrice: 1499,
        features: [
          "TRN & ARN generation on official portal",
          "Accurate preparation & drafting of application details",
          "HCS / SAC code selection guidelines",
          "Verification of business address documentation",
          "Aadhaar e-KYC assistance",
          "Resolution of initial clarifications/queries (if raised by officer)"
        ],
        cta: "Apply GST Now",
        displayOrder: 1
      }
    ],
    faqs: [
      {
        question: "Is Aadhaar Authentication mandatory for GST?",
        answer: "Yes, Aadhaar authentication is highly recommended. It triggers an instant automated check which speeds up the registration process. If not opted, a physical site inspection by the GST inspector may be required, delaying approval.",
        displayOrder: 1
      },
      {
        question: "Can I register for GST voluntarily if my turnover is below the limit?",
        answer: "Absolutely. Many businesses register voluntarily because they want to claim Input Tax Credit, sell interstate, or sell products via Amazon/Flipkart.",
        displayOrder: 2
      }
    ],
    relatedServices: ["gst-return-filing", "income-tax-return"],
    seoMetaTitle: "Online GST Registration | Get GSTIN Online | Legomark India",
    seoDescription: "Secure your 15-digit GSTIN easily. Legomark provides professional GST registration services in India with zero-hassle documentation and swift approval.",
    seoKeywords: ["gst registration online", "apply for gstin", "gst threshold limits", "input tax credit registration", "how to register for gst"],
    jsonLdSchema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "GST Registration",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Legomark India"
      },
      "areaServed": "IN",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "1499.00"
      }
    },
    featuredStatus: true,
    draftStatus: "Published",
    displayOrder: 4
  },
  {
    id: "trademark",
    category: "Trademark",
    categorySlug: "trademark",
    subcategory: "Intellectual Property",
    serviceName: "Trademark Registration",
    urlSlug: "trademark-registration",
    shortDescription: "Protect your brand name, logo, or slogan from duplication. File trademark application online under the correct class with government registry.",
    fullDescription: "A trademark is an invaluable corporate asset that gives you exclusive rights to your brand identifier, protecting it from copycats and competitors. Legomark India's Trademark Registration Engine executes direct class classification search, drafts the tm-7 form, and secures the TM application number within 24 hours so you can start using the 'TM' symbol immediately.",
    benefits: [
      "Exclusive rights to use your brand name, logo, or tagline across India",
      "Provides complete legal protection against counterfeits & duplicate brands",
      "Enables you to use the TM symbol instantly, and the ® symbol upon approval",
      "Builds significant brand value and intangible asset valuation over time",
      "Provides legal power to sue and stop infringers from exploiting your reputation"
    ],
    eligibility: [
      "Any individual, proprietor, joint owner, partner, or company",
      "Proprietorship firms, partnerships, LLPs, and Private Limited Companies",
      "Societies, Trusts, and non-profit organizations"
    ],
    requiredDocuments: [
      "Brand Name, Logo, or Tagline design",
      "PAN & Aadhaar of the applicant",
      "Incorporation Certificate or Partnership deed for business entities",
      "MSME / Udyam Certificate (to claim 50% discount on government filing fees)",
      "Power of Attorney (TM-48) authorization signed by the applicant",
      "User Affidavit (if brand is already being used in India prior to filing date)"
    ],
    stepByStepProcess: [
      {
        step: 1,
        title: "Trademark Search",
        description: "Conduct an exhaustive search on the public trademark database to check compatibility and avoid future objections."
      },
      {
        step: 2,
        title: "Class Selection",
        description: "Determine which of the 45 international trademark classes your business products/services fall under."
      },
      {
        step: 3,
        title: "Drafting & Power of Attorney",
        description: "Prepare and sign the TM-48 authorization form authorizing Legomark TM attorney to represent you."
      },
      {
        step: 4,
        title: "Application Filing",
        description: "Submit online application form to the Trademark Registry and generate your application number."
      }
    ],
    timeline: "1 - 2 working days (For application number generation, final registration takes 6-12 months)",
    governmentFees: "₹4,500 (For Individuals/MSME/Startups) or ₹9,000 (For others)",
    professionalFees: "₹1,999",
    packages: [
      {
        name: "Standard Brand Protection",
        price: 3499,
        gstPercent: 18,
        discountPrice: 2499,
        features: [
          "Exhaustive trademark search for 1 Class",
          "Correct class selection guidance",
          "Drafting of TM-48 Power of Attorney",
          "Online application submission & receipt dispatch",
          "Instant TM application number generation",
          "Email notifications about application status shifts"
        ],
        cta: "File Trademark",
        displayOrder: 1
      },
      {
        name: "Advanced Brand Shield",
        price: 6999,
        gstPercent: 18,
        discountPrice: 4999,
        features: [
          "Everything in Standard Package",
          "Up to 2 distinct trademark classes filings",
          "Comprehensive User Affidavit drafting (if prior use claims exist)",
          "Drafting reply to standard initial examiner's objection (if raised)",
          "12 months monitoring service to catch copying attempts by others"
        ],
        cta: "Secure Brand Shield",
        displayOrder: 2
      }
    ],
    faqs: [
      {
        question: "When can I start using the TM symbol?",
        answer: "You can start using the 'TM' symbol next to your logo or brand name immediately after submitting the application and receiving the TM application number (within 24 hours of filing).",
        displayOrder: 1
      },
      {
        question: "How long is a trademark registration valid?",
        answer: "A registered trademark is valid for 10 years from the date of filing. It can be renewed indefinitely every 10 years by paying the renewal fee.",
        displayOrder: 2
      },
      {
        question: "What is the difference between TM and ® symbols?",
        answer: "'TM' is used when your application is pending with the trademark registry. '®' (Registered) symbol can only be used once the trademark is fully registered and approved, and the registration certificate is issued.",
        displayOrder: 3
      }
    ],
    relatedServices: ["trademark-objection", "private-limited-company"],
    seoMetaTitle: "Online Trademark Registration | Protect Brand Logo | Legomark India",
    seoDescription: "Protect your brand with Legomark. Complete online trademark search and registration service in India. Secure your exclusive trademark application number today.",
    seoKeywords: ["trademark registration", "brand name protection", "register logo india", "trademark search online", "how to get tm symbol"],
    jsonLdSchema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Trademark Registration",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Legomark India"
      },
      "areaServed": "IN",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "2499.00"
      }
    },
    featuredStatus: true,
    draftStatus: "Published",
    displayOrder: 5
  },
  {
    id: "gst-returns",
    category: "Tax & Compliance",
    categorySlug: "gst",
    subcategory: "Indirect Taxation",
    serviceName: "GST Return Filing",
    urlSlug: "gst-return-filing",
    shortDescription: "Periodic monthly or quarterly filing of GST returns. Stay fully compliant with GSTR-1, GSTR-3B, GSTR-4 and GSTR-9 filings.",
    fullDescription: "Filing your GST returns is a critical compliance checkpoint once you secure a GSTIN. Proper and timely filings prevent massive late fee accumulators, allow your business clients to match and claim input tax credit (ITC) smoothly, and maintain a high GST compliance rating for your business.",
    benefits: [
      "No late fees or penalties with on-time automated reminders",
      "Maintains excellent relation with B2B buyers by ensuring they get their ITC credit on time",
      "Maintains clean financial statements ready for bank credit and loan processing",
      "Fully expert-managed filing ensures zero accounting discrepancies"
    ],
    eligibility: [
      "Any business entity possessing an active GSTIN",
      "Regular Taxpayers, Composition Dealers, Input Service Distributors (ISD)"
    ],
    requiredDocuments: [
      "Sales Register or Invoice sheet detailing outward supplies",
      "Purchase Register or purchase tax invoices detailing inward supplies",
      "GST Portal Login credentials",
      "Summary of debit/credit notes, exports, or advances"
    ],
    stepByStepProcess: [
      {
        step: 1,
        title: "Data Reconciliation",
        description: "Reconcile outward sales register against purchase invoices and match with GSTR-2B automatically generated data on the portal."
      },
      {
        step: 2,
        title: "Draft GSTR-1",
        description: "Draft outward supplies summary on the portal, ensuring correct client GSTIN entries."
      },
      {
        step: 3,
        title: "Draft GSTR-3B",
        description: "Compile final tax liability, adjust available ITC, and calculate net tax due."
      },
      {
        step: 4,
        title: "Tax Settlement & DSC/EVC Filing",
        description: "Assist with tax payment chalan generation, verify calculations, and submit using DSC or EVC OTP."
      }
    ],
    timeline: "Monthly/Quarterly recurring filing cycles",
    governmentFees: "₹0 (Filing fees are free, but taxes must be paid to government based on sales)",
    professionalFees: "₹999 / Month",
    packages: [
      {
        name: "Monthly Filing Plan",
        price: 1500,
        gstPercent: 18,
        discountPrice: 999,
        features: [
          "GSTR-1 & GSTR-3B monthly filing",
          "Reconciliation of purchase bills with GSTR-2B up to 100 invoices",
          "Dedicated compliance executive allocation",
          "Support for Nil returns if no sales transactions took place",
          "Prompt notification of filing confirmations"
        ],
        displayOrder: 1,
        cta: "Subscribe Monthly"
      },
      {
        name: "Annual Compliance Pack",
        price: 12000,
        gstPercent: 18,
        discountPrice: 8999,
        features: [
          "Everything in Monthly Plan for 12 months",
          "Dedicated GSTR-9 annual filing inclusion",
          "Detailed annual purchase audit & ITC optimization assistance",
          "GST assessment support from expert CA"
        ],
        displayOrder: 2,
        cta: "Go Annual GST Pack"
      }
    ],
    faqs: [
      {
        question: "What is GSTR-1 and GSTR-3B?",
        answer: "GSTR-1 is the return where you declare outward sales details (issued invoices). GSTR-3B is the monthly self-declaration return where you summarize taxes, offset them with ITC, and pay the remaining tax to the government.",
        displayOrder: 1
      },
      {
        question: "Is filing GST returns mandatory if there are zero sales?",
        answer: "Yes, even if your business has zero sales or operations, you must file a 'NIL' GST return periodically. Failure to file triggers automatic late fees of ₹20-50 per day.",
        displayOrder: 2
      }
    ],
    relatedServices: ["gst-registration", "income-tax-return"],
    seoMetaTitle: "Online GST Return Filing Service | Monthly GSTR-1 & 3B | Legomark",
    seoDescription: "File your GST Returns on time with Legomark. Avoid penalties, reconcile Input Tax Credits (ITC), and experience expert-driven accounting support.",
    seoKeywords: ["gst return filing", "gstr-1 online filing", "gstr-3b computation", "input tax credit reconciliation", "gst filing services cost"],
    jsonLdSchema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "GST Return Filing",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Legomark India"
      },
      "areaServed": "IN",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "999.00"
      }
    },
    featuredStatus: false,
    draftStatus: "Published",
    displayOrder: 6
  },
  {
    id: "fssai",
    category: "Licenses",
    categorySlug: "licenses",
    subcategory: "Regulatory Permissions",
    serviceName: "FSSAI Food License",
    urlSlug: "fssai-food-license",
    shortDescription: "Secure your FSSAI Food Safety Registration or State/Central License for any food business including cloud kitchens, restaurants, and packers.",
    fullDescription: "FSSAI (Food Safety and Standards Authority of India) registration is an absolute legal mandate for any entrepreneur dealing in food products, distribution, packing, manufacturing, or catering. From single cloud kitchens to industrial restaurants, obtaining the correct FSSAI license ensures food hygiene standards are kept high and avoids massive penal action.",
    benefits: [
      "100% legal compliance with Food Safety standards in India",
      "Enables smooth entry on online food delivery applications like Swiggy and Zomato",
      "Builds massive consumer trust regarding food quality and security",
      "Allows easy distribution, branding, and selling of food products"
    ],
    eligibility: [
      "FSSAI Registration: Petty food business with annual turnover under ₹12 Lakhs",
      "State License: Medium food operators, manufacturers, or distributors with turnover of ₹12 Lakhs to ₹20 Crores",
      "Central License: Large manufacturers, exporters, importers, or operators with turnover exceeding ₹20 Crores"
    ],
    requiredDocuments: [
      "Passport photograph of food operator / proprietor",
      "Aadhaar, PAN Card, or Voter ID of the owner",
      "Proof of possession of premises (rent agreement, water tax receipt, or NOC)",
      "Food Safety Management System (FSMS) plan",
      "List of food categories, machinery layout (if applicable for manufacturing)"
    ],
    stepByStepProcess: [
      {
        step: 1,
        title: "Determine License Eligibility",
        description: "Determine whether your business requires basic registration, state license, or central license based on projected turnover and scale."
      },
      {
        step: 2,
        title: "Drafting FSMS Plan",
        description: "Draft standard food safety checklist and self-declaration regarding hygiene practices."
      },
      {
        step: 3,
        title: "Form submission on FoSCoS",
        description: "Submit online form with all supporting papers and address proofs on the official FoSCoS FSSAI web platform."
      },
      {
        step: 4,
        title: "Certificate Dispatch",
        description: "The food inspector reviews documents. If compliant, the certificate containing the 14-digit FSSAI number is issued online."
      }
    ],
    timeline: "7 - 15 working days",
    governmentFees: "₹100/year (Registration) or ₹2,000-5,000/year (State License)",
    professionalFees: "₹1,499",
    packages: [
      {
        name: "FSSAI Basic Registration",
        price: 2499,
        gstPercent: 18,
        discountPrice: 1999,
        features: [
          "FOSCOS portal registration & application filing",
          "Includes 1-year FSSAI Government Registration fee (₹100)",
          "Drafting of FSMS Self-declaration document",
          "Verification of business address proofs",
          "End-to-end follow up with FSSAI department"
        ],
        displayOrder: 1,
        cta: "Apply Food License"
      }
    ],
    faqs: [
      {
        question: "Is FSSAI mandatory for home bakers or small tea stalls?",
        answer: "Yes, FSSAI basic registration is mandatory for any commercial food operator, even if operating out of a residential kitchen. Zomato and Swiggy will not list you without a valid FSSAI number.",
        displayOrder: 1
      },
      {
        question: "What is the validity of an FSSAI license?",
        answer: "FSSAI licenses and registrations can be chosen with a validity ranging from 1 to 5 years. It must be renewed at least 30 days prior to expiry.",
        displayOrder: 2
      }
    ],
    relatedServices: ["private-limited-company", "gst-registration"],
    seoMetaTitle: "Online FSSAI Food License Registration India | FoSCoS | Legomark",
    seoDescription: "Get your 14-digit FSSAI food safety license or basic registration easily with Legomark. Register cloud kitchens, hotels, or grocery stores.",
    seoKeywords: ["fssai registration online", "foscos food license", "food safety certificate", "zomato partner license", "restaurant registration cost"],
    jsonLdSchema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "FSSAI Food License Registration",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Legomark India"
      },
      "areaServed": "IN",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "1999.00"
      }
    },
    featuredStatus: false,
    draftStatus: "Published",
    displayOrder: 7
  },
  {
    id: "itr",
    category: "Tax & Compliance",
    categorySlug: "gst",
    subcategory: "Direct Taxation",
    serviceName: "Income Tax Return Filing",
    urlSlug: "income-tax-return",
    shortDescription: "File your annual income tax return (ITR) with expert CA guidance. Optimize tax saving deductions under Section 80C, 80D, and more.",
    fullDescription: "Every individual or business earning income must file their Income Tax Return with the Income Tax Department of India annually. With professional CA guidance, you can claim proper refunds, declare multi-asset incomes (Salary, Business, Capital Gains, House Property), and avoid compliance notices.",
    benefits: [
      "Avoids legal notices and heavy penalty charges from the Income Tax department",
      "Serves as mandatory proof for home/car loan approvals and visa processing",
      "Enables you to claim eligible refunds for TDS deducted by employer/clients",
      "Allows carrying forward capital losses to offset against future gains"
    ],
    eligibility: [
      "Individuals with income exceeding the basic exemption limit (₹2.5 Lakhs / ₹3 Lakhs)",
      "All registered corporate firms, LLPs, and partnership businesses regardless of profit or loss",
      "Anyone seeking a refund on TDS deductions"
    ],
    requiredDocuments: [
      "PAN and Aadhaar Card",
      "Form 16 (for salaried individuals)",
      "Form 26AS & Annual Information Statement (AIS) from portal",
      "Bank Statements for the entire financial year",
      "Investment proofs (80C, LIC, PPF, mutual funds, medical insurance bills)",
      "Capital gains statement from broker (if trading shares or mutual funds)"
    ],
    stepByStepProcess: [
      {
        step: 1,
        title: "Document Collection",
        description: "Gather Form 16, Bank Statements, AIS, and tax saving investment bills."
      },
      {
        step: 2,
        title: "Tax Computation",
        description: "Our CA reviews and compiles your income across five heads, calculating tax liability or refund options under Old vs New Tax Regimes."
      },
      {
        step: 3,
        title: "Drafting Return on Portal",
        description: "Submit correct ITR-1, ITR-2, ITR-3, or ITR-4 form based on income composition."
      },
      {
        step: 4,
        title: "e-Verification",
        description: "Perform instant electronic e-verification via Aadhaar OTP to complete the filing cycle."
      }
    ],
    timeline: "2 - 3 working days",
    governmentFees: "₹0 (If filed before deadline, but tax liability itself applies if any)",
    professionalFees: "₹999",
    packages: [
      {
        name: "Salaried ITR-1 Plan",
        price: 1499,
        gstPercent: 18,
        discountPrice: 999,
        features: [
          "Filing for single salary Form 16",
          "Savings account interest declaration",
          "Form 26AS / AIS reconciliation check",
          "Tax planning analysis under Old vs New regime",
          "Aadhaar OTP based e-verification"
        ],
        displayOrder: 1,
        cta: "File Salaried ITR"
      },
      {
        name: "Business / Capital Gains Suite",
        price: 3999,
        gstPercent: 18,
        discountPrice: 2999,
        features: [
          "Drafting complex ITR-2 or ITR-3",
          "Reconciliation of share market trading and crypto assets",
          "Claiming business expenses under presumptive taxation (Section 44AD)",
          "Dedicated chartered accountant consultation",
          "Response drafting to auto-generated system intimations"
        ],
        displayOrder: 2,
        cta: "File Business ITR"
      }
    ],
    faqs: [
      {
        question: "What is AIS and Form 26AS?",
        answer: "Form 26AS is your annual tax credit statement displaying TDS deducted on your behalf. AIS (Annual Information Statement) is a comprehensive record of all financial transactions like mutual fund purchases, high-value bank deposits, and share trading associated with your PAN.",
        displayOrder: 1
      },
      {
        question: "What happens if I miss the ITR filing deadline?",
        answer: "Filing after the deadline (typically July 31st for individuals) triggers a late filing fee of up to ₹5,000 under Section 234F, along with interest charges on outstanding taxes.",
        displayOrder: 2
      }
    ],
    relatedServices: ["gst-return-filing", "gst-registration"],
    seoMetaTitle: "Online CA Assisted ITR Filing India | Income Tax Return | Legomark",
    seoDescription: "File your ITR online with Legomark. Secure max tax deductions,CA-guided computation, bank statement reconciliation, and speedy filing.",
    seoKeywords: ["itr filing online", "chartered accountant tax return", "form 16 filing", "capital gains taxation", "how to claim tds refund"],
    jsonLdSchema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Income Tax Return Filing",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Legomark India"
      },
      "areaServed": "IN",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "999.00"
      }
    },
    featuredStatus: false,
    draftStatus: "Published",
    displayOrder: 8
  }
];

const ALIAS_MAP: Record<string, string> = {
  "pvt-ltd": "pvt-ltd",
  "private-limited-company": "pvt-ltd",
  "opc": "opc",
  "one-person-company": "opc",
  "llp": "llp",
  "llp-registration": "llp",
  "gst-reg": "gst-reg",
  "gst-registration": "gst-reg",
  "gst-returns": "gst-returns",
  "gst-return-filing": "gst-returns",
  "itr": "itr",
  "income-tax-return": "itr",
  "registration": "trademark",
  "trademark-registration": "trademark",
  "fssai": "fssai",
  "fssai-food-license": "fssai"
};

/**
 * Retrieves the effective services list, merging or falling back to the default servicesData
 */
export function getEffectiveServices(): ServiceData[] {
  try {
    const custom = typeof window !== "undefined" ? localStorage.getItem("legomark_admin_services") : null;
    if (custom) {
      return JSON.parse(custom);
    }
  } catch (e) {
    console.error("Failed to parse custom services:", e);
  }
  return servicesData;
}

/**
 * Resolves a service from the database using category and service slugs, 
 * accommodating common alias mappings to support legacy routes.
 */
export function getServiceBySlug(categorySlug: string, serviceSlug: string): ServiceData | undefined {
  const cleanCategory = categorySlug.toLowerCase().trim();
  const rawService = serviceSlug.toLowerCase().trim();
  const cleanService = ALIAS_MAP[rawService] || rawService;

  const activeServices = getEffectiveServices();

  return activeServices.find((service) => {
    // 1. Direct or resolved slugs comparison
    const resolvedServiceId = ALIAS_MAP[service.id.toLowerCase()] || service.id.toLowerCase();
    const resolvedServiceSlug = ALIAS_MAP[service.urlSlug.toLowerCase()] || service.urlSlug.toLowerCase();
    
    const matchSlug = 
      service.urlSlug.toLowerCase() === cleanService || 
      service.id.toLowerCase() === cleanService ||
      resolvedServiceId === cleanService ||
      resolvedServiceSlug === cleanService;
    
    // 2. Validate category matches loosely (either 'gst' or 'gst-services', etc.)
    const categoryMatches = 
      service.categorySlug.toLowerCase() === cleanCategory ||
      (cleanCategory === "gst" && service.categorySlug === "gst") ||
      (cleanCategory === "tax-compliance" && service.categorySlug === "gst") ||
      (cleanCategory === "trademark-services" && service.categorySlug === "trademark") ||
      (cleanCategory === "licenses" && service.categorySlug === "licenses");

    return matchSlug && categoryMatches;
  });
}

/**
 * Finds a service strictly by its unique service slug (for simple/fallback matches).
 */
export function findServiceBySlugOnly(slug: string): ServiceData | undefined {
  const raw = slug.toLowerCase().trim();
  const clean = ALIAS_MAP[raw] || raw;

  const activeServices = getEffectiveServices();

  return activeServices.find(s => {
    const resolvedId = ALIAS_MAP[s.id.toLowerCase()] || s.id.toLowerCase();
    const resolvedSlug = ALIAS_MAP[s.urlSlug.toLowerCase()] || s.urlSlug.toLowerCase();
    
    return s.urlSlug === clean || s.id === clean || resolvedId === clean || resolvedSlug === clean;
  });
}
