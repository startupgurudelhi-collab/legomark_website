/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Search, 
  Plus, 
  Save, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ListCollapse, 
  BookOpen, 
  Trash2, 
  HelpCircle, 
  Edit2, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Layers, 
  Settings, 
  FolderTree, 
  Check, 
  X, 
  AlertCircle,
  PlusCircle
} from "lucide-react";
import { ServiceData, Category, Subcategory, ServiceFAQ } from "../../types/service.js";
import { Input } from "../Input.js";
import { useToast } from "../../contexts/ToastContext.js";

interface ServicesTabProps {
  services: ServiceData[];
  onUpdateServices: (services: ServiceData[]) => void;
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  subcategories: Subcategory[];
  onUpdateSubcategories: (subcategories: Subcategory[]) => void;
}

type SubTab = "services" | "categories" | "subcategories";

// Fallback Taxonomy Entities for Backward Compatibility (STEP 6)
const fallbackCategory: Category = {
  id: "cat-uncategorized",
  categoryName: "Uncategorized",
  urlSlug: "uncategorized",
  description: "Fallback category for legacy services",
  displayOrder: 999,
  seoTitle: "Uncategorized",
  metaDescription: "Uncategorized services",
  showInMegaMenu: false,
  activeStatus: true
};

const fallbackSubcategory: Subcategory = {
  id: "sub-general",
  parentCategoryId: "cat-uncategorized",
  subcategoryName: "General",
  urlSlug: "general",
  description: "Fallback subcategory for legacy services",
  displayOrder: 999,
  seoTitle: "General",
  metaDescription: "General services",
  activeStatus: true
};

export default function ServicesTab({
  services,
  onUpdateServices,
  categories,
  onUpdateCategories,
  subcategories,
  onUpdateSubcategories
}: ServicesTabProps) {
  const toast = useToast();
  // Current Active Sub-tab inside Services CRM
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("services");

  const [confirmDelete, setConfirmDelete] = useState<{
    type: "service" | "category" | "subcategory";
    id: string;
    name: string;
  } | null>(null);

  const [deleteBlockInfo, setDeleteBlockInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    items: string[];
  }>({
    isOpen: false,
    title: "",
    message: "",
    items: [],
  });

  // Ensure Fallback taxonomy entries are merged in lists for seamless lookup (STEP 6)
  const allCategories = categories.some(c => c.id === "cat-uncategorized") 
    ? categories 
    : [...categories, fallbackCategory];

  const allSubcategories = subcategories.some(s => s.id === "sub-general")
    ? subcategories
    : [...subcategories, fallbackSubcategory];

  // Map services to dynamically hold categoryId and subcategoryId for legacy compatibility
  const servicesWithFallback = services.map(s => ({
    ...s,
    categoryId: s.categoryId || "cat-uncategorized",
    subcategoryId: s.subcategoryId || "sub-general"
  }));

  // ==========================================
  // SERVICE ENGINE STATE & CRUD LOGIC (DC-009B)
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [svcSortField, setSvcSortField] = useState<keyof ServiceData>("displayOrder");
  const [svcSortAsc, setSvcSortAsc] = useState(true);

  // UI state: 'table' view or 'form' view
  const [viewMode, setViewMode] = useState<"table" | "form">("table");
  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

  // Form Fields State
  const [serviceCategoryId, setServiceCategoryId] = useState("");
  const [serviceSubcategoryId, setServiceSubcategoryId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [serviceUrlSlug, setServiceUrlSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState<number | string>("");
  const [governmentFees, setGovernmentFees] = useState<number | string>("");
  const [professionalFees, setProfessionalFees] = useState<number | string>("");
  const [timeline, setTimeline] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [draftStatus, setDraftStatus] = useState<"Published" | "Draft">("Published");

  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Lists (Eligibility, Required Documents, FAQs)
  const [eligibilityList, setEligibilityList] = useState<string[]>([]);
  const [newEligibilityText, setNewEligibilityText] = useState("");

  const [documents, setDocuments] = useState<string[]>([]);
  const [newDocText, setNewDocText] = useState("");

  const [faqList, setFaqList] = useState<ServiceFAQ[]>([]);
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  const [serviceFormError, setServiceFormError] = useState<string | null>(null);

  // URL Slug Auto Generation (STEP 3)
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleServiceNameChange = (val: string) => {
    setServiceName(val);
    setServiceUrlSlug(generateSlug(val));
  };

  // Dependent Dropdown Handler (STEP 2)
  const handleCategoryChange = (catId: string) => {
    setServiceCategoryId(catId);
    setServiceSubcategoryId(""); // Reset subcategory selection
  };

  // Get active subcategories list (filtered by selected parent category)
  const activeSubcategories = allSubcategories.filter(
    (sub) => sub.parentCategoryId === serviceCategoryId && sub.activeStatus
  );

  // Open Edit Service Panel
  const handleOpenEditService = (s: ServiceData) => {
    setSelectedService(s);
    setIsAddingService(false);
    setViewMode("form");

    setServiceCategoryId(s.categoryId || "cat-uncategorized");
    setServiceSubcategoryId(s.subcategoryId || "sub-general");
    setServiceName(s.serviceName);
    setServiceUrlSlug(s.urlSlug);
    setShortDescription(s.shortDescription || "");
    setFullDescription(s.fullDescription || "");
    setStartingPrice(s.startingPrice || "");
    setGovernmentFees(s.governmentFees || "");
    setProfessionalFees(s.professionalFees || "");
    setTimeline(s.timeline || "");
    setEligibilityList(s.eligibility || []);
    setDocuments(s.requiredDocuments || []);
    setFaqList(s.faqs || []);
    setSeoTitle(s.seoMetaTitle || "");
    setSeoDescription(s.seoDescription || "");
    setDraftStatus(s.draftStatus || "Published");
    setDisplayOrder(s.displayOrder || 1);
    setServiceFormError(null);
  };

  // Open Create Service Panel
  const handleOpenAddService = () => {
    setSelectedService(null);
    setIsAddingService(true);
    setViewMode("form");

    setServiceCategoryId("");
    setServiceSubcategoryId("");
    setServiceName("");
    setServiceUrlSlug("");
    setShortDescription("");
    setFullDescription("");
    setStartingPrice("");
    setGovernmentFees("");
    setProfessionalFees("");
    setTimeline("");
    setEligibilityList([]);
    setDocuments([]);
    setFaqList([]);
    setSeoTitle("");
    setSeoDescription("");
    setDraftStatus("Published");
    setDisplayOrder(services.length + 1);
    setServiceFormError(null);
  };

  // Submit / Save Service updates (STEP 5 Validation)
  const handleSaveServiceSubmit = () => {
    // 1. Mandatory validations
    if (!serviceCategoryId) {
      setServiceFormError("Category selection is mandatory.");
      return;
    }
    if (!serviceSubcategoryId) {
      setServiceFormError("Subcategory selection is mandatory.");
      return;
    }
    if (!serviceName.trim()) {
      setServiceFormError("Service Name is mandatory.");
      return;
    }
    if (!serviceUrlSlug.trim()) {
      setServiceFormError("Service URL Slug is mandatory.");
      return;
    }

    // 2. Duplicate slug check (excluding current editing service)
    const normalizedSlug = serviceUrlSlug.trim().toLowerCase();
    const isDuplicate = services.some(
      (s) => s.urlSlug.trim().toLowerCase() === normalizedSlug && (!selectedService || s.id !== selectedService.id)
    );
    if (isDuplicate) {
      setServiceFormError(`A service with the URL Slug "${serviceUrlSlug}" already exists.`);
      return;
    }

    // Lookup labels for backward compatibility string storage
    const catObj = allCategories.find(c => c.id === serviceCategoryId);
    const subcatObj = allSubcategories.find(s => s.id === serviceSubcategoryId);
    const resolvedCatName = catObj ? catObj.categoryName : "Uncategorized";
    const resolvedCatSlug = catObj ? catObj.urlSlug : "uncategorized";
    const resolvedSubcatName = subcatObj ? subcatObj.subcategoryName : "General";

    const serviceData: ServiceData = {
      id: selectedService ? selectedService.id : `service-custom-${Date.now()}`,
      categoryId: serviceCategoryId,
      subcategoryId: serviceSubcategoryId,
      category: resolvedCatName,
      categorySlug: resolvedCatSlug,
      subcategory: resolvedSubcatName,
      serviceName: serviceName.trim(),
      urlSlug: normalizedSlug,
      slug: normalizedSlug,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      startingPrice: startingPrice,
      governmentFees: governmentFees,
      professionalFees: professionalFees,
      timeline: timeline.trim(),
      eligibility: eligibilityList,
      requiredDocuments: documents,
      faqs: faqList,
      seoMetaTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      seoKeywords: [serviceName.trim().toLowerCase()],
      jsonLdSchema: selectedService?.jsonLdSchema || {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": serviceName.trim(),
        "provider": {
          "@type": "LocalBusiness",
          "name": "Legomark India"
        }
      },
      featuredStatus: selectedService?.featuredStatus || false,
      draftStatus: draftStatus,
      displayOrder: Number(displayOrder) || 1,
      benefits: selectedService?.benefits || [],
      stepByStepProcess: selectedService?.stepByStepProcess || [],
      packages: selectedService?.packages || [],
      relatedServices: selectedService?.relatedServices || []
    };

    let nextServices: ServiceData[];
    if (selectedService) {
      nextServices = services.map(s => s.id === selectedService.id ? serviceData : s);
    } else {
      nextServices = [...services, serviceData];
    }

    onUpdateServices(nextServices);
    setViewMode("table");
    setSelectedService(null);
    setIsAddingService(false);
    alert(`Service "${serviceName}" has been successfully synchronized.`);
  };

  // Delete Service
  const handleDeleteService = (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;
    setConfirmDelete({
      type: "service",
      id,
      name: service.serviceName
    });
  };

  // Service Sort handler
  const handleToggleSvcSort = (field: keyof ServiceData) => {
    if (svcSortField === field) {
      setSvcSortAsc(!svcSortAsc);
    } else {
      setSvcSortField(field);
      setSvcSortAsc(true);
    }
  };

  const filteredServices = servicesWithFallback
    .filter((s) => {
      const cat = allCategories.find(c => c.id === s.categoryId);
      const sub = allSubcategories.find(subcat => subcat.id === s.subcategoryId);
      const searchStr = `${s.serviceName} ${cat?.categoryName || s.category} ${sub?.subcategoryName || s.subcategory} ${s.urlSlug}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      let valA: any = a[svcSortField];
      let valB: any = b[svcSortField];

      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return svcSortAsc ? -1 : 1;
      if (valA > valB) return svcSortAsc ? 1 : -1;
      return 0;
    });

  // Dynamic Lists Helpers
  const handleAddEligibility = () => {
    if (newEligibilityText.trim()) {
      setEligibilityList([...eligibilityList, newEligibilityText.trim()]);
      setNewEligibilityText("");
    }
  };

  const handleRemoveEligibility = (index: number) => {
    setEligibilityList(eligibilityList.filter((_, idx) => idx !== index));
  };

  const handleAddDoc = () => {
    if (newDocText.trim()) {
      setDocuments([...documents, newDocText.trim()]);
      setNewDocText("");
    }
  };

  const handleRemoveDoc = (index: number) => {
    setDocuments(documents.filter((_, idx) => idx !== index));
  };

  const handleAddFaq = () => {
    if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
      const newFaq: ServiceFAQ = {
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim(),
        displayOrder: faqList.length + 1
      };
      setFaqList([...faqList, newFaq]);
      setNewFaqQuestion("");
      setNewFaqAnswer("");
    }
  };

  const handleRemoveFaq = (index: number) => {
    setFaqList(faqList.filter((_, idx) => idx !== index));
  };


  // ==========================================
  // CATEGORIES CMS MODULE (STEP 1 & 4 & 5)
  // ==========================================
  const [catSearch, setCatSearch] = useState("");
  const [catSortField, setCatSortField] = useState<keyof Category>("displayOrder");
  const [catSortAsc, setCatSortAsc] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [catFormError, setCatFormError] = useState<string | null>(null);

  // Category Form Fields
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catOrder, setCatOrder] = useState<number>(1);
  const [catIcon, setCatIcon] = useState("");
  const [catBanner, setCatBanner] = useState("");
  const [catSeoTitle, setCatSeoTitle] = useState("");
  const [catMetaDesc, setCatMetaDesc] = useState("");
  const [catInMegaMenu, setCatInMegaMenu] = useState(true);
  const [catActive, setCatActive] = useState(true);

  const handleCatNameChange = (val: string) => {
    setCatName(val);
    if (!editingCategory) {
      setCatSlug(generateSlug(val));
    }
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName("");
    setCatSlug("");
    setCatDesc("");
    setCatOrder(categories.length + 1);
    setCatIcon("Building2");
    setCatBanner("");
    setCatSeoTitle("");
    setCatMetaDesc("");
    setCatInMegaMenu(true);
    setCatActive(true);
    setCatFormError(null);
    setIsCatFormOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.categoryName);
    setCatSlug(cat.urlSlug);
    setCatDesc(cat.description);
    setCatOrder(cat.displayOrder);
    setCatIcon(cat.icon || "");
    setCatBanner(cat.bannerImage || "");
    setCatSeoTitle(cat.seoTitle);
    setCatMetaDesc(cat.metaDescription);
    setCatInMegaMenu(cat.showInMegaMenu);
    setCatActive(cat.activeStatus);
    setCatFormError(null);
    setIsCatFormOpen(true);
  };

  const handleSaveCategory = () => {
    if (!catName.trim()) {
      setCatFormError("Category Name is required.");
      return;
    }
    if (!catSlug.trim()) {
      setCatFormError("URL Slug is required.");
      return;
    }

    const normalizedNewName = catName.trim().toLowerCase();
    const isDuplicateName = categories.some(
      (c) => c.categoryName.trim().toLowerCase() === normalizedNewName && (!editingCategory || c.id !== editingCategory.id)
    );
    if (isDuplicateName) {
      setCatFormError(`A category with the name "${catName}" already exists.`);
      return;
    }

    const normalizedNewSlug = catSlug.trim().toLowerCase();
    const isDuplicateSlug = categories.some(
      (c) => c.urlSlug.trim().toLowerCase() === normalizedNewSlug && (!editingCategory || c.id !== editingCategory.id)
    );
    if (isDuplicateSlug) {
      setCatFormError(`A category with the slug "${catSlug}" already exists.`);
      return;
    }

    const categoryData: Category = {
      id: editingCategory ? editingCategory.id : `cat-custom-${Date.now()}`,
      categoryName: catName.trim(),
      urlSlug: normalizedNewSlug,
      description: catDesc.trim(),
      displayOrder: Number(catOrder) || 1,
      icon: catIcon.trim() || undefined,
      bannerImage: catBanner.trim() || undefined,
      seoTitle: catSeoTitle.trim(),
      metaDescription: catMetaDesc.trim(),
      showInMegaMenu: catInMegaMenu,
      activeStatus: catActive
    };

    let updatedCategories: Category[];
    if (editingCategory) {
      updatedCategories = categories.map((c) => (c.id === editingCategory.id ? categoryData : c));
    } else {
      updatedCategories = [...categories, categoryData];
    }

    onUpdateCategories(updatedCategories);
    setIsCatFormOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (cat: Category) => {
    const associatedSubcats = subcategories.filter((sub) => sub.parentCategoryId === cat.id);
    if (associatedSubcats.length > 0) {
      setDeleteBlockInfo({
        isOpen: true,
        title: "Category Deletion Blocked",
        message: `The category "${cat.categoryName}" cannot be deleted because it contains active subcategories. To protect system navigation integrity, please delete or reassign the following subcategories first:`,
        items: associatedSubcats.map((s) => s.subcategoryName),
      });
      return;
    }

    setConfirmDelete({
      type: "category",
      id: cat.id,
      name: cat.categoryName
    });
  };

  const handleToggleCatSort = (field: keyof Category) => {
    if (catSortField === field) {
      setCatSortAsc(!catSortAsc);
    } else {
      setCatSortField(field);
      setCatSortAsc(true);
    }
  };

  const sortedCategories = [...categories]
    .filter((c) => 
      c.categoryName.toLowerCase().includes(catSearch.toLowerCase()) ||
      c.urlSlug.toLowerCase().includes(catSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(catSearch.toLowerCase())
    )
    .sort((a, b) => {
      let valA: any = a[catSortField];
      let valB: any = b[catSortField];

      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return catSortAsc ? -1 : 1;
      if (valA > valB) return catSortAsc ? 1 : -1;
      return 0;
    });


  // ==========================================
  // SUBCATEGORIES CMS MODULE (STEP 2 & 4 & 5)
  // ==========================================
  const [subSearch, setSubSearch] = useState("");
  const [subSortField, setSubSortField] = useState<keyof Subcategory>("displayOrder");
  const [subSortAsc, setSubSortAsc] = useState(true);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [isSubFormOpen, setIsSubFormOpen] = useState(false);
  const [subFormError, setSubFormError] = useState<string | null>(null);

  // Subcategory Form Fields
  const [subParentId, setSubParentId] = useState("");
  const [subName, setSubName] = useState("");
  const [subSlug, setSubSlug] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subOrder, setSubOrder] = useState<number>(1);
  const [subSeoTitle, setSubSeoTitle] = useState("");
  const [subMetaDesc, setSubMetaDesc] = useState("");
  const [subActive, setSubActive] = useState(true);

  const handleSubNameChange = (val: string) => {
    setSubName(val);
    if (!editingSubcategory) {
      setSubSlug(generateSlug(val));
    }
  };

  const handleOpenAddSubcategory = () => {
    setEditingSubcategory(null);
    setSubParentId(categories[0]?.id || "");
    setSubName("");
    setSubSlug("");
    setSubDesc("");
    setSubOrder(subcategories.length + 1);
    setSubSeoTitle("");
    setSubMetaDesc("");
    setSubActive(true);
    setSubFormError(null);
    setIsSubFormOpen(true);
  };

  const handleOpenEditSubcategory = (sub: Subcategory) => {
    setEditingSubcategory(sub);
    setSubParentId(sub.parentCategoryId);
    setSubName(sub.subcategoryName);
    setSubSlug(sub.urlSlug);
    setSubDesc(sub.description);
    setSubOrder(sub.displayOrder);
    setSubSeoTitle(sub.seoTitle);
    setSubMetaDesc(sub.metaDescription);
    setSubActive(sub.activeStatus);
    setSubFormError(null);
    setIsSubFormOpen(true);
  };

  const handleSaveSubcategory = () => {
    if (!subParentId) {
      setSubFormError("Parent Category is required.");
      return;
    }
    if (!subName.trim()) {
      setSubFormError("Subcategory Name is required.");
      return;
    }
    if (!subSlug.trim()) {
      setSubFormError("URL Slug is required.");
      return;
    }

    const normalizedNewName = subName.trim().toLowerCase();
    const isDuplicateName = subcategories.some(
      (s) => 
        s.parentCategoryId === subParentId && 
        s.subcategoryName.trim().toLowerCase() === normalizedNewName && 
        (!editingSubcategory || s.id !== editingSubcategory.id)
    );
    if (isDuplicateName) {
      setSubFormError(`A subcategory with name "${subName}" already exists under this parent category.`);
      return;
    }

    const normalizedNewSlug = subSlug.trim().toLowerCase();
    const isDuplicateSlug = subcategories.some(
      (s) => 
        s.parentCategoryId === subParentId && 
        s.urlSlug.trim().toLowerCase() === normalizedNewSlug && 
        (!editingSubcategory || s.id !== editingSubcategory.id)
    );
    if (isDuplicateSlug) {
      setSubFormError(`A subcategory with slug "${subSlug}" already exists under this parent category.`);
      return;
    }

    const subcategoryData: Subcategory = {
      id: editingSubcategory ? editingSubcategory.id : `sub-custom-${Date.now()}`,
      parentCategoryId: subParentId,
      subcategoryName: subName.trim(),
      urlSlug: normalizedNewSlug,
      description: subDesc.trim(),
      displayOrder: Number(subOrder) || 1,
      seoTitle: subSeoTitle.trim(),
      metaDescription: subMetaDesc.trim(),
      activeStatus: subActive
    };

    let updatedSubcategories: Subcategory[];
    if (editingSubcategory) {
      updatedSubcategories = subcategories.map((s) => (s.id === editingSubcategory.id ? subcategoryData : s));
    } else {
      updatedSubcategories = [...subcategories, subcategoryData];
    }

    onUpdateSubcategories(updatedSubcategories);
    setIsSubFormOpen(false);
    setEditingSubcategory(null);
  };

  const handleDeleteSubcategory = (sub: Subcategory) => {
    const associatedServices = services.filter(
      (s) => s.subcategoryId === sub.id || s.subcategory === sub.subcategoryName
    );
    if (associatedServices.length > 0) {
      setDeleteBlockInfo({
        isOpen: true,
        title: "Subcategory Deletion Blocked",
        message: `The subcategory "${sub.subcategoryName}" cannot be deleted because it contains published services. To protect system navigation integrity, please delete or reassign the following services first:`,
        items: associatedServices.map((s) => s.serviceName),
      });
      return;
    }

    setConfirmDelete({
      type: "subcategory",
      id: sub.id,
      name: sub.subcategoryName
    });
  };

  const executeDelete = () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    try {
      if (type === "service") {
        onUpdateServices(services.filter(s => s.id !== id));
        setViewMode("table");
        setSelectedService(null);
        setIsAddingService(false);
        toast.success("Item deleted successfully.", "Service Deleted");
      } else if (type === "category") {
        const updated = categories.filter((c) => c.id !== id);
        onUpdateCategories(updated);
        toast.success("Item deleted successfully.", "Category Deleted");
      } else if (type === "subcategory") {
        const updated = subcategories.filter((s) => s.id !== id);
        onUpdateSubcategories(updated);
        toast.success("Item deleted successfully.", "Subcategory Deleted");
      }
    } catch (err) {
      toast.error("Failed to delete the item.", "Deletion Failed");
    }
    setConfirmDelete(null);
  };

  const handleToggleSubSort = (field: keyof Subcategory) => {
    if (subSortField === field) {
      setSubSortAsc(!subSortAsc);
    } else {
      setSubSortField(field);
      setSubSortAsc(true);
    }
  };

  const sortedSubcategories = [...subcategories]
    .filter((sub) => {
      const parent = categories.find((c) => c.id === sub.parentCategoryId);
      const parentName = parent ? parent.categoryName : "";
      return (
        sub.subcategoryName.toLowerCase().includes(subSearch.toLowerCase()) ||
        sub.urlSlug.toLowerCase().includes(subSearch.toLowerCase()) ||
        parentName.toLowerCase().includes(subSearch.toLowerCase())
      );
    })
    .sort((a, b) => {
      let valA: any = a[subSortField];
      let valB: any = b[subSortField];

      if (subSortField === "parentCategoryId") {
        const pA = categories.find((c) => c.id === a.parentCategoryId)?.categoryName || "";
        const pB = categories.find((c) => c.id === b.parentCategoryId)?.categoryName || "";
        valA = pA.toLowerCase();
        valB = pB.toLowerCase();
      } else {
        if (valA === undefined || valA === null) valA = "";
        if (valB === undefined || valB === null) valB = "";

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
      }

      if (valA < valB) return subSortAsc ? -1 : 1;
      if (valA > valB) return subSortAsc ? 1 : -1;
      return 0;
    });


  // ==========================================
  // RENDER MASTER CONTAINER
  // ==========================================
  return (
    <div className="space-y-6" id="services-tab">
      
      {/* CMS Header & Secondary Taxonomy Selector */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-brand-secondary-500 text-slate-950 text-[10px] font-black tracking-widest rounded uppercase">CMS PRO</span>
            <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">
              Enterprise Service & Taxonomy Hierarchy
            </h2>
          </div>
          <p className="text-xs text-slate-400">Configure corporate hierarchies: Categories → Subcategories → Services with complete CRUD control.</p>
        </div>

        {/* Sub-tab Pill Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab("services")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "services"
                ? "bg-brand-secondary-500 text-slate-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Service Engine</span>
          </button>
          <button
            onClick={() => setActiveSubTab("categories")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "categories"
                ? "bg-brand-secondary-500 text-slate-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <FolderTree className="h-3.5 w-3.5" />
            <span>Categories</span>
          </button>
          <button
            onClick={() => setActiveSubTab("subcategories")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "subcategories"
                ? "bg-brand-secondary-500 text-slate-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Subcategories</span>
          </button>
        </div>
      </div>

      {/* =======================================================
          VIEW 1: UPGRADED SERVICE CMS (TABLE & FORM VIEW) (DC-009B)
          ======================================================= */}
      {activeSubTab === "services" && (
        <div className="space-y-6 animate-fadeIn">
          
          {viewMode === "table" ? (
            /* SERVICE LIST TABLE VIEW (STEP 4) */
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden space-y-4 p-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search services by name, category, slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 text-slate-900"
                  />
                </div>
                <button
                  onClick={handleOpenAddService}
                  className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Service</span>
                </button>
              </div>

              {/* Service Table with Requested Columns (STEP 4) */}
              <div className="overflow-x-auto rounded-xl border border-slate-200/70">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleToggleSvcSort("serviceName")}>
                        <div className="flex items-center gap-1">
                          <span>Service Name</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleToggleSvcSort("category")}>
                        <div className="flex items-center gap-1">
                          <span>Category</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleToggleSvcSort("subcategory")}>
                        <div className="flex items-center gap-1">
                          <span>Subcategory</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleToggleSvcSort("urlSlug")}>
                        <div className="flex items-center gap-1">
                          <span>Slug</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors text-center" onClick={() => handleToggleSvcSort("displayOrder")}>
                        <div className="flex items-center justify-center gap-1">
                          <span>Display Order</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredServices.length > 0 ? (
                      filteredServices.map((s) => {
                        const resolvedCat = allCategories.find(c => c.id === s.categoryId)?.categoryName || s.category;
                        const resolvedSub = allSubcategories.find(sub => sub.id === s.subcategoryId)?.subcategoryName || s.subcategory;
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/50 transition-all duration-150">
                            <td className="py-3.5 px-4 font-bold text-slate-900">{s.serviceName}</td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                                {resolvedCat}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 font-medium">{resolvedSub}</td>
                            <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{s.urlSlug}</td>
                            <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-900">{s.displayOrder}</td>
                            <td className="py-3.5 px-4 text-center">
                              {s.draftStatus === "Published" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span> Draft
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditService(s)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer animate-fadeIn"
                                  title="Edit Service"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteService(s.id)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer"
                                  title="Delete Service"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 px-4 text-center text-slate-400 text-xs">
                          No service entries match your search filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* SERVICE CREATION & CUSTOMIZATION FORM (STEP 1 & 5) */
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-brand-secondary-600 uppercase tracking-widest font-mono">Service Customizer</span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isAddingService ? "Incorporate New Service" : `Edit Service: ${serviceName}`}
                  </h3>
                </div>
                <button
                  onClick={() => setViewMode("table")}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Back to List</span>
                </button>
              </div>

              {serviceFormError && (
                <div className="p-3.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg flex items-center gap-2 border border-red-100">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{serviceFormError}</span>
                </div>
              )}

              {/* FORM LAYOUT ORDER DIRECT FROM CONTRACT DC-009B */}
              <div className="space-y-6">
                
                {/* 1. Category (Dropdown) (Mandatory) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans block">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-sans text-slate-950 focus:outline-none focus:border-brand-primary-500 bg-white"
                      value={serviceCategoryId}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      required
                    >
                      <option value="">-- Select Category (Mandatory) --</option>
                      {allCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Subcategory (Dropdown) (Dependent Dropdown) (Mandatory) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans block">
                      Subcategory <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-sans text-slate-950 focus:outline-none focus:border-brand-primary-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                      value={serviceSubcategoryId}
                      onChange={(e) => setServiceSubcategoryId(e.target.value)}
                      disabled={!serviceCategoryId}
                      required
                    >
                      <option value="">
                        {!serviceCategoryId ? "Select Category First" : "-- Select Subcategory (Mandatory) --"}
                      </option>
                      {activeSubcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.subcategoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Service Name (Mandatory) & 4. Service URL Slug (Auto generated, editable) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans block">
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(e) => handleServiceNameChange(e.target.value)}
                      placeholder="e.g. GST Registration"
                      className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-sans text-slate-950 focus:outline-none focus:border-brand-primary-500 bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans block">
                      Service URL Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={serviceUrlSlug}
                      onChange={(e) => setServiceUrlSlug(generateSlug(e.target.value))}
                      placeholder="e.g. gst-registration"
                      className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-sans text-slate-950 focus:outline-none focus:border-brand-primary-500 bg-white"
                      required
                    />
                  </div>
                </div>

                {/* 5. Short Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block">
                    Short Description / Banner Summary
                  </label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    rows={2}
                    placeholder="Enter short, punchy marketing or legal subtitle..."
                    className="block w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-950 focus:outline-none focus:border-brand-primary-500 bg-white"
                  />
                </div>

                {/* 6. Detailed Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block">
                    Detailed Content / Procedural Protocols
                  </label>
                  <textarea
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    rows={4}
                    placeholder="Provide deep descriptions, regulatory mandates, and operational guidelines..."
                    className="block w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-950 focus:outline-none focus:border-brand-primary-500 bg-white"
                  />
                </div>

                {/* 7. Starting Price, 8. Government Fee, 9. Professional Fee, 10. Timeline & Display Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block">
                      Starting Price
                    </label>
                    <input
                      type="text"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      placeholder="e.g. ₹1,499"
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-sans text-slate-950 focus:outline-none focus:border-brand-primary-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block">
                      Government Fee
                    </label>
                    <input
                      type="text"
                      value={governmentFees}
                      onChange={(e) => setGovernmentFees(e.target.value)}
                      placeholder="e.g. ₹1,500"
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-sans text-slate-950 focus:outline-none focus:border-brand-primary-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block">
                      Professional Fee
                    </label>
                    <input
                      type="text"
                      value={professionalFees}
                      onChange={(e) => setProfessionalFees(e.target.value)}
                      placeholder="e.g. ₹3,999"
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-sans text-slate-950 focus:outline-none focus:border-brand-primary-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block">
                      Filing Timeline
                    </label>
                    <input
                      type="text"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      placeholder="e.g. 5-7 working days"
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-sans text-slate-950 focus:outline-none focus:border-brand-primary-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-sans text-slate-950 focus:outline-none focus:border-brand-primary-500"
                    />
                  </div>
                </div>

                {/* 11. Eligibility Checklist Editor */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    11. Service Eligibility Guidelines
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an eligibility criteria (e.g., Minimum 2 Shareholders)"
                      value={newEligibilityText}
                      onChange={(e) => setNewEligibilityText(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary-500 text-slate-950"
                    />
                    <button
                      type="button"
                      onClick={handleAddEligibility}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Criteria
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {eligibilityList.map((el, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-white border border-slate-200 shadow-xs text-slate-700 font-medium"
                      >
                        <span>{el}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEligibility(idx)}
                          className="text-red-500 hover:text-red-700 font-bold ml-1 text-[10px]"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {eligibilityList.length === 0 && (
                      <span className="text-xs text-slate-400 font-sans italic">No eligibility criteria set.</span>
                    )}
                  </div>
                </div>

                {/* 12. Required Documents Checklist Editor */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-brand-secondary-600" />
                    12. Required Legal Document Checklist
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add document required (e.g., PAN and Aadhaar Card)"
                      value={newDocText}
                      onChange={(e) => setNewDocText(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary-500 text-slate-950"
                    />
                    <button
                      type="button"
                      onClick={handleAddDoc}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Card
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-white border border-slate-200 shadow-xs text-slate-700 font-medium"
                      >
                        <span>{doc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(idx)}
                          className="text-red-500 hover:text-red-700 font-bold ml-1 text-[10px]"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {documents.length === 0 && (
                      <span className="text-xs text-slate-400 font-sans italic">No required documents added.</span>
                    )}
                  </div>
                </div>

                {/* 13. FAQs Editor */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                    13. Service FAQs Management
                  </h4>
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <input
                      type="text"
                      placeholder="Question: e.g. Is a physical office required during incorporation?"
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary-500 text-slate-950"
                    />
                    <textarea
                      placeholder="Answer: e.g. Yes, you must provide a valid physical address..."
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary-500 text-slate-950 block"
                    />
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1 self-end"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add FAQ Card
                    </button>
                  </div>
                  <div className="space-y-2">
                    {faqList.map((faq, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900">Q: {faq.question}</p>
                          <p className="text-slate-600">A: {faq.answer}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="text-red-500 hover:text-red-700 font-bold p-1 bg-red-50 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {faqList.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No FAQs configured yet.</p>
                    )}
                  </div>
                </div>

                {/* 14. SEO Fields */}
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/60 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">14. SEO Header Meta Injection</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Search Engine Title Tag"
                      placeholder="SEO meta title..."
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      id="seo-title"
                    />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Meta Description</label>
                      <textarea
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        rows={2}
                        placeholder="Brief listing snippet..."
                        className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-950 focus:outline-none focus:border-brand-primary-500 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 15. Publish Status */}
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">15. Publish Engine Status</h4>
                    <p className="text-[10px] text-slate-500">Is this service live on public routing pathways?</p>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setDraftStatus("Published")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        draftStatus === "Published" ? "bg-emerald-600 text-white shadow-md" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      🟢 Published
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraftStatus("Draft")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        draftStatus === "Draft" ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      ⚪ Draft Mode
                    </button>
                  </div>
                </div>

              </div>

              {/* Form Save and Cancel Controls */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveServiceSubmit}
                  className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-black rounded-lg text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span>{selectedService ? "Save Service Updates" : "Create Service Node"}</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* =======================================================
          VIEW 2: CATEGORIES MANAGEMENT (UNCHANGED CORE BEHAVIOR)
          ======================================================= */}
      {activeSubTab === "categories" && (
        <div className="space-y-6 animate-fadeIn">
          {isCatFormOpen ? (
            /* Category Edit/Create View */
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-brand-secondary-600 uppercase tracking-widest font-mono">Taxonomy Builder</span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingCategory ? `Edit Category: ${editingCategory.categoryName}` : "Create New Category Level"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCatFormOpen(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {catFormError && (
                <div className="p-3.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg flex items-center gap-2 border border-red-100">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{catFormError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Category Name"
                  placeholder="e.g. Corporate Licensing"
                  value={catName}
                  onChange={(e) => handleCatNameChange(e.target.value)}
                  required
                />
                <Input
                  label="URL Slug (Auto Generated, Editable)"
                  placeholder="e.g. corporate-licensing"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block mb-1.5">
                    Display Order (Numeric Only)
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-sans text-slate-900 focus:outline-none focus:border-brand-primary-500"
                    value={catOrder}
                    onChange={(e) => setCatOrder(parseInt(e.target.value) || 1)}
                  />
                </div>

                <Input
                  label="Lucide Icon Tag (Optional)"
                  placeholder="e.g. Building2, Scale, FileText"
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                />

                <Input
                  label="Banner Image URL"
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={catBanner}
                  onChange={(e) => setCatBanner(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block">
                  Category Description
                </label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={3}
                  className="block w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-950 focus:outline-none focus:border-brand-primary-500 bg-white"
                  placeholder="Enter high-level taxonomy scope detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="SEO Title Tag"
                  placeholder="Meta title tags..."
                  value={catSeoTitle}
                  onChange={(e) => setCatSeoTitle(e.target.value)}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block">
                    Meta Description Tag
                  </label>
                  <textarea
                    value={catMetaDesc}
                    onChange={(e) => setCatMetaDesc(e.target.value)}
                    rows={2}
                    className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-950 focus:outline-none focus:border-brand-primary-500 bg-white"
                  />
                </div>
              </div>

              {/* Boolean Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Mega Menu Listing</h5>
                    <p className="text-[10px] text-slate-500">Show this category group under the master navbar dropdown?</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCatInMegaMenu(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        catInMegaMenu ? "bg-emerald-600 text-white shadow" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      <Check className="h-3 w-3" /> Yes
                    </button>
                    <button
                      onClick={() => setCatInMegaMenu(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        !catInMegaMenu ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      <X className="h-3 w-3" /> No
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Status</h5>
                    <p className="text-[10px] text-slate-500">Enable/disable this category block across public routes.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCatActive(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        catActive ? "bg-emerald-600 text-white shadow" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      <Check className="h-3 w-3" /> Active
                    </button>
                    <button
                      onClick={() => setCatActive(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        !catActive ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      <X className="h-3 w-3" /> Inactive
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsCatFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-black rounded-lg text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Category</span>
                </button>
              </div>
            </div>
          ) : (
            /* Category List Table View */
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden space-y-4 p-5">
              
              {/* Table Sub-header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search category structures..."
                    value={catSearch}
                    onChange={(e) => setCatSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 text-slate-900"
                  />
                </div>
                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Category Level</span>
                </button>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200/70">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleToggleCatSort("categoryName")}>
                        <div className="flex items-center gap-1">
                          <span>Category Name</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleToggleCatSort("urlSlug")}>
                        <div className="flex items-center gap-1">
                          <span>URL Slug</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors text-center" onClick={() => handleToggleCatSort("displayOrder")}>
                        <div className="flex items-center justify-center gap-1">
                          <span>Display Order</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 text-center">Mega Menu</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {sortedCategories.length > 0 ? (
                      sortedCategories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-slate-50/50 transition-all duration-150">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              {cat.icon && (
                                <span className="p-1.5 bg-slate-100 rounded text-slate-600 font-mono text-[10px]">
                                  {cat.icon}
                                </span>
                              )}
                              <span>{cat.categoryName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{cat.urlSlug}</td>
                          <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-900">{cat.displayOrder}</td>
                          <td className="py-3.5 px-4 text-center">
                            {cat.showInMegaMenu ? (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                <Eye className="h-2.5 w-2.5" /> Show
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                                <EyeOff className="h-2.5 w-2.5" /> Hidden
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {cat.activeStatus ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span> Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditCategory(cat)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                                title="Edit Category"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer"
                                title="Soft Delete Category"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 px-4 text-center text-slate-400 text-xs">
                          No category levels located inside taxonomy indexes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =======================================================
          VIEW 3: SUBCATEGORIES MANAGEMENT (UNCHANGED CORE BEHAVIOR)
          ======================================================= */}
      {activeSubTab === "subcategories" && (
        <div className="space-y-6 animate-fadeIn">
          {isSubFormOpen ? (
            /* Subcategory Edit/Create View */
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-brand-secondary-600 uppercase tracking-widest font-mono font-black">Level-2 Node</span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingSubcategory ? `Edit Subcategory: ${editingSubcategory.subcategoryName}` : "Create New Subcategory Node"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsSubFormOpen(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {subFormError && (
                <div className="p-3.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg flex items-center gap-2 border border-red-100">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{subFormError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block mb-1.5">
                    Parent Category Level (Dropdown)
                  </label>
                  <select
                    className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-sans text-slate-950 focus:outline-none focus:border-brand-primary-500 bg-white"
                    value={subParentId}
                    onChange={(e) => setSubParentId(e.target.value)}
                    required
                  >
                    <option value="">Select Parent Category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categoryName} ({cat.urlSlug})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Subcategory Name"
                    placeholder="e.g. Indirect Taxation"
                    value={subName}
                    onChange={(e) => handleSubNameChange(e.target.value)}
                    required
                  />
                  <Input
                    label="URL Slug (Editable)"
                    placeholder="e.g. indirect-taxation"
                    value={subSlug}
                    onChange={(e) => setSubSlug(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block mb-1.5">
                    Display Order (Numeric Only)
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-sans text-slate-900 focus:outline-none focus:border-brand-primary-500"
                    value={subOrder}
                    onChange={(e) => setSubOrder(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="SEO Search Engine Title"
                    placeholder="e.g. Indirect Taxation & Compliance | Legomark India"
                    value={subSeoTitle}
                    onChange={(e) => setSubSeoTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block">
                  Subcategory Description
                </label>
                <textarea
                  value={subDesc}
                  onChange={(e) => setSubDesc(e.target.value)}
                  rows={3}
                  className="block w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-950 focus:outline-none focus:border-brand-primary-500"
                  placeholder="Enter a brief subcategory layout description..."
                />
              </div>

              {/* SEO Meta Desc & Publishing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans block mb-1.5">
                    Search Meta Description Tag
                  </label>
                  <textarea
                    value={subMetaDesc}
                    onChange={(e) => setSubMetaDesc(e.target.value)}
                    rows={2}
                    placeholder="Brief snippet shown on search listings..."
                    className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-950 focus:outline-none focus:border-brand-primary-500 bg-white"
                  />
                </div>

                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/60 flex items-center justify-between self-start">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Publishing Status</h5>
                    <p className="text-[10px] text-slate-500">Is this subcategory active under its parent?</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSubActive(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        subActive ? "bg-emerald-600 text-white shadow-md" : "bg-slate-200/70 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Check className="h-3 w-3" /> Active
                    </button>
                    <button
                      onClick={() => setSubActive(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        !subActive ? "bg-slate-700 text-white" : "bg-slate-200/70 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <X className="h-3 w-3" /> Inactive
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsSubFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSubcategory}
                  className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-black rounded-lg text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Subcategory</span>
                </button>
              </div>
            </div>
          ) : (
            /* Subcategory List Table View */
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden space-y-4 p-5">
              
              {/* Table Sub-header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search subcategories by name, slug, parent..."
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 text-slate-900"
                  />
                </div>
                <button
                  onClick={handleOpenAddSubcategory}
                  className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow flex items-center gap-1.5 cursor-pointer"
                  disabled={categories.length === 0}
                  title={categories.length === 0 ? "You must define at least one Category Level first." : ""}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Subcategory Node</span>
                </button>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200/70">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleToggleSubSort("subcategoryName")}>
                        <div className="flex items-center gap-1">
                          <span>Subcategory Name</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleToggleSubSort("parentCategoryId")}>
                        <div className="flex items-center gap-1">
                          <span>Parent Category</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleToggleSubSort("urlSlug")}>
                        <div className="flex items-center gap-1">
                          <span>URL Slug</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors text-center" onClick={() => handleToggleSubSort("displayOrder")}>
                        <div className="flex items-center justify-center gap-1">
                          <span>Display Order</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {sortedSubcategories.length > 0 ? (
                      sortedSubcategories.map((sub) => {
                        const parent = categories.find((c) => c.id === sub.parentCategoryId);
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/50 transition-all duration-150">
                            <td className="py-3.5 px-4 font-bold text-slate-900">{sub.subcategoryName}</td>
                            <td className="py-3.5 px-4">
                              {parent ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                                  {parent.categoryName}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
                                  Unlinked / Orphans
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{sub.urlSlug}</td>
                            <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-900">{sub.displayOrder}</td>
                            <td className="py-3.5 px-4 text-center">
                              {sub.activeStatus ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span> Inactive
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditSubcategory(sub)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                                  title="Edit Subcategory"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubcategory(sub)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer"
                                  title="Soft Delete Subcategory"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 px-4 text-center text-slate-400 text-xs">
                          No subcategory nodes located under parent branches.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Professional Deletion Blocked Custom Dialog Modal */}
      {deleteBlockInfo.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-red-50 px-6 py-5 border-b border-red-100 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-display font-extrabold text-slate-900">
                  {deleteBlockInfo.title}
                </h3>
                <p className="text-[10px] font-mono text-red-500 uppercase font-bold tracking-wider leading-none mt-1">
                  Safety Block Active
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                {deleteBlockInfo.message}
              </p>

              <div className="max-h-40 overflow-y-auto bg-slate-50 rounded-xl border border-slate-200/60 p-3.5 space-y-2">
                {deleteBlockInfo.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setDeleteBlockInfo(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4" id="delete-service-dialog">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Confirm Deletion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete the {confirmDelete.type} <strong className="text-slate-800">"{confirmDelete.name}"</strong>? This action is permanent and cannot be undone.
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
