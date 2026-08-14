/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getDb } from "./index.js";
import * as schema from "./schema.js";
import { eq, count } from "drizzle-orm";
import * as fallback from "../server/repositories/fallbackStore.js";

/**
 * Default core services to seed if the database services table is empty.
 */
const defaultServices = [
  {
    id: "srv-pvt-ltd",
    name: "Private Limited Company Registration",
    slug: "private-limited-company",
    category: "Company Registration",
    description: "Incorporate your company in India with end-to-end MCA filing, DIN, DSC, and MOA/AOA.",
    iconName: "Building2",
    seoMetaTitle: "Private Limited Company Registration | Legomark India",
    seoMetaDescription: "Register your Private Limited Company with expert CA support and swift MCA approval.",
    seoKeywords: ["company registration", "private limited", "mca filing", "incorporation"]
  },
  {
    id: "srv-trademark",
    name: "Trademark Registration & Protection",
    slug: "trademark-registration",
    category: "Intellectual Property",
    description: "Protect your brand name, logo, and intellectual assets with complete trademark registration.",
    iconName: "ShieldCheck",
    seoMetaTitle: "Online Trademark Registration in India | Legomark",
    seoMetaDescription: "Secure your brand name and logo across all trademark classes.",
    seoKeywords: ["trademark", "brand protection", "ipr filing", "trademark search"]
  },
  {
    id: "srv-gst",
    name: "GST Registration & Monthly Compliance",
    slug: "gst-registration",
    category: "Tax & Compliance",
    description: "Obtain new GSTIN, manage monthly GSTR-1, GSTR-3B filings, and resolve tax notices.",
    iconName: "Receipt",
    seoMetaTitle: "GST Registration and Monthly Return Filing | Legomark India",
    seoMetaDescription: "Get your GST certificate within days with certified tax experts.",
    seoKeywords: ["gst registration", "gstin", "gstr-1", "gstr-3b", "tax filing"]
  },
  {
    id: "srv-fssai",
    name: "FSSAI Food License Registration",
    slug: "fssai-license",
    category: "Licenses",
    description: "Mandatory food license registration and renewal for food manufacturers, cloud kitchens, and restaurants.",
    iconName: "Utensils",
    seoMetaTitle: "FSSAI Food License Registration Online | Legomark",
    seoMetaDescription: "Apply for FSSAI basic registration, state license, or central license.",
    seoKeywords: ["fssai", "food license", "foscos", "food safety"]
  },
  {
    id: "srv-startup-india",
    name: "Startup India DPIIT Recognition",
    slug: "startup-india-dpiit",
    category: "Company Registration",
    description: "Gain official DPIIT certification, 80-IAC tax exemptions, and fast-track patent benefits.",
    iconName: "Rocket",
    seoMetaTitle: "Startup India DPIIT Recognition & Tax Exemption | Legomark",
    seoMetaDescription: "Fast-track your startup recognition and government tender benefits.",
    seoKeywords: ["startup india", "dpiit", "80-iac", "seed fund"]
  }
];

const defaultCategories = [
  { id: "cat-company", name: "Company Registration", slug: "company-registration", description: "Business formation and corporate structuring services." },
  { id: "cat-ip", name: "Intellectual Property", slug: "intellectual-property", description: "Trademarks, copyrights, and patent filings." },
  { id: "cat-tax", name: "Tax & Compliance", slug: "tax-compliance", description: "GST, TDS, Income Tax returns and annual auditing." },
  { id: "cat-licenses", name: "Licenses", slug: "licenses", description: "FSSAI, Import Export Code (IEC), and regulatory permits." }
];

/**
 * Safely seeds the database with initial administrative user and default CMS data
 * ONLY if the tables are empty.
 * This guarantees NO DATA LOSS after any code pushes, server restarts, or redeployments.
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  const db = getDb();
  if (!db) {
    console.log("ℹ️ Database not initialized. Skipping database seed.");
    return;
  }

  try {
    console.log("🌱 Checking database state for initial records...");

    // 1. Check and Seed Users (Admin + Demo Accounts)
    try {
      const userCountResult = await db.select({ value: count() }).from(schema.users);
      const userCount = Number(userCountResult[0]?.value || 0);

      if (userCount === 0) {
        console.log("📝 Seeding initial administrative and client user accounts...");
        for (const user of fallback.usersDb) {
          await db.insert(schema.users).values({
            id: user.id,
            email: user.email.toLowerCase().trim(),
            fullName: user.fullName,
            passwordHash: user.passwordHash,
            role: user.role,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
            isDeleted: false,
          }).onConflictDoNothing();
        }
        console.log("✅ Default users seeded successfully.");
      } else {
        // Guarantee admin user exists even if other records were created
        const adminCheck = await db.select().from(schema.users).where(eq(schema.users.email, "admin@legomark.com")).limit(1);
        if (!adminCheck || adminCheck.length === 0) {
          const defaultAdmin = fallback.usersDb[0];
          await db.insert(schema.users).values({
            id: defaultAdmin.id,
            email: defaultAdmin.email.toLowerCase().trim(),
            fullName: defaultAdmin.fullName,
            passwordHash: defaultAdmin.passwordHash,
            role: defaultAdmin.role,
            createdAt: new Date(defaultAdmin.createdAt),
            updatedAt: new Date(defaultAdmin.updatedAt),
            isDeleted: false,
          }).onConflictDoNothing();
          console.log("✅ Default admin account verified and active.");
        }
      }
    } catch (userErr) {
      console.warn("⚠️ User seeding check skipped:", userErr);
    }

    // 2. Check and Seed Services
    try {
      const serviceCountResult = await db.select({ value: count() }).from(schema.services);
      const serviceCount = Number(serviceCountResult[0]?.value || 0);

      if (serviceCount === 0) {
        console.log("📝 Seeding initial service catalog...");
        for (const s of defaultServices) {
          await db.insert(schema.services).values({
            id: s.id,
            name: s.name,
            slug: s.slug,
            category: s.category,
            description: s.description,
            iconName: s.iconName,
            seoMetaTitle: s.seoMetaTitle,
            seoMetaDescription: s.seoMetaDescription,
            seoKeywords: s.seoKeywords,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
          }).onConflictDoNothing();
        }
        console.log("✅ Services catalog seeded successfully.");
      }
    } catch (svcErr) {
      console.warn("⚠️ Service seeding skipped:", svcErr);
    }

    // 3. Check and Seed Categories
    try {
      const categoryCountResult = await db.select({ value: count() }).from(schema.categories);
      const catCount = Number(categoryCountResult[0]?.value || 0);

      if (catCount === 0) {
        console.log("📝 Seeding service categories...");
        for (const c of defaultCategories) {
          await db.insert(schema.categories).values({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
          }).onConflictDoNothing();
        }
        console.log("✅ Categories seeded successfully.");
      }
    } catch (catErr) {
      console.warn("⚠️ Category seeding skipped:", catErr);
    }

    // 4. Check and Seed Packages
    try {
      const pkgCountResult = await db.select({ value: count() }).from(schema.packages);
      const pkgCount = Number(pkgCountResult[0]?.value || 0);

      if (pkgCount === 0) {
        console.log("📝 Seeding pricing packages...");
        for (const p of fallback.packagesDb) {
          await db.insert(schema.packages).values({
            id: p.id,
            serviceId: p.serviceId,
            name: p.name,
            price: p.price,
            discountPrice: p.discountPrice || null,
            gstPercent: p.gstPercent || 18,
            features: p.features || [],
            displayOrder: p.displayOrder || 0,
            cta: p.cta || "Get Started",
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
          }).onConflictDoNothing();
        }
        console.log("✅ Packages seeded successfully.");
      }
    } catch (pkgErr) {
      console.warn("⚠️ Package seeding skipped:", pkgErr);
    }

    // 5. Check and Seed Blogs
    try {
      const blogCountResult = await db.select({ value: count() }).from(schema.blogs);
      const blogCount = Number(blogCountResult[0]?.value || 0);

      if (blogCount === 0) {
        console.log("📝 Seeding editorial blogs...");
        for (const b of fallback.blogsDb) {
          await db.insert(schema.blogs).values({
            id: b.id,
            title: b.title,
            category: b.category,
            excerpt: b.excerpt,
            content: b.content,
            featuredImage: b.featuredImage || "",
            status: b.status || "Published",
            seoTitle: b.seoTitle || b.title,
            seoDescription: b.seoDescription || b.excerpt,
            seoKeywords: b.seoKeywords || [],
            createdAt: new Date(b.createdAt),
            updatedAt: new Date(),
            isDeleted: false,
          }).onConflictDoNothing();
        }
        console.log("✅ Editorial blogs seeded successfully.");
      }
    } catch (blogErr) {
      console.warn("⚠️ Blog seeding skipped:", blogErr);
    }

    // 6. Check and Seed Client Logos
    try {
      const logoCountResult = await db.select({ value: count() }).from(schema.clientLogos);
      const logoCount = Number(logoCountResult[0]?.value || 0);

      if (logoCount === 0) {
        console.log("📝 Seeding initial client logos...");
        for (const logo of fallback.logosDb) {
          await db.insert(schema.clientLogos).values({
            id: logo.id,
            clientName: logo.clientName,
            imageUrl: logo.imageUrl,
            sortOrder: logo.sortOrder,
            status: logo.status || "Active",
            createdAt: new Date(),
            updatedAt: new Date()
          }).onConflictDoNothing();
        }
        console.log("✅ Client logos seeded successfully.");
      }
    } catch (logoErr) {
      console.warn("⚠️ Logo seeding skipped:", logoErr);
    }

    // 7. Check and Seed Homepage Sections
    try {
      const hpCountResult = await db.select({ value: count() }).from(schema.homepageSections);
      const hpCount = Number(hpCountResult[0]?.value || 0);

      if (hpCount === 0) {
        console.log("📝 Seeding default homepage sections...");
        await db.insert(schema.homepageSections).values({
          id: "hp-default",
          sectionKey: "homepage",
          title: fallback.homepageCmsDb.heroTitle,
          subtitle: fallback.homepageCmsDb.heroSub,
          badge: fallback.homepageCmsDb.heroBadge,
          content: fallback.homepageCmsDb,
          createdAt: new Date(),
          updatedAt: new Date()
        }).onConflictDoNothing();
        console.log("✅ Default homepage layout seeded successfully.");
      }
    } catch (hpErr) {
      console.warn("⚠️ Homepage section seeding skipped:", hpErr);
    }

    // 8. Check and Seed CMS Settings (Testimonials, Contact, Media, FAQs, Admin Settings)
    try {
      const defaultSettings = [
        { key: "testimonialsDb", value: fallback.testimonialsDb },
        { key: "contactInfoDb", value: fallback.contactInfoDb },
        { key: "adminSettingsDb", value: fallback.adminSettingsDb },
        { key: "mediaDb", value: fallback.mediaDb },
        { key: "faqsDb", value: fallback.faqsDb }
      ];

      for (const setting of defaultSettings) {
        const existing = await db.select().from(schema.cmsSettings).where(eq(schema.cmsSettings.key, setting.key)).limit(1);
        if (!existing || existing.length === 0) {
          await db.insert(schema.cmsSettings).values({
            id: `set-${setting.key}`,
            key: setting.key,
            value: setting.value,
            createdAt: new Date(),
            updatedAt: new Date()
          }).onConflictDoNothing();
        }
      }
      console.log("✅ CMS dynamic settings verified.");
    } catch (settingErr) {
      console.warn("⚠️ CMS settings seeding skipped:", settingErr);
    }

    console.log("✨ PostgreSQL Database verification & non-destructive seed completed.");
  } catch (error) {
    console.error("❌ Error during database seeding sequence (non-fatal):", error);
  }
}
