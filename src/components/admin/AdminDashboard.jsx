import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminStats from './AdminStats';
import ProjectsTable from './ProjectsTable';
import ServicesTable from './ServicesTable';
import BlogPostsTable from './BlogPostsTable';
import TestimonialsTable from './TestimonialsTable';
import Notification from './Notification';
import ProjectFormModal from './ProjectFormModal';
import { projectsAPI, servicesAPI, blogAPI, testimonialsAPI } from '../../api/supabase';
import FloatingUserButton from './FloatingUserButton';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch(activeTab) {
        case 'projects':
          const projectData = await projectsAPI.getAll({ showDrafts: true });
          setProjects(projectData || []);
          break;
        case 'services':
          const serviceData = await servicesAPI.getAll();
          setServices(serviceData || []);
          break;
        case 'blog':
          const blogData = await blogAPI.getAll();
          setBlogs(blogData || []);
          break;
        case 'testimonials':
          const testimonialData = await testimonialsAPI.getAll();
          setTestimonials(testimonialData || []);
          break;
        case 'overview':
          const [p, s, b, t] = await Promise.all([
            projectsAPI.getAll({ showDrafts: true }),
            servicesAPI.getAll(),
            blogAPI.getAll(),
            testimonialsAPI.getAll()
          ]);
          setProjects(p || []);
          setServices(s || []);
          setBlogs(b || []);
          setTestimonials(t || []);
          break;
      }
    } catch (error) {
      showNotification('Error loading data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-cyan-500 animate-spin" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Dashboard Overview</h3>
                <p className="text-sm sm:text-base text-gray-400">Manage your portfolio content</p>
              </div>
            </div>

            <FloatingUserButton />

            <AdminStats 
              projects={projects}
              services={services}
              blogs={blogs}
              testimonials={testimonials}
            />
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'New Project', emoji: '🚀', action: () => { setActiveTab('projects'); setShowModal(true); } },
                  { label: 'New Post', emoji: '📝', action: () => setActiveTab('blog') },
                  { label: 'Add Service', emoji: '⭐', action: () => setActiveTab('services') },
                  { label: 'Upload Media', emoji: '🖼️', action: () => setActiveTab('media') }
                ].map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.action}
                    className="p-3 sm:p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-cyan-500 transition-colors group"
                  >
                    <div className="text-2xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                      {action.emoji}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">{action.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3 sm:space-y-4">
                {[...projects.slice(0, 5)].map((project, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-900/50 rounded-lg gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-sm sm:text-base">📁</span>
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm sm:text-base">{project.title}</p>
                        <p className="text-xs sm:text-sm text-gray-400">Project • {project.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs ${
                      project.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <ProjectsTable 
            projects={projects}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            onAddProject={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            onEditProject={(project) => {
              setEditingItem(project);
              setShowModal(true);
            }}
            onDeleteProject={async (projectId) => {
              if (window.confirm('Delete this project?')) {
                try {
                  await projectsAPI.delete(projectId, 'admin-user-id');
                  showNotification('Project deleted successfully!');
                  fetchData();
                } catch (error) {
                  showNotification('Error deleting project: ' + error.message, 'error');
                }
              }
            }}
          />
        );

      case 'services':
        return (
          <ServicesTable 
            services={services}
            onAddService={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            onEditService={(service) => {
              setEditingItem(service);
              setShowModal(true);
            }}
            onDeleteService={async (serviceId) => {
              if (window.confirm('Delete this service?')) {
                try {
                  await servicesAPI.delete(serviceId);
                  showNotification('Service deleted successfully!');
                  fetchData();
                } catch (error) {
                  showNotification('Error: ' + error.message, 'error');
                }
              }
            }}
          />
        );

      case 'blog':
        return (
          <BlogPostsTable 
            blogs={blogs}
            onAddPost={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            onEditPost={(post) => {
              setEditingItem(post);
              setShowModal(true);
            }}
            onDeletePost={async (postId) => {
              if (window.confirm('Delete this post?')) {
                try {
                  await blogAPI.delete(postId);
                  showNotification('Post deleted!');
                  fetchData();
                } catch (error) {
                  showNotification('Error: ' + error.message, 'error');
                }
              }
            }}
          />
        );

      case 'testimonials':
        return (
          <TestimonialsTable 
            testimonials={testimonials}
            onAddTestimonial={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            onEditTestimonial={(testimonial) => {
              setEditingItem(testimonial);
              setShowModal(true);
            }}
            onDeleteTestimonial={async (testimonialId) => {
              if (window.confirm('Delete this testimonial?')) {
                try {
                  await testimonialsAPI.delete(testimonialId);
                  showNotification('Testimonial deleted!');
                  fetchData();
                } catch (error) {
                  showNotification('Error: ' + error.message, 'error');
                }
              }
            }}
          />
        );

      case 'media':
        return (
          <div className="text-center py-12 sm:py-20 px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4 text-4xl sm:text-5xl">🖼️</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-400 mb-2">Media Library</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">Upload and manage your media files</p>
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 inline-flex items-center gap-2 text-sm sm:text-base">
              <span className="text-sm sm:text-base">📤</span>
              Upload Files
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center py-12 sm:py-20 px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4 text-4xl sm:text-5xl">⚙️</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-400 mb-2">Coming Soon</h3>
            <p className="text-sm sm:text-base text-gray-500">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {notification && <Notification message={notification.message} type={notification.type} />}
      
      <div className="flex flex-col sm:flex-row">
        {/* Mobile Sidebar Toggle */}
        {sidebarOpen && (
          <div className="sm:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 z-50">
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
        <div className="hidden sm:block w-64 bg-gray-900 border-r border-gray-800 min-h-screen p-6 sticky top-0">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Mobile Header */}
          <div className="sm:hidden flex items-center justify-between mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-gray-800 rounded-lg"
            >
              <span className="text-white">☰</span>
            </button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
          
          {renderContent()}
        </div>
      </div>

      {showModal && (
        <ProjectFormModal
          editingItem={editingItem}
          setShowModal={setShowModal}
          onSuccess={() => {
            fetchData();
            showNotification(
              editingItem ? 'Project updated successfully!' : 'Project created successfully!'
            );
          }}
          onError={(error) => showNotification('Error: ' + error.message, 'error')}
        />
      )}
    </div>
  );
};

export default AdminDashboard;