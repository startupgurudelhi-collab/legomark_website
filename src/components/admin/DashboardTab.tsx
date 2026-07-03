/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, FileText, ShoppingBag, FolderHeart, MessageSquare, Award, ArrowUpRight, TrendingUp, Sparkles, Plus, Send, Clock, CheckCircle2, Calendar, DollarSign } from "lucide-react";
import { AdminLead, AdminBlogPost, AdminOrder } from "../../data/adminStore.js";

interface DashboardTabProps {
  leads: AdminLead[];
  orders: AdminOrder[];
  blogs: AdminBlogPost[];
  servicesCount: number;
  testimonialsCount: number;
  packagesCount: number;
  onNavigateTab: (tab: string) => void;
  onQuickLead: () => void;
}

export default function DashboardTab({
  leads,
  orders,
  blogs,
  servicesCount,
  testimonialsCount,
  packagesCount,
  onNavigateTab,
  onQuickLead
}: DashboardTabProps) {
  // Dynamic Statistics calculations for DC-006
  const totalLeads = leads.length;
  
  const todayStr = new Date().toISOString().split("T")[0];
  const todayLeadsCount = leads.filter(l => l.date === todayStr || l.createdAt === todayStr).length;

  const wonLeadsCount = leads.filter(l => l.status === "Won").length;
  const conversionRate = totalLeads > 0 ? `${((wonLeadsCount / totalLeads) * 100).toFixed(1)}%` : "0.0%";

  const pendingFollowUps = leads.filter(l => {
    if (!l.followUpDate) return false;
    const fDate = new Date(l.followUpDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return fDate >= today;
  }).length;

  const ordersInProgress = orders.filter(o => o.serviceStatus !== "Completed" && o.serviceStatus !== "Delivered").length;
  const completedOrders = orders.filter(o => o.serviceStatus === "Completed" || o.serviceStatus === "Delivered").length;

  const totalRevenue = orders.reduce((acc, o) => {
    if (o.paymentStatus === "Paid" || o.paymentStatus === "Partial") {
      return acc + o.totalAmount;
    }
    return acc;
  }, 0);

  const stats = [
    { id: "stat-total-leads", label: "Total Leads", value: totalLeads, change: "All Time Inflow", icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { id: "stat-today-leads", label: "Today's Leads", value: todayLeadsCount, change: "Newly Registered", icon: Calendar, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { id: "stat-conversion", label: "Conversion Rate", value: conversionRate, change: "Prospects to Won", icon: TrendingUp, color: "text-violet-600 bg-violet-50 border-violet-100" },
    { id: "stat-followups", label: "Pending Follow-ups", value: pendingFollowUps, change: "Action required", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { id: "stat-orders-progress", label: "Orders in Progress", value: ordersInProgress, change: "Active timelining", icon: ShoppingBag, color: "text-pink-600 bg-pink-50 border-pink-100" },
    { id: "stat-orders-done", label: "Completed Orders", value: completedOrders, change: "Delivered MCA files", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { id: "stat-revenue", label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, change: "Paid Ledger Volume", icon: DollarSign, color: "text-teal-600 bg-teal-50 border-teal-100" },
    { id: "stat-growth", label: "Monthly Growth", value: "+24.5%", change: "MoM Benchmark", icon: Sparkles, color: "text-purple-600 bg-purple-50 border-purple-100" },
  ];

  return (
    <div className="space-y-8" id="dashboard-tab">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-brand-primary-950 via-slate-900 to-slate-950 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-brand-secondary-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-brand-secondary-400 bg-white/5 border border-white/10 font-mono">
              <Sparkles className="h-3.5 w-3.5" />
              Enterprise Console Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              Welcome back, Admin
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-sans">
              Deploy services, review real-time legal filings, audit lead conversions, and manage CMS items for Legomark India.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onQuickLead}
              className="px-4 py-2.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-brand-primary-950 font-bold rounded-lg text-xs tracking-wide transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Mock Lead</span>
            </button>
            <button
              onClick={() => onNavigateTab("leads")}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold rounded-lg text-xs tracking-wide transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Leads Queue</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-500 font-sans tracking-wide">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg border ${stat.color} transition-transform group-hover:scale-105`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
                  {stat.value}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium font-mono mt-1">
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Visualization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans">
                Monthly Performance & Trends
              </h3>
              <p className="text-xs text-slate-400">Leads acquisition, revenue benchmarks & client volume.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-brand-secondary-600 bg-brand-secondary-50 px-2 py-1 rounded-md border border-brand-secondary-200/30 font-mono font-bold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+18.2% Growth</span>
            </div>
          </div>

          {/* Styled CSS/SVG Chart Vector for pristine, error-free presentation */}
          <div className="h-64 flex flex-col justify-between relative pt-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-slate-100" />
              <div className="w-full border-t border-slate-100" />
              <div className="w-full border-t border-slate-100" />
              <div className="w-full border-t border-slate-100" />
              <div className="w-full border-t border-slate-100" />
            </div>

            <div className="relative z-10 flex items-end justify-between h-52 px-4">
              {[
                { month: "Jan", leads: 45, rev: 30 },
                { month: "Feb", leads: 60, rev: 45 },
                { month: "Mar", leads: 95, rev: 70 },
                { month: "Apr", leads: 120, rev: 80 },
                { month: "May", leads: 155, rev: 95 },
                { month: "Jun", leads: 180, rev: 110 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group relative w-12">
                  <div className="flex gap-1.5 h-44 items-end justify-center w-full">
                    {/* Leads bar */}
                    <div
                      className="w-3 rounded-t-sm bg-brand-primary-950 hover:bg-brand-primary-900 transition-all cursor-pointer relative"
                      style={{ height: `${item.leads * 0.22}px` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none z-20 whitespace-nowrap">
                        Leads: {item.leads}
                      </div>
                    </div>
                    {/* Revenue bar */}
                    <div
                      className="w-3 rounded-t-sm bg-brand-secondary-500 hover:bg-brand-secondary-600 transition-all cursor-pointer relative"
                      style={{ height: `${item.rev * 0.22}px` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none z-20 whitespace-nowrap">
                        Rev: ₹{item.rev}K
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold font-sans">{item.month}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 text-[10px] font-semibold tracking-wider uppercase text-slate-500 pt-4 border-t border-slate-100 relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-primary-950" />
                <span>Acquired Leads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-secondary-500" />
                <span>Monthly Orders (₹ k)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between space-y-6">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans">
              Quick Console Actions
            </h3>
            <p className="text-xs text-slate-400">Jump directly to website content controls.</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {[
              { label: "Update Hero Banner", tab: "homepage", color: "hover:bg-slate-50 border-slate-200" },
              { label: "Configure Service List", tab: "services", color: "hover:bg-slate-50 border-slate-200" },
              { label: "Add Knowledge Article", tab: "blogs", color: "hover:bg-slate-50 border-slate-200" },
              { label: "Manage Pricing Packages", tab: "packages", color: "hover:bg-slate-50 border-slate-200" },
              { label: "Change Header Menus", tab: "navigation", color: "hover:bg-slate-50 border-slate-200" },
              { label: "SMTP & Integrations", tab: "settings", color: "hover:bg-slate-50 border-slate-200" },
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => onNavigateTab(action.tab)}
                className={`w-full py-2.5 px-3.5 border rounded-lg text-left text-xs font-semibold text-slate-700 transition-colors flex items-center justify-between ${action.color} cursor-pointer`}
              >
                <span>{action.label}</span>
                <ChevronRightIcon className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="p-3 bg-brand-primary-50 border border-brand-primary-100 rounded-xl">
            <p className="text-[10px] text-brand-primary-950 leading-relaxed font-sans font-medium">
              💡 <strong>System Pro-Tip:</strong> Edits in the <strong>Services</strong> or <strong>Packages</strong> tab write immediately to local storage and sync with the public Dynamic Service Engine pages seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans">
              Recent Lead Inflow
            </h3>
            <p className="text-xs text-slate-400">Newly registered client requests from public service pages.</p>
          </div>
          <button
            onClick={() => onNavigateTab("leads")}
            className="text-xs font-bold text-brand-secondary-600 hover:text-brand-secondary-700 flex items-center gap-1"
          >
            <span>View All Leads</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-150 uppercase tracking-wider">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Service Requested</th>
                <th className="py-3.5 px-6">Lead Source</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.slice(0, 3).map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-slate-900">{lead.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{lead.email}</div>
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">{lead.service}</td>
                  <td className="py-3.5 px-6 text-slate-500 font-medium">{lead.source}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-400">{lead.date}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                        lead.status === "New"
                          ? "bg-blue-50 border-blue-100 text-blue-600"
                          : lead.status === "Contacted"
                          ? "bg-amber-50 border-amber-100 text-amber-600"
                          : lead.status === "Qualified"
                          ? "bg-violet-50 border-violet-100 text-violet-600"
                          : "bg-emerald-50 border-emerald-100 text-emerald-600"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
