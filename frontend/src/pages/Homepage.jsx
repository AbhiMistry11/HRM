
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/LiteHR_logo.png";
import hero1 from "../images/hero2.jpg";
import hero2 from "../images/hero3.jpg";
import hero3 from "../images/hero6.jpg";
import careersBanner from "../images/hero5.jpg";
import {
  Menu, X, Clock, Calendar, BarChart3,
  ChevronRight, LogIn, Users, Play, Maximize2,
  Briefcase, Home, Zap, CheckCircle, ArrowRight, MapPin, ChevronDown, X as XIcon
} from "lucide-react";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";
import jobService from "../services/jobService";

export default function Homepage() {
  const navigate = useNavigate();
  const slides = [hero1, hero2, hero3];
  const [index, setIndex] = useState(0);
  const [menu, setMenu] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [videoModal, setVideoModal] = useState({ open: false, src: "" });
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getPublicJobs();
        if (Array.isArray(data)) {
          setJobs(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load jobs", error);
      }
    };
    fetchJobs();
  }, []);

  // Video mapping for features
  const featureVideos = {
    0: "attendance.mp4",
    1: "leave.mp4",
    2: "worklog2.mp4"
  };

  // Navigation handlers
  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCareersClick = () => {
    navigate("/careers");
  };

  const handleGetStarted = () => {
    navigate("/login");
  };

  const openVideoModal = (videoSrc) => {
    setVideoModal({ open: true, src: videoSrc });
  };

  const closeVideoModal = () => {
    setVideoModal({ open: false, src: "" });
  };

  // Feature data
  const featureDetails = [
    {
      title: "Attendance System",
      howItWorks: "Employees can clock in/out with a single click, view their attendance history, and request shift changes. Managers receive instant notifications for attendance exceptions.",
      benefits: [
        "Real-time updates and notifications",
        "Mobile-friendly interface",
        "Automated reporting",
        "Role-based access control",
        "Geolocation support",
        "Custom shift configurations"
      ]
    },
    {
      title: "Leave Management",
      howItWorks: "Submit leave requests, track balances, and get automated approvals. Managers can approve or reject requests with comments. All leave types are supported.",
      benefits: [
        "Automated approval workflows",
        "Leave balance tracking",
        "Multi-level approvals",
        "Calendar integration",
        "Policy compliance checks",
        "Historical data analysis"
      ]
    },
    {
      title: "Work Log Analytics",
      howItWorks: "Log daily tasks, track project progress, and generate productivity reports. Managers can monitor team performance and identify bottlenecks.",
      benefits: [
        "Productivity insights",
        "Project progress tracking",
        "Team performance metrics",
        "Custom report generation",
        "Time allocation analytics",
        "Goal achievement tracking"
      ]
    }
  ];

  // Handle scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Video Modal */}
      {videoModal.open && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-800/90 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-all"
            >
              <XIcon size={24} />
            </button>
            <div className="p-1">
              <video
                src={videoModal.src}
                controls
                autoPlay
                className="w-full h-auto rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800">
              <h3 className="text-white font-semibold">Tutorial Preview</h3>
              <p className="text-gray-400 text-sm">Click the play button to start the tutorial</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#020617] text-[#F9FAFB] overflow-x-hidden">
        {/* ============= NAVBAR ============= */}
        <header className="
          fixed top-0 left-0 w-full h-16 
          bg-[#0F172A]/90 backdrop-blur-md
          text-white flex items-center justify-between 
          z-50 px-6 md:px-20 border-b border-[#374151]
        ">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="LiteHR"
              className="h-10 w-26 object-contain rounded-md"
            />
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex gap-8 text-sm tracking-wide">
            <button
              onClick={() => navigate("/")}
              className="text-sm tracking-wide hover:text-[#8B5CF6] transition"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm tracking-wide hover:text-[#8B5CF6] transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('modules')}
              className="text-sm tracking-wide hover:text-[#8B5CF6] transition"
            >
              Modules
            </button>
            <button
              onClick={handleCareersClick}
              className="text-sm tracking-wide hover:text-[#8B5CF6] transition"
            >
              Careers
            </button>
          </nav>

          {/* Login Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLoginClick}
              className="
                bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9]
                px-5 py-2 text-sm rounded-lg shadow-lg 
                transition-all duration-300
                flex items-center gap-2
              "
            >
              <LogIn size={16} />
              Login
            </button>

            <button
              onClick={() => setMenu(!menu)}
              className="sm:hidden p-2 rounded-lg hover:bg-[#1E293B] transition"
            >
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {/* MOBILE MENU */}
        {menu && (
          <div className="
            fixed top-16 left-0 w-full bg-[#0F172A] text-white p-6
            sm:hidden z-40 border-b border-[#1F2937]
            backdrop-blur-lg bg-[#0F172A]/95
          ">
            <div className="flex flex-col gap-4 text-sm">
              <button
                onClick={() => { navigate("/"); setMenu(false); }}
                className="py-3 border-b border-[#1F2937] hover:bg-[#1E293B] px-2 rounded transition text-[#D1D5DB] flex items-center gap-2"
              >
                <Home size={16} />
                Home
              </button>
              <button
                onClick={() => { scrollToSection('features'); setMenu(false); }}
                className="py-3 border-b border-[#1F2937] hover:bg-[#1E293B] px-2 rounded transition text-[#D1D5DB]"
              >
                Features
              </button>
              <button
                onClick={() => { scrollToSection('modules'); setMenu(false); }}
                className="py-3 border-b border-[#1F2937] hover:bg-[#1E293B] px-2 rounded transition text-[#D1D5DB]"
              >
                Modules
              </button>
              <button
                onClick={() => { handleCareersClick(); setMenu(false); }}
                className="py-3 border-b border-[#1F2937] hover:bg-[#1E293B] px-2 rounded transition text-[#D1D5DB] flex items-center gap-2"
              >
                <Briefcase size={16} />
                Careers
              </button>
              <button
                onClick={() => { handleLoginClick(); setMenu(false); }}
                className="
                  bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]
                  px-4 py-3 rounded-lg shadow transition
                  flex items-center justify-center gap-2
                "
              >
                <LogIn size={16} />
                Login
              </button>
            </div>
          </div>
        )}

        {/* ============= HERO SECTION ============= */}
        <section className="
          pt-24 md:pt-28 pb-20 px-6 md:px-20 
          flex flex-col md:flex-row items-center gap-16 
          bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E293B] relative
          overflow-hidden
        ">
          {/* TEXT */}
          <div className="flex-1 relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[rgba(139,92,246,0.2)] to-[rgba(16,185,129,0.2)] px-4 py-2 rounded-full text-sm text-[#D1D5DB] mb-6 border border-purple-500/20 transition-colors">
              <Zap size={14} />
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981] bg-clip-text text-transparent font-medium">
                Streamlined HR Operations
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#F9FAFB] mb-6 tracking-tight">
              Internal HR Automation{" "}
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981] bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#9CA3AF] max-w-xl mb-10 leading-relaxed">
              A modern internal system designed for employees, managers & admins to
              digitally manage attendance, leaves, work logs, and team activity —
              without using spreadsheets.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleGetStarted}
                className="
                  bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white
                  px-8 py-4 rounded-xl font-medium
                  flex items-center gap-3 transition-all duration-300
                  shadow-lg
                "
              >
                <span>Get Started</span>
                <ChevronRight size={20} />
              </button>

              <button
                onClick={handleCareersClick}
                className="
                  bg-transparent border-2 border-[#8B5CF6] text-[#8B5CF6]
                  hover:bg-[#8B5CF6]/10 px-8 py-4 rounded-xl font-medium
                  flex items-center gap-3 transition-all duration-300
                  shadow-lg
                "
              >
                <Briefcase size={20} />
                <span>View Careers</span>
              </button>
            </div>
          </div>

          {/* IMAGE SLIDER */}
          <div className="flex-1 w-full max-w-2xl relative z-10">
            <div className="relative rounded-2xl shadow-2xl transition-all duration-500">
              <img
                src={slides[index]}
                className="w-full h-[320px] md:h-[430px] rounded-2xl object-cover border-[6px] border-[#1E293B] transition-all duration-500"
                alt="HR Management Dashboard"
              />

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${i === index
                        ? "w-8 bg-gradient-to-r from-[#8B5CF6] to-[#10B981]"
                        : "bg-[#374151]"}
                    `}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============= FEATURES ============= */}
        <section id="features" className="py-20 px-6 md:px-20 bg-[#0F172A] relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#F9FAFB]">
                Key <span className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981] bg-clip-text text-transparent">Features</span>
              </h2>
              <p className="text-[#9CA3AF] max-w-2xl mx-auto text-lg">
                Experience seamless HR management with our intuitive features
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Clock size={22} />, title: "Mark Attendance", desc: "Real-time attendance tracking with geolocation support" },
                { icon: <Calendar size={22} />, title: "Leave Management", desc: "Automated approval workflows and balance tracking" },
                { icon: <BarChart3 size={22} />, title: "Work Log Submissions", desc: "Daily task logging with productivity insights" }
              ].map((feature, idx) => (
                <FeatureCard
                  key={idx}
                  index={idx}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.desc}
                  isActive={activeFeature === idx}
                  onClick={() => setActiveFeature(idx)}
                  featureDetail={featureDetails[idx]}
                  videoSrc={featureVideos[idx]}
                  onVideoClick={() => openVideoModal(featureVideos[idx])}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ============= MODULES ============= */}
        <section id="modules" className="py-20 bg-gradient-to-b from-[#0F172A] to-[#1E293B] px-6 md:px-20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#F9FAFB]">
                System <span className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981] bg-clip-text text-transparent">Modules</span>
              </h2>
              <p className="text-[#9CA3AF] max-w-2xl mx-auto text-lg">
                Tailored interfaces for different organizational roles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ModuleCard
                title="Employee Portal"
                items={[
                  "Attendance (IN/OUT)",
                  "Leave Requests",
                  "Daily Work Summaries",
                  "Attendance History"
                ]}
                icon={<Users />}
                color="purple"
              />

              <ModuleCard
                title="Manager Portal"
                items={[
                  "Approve Attendance",
                  "Approve Leaves",
                  "Monitor Team Work Logs",
                  "Team Overview & Analytics"
                ]}
                icon={<FiUserPlus />}
                color="green"
              />

              <ModuleCard
                title="Admin Portal"
                items={[
                  "Employee Master Records",
                  "Role & Department Setup",
                  "Leave Policies",
                  "Full HR Reporting"
                ]}
                icon={<FiUserCheck />}
                color="blue"
              />
            </div>
          </div>
        </section>

        {/* ============= CAREERS BANNER ============= */}
        <section className="py-20 px-6 md:px-20 bg-[#0F172A] relative">
          <div
            onClick={handleCareersClick}
            className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />

            {/* Image */}
            <img
              src={careersBanner}
              alt="Join Our Team"
              className="w-full h-[400px] object-cover transition-transform duration-700"
            />

            {/* Content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                <Briefcase size={18} className="text-white" />
                <span className="text-white font-medium">We're Hiring</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Join Our <span className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981] bg-clip-text text-transparent">Growing Team</span>
              </h2>

              <p className="text-xl text-white/90 max-w-2xl mb-8">
                Help us build the future of HR technology. Explore opportunities to grow your career.
              </p>

              <div className="
                w-14 h-14 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#10B981]
                flex items-center justify-center
              ">
                <ArrowRight size={24} className="text-white" />
              </div>

              <p className="text-white/80 mt-4 font-medium">Click to view all positions</p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-6 md:px-20 bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#10B981] relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Simplify Your HR Processes?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join the modern approach to HR management
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleLoginClick}
                className="
                  bg-white text-[#8B5CF6]
                  px-8 py-4 rounded-xl font-semibold
                  flex items-center gap-3 transition-all duration-300
                  shadow-lg
                "
              >
                <LogIn size={20} />
                Login to Dashboard
              </button>

              <button
                onClick={handleCareersClick}
                className="
                  bg-transparent border-2 border-white text-white
                  px-8 py-4 rounded-xl font-semibold
                  flex items-center gap-3 transition-all duration-300
                  shadow-lg
                "
              >
                <Briefcase size={20} />
                View Open Positions
              </button>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="py-20 px-6 md:px-20 bg-[#0F172A]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#F9FAFB]">
              About <span className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981] bg-clip-text text-transparent">LiteHR</span>
            </h2>
            <p className="text-lg text-[#D1D5DB] mb-8 leading-relaxed">
              LiteHR is a digitized internal HR solution aimed to replace spreadsheets
              and provide real-time attendance, approval workflows, and consolidated
              reporting for small teams. Our platform streamlines HR processes while
              maintaining data security and compliance.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { value: "100%", label: "Secure", color: "from-[#8B5CF6] to-[#7C3AED]" },
                { value: "24/7", label: "Availability", color: "from-[#10B981] to-[#34D399]" },
                { value: "99.9%", label: "Uptime", color: "from-[#3B82F6] to-[#60A5FA]" },
                { value: "0", label: "Spreadsheets", color: "from-[#F59E0B] to-[#FBBF24]" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-6 bg-[#1E293B] rounded-xl border border-[#374151] transition-all duration-300">
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#9CA3AF]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PREMIUM FOOTER */}
        <footer className="w-full bg-[#020617] text-white py-8 border-t border-[#374151]/50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <img
                  src={logo}
                  alt="LiteHR"
                  className="h-10 w-26 object-contain rounded-md"
                />
              </div>

              <p className="text-sm text-[#9CA3AF] text-center">
                Internal HR Automation System • © 2025 (Not for commercial use)
              </p>

              <div className="flex gap-6">
                <button
                  onClick={handleLoginClick}
                  className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-all duration-300 text-sm"
                >
                  Login
                </button>
                <button
                  onClick={handleCareersClick}
                  className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-all duration-300 text-sm"
                >
                  Careers
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ============= Enhanced FeatureCard Component ============= */
function FeatureCard({ index, icon, title, description, isActive, onClick, featureDetail, videoSrc, onVideoClick }) {
  return (
    <div className="relative">
      <div
        onClick={onClick}
        className={`
          relative bg-gradient-to-br from-[#1E293B] to-[#111827] rounded-2xl p-6 text-left transition-all duration-300 border border-[#374151]
          ${isActive ? 'shadow-2xl border-[#8B5CF6]/50' : 'shadow-lg'}
          overflow-hidden
        `}
      >
        {/* Floating Icon Animation */}
        <div className={`
          relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300
          ${isActive
            ? 'bg-gradient-to-r from-[rgba(139,92,246,0.2)] to-[rgba(16,185,129,0.2)] text-[#8B5CF6]'
            : 'bg-gradient-to-br from-[#111827] to-[#0F172A] text-[#9CA3AF]'}
          shadow-lg
        `}>
          {React.cloneElement(icon, {
            size: 24,
          })}
        </div>

        <h3 className="text-xl font-semibold mb-3 text-[#F9FAFB]">
          {title}
        </h3>
        <p className="text-[#9CA3AF] text-sm mb-4">{description}</p>

        {/* How It Works Section - Always visible */}
        <div className="mb-4">
          <h4 className="font-semibold text-[#F9FAFB] mb-2 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#10B981]" />
            How It Works
          </h4>
          <p className="text-sm text-[#D1D5DB]">
            {featureDetail.howItWorks}
          </p>
        </div>

        {/* Benefits Section - Always visible (limited to 3 items) */}
        <div className="mb-4">
          <h4 className="font-semibold text-[#F9FAFB] mb-2 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#10B981] to-[#3B82F6]" />
            Key Benefits
          </h4>
          <ul className="space-y-1">
            {featureDetail.benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-[#D1D5DB]">
                <CheckCircle size={12} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Watch Tutorial Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVideoClick();
          }}
          className="w-full flex items-center justify-center gap-2 p-3 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-all duration-300 text-white font-medium"
        >
          <Play size={16} />
          Watch Tutorial
        </button>
      </div>
    </div>
  );
}

/* ============= Enhanced ModuleCard Component ============= */
function ModuleCard({ title, items, icon, color }) {
  const colorClasses = {
    purple: "bg-gradient-to-r from-[rgba(139,92,246,0.2)] to-[rgba(139,92,246,0.1)] text-[#8B5CF6]",
    green: "bg-gradient-to-r from-[rgba(16,185,129,0.2)] to-[rgba(16,185,129,0.1)] text-[#10B981]",
    blue: "bg-gradient-to-r from-[rgba(59,130,246,0.2)] to-[rgba(59,130,246,0.1)] text-[#3B82F6]"
  };

  const dotColors = {
    purple: "bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]",
    green: "bg-gradient-to-r from-[#10B981] to-[#34D399]",
    blue: "bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]"
  };

  return (
    <div className="relative">
      <div className="relative bg-gradient-to-br from-[#1E293B] to-[#111827] rounded-2xl p-8 shadow-lg border border-[#374151] overflow-hidden">
        {/* Icon Container */}
        <div className={`relative w-16 h-16 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
          {React.cloneElement(icon, {
            size: 32,
          })}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-5 text-[#F9FAFB]">
          {title}
        </h3>

        {/* Features List */}
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 text-[#D1D5DB]"
            >
              <div className={`w-2 h-2 rounded-full ${dotColors[color]} shadow-sm`}></div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
