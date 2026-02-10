import React, { useState } from "react";
import { FiUpload, FiFileText, FiDownload, FiCopy, FiCheck, FiSearch, FiBriefcase } from "react-icons/fi";
import { useTheme, useThemeClasses } from "../../../contexts/ThemeContext";

const API_BASE_URL = "http://localhost:5000/api";

const CvSummarize = () => {
  const darkMode = useTheme() || false;
  const theme = useThemeClasses();

  const [resumePath, setResumePath] = useState("");
  const [jobPosition, setJobPosition] = useState("Frontend Developer");
  const [cvSummary, setCvSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Theme helper functions
  const getBgColor = () => darkMode ? "bg-gray-900" : "bg-white";
  const getBorderColor = () => darkMode ? "border-gray-700" : "border-gray-200";
  const getTextColor = () => darkMode ? "text-white" : "text-gray-800";
  const getSecondaryTextColor = () => darkMode ? "text-gray-400" : "text-gray-600";
  const getInputBg = () => darkMode ? "bg-gray-800" : "bg-gray-50";
  const getCardBg = () => darkMode ? "bg-gray-800/50" : "bg-white";
  const getPageBg = () => darkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20";

  const handleSummarize = async () => {
    if (!resumePath) {
      setError("Resume path is required");
      return;
    }
    setLoading(true);
    setError("");
    setCvSummary(null);

    try {
      const res = await fetch(`${API_BASE_URL}/cv/summarize/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvUrl: resumePath,
          jobPosition,
          applicationId: "APP-" + Date.now(),
        }),
      });

      const data = await res.json();
      if (data.success && data.summary) {
        setCvSummary(data.summary);
      } else {
        setError(data.error || "Failed to summarize CV");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while summarizing CV");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!cvSummary) return;
    navigator.clipboard.writeText(cvSummary.summary || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!cvSummary) return;
    const text = `
Name: ${cvSummary.name}
Email: ${cvSummary.email}
Phone: ${cvSummary.phone}
Experience: ${cvSummary.experience}
Role: ${cvSummary.currentRole}
Company: ${cvSummary.currentCompany}
Education: ${cvSummary.education || "N/A"}

Summary:
${cvSummary.summary}

Skills: ${cvSummary.skills.join(", ")}

Strengths:
${cvSummary.strengths.join("\n")}

Match Score: ${cvSummary.matchScore}%
    `.trim();

    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${cvSummary.name || "Candidate"}_CV_Summary.txt`;
    a.click();
  };

  return (
    <div className={`min-h-screen ${getPageBg()} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <FiFileText className="text-3xl text-white" />
            </div>
            <h1 className={`text-4xl font-bold ${getTextColor()}`}>AI CV Summarizer</h1>
          </div>
          <p className={`${getSecondaryTextColor()} text-lg`}>
            Analyze resumes instantly with AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: INPUT SECTION */}
          <div className="space-y-6">
            {/* INPUT CARD */}
            <div className={`${getCardBg()} backdrop-blur-sm rounded-2xl p-6 border ${getBorderColor()} shadow-lg`}>
              <h2 className={`text-xl font-semibold ${getTextColor()} mb-6 flex items-center gap-2`}>
                <FiUpload className="text-blue-500" />
                Upload Resume
              </h2>

              {/* Resume Path Input */}
              <div className="mb-5">
                <label className={`block text-sm font-medium ${getSecondaryTextColor()} mb-2`}>
                  Resume Path (from Database)
                </label>
                <div className="relative">
                  <FiFileText className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="e.g., /resumes/john-doe-resume.pdf"
                    value={resumePath}
                    onChange={(e) => setResumePath(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 ${getInputBg()} ${getTextColor()} rounded-xl border ${getBorderColor()} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                  />
                </div>
              </div>

              {/* Job Position Select */}
              <div className="mb-6">
                <label className={`block text-sm font-medium ${getSecondaryTextColor()} mb-2`}>
                  Job Position
                </label>
                <div className="relative">
                  <FiBriefcase className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <select
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 ${getInputBg()} ${getTextColor()} rounded-xl border ${getBorderColor()} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer`}
                  >
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>DevOps Engineer</option>
                    <option>Data Scientist</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSummarize}
                disabled={loading || !resumePath}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <FiSearch />
                    Summarize CV
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* INFO CARD */}
            <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} backdrop-blur-sm rounded-2xl p-6 border ${darkMode ? 'border-blue-700/30' : 'border-blue-200'}`}>
              <h3 className={`text-lg font-semibold ${getTextColor()} mb-3`}>How it works</h3>
              <ul className={`space-y-2 ${getSecondaryTextColor()} text-sm`}>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Enter the resume path from your database</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Select the target job position</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Get AI-powered analysis and match score</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT: RESULTS SECTION */}
          <div>
            {cvSummary && typeof cvSummary === "object" ? (
              <div className={`${getCardBg()} backdrop-blur-sm rounded-2xl p-6 border ${getBorderColor()} shadow-lg space-y-6`}>
                {/* Header with Actions */}
                <div className={`flex items-start justify-between pb-4 border-b ${getBorderColor()}`}>
                  <div>
                    <h2 className={`text-2xl font-bold ${getTextColor()} mb-1`}>
                      {cvSummary.name || "Candidate Profile"}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                      {cvSummary.email && (
                        <span className="flex items-center gap-1">
                          📧 {cvSummary.email}
                        </span>
                      )}
                      {cvSummary.phone && (
                        <span className="flex items-center gap-1">
                          📱 {cvSummary.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className={`p-2.5 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${getTextColor()} rounded-lg transition-all duration-200 flex items-center gap-2`}
                      title="Copy summary"
                    >
                      {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
                    </button>
                    <button
                      onClick={handleDownload}
                      className={`p-2.5 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${getTextColor()} rounded-lg transition-all duration-200`}
                      title="Download as text"
                    >
                      <FiDownload />
                    </button>
                  </div>
                </div>

                {/* Current Role */}
                {(cvSummary.currentRole || cvSummary.currentCompany) && (
                  <div className={`${getInputBg()} rounded-xl p-4`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Position</p>
                    <p className={`${getTextColor()} font-medium`}>
                      {cvSummary.currentRole}
                      {cvSummary.currentCompany && (
                        <span className={getSecondaryTextColor()}> at {cvSummary.currentCompany}</span>
                      )}
                    </p>
                    {cvSummary.experience && (
                      <p className={`text-sm ${getSecondaryTextColor()} mt-1`}>
                        Experience: {cvSummary.experience}
                      </p>
                    )}
                  </div>
                )}

                {/* Education */}
                {cvSummary.education && (
                  <div className={`${getInputBg()} rounded-xl p-4`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Education</p>
                    <p className={`${getTextColor()} font-medium`}>{cvSummary.education}</p>
                  </div>
                )}

                {/* Summary */}
                {cvSummary.summary && (
                  <div>
                    <h3 className={`text-lg font-semibold ${getTextColor()} mb-3`}>Summary</h3>
                    <p className={`${getSecondaryTextColor()} leading-relaxed ${darkMode ? 'bg-gray-900/30' : 'bg-gray-50'} rounded-xl p-4`}>
                      {cvSummary.summary}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {Array.isArray(cvSummary.skills) && cvSummary.skills.length > 0 && (
                  <div>
                    <h3 className={`text-lg font-semibold ${getTextColor()} mb-3`}>Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {cvSummary.skills.map((skill, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 ${darkMode ? 'bg-blue-600/20' : 'bg-blue-50'} ${darkMode ? 'text-blue-300' : 'text-blue-700'} rounded-lg text-sm font-medium border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {Array.isArray(cvSummary.strengths) && cvSummary.strengths.length > 0 && (
                  <div>
                    <h3 className={`text-lg font-semibold ${getTextColor()} mb-3`}>Key Strengths</h3>
                    <div className="space-y-2">
                      {cvSummary.strengths.map((strength, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-3 ${darkMode ? 'bg-gray-900/30' : 'bg-gray-50'} rounded-lg p-3`}
                        >
                          <span className="text-green-500 dark:text-green-400 text-lg mt-0.5">✓</span>
                          <span className={getSecondaryTextColor()}>{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Match Score */}
                {cvSummary.matchScore !== undefined && (
                  <div className={`${darkMode ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20' : 'bg-gradient-to-r from-green-50 to-emerald-50'} rounded-xl p-5 border ${darkMode ? 'border-green-700/30' : 'border-green-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`${getTextColor()} font-semibold`}>Match Score</span>
                      <span className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {cvSummary.matchScore}%
                      </span>
                    </div>
                    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${cvSummary.matchScore}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'} backdrop-blur-sm rounded-2xl p-12 border ${getBorderColor()} border-dashed flex flex-col items-center justify-center text-center h-full min-h-[500px]`}>
                <div className={`p-6 ${darkMode ? 'bg-gray-700/30' : 'bg-gray-200'} rounded-full mb-4`}>
                  <FiFileText className={`text-6xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-xl font-semibold ${getSecondaryTextColor()} mb-2`}>
                  No Results Yet
                </h3>
                <p className={getSecondaryTextColor()}>
                  Enter a resume path and click "Summarize CV" to see AI-powered analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvSummarize;