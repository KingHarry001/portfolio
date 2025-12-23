import { Plus, Star, Edit, Trash2 } from 'lucide-react';

const TestimonialsTable = ({ testimonials, onAddTestimonial, onEditTestimonial, onDeleteTestimonial }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Testimonials</h3>
        <button
          onClick={onAddTestimonial}
          className="px-3 py-3 border border-gray-300 dark:border-gray-600 hover:border-orange-600 dark:hover:border-orange-500 rounded-[10px] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
            aria-label="Add to cart"
          >
            <svg
              className="w-4 h-4 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {testimonial.avatar_url && (
                  <img 
                    src={testimonial.avatar_url} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              {testimonial.featured && (
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              )}
            </div>
            
            <p className="text-sm text-gray-400 mb-4 line-clamp-3">{testimonial.content}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEditTestimonial(testimonial)}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 text-sm"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDeleteTestimonial(testimonial.id)}
                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsTable;