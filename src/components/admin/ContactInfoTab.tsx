/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Save, Phone, Mail, MapPin, Clock, Share2, Globe } from "lucide-react";
import { CmsContactInfo } from "../../data/adminStore.js";
import { Input } from "../Input.js";

interface ContactInfoTabProps {
  contactInfo: CmsContactInfo;
  onUpdateContact: (contact: CmsContactInfo) => void;
}

export default function ContactInfoTab({ contactInfo, onUpdateContact }: ContactInfoTabProps) {
  // Local form states
  const [phone, setPhone] = useState(contactInfo.phone);
  const [email, setEmail] = useState(contactInfo.email);
  const [address, setAddress] = useState(contactInfo.address);
  const [workingHours, setWorkingHours] = useState(contactInfo.workingHours);
  const [googleMapEmbedUrl, setGoogleMapEmbedUrl] = useState(contactInfo.googleMapEmbedUrl);
  const [socialFb, setSocialFb] = useState(contactInfo.socialFb);
  const [socialTw, setSocialTw] = useState(contactInfo.socialTw);
  const [socialIn, setSocialIn] = useState(contactInfo.socialIn);
  const [socialWa, setSocialWa] = useState(contactInfo.socialWa);

  const handleSave = () => {
    onUpdateContact({
      phone,
      email,
      address,
      workingHours,
      googleMapEmbedUrl,
      socialFb,
      socialTw,
      socialIn,
      socialWa
    });
    alert("Contact settings and enterprise directories saved. Edits are active live on public screens.");
  };

  return (
    <div className="space-y-6" id="contact-info-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            CONTACT CHANNELS CMS
          </h2>
          <p className="text-xs text-slate-500">Configure phone lines, official addresses, maps, working hours, and social media icons.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow flex items-center gap-1.5 cursor-pointer self-start"
        >
          <Save className="h-4 w-4" />
          <span>Save Contact Information</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: General Forms */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-brand-secondary-600" />
            Corporate Directory Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Primary Helpdesk Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              id="contact-phone"
            />
            <Input
              label="Primary Legal Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="contact-email"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans">
              Headquarters Postal Address *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="block w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-950 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-1 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-secondary-600" />
                Working Hours
              </h4>
              <Input
                label="Office Availability Schedule"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                id="contact-hours"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-1 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-brand-secondary-600" />
                Google Maps Embed Frame URL
              </h4>
              <input
                type="text"
                value={googleMapEmbedUrl}
                onChange={(e) => setGoogleMapEmbedUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none bg-white text-slate-950"
                placeholder="https://google.com/maps/embed?pb=..."
              />
            </div>
          </div>
        </div>

        {/* Right Side: Social links preview */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-5 h-fit">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-brand-secondary-600" />
            Social Engagement Channels
          </h3>

          <div className="space-y-4">
            <Input
              label="Facebook URL"
              placeholder="https://facebook.com/..."
              value={socialFb}
              onChange={(e) => setSocialFb(e.target.value)}
              id="social-fb"
            />
            <Input
              label="Twitter / X URL"
              placeholder="https://twitter.com/..."
              value={socialTw}
              onChange={(e) => setSocialTw(e.target.value)}
              id="social-tw"
            />
            <Input
              label="LinkedIn Corporate Profile"
              placeholder="https://linkedin.com/company/..."
              value={socialIn}
              onChange={(e) => setSocialIn(e.target.value)}
              id="social-in"
            />
            <Input
              label="WhatsApp Direct Chat"
              placeholder="https://wa.me/..."
              value={socialWa}
              onChange={(e) => setSocialWa(e.target.value)}
              id="social-wa"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
