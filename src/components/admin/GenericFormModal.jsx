// src/components/admin/GenericFormModal.jsx - UPDATED TO HANDLE EXTRA FIELDS
import { useState } from "react";
import { X, Save } from "lucide-react";
import {
  skillsAPI,
  certificationsAPI,
  servicesAPI,
  testimonialsAPI,
  blogAPI,
} from "../../api/supabase";
import Loading from "../layouts/loading";

const formConfigs = {
  skill: {
    title: "Skill",
    fields: [
      { name: "name", label: "Skill Name", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          "Graphic Design",
          "Frontend",
          "Backend",
          "Programming",
          "Security",
          "Crypto",
          "AI/ML",
        ],
      },
      {
        name: "level",
        label: "Level (%)",
        type: "number",
        required: true,
        min: 0,
        max: 100,
      },
      {
        name: "display_order",
        label: "Display Order",
        type: "number",
        required: false,
      },
    ],
    api: skillsAPI,
  },
  certification: {
    title: "Certification",
    fields: [
      {
        name: "name",
        label: "Certification Name",
        type: "text",
        required: true,
      },
      {
        name: "issuer",
        label: "Issuer/Organization",
        type: "text",
        required: true,
      },
      { name: "year", label: "Year", type: "text", required: true },
      {
        name: "credential_url",
        label: "Credential URL",
        type: "url",
        required: false,
      },
    ],
    api: certificationsAPI,
  },
  service: {
    title: "Service",
    fields: [
      { name: "title", label: "Service Title", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      {
        name: "icon",
        label: "Icon Name",
        type: "select",
        required: true,
        options: ["palette", "code", "smartphone", "shield"],
      },
      {
        name: "features",
        label: "Features (one per line)",
        type: "textarea",
        required: true,
      },
      {
        name: "starting_price",
        label: "Starting Price",
        type: "text",
        required: true,
      },
      { name: "duration", label: "Duration", type: "text", required: true },
      {
        name: "display_order",
        label: "Display Order",
        type: "number",
        required: false,
      },
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
      {
        name: "content",
        label: "Testimonial Content",
        type: "textarea",
        required: true,
      },
      {
        name: "rating",
        label: "Rating (1-5)",
        type: "number",
        required: false,
        min: 1,
        max: 5,
      },
      {
        name: "display_order",
        label: "Display Order",
        type: "number",
        required: false,
      },
      {
        name: "featured",
        label: "Featured",
        type: "checkbox",
        required: false,
      },
    ],
    api: testimonialsAPI,
  },
  blog: {
    title: "Blog Post",
    fields: [
      { name: "title", label: "Post Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      {
        name: "content",
        label: "Content",
        type: "textarea",
        required: true,
        rows: 8,
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          "Technology",
          "Design",
          "Development",
          "Security",
          "Tutorial",
          "News",
        ],
      },
      {
        name: "featured_image",
        label: "Featured Image URL",
        type: "url",
        required: false,
      },
      { name: "author", label: "Author", type: "text", required: false },
      {
        name: "publish_date",
        label: "Publish Date",
        type: "date",
        required: false,
      },
      {
        name: "published",
        label: "Published",
        type: "checkbox",
        required: false,
      },
    ],
    api: blogAPI,
  },
};

const GenericFormModal = ({
  type,
  editingItem,
  setShowModal,
  onSuccess,
  onError,
}) => {
  const config = formConfigs[type];
  
  if (!config) {
    console.error(`Invalid form type: ${type}`);
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-xl p-6 max-w-md">
          <h3 className="text-xl font-bold text-red-400 mb-4">Configuration Error</h3>
          <p className="text-gray-400 mb-4">Form configuration for type "{type}" not found.</p>
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const [saving, setSaving] = useState(false);

  // Get initial form data based on type
  const getInitialData = () => {
    if (editingItem) {
      // Remove metadata fields that shouldn't be in the form
      const { id, created_at, updated_at, updated_by, user_id, ...rest } = editingItem;
      return rest;
    }

    // Initialize empty form based on type
    const initialData = {};
    
    // Set default values for each field in the config
    config.fields.forEach(field => {
      switch (field.type) {
        case "textarea":
          initialData[field.name] = "";
          break;
        case "select":
          initialData[field.name] = "";
          break;
        case "checkbox":
          initialData[field.name] = field.name === "published" ? false : true;
          break;
        case "number":
          initialData[field.name] = field.name === "level" ? 0 : 
                                   field.name === "display_order" ? 0 : 
                                   field.name === "rating" ? 5 : 0;
          break;
        case "date":
          initialData[field.name] = field.name === "publish_date" ? 
                                   new Date().toISOString().split('T')[0] : "";
          break;
        default:
          initialData[field.name] = "";
      }
    });

    // Set some smart defaults
    if (type === "blog") {
      initialData.author = "Harrison King";
      initialData.published = false;
    }

    if (type === "testimonial") {
      initialData.rating = 5;
      initialData.display_order = 0;
    }

    if (type === "service") {
      initialData.active = true;
      initialData.display_order = 0;
    }

    return initialData;
  };

  const [formData, setFormData] = useState(getInitialData());

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from title for blog posts
    if (field === "title" && type === "blog" && !editingItem) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    // Process the form data for each type
    let cleanData = { ...formData };
    
    // Process features for services
    if (type === "service" && cleanData.features && typeof cleanData.features === "string") {
      cleanData.features = cleanData.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);
    }

    // For blog posts, ensure required fields
    if (type === "blog") {
      if (!cleanData.slug) {
        // Auto-generate slug if not provided
        cleanData.slug = cleanData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      
      // Set publish_date if not provided
      if (!cleanData.publish_date) {
        cleanData.publish_date = new Date().toISOString().split('T')[0];
      }
      
      // Set author if not provided
      if (!cleanData.author) {
        cleanData.author = "Harrison King";
      }
    }

    console.log(`Submitting ${type} data:`, cleanData);

    if (editingItem) {
      await config.api.update(editingItem.id, cleanData);
    } else {
      await config.api.create(cleanData);
    }

    setShowModal(false);
    onSuccess();
  } catch (error) {
    console.error(`Error saving ${type}:`, error);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    
    let errorMessage = `Failed to save ${config.title.toLowerCase()}. `;
    
    if (error.code === "PGRST116") {
      errorMessage += "The database operation succeeded but didn't return data. ";
      errorMessage += "This could be due to Row Level Security (RLS) policies. ";
      errorMessage += "Check your RLS policies for the blog_posts table.";
    } else if (error.message) {
      errorMessage += error.message;
    }
    
    onError(new Error(errorMessage));
  } finally {
    setSaving(false);
  }
};

  const renderField = (field) => {
    const value = formData[field.name] || "";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            required={field.required}
            rows={field.rows || (field.name === "features" ? 5 : 3)}
            value={typeof value === "object" ? JSON.stringify(value) : value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={
              field.name === "features"
                ? "Enter each feature on a new line"
                : `Enter ${field.label.toLowerCase()}`
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-vertical"
          />
        );

      case "select":
        return (
          <select
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
        );

      case "number":
        return (
          <input
            type="number"
            required={field.required}
            min={field.min}
            max={field.max}
            value={value}
            onChange={(e) =>
              handleInputChange(field.name, parseFloat(e.target.value) || 0)
            }
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        );

      case "date":
        return (
          <input
            type="date"
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        );

      default:
        return (
          <input
            type={field.type}
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-800 m-2 sm:m-4">
        <form onSubmit={handleSubmit}>
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 sm:p-6 flex justify-between items-center z-10">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {editingItem ? `Edit ${config.title}` : `Add New ${config.title}`}
            </h3>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="p-1 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {config.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  {field.label}{" "}
                  {field.required && <span className="text-red-400">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loading className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>
                      {editingItem
                        ? `Update ${config.title}`
                        : `Create ${config.title}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenericFormModal;