/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { Plus, Save, Trash2, Star, Check, Play, Film, Image, Upload, X, Loader2 } from "lucide-react";
import { AdminTestimonial } from "../../data/adminStore.js";
import { Input } from "../Input.js";
import { useToast } from "../../contexts/ToastContext.js";

interface TestimonialsTabProps {
  testimonials: AdminTestimonial[];
  onUpdateTestimonials: (testimonials: AdminTestimonial[]) => void;
}

export default function TestimonialsTab({ testimonials, onUpdateTestimonials }: TestimonialsTabProps) {
  const toast = useToast();
  const [selectedTestimonial, setSelectedTestimonial] = useState<AdminTestimonial | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; clientName: string } | null>(null);

  // Form states
  const [clientName, setClientName] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [featured, setFeatured] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [serviceUsed, setServiceUsed] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [status, setStatus] = useState<"Published" | "Draft">("Published");

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (t: AdminTestimonial) => {
    setSelectedTestimonial(t);
    setClientName(t.clientName || "");
    setDesignation(t.designation || "");
    setCompany(t.company || "");
    setRating(t.rating || 5);
    setContent(t.content || "");
    setFeatured(t.featured !== undefined ? t.featured : true);
    setSortOrder(t.sortOrder || 1);
    setServiceUsed(t.serviceUsed || "");
    setVideoUrl(t.videoUrl || "");
    setThumbnailUrl(t.thumbnailUrl || "");
    setStatus(t.status || "Published");
  };

  const handleSave = () => {
    if (!clientName.trim() || !content.trim()) {
      toast.warn("Please fill in client name and short review message.", "Missing Fields");
      return;
    }

    const itemData: AdminTestimonial = {
      id: selectedTestimonial ? selectedTestimonial.id : `test-${Date.now()}`,
      clientName,
      designation,
      company,
      rating,
      content,
      featured,
      sortOrder: Number(sortOrder) || 1,
      serviceUsed,
      videoUrl,
      thumbnailUrl,
      status
    };

    if (selectedTestimonial) {
      // Edit mode
      const updated = testimonials.map((t) => (t.id === selectedTestimonial.id ? itemData : t));
      onUpdateTestimonials(updated);
      toast.success("Testimonial updated successfully!", "Testimonial Saved");
    } else {
      // Add mode
      onUpdateTestimonials([...testimonials, itemData]);
      toast.success("Testimonial card added successfully!", "Testimonial Added");
    }
    handleClear();
  };

  const handleDelete = (id: string) => {
    const testimonial = testimonials.find(t => t.id === id);
    if (!testimonial) return;
    setConfirmDelete({ id, clientName: testimonial.clientName });
  };

  const executeDelete = (id: string) => {
    try {
      onUpdateTestimonials(testimonials.filter((t) => t.id !== id));
      handleClear();
      toast.success("Testimonial deleted successfully.", "Testimonial Deleted");
    } catch (err) {
      toast.error("Failed to delete the testimonial.", "Deletion Failed");
    }
  };

  const handleClear = () => {
    setSelectedTestimonial(null);
    setClientName("");
    setDesignation("");
    setCompany("");
    setRating(5);
    setContent("");
    setFeatured(true);
    setSortOrder(testimonials.length + 1);
    setServiceUsed("");
    setVideoUrl("");
    setThumbnailUrl("");
    setStatus("Published");
  };

  // Video Drag and Drop
  const handleDragOverVideo = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(true);
  };

  const handleDragLeaveVideo = () => {
    setIsDraggingVideo(false);
  };

  const processVideoFile = async (file: File) => {
    const allowedExtensions = ["mp4", "mov", "webm"];
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      toast.error("Please upload only MP4, MOV, or WEBM videos.", "Invalid Video Format");
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100 MB
    if (file.size > maxSize) {
      toast.error("Video file size exceeds the 100 MB limit.", "File Too Large");
      return;
    }

    setIsUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("video", file);

      const res = await fetch("/api/cms/upload-video", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("efilingg_token")}`
        },
        body: formData
      }).then(r => r.json());

      if (res.success && res.data && res.data.url) {
        setVideoUrl(res.data.url);
        toast.success("Video uploaded and prepared successfully.", "Upload Complete");
      } else {
        toast.error(res.message || "Upload failed.", "Upload Error");
      }
    } catch (err) {
      toast.error("Failed to upload the video file.", "Processing Error");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processVideoFile(e.target.files[0]);
    }
  };

  // Thumbnail file processing
  const processThumbnailFile = async (file: File) => {
    const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      toast.error("Please upload only PNG, JPG, JPEG, or WEBP images.", "Invalid Image Format");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      toast.error("Thumbnail file size exceeds the 10 MB limit.", "File Too Large");
      return;
    }

    setIsUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append("thumbnail", file);

      const res = await fetch("/api/cms/upload-thumbnail", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("efilingg_token")}`
        },
        body: formData
      }).then(r => r.json());

      if (res.success && res.data && res.data.url) {
        setThumbnailUrl(res.data.url);
        toast.success("Thumbnail image uploaded successfully.", "Upload Complete");
      } else {
        toast.error(res.message || "Upload failed.", "Upload Error");
      }
    } catch (err) {
      toast.error("Failed to upload thumbnail.", "Processing Error");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processThumbnailFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6" id="testimonials-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            TESTIMONIAL & VIDEO CMS
          </h2>
          <p className="text-xs text-slate-500">Manage client references, dynamic video uploads, and reorder homepage cards.</p>
        </div>
        {selectedTestimonial && (
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-xs tracking-wide cursor-pointer"
          >
            Create New Testimonial
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Testimonial list */}
        <div className="lg:col-span-2 space-y-3">
          {testimonials.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200/60 text-slate-400 text-xs">
              No testimonials. Create one using the side editor.
            </div>
          ) : (
            [...testimonials]
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              .map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  className={`bg-white p-5 rounded-xl border transition-all cursor-pointer hover:shadow-sm space-y-3 ${
                    selectedTestimonial?.id === t.id ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200/60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900">{t.clientName}</h4>
                        {t.status === "Draft" && (
                          <span className="px-2 py-0.5 text-[8px] font-mono bg-slate-100 text-slate-500 uppercase rounded font-bold">
                            Draft
                          </span>
                        )}
                        {t.status === "Published" && (
                          <span className="px-2 py-0.5 text-[8px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-150 uppercase rounded font-bold">
                            Published
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium uppercase font-sans mt-0.5">
                        {t.designation}, {t.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                        ))}
                      </div>
                      {t.featured && (
                        <span className="px-2 py-0.5 text-[8px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase rounded">
                          Featured
                        </span>
                      )}
                      {t.videoUrl && (
                        <span className="px-2 py-0.5 text-[8px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase rounded flex items-center gap-1">
                          <Film className="h-2 w-2" /> Video
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-[8px] font-mono bg-slate-100 text-slate-600 uppercase rounded">
                        Order: {t.sortOrder || 0}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic font-sans">
                    "{t.content}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Service Used: <strong className="text-slate-600">{t.serviceUsed || "N/A"}</strong></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(t.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Right Editor card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-5 h-fit max-h-[85vh] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-1.5">
            <Star className="h-4 w-4 text-brand-secondary-600" />
            {selectedTestimonial ? "Edit Testimonial Details" : "Create Brand New Reference"}
          </h3>

          <div className="space-y-4">
            <Input
              label="Client Name *"
              placeholder="e.g. Ramesh Kumar"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              id="test-client-name"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Designation"
                placeholder="e.g. Founder & CEO"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                id="test-designation"
              />
              <Input
                label="Company"
                placeholder="e.g. Acme Legal LLP"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                id="test-company"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Service Used"
                placeholder="e.g. GST Registration"
                value={serviceUsed}
                onChange={(e) => setServiceUsed(e.target.value)}
                id="test-service-used"
              />

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Published Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Published" | "Draft")}
                  className="block w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Rating Stars</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="block w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                </select>
              </div>

              <Input
                label="Display Sort Order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                id="test-sort-order"
              />
            </div>

            {/* VIDEO FILE UPLOADER */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 block">Video Testimonial (MP4, WEBM, MOV - Max 100MB)</label>
              <input
                type="file"
                ref={videoInputRef}
                onChange={handleVideoChange}
                accept=".mp4,.mov,.webm"
                className="hidden"
                id="testimonial-video-picker"
              />
              
              {videoUrl ? (
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]" title={videoUrl}>
                      {videoUrl.split("/").pop()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={isUploadingVideo}
                        className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-100 rounded-md text-slate-600 transition"
                      >
                        Replace Video
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoUrl("")}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                        title="Remove Video"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOverVideo}
                  onDragLeave={handleDragLeaveVideo}
                  onDrop={handleVideoDrop}
                  onClick={() => videoInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 select-none min-h-[110px] ${
                    isDraggingVideo ? "bg-indigo-50 border-indigo-500" : "bg-slate-50/50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {isUploadingVideo ? (
                    <>
                      <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
                      <div className="text-xs font-bold text-slate-600">Uploading Video Asset...</div>
                      <div className="text-[9px] text-slate-400">Processing media file up to 100MB</div>
                    </>
                  ) : (
                    <>
                      <Film className="h-6 w-6 text-slate-400" />
                      <div className="text-xs font-bold text-slate-700">Drag & Drop Video here</div>
                      <div className="text-[10px] text-slate-400">Or click to select video file</div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* THUMBNAIL FILE UPLOADER */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 block">Video Thumbnail Image (Optional)</label>
              <input
                type="file"
                ref={thumbnailInputRef}
                onChange={handleThumbnailChange}
                accept=".png,.jpg,.jpeg,.webp"
                className="hidden"
                id="testimonial-thumbnail-picker"
              />
              
              {thumbnailUrl ? (
                <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="h-10 w-14 object-cover rounded-md border border-slate-200 bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-mono text-slate-500 truncate" title={thumbnailUrl}>
                      {thumbnailUrl.split("/").pop()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={isUploadingThumbnail}
                      className="px-2 py-1 text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-100 rounded-md text-slate-600 transition"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setThumbnailUrl("")}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                      title="Remove Thumbnail"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => thumbnailInputRef.current?.click()}
                  disabled={isUploadingThumbnail}
                  className="w-full border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-100 transition-all text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isUploadingThumbnail ? (
                    <>
                      <Loader2 className="h-4 w-4 text-slate-500 animate-spin" />
                      <span>Uploading Thumbnail...</span>
                    </>
                  ) : (
                    <>
                      <Image className="h-4 w-4 text-slate-400" />
                      <span>Add Thumbnail Cover (PNG, JPG)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="test-featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-slate-950 cursor-pointer h-4 w-4"
              />
              <label htmlFor="test-featured" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                Highlight as Featured Card (Slider active)
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400">Short Review message *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-950 focus:outline-none focus:border-brand-primary-500"
                placeholder="Write the short review quote here..."
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>{selectedTestimonial ? "Apply Testimonial Changes" : "Deploy Testimonial Card"}</span>
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4" id="delete-testimonial-dialog">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Confirm Testimonial Deletion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete the testimonial card of <strong className="text-slate-800">"{confirmDelete.clientName}"</strong>? This action is permanent and cannot be undone.
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
