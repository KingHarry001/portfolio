// src/components/admin/AdminSidebar.jsx - UPDATED WITH ADMIN TABS
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
  Users,           // Add this for User Management
  Shield,          // Add this for admin protection
  Star as ReviewsIcon, // Add this for Reviews
  Settings,        // Optional: for Settings tab
} from "lucide-react";

// Alternative simpler version:
const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "apps", label: "Apps", icon: Smartphone },
    { id: "skills", label: "Skills", icon: Code },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "services", label: "Services", icon: Star },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "blog", label: "Blog Posts", icon: FileText },
    { id: "resumes", label: "Resumes", icon: ResumeIcon },
    { id: "users", label: "User Management", icon: Users },
    { id: "reviews", label: "Reviews", icon: ReviewsIcon },
    { id: "media", label: "Media Library", icon: Image },
  ];

  return (
    <div className="space-y-2">
      <nav className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-cyan-500 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            } `}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;