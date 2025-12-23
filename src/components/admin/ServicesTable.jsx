// src/components/admin/ServicesTable.jsx - FIXED
import { Plus, Star, Edit, Trash2 } from 'lucide-react';

const ServicesTable = ({ services, onAddService, onEditService, onDeleteService }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Services</h3>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            console.log('Add service clicked');
            onAddService();
          }}
          className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <h4 className="font-bold text-white text-lg">{service.title}</h4>
              <span className={`px-3 py-1 rounded-full text-xs ${
                service.active 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {service.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-sm text-gray-400 mb-4">{service.description}</p>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Edit service clicked:', service.id);
                  onEditService(service);
                }}
                className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
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
                className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesTable;