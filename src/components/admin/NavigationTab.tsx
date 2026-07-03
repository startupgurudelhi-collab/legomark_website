/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Plus, Trash2, Check, ArrowRight, CornerDownRight, Menu } from "lucide-react";
import { MenuItem } from "../../data/adminStore.js";
import { Input } from "../Input.js";
import { useToast } from "../../contexts/ToastContext.js";

interface NavigationTabProps {
  menuItems: MenuItem[];
  onUpdateMenu: (items: MenuItem[]) => void;
}

export default function NavigationTab({ menuItems, onUpdateMenu }: NavigationTabProps) {
  const toast = useToast();
  const [selectedTarget, setSelectedTarget] = useState<"header" | "mega" | "footer">("header");
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "item" | "subitem"; parentId?: string; childId?: string; name: string } | null>(null);

  // Form states for adding/editing a top-level or child item
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  
  // Add sub-item state
  const [showSubItemForm, setShowSubItemForm] = useState(false);
  const [subLabel, setSubLabel] = useState("");
  const [subHref, setSubHref] = useState("");

  const handleSelectItem = (item: MenuItem) => {
    setActiveItem(item);
    setLabel(item.label);
    setHref(item.href);
    setShowSubItemForm(false);
  };

  const handleSaveItem = () => {
    if (!activeItem || !label.trim()) return;

    const updated = menuItems.map((item) => {
      if (item.id === activeItem.id) {
        return { ...item, label, href };
      }
      return item;
    });

    onUpdateMenu(updated);
    alert(`Menu item "${label}" modified successfully!`);
  };

  const handleAddTopLevel = () => {
    const newItem: MenuItem = {
      id: `nav-${Date.now()}`,
      label: "New Menu Link",
      href: "/services"
    };

    const nextItems = [...menuItems, newItem];
    onUpdateMenu(nextItems);
    handleSelectItem(newItem);
  };

  const handleAddSubItem = () => {
    if (!activeItem || !subLabel.trim()) return;

    const subItem: MenuItem = {
      id: `sub-${Date.now()}`,
      label: subLabel,
      href: subHref || "#"
    };

    const updated = menuItems.map((item) => {
      if (item.id === activeItem.id) {
        const existingChildren = item.children || [];
        return { ...item, children: [...existingChildren, subItem] };
      }
      return item;
    });

    onUpdateMenu(updated);
    toast.success(`Sub-menu option "${subLabel}" added under "${activeItem.label}".`, "Sub-menu Appended");
    
    // Reset state
    setSubLabel("");
    setSubHref("");
    setShowSubItemForm(false);
    
    // Update active item context
    const currentActive = updated.find(x => x.id === activeItem.id);
    if (currentActive) {
      setActiveItem(currentActive);
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    setConfirmDelete({
      type: "item",
      childId: id,
      name: item.label
    });
  };

  const handleDeleteSubItem = (parentId: string, childId: string) => {
    const parent = menuItems.find(p => p.id === parentId);
    const sub = (parent?.children || []).find(c => c.id === childId);
    if (!sub) return;
    setConfirmDelete({
      type: "subitem",
      parentId,
      childId,
      name: sub.label
    });
  };

  const executeDelete = () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === "item") {
        const nextItems = menuItems.filter((item) => item.id !== confirmDelete.childId);
        onUpdateMenu(nextItems);
        setActiveItem(null);
        toast.success("Item deleted successfully.", "Navigation Deleted");
      } else {
        const updated = menuItems.map((item) => {
          if (item.id === confirmDelete.parentId) {
            const nextChildren = (item.children || []).filter(c => c.id !== confirmDelete.childId);
            return { ...item, children: nextChildren };
          }
          return item;
        });

        onUpdateMenu(updated);
        const currentActive = updated.find(x => x.id === confirmDelete.parentId);
        if (currentActive) {
          setActiveItem(currentActive);
        }
        toast.success("Item deleted successfully.", "Sub-navigation Deleted");
      }
    } catch (err) {
      toast.error("Failed to delete the navigation item.", "Deletion Failed");
    }
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6" id="navigation-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            NAVIGATION & MENU MANAGER
          </h2>
          <p className="text-xs text-slate-500">Design custom mega-menus, adjust link anchors, and build nested corporate menus.</p>
        </div>
        <button
          onClick={handleAddTopLevel}
          className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow flex items-center gap-1.5 cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add Top-Level Link</span>
        </button>
      </div>

      {/* Target Selector */}
      <div className="flex border border-slate-200 rounded-lg p-1 bg-slate-50 w-fit gap-1 text-xs">
        {[
          { id: "header", label: "Header Main Menu" },
          { id: "mega", label: "Mega Menu Grid" },
          { id: "footer", label: "Footer Links Row" }
        ].map((tgt) => (
          <button
            key={tgt.id}
            onClick={() => setSelectedTarget(tgt.id as any)}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              selectedTarget === tgt.id
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tgt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left list with recursive nodes rendering */}
        <div className="lg:col-span-2 space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className="space-y-2">
              <div
                onClick={() => handleSelectItem(item)}
                className={`bg-white p-4 rounded-xl border transition-all cursor-pointer hover:border-slate-300 flex items-center justify-between ${
                  activeItem?.id === item.id ? "border-slate-950 ring-1 ring-slate-950" : "border-slate-200/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Menu className="h-4 w-4 text-slate-400" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Path: {item.href}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[8px] font-bold bg-slate-100 text-slate-500 rounded uppercase">
                    Level 1
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Children Nodes */}
              {item.children && item.children.length > 0 && (
                <div className="pl-6 space-y-1.5">
                  {item.children.map((child) => (
                    <div
                      key={child.id}
                      className="bg-slate-50/75 p-3 rounded-xl border border-slate-200/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <CornerDownRight className="h-4 w-4 text-slate-400" />
                        <div>
                          <h5 className="font-bold text-slate-800">{child.label}</h5>
                          <p className="text-[9px] text-slate-400 font-mono mt-0.5">Path: {child.href}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[8px] font-bold bg-slate-200/60 text-slate-500 rounded uppercase">
                          Level 2
                        </span>
                        <button
                          onClick={() => handleDeleteSubItem(item.id, child.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Editor card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-5 h-fit">
          {activeItem ? (
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-1.5">
                <Menu className="h-4 w-4 text-brand-secondary-600" />
                Customize Item: {activeItem.label}
              </h3>

              <div className="space-y-4">
                <Input
                  label="Link Display Text *"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  id="nav-label"
                />
                <Input
                  label="Target Routing URL Path *"
                  placeholder="e.g. /services/trademark-registration"
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  id="nav-href"
                />

                <div className="pt-2 border-t border-slate-100 space-y-4">
                  {showSubItemForm ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3.5">
                      <h4 className="text-[10px] font-bold uppercase text-slate-400">Append Level-2 Child Option</h4>
                      <Input
                        label="Child Display Label *"
                        placeholder="e.g. One Person Company"
                        value={subLabel}
                        onChange={(e) => setSubLabel(e.target.value)}
                        id="nav-sub-label"
                      />
                      <Input
                        label="Child target path *"
                        placeholder="e.g. /services/one-person-company"
                        value={subHref}
                        onChange={(e) => setSubHref(e.target.value)}
                        id="nav-sub-href"
                      />

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setShowSubItemForm(false)}
                          className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddSubItem}
                          className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs"
                        >
                          Append Child
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSubItemForm(true)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs tracking-wide transition-all"
                    >
                      + Create Nested Child Option
                    </button>
                  )}
                </div>

                <button
                  onClick={handleSaveItem}
                  className="w-full py-2.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Navigation Anchor</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400 text-xs">
              Select any navigation item card on the left list to customize text anchors, target routes, and append submenus.
            </div>
          )}
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4" id="delete-navigation-dialog">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Confirm Navigation Deletion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete the {confirmDelete.type === "item" ? "navigation link" : "sub-navigation link"} <strong className="text-slate-800">"{confirmDelete.name}"</strong>? This action is permanent and cannot be undone.
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
                onClick={executeDelete}
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
