// src/components/admin/AppsTable.jsx
import { Plus, Star, Edit, Trash2, ExternalLink, Smartphone } from 'lucide-react';

const AppsTable = ({ apps, onAddApp, onEditApp, onDeleteApp }) => {
  const formatDownloads = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num?.toString() || '0';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Apps Management</h3>
          <p className="text-gray-400">Manage your app store applications</p>
        </div>
        <button
          onClick={onAddApp}
          className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add App
        </button>
      </div>

      {apps.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
          <Smartphone className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">No apps added yet</p>
          <button
            onClick={onAddApp}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First App
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div
              key={app.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group"
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <img 
                    src={app.icon_url || 'https://via.placeholder.com/64'} 
                    alt={app.name}
                    className="w-16 h-16 rounded-xl flex-shrink-0 object-cover bg-gray-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                        {app.name}
                      </h4>
                      {app.featured && (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{app.category}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {app.short_description}
                </p>

                <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {app.rating || '0.0'} ({app.rating_count || 0})
                  </span>
                  <span>{formatDownloads(app.downloads)} downloads</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                    v{app.version || '1.0.0'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    app.published 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {app.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-gray-500">{app.size || 'N/A'}</span>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  {app.download_url && (
                    <a
                      href={app.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Test
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Edit clicked for app:', app.id);
                      onEditApp(app);
                    }}
                    className="flex-1 px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Delete clicked for app:', app.id);
                      onDeleteApp(app.id);
                    }}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppsTable;