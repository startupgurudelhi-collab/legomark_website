/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BrandAsset {
  url: string;
  fileName: string;
  fileSize: string;
  lastUpdated: string;
}

export interface BrandMediaConfig {
  logo: BrandAsset;
  favicon: BrandAsset;
  founderPhoto: BrandAsset;
  officeMain: BrandAsset;
  officeGallery: BrandAsset[];
  defaultServiceBanner: BrandAsset;
  defaultBlogBanner: BrandAsset;
  careerBanner: BrandAsset;
  testimonialThumbnail: BrandAsset;
  companyProfile: BrandAsset;
  companyBrochure: BrandAsset;
}
