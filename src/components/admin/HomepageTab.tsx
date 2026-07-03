/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Save, Sparkles, RefreshCcw, Home, BarChart2, Star, CheckSquare, MessageSquare, HelpCircle } from "lucide-react";
import { CmsHomepage } from "../../data/adminStore.js";
import { Input } from "../Input.js";

interface HomepageTabProps {
  homepageData: CmsHomepage;
  onUpdateHomepage: (data: CmsHomepage) => void;
}

export default function HomepageTab({ homepageData, onUpdateHomepage }: HomepageTabProps) {
  const [activeSection, setActiveSection] = useState<"hero" | "stats" | "why" | "cta">("hero");

  // Form states initialized with live props
  const [heroBadge, setHeroBadge] = useState(homepageData.heroBadge);
  const [heroTitle, setHeroTitle] = useState(homepageData.heroTitle);
  const [heroSub, setHeroSub] = useState(homepageData.heroSub);

  const [stat1Label, setStat1Label] = useState(homepageData.stat1Label);
  const [stat1Value, setStat1Value] = useState(homepageData.stat1Value);
  const [stat2Label, setStat2Label] = useState(homepageData.stat2Label);
  const [stat2Value, setStat2Value] = useState(homepageData.stat2Value);
  const [stat3Label, setStat3Label] = useState(homepageData.stat3Label);
  const [stat3Value, setStat3Value] = useState(homepageData.stat3Value);

  const [whyTitle, setWhyTitle] = useState(homepageData.whyTitle);
  const [whyDesc, setWhyDesc] = useState(homepageData.whyDesc);

  const [ctaTitle, setCtaTitle] = useState(homepageData.ctaTitle);
  const [ctaDesc, setCtaDesc] = useState(homepageData.ctaDesc);
  const [ctaButtonText, setCtaButtonText] = useState(homepageData.ctaButtonText);

  const handleSave = () => {
    onUpdateHomepage({
      heroBadge,
      heroTitle,
      heroSub,
      stat1Label,
      stat1Value,
      stat2Label,
      stat2Value,
      stat3Label,
      stat3Value,
      whyTitle,
      whyDesc,
      ctaTitle,
      ctaDesc,
      ctaButtonText
    });
    alert("Homepage CMS Configuration updated successfully! This config integrates live with public website sections.");
  };

  const handleReset = () => {
    if (window.confirm("Discard changes and restore initial homepage configuration?")) {
      setHeroBadge(homepageData.heroBadge);
      setHeroTitle(homepageData.heroTitle);
      setHeroSub(homepageData.heroSub);
      setStat1Label(homepageData.stat1Label);
      setStat1Value(homepageData.stat1Value);
      setStat2Label(homepageData.stat2Label);
      setStat2Value(homepageData.stat2Value);
      setStat3Label(homepageData.stat3Label);
      setStat3Value(homepageData.stat3Value);
      setWhyTitle(homepageData.whyTitle);
      setWhyDesc(homepageData.whyDesc);
      setCtaTitle(homepageData.ctaTitle);
      setCtaDesc(homepageData.ctaDesc);
      setCtaButtonText(homepageData.ctaButtonText);
    }
  };

  return (
    <div className="space-y-6" id="homepage-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            HOMEPAGE CMS CONFIGURATOR
          </h2>
          <p className="text-xs text-slate-500">Edit major content grids, hero copy, badges, and trust indicators.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 border border-slate-250 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-xs tracking-wide transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Internal CMS Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px">
        {[
          { id: "hero", label: "Hero Banner", icon: Home },
          { id: "stats", label: "Statistics Counters", icon: BarChart2 },
          { id: "why", label: "Why Choose Us", icon: Star },
          { id: "cta", label: "Call-To-Action (CTA)", icon: CheckSquare },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                isActive
                  ? "border-brand-secondary-500 text-brand-primary-950"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        {activeSection === "hero" && (
          <div className="space-y-5" id="sec-hero">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-secondary-500" />
              Primary Hero Section Content
            </h3>
            <div className="space-y-4">
              <Input
                label="Promo Badge Text"
                placeholder="e.g. INDIA'S PREMIUM PLATFORM"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                id="hero-badge"
              />
              <Input
                label="Main H1 Headline"
                placeholder="Ex. India's Smartest Legal & Company Filing Engine"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                id="hero-title"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans">
                  H1 Subtitle Paragraph
                </label>
                <textarea
                  value={heroSub}
                  onChange={(e) => setHeroSub(e.target.value)}
                  rows={4}
                  className="block w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === "stats" && (
          <div className="space-y-6" id="sec-stats">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4 text-brand-secondary-500" />
              Statistics Counters / Trust Builders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat 1 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-xs text-slate-500">Stat Card #1</div>
                <Input
                  label="Counter Value"
                  value={stat1Value}
                  onChange={(e) => setStat1Value(e.target.value)}
                  id="stat1-val"
                />
                <Input
                  label="Context / Label"
                  value={stat1Label}
                  onChange={(e) => setStat1Label(e.target.value)}
                  id="stat1-lbl"
                />
              </div>

              {/* Stat 2 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-xs text-slate-500">Stat Card #2</div>
                <Input
                  label="Counter Value"
                  value={stat2Value}
                  onChange={(e) => setStat2Value(e.target.value)}
                  id="stat2-val"
                />
                <Input
                  label="Context / Label"
                  value={stat2Label}
                  onChange={(e) => setStat2Label(e.target.value)}
                  id="stat2-lbl"
                />
              </div>

              {/* Stat 3 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-xs text-slate-500">Stat Card #3</div>
                <Input
                  label="Counter Value"
                  value={stat3Value}
                  onChange={(e) => setStat3Value(e.target.value)}
                  id="stat3-val"
                />
                <Input
                  label="Context / Label"
                  value={stat3Label}
                  onChange={(e) => setStat3Label(e.target.value)}
                  id="stat3-lbl"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === "why" && (
          <div className="space-y-5" id="sec-why">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Star className="h-4 w-4 text-brand-secondary-500" />
              Why Choose Us Section
            </h3>
            <div className="space-y-4">
              <Input
                label="Section H2 Title"
                value={whyTitle}
                onChange={(e) => setWhyTitle(e.target.value)}
                id="why-title"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans">
                  Description Paragraph
                </label>
                <textarea
                  value={whyDesc}
                  onChange={(e) => setWhyDesc(e.target.value)}
                  rows={4}
                  className="block w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === "cta" && (
          <div className="space-y-5" id="sec-cta">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-brand-secondary-500" />
              Bottom Call-To-Action (CTA) Grid
            </h3>
            <div className="space-y-4">
              <Input
                label="CTA Title"
                value={ctaTitle}
                onChange={(e) => setCtaTitle(e.target.value)}
                id="cta-title"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans">
                  CTA Pitch Subtext
                </label>
                <textarea
                  value={ctaDesc}
                  onChange={(e) => setCtaDesc(e.target.value)}
                  rows={3}
                  className="block w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none"
                />
              </div>
              <Input
                label="Button Anchor Text"
                value={ctaButtonText}
                onChange={(e) => setCtaButtonText(e.target.value)}
                id="cta-btn"
              />
            </div>
          </div>
        )}
      </div>

      {/* Trust Blocks & Other Placeholders for CMS Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Testimonials Link", desc: "Testimonials are fetched dynamically. Manage actual cards in the 'Testimonials' tab.", icon: MessageSquare },
          { title: "Client Partner Logos", desc: "Upload and sort client trust logos directly under the 'Client Logos' tab.", icon: BarChart2 },
          { title: "Global FAQ List", desc: "Control website FAQ matrices directly from the unified 'Global FAQ' tab.", icon: HelpCircle }
        ].map((box, index) => {
          const Icon = box.icon;
          return (
            <div key={index} className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200/60 shrink-0 text-brand-primary-950 h-9 w-9 flex items-center justify-center">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{box.title}</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-1">{box.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
