// src/components/admin/CertificationsTable.jsx
import { Plus, Award, Edit, Trash2, ExternalLink } from 'lucide-react';

const CertificationsTable = ({ certifications, onAddCertification, onEditCertification, onDeleteCertification }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Certifications</h3>
          <p className="text-gray-400">Manage your professional certifications</p>
        </div>
        <button
          onClick={onAddCertification}
          className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
          <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">No certifications added yet</p>
          <button
            onClick={onAddCertification}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Certification
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg">
                  <Award className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium">
                  {cert.year}
                </span>
              </div>

              <h4 className="font-bold text-white text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                {cert.name}
              </h4>
              
              <p className="text-sm text-gray-400 mb-4">{cert.issuer}</p>

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-4"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Credential
                </a>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <button
                  onClick={() => onEditCertification(cert)}
                  className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDeleteCertification(cert.id)}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationsTable;