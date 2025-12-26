import { Plus, Star, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const ServicesTable = ({ services, onAddService, onEditService, onDeleteService }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            Services
          </h3>
          <p className="text-gray-400">Manage the services you offer to clients.</p>
        </div>
        
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            console.log('Add service clicked');
            onAddService();
          }}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add Service
        </button>
      </div>

      {/* Empty State */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Star size={40} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No services yet</h3>
          <p className="text-gray-400 max-w-sm text-center mb-8">
            List the services you provide to attract potential clients.
          </p>
          <button
            onClick={onAddService}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add First Service
          </button>
        </div>
      ) : (
        /* Services Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <Star className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium border ${
                    service.active 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>
                    {service.active ? <CheckCircle size={10} /> : <XCircle size={10} />}
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {service.title}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1 line-clamp-3">
                  {service.description}
                </p>

                {/* Actions */}
                <div className="pt-4 border-t border-white/5 flex gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Edit service clicked:', service.id);
                      onEditService(service);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-cyan-500/10 text-gray-300 hover:text-cyan-400 rounded-xl transition-all border border-transparent hover:border-cyan-500/20 font-medium text-sm"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Delete service clicked:', service.id);
                      onDeleteService(service.id);
                    }}
                    className="flex items-center justify-center p-2.5 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                    title="Delete Service"
                  >
                    <Trash2 size={18} />
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

export default ServicesTable;