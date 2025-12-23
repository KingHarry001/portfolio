// src/components/admin/ResumesTable.jsx
import { Plus, FileText, Edit, Trash2, Download, Check, X, Upload } from 'lucide-react';

const ResumesTable = ({ resumes, onAddResume, onEditResume, onDeleteResume, onSetActive }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = (e, resume) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Edit resume clicked:', resume);
    onEditResume(resume);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete resume clicked:', id);
    if (window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      onDeleteResume(id);
    }
  };

  const handleSetActive = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Set active clicked:', id);
    onSetActive(id);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    console.log('Add resume clicked');
    onAddResume();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Resume Management</h3>
          <p className="text-gray-400">Upload and manage your resume files</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">No resume uploaded yet</p>
          <button
            type="button"
            onClick={handleAdd}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Your Resume
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className={`bg-gray-800/50 border rounded-xl p-6 hover:border-cyan-500/50 transition-all ${
                resume.is_active ? 'border-cyan-500' : 'border-gray-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    resume.is_active 
                      ? 'bg-cyan-500/20' 
                      : 'bg-gray-700/50'
                  }`}>
                    <FileText className={`w-6 h-6 ${
                      resume.is_active ? 'text-cyan-400' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-white text-lg truncate">
                        {resume.title}
                      </h4>
                      {resume.is_active && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400 truncate">
                        File: {resume.file_name}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Size: {resume.file_size}</span>
                        <span>Uploaded: {formatDate(resume.upload_date)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 sm:flex-none px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="sm:hidden">Download</span>
                  </a>
                  
                  {!resume.is_active && (
                    <button
                      type="button"
                      onClick={(e) => handleSetActive(e, resume.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span className="sm:hidden">Set Active</span>
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={(e) => handleEdit(e, resume)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="sm:hidden">Edit</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, resume.id)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors inline-flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {resumes.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Resume Management</h4>
              <p className="text-sm text-gray-400">
                Only one resume can be active at a time. The active resume will be displayed on your portfolio and available for download.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumesTable;