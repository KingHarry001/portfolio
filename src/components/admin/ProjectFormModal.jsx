import { useState } from "react";
import { X, Upload, Loader, Save, Plus } from "lucide-react";
import { projectsAPI } from "../../api/supabase";

const ProjectFormModal = ({
  editingItem,
  setShowModal,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState(
    editingItem || {
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "portfolio_preset");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
        { method: "POST", body: formDataUpload }
      );

      const data = await response.json();
      handleInputChange("image", data.secure_url);
    } catch (error) {
      onError(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanData = {
        ...formData,
        tags: Array.isArray(formData.tags)
          ? formData.tags
          : formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
        keyFeatures: formData.keyFeatures.filter(Boolean),
        challenges: formData.challenges.filter(Boolean),
        results: formData.results.filter(Boolean),
      };

      if (editingItem) {
        await projectsAPI.update(editingItem.id, cleanData, "admin-user-id");
      } else {
        await projectsAPI.create(cleanData, "admin-user-id");
      }

      setShowModal(false);
      onSuccess();
    } catch (error) {
      onError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl w-full max-w-2xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-800 m-2 sm:m-4">
        <div onSubmit={handleSubmit}>
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 sm:p-6 flex justify-between items-center z-10">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {editingItem ? "Edit Project" : "Add New Project"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter project title"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option>Dev</option>
                  <option>Design</option>
                  <option>Security</option>
                  <option>App</option>
                  <option>Experimental</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Status *
                </label>
                <select
                  value={formData.published ? "Published" : "Draft"}
                  onChange={(e) =>
                    handleInputChange(
                      "published",
                      e.target.value === "Published"
                    )
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Short Description *
              </label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Brief description (150-200 characters)"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Full Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.fullDescription}
                onChange={(e) =>
                  handleInputChange("fullDescription", e.target.value)
                }
                placeholder="Detailed project description"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Featured Image *
              </label>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 sm:h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange("image", "")}
                    className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1 sm:p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-700 rounded-lg p-4 sm:p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                  {uploadingImage ? (
                    <Loader className="w-8 h-8 sm:w-12 sm:h-12 text-cyan-500 mx-auto mb-2 sm:mb-4 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-2 sm:mb-4" />
                  )}
                  <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                    Drop image here or click to upload
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </label>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={
                  Array.isArray(formData.tags)
                    ? formData.tags.join(", ")
                    : formData.tags
                }
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="React, Node.js, TypeScript"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Live URL
                </label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => handleInputChange("liveUrl", e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    handleInputChange("githubUrl", e.target.value)
                  }
                  placeholder="https://github.com/user/repo"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    handleInputChange("clientName", e.target.value)
                  }
                  placeholder="Client or Company"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  placeholder="3 months"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.teamSize}
                  onChange={(e) =>
                    handleInputChange("teamSize", parseInt(e.target.value))
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {["keyFeatures", "challenges", "results"].map((field) => (
              <div key={field}>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  {field.charAt(0).toUpperCase() +
                    field.slice(1).replace(/([A-Z])/g, " $1")}
                </label>
                {formData[field].map((item, index) => (
                  <div key={index} className="flex gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayInput(field, index, e.target.value)
                      }
                      placeholder={`Enter ${field} item`}
                      className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    {formData[field].length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(field, index)}
                        className="p-2 sm:p-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(field)}
                  className="text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  Add {field} item
                </button>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-lg gap-2 sm:gap-0">
              <div>
                <p className="font-medium text-white text-sm sm:text-base">
                  Featured Project
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Display on homepage
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1 sm:mt-0">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    handleInputChange("featured", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>
                      {editingItem ? "Update Project" : "Create Project"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormModal;
