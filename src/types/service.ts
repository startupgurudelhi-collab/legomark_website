/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServicePackage {
  name: string;
  price: number;
  gstPercent?: number;
  discountPrice?: number;
  features: string[];
  cta: string;
  displayOrder: number;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
  displayOrder: number;
}

export interface StepProcess {
  step: number;
  title: string;
  description: string;
}

export interface ServiceData {
  id: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  serviceName: string;
  urlSlug: string;
  categoryId?: string;
  subcategoryId?: string;
  slug?: string;
  startingPrice?: number | string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  eligibility: string[];
  requiredDocuments: string[];
  stepByStepProcess: StepProcess[];
  timeline: string;
  governmentFees: number | string;
  professionalFees: number | string;
  packages: ServicePackage[];
  faqs: ServiceFAQ[];
  relatedServices: string[]; // List of related service slugs
  seoMetaTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  jsonLdSchema: Record<string, any>;
  featuredStatus: boolean;
  draftStatus: "Draft" | "Published";
  displayOrder: number;
}

export interface Category {
  id: string;
  categoryName: string;
  urlSlug: string;
  description: string;
  displayOrder: number;
  icon?: string;
  bannerImage?: string;
  seoTitle: string;
  metaDescription: string;
  showInMegaMenu: boolean;
  activeStatus: boolean;
}

export interface Subcategory {
  id: string;
  parentCategoryId: string; // references Category.id
  subcategoryName: string;
  urlSlug: string;
  description: string;
  displayOrder: number;
  seoTitle: string;
  metaDescription: string;
  activeStatus: boolean;
}

