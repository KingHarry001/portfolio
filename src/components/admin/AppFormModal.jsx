// src/components/admin/AppFormModal.jsx
import { useState } from 'react';
import { X, Upload, Loader, Save, Plus } from 'lucide-react';
import { appsAPI } from '../../api/supabase';

const categories = [
  'Productivity',
  'Health & Fitness',
  'Social',
  'Entertainment',
  'Finance',
  'Tools',
  'Education'
];

const AppFormModal = ({ editingItem, setShowModal, onSuccess, onError }) => {
  const [formData, setFormData] = useState(editingItem || {
    name: '',
    slug: '',
    short_description: '',
    long_description: '',
    category: 'Productivity',
    icon_url: '',
    screenshots: [],
    version: '1.0.0',
    size: '',
    download_url: '',
    rating: 0,
    rating_count: 0,
    downloads: 0,
    featured: false,
    published: true,
    features: [''],
    requirements: [''],
    changelog: ['']
  });
  
  const [saving, setSaving] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name' && !editingItem) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleArrayInput = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleImageUpload = async (file, type = 'icon') => {
    setUploadingIcon(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', 'portfolio_preset');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
        { method: 'POST', body: formDataUpload }
      );
      
      const data = await response.json();
      
      if (type === 'icon') {
        handleInputChange('icon_url', data.secure_url);
      } else {
        handleInputChange('screenshots', [...formData.screenshots, data.secure_url]);
      }
    } catch (error) {
      onError(error);
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanData = {
        ...formData,
        features: formData.features.filter(Boolean),
        requirements: formData.requirements.filter(Boolean),
        changelog: formData.changelog.filter(Boolean),
        rating: parseFloat(formData.rating) || 0,
        rating_count: parseInt(formData.rating_count) || 0,
        downloads: parseInt(formData.downloads) || 0,
      };

      if (editingItem) {
        await appsAPI.update(editingItem.id, cleanData);
      } else {
        await appsAPI.create(cleanData);
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
        <form onSubmit={handleSubmit}>
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 sm:p-6 flex justify-between items-center z-10">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {editingItem ? 'Edit App' : 'Add New App'}
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
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                  onChange={(e) => handleInputChange('slug', e.target.value)}
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
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
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
                onChange={(e) => handleInputChange('short_description', e.target.value)}
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
                onChange={(e) => handleInputChange('long_description', e.target.value)}
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
                  <img src={formData.icon_url} alt="App Icon" className="w-24 h-24 rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => handleInputChange('icon_url', '')}
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
                    onChange={(e) => handleImageUpload(e.target.files[0], 'icon')}
                  />
                  {uploadingIcon ? (
                    <Loader className="w-8 h-8 text-cyan-500 mx-auto animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-500 mx-auto" />
                  )}
                  <p className="text-xs text-gray-400 mt-2">Upload Icon</p>
                </label>
              )}
            </div>

            {/* Version & Size */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
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
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  placeholder="25 MB"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Downloads
                </label>
                <input
                  type="number"
                  value={formData.downloads}
                  onChange={(e) => handleInputChange('downloads', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  placeholder="4.5"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Rating Count
                </label>
                <input
                  type="number"
                  value={formData.rating_count}
                  onChange={(e) => handleInputChange('rating_count', e.target.value)}
                  placeholder="100"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Download URL */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Download URL
              </label>
              <input
                type="url"
                value={formData.download_url}
                onChange={(e) => handleInputChange('download_url', e.target.value)}
                placeholder="https://example.com/download"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Features, Requirements, Changelog */}
            {['features', 'requirements', 'changelog'].map((field) => (
              <div key={field}>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {formData[field].map((item, index) => (
                  <div key={index} className="flex gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayInput(field, index, e.target.value)}
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

            {/* Toggles */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-lg gap-2 sm:gap-0">
                <div>
                  <p className="font-medium text-white text-sm sm:text-base">Featured App</p>
                  <p className="text-xs sm:text-sm text-gray-400">Display in featured section</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1 sm:mt-0">
                  <input 
                    type="checkbox" 
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-lg gap-2 sm:gap-0">
                <div>
                  <p className="font-medium text-white text-sm sm:text-base">Published</p>
                  <p className="text-xs sm:text-sm text-gray-400">Make app visible to users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1 sm:mt-0">
                  <input 
                    type="checkbox" 
                    checked={formData.published}
                    onChange={(e) => handleInputChange('published', e.target.checked)}
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
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{editingItem ? 'Update App' : 'Create App'}</span>
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