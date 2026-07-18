/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  FileText,
  FolderHeart,
  Users,
  MessageSquare,
  Award,
  HelpCircle,
  Share2,
  Menu,
  Folder,
  Settings,
  LogOut,
  Bell,
  Search,
  Sun,
  Moon,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  ShoppingBag,
  Receipt,
  Kanban,
  Cpu
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext.js";
import { useToast } from "../contexts/ToastContext.js";

// Import synchronized models and localState helpers
import {
  getStoredState,
  setStoredState,
  initialLeads,
  initialBlogPosts,
  initialTestimonials,
  initialClientLogos,
  initialGlobalFaqs,
  initialMediaFiles,
  initialCmsHomepage,
  initialCmsContactInfo,
  initialHeaderMenu,
  initialAdminSettings,
  AdminLead,
  AdminBlogPost,
  AdminTestimonial,
  AdminClientLogo,
  AdminFaq,
  MediaFile,
  CmsHomepage,
  CmsContactInfo,
  MenuItem,
  AdminSettings as SettingsType,
  AdminOrder,
  initialOrders,
  AdminTask,
  initialTasks,
  AdminPackage
} from "../data/adminStore.js";

// Import individual CMS panels
import DashboardTab from "../components/admin/DashboardTab.js";
import LeadsTab from "../components/admin/LeadsTab.js";
import OrdersTab from "../components/admin/OrdersTab.js";
import HomepageTab from "../components/admin/HomepageTab.js";
import ServicesTab from "../components/admin/ServicesTab.js";
import BlogsTab from "../components/admin/BlogsTab.js";
import TestimonialsTab from "../components/admin/TestimonialsTab.js";
import LogosTab from "../components/admin/LogosTab.js";
import FaqsTab from "../components/admin/FaqsTab.js";
import PackagesTab from "../components/admin/PackagesTab.js";
import ContactInfoTab from "../components/admin/ContactInfoTab.js";
import NavigationTab from "../components/admin/NavigationTab.js";
import MediaTab from "../components/admin/MediaTab.js";
import SettingsTab from "../components/admin/SettingsTab.js";
import BillingTab from "../components/admin/BillingTab.js";
import WorkflowTab from "../components/admin/WorkflowTab.js";
import AutomationTab from "../components/admin/AutomationTab.js";

import { getEffectiveServices } from "../data/servicesData.js";
import { ServiceData, Category, Subcategory } from "../types/service.js";
import { useBrandMedia } from "../hooks/useBrandMedia.js";
import { getEffectiveCategories, getEffectiveSubcategories } from "../data/categoriesData.js";

const initialPackages: AdminPackage[] = [
  {
    id: "pkg-1",
    serviceId: "pvt-ltd",
    name: "Standard Package",
    price: 9999,
    discountPrice: 7999,
    gstPercent: 18,
    features: [
      "2 Digital Signature Certificates (DSC)",
      "Director Identification Numbers (DIN)",
      "Name Approval & Filing",
      "Drafting MoA & AoA",
      "PAN & TAN Registration"
    ],
    displayOrder: 1,
    cta: "Buy Standard Package"
  },
  {
    id: "pkg-2",
    serviceId: "pvt-ltd",
    name: "Premium Growth Package",
    price: 15999,
    discountPrice: 12999,
    gstPercent: 18,
    features: [
      "All Standard Package features",
      "GST Registration",
      "MSME (Udyam) Certificate",
      "Corporate Bank Account Opening Assistance",
      "1-Year Compliance Calendar & Consultation"
    ],
    displayOrder: 2,
    cta: "Upgrade to Premium"
  }
];

export default function AdminPage() {
  const { config: brandConfig } = useBrandMedia();
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Console | Legomark India Administrative Portal";
  }, []);

  // Active Tab View State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "not-1", text: "New lead 'Aman Malhotra' signed up.", time: "5 mins ago", read: false },
    { id: "not-2", text: "SPICe+ incorporation checklist updated.", time: "1 hour ago", read: true }
  ]);

  // Global search query
  const [globalQuery, setGlobalQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ label: string; tab: string }>>([]);

  // Persistent States synced to Local Storage
  const [leads, setLeads] = useState<AdminLead[]>(() => getStoredState("leads", initialLeads));
  const [orders, setOrders] = useState<AdminOrder[]>(() => getStoredState("orders", initialOrders));
  const [tasks, setTasks] = useState<AdminTask[]>(() => getStoredState("tasks", initialTasks));
  const [blogs, setBlogs] = useState<AdminBlogPost[]>(() => getStoredState("blogs", initialBlogPosts));
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>(() => getStoredState("testimonials", initialTestimonials));
  const [logos, setLogos] = useState<AdminClientLogo[]>(() => getStoredState("logos", initialClientLogos));
  const [faqs, setFaqs] = useState<AdminFaq[]>(() => getStoredState("faqs", initialGlobalFaqs));
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(() => getStoredState("media", initialMediaFiles));
  const [homepageCms, setHomepageCms] = useState<CmsHomepage>(() => getStoredState("homepage", initialCmsHomepage));
  const [contactInfo, setContactInfo] = useState<CmsContactInfo>(() => getStoredState("contact", initialCmsContactInfo));
  const [headerMenu, setHeaderMenu] = useState<MenuItem[]>(() => getStoredState("menu", initialHeaderMenu));
  const [adminSettings, setAdminSettings] = useState<SettingsType>(() => getStoredState("settings", initialAdminSettings));
  const [packages, setPackages] = useState<AdminPackage[]>([]);

  // Load packages from server on mount
  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch("/api/cms/packages");
        const json = await res.json();
        if (json.success && json.data) {
          setPackages(json.data);
        }
      } catch (err) {
        console.error("Failed to load packages in Admin Console", err);
      }
    }
    fetchPackages();
  }, []);

  // Connect actual servicesData (from Dynamic Service Engine) to CMS!
  const [servicesList, setServicesList] = useState<ServiceData[]>(() => {
    // Falls back to standard seed from servicesData.ts if not custom
    return getEffectiveServices();
  });

  const [categoriesList, setCategoriesList] = useState<Category[]>(() => {
    return getEffectiveCategories();
  });

  const [subcategoriesList, setSubcategoriesList] = useState<Subcategory[]>(() => {
    return getEffectiveSubcategories();
  });

  // Load live data from the production Express backend on tab mount
  useEffect(() => {
    async function loadBackendData() {
      const token = localStorage.getItem("efilingg_token");
      if (!token) return;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      
      try {
        const [leadsRes, ordersRes, tasksRes, blogsRes, cmsRes] = await Promise.all([
          fetch("/api/leads", { headers }).then(r => r.json()).catch(() => ({ success: false })),
          fetch("/api/orders", { headers }).then(r => r.json()).catch(() => ({ success: false })),
          fetch("/api/tasks", { headers }).then(r => r.json()).catch(() => ({ success: false })),
          fetch("/api/blogs").then(r => r.json()).catch(() => ({ success: false })),
          fetch("/api/cms/config").then(r => r.json()).catch(() => ({ success: false }))
        ]);

        if (leadsRes.success && leadsRes.data) setLeads(leadsRes.data);
        if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
        if (tasksRes.success && tasksRes.data) setTasks(tasksRes.data);
        if (blogsRes.success && blogsRes.data) setBlogs(blogsRes.data);
        
        if (cmsRes.success && cmsRes.data) {
          const { homepage, contact, settings, media, testimonials, logos, faqs } = cmsRes.data;
          if (homepage) setHomepageCms(homepage);
          if (contact) setContactInfo(contact);
          if (settings) setAdminSettings(settings);
          if (media) setMediaFiles(media);
          if (testimonials) setTestimonials(testimonials);
          if (logos) setLogos(logos);
          if (faqs) setFaqs(faqs);
        }
      } catch (err) {
        console.warn("Backend API sync fallback: server data unavailable.", err);
      }
    }
    loadBackendData();
  }, [user]);

  // Keep state saves robust
  useEffect(() => { setStoredState("leads", leads); }, [leads]);
  useEffect(() => { setStoredState("orders", orders); }, [orders]);
  useEffect(() => { setStoredState("tasks", tasks); }, [tasks]);
  useEffect(() => { setStoredState("blogs", blogs); }, [blogs]);
  useEffect(() => { setStoredState("testimonials", testimonials); }, [testimonials]);
  useEffect(() => { setStoredState("logos", logos); }, [logos]);
  useEffect(() => { setStoredState("faqs", faqs); }, [faqs]);
  useEffect(() => { setStoredState("media", mediaFiles); }, [mediaFiles]);
  useEffect(() => { setStoredState("homepage", homepageCms); }, [homepageCms]);
  useEffect(() => { setStoredState("contact", contactInfo); }, [contactInfo]);
  useEffect(() => { setStoredState("menu", headerMenu); }, [headerMenu]);
  useEffect(() => { setStoredState("settings", adminSettings); }, [adminSettings]);

  // Robust server-side syncer helpers for CMS modules
  const handleUpdateTestimonials = async (updated: AdminTestimonial[]) => {
    setTestimonials(updated);
    const token = localStorage.getItem("efilingg_token");
    try {
      await fetch("/api/cms/testimonials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Failed to sync testimonials to server", err);
    }
  };

  const handleUpdateLogos = async (updated: AdminClientLogo[]) => {
    setLogos(updated);
    const token = localStorage.getItem("efilingg_token");
    try {
      await fetch("/api/cms/logos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Failed to sync client logos to server", err);
    }
  };

  const handleUpdateFaqs = async (updated: AdminFaq[]) => {
    setFaqs(updated);
    const token = localStorage.getItem("efilingg_token");
    try {
      await fetch("/api/cms/faqs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Failed to sync FAQs to server", err);
    }
  };

  const handleUpdateHomepage = async (updated: CmsHomepage) => {
    setHomepageCms(updated);
    const token = localStorage.getItem("efilingg_token");
    try {
      await fetch("/api/cms/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Failed to sync homepage to server", err);
    }
  };

  const handleUpdateContact = async (updated: CmsContactInfo) => {
    setContactInfo(updated);
    const token = localStorage.getItem("efilingg_token");
    try {
      await fetch("/api/cms/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Failed to sync contact info to server", err);
    }
  };
  
  // Custom hook to sync services state with lookup resolver
  useEffect(() => {
    localStorage.setItem("legomark_admin_services", JSON.stringify(servicesList));
  }, [servicesList]);

  useEffect(() => {
    localStorage.setItem("legomark_admin_categories", JSON.stringify(categoriesList));
  }, [categoriesList]);

  useEffect(() => {
    localStorage.setItem("legomark_admin_subcategories", JSON.stringify(subcategoriesList));
  }, [subcategoriesList]);

  // Global Search handlers
  useEffect(() => {
    if (!globalQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const keywords = [
      { label: "Overview Dashboard & Monthly Leads", tab: "dashboard" },
      { label: "Leads Queue, notes & legal status", tab: "leads" },
      { label: "Homepage CMS hero, stats & Choose Us", tab: "homepage" },
      { label: "Services CMS, SPICe+ process & fees", tab: "services" },
      { label: "Write Blogs, categories & SEO", tab: "blogs" },
      { label: "Client Testimonials CRUD", tab: "testimonials" },
      { label: "Client Partner Logos drag & drop", tab: "logos" },
      { label: "Global FAQs management", tab: "faqs" },
      { label: "Unlimited Packages pricing & GST", tab: "packages" },
      { label: "Phone, Email, Maps, socials & addresses", tab: "contact-info" },
      { label: "Header, Footer & Mega Menu navigation", tab: "navigation" },
      { label: "Secure Media Library & template uploads", tab: "media" },
      { label: "Razorpay, Calendly, SMTP & site settings", tab: "settings" }
    ];

    const matched = keywords.filter((item) =>
      item.label.toLowerCase().includes(globalQuery.toLowerCase())
    );
    setSearchResults(matched);
  }, [globalQuery]);

  const handleSignOut = () => {
    logout();
    toast.info("Session destroyed.", "Secure Logged Out");
    navigate("/login");
  };

  const handleNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const triggerMockLeadInflow = () => {
    const mockNames = ["Rohan Singhal", "Kavitha Krishnan", "Mohit Verma", "Ayesha Patel"];
    const mockServices = ["One Person Company", "GST Registration", "Trademark Registration", "LLP Registration"];
    const mockEmails = ["rohan@singhal.co", "kavitha.k@techlabs.in", "mohit@vermatex.co", "ayesha@patelcorp.in"];
    const randomIdx = Math.floor(Math.random() * mockNames.length);

    const newLead: AdminLead = {
      id: `lead-mock-${Date.now()}`,
      name: mockNames[randomIdx],
      phone: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: mockEmails[randomIdx],
      service: mockServices[randomIdx],
      source: "Simulated Automated Inflow",
      date: new Date().toISOString().split("T")[0],
      status: "New",
      notes: "Simulated live organic lead. DSC & MSME details pending."
    };

    setLeads([newLead, ...leads]);
    setNotifications([
      { id: `not-${Date.now()}`, text: `Organic lead '${newLead.name}' registered.`, time: "Just now", read: false },
      ...notifications
    ]);
    toast.success(`Client lead '${newLead.name}' acquired live inside the database.`, "Organic Lead Inflow");
  };

  // Breadcrumbs title helper
  const getBreadcrumbTitle = () => {
    const map: Record<string, string> = {
      dashboard: "Console Overview",
      leads: "Lead Conversion Queue",
      orders: "Operational Orders & Compliance",
      workflow: "Internal Workflow & Task Engine",
      homepage: "Homepage CMS Controls",
      services: "Dynamic Service Engine CMS",
      blogs: "Knowledge Hub / Blog Editor",
      testimonials: "Testimonials CRUD Matrix",
      logos: "Client Trust Logos",
      faqs: "Global FAQ Catalog",
      packages: "Unlimited Pricing Packages",
      "contact-info": "Official Contacts & Addresses",
      navigation: "Mega Menu & Navigation Manager",
      media: "Secure Media Library",
      settings: "Third-Party Credentials & Integrations",
      billing: "Transaction & Billing Ledger Engine",
      automation: "Centralized Business Rules & Automation Engine"
    };
    return map[activeTab] || "System Tab";
  };

  const menuGroups = [
    {
      group: "Overview",
      items: [
        { id: "dashboard", label: "Overview", icon: LayoutDashboard },
        { id: "leads", label: "Leads Queue", icon: Users, badge: leads.filter(l => l.status === "New").length },
        { id: "orders", label: "Orders Engine", icon: ShoppingBag, badge: orders.filter(o => o.serviceStatus !== "Completed" && o.serviceStatus !== "Delivered").length },
        { id: "workflow", label: "Workflow Engine", icon: Kanban, badge: tasks.filter(t => t.status !== "Completed" && t.status !== "Cancelled").length },
        { id: "billing", label: "Billing & Invoices", icon: Receipt }
      ]
    },
    {
      group: "Public Website CMS",
      items: [
        { id: "homepage", label: "Homepage CMS", icon: Home },
        { id: "services", label: "Services CMS", icon: FileText },
        { id: "blogs", label: "Blogs Hub", icon: FolderHeart },
        { id: "testimonials", label: "Testimonials CMS", icon: MessageSquare },
        { id: "logos", label: "Client Logos", icon: Folder },
        { id: "faqs", label: "Global FAQs", icon: HelpCircle },
        { id: "packages", label: "Packages Matrix", icon: Award },
        { id: "contact-info", label: "Contacts & Address", icon: Clock },
        { id: "navigation", label: "Navigation Manager", icon: Menu }
      ]
    },
    {
      group: "Digital Infrastructure",
      items: [
        { id: "media", label: "Media Library", icon: Sparkles },
        { id: "automation", label: "Automation Rules", icon: Cpu },
        { id: "settings", label: "Console Settings", icon: Settings }
      ]
    }
  ];

  return (
    <div className={`min-h-screen font-sans flex ${themeMode === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`} id="admin-panel">
      
      {/* 1. SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden md:w-16"
        } shrink-0 bg-slate-950 border-r border-slate-900 flex flex-col justify-between transition-all duration-300 z-30 h-screen sticky top-0`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center px-4 justify-between border-b border-slate-900 shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center p-0.5 border border-slate-800 shadow-lg">
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
              {sidebarOpen && (
                <div>
                  <h1 className="text-xs font-black uppercase tracking-wider text-white">LEGOMARK</h1>
                  <span className="text-[9px] text-brand-secondary-500 font-mono font-semibold tracking-widest">ADMIN PANEL v1.2</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
            {menuGroups.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                {sidebarOpen && (
                  <h3 className="px-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    {group.group}
                  </h3>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                          isActive
                            ? "bg-brand-secondary-500 text-brand-primary-950 shadow-md font-bold"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5 shrink-0" />
                        {sidebarOpen && (
                          <span className="flex-1 text-left truncate">{item.label}</span>
                        )}
                        {sidebarOpen && item.badge && item.badge > 0 ? (
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black font-mono leading-none ${
                            isActive ? "bg-slate-950 text-white" : "bg-brand-secondary-500 text-slate-950"
                          }`}>
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout Control block */}
        <div className="p-3 border-t border-slate-900 shrink-0">
          <button
            onClick={handleSignOut}
            className="w-full py-2.5 px-3 rounded-lg text-slate-400 hover:bg-red-950 hover:text-red-200 transition-colors flex items-center gap-2.5 text-xs font-semibold cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0 text-red-500" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* TOP NAVIGATION HEADER */}
        <header className="h-16 bg-white border-b border-slate-200/60 shadow-xs flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shrink-0">
          
          {/* Top Left: Sidebar Toggle, Search & Breadcrumbs */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 md:flex items-center"
              title="Toggle Menu Rail"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400 font-sans select-none">
              <span>Legomark Console</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-slate-700 font-bold">{getBreadcrumbTitle()}</span>
            </div>

            {/* Global Search Interface */}
            <div className="relative max-w-xs w-full hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Global quick search CMS items..."
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary-500 text-slate-950 placeholder:text-slate-400"
              />
              
              {/* Search dropdown results */}
              {searchResults.length > 0 && (
                <div className="absolute top-10 left-0 right-0 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-40 text-xs">
                  {searchResults.map((res, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveTab(res.tab);
                        setGlobalQuery("");
                      }}
                      className="w-full py-2.5 px-4 text-left hover:bg-slate-50 border-b border-slate-50 last:border-b-0 text-slate-700 font-semibold"
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Right Actions & User Menu */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Button (Architecture Simulator) */}
            <button
              onClick={() => {
                setThemeMode(themeMode === "light" ? "dark" : "light");
                toast.info(`Simulated Dark/Light theme toggle executed! Mode is now ${themeMode === "light" ? "dark" : "light"}.`, "Theme Configurator");
              }}
              className="p-1.5 text-slate-500 hover:bg-slate-50 rounded-lg"
              title="Toggle Dark Simulator"
            >
              {themeMode === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5 text-yellow-500" />}
            </button>

            {/* Notification alert bells */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 text-slate-500 hover:bg-slate-50 rounded-lg relative"
                title="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-brand-secondary-500 rounded-full animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-10 bg-white border border-slate-200 shadow-xl rounded-xl w-72 overflow-hidden z-40 text-xs">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 flex justify-between items-center">
                    <span>Notifications Queue</span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationRead(n.id)}
                        className={`p-3 cursor-pointer transition-colors hover:bg-slate-50/50 ${!n.read ? "bg-slate-50/20 font-bold" : ""}`}
                      >
                        <p className="text-slate-700 text-[11px] leading-relaxed">{n.text}</p>
                        <span className="text-[9px] text-slate-400 font-mono mt-1 block">{n.time} {!n.read && "• Unread"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Details */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 select-none">
              <div className="h-8.5 w-8.5 rounded-full bg-slate-150 border border-slate-250 flex items-center justify-center font-extrabold text-xs text-brand-primary-950 uppercase">
                AD
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-extrabold text-slate-900 leading-none">{user?.fullName || "Lead Admin"}</p>
                <span className="text-[10px] text-brand-secondary-600 font-bold font-mono tracking-wider block mt-0.5 uppercase">
                  {user?.role || "ADMIN AUTHORITY"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE COMPONENT MOUNT */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === "dashboard" && (
            <DashboardTab
              leads={leads}
              orders={orders}
              blogs={blogs}
              servicesCount={servicesList.length}
              testimonialsCount={testimonials.length}
              packagesCount={9}
              onNavigateTab={setActiveTab}
              onQuickLead={triggerMockLeadInflow}
            />
          )}

          {activeTab === "leads" && (
            <LeadsTab
              leads={leads}
              onUpdateLeads={setLeads}
              onAddOrder={(order) => setOrders([order, ...orders])}
            />
          )}

          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              onUpdateOrders={setOrders}
            />
          )}

          {activeTab === "workflow" && (
            <WorkflowTab
              orders={orders}
              tasks={tasks}
              onUpdateTasks={setTasks}
            />
          )}

          {activeTab === "billing" && (
            <BillingTab
              orders={orders}
              onOrdersUpdated={setOrders}
            />
          )}

          {activeTab === "automation" && (
            <AutomationTab
              leads={leads}
              orders={orders}
              tasks={tasks}
              onUpdateLeads={setLeads}
              onUpdateOrders={setOrders}
              onUpdateTasks={setTasks}
            />
          )}

          {activeTab === "homepage" && (
            <HomepageTab
              homepageData={homepageCms}
              onUpdateHomepage={handleUpdateHomepage}
            />
          )}

          {activeTab === "services" && (
            <ServicesTab
              services={servicesList}
              onUpdateServices={setServicesList}
              categories={categoriesList}
              onUpdateCategories={setCategoriesList}
              subcategories={subcategoriesList}
              onUpdateSubcategories={setSubcategoriesList}
            />
          )}

          {activeTab === "blogs" && (
            <BlogsTab
              blogs={blogs}
              onUpdateBlogs={setBlogs}
            />
          )}

          {activeTab === "testimonials" && (
            <TestimonialsTab
              testimonials={testimonials}
              onUpdateTestimonials={handleUpdateTestimonials}
            />
          )}

          {activeTab === "logos" && (
            <LogosTab
              logos={logos}
              onUpdateLogos={handleUpdateLogos}
            />
          )}

          {activeTab === "faqs" && (
            <FaqsTab
              faqs={faqs}
              onUpdateFaqs={handleUpdateFaqs}
            />
          )}

          {activeTab === "packages" && (
            <PackagesTab
              packages={packages}
              onUpdatePackages={setPackages}
              services={servicesList}
            />
          )}

          {activeTab === "contact-info" && (
            <ContactInfoTab
              contactInfo={contactInfo}
              onUpdateContact={handleUpdateContact}
            />
          )}

          {activeTab === "navigation" && (
            <NavigationTab
              menuItems={headerMenu}
              onUpdateMenu={setHeaderMenu}
            />
          )}

          {activeTab === "media" && (
            <MediaTab
              mediaFiles={mediaFiles}
              onUpdateMedia={setMediaFiles}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              settings={adminSettings}
              onUpdateSettings={setAdminSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
}
