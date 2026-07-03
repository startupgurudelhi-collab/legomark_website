/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrandMedia } from "../hooks/useBrandMedia.js";
import { 
  TrendingUp, 
  GraduationCap, 
  Heart, 
  Award, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  Users, 
  BookOpen, 
  UserCheck,
  Send,
  X,
  FileText,
  Building,
  Mail,
  Phone,
  Search,
  MapPin,
  Clock,
  Building2,
  Filter,
  Calendar,
  UploadCloud,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileCheck,
  PhoneCall,
  MessageSquare,
  Handshake,
  Scroll,
  DollarSign,
  Laptop
} from "lucide-react";
import { Button } from "../components/Button.js";

const INITIAL_JOBS = [
  {
    id: "legal-associate",
    title: "Legal Associate",
    department: "Legal",
    location: "New Delhi",
    employmentType: "Full Time",
    experience: "1-3 Years",
    salary: "Competitive",
    description: "Assist senior legal counsels in drafting and filing corporate law applications, agreements, intellectual property paperwork, and board resolutions.",
    responsibilities: [
      "Draft company incorporation papers, LLPs, and partner deeds.",
      "Conduct corporate filings under the Companies Act with the Registrar of Companies (ROC).",
      "Prepare and file trademark, copyright, and patent applications.",
      "Assist clients with post-incorporation licensing, regulatory approvals, and corporate compliance."
    ],
    skills: ["Company Law", "Legal Drafting", "Trademark Filing", "MCA Portal", "Due Diligence"],
    qualifications: "LL.B / Integrated LL.B degree from a reputed institution. CS (Company Secretary) inter or final cleared is a major plus.",
    benefits: [
      "Competitive base salary with monthly client-milestone incentives.",
      "Fully sponsored legal compliance webinars and professional certifications.",
      "Direct mentorship under seasoned trademark attorneys and senior corporate advocates.",
      "Health insurance coverage and generous annual leave cycle."
    ],
    workingHours: "Monday to Saturday (Alternate Saturday off) | 9:30 AM to 6:30 PM"
  },
  {
    id: "gst-tax-consultant",
    title: "GST & Tax Consultant",
    department: "Taxation",
    location: "New Delhi",
    employmentType: "Full Time",
    experience: "2-4 Years",
    salary: "Competitive",
    description: "Lead client taxation strategies, handle GST registration/filings, compile income tax returns, and coordinate with corporate partners.",
    responsibilities: [
      "Prepare, verify, and file monthly/quarterly GST returns (GSTR-1, GSTR-3B, GSTR-9).",
      "Compute and file corporate and individual Income Tax Returns (ITR).",
      "Represent clients and assist in preparing answers to tax inquiries or statutory notices.",
      "Advise startups on tax optimization strategies, tax holiday registrations, and Startup India benefits."
    ],
    skills: ["Direct Tax", "Indirect Tax (GST)", "ITR Filing", "Tally ERP / Zoho Books", "Financial Analysis"],
    qualifications: "B.Com (Hons), M.Com, or Semi-Qualified Chartered Accountant (CA).",
    benefits: [
      "Competitive industry-standard salary package with high client retention bonuses.",
      "Comprehensive medical and health insurance coverage for self and family.",
      "Sponsored entry to top-tier financial and tax compliance advisory summits.",
      "Subsidized continuous learning and statutory study material assistance."
    ],
    workingHours: "Monday to Saturday (Alternate Saturday off) | 9:30 AM to 6:30 PM"
  },
  {
    id: "business-dev-executive",
    title: "Business Development Executive",
    department: "Sales",
    location: "New Delhi",
    employmentType: "Full Time",
    experience: "0-2 Years",
    salary: "Competitive",
    description: "Drive customer acquisition, introduce corporate compliance packages to startups, and manage inbound leads with exceptional professionalism.",
    responsibilities: [
      "Connect with inbound business registration and legal compliance seekers.",
      "Present Legomark India's extensive compliance, intellectual property, and tax portfolio to startup founders.",
      "Build healthy strategic networks with incubators, co-working spaces, and legal-tech channels.",
      "Achieve monthly consulting volume, client onboarding goals, and revenue milestones."
    ],
    skills: ["Inbound Sales", "B2B Communication", "Lead Nurturing", "Client Relationship Management (CRM)", "Negotiation"],
    qualifications: "Any Graduate or MBA in Sales, Marketing, or Business Development.",
    benefits: [
      "High uncapped monthly performance commissions and performance bonus structures.",
      "Complete travel reimbursement and corporate communication devices.",
      "Fast-track vertical promotion opportunities to Account Manager in under 12 months.",
      "Weekly team-building outings, continuous training, and motivational rewards."
    ],
    workingHours: "Monday to Saturday (Alternate Saturday off) | 9:30 AM to 6:30 PM"
  },
  {
    id: "digital-marketing-executive",
    title: "Digital Marketing Executive",
    department: "Marketing",
    location: "New Delhi",
    employmentType: "Full Time",
    experience: "1-3 Years",
    salary: "Competitive",
    description: "Plan and execute digital brand campaigns, optimize SEO search rankings, and manage social media channels to increase startup acquisition.",
    responsibilities: [
      "Optimize search engine marketing (SEO/SEM) campaigns to capture organic high-intent traffic.",
      "Compose rich compliance articles, newsletter campaigns, and high-conversion ad copy.",
      "Curate engaging content calendars for LinkedIn, Twitter, and Meta channels.",
      "Monitor customer acquisition costs (CAC) and analyze performance metrics using modern tools."
    ],
    skills: ["SEO & SEM", "Google Analytics", "Content Strategy", "Social Media Marketing", "Copywriting"],
    qualifications: "Bachelor's degree in Marketing, Journalism, Public Relations, or related field.",
    benefits: [
      "Fully sponsored digital tools premium subscriptions (Semrush, Canva, etc.).",
      "Sponsored growth marketing bootcamps and certifications.",
      "Modern, highly creative, and non-bureaucratic work environment.",
      "Competitive salary with quarterly campaign performance rewards."
    ],
    workingHours: "Monday to Saturday (Alternate Saturday off) | 9:30 AM to 6:30 PM"
  },
  {
    id: "frontend-react-developer",
    title: "Frontend React Developer",
    department: "Technology",
    location: "Remote / Delhi",
    employmentType: "Full Time",
    experience: "2-4 Years",
    salary: "Competitive",
    description: "Design and develop ultra-responsive compliance portal features, partner integrations, and consumer-facing dashboards using React and Tailwind.",
    responsibilities: [
      "Engineer highly performant, accessible, and responsive user interfaces using React and Tailwind CSS.",
      "Optimize page speed, state synchronization, and render times across standard portals.",
      "Integrate backend APIs, authentication workflows, and webhook notifications smoothly.",
      "Advocate for dry code, thorough testing, and robust TypeScript typing standards."
    ],
    skills: ["React.js", "TypeScript", "Tailwind CSS", "Vite", "Framer Motion", "Git"],
    qualifications: "B.Tech / B.E. / BCA / MCA in Computer Science, IT, or equivalent experience.",
    benefits: [
      "Flexible hybrid/remote workspace configuration options.",
      "High-spec developer laptop allowance and tech-hub accessories sponsorship.",
      "Performance-linked ESOPs (Employee Stock Ownership Plans) on long-term tenure.",
      "Sponsored access to specialized developer courses and tech conferences."
    ],
    workingHours: "Monday to Friday | 10:00 AM to 7:00 PM"
  },
  {
    id: "customer-relationship-executive",
    title: "Customer Relationship Executive",
    department: "Customer Support",
    location: "New Delhi",
    employmentType: "Full Time",
    experience: "1-2 Years",
    salary: "Competitive",
    description: "Ensure exceptional post-sales relationship management, keep founders updated on filings, and collect feedback on services.",
    responsibilities: [
      "Liaise between clients and the compliance/legal production teams to track file progress.",
      "Deliver proactive, structured progress reports regarding incorporation and licensing milestones.",
      "Answer incoming client queries and resolve grievances with maximum courtesy.",
      "Drive customer retention, gather testimonial videos, and measure Net Promoter Scores (NPS)."
    ],
    skills: ["Customer Success", "Empathy", "Conflict Resolution", "Ticketing Tools", "Communication"],
    qualifications: "Bachelor's degree in any field; prior customer success/relationship experience is preferred.",
    benefits: [
      "Quarterly customer satisfaction excellence awards and cash prizes.",
      "Dedicated corporate wellness, mental health recharge, and mindfulness programs.",
      "Supportive team environment with clear peer learning structures.",
      "Guaranteed performance-linked annual appraisal increments."
    ],
    workingHours: "Monday to Saturday (Alternate Saturday off) | 9:30 AM to 6:30 PM"
  }
];

export default function CareerPage() {
  const { config: brandConfig } = useBrandMedia();
  // Dynamic jobs state: Can be fetched dynamically from the Admin CMS (e.g., fetch('/api/cms/jobs')) rather than being hardcoded.
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedJob, setSelectedJob] = useState<typeof INITIAL_JOBS[0] | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: INITIAL_JOBS[0]?.title || "General Application",
    experience: "1-3 Years",
    resumeUrl: "",
    coverLetter: "",
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // States for Section 7 (Premium Inline Job Application Form)
  const [inlineFormData, setInlineFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentCity: "",
    position: INITIAL_JOBS[0]?.title || "General Application (Compliance / Operations)",
    experience: "1-3 Years",
    qualification: "",
    currentCompany: "",
    expectedSalary: "",
    noticePeriod: "Immediate",
    coverLetter: "",
    certifiedAccurate: false
  });
  const [inlineResumeFile, setInlineResumeFile] = useState<File | null>(null);
  const [inlineResumeError, setInlineResumeError] = useState<string | null>(null);
  const [inlineResumeUploadProgress, setInlineResumeUploadProgress] = useState(0);
  const [inlineResumeUploading, setInlineResumeUploading] = useState(false);
  const [isInlineSubmitting, setIsInlineSubmitting] = useState(false);
  const [inlineSubmitSuccess, setInlineSubmitSuccess] = useState(false);
  const [inlineSubmitError, setInlineSubmitError] = useState<string | null>(null);

  // Drag and drop state
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for Section 9 (Career FAQs Accordion)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const whyJoinFeatures = [
    {
      title: "Professional Growth",
      description: "Build your career while working on real business, legal, and operational compliance projects with startups and enterprise-grade companies.",
      icon: TrendingUp,
      color: "text-brand-secondary-500 bg-brand-secondary-50 border-brand-secondary-100/50",
    },
    {
      title: "Learning Environment",
      description: "Work alongside experienced Chartered Accountants, Company Secretaries, and Trademark Attorneys to continuously enhance your statutory knowledge.",
      icon: GraduationCap,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100/50",
    },
    {
      title: "Positive Work Culture",
      description: "Enjoy a collaborative, highly respectful, energetic, and growth-oriented workplace designed to help you balance excellence and personal well-being.",
      icon: Heart,
      color: "text-rose-500 bg-rose-50 border-rose-100/50",
    },
    {
      title: "Career Development",
      description: "Benefit from transparent career roadmaps, performance-driven promotions, and long-term professional progression opportunities.",
      icon: Award,
      color: "text-amber-600 bg-amber-50 border-amber-100/50",
    },
    {
      title: "Modern Technology",
      description: "Work with modern digital workflow tools, automated documentation suites, and modern CRM systems to elevate operational efficiency.",
      icon: Cpu,
      color: "text-blue-600 bg-blue-50 border-blue-100/50",
    },
    {
      title: "Meaningful Impact",
      description: "Empower entrepreneurs and businesses across India to build, protect, and scale their ventures successfully with flawless regulatory guidance.",
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 border-purple-100/50",
    }
  ];

  const lifeTraits = [
    {
      title: "Professional Environment",
      description: "A meticulously styled corporate setting equipped with high-performance tools, ergonomic workstations, and secure private consultation booths.",
      icon: Briefcase,
    },
    {
      title: "Collaborative Team",
      description: "Cross-functional synergy where junior associates, senior corporate lawyers, and software developers build solutions together.",
      icon: Users,
    },
    {
      title: "Continuous Learning",
      description: "Structured compliance webinars, peer-to-peer technical reviews, and sponsored professional certifications to level-up your expertise.",
      icon: BookOpen,
    },
    {
      title: "Client-Centric Approach",
      description: "Deep pride in legal integrity, fast turnaround cycles, and maintaining a stellar 98% client satisfaction rating nationwide.",
      icon: UserCheck,
    }
  ];

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!formData.agreeToTerms) {
      setSubmitError("Please authorize Legomark India to contact you regarding your application.");
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setSubmitError("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formType: `Job Application: ${formData.position}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          companyName: `Applicant (Exp: ${formData.experience})`,
          service: "Business Advisory",
          message: `Job Position: ${formData.position}\nExperience: ${formData.experience}\nResume: ${formData.resumeUrl || "Provided in next steps"}\nCover Letter: ${formData.coverLetter}`
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          position: "Corporate Advisory Executive",
          experience: "1-3 Years",
          resumeUrl: "",
          coverLetter: "",
          agreeToTerms: false
        });
      } else {
        setSubmitError(result.message || "Something went wrong while submitting. Please try again.");
      }
    } catch (err) {
      setSubmitError("Failed to submit. Please check your network connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section 7 File Upload & Inline Submission Handlers
  const processResumeFile = (file: File) => {
    setInlineResumeError(null);
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isValidExtension = ["pdf", "doc", "docx"].includes(fileExtension || "");
    
    if (!isValidExtension) {
      setInlineResumeError("Invalid file type. Please upload a PDF, DOC, or DOCX file.");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setInlineResumeError("File size exceeds 10 MB limit.");
      return;
    }
    
    setInlineResumeFile(file);
    simulateResumeUpload(file);
  };

  const simulateResumeUpload = (file: File) => {
    setInlineResumeUploading(true);
    setInlineResumeUploadProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setInlineResumeUploadProgress(100);
        setInlineResumeUploading(false);
        clearInterval(interval);
      } else {
        setInlineResumeUploadProgress(currentProgress);
      }
    }, 150);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processResumeFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeResumeFile = () => {
    setInlineResumeFile(null);
    setInlineResumeUploadProgress(0);
    setInlineResumeError(null);
  };

  const handleInlineApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineSubmitError(null);
    
    if (!inlineFormData.certifiedAccurate) {
      setInlineSubmitError("Please certify that the provided information is accurate.");
      return;
    }
    
    if (!inlineResumeFile) {
      setInlineSubmitError("Please upload your resume to complete your application.");
      return;
    }

    const cleanPhone = inlineFormData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setInlineSubmitError("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsInlineSubmitting(true);
    
    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formType: `Inline Job Application: ${inlineFormData.position}`,
          name: inlineFormData.name,
          email: inlineFormData.email,
          phone: inlineFormData.phone,
          companyName: inlineFormData.currentCompany || "Not Specified",
          service: "Career Inquiry",
          message: [
            `Position: ${inlineFormData.position}`,
            `City: ${inlineFormData.currentCity}`,
            `Experience: ${inlineFormData.experience}`,
            `Qualification: ${inlineFormData.qualification}`,
            `Expected Salary: ${inlineFormData.expectedSalary || "Not Specified"}`,
            `Notice Period: ${inlineFormData.noticePeriod}`,
            `Resume Name: ${inlineResumeFile.name} (${(inlineResumeFile.size / (1024 * 1024)).toFixed(2)} MB)`,
            `Cover Letter: ${inlineFormData.coverLetter || "None Provided"}`
          ].join("\n")
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setInlineSubmitSuccess(true);
        setInlineFormData({
          name: "",
          email: "",
          phone: "",
          currentCity: "",
          position: INITIAL_JOBS[0]?.title || "General Application (Compliance / Operations)",
          experience: "1-3 Years",
          qualification: "",
          currentCompany: "",
          expectedSalary: "",
          noticePeriod: "Immediate",
          coverLetter: "",
          certifiedAccurate: false
        });
        setInlineResumeFile(null);
        setInlineResumeUploadProgress(0);
      } else {
        setInlineSubmitError(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setInlineSubmitError("Failed to submit. Please check your network connection and try again.");
    } finally {
      setIsInlineSubmitting(false);
    }
  };

  const handleScrollToFormAndSelect = (jobTitle: string) => {
    setInlineFormData(prev => ({ ...prev, position: jobTitle }));
    const formSection = document.getElementById("job-application-form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = selectedDepartment === "All" || job.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const handleScrollToPositions = () => {
    const section = document.getElementById("current-positions-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-brand-secondary-200 selection:text-brand-secondary-950 font-sans" id="career-page-root">
      
      {/* SECTION 1: HERO BANNER (Matches AboutPage premium styling) */}
      <section className="relative bg-brand-primary-950 text-white overflow-hidden py-24 lg:py-32" id="career-hero">
        {/* Abstract background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Soft radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-secondary-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex px-3 py-1 text-xs font-mono font-semibold text-brand-secondary-400 bg-brand-primary-900/60 rounded-full border border-brand-secondary-500/20 uppercase tracking-widest">
            Shape the Future of Compliance
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-none text-white">
            Careers at <span className="text-brand-secondary-400">Legomark India</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Join a growing team that's helping entrepreneurs and businesses across India simplify legal, taxation and compliance services through technology and professional expertise.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={handleScrollToPositions}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white font-bold rounded-xl shadow-lg shadow-brand-secondary-500/10 hover:shadow-brand-secondary-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              id="hero-view-positions"
            >
              <Briefcase className="h-4 w-4" />
              View Open Positions
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-white/20 hover:border-white bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              id="hero-apply-now"
            >
              <Send className="h-4 w-4 text-brand-secondary-400" />
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY JOIN LEGOMARK INDIA */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-100" id="why-join-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary-500 animate-pulse" />
              Empowerment &amp; Values
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Why Join Legomark India
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              We provide an ecosystem centered around continuous learning, modern digital workflows, and deep corporate advisory exposure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" id="why-join-cards">
            {whyJoinFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/70 p-6 md:p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  id={`why-join-card-${idx}`}
                >
                  <div className="space-y-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${feat.color} shadow-inner transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-black text-lg text-brand-primary-950 tracking-tight flex items-center gap-2">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                        {feat.title}
                      </h3>
                      <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 3: LIFE AT LEGOMARK */}
      <section className="py-20 md:py-28 bg-slate-50" id="life-at-legomark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Image Container */}
            <div className="lg:col-span-6 space-y-4" id="life-gallery-container">
              <div className="relative rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shadow-lg aspect-[4/3] group">
                <img
                  src={brandConfig.careerBanner.url}
                  alt="Legomark India Premium Workplace"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 text-white z-10 space-y-1">
                  <span className="text-[10px] font-mono tracking-widest font-black text-brand-secondary-400 uppercase">
                    LEGOMARK CAMPUS
                  </span>
                  <p className="text-lg font-display font-bold">New Delhi Corporate Hub</p>
                </div>
              </div>
            </div>

            {/* Content Traits */}
            <div className="lg:col-span-6 space-y-8" id="life-traits-container">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary-600 uppercase block">
                  Workplace Culture
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
                  Life at Legomark
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">
                  We believe that the best work happens in an atmosphere that nurtures continuous professional refinement, teamwork, and client satisfaction. Here's what shapes our daily campus life:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="life-traits-grid">
                {lifeTraits.map((trait, idx) => {
                  const TraitIcon = trait.icon;
                  return (
                    <div key={idx} className="space-y-2.5 p-1" id={`life-trait-${idx}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-brand-primary-950 text-white flex items-center justify-center shrink-0">
                          <TraitIcon className="h-4.5 w-4.5" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-display uppercase tracking-tight">
                          {trait.title}
                        </h4>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed font-medium">
                        {trait.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: CURRENT OPEN POSITIONS */}
      <section className="py-20 md:py-28 bg-white border-t border-b border-slate-100" id="current-positions-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary-500 animate-pulse" />
              Join Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight">
              Current Opportunities
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Explore exciting career opportunities and become part of our growing professional team.
            </p>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="max-w-4xl mx-auto space-y-6" id="search-filter-controls">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-secondary-500 transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search by Job Title, Department, or Skills (e.g., React, Taxation, Legal...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:border-brand-secondary-500 focus:bg-white focus:ring-4 focus:ring-brand-secondary-500/5 transition-all duration-300 shadow-inner"
              />
            </div>

            {/* Department Filter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2" id="department-chips">
              {["All", "Legal", "Taxation", "Sales", "Marketing", "Technology", "Customer Support", "Administration"].map((dept) => {
                const isActive = selectedDepartment === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? "bg-brand-primary-950 text-white shadow-md scale-102" 
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* JOB CARDS LIST & EMPTY STATE */}
          <div className="max-w-6xl mx-auto">
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" id="job-cards-grid">
                {filteredJobs.map((job) => {
                  // Assign colors based on department
                  let deptColor = "bg-slate-50 text-slate-700 border-slate-200/50";
                  if (job.department === "Legal") deptColor = "bg-indigo-50 text-indigo-700 border-indigo-100";
                  else if (job.department === "Taxation") deptColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  else if (job.department === "Sales") deptColor = "bg-amber-50 text-amber-700 border-amber-100";
                  else if (job.department === "Marketing") deptColor = "bg-rose-50 text-rose-700 border-rose-100";
                  else if (job.department === "Technology") deptColor = "bg-blue-50 text-blue-700 border-blue-100";
                  else if (job.department === "Customer Support") deptColor = "bg-purple-50 text-purple-700 border-purple-100";

                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl border border-slate-200/70 p-6 md:p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group animate-fade-in"
                      id={`job-card-${job.id}`}
                    >
                      <div className="space-y-4">
                        {/* Upper row: Badge & Salary */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border ${deptColor}`}>
                            {job.department}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100/60 px-2 py-1 rounded-md">
                            Salary: {job.salary}
                          </span>
                        </div>

                        {/* Title */}
                        <div className="space-y-1">
                          <h3 className="font-display font-black text-lg text-brand-primary-950 tracking-tight group-hover:text-brand-secondary-500 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-medium">
                            {job.description}
                          </p>
                        </div>

                        {/* Badges / Meta */}
                        <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-mono text-slate-500 border-t border-slate-100">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate text-[9px]">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1 justify-center">
                            <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate text-[9px]">{job.employmentType}</span>
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate text-[9px]">{job.experience}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 pt-6 border-t border-slate-100/80 mt-6">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="flex-1 text-center py-2.5 px-3 border border-slate-200 text-slate-700 hover:text-brand-secondary-500 hover:border-brand-secondary-300 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer"
                          id={`view-details-${job.id}`}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleScrollToFormAndSelect(job.title)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                          id={`apply-now-${job.id}`}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* NO OPENINGS STATE */
              <div className="text-center py-16 px-4 bg-white border border-slate-200/80 rounded-2xl max-w-xl mx-auto space-y-6 shadow-sm" id="empty-positions-state">
                <div className="h-16 w-16 rounded-full bg-brand-secondary-50 border border-brand-secondary-100 text-brand-secondary-500 flex items-center justify-center mx-auto shadow-inner">
                  <Briefcase className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-black text-xl text-brand-primary-950 tracking-tight">
                    No Matching Openings Found
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-sm mx-auto font-medium">
                    We're always looking for talented professionals. Submit a general profile and our recruitment team will reach out once a matching vacancy aligns.
                  </p>
                </div>
                <button
                  onClick={() => handleScrollToFormAndSelect("General Application (Compliance / Operations)")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary-950 hover:bg-brand-primary-900 text-white text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  id="submit-general-application-btn"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit General Application
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* SECTION 6: OUR HIRING PROCESS */}
      <section className="py-20 md:py-28 bg-slate-50 border-b border-slate-100" id="hiring-process-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
              How We Onboard Talent
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight animate-fade-in">
              Our Hiring Process
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              We've designed a structured, transparent, and prompt hiring process to help us find the perfect match.
            </p>
          </div>

          {/* Timeline Grid */}
          <div className="relative max-w-6xl mx-auto">
            {/* Desktop Horizontal Connector Line */}
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 border-t-2 border-dashed border-slate-200 -translate-y-8 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Application Submitted",
                  description: "Submit your profile and updated resume via our active positions or general application form.",
                  icon: FileCheck,
                  color: "bg-blue-50 border-blue-100 text-blue-600"
                },
                {
                  step: "02",
                  title: "Initial Screening",
                  description: "Our talent acquisition team reviews your skills, qualifications, and background.",
                  icon: PhoneCall,
                  color: "bg-indigo-50 border-indigo-100 text-indigo-600"
                },
                {
                  step: "03",
                  title: "Technical / HR Interview",
                  description: "Engage in an in-depth conversation exploring your core compliance or business competency.",
                  icon: MessageSquare,
                  color: "bg-purple-50 border-purple-100 text-purple-600"
                },
                {
                  step: "04",
                  title: "Final Discussion",
                  description: "Meet with senior leadership and managing partners to align on expectations and goals.",
                  icon: Handshake,
                  color: "bg-amber-50 border-amber-100 text-amber-600"
                },
                {
                  step: "05",
                  title: "Offer Letter",
                  description: "Receive a transparent, comprehensive compensation, benefits, and career roadmap proposal.",
                  icon: Scroll,
                  color: "bg-emerald-50 border-emerald-100 text-emerald-600"
                },
                {
                  step: "06",
                  title: "Welcome to Legomark",
                  description: "Complete seamless digital onboarding and begin your high-impact corporate journey with us.",
                  icon: Sparkles,
                  color: "bg-rose-50 border-rose-100 text-rose-600"
                }
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 group">
                    {/* Circle icon with Step number */}
                    <div className="relative">
                      <div className={`h-16 w-16 rounded-2xl border-2 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 ${step.color} z-10 relative`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="absolute -top-3.5 -right-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wider bg-slate-900 text-white shadow-md z-20">
                        {step.step}
                      </span>
                    </div>

                    <div className="space-y-1 md:max-w-[180px]">
                      <h4 className="font-display font-black text-sm md:text-base text-brand-primary-950 tracking-tight leading-snug group-hover:text-brand-secondary-500 transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-slate-400 text-xs md:text-[11px] leading-relaxed font-semibold">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: JOB APPLICATION FORM */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-100" id="job-application-form-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-primary-950 bg-slate-50 border border-slate-200/50">
              Talent Acquisition Form
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight animate-fade-in">
              Job Application Form
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Complete the premium inquiry fields below and attach your official professional resume to initiate our comprehensive compliance and interview vetting.
            </p>
          </div>

          <div className="bg-slate-50/40 rounded-3xl border border-slate-200/70 p-6 md:p-12 shadow-sm relative">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 inset-x-0 h-1 rounded-t-3xl bg-gradient-to-r from-brand-primary-950 to-brand-secondary-500" />

            {inlineSubmitSuccess ? (
              <div className="text-center space-y-6 py-12 animate-fade-in" id="inline-apply-success-box">
                <div className="h-20 w-20 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-brand-primary-950 font-display font-extrabold text-2xl tracking-tight">
                    Application Registered Successfully!
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto font-medium">
                    Thank you for expressing your interest in joining Legomark India. Your profile details, compliance questionnaire, and statutory credentials have been securely stored in our recruitment CRM database.
                  </p>
                  <p className="text-brand-secondary-600 text-xs font-mono font-bold">
                    Our talent acquisition specialists will review your application and contact you within 24–48 business hours.
                  </p>
                </div>
                <button
                  onClick={() => setInlineSubmitSuccess(false)}
                  className="px-6 py-3 bg-brand-primary-950 hover:bg-brand-primary-900 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleInlineApplySubmit} className="space-y-6">
                {inlineSubmitError && (
                  <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse shrink-0" />
                    {inlineSubmitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={inlineFormData.name}
                      onChange={(e) => setInlineFormData({ ...inlineFormData, name: e.target.value })}
                      placeholder="e.g. Meera Nair"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/5 transition-all font-semibold text-slate-800"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={inlineFormData.email}
                      onChange={(e) => setInlineFormData({ ...inlineFormData, email: e.target.value })}
                      placeholder="e.g. meera@domain.com"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/5 transition-all font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={inlineFormData.phone}
                      onChange={(e) => setInlineFormData({ ...inlineFormData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/5 transition-all font-semibold text-slate-800"
                    />
                  </div>

                  {/* Current City */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Current City *</label>
                    <input
                      type="text"
                      required
                      value={inlineFormData.currentCity}
                      onChange={(e) => setInlineFormData({ ...inlineFormData, currentCity: e.target.value })}
                      placeholder="e.g. New Delhi"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/5 transition-all font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Position Applying For */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Position Applying For *</label>
                    <select
                      value={inlineFormData.position}
                      onChange={(e) => setInlineFormData({ ...inlineFormData, position: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/5 transition-all font-bold"
                    >
                      {jobs.map((job) => (
                        <option key={job.id} value={job.title}>{job.title}</option>
                      ))}
                      <option value="General Application (Compliance / Operations)">General Application (Compliance / Operations)</option>
                    </select>
                  </div>

                  {/* Years of Experience */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Years of Experience *</label>
                    <select
                      value={inlineFormData.experience}
                      onChange={(e) => setInlineFormData({ ...inlineFormData, experience: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/5 transition-all font-bold"
                    >
                      <option value="Fresher / Intern">Fresher / Intern</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Highest Qualification */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Highest Qualification *</label>
                    <input
                      type="text"
                      required
                      value={inlineFormData.qualification}
                      onChange={(e) => setInlineFormData({ ...inlineFormData, qualification: e.target.value })}
                      placeholder="e.g. LL.B / MBA / B.Com (Hons)"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/5 transition-all font-semibold text-slate-800"
                    />
                  </div>

                  {/* Notice Period */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Notice Period *</label>
                    <select
                      value={inlineFormData.noticePeriod}
                      onChange={(e) => setInlineFormData({ ...inlineFormData, noticePeriod: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/5 transition-all font-bold"
                    >
                      <option value="Immediate">Immediate / Serving Notice</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                      <option value="45 Days">45 Days</option>
                      <option value="60+ Days">60+ Days</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Company (Optional) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Current Company (Optional)</label>
                    <input
                      type="text"
                      value={inlineFormData.currentCompany}
                      onChange={(e) => setInlineFormData({ ...inlineFormData, currentCompany: e.target.value })}
                      placeholder="e.g. XYZ Consultants Ltd."
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/5 transition-all font-semibold text-slate-800"
                    />
                  </div>

                  {/* Expected Salary (Optional) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Expected Salary (Optional)</label>
                    <input
                      type="text"
                      value={inlineFormData.expectedSalary}
                      onChange={(e) => setInlineFormData({ ...inlineFormData, expectedSalary: e.target.value })}
                      placeholder="e.g. Competitive / INR 6,00,000"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/5 transition-all font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Brief Cover Letter</label>
                  <textarea
                    rows={4}
                    value={inlineFormData.coverLetter}
                    onChange={(e) => setInlineFormData({ ...inlineFormData, coverLetter: e.target.value })}
                    placeholder="Describe your motivation, technical competencies, and legal compliance aspirations..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-500/5 transition-all resize-none font-semibold text-slate-800"
                  />
                </div>

                {/* Resume Upload (Drag & Drop) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Resume File Attachment *</label>
                  
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                      dragActive 
                        ? "border-brand-secondary-500 bg-brand-secondary-50/25" 
                        : "border-slate-200 hover:border-brand-secondary-300 bg-white"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {inlineResumeFile ? (
                      <div className="w-full max-w-md text-center space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="h-12 w-12 rounded-full bg-brand-secondary-50 border border-brand-secondary-100 text-brand-secondary-500 flex items-center justify-center mx-auto">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {inlineResumeFile.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {(inlineResumeFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>

                        {/* Progress or check */}
                        {inlineResumeUploading ? (
                          <div className="space-y-2">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-brand-secondary-500 rounded-full transition-all duration-150" 
                                style={{ width: `${inlineResumeUploadProgress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-500 animate-pulse">
                              Uploading Resume... {inlineResumeUploadProgress}%
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3 pt-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
                              <Check className="h-3 w-3" />
                              Ready for submission
                            </span>
                            <button
                              type="button"
                              onClick={removeResumeFile}
                              className="text-[10px] font-mono font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer"
                            >
                              Remove file
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-xs font-bold text-slate-800">
                            Drag &amp; drop your resume here, or <span className="text-brand-secondary-500 underline">browse files</span>
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold">
                            Supported Formats: PDF, DOC, DOCX (Max 10 MB)
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {inlineResumeError && (
                    <p className="text-[10px] font-bold text-rose-500 animate-fade-in">
                      {inlineResumeError}
                    </p>
                  )}
                </div>

                {/* Verification Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="certifiedAccurate"
                    required
                    checked={inlineFormData.certifiedAccurate}
                    onChange={(e) => setInlineFormData({ ...inlineFormData, certifiedAccurate: e.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 text-brand-secondary-500 focus:ring-brand-secondary-400 mt-0.5 accent-brand-secondary-500 cursor-pointer"
                  />
                  <label htmlFor="certifiedAccurate" className="text-[11px] text-slate-500 leading-normal font-semibold select-none cursor-pointer">
                    I certify that the information provided is accurate, complete, and verifiable. I authorize Legomark India HR and onboarding departments to perform professional audits and credentials verification.
                  </label>
                </div>

                {/* Submit Application Button */}
                <button
                  type="submit"
                  disabled={isInlineSubmitting || inlineResumeUploading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-primary-950 hover:bg-brand-primary-900 disabled:bg-slate-300 text-white text-xs font-black font-mono uppercase tracking-widest rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                >
                  {isInlineSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Transmitting Profile...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 8: EMPLOYEE BENEFITS */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-100" id="employee-benefits-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200/50">
              Why You'll Love Working Here
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight animate-fade-in">
              Our Employee Benefits
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              We offer comprehensive perks, professional development plans, and a supportive environment to empower your long-term success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Competitive Salary",
                description: "Highly rewarding industry-standard base pay with transparent client onboarding or performance milestone incentives.",
                icon: DollarSign,
                color: "text-emerald-600 bg-emerald-50 border-emerald-100/50"
              },
              {
                title: "Flexible Working Environment",
                description: "Balance remote productivity and in-office synergy with hybrid options, collaborative hubs, and flexible timings.",
                icon: Laptop,
                color: "text-blue-600 bg-blue-50 border-blue-100/50"
              },
              {
                title: "Learning & Development",
                description: "Stay ahead with fully sponsored statutory webinars, corporate compliance certificates, and continuous legal training courses.",
                icon: GraduationCap,
                color: "text-indigo-600 bg-indigo-50 border-indigo-100/50"
              },
              {
                title: "Performance Recognition",
                description: "Regular appraisals, high-performer spotlight awards, tenure rewards, and monthly peer-to-peer nomination cash bonuses.",
                icon: Award,
                color: "text-amber-600 bg-amber-50 border-amber-100/50"
              },
              {
                title: "Paid Leave",
                description: "Recharge fully with comprehensive paid leaves, sick allowances, national holiday periods, and custom wellness mental days.",
                icon: Calendar,
                color: "text-rose-600 bg-rose-50 border-rose-100/50"
              },
              {
                title: "Career Growth Opportunities",
                description: "Follow clear vertical promotion roadmaps designed to help you scale into managerial and advisory partners rapidly.",
                icon: TrendingUp,
                color: "text-purple-600 bg-purple-50 border-purple-100/50"
              }
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/50 rounded-2xl border border-slate-200/40 p-6 md:p-8 space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${benefit.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-base text-brand-primary-950 tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-semibold">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9: CAREER FAQS */}
      <section className="py-20 md:py-28 bg-slate-50 border-b border-slate-100" id="career-faqs-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary-950 tracking-tight animate-fade-in">
              Recruitment FAQs
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Have questions about building your career with Legomark India? Find your answers below.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How can I apply?",
                answer: "You can apply directly online by scrolling down to our Job Application Form, choosing your desired target role, uploading your resume in PDF/DOC/DOCX, and clicking Submit. Alternatively, browse the current active openings and click 'Apply Now'."
              },
              {
                question: "What is the recruitment process?",
                answer: "Our structured process includes: 1) Initial profile and resume review; 2) Brief phone screening with a talent recruiter; 3) Comprehensive technical and HR discussions; 4) Interview alignment with managing partners; and 5) Formal offer release."
              },
              {
                question: "Do you offer internships?",
                answer: "Yes! We run robust winter and summer internship cohorts for legal, taxation, digital marketing, and software engineering. Outstanding interns who meet performance milestones are frequently considered for full-time Pre-Placement Offers (PPOs)."
              },
              {
                question: "Are remote opportunities available?",
                answer: "We support highly flexible workspace structures! Technology and selected marketing roles are open to hybrid or fully remote arrangements. Legal compliance and taxation consulting roles are typically based at our primary New Delhi corporate office."
              },
              {
                question: "How long does the hiring process take?",
                answer: "We value your time! Our talent acquisition team actively screens submissions daily. Typically, the transition from application submission to final partner discussion and offer letter release is completed within 7 to 14 business days."
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-sm md:text-base text-brand-primary-950 hover:text-brand-secondary-500 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="shrink-0 ml-4 p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-500">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs md:text-sm text-slate-500 leading-relaxed font-semibold font-sans">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 10: FINAL CTA */}
      <section className="relative overflow-hidden bg-brand-primary-950 py-20 md:py-24 animate-fade-in" id="final-cta-section">
        {/* Subtle glowing accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-brand-secondary-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-none">
              Ready to Build Your Career With Us?
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed font-semibold">
              Join a team committed to delivering excellence in legal, taxation and business consultancy services across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                const section = document.getElementById("job-application-form-section");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-brand-secondary-500/20 cursor-pointer"
            >
              Apply Online Now
            </button>
            <a
              href="mailto:hr@legomarkindia.com"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-bold text-sm rounded-xl transition-all duration-300 text-center cursor-pointer"
            >
              Contact HR
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 5: JOB DETAIL MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="job-detail-modal">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Top decorative stripe */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-primary-950 via-brand-secondary-500 to-emerald-500" />
            
            {/* Header */}
            <div className="p-6 md:p-8 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50">
                  {selectedJob.department}
                </span>
                <h3 className="text-xl md:text-2xl font-display font-black text-brand-primary-950 tracking-tight">
                  {selectedJob.title}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {selectedJob.employmentType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Exp: {selectedJob.experience}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="h-8 w-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0 mt-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700">
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
                  Role Overview
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans font-medium">
                  {selectedJob.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
                  Key Responsibilities
                </h4>
                <ul className="space-y-2">
                  {selectedJob.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-slate-600 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary-500 mt-2 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
                  Required Competencies &amp; Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
                  Educational &amp; Professional Qualifications
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans font-medium">
                  {selectedJob.qualifications}
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
                  Perks &amp; Benefits
                </h4>
                <ul className="space-y-2">
                  {selectedJob.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-slate-600 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Working Hours */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                  Shift &amp; Timings
                </span>
                <p className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-brand-secondary-500" />
                  {selectedJob.workingHours}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-mono">
                Salary: <strong className="text-brand-primary-950">{selectedJob.salary}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleScrollToFormAndSelect(selectedJob.title);
                    setSelectedJob(null);
                  }}
                  className="px-6 py-2.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  Apply For This Position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTPRINT BAR */}
      <div className="py-8 bg-brand-primary-950 text-slate-500 text-center text-xs font-mono border-t border-brand-primary-900">
        Legomark India &bull; Human Resources Department &bull; ISO 9001:2015 Certified
      </div>

      {/* JOB APPLICATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="career-apply-modal">
          <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
            {/* Top Stripe */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-primary-950 to-brand-secondary-500" />
            
            {/* Modal Header */}
            <div className="p-6 pb-0 flex items-center justify-between">
              <h3 className="text-lg font-display font-black text-brand-primary-950 tracking-tight">
                Submit Your Profile
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSubmitSuccess(false);
                  setSubmitError(null);
                }}
                className="h-8 w-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {submitSuccess ? (
                <div className="text-center space-y-4 py-4" id="apply-success-box">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-emerald-900 font-display font-bold text-lg">Application Registered!</h4>
                    <p className="text-emerald-700 text-xs md:text-sm leading-relaxed max-w-sm mx-auto font-medium">
                      Thank you for applying to Legomark India. Our recruitment and talent acquisition department will review your profile and contact you within 24-48 business hours.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSubmitSuccess(false);
                    }}
                    className="mt-4 px-6 py-2.5 bg-brand-primary-950 hover:bg-brand-primary-900 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    Close Dialog
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Meera Nair"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. meera@domain.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Target Position */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Target Position</label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors"
                      >
                        {jobs.map((job) => (
                          <option key={job.id} value={job.title}>{job.title}</option>
                        ))}
                        <option value="General Application (Compliance / Operations)">General Application (Compliance / Operations)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Experience level */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Total Experience</label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors"
                      >
                        <option value="Fresher / Intern">Fresher / Intern</option>
                        <option value="1-3 Years">1-3 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5+ Years">5+ Years</option>
                      </select>
                    </div>

                    {/* Resume link */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Resume Link (GDrive/Dropbox)</label>
                      <input
                        type="url"
                        value={formData.resumeUrl}
                        onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                        placeholder="e.g. https://drive.google.com/..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Brief Cover Letter */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Why do you want to join us?</label>
                    <textarea
                      rows={3}
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                      placeholder="Briefly describe your skill set and aspirations..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary-500 focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  {/* Terms check */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="modalAgree"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-brand-secondary-500 focus:ring-brand-secondary-400 mt-0.5 accent-brand-secondary-500 cursor-pointer"
                    />
                    <label htmlFor="modalAgree" className="text-[10px] text-slate-500 leading-normal select-none cursor-pointer">
                      I declare the submitted details are correct and authorize Legomark India HR to verify and contact me.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-secondary-500 hover:bg-brand-secondary-600 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Profile...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        Submit Application
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
