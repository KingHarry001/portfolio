// src/components/admin/ResumeFormModal.jsx
import { useState } from "react";
import { X, Upload, Loader, Save, FileText } from "lucide-react";
import { resumesAPI } from "../../api/supabase";
import Loading from "../layouts/loading";

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
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const uploadResult = await resumesAPI.uploadFile(selectedFile);

      setFormData((prev) => ({
        ...prev,
        file_url: uploadResult.file_url,
        file_name: uploadResult.file_name,
        file_size: uploadResult.file_size,
      }));

      setSelectedFile(null);
    } catch (error) {
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
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

      // Upload file if new file selected
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center z-10">
            <h3 className="text-2xl font-bold text-white">
              {editingItem ? "Edit Resume" : "Upload New Resume"}
            </h3>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resume Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Harrison King - Resume 2024"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                This title will be used for internal reference only
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resume File (PDF) *
              </label>

              {formData.file_url && !selectedFile ? (
                <div className="relative">
                  <div className="flex items-center gap-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                    <FileText className="w-8 h-8 text-cyan-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {formData.file_name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formData.file_size}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange("file_url", "")}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer block">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />

                    {uploading ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loading />
                        <p className="text-gray-400">Uploading...</p>
                      </div>
                    ) : selectedFile ? (
                      <div className="flex flex-col items-center gap-4">
                        <FileText className="w-12 h-12 text-cyan-400" />
                        <div>
                          <p className="text-white font-medium mb-1">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleFileUpload}
                          className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                        >
                          Upload File
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <Upload className="w-12 h-12 text-gray-500" />
                        <div>
                          <p className="text-gray-400 mb-2">
                            Drop PDF here or click to upload
                          </p>
                          <p className="text-sm text-gray-500">
                            PDF only, max 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-white">Set as Active Resume</p>
                <p className="text-sm text-gray-400">
                  Display this resume on your portfolio
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    handleInputChange("is_active", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex gap-3">
                <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-blue-400 mb-1">Resume Tips:</p>
                  <ul className="space-y-1 text-gray-400">
                    <li>
                      • Upload your resume in PDF format for best compatibility
                    </li>
                    <li>• Only one resume can be active at a time</li>
                    <li>
                      • The active resume will appear on your portfolio homepage
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  saving || uploading || (!formData.file_url && !selectedFile)
                }
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loading />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>
                      {editingItem ? "Update Resume" : "Upload Resume"}
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

export default ResumeFormModal;
