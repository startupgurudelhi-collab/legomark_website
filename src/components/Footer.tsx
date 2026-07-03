/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { websiteConfig, SocialLink } from "../config/websiteConfig.js";
import { SocialIcon } from "./TopBar.js";
import { useToast } from "../contexts/ToastContext.js";
import { useBrandMedia } from "../hooks/useBrandMedia.js";
import { useBooking } from "../hooks/useBooking.js";

interface FooterProps {
  id?: string;
}

export function Footer({ id = "main-footer" }: FooterProps) {
  const { config: brandConfig } = useBrandMedia();
  const [email, setEmail] = useState("");
  const toast = useToast();
  const { handleBookConsultation } = useBooking();

  const { aboutText, sections, contact, newsletter, bottomLinks, copyright } = websiteConfig.footer;
  const { socialLinks } = websiteConfig.topBar;

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.", "Subscription Failed");
      return;
    }
    toast.success("Thank you for subscribing to our legal updates!", "Subscribed Successfully");
    setEmail("");
  };

  return (
    <footer className="bg-brand-primary-950 text-slate-300 border-t border-brand-primary-900 pt-16 pb-8 font-sans" id={id}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-brand-primary-900">
          
          {/* About / Logo Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-0.5 border border-slate-150 shadow-sm">
                <img
                  key={brandConfig.logo.url}
                  src={brandConfig.logo.url || "/logo.png"}
                  alt="Legomark India Logo"
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = "true";
                      target.src = "/logo.png";
                    }
                  }}
                />
              </div>
              <div>
                <span className="font-display font-bold text-lg md:text-xl tracking-tight text-white group-hover:text-brand-secondary-400 transition-colors">
                  LEGOMARK
                </span>
                <span className="font-sans text-[10px] block tracking-widest text-slate-400 -mt-1 font-bold uppercase">
                  India
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {aboutText}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link: SocialLink, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg bg-brand-primary-900 border border-brand-primary-800/40 flex items-center justify-center text-slate-300 hover:bg-brand-secondary-500 hover:text-white hover:border-brand-secondary-500 transition-all"
                  title={link.name}
                  id={`${id}-social-${link.name.toLowerCase()}`}
                >
                  <SocialIcon name={link.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Link Sections (Company, Services, Quick Links) */}
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase border-b border-brand-primary-900 pb-1.5">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.label === "Book Free Consultation" ? (
                      <button
                        onClick={handleBookConsultation}
                        className="text-sm text-slate-400 hover:text-brand-secondary-400 hover:underline transition-colors block text-left w-full cursor-pointer"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-brand-secondary-400 hover:underline transition-colors block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase border-b border-brand-primary-900 pb-1.5">
              Contact Office
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-brand-secondary-500 shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2.5 hover:text-brand-secondary-400 transition-colors"
                >
                  <Phone className="h-4 w-4 text-brand-secondary-500 shrink-0" />
                  <span>{contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2.5 hover:text-brand-secondary-400 transition-colors"
                >
                  <Mail className="h-4 w-4 text-brand-secondary-500 shrink-0" />
                  <span>{contact.email}</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter, bottom links and legal block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10 pb-8 border-b border-brand-primary-900">
          
          {/* Newsletter Box */}
          <div className="lg:col-span-2 max-w-xl space-y-3">
            <h4 className="text-sm font-semibold text-white">{newsletter.title}</h4>
            <p className="text-xs text-slate-400">{newsletter.description}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md" id={`${id}-newsletter-form`}>
              <input
                type="email"
                placeholder={newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-brand-primary-900 border border-brand-primary-800 text-sm px-4 py-2 rounded-lg text-white placeholder-slate-500 outline-none focus:border-brand-secondary-500 flex-1"
                id={`${id}-newsletter-input`}
              />
              <button
                type="submit"
                className="bg-brand-secondary-500 text-white hover:bg-brand-secondary-600 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shrink-0"
                id={`${id}-newsletter-submit`}
              >
                <span>{newsletter.buttonText}</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {/* Mini Legal Information Block */}
          <div className="flex flex-col justify-end">
            <p className="text-xs leading-relaxed text-slate-500 italic">
              Disclaimer: Legomark India is a private legal consultancy. We are not a government agency and do not issue approvals directly.
            </p>
          </div>

        </div>

        {/* Bottom bar: Copyright & policies */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p id={`${id}-copyright`}>{copyright}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2" id={`${id}-bottom-links`}>
            {bottomLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.href}
                className="hover:text-slate-300 transition-colors hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
