/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Plus, Trash2, Check, HelpCircle } from "lucide-react";
import { AdminFaq } from "../../data/adminStore.js";
import { Input } from "../Input.js";
import { useToast } from "../../contexts/ToastContext.js";

interface FaqsTabProps {
  faqs: AdminFaq[];
  onUpdateFaqs: (faqs: AdminFaq[]) => void;
}

export default function FaqsTab({ faqs, onUpdateFaqs }: FaqsTabProps) {
  const toast = useToast();
  const [selectedFaq, setSelectedFaq] = useState<AdminFaq | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; question: string } | null>(null);

  // Form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General Filing");
  const [sortOrder, setSortOrder] = useState(1);

  const handleSelect = (f: AdminFaq) => {
    setSelectedFaq(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
    setSortOrder(f.sortOrder);
  };

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) {
      toast.warn("Please fill in the Question and Answer fields.", "Missing Fields");
      return;
    }

    if (selectedFaq) {
      const updated = faqs.map((f) => {
        if (f.id === selectedFaq.id) {
          return { ...f, question, answer, category, sortOrder };
        }
        return f;
      });
      onUpdateFaqs(updated);
      toast.success("Global FAQ updated successfully!", "FAQ Saved");
    } else {
      const newFaq: AdminFaq = {
        id: `faq-${Date.now()}`,
        question,
        answer,
        category,
        sortOrder
      };
      onUpdateFaqs([...faqs, newFaq]);
      toast.success("New Global FAQ added successfully!", "FAQ Created");
    }
    handleClear();
  };

  const handleDelete = (id: string) => {
    const faq = faqs.find(f => f.id === id);
    if (!faq) return;
    setConfirmDelete({ id, question: faq.question });
  };

  const executeDelete = (id: string) => {
    try {
      onUpdateFaqs(faqs.filter((f) => f.id !== id));
      handleClear();
      toast.success("Item deleted successfully.", "FAQ Deleted");
    } catch (err) {
      toast.error("Failed to delete the FAQ.", "Deletion Failed");
    }
  };

  const handleClear = () => {
    setSelectedFaq(null);
    setQuestion("");
    setAnswer("");
    setCategory("General Filing");
    setSortOrder(1);
  };

  return (
    <div className="space-y-6" id="faqs-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            GLOBAL FAQ CMS
          </h2>
          <p className="text-xs text-slate-500">Configure global answers for general, legal, and tax inquiries across pages.</p>
        </div>
        {selectedFaq && (
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-xs tracking-wide cursor-pointer"
          >
            Create New FAQ
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side List */}
        <div className="lg:col-span-2 space-y-3">
          {faqs.map((f) => (
            <div
              key={f.id}
              onClick={() => handleSelect(f)}
              className={`bg-white p-5 rounded-xl border transition-all cursor-pointer hover:shadow-sm space-y-3 ${
                selectedFaq?.id === f.id ? "border-slate-950 ring-1 ring-slate-950" : "border-slate-200/60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-950">{f.question}</h4>
                  <p className="text-[9px] font-bold text-brand-secondary-600 uppercase mt-1">
                    Category: {f.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[8px] font-mono bg-slate-100 text-slate-600 rounded">
                    Sort Order: {f.sortOrder}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(f.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">{f.answer}</p>
            </div>
          ))}
        </div>

        {/* Right Side Form Editor */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-5 h-fit">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-brand-secondary-600" />
            {selectedFaq ? "Modify Global FAQ Entry" : "Create New FAQ Row"}
          </h3>

          <div className="space-y-4">
            <Input
              label="FAQ Question *"
              placeholder="e.g. What is the minimum capital required for SPICe+?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              id="faq-q"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="FAQ Category *"
                placeholder="e.g. GST Services"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="faq-cat"
              />
              <Input
                label="Display Index"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                id="faq-order"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400">FAQ Answer Body *</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
                className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-950 focus:outline-none"
                placeholder="Write the exhaustive answer block here..."
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Apply FAQ Settings</span>
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4" id="delete-faq-dialog">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Confirm FAQ Deletion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete the FAQ <strong className="text-slate-800">"{confirmDelete.question}"</strong>? This action is permanent and cannot be undone.
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
