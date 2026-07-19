/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { BrandMediaConfig, BrandAsset } from "../types/brand.js";

export const DEFAULT_BRAND_MEDIA: BrandMediaConfig = {
  logo: {
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='90' height='90' x='5' y='5' rx='16' fill='%230c1b33'/><path d='M30 30 L50 45 L70 30' fill='none' stroke='%23e0a96d' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/><path d='M30 70 L30 30 L50 50 L70 30 L70 70' fill='none' stroke='%23ffffff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/><circle cx='50' cy='70' r='5' fill='%23e0a96d'/></svg>",
    fileName: "logo.svg",
    fileSize: "1.2 KB",
    lastUpdated: "2026-07-09",
  },
  favicon: {
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='90' height='90' x='5' y='5' rx='16' fill='%230c1b33'/><path d='M30 30 L50 45 L70 30' fill='none' stroke='%23e0a96d' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/><path d='M30 70 L30 30 L50 50 L70 30 L70 70' fill='none' stroke='%23ffffff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/><circle cx='50' cy='70' r='5' fill='%23e0a96d'/></svg>",
    fileName: "favicon.svg",
    fileSize: "1.2 KB",
    lastUpdated: "2026-07-09",
  },
  founderPhoto: {
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    fileName: "founder_avatar.jpg",
    fileSize: "45 KB",
    lastUpdated: "2026-07-18",
  },
  officeMain: {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    fileName: "office_illustration.jpg",
    fileSize: "120 KB",
    lastUpdated: "2026-07-18",
  },
  officeGallery: [
    {
      url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400&auto=format&fit=crop",
      fileName: "office_room_1.jpg",
      fileSize: "68 KB",
      lastUpdated: "2026-07-18",
    },
    {
      url: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=400&auto=format&fit=crop",
      fileName: "conference_hall.jpg",
      fileSize: "74 KB",
      lastUpdated: "2026-07-18",
    },
    {
      url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=400&auto=format&fit=crop",
      fileName: "reception_lounge.jpg",
      fileSize: "81 KB",
      lastUpdated: "2026-07-18",
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
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 150'><rect width='400' height='150' fill='%230c1b33'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='16'>Careers at Legomark</text></svg>",
    fileName: "career_banner.svg",
    fileSize: "1.3 KB",
    lastUpdated: "2026-07-09",
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
      const resolved = { ...DEFAULT_BRAND_MEDIA, ...parsed };
      return resolved;
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

export async function syncBrandMediaToServer(config: BrandMediaConfig) {
  try {
    const token = window.localStorage.getItem("efilingg_token");
    if (!token) return;

    // First fetch current settings to prevent over-writing other settings
    const res = await fetch("/api/cms/config");
    const json = await res.json();
    if (json.success && json.data && json.data.settings) {
      const currentSettings = json.data.settings;
      const updatedSettings = {
        ...currentSettings,
        brandMedia: config
      };

      await fetch("/api/cms/settings", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedSettings)
      });
    }
  } catch (error) {
    console.warn("Failed to sync brand media to server:", error);
  }
}

export function useBrandMedia() {
  const [config, setConfig] = useState<BrandMediaConfig>(getBrandMedia);

  useEffect(() => {
    // Sync from server on mount
    fetch("/api/cms/config")
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.settings) {
          if (res.data.settings.brandMedia) {
            const remoteMedia = res.data.settings.brandMedia;
            const merged = { ...DEFAULT_BRAND_MEDIA, ...remoteMedia };
            saveBrandMedia(merged);
          } else {
            // Server doesn't have brandMedia, but client might have it in localStorage!
            // If client has non-default brandMedia, and we are logged in as admin, sync it to the server
            const localMedia = getBrandMedia();
            const hasCustomMedia = JSON.stringify(localMedia) !== JSON.stringify(DEFAULT_BRAND_MEDIA);
            const token = window.localStorage.getItem("efilingg_token");
            if (hasCustomMedia && token) {
              syncBrandMediaToServer(localMedia);
            }
          }
        }
      })
      .catch(err => console.warn("Failed to fetch brand media from server on mount:", err));

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
    syncBrandMediaToServer(updated);
  };

  const updateOfficeGallery = (gallery: BrandAsset[]) => {
    const current = getBrandMedia();
    const updated = { ...current, officeGallery: gallery };
    saveBrandMedia(updated);
    syncBrandMediaToServer(updated);
  };

  return {
    config,
    updateAsset,
    updateOfficeGallery,
    resetToDefaults: () => {
      saveBrandMedia(DEFAULT_BRAND_MEDIA);
      syncBrandMediaToServer(DEFAULT_BRAND_MEDIA);
    },
  };
}
