import { Plus, Award, Edit, Trash2, ExternalLink, Calendar } from 'lucide-react';

const CertificationsTable = ({ certifications, onAddCertification, onEditCertification, onDeleteCertification }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            Certifications
          </h3>
          <p className="text-gray-400">Manage your professional certifications and achievements.</p>
        </div>
        
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            console.log('Add certification clicked');
            onAddCertification();
          }}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add Certification
        </button>
      </div>

      {/* Empty State */}
      {certifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Award size={40} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No certifications yet</h3>
          <p className="text-gray-400 max-w-sm text-center mb-8">
            Add your professional certifications to showcase your qualifications.
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onAddCertification();
            }}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add First Certification
          </button>
        </div>
      ) : (
        /* Certifications Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div 
              key={cert.id} 
              className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/10 group-hover:border-cyan-500/30 transition-colors">
                    <Award className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-[10px] font-medium text-gray-400 border border-white/5">
                    <Calendar size={10} />
                    {cert.year}
                  </span>
                </div>

                {/* Content */}
                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {cert.name}
                </h4>
                <p className="text-sm text-gray-400 mb-6 font-medium">{cert.issuer}</p>

                {/* Footer Actions */}
                <div className="mt-auto space-y-4">
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium text-gray-300 hover:text-white transition-colors border border-white/5 hover:border-white/10"
                    >
                      <ExternalLink size={14} />
                      View Credential
                    </a>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Edit certification clicked:', cert.id);
                        onEditCertification(cert);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Delete certification clicked:', cert.id);
                        onDeleteCertification(cert.id);
                      }}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Certification"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationsTable;