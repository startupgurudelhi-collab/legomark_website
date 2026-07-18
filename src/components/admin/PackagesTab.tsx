/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Plus, Trash2, Check, Award } from "lucide-react";
import { AdminPackage } from "../../data/adminStore.js";
import { Input } from "../Input.js";
import { useToast } from "../../contexts/ToastContext.js";

interface PackagesTabProps {
  packages: AdminPackage[];
  onUpdatePackages: (packages: AdminPackage[]) => void;
  services?: any[];
}

export default function PackagesTab({ packages, onUpdatePackages, services = [] }: PackagesTabProps) {
  const toast = useToast();
  const [selectedPackage, setSelectedPackage] = useState<AdminPackage | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [serviceId, setServiceId] = useState("Private Limited Company");
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [gstPercent, setGstPercent] = useState(18);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [featuresText, setFeaturesText] = useState("");
  const [cta, setCta] = useState("Buy Standard Package");

  const handleSelect = (pkg: AdminPackage) => {
    setSelectedPackage(pkg);
    setName(pkg.name);
    setServiceId(pkg.serviceId);
    setPrice(pkg.price);
    setDiscountPrice(pkg.discountPrice || 0);
    setGstPercent(pkg.gstPercent);
    setDisplayOrder(pkg.displayOrder);
    setFeaturesText(pkg.features.join("\n"));
    setCta(pkg.cta);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.warn("Please provide a package name.", "Missing Info");
      return;
    }

    const featuresArray = featuresText.split("\n").filter((f) => f.trim() !== "");

    if (selectedPackage) {
      const updated = packages.map((p) => {
        if (p.id === selectedPackage.id) {
          return {
            ...p,
            name,
            serviceId,
            price,
            discountPrice: discountPrice > 0 ? discountPrice : undefined,
            gstPercent,
            displayOrder,
            features: featuresArray,
            cta
          };
        }
        return p;
      });
      onUpdatePackages(updated);
      toast.success("Package details modified.", "Tier Updated");
    } else {
      const newPkg: AdminPackage = {
        id: `pkg-${Date.now()}`,
        name,
        serviceId,
        price,
        discountPrice: discountPrice > 0 ? discountPrice : undefined,
        gstPercent,
        displayOrder,
        features: featuresArray,
        cta
      };
      onUpdatePackages([...packages, newPkg]);
      toast.success("New Package registered.", "Tier Added");
    }
    handleClear();
  };

  const handleDelete = (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;
    setConfirmDelete({ id, name: pkg.name });
  };

  const executeDelete = (id: string) => {
    try {
      onUpdatePackages(packages.filter((p) => p.id !== id));
      handleClear();
      toast.success("Item deleted successfully.", "Package Deleted");
    } catch (err) {
      toast.error("Failed to delete pricing package.", "Deletion Failed");
    }
  };

  const handleClear = () => {
    setSelectedPackage(null);
    setName("");
    setServiceId("Private Limited Company");
    setPrice(0);
    setDiscountPrice(0);
    setGstPercent(18);
    setDisplayOrder(1);
    setFeaturesText("");
    setCta("Buy Standard Package");
  };

  return (
    <div className="space-y-6" id="packages-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            PRICING & PACKAGES MATRIX
          </h2>
          <p className="text-xs text-slate-500">Configure unlimited custom service tiers with active discounts and GST calculations.</p>
        </div>
        {selectedPackage && (
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-xs tracking-wide cursor-pointer"
          >
            Create New Package Card
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left list of packages */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handleSelect(pkg)}
              className={`bg-white p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all cursor-pointer ${
                selectedPackage?.id === pkg.id ? "border-slate-950 ring-1 ring-slate-950" : "border-slate-200/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">{pkg.serviceId}</h4>
                    <h3 className="text-sm font-extrabold text-slate-950 mt-0.5">{pkg.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 text-[8px] font-mono bg-slate-100 text-slate-600 uppercase rounded">
                    Order: {pkg.displayOrder}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pb-2.5 border-b border-slate-100">
                  {pkg.discountPrice ? (
                    <>
                      <span className="text-lg font-extrabold text-slate-950">₹{pkg.discountPrice}</span>
                      <span className="text-xs text-slate-400 line-through">₹{pkg.price}</span>
                    </>
                  ) : (
                    <span className="text-lg font-extrabold text-slate-950">₹{pkg.price}</span>
                  )}
                  <span className="text-[10px] text-slate-400 font-medium font-mono">+{pkg.gstPercent}% GST</span>
                </div>

                <ul className="space-y-1.5">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5 font-sans leading-relaxed">
                      <span className="text-brand-secondary-600 font-bold shrink-0">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pkg.cta}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(pkg.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Editor Frame */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-5 h-fit">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-brand-secondary-600" />
            {selectedPackage ? "Edit Package Parameters" : "Create Unlimited Package Card"}
          </h3>

          <div className="space-y-4">
            <Input
              label="Package Name *"
              placeholder="e.g. Premium Startup Suite"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="pkg-name"
            />

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400">Associated Service Name *</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="block w-full mt-1 p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white focus:ring-1 focus:ring-slate-950 focus:border-slate-950 focus:outline-none"
                id="pkg-service"
              >
                {(() => {
                  const activeServices = (services || []).filter((s: any) => s.draftStatus === "Published");
                  const displayServices = activeServices.length > 0 ? activeServices : (services || []);
                  const hasSelectedService = displayServices.some((s: any) => s.serviceName === serviceId);
                  
                  return (
                    <>
                      {!hasSelectedService && serviceId && (
                        <option value={serviceId}>{serviceId}</option>
                      )}
                      {displayServices.map((service: any) => (
                        <option key={service.id || service.serviceName} value={service.serviceName}>
                          {service.serviceName}
                        </option>
                      ))}
                    </>
                  );
                })()}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Offer Price (₹) *"
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(Number(e.target.value))}
                id="pkg-disc"
              />
              <Input
                label="Normal Price (₹) *"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                id="pkg-price"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">GST Rule (%)</label>
                <select
                  value={gstPercent}
                  onChange={(e) => setGstPercent(Number(e.target.value))}
                  className="block w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value={18}>18% GST (Standard)</option>
                  <option value={5}>5% GST (Micro)</option>
                  <option value={0}>0% GST (Exempt)</option>
                </select>
              </div>

              <Input
                label="Display Order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                id="pkg-order"
              />
            </div>

            <Input
              label="CTA Button Text"
              placeholder="e.g. Get Started with Premium"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              id="pkg-cta"
            />

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400">Features Checklist (One per line) *</label>
              <textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                rows={5}
                className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-950 focus:outline-none"
                placeholder="2 Digital Signature Certificates (DSC)&#10;Government Stamp Fees included&#10;Zero balance corporate bank account"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Deploy Package Tier</span>
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4" id="delete-package-dialog">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Confirm Pricing Tier Deletion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete the pricing tier <strong className="text-slate-800">"{confirmDelete.name}"</strong>? This action is permanent and cannot be undone.
              </p>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs tracking-wide transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  executeDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow-md shadow-red-200 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
