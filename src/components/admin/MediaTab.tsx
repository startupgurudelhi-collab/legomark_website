/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, Folder, Plus, Trash2, Eye, FileText, Upload, Image as ImageIcon, Copy, ExternalLink } from "lucide-react";
import { MediaFile } from "../../data/adminStore.js";
import { Input } from "../Input.js";
import { useToast } from "../../contexts/ToastContext.js";

interface MediaTabProps {
  mediaFiles: MediaFile[];
  onUpdateMedia: (files: MediaFile[]) => void;
}

export default function MediaTab({ mediaFiles, onUpdateMedia }: MediaTabProps) {
  const toast = useToast();
  const [currentFolder, setCurrentFolder] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  // Upload state simulation
  const [isUploading, setIsUploading] = useState(false);

  // Folder names list
  const folders = ["All", "brand", "services", "documents/templates"];

  const filteredFiles = mediaFiles.filter((f) => {
    const matchesFolder = currentFolder === "All" || f.folder === currentFolder;
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Asset URL copied to clipboard! (Ready for page injection)", "URL Copied");
  };

  const handleDeleteFile = (id: string) => {
    const file = mediaFiles.find(f => f.id === id);
    if (!file) return;
    setConfirmDelete({ id, name: file.name });
  };

  const executeDelete = (id: string) => {
    try {
      onUpdateMedia(mediaFiles.filter((f) => f.id !== id));
      setSelectedFile(null);
      toast.success("Item deleted successfully.", "Asset Deleted");
    } catch (err) {
      toast.error("Failed to delete the asset.", "Deletion Failed");
    }
  };

  const handleMockUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const mockAssetNames = ["annual_report_stamp.pdf", "dsc_signing_instructions.pdf", "trademark_logo_flat.png", "tax_slab_infographic.jpg"];
      const chosenName = mockAssetNames[Math.floor(Math.random() * mockAssetNames.length)];
      const ext = chosenName.split(".").pop();
      const folderTarget = currentFolder === "All" ? "brand" : currentFolder;

      const newAsset: MediaFile = {
        id: `media-${Date.now()}`,
        name: chosenName,
        folder: folderTarget,
        size: "148 KB",
        url: ext === "pdf" ? "#" : "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop",
        type: ext === "pdf" ? "document" : "image",
        createdAt: new Date().toISOString().split("T")[0]
      };

      onUpdateMedia([newAsset, ...mediaFiles]);
      setIsUploading(false);
      toast.success(`Asset "${chosenName}" uploaded successfully into folder "${folderTarget}".`, "Upload Complete");
    }, 1200);
  };

  return (
    <div className="space-y-6" id="media-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            SECURE MEDIA MANAGER
          </h2>
          <p className="text-xs text-slate-500">Organize official stamp uploads, legal documents templates, brand vectors, and certificates.</p>
        </div>
        <button
          onClick={handleMockUpload}
          disabled={isUploading}
          className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow flex items-center gap-1.5 cursor-pointer self-start"
        >
          <Upload className="h-4 w-4" />
          <span>{isUploading ? "Uploading Asset..." : "Upload New File"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Folder Hierarchy */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 pb-1">Media Directories</h4>
            {folders.map((fld) => (
              <button
                key={fld}
                onClick={() => setCurrentFolder(fld)}
                className={`w-full p-2.5 text-left rounded-lg text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-colors ${
                  currentFolder === fld
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Folder className="h-4 w-4 shrink-0" />
                <span className="truncate">{fld}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center Grid of Assets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets inside directories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className={`bg-white rounded-xl border p-3 flex flex-col justify-between gap-3 text-center cursor-pointer transition-all hover:shadow-xs hover:border-slate-300 ${
                  selectedFile?.id === file.id ? "border-slate-950 ring-1 ring-slate-950" : "border-slate-200/60"
                }`}
              >
                <div className="h-24 w-full bg-slate-50 rounded-lg flex items-center justify-center p-2 border border-slate-100 relative overflow-hidden">
                  {file.type === "image" ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <FileText className="h-8 w-8 text-slate-400" />
                  )}
                </div>

                <div className="text-left space-y-0.5">
                  <h5 className="text-[11px] font-bold text-slate-800 truncate" title={file.name}>
                    {file.name}
                  </h5>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                    <span>{file.size}</span>
                    <span className="uppercase">{file.folder.split("/").pop()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Asset Preview and Actions */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-5 h-fit">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-brand-secondary-600" />
            Asset Inspector
          </h3>

          {selectedFile ? (
            <div className="space-y-4">
              <div className="h-40 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center p-4">
                {selectedFile.type === "image" ? (
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full object-contain shadow-xs rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-12 w-12 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{selectedFile.name.split(".").pop()} document</span>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">File Identifier</span>
                  <p className="font-semibold text-slate-800 break-all">{selectedFile.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Folder</span>
                    <p className="font-semibold text-slate-700 font-mono">{selectedFile.folder}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Uploaded</span>
                    <p className="font-semibold text-slate-700 font-mono">{selectedFile.createdAt}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(selectedFile.url)}
                  className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Asset Path</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteFile(selectedFile.id)}
                  className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Asset Row</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 text-slate-400 text-xs">
              Select any file to preview vector assets, delete elements or grab image link targets.
            </div>
          )}
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4" id="delete-media-dialog">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Confirm Asset Deletion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete the asset <strong className="text-slate-800">"{confirmDelete.name}"</strong>? This action is permanent and cannot be undone.
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
