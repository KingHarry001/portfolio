// src/components/admin/AdminStats.jsx - UPDATED
import { Briefcase, FileText, Star, Users, TrendingUp, Code, Award } from 'lucide-react';

const AdminStats = ({ projects, services, blogs, testimonials, skills, certifications }) => {
  const stats = [
    { 
      label: 'Total Projects', 
      value: projects?.length?.toString() || '0', 
      change: `${projects?.filter(p => p.published)?.length || 0} published`, 
      color: 'cyan', 
      icon: Briefcase 
    },
    { 
      label: 'Skills', 
      value: skills?.length?.toString() || '0', 
      change: `${Object.keys(skills?.reduce((acc, s) => ({ ...acc, [s.category]: true }), {}) || {}).length} categories`, 
      color: 'blue', 
      icon: Code 
    },
    { 
      label: 'Certifications', 
      value: certifications?.length?.toString() || '0', 
      change: `Latest: ${certifications?.[0]?.year || 'N/A'}`, 
      color: 'yellow', 
      icon: Award 
    },
    { 
      label: 'Active Services', 
      value: services?.length?.toString() || '0', 
      change: `${services?.filter(s => s.active)?.length || 0} active`, 
      color: 'green', 
      icon: Star 
    },
    { 
      label: 'Blog Posts', 
      value: blogs?.length?.toString() || '0', 
      change: `${blogs?.filter(b => b.published)?.length || 0} published`, 
      color: 'purple', 
      icon: FileText 
    },
    { 
      label: 'Testimonials', 
      value: testimonials?.length?.toString() || '0', 
      change: `${testimonials?.filter(t => t.featured)?.length || 0} featured`, 
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
      blue: 'from-blue-500/20 to-blue-500/10 text-blue-400',
      yellow: 'from-yellow-500/20 to-yellow-500/10 text-yellow-400',
    };
    return colorMap[color] || colorMap.cyan;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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