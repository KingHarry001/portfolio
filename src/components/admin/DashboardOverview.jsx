import { useMemo } from 'react';
import AdminStats from './AdminStats';
import ActivityChart from './ActivityChart';
import RecentActivity from './RecentActivity';
import { TrendingUp, Clock, MessageSquare, Smartphone, PenTool, CheckCircle2 } from 'lucide-react';

const DashboardOverview = ({ data }) => {
  const { projects = [], apps = [], reviews = [], blogs = [] } = data;

  const recentActivities = useMemo(() => {
    // ... (Keep your existing data processing logic)
    const allActivities = [
      ...projects.map(p => ({
        type: 'project',
        message: `Project Created: ${p.title}`,
        date: new Date(p.created_at),
        icon: CheckCircle2,
        color: 'text-green-400',
        bg: 'bg-green-400/10'
      })),
      ...apps.map(a => ({
        type: 'app',
        message: `App Added: ${a.name}`,
        date: new Date(a.created_at),
        icon: Smartphone,
        color: 'text-blue-400',
        bg: 'bg-blue-400/10'
      })),
      ...reviews.map(r => ({
        type: 'review',
        message: `Review: ${r.rating}★ on ${r.apps?.name || 'App'}`,
        date: new Date(r.created_at),
        icon: MessageSquare,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10'
      })),
      ...blogs.map(b => ({
        type: 'blog',
        message: `Post Published: ${b.title}`,
        date: new Date(b.created_at || b.publish_date),
        icon: PenTool,
        color: 'text-pink-400',
        bg: 'bg-pink-400/10'
      }))
    ];

    return allActivities
      .sort((a, b) => b.date - a.date)
      .slice(0, 5)
      .map(item => ({
        ...item,
        time: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
  }, [projects, apps, reviews, blogs]);

  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(dateStr => {
      const contentCount = 
        projects.filter(p => p.created_at?.startsWith(dateStr)).length + 
        apps.filter(a => a.created_at?.startsWith(dateStr)).length +
        blogs.filter(b => b.created_at?.startsWith(dateStr)).length;

      const reviewCount = reviews.filter(r => r.created_at?.startsWith(dateStr)).length;

      return {
        name: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
        content: contentCount,
        reviews: reviewCount
      };
    });
  }, [projects, apps, reviews, blogs]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Stats Grid */}
      <AdminStats {...data} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 2. Engagement Trends Chart */}
        {/* FIX: added min-w-0 to prevent overflow */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-cyan-400" size={20} />
                Engagement
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">Activity (Last 7 Days)</p>
            </div>
            
            <select className="w-full sm:w-auto bg-black/20 border border-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-cyan-500/50">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          {/* Chart Component */}
          <ActivityChart data={chartData} />
        </div>

        {/* 3. Recent Activity Feed */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col min-w-0">
          <h3 className="text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
            <Clock className="text-purple-400" size={20} />
            Recent Activity
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[300px] lg:max-h-none">
            <RecentActivity activities={recentActivities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;