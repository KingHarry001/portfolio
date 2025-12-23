import { Briefcase, FileText, Star, Users, TrendingUp } from 'lucide-react';

const AdminStats = ({ projects, services, blogs, testimonials }) => {
  const stats = [
    { 
      label: 'Total Projects', 
      value: projects.length.toString(), 
      change: `${projects.filter(p => p.published).length} published`, 
      color: 'cyan', 
      icon: Briefcase 
    },
    { 
      label: 'Blog Posts', 
      value: blogs.length.toString(), 
      change: `${blogs.filter(b => b.published).length} published`, 
      color: 'purple', 
      icon: FileText 
    },
    { 
      label: 'Active Services', 
      value: services.length.toString(), 
      change: `${services.filter(s => s.active).length} active`, 
      color: 'green', 
      icon: Star 
    },
    { 
      label: 'Testimonials', 
      value: testimonials.length.toString(), 
      change: `${testimonials.filter(t => t.featured).length} featured`, 
      color: 'orange', 
      icon: Users 
    },
  ];

  const getColorClass = (color) => {
    const colorMap = {
      cyan: 'from-cyan-500/20 to-cyan-500/10 text-cyan-400',
      purple: 'from-purple-500/20 to-purple-500/10 text-purple-400',
      green: 'from-green-500/20 to-green-500/10 text-green-400',
      orange: 'from-orange-500/20 to-orange-500/10 text-orange-400',
    };
    return colorMap[color] || colorMap.cyan;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 bg-gradient-to-br ${getColorClass(stat.color)} rounded-lg`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
          <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.change}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;