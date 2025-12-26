import { useState } from "react";
import { X, Save, Upload, Loader2, Link as LinkIcon, Image as ImageIcon, Trash2 } from "lucide-react";
import {
  skillsAPI,
  certificationsAPI,
  servicesAPI,
  testimonialsAPI,
  blogAPI,
  storageAPI
} from "../../api/supabase";

// --- CONFIGURATION ---
const formConfigs = {
  skill: {
    title: "Skill",
    fields: [
      { name: "name", label: "Skill Name", type: "text", required: true },
      { name: "category", label: "Category", type: "select", required: true, options: ["Graphic Design", "Frontend", "Backend", "Programming", "Security", "Crypto", "AI/ML", "Data Science"] },
      { name: "level", label: "Level (%)", type: "number", required: true, min: 0, max: 100 },
      { name: "display_order", label: "Display Order", type: "number", required: false },
    ],
    api: skillsAPI,
  },
  certification: {
    title: "Certification",
    fields: [
      { name: "name", label: "Certification Name", type: "text", required: true },
      { name: "issuer", label: "Issuer/Organization", type: "text", required: true },
      { name: "year", label: "Year", type: "text", required: true },
      { name: "credential_url", label: "Credential URL", type: "url", required: false },
    ],
    api: certificationsAPI,
  },
  service: {
    title: "Service",
    fields: [
      { name: "title", label: "Service Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "icon", label: "Icon Name", type: "select", required: true, options: ["palette", "code", "smartphone", "shield"] },
      { name: "features", label: "Features (one per line)", type: "textarea", required: true },
      { name: "starting_price", label: "Starting Price", type: "text", required: true },
      { name: "duration", label: "Duration", type: "text", required: true },
      { name: "display_order", label: "Display Order", type: "number", required: false },
      { name: "active", label: "Active", type: "checkbox", required: false },
    ],
    api: servicesAPI,
  },
  testimonial: {
    title: "Testimonial",
    fields: [
      { name: "name", label: "Client Name", type: "text", required: true },
      { name: "role", label: "Role/Position", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: false },
      
      // ✅ "image" type now supports both Upload + URL
      { name: "avatar_url", label: "Client Avatar", type: "image", required: false },
      
      { name: "content", label: "Testimonial Content", type: "textarea", required: true },
      { name: "rating", label: "Rating (1-5)", type: "number", required: false, min: 1, max: 5 },
      { name: "display_order", label: "Display Order", type: "number", required: false },
      { name: "featured", label: "Featured", type: "checkbox", required: false },
    ],
    api: testimonialsAPI,
  },
  blog: {
    title: "Blog Post",
    fields: [
      { name: "title", label: "Post Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      
      // ✅ "image" type now supports both Upload + URL
      { name: "featured_image", label: "Featured Image", type: "image", required: false },
      
      { name: "content", label: "Content", type: "textarea", required: true, rows: 8 },
      { name: "category", label: "Category", type: "select", required: true, options: ["Technology", "Design", "Development", "Security", "Tutorial", "News"] },
      { name: "author", label: "Author", type: "text", required: false },
      { name: "publish_date", label: "Publish Date", type: "date", required: false },
      { name: "published", label: "Published", type: "checkbox", required: false },
    ],
    api: blogAPI,
  },
};

const GenericFormModal = ({ type, editingItem, setShowModal, onSuccess, onError }) => {
  const config = formConfigs[type];
  if (!config) return null;

  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});

  // Initialize Data
  const getInitialData = () => {
    if (editingItem) {
      const { id, created_at, updated_at, updated_by, user_id, ...rest } = editingItem;
      return rest;
    }
    const initialData = {};
    config.fields.forEach((field) => {
      if (field.type === "checkbox") initialData[field.name] = field.name !== "published";
      else if (field.type === "number") initialData[field.name] = field.name === "rating" ? 5 : 0;
      else if (field.type === "date") initialData[field.name] = new Date().toISOString().split("T")[0];
      else initialData[field.name] = "";
    });
    if (type === "blog") initialData.author = "Harrison King";
    return initialData;
  };

  const [formData, setFormData] = useState(getInitialData());

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && type === "blog" && !editingItem) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleFileChange = (field, file) => {
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [field]: file }));
      const previewUrl = URL.createObjectURL(file);
      handleInputChange(field, previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let cleanData = { ...formData };

      // 1. Upload Images First
      const fileUploads = Object.keys(selectedFiles).map(async (fieldName) => {
        const file = selectedFiles[fieldName];
        if (file) {
          const publicUrl = await storageAPI.uploadImage(file, type);
          cleanData[fieldName] = publicUrl;
        }
      });

      await Promise.all(fileUploads);

      // 2. Process other fields
      if (type === "service" && typeof cleanData.features === "string") {
        cleanData.features = cleanData.features.split("\n").map((f) => f.trim()).filter(Boolean);
      }

      // 3. Save
      if (editingItem) {
        await config.api.update(editingItem.id, cleanData);
      } else {
        await config.api.create(cleanData);
      }

      setShowModal(false);
      onSuccess();
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      onError(error);
    } finally {
      setSaving(false);
    }
  };

  // --- Renderers ---
  const renderField = (field) => {
    const value = formData[field.name] || "";
    const baseClasses = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm";

    // ✅ HYBRID IMAGE INPUT (Upload OR URL)
    if (field.type === "image") {
      const hasImage = !!value;
      return (
        <div className="space-y-4">
          {/* 1. Preview Area */}
          {hasImage && (
            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/20 group bg-black/40">
              <img src={value} alt="Preview" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => {
                  handleInputChange(field.name, "");
                  setSelectedFiles(prev => {
                    const newState = { ...prev };
                    delete newState[field.name];
                    return newState;
                  });
                }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400 font-medium"
              >
                <Trash2 size={18} className="mr-2" /> Remove Image
              </button>
            </div>
          )}
          
          {/* 2. Controls (Show if no image, or allow URL edit) */}
          {!hasImage && (
            <div className="space-y-3">
              {/* Option A: Upload */}
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 bg-white/5 rounded-xl cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group">
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                  <Upload className="w-6 h-6 mb-2 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  <p className="text-xs text-gray-400 group-hover:text-gray-300">
                    Click to <span className="font-semibold text-cyan-400">upload file</span>
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                />
              </label>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] uppercase text-gray-500 font-medium">OR</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              {/* Option B: Paste URL */}
              <div className="relative">
                <input
                  type="url"
                  value={value}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder="Paste image URL here..."
                  className={`${baseClasses} pl-10`}
                />
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
          )}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          required={field.required}
          rows={field.rows || 3}
          value={value}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          placeholder={field.label}
          className={`${baseClasses} resize-y min-h-[100px]`}
        />
      );
    }

    if (field.type === "select") {
      return (
        <div className="relative">
          <select
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`${baseClasses} appearance-none cursor-pointer`}
          >
            <option value="" className="bg-gray-900">Select {field.label}</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <label className="relative inline-flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => handleInputChange(field.name, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{field.label}</span>
        </label>
      );
    }

    return (
      <div className="relative">
        <input
          type={field.type}
          required={field.required}
          min={field.min}
          max={field.max}
          value={value}
          onChange={(e) => handleInputChange(field.name, field.type === "number" ? parseFloat(e.target.value) : e.target.value)}
          placeholder={field.label}
          className={`${baseClasses} ${field.type === 'url' ? 'pl-10' : ''}`}
        />
        {field.type === 'url' && (
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {editingItem ? <Save className="w-5 h-5 text-cyan-400" /> : <Upload className="w-5 h-5 text-cyan-400" />}
              {editingItem ? `Edit ${config.title}` : `New ${config.title}`}
            </h2>
          </div>
          <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-5">
            {config.fields.map((field) => (
              <div key={field.name} className={field.type === "checkbox" ? "" : "space-y-2"}>
                {field.type !== "checkbox" && (
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>
                )}
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-colors border border-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenericFormModal;