/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import {
  Save,
  Settings,
  Globe,
  ShieldAlert,
  Mail,
  MessageSquare,
  CreditCard,
  Calendar,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Server,
  FileText,
  Upload,
  Trash2,
  Download,
  Eye,
  Image as ImageIcon,
  FileUp,
  AlertTriangle,
  FileCheck,
  Check,
  ArrowRight,
  Sparkles,
  Plus
} from "lucide-react";
import { AdminSettings } from "../../data/adminStore.js";
import { Input } from "../Input.js";
import { useBrandMedia } from "../../hooks/useBrandMedia.js";
import { useToast } from "../../contexts/ToastContext.js";
import { BrandMediaConfig, BrandAsset } from "../../types/brand.js";

interface SettingsTabProps {
  settings: AdminSettings;
  onUpdateSettings: (settings: AdminSettings) => void;
}

export default function SettingsTab({ settings, onUpdateSettings }: SettingsTabProps) {
  const toast = useToast();
  const { config: brandConfig, updateAsset, updateOfficeGallery, resetToDefaults } = useBrandMedia();

  // Active sub tab state: Gateways vs Brand Assets
  const [subTab, setSubTab] = useState<"integrations" | "branding">("branding");

  // Original Form states
  const [siteName, setSiteName] = useState(settings.siteName);
  const [seoMetaTitle, setSeoMetaTitle] = useState(settings.seoMetaTitle);
  const [seoMetaDescription, setSeoMetaDescription] = useState(settings.seoMetaDescription);
  const [smtpHost, setSmtpHost] = useState(settings.smtpHost);
  const [smtpPort, setSmtpPort] = useState(settings.smtpPort);
  const [smtpUser, setSmtpUser] = useState(settings.smtpUser);
  const [googleReviewsId, setGoogleReviewsId] = useState(settings.googleReviewsId);
  const [whatsAppNumber, setWhatsAppNumber] = useState(settings.whatsAppNumber);
  const [razorpayKeyId, setRazorpayKeyId] = useState(settings.razorpayKeyId);
  const [calendlyLink, setCalendlyLink] = useState(settings.calendlyLink);

  // Original states for diagnostics
  const [infraData, setInfraData] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const [commData, setCommData] = useState<any>(null);
  const [loadingComm, setLoadingComm] = useState(false);
  const [syncingReviews, setSyncingReviews] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const [triggeringCalendly, setTriggeringCalendly] = useState(false);

  const [securityData, setSecurityData] = useState<any>(null);
  const [loadingSecurity, setLoadingSecurity] = useState(false);

  // Hidden file inputs refs
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchEmailStatus = async () => {
    setLoadingStatus(true);
    try {
      const token = localStorage.getItem("efilingg_token");
      const res = await fetch("/api/email/status", {
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setInfraData(json.data);
      }
    } catch (err) {
      console.error("Failed to load email infrastructure settings:", err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchCommStatus = async () => {
    setLoadingComm(true);
    try {
      const token = localStorage.getItem("efilingg_token");
      const res = await fetch("/api/communication/status", {
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setCommData(json.data);
      }
    } catch (err) {
      console.error("Failed to load communication statuses:", err);
    } finally {
      setLoadingComm(false);
    }
  };

  const handleSyncReviews = async () => {
    setSyncingReviews(true);
    try {
      const token = localStorage.getItem("efilingg_token");
      const res = await fetch("/api/communication/reviews/sync", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Google Reviews Synced! Avg Rating: ${json.data.averageRating}`, "Reviews Synchronized");
        fetchCommStatus();
      } else {
        toast.error(json.message || "Failed to sync Google Reviews.", "Sync Failed");
      }
    } catch (err) {
      toast.error("Failed to reach reviews sync API.", "Connection Error");
    } finally {
      setSyncingReviews(false);
    }
  };

  const handleSendWhatsAppTest = async () => {
    const phoneNum = prompt("Enter mobile phone number to send a test message to (include country code, e.g., 919876543210):");
    if (!phoneNum) return;
    
    setSendingWhatsApp(true);
    try {
      const token = localStorage.getItem("efilingg_token");
      const res = await fetch("/api/communication/whatsapp/test", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token || ""}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: phoneNum,
          text: "Hello from Legomark India Communication Hub. This is an operational test message confirming active integration channels."
        })
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`WhatsApp test completed! Message ID: ${json.data.messageId}`, "WhatsApp Dispatched");
        fetchCommStatus();
      } else {
        toast.error(json.message || "WhatsApp dispatch failed.", "Dispatch Error");
      }
    } catch (err) {
      toast.error("Failed to reach WhatsApp test API.", "Connection Error");
    } finally {
      setSendingWhatsApp(false);
    }
  };

  const handleSimulateCalendlyBooking = async () => {
    const clientName = prompt("Enter client name for simulated Calendly booking:", "Vikram Malhotra");
    if (!clientName) return;
    const clientEmail = prompt("Enter client email for simulated booking:", "vikram@malhotratech.in");
    if (!clientEmail) return;

    setTriggeringCalendly(true);
    try {
      const token = localStorage.getItem("efilingg_token");
      const res = await fetch("/api/communication/calendly/test", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token || ""}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          service: "Company Incorporation",
          notes: "Need guidance on 2-director private limited setup in Delhi NCR"
        })
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Simulated Calendly booking registered! acknowledgement notifications dispatched.`, "Booking Simulated");
        fetchCommStatus();
      } else {
        toast.error(json.message || "Failed to create simulated booking.", "Booking Error");
      }
    } catch (err) {
      toast.error("Failed to reach Calendly test API.", "Connection Error");
    } finally {
      setTriggeringCalendly(false);
    }
  };

  const fetchSecurityStats = async () => {
    setLoadingSecurity(true);
    try {
      const token = localStorage.getItem("efilingg_token");
      const res = await fetch("/api/auth/admin/security-stats", {
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setSecurityData(json.data);
      }
    } catch (err) {
      console.error("Failed to load admin security stats:", err);
    } finally {
      setLoadingSecurity(false);
    }
  };

  const runConnectionTest = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const token = localStorage.getItem("efilingg_token");
      const res = await fetch("/api/email/test-smtp", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token || ""}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ smtpHost, smtpPort, smtpUser })
      });
      const json = await res.json();
      setTestResult({
        success: json.success,
        message: json.message || (json.success ? "SMTP connection handshaking accomplished successfully!" : "Socket handshaking rejected.")
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: "Network fault. Failed to contact SMTP diagnostic server."
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const triggerRetry = async (logId: string) => {
    setRetryingId(logId);
    try {
      const token = localStorage.getItem("efilingg_token");
      const res = await fetch(`/api/email/retry/${logId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Mail log ${logId} requeued and dispatched successfully!`, "Re-sending Outbound Mail");
        fetchEmailStatus();
      } else {
        toast.error(json.message || "Failed to dispatch retry.", "Dispatch Error");
      }
    } catch (err) {
      toast.error("Network fault during retry command.", "Connection Error");
    } finally {
      setRetryingId(null);
    }
  };

  const handleRevokeSession = async (sessId: string) => {
    if (!confirm("Are you sure you want to revoke this session? The device will be signed out instantly.")) return;
    try {
      const token = localStorage.getItem("efilingg_token");
      const res = await fetch(`/api/auth/admin/revoke-session/${sessId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Device session revoked successfully.", "Security Cleared");
        fetchSecurityStats();
      } else {
        toast.error(json.message || "Failed to revoke session.", "Security Action Rejected");
      }
    } catch (err) {
      toast.error("Network fault during revocation command.", "Connection Error");
    }
  };

  const handleSave = async () => {
    const updated: AdminSettings = {
      ...settings,
      siteName,
      seoMetaTitle,
      seoMetaDescription,
      smtpHost,
      smtpPort,
      smtpUser,
      googleReviewsId,
      whatsAppNumber,
      razorpayKeyId,
      calendlyLink
    };

    try {
      const token = localStorage.getItem("efilingg_token");
      const res = await fetch("/api/cms/settings", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token || ""}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updated)
      });
      const json = await res.json();
      if (json.success) {
        onUpdateSettings(updated);
        toast.success("All platform keys and SMTP properties persisted on the server.", "Save Accomplished");
      } else {
        toast.error(json.message || "Failed to persist settings on the server.", "Save Failed");
      }
    } catch (err) {
      console.error("Failed to save settings to backend:", err);
      onUpdateSettings(updated);
      toast.success("All platform keys and SMTP properties saved locally.", "Save Accomplished");
    }
  };

  useEffect(() => {
    if (settings) {
      if (settings.siteName !== undefined) setSiteName(settings.siteName);
      if (settings.seoMetaTitle !== undefined) setSeoMetaTitle(settings.seoMetaTitle);
      if (settings.seoMetaDescription !== undefined) setSeoMetaDescription(settings.seoMetaDescription);
      if (settings.smtpHost !== undefined) setSmtpHost(settings.smtpHost);
      if (settings.smtpPort !== undefined) setSmtpPort(settings.smtpPort);
      if (settings.smtpUser !== undefined) setSmtpUser(settings.smtpUser);
      if (settings.googleReviewsId !== undefined) setGoogleReviewsId(settings.googleReviewsId);
      if (settings.whatsAppNumber !== undefined) setWhatsAppNumber(settings.whatsAppNumber);
      if (settings.razorpayKeyId !== undefined) setRazorpayKeyId(settings.razorpayKeyId);
      if (settings.calendlyLink !== undefined) setCalendlyLink(settings.calendlyLink);
    }
  }, [settings]);

  useEffect(() => {
    fetchEmailStatus();
    fetchCommStatus();
    fetchSecurityStats();
  }, []);

  // BRAND & MEDIA FILE VALIDATION & BASE64 PARSER
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, key: keyof BrandMediaConfig, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate extension
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isLogo = key === 'logo';
    const isDoc = key === 'companyProfile' || key === 'companyBrochure';

    const allowedImgExts = ['png', 'jpg', 'jpeg', 'webp'];
    const allowedLogoExts = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
    const allowedDocExts = ['pdf'];

    if (isLogo) {
      if (!allowedLogoExts.includes(extension)) {
        toast.error("Allowed logo formats: PNG, JPG, JPEG, SVG, WEBP", "Invalid File Type");
        return;
      }
    } else if (isDoc) {
      if (!allowedDocExts.includes(extension)) {
        toast.error("Allowed document formats: PDF only", "Invalid File Type");
        return;
      }
    } else {
      if (!allowedImgExts.includes(extension)) {
        toast.error("Allowed image formats: PNG, JPG, JPEG, WEBP", "Invalid File Type");
        return;
      }
    }

    // Validate size (max 5MB for images, 15MB for documents)
    const maxSize = isDoc ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const displayMax = isDoc ? "15MB" : "5MB";
      toast.error(`File size exceeds limit. Maximum allowed size is ${displayMax}`, "File Too Large");
      return;
    }

    // Convert file to Base64 to store in localStorage (simulating database/cloud persistence fallback)
    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      const sizeFormatted = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      const updatedAsset: BrandAsset = {
        url: base64Url,
        fileName: file.name,
        fileSize: sizeFormatted,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      if (key === 'officeGallery') {
        if (typeof index === 'number') {
          // Replace specific item
          const updatedGallery = [...brandConfig.officeGallery];
          updatedGallery[index] = updatedAsset;
          updateOfficeGallery(updatedGallery);
          toast.success("Gallery slot replaced successfully!", "Branding Updated");
        } else {
          // Add new item
          const updatedGallery = [...brandConfig.officeGallery, updatedAsset];
          updateOfficeGallery(updatedGallery);
          toast.success("Asset appended to Office Showcase Gallery!", "Branding Updated");
        }
      } else {
        updateAsset(key, updatedAsset);
        toast.success(`${file.name} registered as corporate active asset.`, "Branding Updated");
      }
    };

    reader.onerror = () => {
      toast.error("An error occurred while reading the file stream.", "Read Error");
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAsset = (key: keyof BrandMediaConfig, index?: number) => {
    if (key === 'officeGallery' && typeof index === 'number') {
      const updatedGallery = brandConfig.officeGallery.filter((_, idx) => idx !== index);
      updateOfficeGallery(updatedGallery);
      toast.info("Image item ejected from gallery matrix.", "Asset Revoked");
    } else {
      updateAsset(key, null); // passing null resets it to DEFAULT fallback inside the hook
      toast.info(`Asset reset to corporate default placeholder.`, "Asset Restored");
    }
  };

  const triggerFileInputClick = (key: string, index?: number) => {
    const inputId = typeof index === 'number' ? `${key}-${index}` : key;
    const inputElement = fileInputRefs.current[inputId];
    if (inputElement) {
      inputElement.click();
    }
  };

  return (
    <div className="space-y-6" id="settings-tab-view">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Settings className="h-4.5 w-4.5 text-brand-secondary-600" />
            CONSOLE CONFIGURATIONS
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage global corporate branding, email transmission pathways, and integrations.</p>
        </div>
        
        {subTab === "integrations" ? (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Save className="h-4 w-4" />
            <span>Save Console Settings</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (confirm("Reset all branding assets back to official default layouts?")) {
                resetToDefaults();
                toast.success("All assets restored to high-fidelity defaults.", "Settings Cleared");
              }
            }}
            className="px-4 py-2 border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs tracking-wide transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Restore Branding Defaults</span>
          </button>
        )}
      </div>

      {/* SUB TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setSubTab("branding")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            subTab === "branding"
              ? "border-brand-secondary-500 text-slate-900 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Brand & Media Management
        </button>
        <button
          onClick={() => setSubTab("integrations")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            subTab === "integrations"
              ? "border-brand-secondary-500 text-slate-900 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Gateways & Infrastructure
        </button>
      </div>

      {/* SUB TAB CONTENT 1: GATEWAYS & INFRASTRUCTURE */}
      {subTab === "integrations" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Left main forms columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Metadata */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-150 flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-brand-secondary-600" />
                General Platform Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Site Display Name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  id="site-name"
                />
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Default Brand Logo URL</label>
                  <input
                    type="text"
                    value={brandConfig.logo.url}
                    disabled
                    className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 rounded-lg text-slate-500 select-all"
                  />
                </div>
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-150 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-brand-secondary-600" />
                Global SEO Parameters
              </h3>

              <div className="space-y-4">
                <Input
                  label="Default Meta Search Title"
                  value={seoMetaTitle}
                  onChange={(e) => setSeoMetaTitle(e.target.value)}
                  id="site-seo-title"
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans">
                    Default Meta Search Description
                  </label>
                  <textarea
                    value={seoMetaDescription}
                    onChange={(e) => setSeoMetaDescription(e.target.value)}
                    rows={3}
                    className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-950 focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Centralized Email Transmission Hub */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-6" id="smtp-transmission-hub">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-150 gap-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-brand-secondary-600" />
                  SMTP Transmission Hub & Email Infrastructure
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={fetchEmailStatus}
                    disabled={loadingStatus}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded transition cursor-pointer"
                    title="Reload Queue Status"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingStatus ? "animate-spin" : ""}`} />
                  </button>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    infraData?.smtpConfig?.isConfigured 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" 
                      : "bg-amber-50 text-amber-700 border border-amber-200/50"
                  }`}>
                    {infraData?.smtpConfig?.isConfigured ? "SMTP ACTIVE" : "SIMULATOR ACTIVE"}
                  </span>
                </div>
              </div>

              {/* Config & Diagnostics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Config & Sender Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    SMTP & Sender Information
                  </h4>
                  
                  <div className="space-y-3 text-xs bg-slate-50/50 p-4 rounded-lg border border-slate-200/50">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Outbound Host:</span>
                      <span className="font-mono text-slate-800 font-semibold">{infraData?.smtpConfig?.host || smtpHost || "smtp.sendgrid.net"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SMTP Port:</span>
                      <span className="font-mono text-slate-800 font-semibold">{infraData?.smtpConfig?.port || smtpPort || "587"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SMTP Username:</span>
                      <span className="font-mono text-slate-800 font-semibold truncate max-w-[200px]">{infraData?.smtpConfig?.user || smtpUser || "Unconfigured"}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200/50 pt-2 mt-2">
                      <span className="text-slate-500">Sender Identity:</span>
                      <span className="text-slate-800 font-semibold">{infraData?.smtpConfig?.from || "info@legomarkindia.com"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <Input
                        label="Edit SMTP Outbound Server"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        id="smtp-host"
                      />
                    </div>
                    <Input
                      label="Edit Port"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      id="smtp-port"
                    />
                  </div>
                  <Input
                    label="Edit SMTP Username"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    id="smtp-user"
                  />
                </div>

                {/* Connection Diagnostics */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    SMTP Socket Handshake Diagnostics
                  </h4>
                  
                  <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-200/50 space-y-4 font-sans">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Test the active SMTP credentials by initiating a secure hand-shaking verification test against the configured outbound endpoint.
                    </p>

                    <button
                      onClick={runConnectionTest}
                      disabled={testingConnection}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {testingConnection ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Verifying Server Connection...</span>
                        </>
                      ) : (
                        <>
                          <Server className="h-3.5 w-3.5" />
                          <span>Run SMTP Connection Test</span>
                        </>
                      )}
                    </button>

                    {testResult && (
                      <div className={`p-3 rounded-lg text-xs border ${
                        testResult.success 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      } flex gap-2 items-start animate-fade-in`}>
                        {testResult.success ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold">{testResult.success ? "Connection Active" : "Handshake Failed"}</p>
                          <p className="text-[11px] opacity-90 mt-0.5">{testResult.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Email Queue Status Bento */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Outbound Email Queue Status
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/40 text-center">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Total Logged</span>
                    <span className="text-lg font-bold text-slate-900">{infraData?.stats?.total ?? 0}</span>
                  </div>
                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-center">
                    <span className="block text-[10px] font-bold text-amber-600 uppercase">Pending</span>
                    <span className="text-lg font-bold text-amber-700">{infraData?.stats?.pending ?? 0}</span>
                  </div>
                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-center">
                    <span className="block text-[10px] font-bold text-blue-600 uppercase">Sending</span>
                    <span className="text-lg font-bold text-blue-700">{infraData?.stats?.sending ?? 0}</span>
                  </div>
                  <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 text-center">
                    <span className="block text-[10px] font-bold text-emerald-600 uppercase">Delivered</span>
                    <span className="text-lg font-bold text-emerald-700">{infraData?.stats?.delivered ?? 0}</span>
                  </div>
                  <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-100 text-center">
                    <span className="block text-[10px] font-bold text-rose-600 uppercase">Failed</span>
                    <span className="text-lg font-bold text-rose-700">{infraData?.stats?.failed ?? 0}</span>
                  </div>
                  <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-center">
                    <span className="block text-[10px] font-bold text-indigo-600 uppercase">Retry Pending</span>
                    <span className="text-lg font-bold text-indigo-700">{infraData?.stats?.retry ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* Outbound Logs Table */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Recent Queue Records
                </h4>

                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[250px] overflow-y-auto">
                  <table className="w-full text-xs text-left text-slate-500 border-collapse">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-600 uppercase sticky top-0 z-10 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">ID</th>
                        <th className="px-4 py-2.5">Recipient</th>
                        <th className="px-4 py-2.5">Subject / Template</th>
                        <th className="px-4 py-2.5 text-center">Attempts</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 bg-white">
                      {(!infraData?.recentLogs || infraData.recentLogs.length === 0) ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                            No records found in the outbound transmission logs.
                          </td>
                        </tr>
                      ) : (
                        infraData.recentLogs.map((item: any) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2.5 font-mono font-bold text-slate-800">{item.id}</td>
                            <td className="px-4 py-2.5 text-slate-900 truncate max-w-[150px]">{item.recipient}</td>
                            <td className="px-4 py-2.5">
                              <div className="font-semibold text-slate-800 truncate max-w-[200px]">{item.subject}</div>
                              <div className="text-[10px] text-slate-400">{item.templateName}</div>
                            </td>
                            <td className="px-4 py-2.5 text-center font-mono font-bold">{item.attempts} / 3</td>
                            <td className="px-4 py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.status === "Delivered" 
                                  ? "bg-emerald-50 text-emerald-700" 
                                  : item.status === "Failed"
                                  ? "bg-rose-50 text-rose-700"
                                  : item.status === "Pending"
                                  ? "bg-amber-50 text-amber-700"
                                  : item.status === "Sending"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-indigo-50 text-indigo-700"
                              }`}>
                                {item.status.toUpperCase()}
                              </span>
                              {item.error && (
                                <div className="text-[10px] text-rose-600 mt-0.5 truncate max-w-[180px]" title={item.error}>
                                  {item.error}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              {(item.status === "Failed" || item.status === "Retry") && (
                                <button
                                  onClick={() => triggerRetry(item.id)}
                                  disabled={retryingId === item.id}
                                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold disabled:bg-slate-300 transition-all cursor-pointer flex items-center gap-1 ml-auto"
                                >
                                  {retryingId === item.id ? (
                                    <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                                  ) : (
                                    <Send className="h-2.5 w-2.5" />
                                  )}
                                  <span>Retry</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Security Hardening & Session Monitoring Dashboard */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-6" id="security-hardening-dashboard">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-150 gap-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                  <ShieldAlert className="h-4 w-4 text-rose-600 animate-pulse" />
                  Security Hardening & Live Audit Log
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={fetchSecurityStats}
                    disabled={loadingSecurity}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded transition cursor-pointer"
                    title="Refresh Security Telemetry"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingSecurity ? "animate-spin" : ""}`} />
                  </button>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/50">
                    SHIELD ACTIVE
                  </span>
                </div>
              </div>

              {/* Micro-metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Sessions</span>
                  <span className="text-2xl font-extrabold text-slate-900 font-sans mt-1">
                    {securityData?.activeSessionCount ?? 1}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">Failed Logins</span>
                  <span className="text-2xl font-extrabold text-amber-600 font-sans mt-1">
                    {securityData?.failedLoginCount ?? 0}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">Locked Accounts</span>
                  <span className="text-2xl font-extrabold text-rose-600 font-sans mt-1">
                    {securityData?.lockedAccountCount ?? 0}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">Reset Requests</span>
                  <span className="text-2xl font-extrabold text-indigo-600 font-sans mt-1">
                    {securityData?.pwdResetCount ?? 0}
                  </span>
                </div>
              </div>

              {/* Multi-Device Active Sessions List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                  Multi-Device Active Sessions
                </h4>
                <div className="border border-slate-150 rounded-lg overflow-hidden bg-slate-50/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-150 text-slate-500 font-bold">
                          <th className="px-4 py-2">User Account</th>
                          <th className="px-4 py-2">IP Address</th>
                          <th className="px-4 py-2">Device & User-Agent</th>
                          <th className="px-4 py-2">Last Access</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 bg-white">
                        {(!securityData?.activeSessions || securityData.activeSessions.length === 0) ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-medium">
                              No active third-party sessions found.
                            </td>
                          </tr>
                        ) : (
                          securityData.activeSessions.map((sess: any) => (
                            <tr key={sess.id} className="hover:bg-slate-50/30">
                              <td className="px-4 py-2.5 font-semibold text-slate-800">
                                <div>{sess.fullName || "User Profile"}</div>
                                <div className="text-[10px] text-slate-400 font-normal">{sess.email}</div>
                              </td>
                              <td className="px-4 py-2.5 font-mono font-medium text-slate-600">{sess.ipAddress}</td>
                              <td className="px-4 py-2.5 text-slate-500 truncate max-w-[180px]" title={sess.userAgent}>
                                {sess.userAgent}
                              </td>
                              <td className="px-4 py-2.5 text-slate-500 font-medium">
                                {new Date(sess.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <button
                                  onClick={() => handleRevokeSession(sess.id)}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 rounded font-bold text-[10px] transition cursor-pointer"
                                >
                                  Revoke Device
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Live Security Audit Log Logs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                  Live Audit Logs
                </h4>
                <div className="border border-slate-150 rounded-lg overflow-hidden bg-slate-50/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-150 text-slate-500 font-bold">
                          <th className="px-4 py-2 font-sans">Timestamp</th>
                          <th className="px-4 py-2 font-sans">User / Target</th>
                          <th className="px-4 py-2 font-sans">Security Event</th>
                          <th className="px-4 py-2 font-sans">IP & Device</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 bg-white font-mono text-[11px]">
                        {(!securityData?.recentAudits || securityData.recentAudits.length === 0) ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-slate-400 font-medium font-sans">
                              No security audit logs captured yet.
                            </td>
                          </tr>
                        ) : (
                          securityData.recentAudits.map((log: any) => (
                            <tr key={log.id} className="hover:bg-slate-50/30">
                              <td className="px-4 py-2 text-slate-400">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </td>
                              <td className="px-4 py-2 text-slate-800 font-semibold font-sans">{log.email}</td>
                              <td className="px-4 py-2 font-sans">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  log.event.includes("SUCCESS") 
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" 
                                    : log.event.includes("FAILED") || log.event.includes("BLOCKED")
                                    ? "bg-rose-50 text-rose-700 border border-rose-200/50"
                                    : "bg-indigo-50 text-indigo-700 border border-indigo-200/50"
                                }`}>
                                  {log.event}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-slate-500 truncate max-w-[150px]" title={`${log.ipAddress} | ${log.userAgent}`}>
                                {log.ipAddress}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Google Reviews, WhatsApp, Razorpay, Calendly */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-6 h-fit text-slate-700">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-150 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-brand-secondary-600" />
              Gateway & Integration Keys
            </h3>

            <div className="space-y-5">
              {/* Google Reviews */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-amber-500" />
                    Google Reviews Sync
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    commData?.googleReviews?.isConfigured 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-amber-50 text-amber-700 border border-amber-200/30"
                  }`}>
                    {commData?.googleReviews?.status || "SIMULATOR ACTIVE"}
                  </span>
                </div>
                <Input
                  label="Place ID / Account Key"
                  value={googleReviewsId}
                  onChange={(e) => setGoogleReviewsId(e.target.value)}
                  id="rev-id"
                />
                <button
                  type="button"
                  onClick={handleSyncReviews}
                  disabled={syncingReviews}
                  className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${syncingReviews ? "animate-spin" : ""}`} />
                  <span>Sync Google Reviews</span>
                </button>
              </div>

              {/* WhatsApp */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold text-sm">💬</span>
                    WhatsApp API Gateway
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    commData?.whatsapp?.isConfigured 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}>
                    {commData?.whatsapp?.status || "SIMULATOR MODE"}
                  </span>
                </div>
                <Input
                  label="Registered Business Number"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  id="wa-num"
                />
                <button
                  type="button"
                  onClick={handleSendWhatsAppTest}
                  disabled={sendingWhatsApp}
                  className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Send className="h-3 w-3 text-slate-500" />
                  <span>Send WhatsApp Test Alert</span>
                </button>
              </div>

              {/* Razorpay */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  Razorpay Checkout Portal
                </div>
                <Input
                  label="Razorpay API Key ID"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value)}
                  id="razorpay-id"
                />
              </div>

              {/* Calendly */}
              <div className="space-y-2 pb-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-brand-primary-950" />
                    Calendly Booking API
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    commData?.calendly?.isConfigured 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}>
                    {commData?.calendly?.status || "SIMULATION ACTIVE"}
                  </span>
                </div>
                <Input
                  label="Consultation Booking Link"
                  value={calendlyLink}
                  onChange={(e) => setCalendlyLink(e.target.value)}
                  id="calendly-link"
                />
                <button
                  type="button"
                  onClick={handleSimulateCalendlyBooking}
                  disabled={triggeringCalendly}
                  className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Clock className="h-3 w-3 text-slate-500" />
                  <span>Simulate Calendly Callback</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB CONTENT 2: BRAND & MEDIA MANAGEMENT */}
      {subTab === "branding" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* SECTION 1: Brand Assets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-150 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-brand-secondary-600" />
                Section 1: Core Corporate Visual Assets
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold">Max file size: 5MB</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Asset Card Generator Helper */}
              {([
                { key: "logo", label: "Company Logo", desc: "Official transparent header/footer logo.", accept: ".png,.jpg,.jpeg,.svg,.webp" },
                { key: "favicon", label: "Website Favicon", desc: "Browser bookmark icon (ICO / PNG / WEBP).", accept: ".png,.jpg,.jpeg,.webp" },
                { key: "founderPhoto", label: "Founder Photo", desc: "Nomaan Rizvi portrait on Homepage/About.", accept: ".png,.jpg,.jpeg,.webp" },
                { key: "officeMain", label: "Office Main Image", desc: "Corporate operations premises hub photo.", accept: ".png,.jpg,.jpeg,.webp" },
                { key: "defaultServiceBanner", label: "Default Service Banner", desc: "Top header background on services listing.", accept: ".png,.jpg,.jpeg,.webp" },
                { key: "defaultBlogBanner", label: "Default Blog Banner", desc: "Top header background on individual blogs.", accept: ".png,.jpg,.jpeg,.webp" },
                { key: "careerBanner", label: "Career Page Banner", desc: "Corporate lifestyle cover photo on Career page.", accept: ".png,.jpg,.jpeg,.webp" },
                { key: "testimonialThumbnail", label: "Testimonial Thumbnail", desc: "Fallback thumbnail for reviewer photos.", accept: ".png,.jpg,.jpeg,.webp" }
              ] as const).map((assetItem) => {
                const asset: BrandAsset = (brandConfig as any)[assetItem.key];
                return (
                  <div key={assetItem.key} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between" id={`asset-card-${assetItem.key}`}>
                    
                    {/* Preview box */}
                    <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-center aspect-[16/9] relative group">
                      {asset?.url ? (
                        <img
                          src={asset.url}
                          alt={assetItem.label}
                          className="max-h-full max-w-full object-contain rounded shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-slate-400 font-medium">
                          <ImageIcon className="h-8 w-8 opacity-40 mb-1" />
                          <span className="text-[10px] uppercase font-bold tracking-wider">No Asset Uploaded</span>
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[9px] px-2 py-0.5 rounded font-mono select-none">
                        {assetItem.key === "logo" ? "SVG Support" : "Raster Only"}
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 font-display">{assetItem.label}</h4>
                        <p className="text-[10px] text-slate-500 leading-normal">{assetItem.desc}</p>
                        
                        {asset && (
                          <div className="bg-slate-50 p-2 rounded border border-slate-100 space-y-1 font-mono text-[9px] text-slate-500 mt-2">
                            <div className="flex justify-between">
                              <span className="font-sans">Name:</span>
                              <span className="font-semibold text-slate-700 truncate max-w-[150px]">{asset.fileName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-sans">Size:</span>
                              <span className="font-semibold text-slate-700">{asset.fileSize}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-sans">Updated:</span>
                              <span className="font-semibold text-slate-700">{asset.lastUpdated}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        {/* Hidden input */}
                        <input
                          type="file"
                          ref={(el) => { fileInputRefs.current[assetItem.key] = el; }}
                          onChange={(e) => handleFileUpload(e, assetItem.key)}
                          accept={assetItem.accept}
                          className="hidden"
                        />
                        
                        {!asset?.url || asset.url.startsWith('/') ? (
                          <button
                            onClick={() => triggerFileInputClick(assetItem.key)}
                            className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-[10px] tracking-wide transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Upload className="h-3 w-3" />
                            <span>Upload</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => triggerFileInputClick(assetItem.key)}
                              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold rounded text-[10px] tracking-wide transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="h-3 w-3 text-slate-500" />
                              <span>Replace</span>
                            </button>
                            <button
                              onClick={() => handleRemoveAsset(assetItem.key)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg transition cursor-pointer"
                              title="Reset/Remove Custom Asset"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>

          {/* OFFICE SHOWCASE MULTIPLE IMAGES GALLERY SLOT */}
          <div className="space-y-4 bg-slate-50/50 p-6 rounded-xl border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-brand-secondary-600" />
                  Office Showcase Gallery
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Upload multiple visual snapshots displaying campus lifestyle, lounge, or corporate infrastructure.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={(el) => { fileInputRefs.current["officeGallery-add"] = el; }}
                  onChange={(e) => handleFileUpload(e, "officeGallery")}
                  accept=".png,.jpg,.jpeg,.webp"
                  className="hidden"
                />
                <button
                  onClick={() => triggerFileInputClick("officeGallery-add")}
                  className="px-3 py-1.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-extrabold rounded-lg text-[10px] tracking-wider transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Snap to Gallery</span>
                </button>
              </div>
            </div>

            {brandConfig.officeGallery.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-slate-200 bg-white rounded-xl text-slate-400 text-xs font-medium">
                No custom office snaps populated. Standard campus workplace is fallback.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {brandConfig.officeGallery.map((snap, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between group relative shadow-xs">
                    
                    <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                      <img
                        src={snap.url}
                        alt={`Gallery snapshot ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="p-3 space-y-2">
                      <div className="font-mono text-[9px] text-slate-500 space-y-0.5">
                        <p className="text-slate-800 font-semibold truncate max-w-[120px] font-sans text-[10px]">{snap.fileName}</p>
                        <p>Size: {snap.fileSize}</p>
                        <p>Date: {snap.lastUpdated}</p>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
                        <input
                          type="file"
                          ref={(el) => { fileInputRefs.current[`officeGallery-${idx}`] = el; }}
                          onChange={(e) => handleFileUpload(e, "officeGallery", idx)}
                          accept=".png,.jpg,.jpeg,.webp"
                          className="hidden"
                        />
                        <button
                          onClick={() => triggerFileInputClick(`officeGallery-${idx}`)}
                          className="flex-grow py-1 bg-slate-50 hover:bg-slate-100 border border-slate-250 text-slate-700 font-bold rounded text-[9px] tracking-wide transition cursor-pointer"
                        >
                          Replace
                        </button>
                        <button
                          onClick={() => handleRemoveAsset("officeGallery", idx)}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded border border-rose-200 transition cursor-pointer"
                          title="Eject Image"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: Company Documents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-150 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-brand-secondary-600" />
                Section 2: Legal Corporate Profiles & Brochure Documents (PDF Only)
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold">Max file size: 15MB</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Document profile brochure generator */}
              {([
                { key: "companyProfile", label: "Company Profile Document (PDF)", desc: "Corporate credentials profile including compliance certifications." },
                { key: "companyBrochure", label: "Company Brochure / Catalog (PDF)", desc: "Corporate prospectus describing company formation and compliance pricing overlays." }
              ] as const).map((docItem) => {
                const doc: BrandAsset = (brandConfig as any)[docItem.key];
                return (
                  <div key={docItem.key} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow relative" id={`document-card-${docItem.key}`}>
                    <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl shrink-0 mt-1">
                      <FileText className="h-6 w-6" />
                    </div>

                    <div className="space-y-2.5 flex-1 min-w-0">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 font-display">{docItem.label}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{docItem.desc}</p>
                      </div>

                      {doc && (
                        <div className="bg-slate-50/50 p-2.5 rounded border border-slate-150 font-mono text-[9px] text-slate-500 space-y-1">
                          <div className="flex justify-between">
                            <span className="font-sans">File Name:</span>
                            <span className="font-semibold text-slate-700 truncate max-w-[180px]">{doc.fileName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-sans">File Size:</span>
                            <span className="font-semibold text-slate-700">{doc.fileSize}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-sans">Last Updated:</span>
                            <span className="font-semibold text-slate-700">{doc.lastUpdated}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        {/* Hidden input */}
                        <input
                          type="file"
                          ref={(el) => { fileInputRefs.current[docItem.key] = el; }}
                          onChange={(e) => handleFileUpload(e, docItem.key)}
                          accept=".pdf"
                          className="hidden"
                        />
                        
                        {doc?.url && doc.url !== "#" && doc.url !== "#profile" && doc.url !== "#brochure" ? (
                          <a
                            href={doc.url}
                            download={doc.fileName}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-[10px] flex items-center gap-1 tracking-wider cursor-pointer"
                          >
                            <Download className="h-3 w-3" />
                            <span>Download</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              toast.info("Downloading official pre-packaged prospectus blueprint.", "File Download");
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-250 font-bold rounded text-[10px] flex items-center gap-1 tracking-wider cursor-pointer"
                          >
                            <Download className="h-3 w-3 text-slate-500" />
                            <span>Download Pre-Packaged</span>
                          </button>
                        )}

                        <button
                          onClick={() => triggerFileInputClick(docItem.key)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-800 font-bold rounded text-[10px] flex items-center gap-1 tracking-wider cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3 text-slate-500" />
                          <span>Replace</span>
                        </button>

                        <button
                          onClick={() => handleRemoveAsset(docItem.key)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg transition cursor-pointer"
                          title="Reset to pre-packaged document"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
