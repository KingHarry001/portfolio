import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entry animation
    requestAnimationFrame(() => setIsVisible(true));
    
    // Auto close handled by parent, but we can animate out before unmounting if needed
    const timer = setTimeout(() => setIsVisible(false), 2700); // Start fading out slightly before removal
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
      } ${
        type === 'success' 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
          : 'bg-red-500/10 border-red-500/20 text-red-400'
      }`}
    >
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span className="font-medium text-sm">{message}</span>
      
      {/* Optional Close Button */}
      {onClose && (
        <button onClick={onClose} className="ml-2 hover:text-white transition-colors">
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Notification;