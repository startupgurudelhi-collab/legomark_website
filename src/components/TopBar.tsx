/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, Mail, Clock, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { websiteConfig, SocialLink } from "../config/websiteConfig.js";

// Helper to resolve icon from name string safely
export function SocialIcon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  switch (name) {
    case "Facebook":
      return <Facebook className={className} />;
    case "Twitter":
      return <Twitter className={className} />;
    case "LinkedIn":
      return <Linkedin className={className} />;
    case "Instagram":
      return <Instagram className={className} />;
    case "Youtube":
      return <Youtube className={className} />;
    default:
      return null;
  }
}

interface TopBarProps {
  id?: string;
}

export function TopBar({ id = "top-info-bar" }: TopBarProps) {
  const { phone, email, workingHours, socialLinks } = websiteConfig.topBar;

  return (
    <div
      className="bg-brand-primary-950 text-white border-b border-brand-primary-800/50 text-[11px] md:text-xs py-2 px-4 md:px-6 font-medium selection:bg-brand-secondary-600 selection:text-white"
      id={id}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Contact info group */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 md:gap-6">
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 hover:text-brand-secondary-300 transition-colors"
            id={`${id}-phone`}
          >
            <Phone className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" />
            <span>{phone}</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 hover:text-brand-secondary-300 transition-colors"
            id={`${id}-email`}
          >
            <Mail className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" />
            <span>{email}</span>
          </a>
          <div className="hidden md:flex items-center gap-1.5 text-slate-300" id={`${id}-hours`}>
            <Clock className="h-3.5 w-3.5 text-brand-secondary-500 shrink-0" />
            <span>{workingHours}</span>
          </div>
        </div>

        {/* Social Links & Info */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline md:hidden text-[10px] text-slate-300">{workingHours}</span>
          <div className="flex items-center gap-3" id={`${id}-socials`}>
            {socialLinks.map((link: SocialLink, idx: number) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
                className="text-slate-300 hover:text-brand-secondary-400 transition-colors p-0.5"
                id={`${id}-social-${link.name.toLowerCase()}`}
              >
                <SocialIcon name={link.icon} className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
