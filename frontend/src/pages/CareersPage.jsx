import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, IndianRupee,
  Heart, Globe, Award, Users as UsersIcon,
  ArrowRight, Upload, Mail, Phone, FileText,
  CheckCircle, Clock, Home, Linkedin, Github,
  ExternalLink, Menu, X, LogIn, Users, TrendingUp, Shield,
  Zap, ChevronRight, BarChart3, Calendar, X as XIcon, Moon, Sun
} from 'lucide-react';
import LiteHRLogo from '../images/LiteHR_logo.png';
import { toast } from 'react-hot-toast';
import jobService from '../services/jobService';
import Chatbot from "../components/Chatbot";


export default function CareersPage() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    coverLetter: '',
    linkedin: '',
    github: '',
    resume: null,
    resumeName: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null); // For Application Form
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const [viewJob, setViewJob] = useState(null); // For Details Modal
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);

  // Theme colors based on current theme
  const theme = {
    dark: {
      background: '#0F172A',
      card: '#1E293B',
      cardHover: '#334155',
      border: '#334155',
      text: {
        primary: '#F1F5F9',
        secondary: '#CBD5E1',
        muted: '#94A3B8',
        disabled: '#64748B'
      },
      gradient: {
        from: '#0F172A',
        to: '#1E293B'
      },
      heroGradient: 'from-[#0F172A] to-[#1E293B]',
      ctaGradient: 'from-[#8B5CF6] to-[#10B981]'
    },
    light: {
      background: '#F8FAFC',
      card: '#FFFFFF',
      cardHover: '#F1F5F9',
      border: '#E5E7EB',
      text: {
        primary: '#111827',
        secondary: '#374151',
        muted: '#6B7280',
        disabled: '#9CA3AF'
      },
      gradient: {
        from: '#F8FAFC',
        to: '#FFFFFF'
      },
      heroGradient: 'from-[#F8FAFC] to-[#FFFFFF]',
      ctaGradient: 'from-[#8B5CF6] to-[#10B981]'
    }
  };

  const currentTheme = isDarkTheme ? theme.dark : theme.light;

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== null) {
      setIsDarkTheme(savedTheme === 'dark');
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.text.primary;
  }, [isDarkTheme, currentTheme]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getPublicJobs();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load open positions");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Navigation handlers
  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleFeaturesClick = () => {
    navigate("/");
    setTimeout(() => {
      const features = document.getElementById('features');
      if (features) features.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleModulesClick = () => {
    navigate("/");
    setTimeout(() => {
      const modules = document.getElementById('modules');
      if (modules) modules.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to open positions
  const scrollToOpenPositions = () => {
    // First scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Then after a short delay, scroll to the open positions section
    setTimeout(() => {
      const element = document.getElementById('open-positions');
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const benefits = [
    { icon: <IndianRupee size={24} />, title: "Competitive Salary", description: "Above industry average compensation with regular reviews" },
    { icon: <Heart size={24} />, title: "Health & Wellness", description: "Comprehensive medical, dental, vision insurance for you and family" },
    { icon: <Globe size={24} />, title: "Remote Friendly", description: "Work from anywhere with flexible hours" },
    { icon: <Award size={24} />, title: "Career Growth", description: "Regular promotions, learning budget, and conference allowances" },
    { icon: <UsersIcon size={24} />, title: "Team Culture", description: "Collaborative, inclusive environment with regular team events" },
    { icon: <Briefcase size={24} />, title: "Flexible PTO", description: "Unlimited vacation days and paid time off" },
  ];

  // Open apply modal
  const handleApplyClick = (job, e) => {
    if (e) e.stopPropagation(); // Prevent opening details modal if clicking apply button directly
    setSelectedJob(job);
    setApplicationForm({
      ...applicationForm,
      position: job.title
    });
    setShowApplicationModal(true);
    setShowJobDetailsModal(false); // Close details if open
  };

  // Open details modal
  const handleViewJob = (job) => {
    setViewJob(job);
    setShowJobDetailsModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowApplicationModal(false);
    setShowJobDetailsModal(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        alert('Please upload PDF or DOC/DOCX files only');
        return;
      }
      setApplicationForm({
        ...applicationForm,
        resume: file,
        resumeName: file.name
      });
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    if (!applicationForm.resume) {
      toast.error('Please upload your resume');
      return;
    }

    if (!selectedJob) {
      toast.error('Please select a position');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('jobId', selectedJob.id);
      formData.append('name', applicationForm.name);
      formData.append('email', applicationForm.email);
      formData.append('phone', applicationForm.phone);
      formData.append('resume', applicationForm.resume);
      formData.append('coverLetter', applicationForm.coverLetter);
      formData.append('linkedin', applicationForm.linkedin);
      formData.append('github', applicationForm.github);

      formData.append('currentCompany', '');
      formData.append('experience', '');

      await jobService.createJobApplication(formData);

      // Reset form and show success
      setApplicationForm({
        name: '',
        email: '',
        phone: '',
        position: '',
        coverLetter: '',
        linkedin: '',
        github: '',
        resume: null,
        resumeName: ''
      });
      setSelectedJob(null);
      setShowSuccess(true);
      setShowApplicationModal(false); // Close modal on success
      toast.success("Application submitted successfully!");

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error.response?.data?.message || "Failed to submit application");
    }
  };

  // Helper function to format salary with ₹ symbol
  const formatSalary = (job) => {
    if (job.salaryRangeMin && job.salaryRangeMax) {
      return `₹${Number(job.salaryRangeMin).toLocaleString('en-IN')} - ₹${Number(job.salaryRangeMax).toLocaleString('en-IN')}`;
    } else if (job.salary) {
      return job.salary.includes('₹') ? job.salary : `₹${job.salary}`;
    }
    return 'Not specified';
  };

  // Helper function to format experience
  const formatExperience = (job) => {
    if (job.experienceMin) {
      return `${job.experienceMin} ${job.experienceMin === "0" ? "Fresher" : "years+"}`;
    }
    return 'Experience not specified';
  };

  return (
    <div className="min-h-screen transition-colors duration-500 relative"
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.text.primary
      }}>
      {/* ============= PREMIUM NAVBAR ============= */}
      <header className={`
        fixed top-0 left-0 w-full h-16 
        backdrop-blur-md
        flex items-center justify-between 
        shadow-[0_3px_20px_rgba(0,0,0,0.35)]
        z-50 px-6 md:px-20 border-b
      `}
        style={{
          backgroundColor: `${isDarkTheme ? '#0F172A' : '#F8FAFC'}CC`,
          borderColor: currentTheme.border
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleHomeClick}
        >
          <img
            src={LiteHRLogo}
            alt="LiteHR"
            className="h-10 w-26 object-contain rounded-md"
            style={{ filter: !isDarkTheme ? 'brightness(0) saturate(100%) invert(27%) sepia(78%) saturate(2000%) hue-rotate(240deg)' : 'none' }}
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-8 text-sm tracking-wide">
          <button
            onClick={handleHomeClick}
            className="relative group"
            style={{ color: currentTheme.text.secondary }}
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5CF6] group-hover:w-full transition-all duration-300"></span>
          </button>
          <button
            onClick={handleFeaturesClick}
            className="relative group"
            style={{ color: currentTheme.text.secondary }}
          >
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5CF6] group-hover:w-full transition-all duration-300"></span>
          </button>
          <button
            onClick={handleModulesClick}
            className="relative group"
            style={{ color: currentTheme.text.secondary }}
          >
            Modules
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5CF6] group-hover:w-full transition-all duration-300"></span>
          </button>
          <button
            onClick={() => { }}
            className="relative group"
            style={{ color: '#8B5CF6' }}
          >
            Careers
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#8B5CF6] transition-all duration-300"></span>
          </button>
        </nav>

        {/* Theme Toggle and Login Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors duration-300 relative overflow-hidden"
            style={{
              backgroundColor: isDarkTheme ? '#1E293B' : '#E5E7EB',
              color: isDarkTheme ? '#F1F5F9' : '#111827'
            }}
            aria-label="Toggle theme"
          >
            {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={handleLoginClick}
            className="
              bg-[#8B5CF6] hover:bg-[#7C3AED]
              px-5 py-2 text-sm rounded-lg shadow-lg 
              transition-all duration-300 hover:shadow-xl
              hover:scale-[1.05] active:scale-[0.98]
              flex items-center gap-2 text-white
            "
          >
            <LogIn size={16} />
            Login
          </button>

          <button
            onClick={() => setMenu(!menu)}
            className="sm:hidden p-2 rounded-lg hover:bg-[#1E293B] transition"
            style={{ color: currentTheme.text.primary }}
          >
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menu && (
        <div
          className="fixed top-16 left-0 w-full p-6 sm:hidden z-40 border-b backdrop-blur-xl"
          style={{
            backgroundColor: `${isDarkTheme ? '#0F172A' : '#F8FAFC'}F2`,
            borderColor: currentTheme.border
          }}
        >
          <div className="flex flex-col gap-4 text-sm">
            <button
              onClick={() => {
                handleHomeClick();
                setMenu(false);
              }}
              className="py-3 border-b hover:bg-[#1E293B] px-2 rounded transition flex items-center gap-2"
              style={{ color: currentTheme.text.secondary, borderColor: currentTheme.border }}
            >
              <Home size={16} />
              Home
            </button>
            <button
              onClick={() => {
                handleFeaturesClick();
                setMenu(false);
              }}
              className="py-3 border-b hover:bg-[#1E293B] px-2 rounded transition"
              style={{ color: currentTheme.text.secondary, borderColor: currentTheme.border }}
            >
              Features
            </button>
            <button
              onClick={() => {
                handleModulesClick();
                setMenu(false);
              }}
              className="py-3 border-b hover:bg-[#1E293B] px-2 rounded transition"
              style={{ color: currentTheme.text.secondary, borderColor: currentTheme.border }}
            >
              Modules
            </button>
            <button
              onClick={() => {
                setMenu(false);
              }}
              className="py-3 border-b hover:bg-[#1E293B] px-2 rounded transition flex items-center gap-2"
              style={{ color: '#8B5CF6', borderColor: currentTheme.border }}
            >
              <Briefcase size={16} />
              Careers
            </button>
            <button
              onClick={() => {
                handleLoginClick();
                setMenu(false);
              }}
              className="
                bg-[#8B5CF6] hover:bg-[#7C3AED] px-4 py-3 rounded-lg shadow transition
                flex items-center justify-center gap-2 text-white
              "
            >
              <LogIn size={16} />
              Login
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className={`py-20 px-6 md:px-20 bg-gradient-to-r ${currentTheme.heroGradient}`}>
          <div className="max-w-6xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
              style={{
                backgroundColor: `${isDarkTheme ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)'}`,
                color: '#8B5CF6'
              }}
            >
              <Briefcase size={16} />
              We're Hiring!
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: currentTheme.text.primary }}>
              Build the Future of
              <span className="block bg-gradient-to-r from-[#8B5CF6] to-[#10B981] bg-clip-text text-transparent">
                HR Technology
              </span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-10" style={{ color: currentTheme.text.muted }}>
              Join our mission to revolutionize HR management. We're looking for passionate
              individuals who want to make an impact on how companies manage their most valuable asset - people.
            </p>
            <button
              onClick={scrollToOpenPositions}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition"
            >
              View Open Positions
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-24 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slideIn">
            <CheckCircle size={20} />
            <div>
              <div className="font-semibold">Application Submitted!</div>
              <div className="text-sm">We'll review your application and get back to you soon.</div>
            </div>
          </div>
        )}

        {/* Open Positions */}
        <section id="open-positions" className="py-20 px-6 md:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: currentTheme.text.primary }}>Open Positions</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: currentTheme.text.muted }}>
                Find the perfect role that matches your skills and passion
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]"></div>
                <p className="mt-4" style={{ color: currentTheme.text.muted }}>Loading positions...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <Briefcase size={48} className="mx-auto mb-4" style={{ color: currentTheme.text.muted }} />
                <p className="text-xl" style={{ color: currentTheme.text.muted }}>No open positions at the moment</p>
                <p className="text-sm mt-2" style={{ color: currentTheme.text.muted }}>Check back soon for new opportunities!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleViewJob(job)}
                    className="rounded-xl border transition-all hover:shadow-xl hover:shadow-[#8B5CF6]/10 group flex flex-col md:flex-row cursor-pointer overflow-hidden"
                    style={{
                      backgroundColor: currentTheme.card,
                      borderColor: currentTheme.border,
                    }}
                  >
                    {/* Left Section - Job Details */}
                    <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r" style={{ borderColor: currentTheme.border }}>
                      {/* Job Type Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-[rgba(139,92,246,0.2)] text-[#8B5CF6] text-xs font-semibold px-3 py-1 rounded-full">
                          {job.jobType}
                        </span>
                      </div>

                      {/* Job Title */}
                      <h3 className="text-2xl font-bold group-hover:text-[#8B5CF6] transition mb-4" style={{ color: currentTheme.text.primary }}>
                        {job.title}
                      </h3>

                      {/* Department */}
                      <p className="text-sm text-[#10B981] font-medium mb-4">
                        {job.department}
                      </p>

                      {/* Location, Salary, Experience */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm" style={{ color: currentTheme.text.secondary }}>
                          <MapPin size={16} style={{ color: currentTheme.text.muted }} />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: currentTheme.text.secondary }}>
                          <IndianRupee size={16} style={{ color: currentTheme.text.muted }} />
                          <span>{formatSalary(job)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: currentTheme.text.secondary }}>
                          <Briefcase size={16} style={{ color: currentTheme.text.muted }} />
                          <span>{formatExperience(job)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Requirements and Apply Button */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col">
                      {/* Requirements */}
                      {job.requirements && (
                        <div className="mb-6 flex-grow">
                          <div className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: currentTheme.text.primary }}>
                            <CheckCircle size={14} className="text-[#8B5CF6]" />
                            Key Requirements
                          </div>
                          <ul className="space-y-2">
                            {job.requirements.split('\n').filter(req => req.trim()).slice(0, 4).map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: currentTheme.text.secondary }}>
                                <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full mt-1.5 flex-shrink-0"></div>
                                <span className="flex-1 line-clamp-1">{req.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Apply Button */}
                      <button
                        onClick={(e) => handleApplyClick(job, e)}
                        className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3 shadow-lg hover:shadow-xl"
                      >
                        Apply Now
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </button>

                      {/* View Details Hint */}
                      <p className="text-center text-xs mt-3 group-hover:text-[#8B5CF6] transition-colors" style={{ color: currentTheme.text.muted }}>
                        Click card to view full details
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-6 md:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: currentTheme.text.primary }}>Why Join LiteHR</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: currentTheme.text.muted }}>
                We're building more than software - we're building a culture
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="rounded-xl p-6 transition group"
                  style={{
                    backgroundColor: currentTheme.card,
                  }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-[rgba(16,185,129,0.2)] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <div className="text-[#8B5CF6]">
                      {benefit.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-3" style={{ color: currentTheme.text.primary }}>{benefit.title}</h4>
                  <p className="text-sm" style={{ color: currentTheme.text.muted }}>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`py-20 px-6 md:px-20 bg-gradient-to-r ${currentTheme.ctaGradient}`}>
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Build with Us?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Don't see the perfect role? We're always looking for talented individuals.
            </p>
            <button
              onClick={() => {
                setSelectedJob(null);
                setShowApplicationModal(true);
              }}
              className="bg-white text-[#8B5CF6] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              Submit General Application
              <ExternalLink size={18} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer - UPDATED with logo and go to top button */}
      <footer
        className="py-8 border-t"
        style={{
          backgroundColor: isDarkTheme ? '#020617' : '#F8FAFC',
          borderColor: currentTheme.border
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
              <img
                src={LiteHRLogo}
                alt="LiteHR"
                className="h-8 w-auto object-contain"
                style={{ filter: !isDarkTheme ? 'brightness(0) saturate(100%) invert(27%) sepia(78%) saturate(2000%) hue-rotate(240deg)' : 'brightness(0) invert(1)' }}
              />
            </div>

            <p className="text-sm text-center" style={{ color: currentTheme.text.muted }}>
              © 2025 LiteHR. All rights reserved.
            </p>

            {/* Go to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 group"
              style={{
                backgroundColor: isDarkTheme ? '#1E293B' : '#E5E7EB',
                color: currentTheme.text.primary
              }}
            >
              <ArrowRight size={16} className="rotate-[-90deg] group-hover:translate-y-[-2px] transition-transform" />
              <span className="text-sm">Go to Top</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ============= JOB DETAILS MODAL ============= */}
      {showJobDetailsModal && viewJob && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={handleCloseModal}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div
              className="rounded-2xl border w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-slideIn"
              style={{
                backgroundColor: currentTheme.card,
                borderColor: currentTheme.border
              }}
            >

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 rounded-full transition z-10"
                style={{
                  backgroundColor: isDarkTheme ? '#111827' : '#F3F4F6',
                  color: currentTheme.text.muted
                }}
              >
                <X size={20} />
              </button>

              {/* Modal Header / Cover */}
              <div
                className="p-8 border-b"
                style={{
                  background: isDarkTheme
                    ? 'linear-gradient(to right, #0F172A, #1E293B)'
                    : 'linear-gradient(to right, #F8FAFC, #FFFFFF)',
                  borderColor: currentTheme.border
                }}
              >
                <div className="inline-flex items-center gap-2 bg-[rgba(16,185,129,0.2)] text-[#10B981] px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  {viewJob.jobType}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: currentTheme.text.primary }}>{viewJob.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm mt-4">
                  <span className="flex items-center gap-1.5" style={{ color: currentTheme.text.secondary }}>
                    <Briefcase size={16} className="text-[#8B5CF6]" /> {viewJob.department}
                  </span>
                  <span className="flex items-center gap-1.5" style={{ color: currentTheme.text.secondary }}>
                    <MapPin size={16} className="text-[#8B5CF6]" /> {viewJob.location}
                  </span>
                  <span className="flex items-center gap-1.5" style={{ color: currentTheme.text.secondary }}>
                    <IndianRupee size={16} className="text-[#8B5CF6]" /> {formatSalary(viewJob)}
                  </span>
                  <span className="flex items-center gap-1.5" style={{ color: currentTheme.text.secondary }}>
                    <Clock size={16} className="text-[#8B5CF6]" /> {formatExperience(viewJob)}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-8">

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: currentTheme.text.primary }}>
                    <FileText size={20} className="text-[#8B5CF6]" />
                    About the Role
                  </h3>
                  <p className="leading-relaxed whitespace-pre-wrap" style={{ color: currentTheme.text.muted }}>
                    {viewJob.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Responsibilities */}
                  {viewJob.responsibilities && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: currentTheme.text.primary }}>
                        <CheckCircle size={20} className="text-[#8B5CF6]" />
                        Key Responsibilities
                      </h3>
                      <ul className="space-y-3">
                        {viewJob.responsibilities.split('\n').filter(r => r.trim()).map((res, idx) => (
                          <li key={idx} className="flex items-start gap-3" style={{ color: currentTheme.text.secondary }}>
                            <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full mt-2 flex-shrink-0"></div>
                            <span className="flex-1 leading-relaxed">{res.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements */}
                  {viewJob.requirements && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: currentTheme.text.primary }}>
                        <Award size={20} className="text-[#8B5CF6]" />
                        Requirements
                      </h3>
                      <ul className="space-y-3">
                        {viewJob.requirements.split('\n').filter(r => r.trim()).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-3" style={{ color: currentTheme.text.secondary }}>
                            <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full mt-2 flex-shrink-0"></div>
                            <span className="flex-1 leading-relaxed">{req.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Skills (if available) */}
                {viewJob.skills && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: currentTheme.text.primary }}>
                      <Zap size={20} className="text-[#8B5CF6]" />
                      Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {viewJob.skills.split(',').map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-lg text-sm"
                          style={{
                            backgroundColor: currentTheme.card,
                            borderColor: currentTheme.border,
                            border: '1px solid',
                            color: currentTheme.text.secondary
                          }}
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Action */}
                <div className="pt-8 border-t flex justify-end gap-4" style={{ borderColor: currentTheme.border }}>
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-3 rounded-lg transition font-medium"
                    style={{
                      color: currentTheme.text.muted
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleApplyClick(viewJob)}
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition flex items-center gap-2"
                  >
                    Apply Now
                    <ArrowRight size={18} />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {/* ============= APPLICATION MODAL ============= */}
      {showApplicationModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={handleCloseModal}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div
              className="rounded-2xl border w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: currentTheme.card,
                borderColor: currentTheme.border
              }}
            >
              {/* Modal Header */}
              <div
                className="sticky top-0 px-8 py-6 border-b flex items-center justify-between"
                style={{
                  backgroundColor: currentTheme.card,
                  borderColor: currentTheme.border
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[rgba(139,92,246,0.2)] rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: currentTheme.text.primary }}>
                      {selectedJob ? `Apply for: ${selectedJob.title}` : 'Apply for Position'}
                    </h3>
                    <p className="text-sm" style={{ color: currentTheme.text.muted }}>Fill out your application below</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-lg hover:bg-[#111827] flex items-center justify-center transition"
                  style={{ color: currentTheme.text.muted }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                <form onSubmit={handleSubmitApplication} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text.secondary }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={applicationForm.name}
                        onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        style={{
                          backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                          borderColor: currentTheme.border,
                          color: currentTheme.text.primary
                        }}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text.secondary }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        style={{
                          backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                          borderColor: currentTheme.border,
                          color: currentTheme.text.primary
                        }}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text.secondary }}>Phone Number</label>
                      <input
                        type="tel"
                        value={applicationForm.phone}
                        onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        style={{
                          backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                          borderColor: currentTheme.border,
                          color: currentTheme.text.primary
                        }}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text.secondary }}>Position *</label>
                      <select
                        required
                        value={applicationForm.position}
                        onChange={(e) => {
                          const job = jobs.find(j => j.title === e.target.value);
                          setSelectedJob(job);
                          setApplicationForm({ ...applicationForm, position: e.target.value });
                        }}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                        style={{
                          backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                          borderColor: currentTheme.border,
                          color: currentTheme.text.primary
                        }}
                      >
                        <option value="">Select a position</option>
                        {jobs.map(job => (
                          <option key={job.id} value={job.title}>{job.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text.secondary }}>LinkedIn Profile</label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: currentTheme.text.muted }} />
                        <input
                          type="url"
                          value={applicationForm.linkedin}
                          onChange={(e) => setApplicationForm({ ...applicationForm, linkedin: e.target.value })}
                          className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                          style={{
                            backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                            borderColor: currentTheme.border,
                            color: currentTheme.text.primary
                          }}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text.secondary }}>GitHub Profile</label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: currentTheme.text.muted }} />
                        <input
                          type="url"
                          value={applicationForm.github}
                          onChange={(e) => setApplicationForm({ ...applicationForm, github: e.target.value })}
                          className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                          style={{
                            backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                            borderColor: currentTheme.border,
                            color: currentTheme.text.primary
                          }}
                          placeholder="https://github.com/yourusername"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text.secondary }}>Cover Letter *</label>
                    <textarea
                      required
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                      rows="5"
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                      style={{
                        backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                        borderColor: currentTheme.border,
                        color: currentTheme.text.primary
                      }}
                      placeholder="Tell us about yourself, your experience, and why you're interested in this position..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text.secondary }}>Resume/CV *</label>
                    <div className="space-y-4">
                      <label className="block cursor-pointer">
                        <div
                          className="border-2 border-dashed rounded-lg px-4 py-8 text-center hover:border-[#8B5CF6] transition"
                          style={{
                            backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                            borderColor: currentTheme.border
                          }}
                        >
                          <Upload className="mx-auto mb-3" size={28} style={{ color: currentTheme.text.muted }} />
                          <div className="font-medium mb-1" style={{ color: currentTheme.text.secondary }}>Click to upload your resume</div>
                          <div className="text-sm" style={{ color: currentTheme.text.muted }}>PDF, DOC, DOCX up to 5MB</div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            required
                          />
                        </div>
                      </label>

                      {applicationForm.resumeName && (
                        <div
                          className="flex items-center justify-between rounded-lg px-4 py-3 border"
                          style={{
                            backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                            borderColor: currentTheme.border
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <FileText size={20} className="text-[#8B5CF6]" />
                            <div>
                              <div className="font-medium" style={{ color: currentTheme.text.primary }}>{applicationForm.resumeName}</div>
                              <div className="text-sm" style={{ color: currentTheme.text.muted }}>Ready to submit</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setApplicationForm({ ...applicationForm, resume: null, resumeName: '' })}
                            className="text-sm text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#10B981] hover:from-[#7C3AED] hover:to-[#059669] text-white font-bold py-4 px-6 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      Submit Application
                      <ArrowRight size={18} />
                    </button>
                    <p className="text-sm text-center mt-3" style={{ color: currentTheme.text.muted }}>
                      By submitting, you agree to our privacy policy. We'll contact you within 5-7 business days.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
      {/* Add Chatbot at the end */}
      <Chatbot
        endpoint="/api/chatbot/public-ask"
        welcomeMessage={`👋 Welcome to LiteHR Careers!\nAsk me anything about job openings, application process, benefits, or HR workflows.\nI’m here to help 😊`}
        title="LiteHR Careers Assistant"
        subtitle="FAQs & Support"
      />
    </div>

  );
}