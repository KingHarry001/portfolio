import {
  BarChart3,
  Briefcase,
  Star,
  FileText,
  MessageSquare,
  Image,
  Code,
  Award,
  Smartphone,
  FileText as ResumeIcon,
  Users,
  Star as ReviewsIcon,
  LayoutDashboard
} from "lucide-react";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuGroups = [
    {
      title: "Dashboard",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
      ]
    },
    {
      title: "Content",
      items: [
        { id: "projects", label: "Projects", icon: Briefcase },
        { id: "apps", label: "Apps", icon: Smartphone },
        { id: "blog", label: "Blog Posts", icon: FileText },
        { id: "services", label: "Services", icon: Star },
      ]
    },
    {
      title: "Profile",
      items: [
        { id: "skills", label: "Skills", icon: Code },
        { id: "certifications", label: "Certifications", icon: Award },
        { id: "resumes", label: "Resumes", icon: ResumeIcon },
        { id: "testimonials", label: "Testimonials", icon: MessageSquare },
      ]
    },
    {
      title: "System",
      items: [
        { id: "users", label: "User Management", icon: Users },
        { id: "reviews", label: "Reviews", icon: ReviewsIcon },
        { id: "media", label: "Media Library", icon: Image },
      ]
    }
  ];

  return (
    <div className="py-2">
      <div className="space-y-6">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="px-3">
            {/* Section Header */}
            <h4 className="mb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {group.title}
            </h4>
            
            {/* Navigation Items */}
            <nav className="space-y-1">
              {group.items.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                      ${isActive 
                        ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {/* Active Indicator Line */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                    )}

                    {/* Icon with glow on active */}
                    <Icon 
                      className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 
                        ${isActive ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300"}
                      `} 
                    />
                    
                    <span>{tab.label}</span>

                    {/* Optional: Add Chevron or dot for active state if preferred */}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;