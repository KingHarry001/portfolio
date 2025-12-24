// src/components/admin/AppFormModal.jsx - UPDATED WITHOUT DYNAMIC FIELDS
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { appsAPI, usersAPI } from "../../api/supabase";
import { X, Upload, Loader, Save, Plus, Trash2, Download } from "lucide-react";
import Loading from "../layouts/loading";

const categories = [
  "Productivity",
  "Health & Fitness",
  "Social",
  "Entertainment",
  "Finance",
  "Tools",
  "Education",
];

const AppFormModal = ({ editingItem, onClose, onSuccess, onError }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    short_description: "",
    long_description: "",
    category: "",
    icon_url: "",
    download_url: "",
    website_url: "",
    developer_name: "",
    features: [],
    requirements: [],
    changelog: [],
    screenshots: [],
    min_android_version: "",
    size: "",
    version: "",
    privacy_policy_url: "",
    support_url: "",
    release_date: "",
    featured: false,
    published: true,
    tags: [],
  });

  const [saving, setSaving] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const [uploadingApk, setUploadingApk] = useState(false);
  const [apkFile, setApkFile] = useState(null);
  const [apkUrl, setApkUrl] = useState("");

  // Initialize form with editingItem data
  useEffect(() => {
    if (editingItem) {
      console.log("Editing item:", editingItem);
      setFormData({
        name: editingItem.name || "",
        slug: editingItem.slug || "",
        short_description: editingItem.short_description || "",
        long_description: editingItem.long_description || "",
        category: editingItem.category || "",
        icon_url: editingItem.icon_url || "",
        download_url: editingItem.download_url || "",
        website_url: editingItem.website_url || "",
        developer_name: editingItem.developer_name || "",
        features: editingItem.features || [],
        requirements: editingItem.requirements || [],
        changelog: editingItem.changelog || [],
        screenshots: editingItem.screenshots || [],
        min_android_version: editingItem.min_android_version || "",
        size: editingItem.size || "",
        version: editingItem.version || "",
        // REMOVED: rating, rating_count, downloads - these are dynamic
        privacy_policy_url: editingItem.privacy_policy_url || "",
        support_url: editingItem.support_url || "",
        release_date: editingItem.release_date || "",
        featured: editingItem.featured || false,
        published: editingItem.published !== false,
        tags: editingItem.tags || [],
      });
      setApkUrl(editingItem.download_url || "");
    } else {
      // Reset form for new app
      setFormData({
        name: "",
        slug: "",
        short_description: "",
        long_description: "",
        category: "",
        icon_url: "",
        download_url: "",
        website_url: "",
        developer_name: user?.fullName || "",
        features: [],
        requirements: [],
        changelog: [],
        screenshots: [],
        min_android_version: "",
        size: "",
        version: "1.0.0",
        // REMOVED: rating, rating_count, downloads - these are dynamic
        privacy_policy_url: "",
        support_url: "",
        release_date: new Date().toISOString().split('T')[0],
        featured: false,
        published: true,
        tags: [],
      });
      setApkUrl("");
    }
  }, [editingItem, user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from name when creating new app
    if (field === "name" && !editingItem) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleArrayInput = (field, index, value) => {
    const currentArray = formData[field] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    const currentArray = formData[field] || [];
    setFormData((prev) => ({
      ...prev,
      [field]: [...currentArray, ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    const currentArray = formData[field] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  // Simple image upload (data URLs for now)
  const uploadImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  const handleIconUpload = async (file) => {
    if (!file) return;
    
    setUploadingIcon(true);
    try {
      const imageUrl = await uploadImage(file);
      handleInputChange("icon_url", imageUrl);
    } catch (error) {
      console.error("Icon upload error:", error);
      onError(new Error(`Failed to upload icon: ${error.message}`));
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleScreenshotsUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setUploadingScreenshots(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        screenshots: [...(prev.screenshots || []), ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Screenshots upload error:", error);
      onError(new Error(`Failed to upload screenshots: ${error.message}`));
    } finally {
      setUploadingScreenshots(false);
    }
  };

  const removeScreenshot = (index) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: (prev.screenshots || []).filter((_, i) => i !== index),
    }));
  };

  const handleApkUpload = async (file) => {
    if (!file) {
      onError(new Error("Please select a file"));
      return;
    }
    
    if (!file.name.endsWith(".apk")) {
      onError(new Error("Please select an APK file (.apk)"));
      return;
    }

    setUploadingApk(true);
    try {
      console.log("APK file:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2), "MB");

      // In a real app, you would upload to Supabase Storage here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockApkUrl = `https://example.com/apps/${Date.now()}_${file.name}`;
      setApkUrl(mockApkUrl);
      setApkFile(file);
      handleInputChange("download_url", mockApkUrl);
      handleInputChange("size", `${(file.size / 1024 / 1024).toFixed(2)} MB`);

    } catch (error) {
      console.error("APK upload error:", error);
      onError(new Error(`Failed to upload APK: ${error.message}`));
    } finally {
      setUploadingApk(false);
    }
  };

  // Tags input handler
  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    handleInputChange("tags", tagsArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (!user) {
        throw new Error("You must be logged in");
      }

      // Ensure user exists in our database
      await usersAPI.createOrUpdate({
        clerk_id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        image_url: user.imageUrl,
      });

      // Prepare app data - REMOVE dynamic fields that should not be in form
      const appData = {
        name: formData.name,
        slug: formData.slug,
        short_description: formData.short_description,
        long_description: formData.long_description,
        category: formData.category,
        icon_url: formData.icon_url,
        download_url: formData.download_url,
        website_url: formData.website_url,
        developer_name: formData.developer_name,
        features: formData.features,
        requirements: formData.requirements,
        screenshots: formData.screenshots,
        min_android_version: formData.min_android_version,
        size: formData.size,
        version: formData.version,
        // REMOVED: rating, rating_count, downloads - these are dynamic and will be set by the system
        privacy_policy_url: formData.privacy_policy_url || null,
        support_url: formData.support_url || null,
        release_date: formData.release_date || null,
        featured: formData.featured,
        published: formData.published,
        changelog: formData.changelog || [],
        tags: formData.tags || [],
      };

      console.log("Saving app data:", appData);

      if (editingItem) {
        await appsAPI.update(editingItem.id, appData);
      } else {
        await appsAPI.create(appData);
      }

      onSuccess();
      onClose();
      
    } catch (error) {
      console.error("App save error:", error);
      console.error("Error details:", error.message, error.code, error.details);
      onError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl w-full max-w-2xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-800 m-2 sm:m-4">
        <form onSubmit={handleSubmit}>
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 sm:p-6 flex justify-between items-center z-10">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {editingItem ? "Edit App" : "Add New App"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  App Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter app name"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="app-slug"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={(formData.tags || []).join(", ")}
                onChange={handleTagsChange}
                placeholder="productivity, tools, mobile"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Short Description *
              </label>
              <textarea
                required
                rows={2}
                value={formData.short_description}
                onChange={(e) => handleInputChange("short_description", e.target.value)}
                placeholder="Brief description (50-100 characters)"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Long Description
              </label>
              <textarea
                rows={4}
                value={formData.long_description}
                onChange={(e) => handleInputChange("long_description", e.target.value)}
                placeholder="Detailed app description"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>

            {/* App Icon */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                App Icon *
              </label>
              {formData.icon_url ? (
                <div className="relative inline-block">
                  <img
                    src={formData.icon_url}
                    alt="App Icon"
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange("icon_url", "")}
                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-cyan-500 transition-colors cursor-pointer block w-32">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleIconUpload(e.target.files[0])}
                    disabled={uploadingIcon}
                  />
                  {uploadingIcon ? (
                    <Loading className="w-8 h-8 text-cyan-500 mx-auto animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-500 mx-auto" />
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {uploadingIcon ? "Uploading..." : "Upload Icon"}
                  </p>
                </label>
              )}
            </div>

            {/* Screenshots */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Screenshots
              </label>

              {(formData.screenshots || []).length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                    {(formData.screenshots || []).map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {(formData.screenshots || []).length} screenshot(s)
                  </p>
                </div>
              )}

              <label className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-cyan-500 transition-colors cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleScreenshotsUpload(e.target.files)}
                  disabled={uploadingScreenshots}
                />
                {uploadingScreenshots ? (
                  <>
                    <Loading className="w-8 h-8 text-cyan-500 mx-auto mb-2 animate-spin" />
                    <p className="text-sm text-gray-400">
                      Uploading screenshots...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">
                      Drop images or click to upload
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG up to 5MB each
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* Features, Requirements, Changelog - ARRAY FIELDS */}
            {[
              {
                id: "features",
                label: "Features",
                placeholder: "Enter feature",
              },
              {
                id: "requirements",
                label: "Requirements",
                placeholder: "Enter requirement",
              },
              {
                id: "changelog",
                label: "Changelog",
                placeholder: "Enter changelog entry",
              },
            ].map((field) => (
              <div key={field.id}>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  {field.label}
                </label>
                {(formData[field.id] || []).map((item, index) => (
                  <div key={index} className="flex gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayInput(field.id, index, e.target.value)}
                      placeholder={field.placeholder}
                      className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    {(formData[field.id] || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(field.id, index)}
                        className="p-2 sm:p-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(field.id)}
                  className="text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  Add {field.label.toLowerCase()} item
                </button>
              </div>
            ))}

            {/* APK File Upload */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                APK File (Download URL)
              </label>

              {apkUrl ? (
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <Download className="w-5 h-5 text-cyan-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {apkFile?.name || "App APK"}
                    </p>
                    {apkFile && (
                      <p className="text-xs text-gray-400">
                        {(apkFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                    <p className="text-xs text-cyan-400 truncate">{apkUrl}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setApkFile(null);
                      setApkUrl("");
                      handleInputChange("download_url", "");
                    }}
                    className="p-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-cyan-500 transition-colors cursor-pointer block">
                    <input
                      type="file"
                      accept=".apk"
                      className="hidden"
                      onChange={(e) => handleApkUpload(e.target.files[0])}
                      disabled={uploadingApk}
                    />
                    {uploadingApk ? (
                      <>
                        <Loading />
                        <p className="text-sm text-gray-400">
                          Uploading APK...
                        </p>
                      </>
                    ) : (
                      <>
                        <Download className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">Upload APK File</p>
                        <p className="text-xs text-gray-500">
                          .apk files only, up to 100MB
                        </p>
                      </>
                    )}
                  </label>

                  {/* Alternative: Direct URL input */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2 text-center">OR</p>
                    <input
                      type="url"
                      value={formData.download_url || ""}
                      onChange={(e) => handleInputChange("download_url", e.target.value)}
                      placeholder="Enter direct download URL"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* App Details Grid - REMOVED RATING FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Version *
                </label>
                <input
                  type="text"
                  required
                  value={formData.version}
                  onChange={(e) => handleInputChange("version", e.target.value)}
                  placeholder="1.0.0"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Size
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => handleInputChange("size", e.target.value)}
                  placeholder="25 MB"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Min Android Version
                </label>
                <input
                  type="text"
                  value={formData.min_android_version}
                  onChange={(e) => handleInputChange("min_android_version", e.target.value)}
                  placeholder="8.0"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* REMOVED: Rating Grid Section */}

            {/* Developer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Developer Name
                </label>
                <input
                  type="text"
                  value={formData.developer_name}
                  onChange={(e) => handleInputChange("developer_name", e.target.value)}
                  placeholder="Harrison King"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => handleInputChange("website_url", e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Privacy & Support URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Privacy Policy URL
                </label>
                <input
                  type="url"
                  value={formData.privacy_policy_url}
                  onChange={(e) => handleInputChange("privacy_policy_url", e.target.value)}
                  placeholder="https://example.com/privacy"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Support URL
                </label>
                <input
                  type="url"
                  value={formData.support_url}
                  onChange={(e) => handleInputChange("support_url", e.target.value)}
                  placeholder="https://example.com/support"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Release Date */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Release Date
              </label>
              <input
                type="date"
                value={formData.release_date}
                onChange={(e) => handleInputChange("release_date", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-lg gap-2 sm:gap-0">
                <div>
                  <p className="font-medium text-white text-sm sm:text-base">
                    Featured App
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Display in featured section
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1 sm:mt-0">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange("featured", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-lg gap-2 sm:gap-0">
                <div>
                  <p className="font-medium text-white text-sm sm:text-base">
                    Published
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Make app visible to users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1 sm:mt-0">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => handleInputChange("published", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploadingIcon || uploadingScreenshots || uploadingApk}
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
                    <span>{editingItem ? "Update App" : "Create App"}</span>
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

export default AppFormModal;