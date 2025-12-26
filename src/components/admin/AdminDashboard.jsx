import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminStats from "./AdminStats";
import ProjectsTable from "./ProjectsTable";
import ServicesTable from "./ServicesTable";
import BlogPostsTable from "./BlogPostsTable";
import TestimonialsTable from "./TestimonialsTable";
import SkillsTable from "./SkillsTable";
import CertificationsTable from "./CertificationsTable";
import AppsTable from "./AppsTable";
import ResumesTable from "./ResumesTable";
import Notification from "./Notification";
import ProjectFormModal from "./ProjectFormModal";
import AppFormModal from "./AppFormModal";
import ResumeFormModal from "./ResumeFormModal";
import GenericFormModal from "./GenericFormModal";
import {
  projectsAPI,
  servicesAPI,
  blogAPI,
  testimonialsAPI,
  skillsAPI,
  certificationsAPI,
  appsAPI,
  resumesAPI,
} from "../../api/supabase";
import Loading from "../../components/LoadingSpinner3D";
import AdminReviewsPanel from "./AdminReviewsPanel";
import AdminPanel from "./AdminPanel";
import {
  Plus,
  LayoutGrid,
  FileText,
  Smartphone,
  Award,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import useNotification from "../../hooks/useNotification";
import DashboardOverview from "./DashboardOverview";

const AdminDashboard = () => {
  // ✅ FIXED: Safe Tab Initialization
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem("adminActiveTab");
      // Only return saved tab if it's a valid string, otherwise default to overview
      return saved && typeof saved === "string" ? saved : "overview";
    } catch (e) {
      return "overview";
    }
  });

  // ✅ FIXED: Save Tab on Change
  useEffect(() => {
    try {
      localStorage.setItem("adminActiveTab", activeTab);
    } catch (e) {
      console.warn("Could not save tab state");
    }
  }, [activeTab]);

  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [apps, setApps] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notification, showNotification } = useNotification();

  // Fetch Data when Tab Changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    // Don't fetch for these tabs (they handle their own data)
    if (["users", "reviews", "media"].includes(activeTab)) return;

    setLoading(true);
    try {
      // Use switch to fetch only what is needed
      switch (activeTab) {
        case "projects":
          setProjects((await projectsAPI.getAll({ showDrafts: true })) || []);
          break;
        case "services":
          setServices((await servicesAPI.getAll()) || []);
          break;
        case "blog":
          setBlogs((await blogAPI.getAll()) || []);
          break;
        case "testimonials":
          setTestimonials((await testimonialsAPI.getAll()) || []);
          break;
        case "skills":
          setSkills((await skillsAPI.getAll()) || []);
          break;
        case "certifications":
          setCertifications((await certificationsAPI.getAll()) || []);
          break;
        case "apps":
          setApps((await appsAPI.getAll({ published: undefined })) || []);
          break;
        case "resumes":
          setResumes((await resumesAPI.getAll()) || []);
          break;
        case "overview":
          // Load everything for stats
          const [p, s, b, t, sk, c, a, r] = await Promise.all([
            projectsAPI.getAll({ showDrafts: true }).catch(() => []),
            servicesAPI.getAll().catch(() => []),
            blogAPI.getAll().catch(() => []),
            testimonialsAPI.getAll().catch(() => []),
            skillsAPI.getAll().catch(() => []),
            certificationsAPI.getAll().catch(() => []),
            appsAPI.getAll({ published: undefined }).catch(() => []),
            resumesAPI.getAll().catch(() => []),
          ]);
          setProjects(p);
          setServices(s);
          setBlogs(b);
          setTestimonials(t);
          setSkills(sk);
          setCertifications(c);
          setApps(a);
          setResumes(r);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showNotification("Error loading data: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (type) => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;

    try {
      setLoading(true);
      const apiMap = {
        project: projectsAPI,
        service: servicesAPI,
        blog: blogAPI,
        testimonial: testimonialsAPI,
        skill: skillsAPI,
        certification: certificationsAPI,
        app: appsAPI,
        resume: resumesAPI,
      };

      if (!apiMap[type]) throw new Error(`Unknown type: ${type}`);

      // Special case for projects requiring user ID
      if (type === "project") await apiMap[type].delete(id, "admin-user-id");
      else await apiMap[type].delete(id);

      showNotification(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`
      );
      await fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      showNotification(`Failed to delete: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      await resumesAPI.setActive(id);
      showNotification("Resume set as active successfully!");
      fetchData();
    } catch (error) {
      showNotification("Error: " + error.message, "error");
    }
  };

  // --- Render Content Logic ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loading />
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Dashboard Overview
              </h2>
              <p className="text-gray-400 mt-1">
                Welcome back, Admin. Here's what's happening.
              </p>
            </div>

            {activeTab === "overview" && (
              <DashboardOverview
                data={{
                  projects,
                  services,
                  blogs,
                  testimonials,
                  skills,
                  certifications,
                  apps,
                  resumes,
                }}
              />
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "New Project",
                      icon: LayoutGrid,
                      action: () => {
                        setActiveTab("projects");
                        handleAdd("project");
                      },
                      color: "text-blue-400",
                      border: "group-hover:border-blue-500/50",
                    },
                    {
                      label: "New App",
                      icon: Smartphone,
                      action: () => {
                        setActiveTab("apps");
                        handleAdd("app");
                      },
                      color: "text-purple-400",
                      border: "group-hover:border-purple-500/50",
                    },
                    {
                      label: "New Skill",
                      icon: Award,
                      action: () => {
                        setActiveTab("skills");
                        handleAdd("skill");
                      },
                      color: "text-emerald-400",
                      border: "group-hover:border-emerald-500/50",
                    },
                    {
                      label: "New Post",
                      icon: FileText,
                      action: () => {
                        setActiveTab("blog");
                        handleAdd("blog");
                      },
                      color: "text-pink-400",
                      border: "group-hover:border-pink-500/50",
                    },
                  ].map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={btn.action}
                      className={`group relative p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 ${btn.border}`}
                    >
                      <div
                        className={`p-3 rounded-lg bg-white/5 w-fit mb-3 ${btn.color} group-hover:scale-110 transition-transform`}
                      >
                        <btn.icon size={24} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                          {btn.label}
                        </span>
                        <Plus
                          size={16}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity (Projects) */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-500 rounded-full" />
                  Recent Projects
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  {projects.slice(0, 5).map((project, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center group-hover:border-white/20">
                        <LayoutGrid
                          size={18}
                          className="text-gray-400 group-hover:text-white"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {project.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {project.category}
                        </p>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          project.published
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            : "bg-amber-500"
                        }`}
                      />
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-center text-sm text-gray-500 py-4">
                      No projects yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <ProjectsTable
            projects={projects}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            onAddProject={() => handleAdd("project")}
            onEditProject={(p) => handleEdit("project", p)}
            onDeleteProject={(id) => handleDelete("project", id)}
          />
        );
      case "apps":
        return (
          <AppsTable
            apps={apps}
            onAddApp={() => handleAdd("app")}
            onEditApp={(a) => handleEdit("app", a)}
            onDeleteApp={(id) => handleDelete("app", id)}
          />
        );
      case "services":
        return (
          <ServicesTable
            services={services}
            onAddService={() => handleAdd("service")}
            onEditService={(s) => handleEdit("service", s)}
            onDeleteService={(id) => handleDelete("service", id)}
          />
        );
      case "skills":
        return (
          <SkillsTable
            skills={skills}
            onAddSkill={() => handleAdd("skill")}
            onEditSkill={(s) => handleEdit("skill", s)}
            onDeleteSkill={(id) => handleDelete("skill", id)}
          />
        );
      case "certifications":
        return (
          <CertificationsTable
            certifications={certifications}
            onAddCertification={() => handleAdd("certification")}
            onEditCertification={(c) => handleEdit("certification", c)}
            onDeleteCertification={(id) => handleDelete("certification", id)}
          />
        );
      case "blog":
        return (
          <BlogPostsTable
            blogs={blogs}
            onAddPost={() => handleAdd("blog")}
            onEditPost={(p) => handleEdit("blog", p)}
            onDeletePost={(id) => handleDelete("blog", id)}
          />
        );
      case "testimonials":
        return (
          <TestimonialsTable
            testimonials={testimonials}
            onAddTestimonial={() => handleAdd("testimonial")}
            onEditTestimonial={(t) => handleEdit("testimonial", t)}
            onDeleteTestimonial={(id) => handleDelete("testimonial", id)}
          />
        );
      case "resumes":
        return (
          <ResumesTable
            resumes={resumes}
            onAddResume={() => handleAdd("resume")}
            onEditResume={(r) => handleEdit("resume", r)}
            onDeleteResume={(id) => handleDelete("resume", id)}
            onSetActive={handleSetActive}
          />
        );

      case "users":
        return <AdminPanel />;

      case "reviews":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Review Management
              </h3>
              <p className="text-gray-400 mt-1">
                Monitor and manage user feedback.
              </p>
            </div>
            <AdminReviewsPanel />
          </div>
        );

      case "media":
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white/5 border border-white/10 rounded-2xl border-dashed">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <ImageIcon size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Media Library
            </h3>
            <p className="text-gray-400 max-w-md mb-8">
              Centralized asset management coming soon. Upload, optimize and
              organize your portfolio assets.
            </p>
            <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2">
              <Plus size={18} /> Upload Files
            </button>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Under Construction
            </h3>
            <p className="text-gray-400">
              This module is currently being developed.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-gray-900 border-r border-white/10">
              <AdminSidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 bg-black border-r border-white/10 flex-shrink-0">
          <div className="h-full overflow-y-auto p-4 custom-scrollbar">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-black relative">
          {/* Background Gradient Spot */}
          <div className="absolute top-0 left-0 w-full h-96 bg-cyan-500/5 blur-[100px] pointer-events-none" />

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-md z-40">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <div className="space-y-1.5">
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
              </div>
            </button>
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Admin
            </span>
            <div className="w-10" />
          </div>

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative z-10">
            <div className="max-w-7xl mx-auto">{renderContent()}</div>
          </main>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          {modalType === "project" && (
            <ProjectFormModal
              editingItem={editingItem}
              setShowModal={setShowModal}
              onSuccess={() => {
                fetchData();
                showNotification(
                  editingItem ? "Project updated!" : "Project created!"
                );
              }}
              onError={(e) => showNotification(e.message, "error")}
            />
          )}
          {modalType === "app" && (
            <AppFormModal
              editingItem={editingItem}
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                fetchData();
                showNotification(editingItem ? "App updated!" : "App created!");
              }}
              onError={(e) => showNotification(e.message, "error")}
            />
          )}
          {modalType === "resume" && (
            <ResumeFormModal
              editingItem={editingItem}
              setShowModal={setShowModal}
              onSuccess={() => {
                fetchData();
                showNotification(
                  editingItem ? "Resume updated!" : "Resume created!"
                );
              }}
              onError={(e) => showNotification(e.message, "error")}
            />
          )}
          {!["project", "app", "resume"].includes(modalType) && (
            <GenericFormModal
              type={modalType}
              editingItem={editingItem}
              setShowModal={setShowModal}
              onSuccess={() => {
                fetchData();
                showNotification(`${modalType} saved!`);
              }}
              onError={(e) => showNotification(e.message, "error")}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
