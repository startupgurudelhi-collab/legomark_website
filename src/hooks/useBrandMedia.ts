/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { BrandMediaConfig, BrandAsset } from "../types/brand.js";

export const DEFAULT_BRAND_MEDIA: BrandMediaConfig = {
  logo: {
    url: "/logo.png",
    fileName: "logo.png",
    fileSize: "15 KB",
    lastUpdated: "2026-06-25",
  },
  favicon: {
    url: "/favicon.ico",
    fileName: "favicon.ico",
    fileSize: "5 KB",
    lastUpdated: "2026-06-25",
  },
  founderPhoto: {
    url: "/founder.jpg",
    fileName: "founder.jpg",
    fileSize: "145 KB",
    lastUpdated: "2026-06-20",
  },
  officeMain: {
    url: "/office-premises.jpg",
    fileName: "office-premises.jpg",
    fileSize: "320 KB",
    lastUpdated: "2026-06-20",
  },
  officeGallery: [
    {
      url: "/career/workplace.jpg",
      fileName: "workplace.jpg",
      fileSize: "240 KB",
      lastUpdated: "2026-06-18",
    },
    {
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
      fileName: "office_lounge.jpg",
      fileSize: "185 KB",
      lastUpdated: "2026-06-18",
    },
    {
      url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600&auto=format&fit=crop",
      fileName: "meeting_room.jpg",
      fileSize: "210 KB",
      lastUpdated: "2026-06-18",
    },
  ],
  defaultServiceBanner: {
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    fileName: "service_default_banner.jpg",
    fileSize: "380 KB",
    lastUpdated: "2026-06-15",
  },
  defaultBlogBanner: {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    fileName: "blog_default_banner.jpg",
    fileSize: "420 KB",
    lastUpdated: "2026-06-15",
  },
  careerBanner: {
    url: "/career/workplace.jpg",
    fileName: "workplace.jpg",
    fileSize: "240 KB",
    lastUpdated: "2026-06-18",
  },
  testimonialThumbnail: {
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    fileName: "testimonial_placeholder.jpg",
    fileSize: "18 KB",
    lastUpdated: "2026-06-10",
  },
  companyProfile: {
    url: "#profile",
    fileName: "company-profile.pdf",
    fileSize: "1.2 MB",
    lastUpdated: "2026-06-28",
  },
  companyBrochure: {
    url: "#brochure",
    fileName: "company-brochure.pdf",
    fileSize: "2.4 MB",
    lastUpdated: "2026-06-28",
  },
};

const STORAGE_KEY = "legomark_brand_media_config";

export function getBrandMedia(): BrandMediaConfig {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      // Ensure all fields are present
      return { ...DEFAULT_BRAND_MEDIA, ...parsed };
    }
  } catch (error) {
    console.warn("Failed to parse brand media from storage", error);
  }
  return DEFAULT_BRAND_MEDIA;
}

export function saveBrandMedia(config: BrandMediaConfig) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("brand-media-updated"));
  } catch (error) {
    console.warn("Failed to write brand media to storage", error);
  }
}

export function useBrandMedia() {
  const [config, setConfig] = useState<BrandMediaConfig>(getBrandMedia);

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getBrandMedia());
    };

    window.addEventListener("brand-media-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("brand-media-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateAsset = (key: keyof BrandMediaConfig, asset: BrandAsset | null) => {
    const current = getBrandMedia();
    const updated = { ...current };

    if (key === "officeGallery") {
      // should not happen, officeGallery is handled separately
      return;
    }

    if (asset === null) {
      // Fallback to default
      updated[key] = DEFAULT_BRAND_MEDIA[key] as any;
    } else {
      updated[key] = asset as any;
    }

    saveBrandMedia(updated);
  };

  const updateOfficeGallery = (gallery: BrandAsset[]) => {
    const current = getBrandMedia();
    const updated = { ...current, officeGallery: gallery };
    saveBrandMedia(updated);
  };

  return {
    config,
    updateAsset,
    updateOfficeGallery,
    resetToDefaults: () => saveBrandMedia(DEFAULT_BRAND_MEDIA),
  };
}
