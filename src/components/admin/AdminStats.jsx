import { useEffect, useState } from "react";
import {
  Briefcase,
  FileText,
  Star,
  Users,
  Code,
  Award,
  Smartphone,
  FileText as ResumeIcon,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

// --- Sub-Component: Animated Number ---
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = parseInt(value, 10) || 0;

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    const duration = 1000; // 1 second animation
    const incrementTime = 20; // update every 20ms
    const steps = duration / incrementTime;
    const increment = end / steps;

    if (end === 0) return;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.ceil(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [numericValue]);

  return <span>{displayValue}</span>;
};

// --- Main Component ---
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
  
  // Helper to calculate percentages for the progress bar
  const getPercentage = (partial, total) => {
    if (!total || total === 0) return 0;
    return Math.round((partial / total) * 100);
  };

  const stats = [
    {
      label: "Projects",
      value: projects?.length || 0,
      subValue: projects?.filter((p) => p.published)?.length || 0,
      subLabel: "Published",
      color: "cyan",
      icon: Briefcase,
    },
    {
      label: "Apps",
      value: apps?.length || 0,
      subValue: apps?.filter((a) => a.published)?.length || 0,
      subLabel: "Live",
      color: "purple",
      icon: Smartphone,
    },
    {
      label: "Services",
      value: services?.length || 0,
      subValue: services?.filter((s) => s.active)?.length || 0,
      subLabel: "Active",
      color: "emerald",
      icon: Star,
    },
    {
      label: "Skills",
      value: skills?.length || 0,
      subValue: new Set(skills?.map((s) => s.category)).size || 0,
      subLabel: "Categories",
      color: "blue",
      icon: Code,
    },
    {
      label: "Blog Posts",
      value: blogs?.length || 0,
      subValue: blogs?.filter((b) => b.published)?.length || 0,
      subLabel: "Published",
      color: "pink",
      icon: FileText,
    },
    {
      label: "Testimonials",
      value: testimonials?.length || 0,
      subValue: testimonials?.filter((t) => t.featured)?.length || 0,
      subLabel: "Featured",
      color: "orange",
      icon: Users,
    },
    {
      label: "Certifications",
      value: certifications?.length || 0,
      subValue: certifications?.length || 0, // 100% for now
      subLabel: "Earned",
      color: "yellow",
      icon: Award,
    },
    {
      label: "Resume",
      value: resumes?.length || 0,
      subValue: resumes?.filter((r) => r.is_active)?.length || 0,
      subLabel: "Active",
      color: "red",
      icon: ResumeIcon,
    },
  ];

  // Color Definitions for Dynamic Styling
  const colors = {
    cyan: "bg-cyan-500", text: "text-cyan-400", border: "group-hover:border-cyan-500/50", glow: "shadow-cyan-500/20",
    purple: "bg-purple-500", text: "text-purple-400", border: "group-hover:border-purple-500/50", glow: "shadow-purple-500/20",
    emerald: "bg-emerald-500", text: "text-emerald-400", border: "group-hover:border-emerald-500/50", glow: "shadow-emerald-500/20",
    blue: "bg-blue-500", text: "text-blue-400", border: "group-hover:border-blue-500/50", glow: "shadow-blue-500/20",
    pink: "bg-pink-500", text: "text-pink-400", border: "group-hover:border-pink-500/50", glow: "shadow-pink-500/20",
    orange: "bg-orange-500", text: "text-orange-400", border: "group-hover:border-orange-500/50", glow: "shadow-orange-500/20",
    yellow: "bg-yellow-500", text: "text-yellow-400", border: "group-hover:border-yellow-500/50", glow: "shadow-yellow-500/20",
    red: "bg-red-500", text: "text-red-400", border: "group-hover:border-red-500/50", glow: "shadow-red-500/20",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {stats.map((stat, idx) => {
        const theme = colors[stat.color] || colors.cyan;
        const percentage = getPercentage(stat.subValue, stat.value);

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme.glow} ${theme.border}`}
          >
            {/* Background Glow Effect */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 ${theme.bg} opacity-5 blur-[60px] group-hover:opacity-10 transition-opacity duration-500`} />

            <div className="relative z-10">
              {/* Header: Icon & Label */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-black text-white tracking-tight">
                    <AnimatedNumber value={stat.value} />
                  </h3>
                </div>
                
                <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${theme.text} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={22} />
                </div>
              </div>

              {/* Footer: Progress Bar & Context */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">
                    {stat.subValue} {stat.subLabel}
                  </span>
                  <span className={`${theme.text} font-bold`}>
                    {percentage}%
                  </span>
                </div>
                
                {/* Progress Bar Container */}
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    className={`h-full rounded-full ${theme.bg}`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AdminStats;