import { Plus, FileText, Edit, Trash2, Download, Check, Upload, Calendar, HardDrive } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            Resume Management
          </h3>
          <p className="text-gray-400">Upload, manage, and select your active CV.</p>
        </div>
        
        <button
          type="button"
          onClick={handleAdd}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Upload Resume
        </button>
      </div>

      {/* Empty State */}
      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <FileText size={40} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No resumes found</h3>
          <p className="text-gray-400 max-w-sm text-center mb-8">
            Upload your CV to make it available for download on your portfolio.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload First Resume
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className={`relative bg-white/5 border rounded-2xl p-6 transition-all duration-300 group ${
                resume.is_active 
                  ? 'border-cyan-500/50 bg-cyan-500/[0.02] shadow-[0_0_20px_rgba(6,182,212,0.05)]' 
                  : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
              }`}
            >
              {/* Active Indicator Strip */}
              {resume.is_active && (
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              )}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pl-4">
                {/* File Info */}
                <div className="flex items-start gap-5 flex-1">
                  <div className={`p-4 rounded-xl border ${
                    resume.is_active 
                      ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' 
                      : 'bg-white/5 border-white/5 text-gray-400 group-hover:text-white'
                  }`}>
                    <FileText size={28} />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className={`text-lg font-bold truncate ${
                        resume.is_active ? 'text-cyan-400' : 'text-white'
                      }`}>
                        {resume.title}
                      </h4>
                      {resume.is_active && (
                        <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Check size={10} strokeWidth={3} /> Active
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-400 truncate font-mono opacity-80">
                      {resume.file_name}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                        <HardDrive size={10} /> {resume.file_size}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                        <Calendar size={10} /> {formatDate(resume.upload_date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition-colors text-sm font-medium border border-white/5"
                  >
                    <Download size={16} />
                    <span className="lg:hidden xl:inline">Download</span>
                  </a>
                  
                  {!resume.is_active && (
                    <button
                      type="button"
                      onClick={(e) => handleSetActive(e, resume.id)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 rounded-xl transition-colors text-sm font-medium border border-white/5 hover:border-emerald-500/30"
                    >
                      <Check size={16} />
                      <span className="lg:hidden xl:inline">Set Active</span>
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={(e) => handleEdit(e, resume)}
                    className="p-2.5 bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 rounded-xl transition-colors border border-white/5 hover:border-cyan-500/30"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, resume.id)}
                    className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-colors border border-white/5 hover:border-red-500/30"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      {resumes.length > 0 && (
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-400 mb-1">Note</h4>
            <p className="text-xs text-blue-300/70 leading-relaxed">
              Only one resume can be active at a time. The active resume is what visitors will see when they click "Download CV" on your main portfolio page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumesTable;