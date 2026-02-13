// src/pages/manager/Settings.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Save,
  Mail,
  Phone,
  Building,
  Calendar,
  Briefcase,
  Camera,
  X
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext();
  const fileInputRef = useRef(null);

  const themeColors = isDarkMode
    ? {
      primary: "#8b5cf6",
      accent: "#3b82f6",
      background: "#0f172a",
      card: "#1e293b",
      text: "#f9fafb",
      muted: "#9ca3af",
      border: "#374151",
      hover: "rgba(59,130,246,0.1)"
    }
    : {
      primary: "#2563eb",
      accent: "#2563eb",
      background: "#f8fafc",
      card: "#ffffff",
      text: "#1e293b",
      muted: "#64748b",
      border: "#e2e8f0",
      hover: "#f1f5f9"
    };

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    joiningDate: "",
    bio: "",
    profileImage: null,
    profileImageUrl: ""
  });

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/auth/getUser", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data) {
          const { email, employee } = res.data;
          setProfileData(prev => ({
            ...prev,
            email: email || "",
            name: employee?.fullName || "",
            phone: employee?.phone || "",
            department: employee?.department || "",
            position: employee?.designation || "",
            joiningDate: employee?.dateOfJoining || "",
            profileImageUrl: employee?.profileImage || ""
          }));
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  /* ================= IMAGE HANDLING ================= */
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    setProfileData(prev => ({
      ...prev,
      profileImage: file,
      profileImageUrl: URL.createObjectURL(file)
    }));
  };

  const removeImage = () => {
    setProfileData(prev => ({
      ...prev,
      profileImage: null,
      profileImageUrl: ""
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadProfileImage = async () => {
    if (!profileData.profileImage) return profileData.profileImageUrl;

    setUploadingImage(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profileImage", profileData.profileImage);

      const res = await axios.post(
        "/api/auth/upload-profile-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      return res.data.imageUrl;
    } finally {
      setUploadingImage(false);
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const imageUrl = await uploadProfileImage();

      await axios.put(
        "/api/auth/profile",
        { ...profileData, profileImage: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state with the returned URL to show the uploaded image immediately
      if (imageUrl) {
        setProfileData(prev => ({ ...prev, profileImageUrl: imageUrl }));
      }

      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6" style={{ backgroundColor: themeColors.background }}>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/manager/dashboard")}
          className="p-2 rounded-lg"
          style={{ backgroundColor: themeColors.hover }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: themeColors.text }}>
            Settings
          </h1>
          <p style={{ color: themeColors.muted }}>
            Manage your profile information
          </p>
        </div>
      </div>

      <div
        className="max-w-5xl mx-auto rounded-xl p-6"
        style={{
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`
        }}
      >
        {/* PROFILE HEADER (ONLY ONCE) */}
        <div className="flex gap-6 mb-8">
          <div className="relative">
            {profileData.profileImageUrl ? (
              <img
                src={profileData.profileImageUrl}
                className="w-28 h-28 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center text-xl font-bold text-white"
                style={{ background: themeColors.primary }}
              >
                {profileData.name?.slice(0, 2).toUpperCase() || "MU"}
              </div>
            )}

            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-1 right-1 p-2 rounded-full bg-black text-white"
            >
              <Camera size={14} />
            </button>

            {profileData.profileImageUrl && (
              <button
                onClick={removeImage}
                className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full"
              >
                <X size={12} />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>
              {profileData.name}
            </h2>
            <p style={{ color: themeColors.muted }}>
              {profileData.position} · {profileData.department}
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            ["name", "Full Name", User],
            ["email", "Email", Mail],
            ["phone", "Phone", Phone],
            ["department", "Department", Building],
            ["position", "Position", Briefcase],
            ["joiningDate", "Joining Date", Calendar, "date"]
          ].map(([name, label, Icon, type = "text"]) => (
            <div key={name}>
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon size={14} /> {label}
              </label>
              <input
                type={type}
                name={name}
                value={profileData[name]}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: themeColors.card,
                  color: themeColors.text,
                  borderColor: themeColors.border
                }}
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              rows="4"
              value={profileData.bio}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 rounded-lg border"
            />
          </div>
        </div>

        {/* ACTIONS – ONLY HERE */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <button
            onClick={() => navigate("/manager/dashboard")}
            className="px-6 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving || uploadingImage}
            className="px-6 py-2 rounded-lg text-white flex items-center gap-2"
            style={{ backgroundColor: themeColors.primary }}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
