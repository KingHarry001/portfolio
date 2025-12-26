import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { appsAPI, usersAPI } from "../../api/supabase";
import { X, Upload, Save, Plus, Trash2, Download, Smartphone, Globe, Shield, FileText, Calendar, Loader2 } from "lucide-react";

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

const categories = [
  "Productivity", "Health & Fitness", "Social", "Entertainment", "Finance", "Tools", "Education",
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
    version: "1.0.0",
    privacy_policy_url: "",
    support_url: "",
    release_date: new Date().toISOString().split("T")[0],
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

  // Initialize form
  useEffect(() => {
    if (editingItem) {
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
        privacy_policy_url: editingItem.privacy_policy_url || "",
        support_url: editingItem.support_url || "",
        release_date: editingItem.release_date || "",
        featured: editingItem.featured || false,
        published: editingItem.published !== false,
        tags: editingItem.tags || [],
      });
      setApkUrl(editingItem.download_url || "");
    } else {
        setFormData(prev => ({ ...prev, developer_name: user?.fullName || "" }));
    }
  }, [editingItem, user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "name" && !editingItem) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleArrayInput = (field, index, value) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), ""] }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = (formData[field] || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  // Upload Logic
  const uploadImage = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });

  const handleIconUpload = async (file) => {
    if (!file) return;
    setUploadingIcon(true);
    try {
      const imageUrl = await uploadImage(file);
      handleInputChange("icon_url", imageUrl);
    } catch (error) {
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
      setFormData((prev) => ({ ...prev, screenshots: [...(prev.screenshots || []), ...uploadedUrls] }));
    } catch (error) {
      onError(new Error(`Failed to upload screenshots: ${error.message}`));
    } finally {
      setUploadingScreenshots(false);
    }
  };

  const removeScreenshot = (index) => {
    setFormData((prev) => ({ ...prev, screenshots: (prev.screenshots || []).filter((_, i) => i !== index) }));
  };

  const handleApkUpload = async (file) => {
    if (!file || !file.name.endsWith(".apk")) {
      onError(new Error("Please select a valid APK file"));
      return;
    }
    setUploadingApk(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock upload
      const mockApkUrl = `https://example.com/apps/${Date.now()}_${file.name}`;
      setApkUrl(mockApkUrl);
      setApkFile(file);
      handleInputChange("download_url", mockApkUrl);
      handleInputChange("size", `${(file.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      onError(new Error(`Failed to upload APK: ${error.message}`));
    } finally {
      setUploadingApk(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!user) throw new Error("You must be logged in");
      await usersAPI.createOrUpdate({ clerk_id: user.id, email: user.primaryEmailAddress?.emailAddress, name: user.fullName, image_url: user.imageUrl });

      const appData = {
        ...formData,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        changelog: formData.changelog || [],
        privacy_policy_url: formData.privacy_policy_url || null,
        support_url: formData.support_url || null,
        release_date: formData.release_date || null,
      };

      if (editingItem) await appsAPI.update(editingItem.id, appData);
      else await appsAPI.create(appData);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("App save error:", error);
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
              {editingItem ? "Edit App" : "New App"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage your mobile application details.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <InputGroup label="App Details">
                <div className="space-y-4">
                  <StyledInput placeholder="App Name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
                  <StyledInput placeholder="Slug (URL Friendly)" value={formData.slug} onChange={(e) => handleInputChange("slug", e.target.value)} required />
                  <StyledSelect value={formData.category} onChange={(e) => handleInputChange("category", e.target.value)}>
                    <option value="" className="bg-gray-900">Select Category</option>
                    {categories.map((cat) => <option key={cat} value={cat} className="bg-gray-900">{cat}</option>)}
                  </StyledSelect>
                </div>
              </InputGroup>

              <InputGroup label="Descriptions">
                <div className="space-y-4">
                  <textarea
                    rows={2}
                    placeholder="Short description (excerpt)..."
                    value={formData.short_description}
                    onChange={(e) => handleInputChange("short_description", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm resize-none"
                    required
                  />
                  <textarea
                    rows={5}
                    placeholder="Full detailed description..."
                    value={formData.long_description}
                    onChange={(e) => handleInputChange("long_description", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm resize-none"
                  />
                </div>
              </InputGroup>

              <InputGroup label="Technical Info">
                <div className="grid grid-cols-2 gap-4">
                  <StyledInput placeholder="Version (e.g. 1.0.0)" value={formData.version} onChange={(e) => handleInputChange("version", e.target.value)} required />
                  <StyledInput placeholder="Size (e.g. 25 MB)" value={formData.size} onChange={(e) => handleInputChange("size", e.target.value)} />
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <StyledInput placeholder="Min Android (e.g. 8.0)" value={formData.min_android_version} onChange={(e) => handleInputChange("min_android_version", e.target.value)} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                  <StyledInput type="date" value={formData.release_date} onChange={(e) => handleInputChange("release_date", e.target.value)} />
                </div>
              </InputGroup>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Icon Upload */}
              <InputGroup label="App Icon">
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                  {formData.icon_url ? (
                    <img src={formData.icon_url} alt="Icon" className="w-16 h-16 rounded-xl object-cover bg-gray-800" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                      <Upload className="w-4 h-4" />
                      {uploadingIcon ? "Uploading..." : "Upload Icon"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleIconUpload(e.target.files[0])} disabled={uploadingIcon} />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Square PNG/JPG, min 512x512px</p>
                  </div>
                </div>
              </InputGroup>

              {/* APK Upload */}
              <InputGroup label="APK File">
                <div className="p-4 bg-white/5 border border-dashed border-white/20 rounded-xl hover:bg-white/[0.07] transition-colors">
                  {apkUrl ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-green-500/20 text-green-500 rounded-lg">
                          <Download className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{apkFile?.name || "App Package"}</p>
                          <p className="text-xs text-cyan-400 truncate">{apkUrl}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => { setApkFile(null); setApkUrl(""); handleInputChange("download_url", ""); }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
                      <input type="file" accept=".apk" className="hidden" onChange={(e) => handleApkUpload(e.target.files[0])} disabled={uploadingApk} />
                      {uploadingApk ? <Loader2 className="w-8 h-8 animate-spin text-cyan-500" /> : <Download className="w-8 h-8 text-gray-500 mb-2" />}
                      <span className="text-sm text-gray-400">Click to upload APK file</span>
                    </label>
                  )}
                  {/* Fallback URL Input */}
                  {!apkUrl && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <input type="url" placeholder="Or enter direct download URL..." value={formData.download_url} onChange={(e) => handleInputChange("download_url", e.target.value)} className="w-full bg-transparent text-xs text-gray-300 placeholder-gray-600 focus:outline-none" />
                    </div>
                  )}
                </div>
              </InputGroup>

              {/* Screenshots Gallery */}
              <InputGroup label="Screenshots">
                <div className="grid grid-cols-4 gap-2">
                  {formData.screenshots.map((url, idx) => (
                    <div key={idx} className="relative aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeScreenshot(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-[9/16] bg-white/5 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-cyan-500/50 transition-all text-gray-500 hover:text-cyan-400">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleScreenshotsUpload(e.target.files)} disabled={uploadingScreenshots} />
                    {uploadingScreenshots ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-6 h-6" />}
                  </label>
                </div>
              </InputGroup>

              {/* Links & Metadata */}
              <InputGroup label="Links & Meta">
                <div className="space-y-3">
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <StyledInput placeholder="Website URL" value={formData.website_url} onChange={(e) => handleInputChange("website_url", e.target.value)} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <StyledInput placeholder="Privacy Policy URL" value={formData.privacy_policy_url} onChange={(e) => handleInputChange("privacy_policy_url", e.target.value)} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.featured} onChange={(e) => handleInputChange("featured", e.target.checked)} className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500" />
                      <span className="text-sm text-gray-300">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.published} onChange={(e) => handleInputChange("published", e.target.checked)} className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500" />
                      <span className="text-sm text-gray-300">Published</span>
                    </label>
                  </div>
                </div>
              </InputGroup>
            </div>
          </div>

          {/* Dynamic Lists Section (Features, Requirements, Changelog) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
            {[
              { id: "features", label: "Key Features", icon: FileText },
              { id: "requirements", label: "Requirements", icon: Smartphone },
              { id: "changelog", label: "Changelog", icon: Calendar },
            ].map((field) => (
              <div key={field.id} className="space-y-3">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                  <field.icon className="w-3 h-3" /> {field.label}
                </label>
                <div className="space-y-2">
                  {(formData[field.id] || []).map((item, index) => (
                    <div key={index} className="flex gap-2 group">
                      <StyledInput
                        value={item}
                        onChange={(e) => handleArrayInput(field.id, index, e.target.value)}
                        placeholder={`Add ${field.label.toLowerCase()}...`}
                      />
                      {(formData[field.id] || []).length > 0 && (
                        <button type="button" onClick={() => removeArrayItem(field.id, index)} className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem(field.id)} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-1 font-medium">
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>
              </div>
            ))}
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving || uploadingIcon || uploadingScreenshots || uploadingApk} className="px-8 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save App"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AppFormModal;