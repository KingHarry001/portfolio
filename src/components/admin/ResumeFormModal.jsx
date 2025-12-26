import { useState } from "react";
import { X, Upload, Save, FileText, Check, AlertCircle, Loader2 } from "lucide-react";
import { resumesAPI } from "../../api/supabase";

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

const ResumeFormModal = ({ editingItem, setShowModal, onSuccess, onError }) => {
  const [formData, setFormData] = useState(
    editingItem || {
      title: "",
      file_url: "",
      file_name: "",
      file_size: "",
      is_active: false,
    }
  );

  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      onError(new Error("Please upload a PDF file"));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError(new Error("File size must be less than 10MB"));
      return;
    }

    setSelectedFile(file);
    
    // Auto-fill title if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      handleInputChange("title", fileName);
    }
  };

  // Drag and Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      onError(new Error("Please enter a title"));
      return;
    }

    if (!formData.file_url && !selectedFile) {
      onError(new Error("Please upload a resume file"));
      return;
    }

    setSaving(true);

    try {
      let finalData = { ...formData };

      // Upload file ONLY on submit
      if (selectedFile) {
        const uploadResult = await resumesAPI.uploadFile(selectedFile);
        finalData = {
          ...finalData,
          file_url: uploadResult.file_url,
          file_name: uploadResult.file_name,
          file_size: uploadResult.file_size,
        };
      }

      if (editingItem) {
        await resumesAPI.update(editingItem.id, finalData);
      } else {
        await resumesAPI.create(finalData);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {editingItem ? <Save className="w-5 h-5 text-cyan-400" /> : <Upload className="w-5 h-5 text-cyan-400" />}
              {editingItem ? "Edit Resume" : "Upload Resume"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">PDF formats only, max 10MB.</p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <InputGroup label="Resume Title">
            <StyledInput
              placeholder="e.g. Full Stack Developer - 2024"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </InputGroup>

          {/* File Upload Zone */}
          <InputGroup label="Resume File">
            <div
              className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
                dragActive ? "border-cyan-500 bg-cyan-500/10" : "border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile || formData.file_url ? (
                <div className="flex items-center gap-4 p-4">
                  <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {selectedFile ? selectedFile.name : formData.file_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedFile 
                        ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` 
                        : formData.file_size}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      handleInputChange("file_url", "");
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-500 mb-3" />
                  <p className="text-sm font-medium text-gray-300">
                    <span className="text-cyan-400 hover:underline">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF (MAX. 10MB)</p>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              )}
            </div>
          </InputGroup>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 p-1 rounded-full ${formData.is_active ? "bg-cyan-500/20 text-cyan-400" : "bg-gray-800 text-gray-500"}`}>
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Set as Active</p>
                <p className="text-xs text-gray-400">This resume will be publicly visible.</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleInputChange("is_active", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-colors border border-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || (!selectedFile && !formData.file_url)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Resume
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResumeFormModal;