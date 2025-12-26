import { CheckCircle2, MessageSquare, Smartphone, PenTool, Calendar } from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No recent activity found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((item, index) => (
        <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 animate-fade-in">
          <div className={`p-2 rounded-lg ${item.bg} ${item.color} mt-1 shrink-0`}>
            <item.icon size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-200 font-medium truncate">{item.message}</p>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Calendar size={10} />
              {item.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;