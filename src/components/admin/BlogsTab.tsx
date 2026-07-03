/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, Plus, Save, Trash2, Edit, FileText, Image, Globe, CheckSquare } from "lucide-react";
import { AdminBlogPost } from "../../data/adminStore.js";
import { Input } from "../Input.js";
import { useToast } from "../../contexts/ToastContext.js";

interface BlogsTabProps {
  blogs: AdminBlogPost[];
  onUpdateBlogs: (blogs: AdminBlogPost[]) => void;
}

export default function BlogsTab({ blogs, onUpdateBlogs }: BlogsTabProps) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<AdminBlogPost | null>(blogs[0] || null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);

  // Form States for Editing Blog
  const [title, setTitle] = useState(selectedBlog?.title || "");
  const [category, setCategory] = useState(selectedBlog?.category || "");
  const [excerpt, setExcerpt] = useState(selectedBlog?.excerpt || "");
  const [content, setContent] = useState(selectedBlog?.content || "");
  const [featuredImage, setFeaturedImage] = useState(selectedBlog?.featuredImage || "");
  const [status, setStatus] = useState<"Published" | "Draft">(selectedBlog?.status || "Published");
  const [seoTitle, setSeoTitle] = useState(selectedBlog?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(selectedBlog?.seoDescription || "");

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectBlog = (b: AdminBlogPost) => {
    setSelectedBlog(b);
    setTitle(b.title);
    setCategory(b.category);
    setExcerpt(b.excerpt);
    setContent(b.content);
    setFeaturedImage(b.featuredImage);
    setStatus(b.status);
    setSeoTitle(b.seoTitle);
    setSeoDescription(b.seoDescription);
  };

  const handleSaveBlog = () => {
    if (!selectedBlog) return;

    const updated = blogs.map((b) => {
      if (b.id === selectedBlog.id) {
        return {
          ...b,
          title,
          category,
          excerpt,
          content,
          featuredImage,
          status,
          seoTitle,
          seoDescription
        };
      }
      return b;
    });

    onUpdateBlogs(updated);
    alert(`Knowledge hub article "${title}" saved successfully in Draft / Published matrix.`);
  };

  const handleCreateBlog = () => {
    const newBlog: AdminBlogPost = {
      id: `blog-new-${Date.now()}`,
      title: "New Corporate Insights Article",
      category: "General Business",
      excerpt: "Enter a brief summary overview for the article list view cards here.",
      content: "# Your Heading here\n\nStart writing legal insights in standard Markdown format here...",
      featuredImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
      status: "Draft",
      seoTitle: "New Corporate Insights | Legomark India",
      seoDescription: "Excellent business guides for entrepreneurs.",
      seoKeywords: ["legal advice", "startup setup"],
      createdAt: new Date().toISOString().split("T")[0]
    };

    onUpdateBlogs([newBlog, ...blogs]);
    handleSelectBlog(newBlog);
  };

  const handleDeleteBlog = (id: string) => {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;
    setConfirmDelete({ id, title: blog.title });
  };

  const executeDeleteBlog = async (id: string) => {
    const token = localStorage.getItem("efilingg_token");
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });
      if (response.ok) {
        const nextBlogs = blogs.filter((b) => b.id !== id);
        onUpdateBlogs(nextBlogs);
        setSelectedBlog(nextBlogs[0] || null);
        toast.success("Blog post deleted successfully.", "Item deleted");
      } else {
        toast.error("Failed to delete blog post from server database.", "Deletion Failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Failed to delete blog post.", "Deletion Failed");
    }
  };

  return (
    <div className="space-y-6" id="blogs-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            KNOWLEDGE HUB & BLOG CMS
          </h2>
          <p className="text-xs text-slate-500">Author search-optimized technical posts, regulatory alerts, and business registration walkthroughs.</p>
        </div>
        <button
          onClick={handleCreateBlog}
          className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow flex items-center gap-1.5 cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left List Pane */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-4 h-[550px] flex flex-col justify-between">
          <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
              {filteredBlogs.map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleSelectBlog(b)}
                  className={`p-2.5 rounded-lg text-xs border transition-all cursor-pointer flex justify-between items-start gap-2 ${
                    selectedBlog?.id === b.id
                      ? "bg-slate-950 text-white border-slate-950"
                      : "bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="truncate flex-1">
                    <div className="font-bold font-sans truncate">{b.title}</div>
                    <div className={`text-[9px] uppercase font-mono mt-0.5 ${selectedBlog?.id === b.id ? "text-slate-400" : "text-slate-500"}`}>
                      {b.category} &bull; {b.status}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBlog(b.id);
                    }}
                    className={`p-1 rounded hover:bg-red-600 hover:text-white transition-colors shrink-0 ${
                      selectedBlog?.id === b.id ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Editor Pane */}
        {selectedBlog ? (
          <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Article Content Editor</div>
                <h3 className="text-sm font-extrabold text-slate-900">{selectedBlog.title}</h3>
              </div>
              <button
                onClick={handleSaveBlog}
                className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Article Title *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  id="blog-title"
                />
              </div>
              <Input
                label="Article Category *"
                placeholder="e.g. Taxation, Company Law"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="blog-cat"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans flex items-center gap-1">
                  <Image className="h-3.5 w-3.5" /> Featured Image URL *
                </label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block mb-1">
                  Publish Matrix Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
                >
                  <option value="Published">🟢 Published (Live)</option>
                  <option value="Draft">⚪ Draft (Private)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans">
                Excerpt / Meta Description Preview (Shown on Blog Cards)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-950 focus:outline-none"
              />
            </div>

            {/* Markdown Rich text Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-brand-secondary-600" />
                Rich Text Markdown Body Editor
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="block w-full p-3 border border-slate-300 rounded-lg font-mono text-xs text-slate-950 focus:outline-none bg-slate-50/20"
                placeholder="# Markdown Heading..."
              />
            </div>

            {/* SEO configuration block */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-brand-secondary-600" />
                SEO Search Engine Optimization Attributes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Search Meta Title Tag"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  id="blog-seo-title"
                />
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Search Meta Description Tag</label>
                  <input
                    type="text"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none bg-white text-slate-950"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 flex items-center justify-center border border-dashed rounded-xl h-96 text-slate-400 text-xs">
            Write or select an article from the left pane list to configure.
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4" id="delete-blog-dialog">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Confirm Blog Deletion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete the blog post <strong className="text-slate-800">"{confirmDelete.title}"</strong>? This action is permanent and cannot be undone.
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
                  executeDeleteBlog(confirmDelete.id);
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
