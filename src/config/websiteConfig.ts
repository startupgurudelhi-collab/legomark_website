/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubMenuLink {
  label: string;
  href: string;
  description?: string;
}

export interface MegaMenuColumn {
  title: string;
  links: SubMenuLink[];
}

export interface NavigationItem {
  label: string;
  href: string;
  megaMenu?: MegaMenuColumn[];
}

export interface SocialLink {
  name: string;
  icon: "Facebook" | "Twitter" | "LinkedIn" | "Instagram" | "Youtube";
  url: string;
}

export interface WebsiteConfig {
  topBar: {
    phone: string;
    email: string;
    workingHours: string;
    socialLinks: SocialLink[];
  };
  navigation: NavigationItem[];
  footer: {
    aboutText: string;
    sections: {
      title: string;
      links: { label: string; href: string }[];
    }[];
    contact: {
      address: string;
      phone: string;
      email: string;
    };
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      buttonText: string;
    };
    bottomLinks: { label: string; href: string }[];
    copyright: string;
  };
}

export const websiteConfig: WebsiteConfig = {
  topBar: {
    phone: "+91 75308 47878",
    email: "info@legomarkindia.com",
    workingHours: "Monday to Sunday: 11:00 AM - 8:00 PM",
    socialLinks: [
      { name: "Facebook", icon: "Facebook", url: "https://facebook.com" },
      { name: "Twitter", icon: "Twitter", url: "https://twitter.com" },
      { name: "LinkedIn", icon: "LinkedIn", url: "https://linkedin.com" },
      { name: "Instagram", icon: "Instagram", url: "https://instagram.com" },
    ],
  },
  navigation: [
    {
      label: "Company Registration",
      href: "/services/company-registration",
      megaMenu: [
        {
          title: "Popular Registrations",
          links: [
            { label: "Private Limited Company", href: "/services/company-registration/pvt-ltd", description: "Most popular choice for startups & growing companies" },
            { label: "One Person Company (OPC)", href: "/services/company-registration/opc", description: "Sole proprietorship with limited liability benefits" },
            { label: "Limited Liability Partnership (LLP)", href: "/services/company-registration/llp", description: "Combines benefits of company and partnership structures" },
          ],
        },
        {
          title: "Other Registrations",
          links: [
            { label: "Public Limited Company", href: "/services/company-registration/public-ltd", description: "Suitable for large scale enterprises seeking public investment" },
            { label: "Section 8 Company", href: "/services/company-registration/section-8", description: "Non-profit organization for social or charitable causes" },
            { label: "Partnership Firm Registration", href: "/services/company-registration/partnership", description: "Traditional business registration for co-owners" },
          ],
        },
      ],
    },
    {
      label: "Tax & Compliance",
      href: "/services/tax-compliance",
      megaMenu: [
        {
          title: "Tax Registration",
          links: [
            { label: "GST Registration", href: "/services/tax-compliance/gst-reg", description: "Goods & Services Tax registration for businesses" },
            { label: "Professional Tax Registration", href: "/services/tax-compliance/prof-tax", description: "State tax compliance for employers and professionals" },
          ],
        },
        {
          title: "Annual Filings & Returns",
          links: [
            { label: "Income Tax Return (ITR)", href: "/services/tax-compliance/itr", description: "Annual income tax declaration and filing" },
            { label: "GST Return Filing", href: "/services/tax-compliance/gst-returns", description: "Periodic summary filing for GST compliant businesses" },
            { label: "TDS Return Filing", href: "/services/tax-compliance/tds", description: "Tax Deducted at Source periodic submission" },
          ],
        },
      ],
    },
    {
      label: "Trademark",
      href: "/services/trademark",
      megaMenu: [
        {
          title: "Intellectual Property",
          links: [
            { label: "Trademark Registration", href: "/services/trademark/registration", description: "Protect your brand name, slogan, or logo legally" },
            { label: "Trademark Objection", href: "/services/trademark/objection", description: "Resolve objections raised by the trademark examiner" },
            { label: "Trademark Renewal", href: "/services/trademark/renewal", description: "Extend your trademark protection for another 10 years" },
          ],
        },
      ],
    },
    {
      label: "Licenses",
      href: "/services/licenses",
      megaMenu: [
        {
          title: "Business Licenses",
          links: [
            { label: "FSSAI Food License", href: "/services/licenses/fssai", description: "Food safety registration for food businesses" },
            { label: "MSME / Udyam Registration", href: "/services/licenses/udyam", description: "Avail government schemes and subsidies for MSMEs" },
            { label: "IEC Import Export Code", href: "/services/licenses/iec", description: "Required for starting import or export business in India" },
          ],
        },
      ],
    },
    {
      label: "More",
      href: "/services",
      megaMenu: [
        {
          title: "Legal Agreements",
          links: [
            { label: "Non-Disclosure Agreement (NDA)", href: "/services/nda", description: "Confidentiality agreement for business relations" },
            { label: "Partnership Deed", href: "/services/partnership-deed", description: "Legal document defining terms of partnership" },
          ],
        },
      ],
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Blogs",
      href: "/blogs",
    },
    {
      label: "Career",
      href: "/career",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  footer: {
    aboutText: "Legomark India is a premier corporate consultancy providing end-to-end business incorporation, compliance, and legal services across India.",
    sections: [
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Our Story", href: "/about#story" },
          { label: "Careers", href: "/career" },
          { label: "Contact Us", href: "/contact" },
        ],
      },
      {
        title: "Services",
        links: [
          { label: "Company Registration", href: "/services/company-registration" },
          { label: "Tax & Compliance", href: "/services/tax-compliance" },
          { label: "Trademark & IP", href: "/services/trademark" },
          { label: "Business Licenses", href: "/services/licenses" },
        ],
      },
      {
        title: "Quick Links",
        links: [
          { label: "Latest Blogs", href: "/blogs" },
          { label: "Book Free Consultation", href: "/contact#consultation" },
          { label: "Sitemap", href: "/sitemap" },
          { label: "FAQ", href: "/faq" },
        ],
      },
    ],
    contact: {
      address: "D-561, Pocket 11, DDA Janta Flats, Jasola, New Delhi – 110025",
      phone: "+91 75308 47878, 011-45768289",
      email: "info@legomarkindia.com",
    },
    newsletter: {
      title: "Subscribe to Newsletter",
      description: "Receive updates on legal, compliance, and regulatory shifts in India.",
      placeholder: "Enter your email address",
      buttonText: "Subscribe",
    },
    bottomLinks: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
    copyright: "© 2026 Legomark India. All rights reserved.",
  },
};
