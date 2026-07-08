/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { Plus, Trash2, Check, Upload, Image as ImageIcon } from "lucide-react";
import { AdminClientLogo } from "../../data/adminStore.js";
import { Input } from "../Input.js";
import { useToast } from "../../contexts/ToastContext.js";

interface LogosTabProps {
  logos: AdminClientLogo[];
  onUpdateLogos: (logos: AdminClientLogo[]) => void;
}

export default function LogosTab({ logos, onUpdateLogos }: LogosTabProps) {
  const toast = useToast();
  const [selectedLogo, setSelectedLogo] = useState<AdminClientLogo | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; clientName: string } | null>(null);

  // Form state
  const [clientName, setClientName] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [cdnUrl, setCdnUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Drag and drop simulator
  const [isDragging, setIsDragging] = useState(false);

  const handleSelect = (logo: AdminClientLogo) => {
    setSelectedLogo(logo);
    setClientName(logo.clientName);
    if (logo.imageUrl?.startsWith("data:")) {
      setUploadedImage(logo.imageUrl);
      setCdnUrl("");
    } else {
      setUploadedImage("");
      setCdnUrl(logo.imageUrl || "");
    }
    setSortOrder(logo.sortOrder);
    setStatus(logo.status);
  };

  const handleSave = () => {
    let finalImageUrl = "";
    if (uploadedImage) {
      finalImageUrl = uploadedImage;
    } else if (cdnUrl.trim()) {
      finalImageUrl = cdnUrl.trim();
    } else if (selectedLogo) {
      finalImageUrl = selectedLogo.imageUrl;
    }

    if (!clientName.trim()) {
      toast.warn("Please provide a partner name.", "Missing Info");
      return;
    }

    if (!finalImageUrl) {
      toast.warn("Please upload an image or provide a valid CDN URL.", "Missing Image");
      return;
    }

    if (selectedLogo) {
      const updated = logos.map((l) => {
        if (l.id === selectedLogo.id) {
          return { ...l, clientName, imageUrl: finalImageUrl, sortOrder, status };
        }
        return l;
      });
      onUpdateLogos(updated);
      toast.success("Partner Logo settings saved.", "Logo Updated");
    } else {
      const newLogo: AdminClientLogo = {
        id: `logo-${Date.now()}`,
        clientName,
        imageUrl: finalImageUrl,
        sortOrder,
        status
      };
      onUpdateLogos([...logos, newLogo]);
      toast.success("New Client Partner Logo added.", "Logo Added");
    }
    handleClear();
  };

  const handleDelete = (id: string) => {
    const logo = logos.find(l => l.id === id);
    if (!logo) return;
    setConfirmDelete({ id, clientName: logo.clientName });
  };

  const executeDelete = (id: string) => {
    try {
      onUpdateLogos(logos.filter((l) => l.id !== id));
      handleClear();
      toast.success("Item deleted successfully.", "Logo Deleted");
    } catch (err) {
      toast.error("Failed to delete the client logo.", "Deletion Failed");
    }
  };

  const handleClear = () => {
    setSelectedLogo(null);
    setClientName("");
    setUploadedImage("");
    setCdnUrl("");
    setSortOrder(1);
    setStatus("Active");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag over handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    // Validation
    const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg', 'image/webp'];
    const allowedExtensions = ['png', 'svg', 'jpg', 'jpeg', 'webp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isValidType = allowedTypes.includes(file.type) || (extension && allowedExtensions.includes(extension));

    if (!isValidType) {
      toast.error("Please upload only PNG, SVG, JPG, JPEG, or WEBP images.", "Invalid File Type");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 5 MB limit.", "File Too Large");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadedImage(reader.result);
        setCdnUrl("");
        
        // Clean up the filename to use as default clientName if empty
        if (!clientName.trim()) {
          const baseName = file.name.replace(/\.[^/.]+$/, ""); // remove extension
          const formattedName = baseName
            .replace(/[-_]/g, " ") // replace hyphens/underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // title case
          setClientName(formattedName);
        }
        
        toast.success("Image selected and parsed successfully.", "Preview Generated");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read the file.", "Processing Error");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  return (
    <div className="space-y-6" id="logos-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            CLIENT & TRUST LOGOS CMS
          </h2>
          <p className="text-xs text-slate-500">Highlight client logos, enterprise affiliations, and legal accreditors on the main page footer.</p>
        </div>
        {selectedLogo && (
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-xs tracking-wide cursor-pointer"
          >
            Create New Partner Row
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Logos List */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {logos.map((l) => (
            <div
              key={l.id}
              onClick={() => handleSelect(l)}
              className={`bg-white p-5 rounded-xl border flex flex-col items-center justify-between gap-3 text-center transition-all cursor-pointer hover:border-slate-300 relative ${
                selectedLogo?.id === l.id ? "border-slate-950 ring-1 ring-slate-950" : "border-slate-200/60"
              }`}
            >
              {/* Badge */}
              <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[8px] font-bold uppercase rounded-full border ${
                l.status === "Active" ? "bg-emerald-50 border-emerald-150 text-emerald-600" : "bg-slate-50 border-slate-150 text-slate-400"
              }`}>
                {l.status}
              </span>

              <div className="h-14 w-full flex items-center justify-center p-2 bg-slate-50/50 rounded-lg">
                <img
                  src={l.imageUrl}
                  alt={l.clientName}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain mix-blend-multiply opacity-85 hover:opacity-100 transition-opacity"
                />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800">{l.clientName}</h4>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">Sort Priority: {l.sortOrder}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(l.id);
                }}
                className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer self-center"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Editor Frame */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-5 h-fit">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4 text-brand-secondary-600" />
            {selectedLogo ? "Edit Trust Logo Details" : "Upload Brand New Client Logo"}
          </h3>

          {/* DRAG AND DROP ZONE */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".png,.svg,.jpg,.jpeg,.webp"
            className="hidden"
            id="logo-file-picker"
          />
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleTriggerFileSelect}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 select-none min-h-[120px] ${
              isDragging ? "bg-brand-primary-50 border-brand-primary-500" : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {uploadedImage || cdnUrl || (selectedLogo ? selectedLogo.imageUrl : "") ? (
              <div className="space-y-2">
                <img
                  src={uploadedImage || cdnUrl || (selectedLogo ? selectedLogo.imageUrl : "")}
                  alt="Selected Preview"
                  className="max-h-20 object-contain mx-auto mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
                <div className="text-[10px] text-slate-400 font-medium">Click or drag another image to replace</div>
              </div>
            ) : (
              <>
                <Upload className="h-6 w-6 text-slate-400" />
                <div className="text-xs font-bold text-slate-700">Drag & Drop Logo Image here</div>
                <div className="text-[10px] text-slate-400 font-medium">Or click to select image (PNG, SVG, JPG, WEBP)</div>
              </>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <Input
              label="Partner / Client Name *"
              placeholder="e.g. Acme Tech Corporation"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              id="logo-client-name"
            />

            <Input
              label="Vector Image CDN URL"
              placeholder="e.g. https://images.unsplash.com/..."
              value={cdnUrl}
              onChange={(e) => {
                setCdnUrl(e.target.value);
                if (e.target.value) {
                  setUploadedImage("");
                }
              }}
              id="logo-img-url"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Display Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="block w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Active">🟢 Active (Live)</option>
                  <option value="Inactive">⚪ Inactive (Hidden)</option>
                </select>
              </div>

              <Input
                label="Sort Index"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                id="logo-sort-order"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Apply Logo Settings</span>
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4" id="delete-logo-dialog">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Confirm Client Logo Deletion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete the client partner logo of <strong className="text-slate-800">"{confirmDelete.clientName}"</strong>? This action is permanent and cannot be undone.
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
