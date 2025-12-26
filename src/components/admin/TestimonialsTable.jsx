import { Plus, Star, Edit, Trash2, MessageSquareQuote, User, Quote } from 'lucide-react';

const TestimonialsTable = ({ testimonials, onAddTestimonial, onEditTestimonial, onDeleteTestimonial }) => {
  
  // Helper to render stars
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={`${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700 fill-gray-700"}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            Testimonials
          </h3>
          <p className="text-gray-400">Social proof and client feedback.</p>
        </div>
        
        <button
          onClick={onAddTestimonial}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add Testimonial
        </button>
      </div>

      {/* Empty State */}
      {testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <MessageSquareQuote size={40} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No testimonials yet</h3>
          <p className="text-gray-400 max-w-sm text-center mb-8">
            Add feedback from your clients to build trust.
          </p>
          <button
            onClick={onAddTestimonial}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add First Testimonial
          </button>
        </div>
      ) : (
        /* Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6 flex flex-col flex-1 relative">
                
                {/* Decorative Quote Icon */}
                <Quote className="absolute top-6 right-6 text-white/5 w-12 h-12 fill-white/5" />

                {/* Content */}
                <div className="mb-6 relative z-10">
                  <div className="mb-3">
                    {renderStars(testimonial.rating || 5)}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed line-clamp-4 italic">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* User Info & Footer */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10 shrink-0">
                      {testimonial.avatar_url ? (
                        <img 
                          src={testimonial.avatar_url} 
                          alt={testimonial.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={18} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-sm truncate">{testimonial.name}</p>
                        {testimonial.featured && (
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]" title="Featured" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditTestimonial(testimonial)}
                      className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteTestimonial(testimonial.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
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

export default TestimonialsTable;