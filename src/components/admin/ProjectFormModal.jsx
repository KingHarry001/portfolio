import { useState } from "react";
import { X, Upload, Save, Plus, Trash2, Image as ImageIcon, Link, Calendar, Users, Building, Loader2 } from "lucide-react";
import { projectsAPI } from "../../api/supabase";

// --- UI Components ---
const InputGroup = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
      {label}
    </label>
    {children}
  </div>
);

const StyledInput = (props) => (
  <input
    {...props}
    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
  />
);

const StyledSelect = (props) => (
  <div className="relative">
    <select
      {...props}
      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm cursor-pointer"
    />
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
);

const ProjectFormModal = ({
  editingItem,
  setShowModal,
  onSuccess,
  onError,
}) => {
  const normalizeData = (data) => {
    if (!data) return null;
    return {
      ...data,
      fullDescription: data.full_description || data.fullDescription || "",
      liveUrl: data.live_url || data.liveUrl || "",
      githubUrl: data.github_url || data.githubUrl || "",
      clientName: data.client_name || data.clientName || "",
      teamSize: data.team_size || data.teamSize || 1,
      completionDate:
        data.completion_date ||
        data.completionDate ||
        new Date().toISOString().split("T")[0],
      keyFeatures: data.key_features || data.keyFeatures || [""],
      gallery: Array.isArray(data.gallery)
        ? data.gallery
        : data.gallery
        ? [data.gallery]
        : [],
    };
  };

  const [formData, setFormData] = useState(
    normalizeData(editingItem) || {
      title: "",
      description: "",
      fullDescription: "",
      category: "Dev",
      tags: [],
      image: "",
      gallery: [],
      liveUrl: "",
      githubUrl: "",
      featured: false,
      published: true,
      clientName: "",
      duration: "",
      teamSize: 1,
      completionDate: new Date().toISOString().split("T")[0],
      keyFeatures: [""],
      challenges: [""],
      results: [""],
    }
  );

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field, index, value) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = (formData[field] || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleFileUpload = async (file, type = "featured") => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "portfolio_preset";

    if (!cloudName || cloudName === "my-portfolio" || cloudName.includes("your_cloud")) {
      console.warn("Cloudinary not properly configured, using local URL");
      return URL.createObjectURL(file);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    if (type === "gallery") formData.append("folder", "portfolio/gallery");
    else formData.append("folder", "portfolio/featured");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (response.ok && data.secure_url) return data.secure_url;
      else throw new Error(data.error?.message || "Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleFeaturedImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const imageUrl = await handleFileUpload(file, "featured");
      handleInputChange("image", imageUrl);
    } catch (error) {
      onError(new Error(`Failed to upload image: ${error.message}`));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map((file) => handleFileUpload(file, "gallery"));
      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...uploadedUrls],
      }));
    } catch (error) {
      onError(new Error(`Failed to upload gallery: ${error.message}`));
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanData = {
        title: formData.title,
        description: formData.description,
        full_description: formData.fullDescription,
        category: formData.category,
        tags: Array.isArray(formData.tags)
          ? formData.tags
          : formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        image: formData.image,
        gallery: formData.gallery || [],
        live_url: formData.liveUrl,
        github_url: formData.githubUrl,
        featured: formData.featured,
        published: formData.published,
        client_name: formData.clientName,
        duration: formData.duration,
        team_size: formData.teamSize,
        completion_date: formData.completionDate,
        key_features: (formData.keyFeatures || []).filter(Boolean),
        challenges: (formData.challenges || []).filter(Boolean),
        results: (formData.results || []).filter(Boolean),
      };

      if (editingItem) await projectsAPI.update(editingItem.id, cleanData, "admin-user-id");
      else await projectsAPI.create(cleanData, "admin-user-id");

      setShowModal(false);
      onSuccess();
    } catch (error) {
      console.error("Project save error:", error);
      onError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {editingItem ? <Save className="w-5 h-5 text-cyan-400" /> : <Plus className="w-5 h-5 text-cyan-400" />}
              {editingItem ? "Edit Project" : "New Project"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the details below to showcase your work.</p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <InputGroup label="Project Details">
                <div className="space-y-4">
                  <StyledInput
                    placeholder="Project Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <StyledSelect
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                    >
                      <option className="bg-gray-900">Dev</option>
                      <option className="bg-gray-900">Design</option>
                      <option className="bg-gray-900">Security</option>
                      <option className="bg-gray-900">App</option>
                      <option className="bg-gray-900">Experimental</option>
                    </StyledSelect>
                    <StyledSelect
                      value={formData.published ? "Published" : "Draft"}
                      onChange={(e) => handleInputChange("published", e.target.value === "Published")}
                    >
                      <option className="bg-gray-900">Published</option>
                      <option className="bg-gray-900">Draft</option>
                    </StyledSelect>
                  </div>
                </div>
              </InputGroup>

              <InputGroup label="Descriptions">
                <div className="space-y-4">
                  <textarea
                    rows={3}
                    placeholder="Short description (excerpt for cards)..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm resize-none"
                    required
                  />
                  <textarea
                    rows={6}
                    placeholder="Full detailed case study description..."
                    value={formData.fullDescription}
                    onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm resize-none"
                    required
                  />
                </div>
              </InputGroup>

              <InputGroup label="Meta Information">
                <div className="space-y-4">
                  <StyledInput
                    placeholder="Tags (React, Node.js, etc...)"
                    value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="url"
                        placeholder="Live URL"
                        value={formData.liveUrl}
                        onChange={(e) => handleInputChange("liveUrl", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                      />
                    </div>
                    <div className="relative">
                      <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="url"
                        placeholder="GitHub Repo"
                        value={formData.githubUrl}
                        onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </InputGroup>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Media Upload */}
              <InputGroup label="Featured Media">
                <div className={`relative border-2 border-dashed border-white/10 rounded-xl p-4 transition-all ${!formData.image ? 'hover:border-cyan-500/50 hover:bg-white/5' : ''}`}>
                  {formData.image ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleInputChange("image", "")}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFeaturedImageUpload(e.target.files[0])} disabled={uploadingImage} />
                      {uploadingImage ? (
                        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-gray-600 mb-3" />
                      )}
                      <span className="text-sm text-gray-400 font-medium">Click to upload featured image</span>
                      <span className="text-xs text-gray-600 mt-1">1920x1080 Recommended</span>
                    </label>
                  )}
                </div>
              </InputGroup>

              {/* Gallery */}
              <InputGroup label="Project Gallery">
                <div className="grid grid-cols-3 gap-3">
                  {formData.gallery.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group bg-white/5">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-md text-white opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:bg-white/5 transition-all text-gray-500 hover:text-cyan-400">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleGalleryUpload(e.target.files)} disabled={uploadingGallery} />
                    {uploadingGallery ? <Loader2 className="w-6 h-6 animate-spin text-cyan-500" /> : <Plus className="w-6 h-6" />}
                  </label>
                </div>
              </InputGroup>

              {/* Project Stats */}
              <InputGroup label="Project Stats">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <StyledInput placeholder="Client Name" value={formData.clientName} onChange={(e) => handleInputChange("clientName", e.target.value)} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <StyledInput placeholder="Duration" value={formData.duration} onChange={(e) => handleInputChange("duration", e.target.value)} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <StyledInput type="number" min="1" placeholder="Team Size" value={formData.teamSize} onChange={(e) => handleInputChange("teamSize", parseInt(e.target.value))} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => handleInputChange("featured", e.target.checked)} className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-800" />
                    <span className="text-sm text-gray-300">Featured Project</span>
                  </div>
                </div>
              </InputGroup>
            </div>
          </div>

          {/* Dynamic Lists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
            {["keyFeatures", "challenges", "results"].map((field) => (
              <div key={field} className="space-y-3">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <div className="space-y-2">
                  {(formData[field] || []).map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <StyledInput
                        value={item}
                        onChange={(e) => handleArrayInput(field, index, e.target.value)}
                        placeholder={`Add ${field}...`}
                      />
                      {(formData[field] || []).length > 1 && (
                        <button type="button" onClick={() => removeArrayItem(field, index)} className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem(field)} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-1 font-medium">
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>
              </div>
            ))}
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploadingImage || uploadingGallery}
            className="px-8 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Project"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProjectFormModal;