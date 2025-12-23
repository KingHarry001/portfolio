import {
  Briefcase,
  FileText,
  Star,
  Users,
  TrendingUp,
  Code,
  Award,
  Smartphone,
  FileText as ResumeIcon,
} from "lucide-react";

const AdminStats = ({
  projects,
  services,
  blogs,
  testimonials,
  skills,
  certifications,
  apps,
  resumes,
}) => {
  const stats = [
    {
      label: "Projects",
      value: projects?.length?.toString() || "0",
      change: `${projects?.filter((p) => p.published)?.length || 0} published`,
      color: "cyan",
      icon: Briefcase,
    },
    {
      label: "Apps",
      value: apps?.length?.toString() || "0",
      change: `${apps?.filter((a) => a.published)?.length || 0} published`,
      color: "purple",
      icon: Smartphone,
    },
    {
      label: "Skills",
      value: skills?.length?.toString() || "0",
      change: `${
        Object.keys(
          skills?.reduce((acc, s) => ({ ...acc, [s.category]: true }), {}) || {}
        ).length
      } categories`,
      color: "blue",
      icon: Code,
    },
    {
      label: "Certifications",
      value: certifications?.length?.toString() || "0",
      change: `Latest: ${certifications?.[0]?.year || "N/A"}`,
      color: "yellow",
      icon: Award,
    },
    {
      label: "Resume", // ADD THIS STAT
      value: resumes?.filter((r) => r.is_active)?.length > 0 ? "1" : "0",
      change: `${resumes?.length || 0} total`,
      color: "green",
      icon: ResumeIcon,
    },
    {
      label: "Services",
      value: services?.length?.toString() || "0",
      change: `${services?.filter((s) => s.active)?.length || 0} active`,
      color: "green",
      icon: Star,
    },
    {
      label: "Blog Posts",
      value: blogs?.length?.toString() || "0",
      change: `${blogs?.filter((b) => b.published)?.length || 0} published`,
      color: "pink",
      icon: FileText,
    },
    {
      label: "Testimonials",
      value: testimonials?.length?.toString() || "0",
      change: `${
        testimonials?.filter((t) => t.featured)?.length || 0
      } featured`,
      color: "orange",
      icon: Users,
    },
  ];

  const getColorClass = (color) => {
    const colorMap = {
      cyan: "from-cyan-500/20 to-cyan-500/10 text-cyan-400",
      purple: "from-purple-500/20 to-purple-500/10 text-purple-400",
      green: "from-green-500/20 to-green-500/10 text-green-400",
      orange: "from-orange-500/20 to-orange-500/10 text-orange-400",
      blue: "from-blue-500/20 to-blue-500/10 text-blue-400",
      yellow: "from-yellow-500/20 to-yellow-500/10 text-yellow-400",
      pink: "from-pink-500/20 to-pink-500/10 text-pink-400",
    };
    return colorMap[color] || colorMap.cyan;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:border-cyan-500/50 transition-colors group"
        >
          <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
            <div
              className={`p-1.5 sm:p-2 md:p-3 bg-gradient-to-br ${getColorClass(
                stat.color
              )} rounded-md sm:rounded-lg`}
            >
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-400" />
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 truncate">
            {stat.label}
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
            {stat.value}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 truncate">
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
