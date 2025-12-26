import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink, Github, Star, Code2, Sparkles, X,
  Calendar, Users, Award, ChevronRight, Clock,
  Zap, Target, TrendingUp, Shield, Palette,
  ArrowRight, GitBranch, Layers, Cpu
} from "lucide-react";
import { useProjects } from "../../hooks/useSupabase";

// Enhanced Project Modal
const ProjectModal = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef();
  const [isImageLoading, setIsImageLoading] = useState(true);

  const normalized = useMemo(() => {
    if (!project) return null;
    return {
      ...project,
      keyFeatures: project.key_features || project.keyFeatures || [],
      clientName: project.client_name || project.clientName || "",
      completionDate: project.completion_date || project.completionDate,
      liveUrl: project.live_url || project.liveUrl,
      githubUrl: project.github_url || project.githubUrl,
      tags: Array.isArray(project.tags) ? project.tags : [],
      gallery: Array.isArray(project.gallery) ? project.gallery : [project.image].filter(Boolean),
      challenges: Array.isArray(project.challenges) ? project.challenges : [],
      results: Array.isArray(project.results) ? project.results : [],
    };
  }, [project]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsImageLoading(true);
      return () => (document.body.style.overflow = "unset");
    }
  }, [isOpen]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % normalized.gallery.length);
  }, [normalized?.gallery.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + normalized.gallery.length) % normalized.gallery.length);
  }, [normalized?.gallery.length]);

  // Auto-rotate images in modal
  useEffect(() => {
    if (!isOpen || !normalized || normalized.gallery.length <= 1) return;
    
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, normalized, nextImage]);

  const categoryIcons = {
    App: <Sparkles className="w-5 h-5" />,
    Design: <Palette className="w-5 h-5" />,
    Dev: <Code2 className="w-5 h-5" />,
    Security: <Shield className="w-5 h-5" />,
    Experimental: <Zap className="w-5 h-5" />,
  };

  if (!isOpen || !normalized) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 pointer-events-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-3 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-xl hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto max-h-[90vh]">
                {/* Hero Section with Image Gallery */}
                <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-zinc-900 to-black">
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  
                  <img
                    src={normalized.gallery[currentImageIndex]}
                    alt={normalized.title}
                    className={`w-full h-full object-cover transition-all duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsImageLoading(false)}
                  />

                  {/* Navigation Dots */}
                  {normalized.gallery.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {normalized.gallery.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === currentImageIndex 
                              ? 'w-8 bg-cyan-500' 
                              : 'bg-white/30 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 flex gap-3">
                    <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md border border-white/10 rounded-xl text-white font-medium flex items-center gap-2">
                      {categoryIcons[normalized.category] || <Code2 className="w-4 h-4" />}
                      {normalized.category}
                    </div>
                    {normalized.featured && (
                      <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-white/10 rounded-xl text-white font-medium flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Featured
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12">
                  <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                      <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                          {normalized.title}
                        </h1>
                        <p className="text-xl text-zinc-400 leading-relaxed">
                          {normalized.full_description || normalized.description}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-4">
                        {normalized.liveUrl && (
                          <a
                            href={normalized.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:text-black"
                          >
                            <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span>View Live Project</span>
                          </a>
                        )}
                        {normalized.githubUrl && (
                          <a
                            href={normalized.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-zinc-800/50 border border-white/10 text-white font-bold rounded-xl hover:border-cyan-500/50 hover:text-cyan-500 transition-all duration-300 hover:scale-105"
                          >
                            <Github className="w-5 h-5" />
                            <span>View Source Code</span>
                          </a>
                        )}
                      </div>

                      {/* Key Features Grid */}
                      <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-cyan-500" />
                            Key Features
                          </h3>
                          <ul className="space-y-3">
                            {normalized.keyFeatures.map((feature, idx) => (
                              <li key={idx} className="text-zinc-400 flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-cyan-500" />
                            Impact & Results
                          </h3>
                          <ul className="space-y-3">
                            {normalized.results.map((result, idx) => (
                              <li key={idx} className="text-zinc-400 flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                {result}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                      {/* Quick Stats */}
                      <div className="p-6 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 backdrop-blur-md border border-white/10 rounded-2xl space-y-4">
                        <h4 className="text-lg font-bold text-white">Project Details</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Completed
                            </span>
                            <span className="text-white font-medium">
                              {normalized.completionDate 
                                ? new Date(normalized.completionDate).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short' 
                                  })
                                : 'N/A'}
                            </span>
                          </div>
                          {normalized.teamSize && (
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-500 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Team Size
                              </span>
                              <span className="text-white font-medium">{normalized.teamSize}</span>
                            </div>
                          )}
                          {normalized.duration && (
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-500 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Duration
                              </span>
                              <span className="text-white font-medium">{normalized.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              Client
                            </span>
                            <span className="text-white font-medium">{normalized.clientName || 'Open Source'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Technology Stack */}
                      <div className="p-6 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 backdrop-blur-md border border-white/10 rounded-2xl">
                        <h4 className="text-lg font-bold text-white mb-4">Technology Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {normalized.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-zinc-800/50 border border-white/10 text-zinc-300 text-sm rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// Main Projects Section
const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const sectionRef = useRef(null);
  
  const { data: projects, loading, error } = useProjects();

  const categories = [
    { id: "All", label: "All Projects", icon: <Layers className="w-4 h-4" />, count: projects?.length || 0 },
    { id: "App", label: "Applications", icon: <Sparkles className="w-4 h-4" />, count: projects?.filter(p => p.category === "App").length || 0 },
    { id: "Design", label: "UI/UX Design", icon: <Palette className="w-4 h-4" />, count: projects?.filter(p => p.category === "Design").length || 0 },
    { id: "Dev", label: "Development", icon: <Code2 className="w-4 h-4" />, count: projects?.filter(p => p.category === "Dev").length || 0 },
    { id: "Security", label: "Security", icon: <Shield className="w-4 h-4" />, count: projects?.filter(p => p.category === "Security").length || 0 },
    { id: "Experimental", label: "Experimental", icon: <Zap className="w-4 h-4" />, count: projects?.filter(p => p.category === "Experimental").length || 0 },
  ];

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (activeFilter === "All") return projects;
    return projects.filter(p => p.category === activeFilter);
  }, [projects, activeFilter]);

  const categoryColors = {
    App: "from-cyan-500 to-blue-500",
    Design: "from-purple-500 to-pink-500",
    Dev: "from-blue-500 to-cyan-500",
    Security: "from-red-500 to-orange-500",
    Experimental: "from-green-500 to-emerald-500",
    All: "from-white to-zinc-400",
  };

  // Parallax effect for background elements
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      const elements = document.querySelectorAll('.parallax-element');
      elements.forEach(el => {
        el.style.transform = `translateY(${rate}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;

  return (
    <section ref={sectionRef} id="projects" className="relative py-32 bg-gradient-to-b from-[#050505] to-[#0a0a0a] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="parallax-element absolute top-1/4 -right-48 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/5 to-transparent rounded-full blur-3xl" />
        <div className="parallax-element absolute -bottom-48 -left-48 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-transparent rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(90deg, #ffffff 1px, transparent 1px),
                             linear-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-gradient-to-r from-white/5 to-transparent mb-8"
          >
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-cyan-400 uppercase tracking-widest">
              Portfolio Showcase
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
          >
            CREATIVE{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              WORKS
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12"
          >
            A curated collection of innovative projects that blend cutting-edge technology with exceptional design
          </motion.p>

          {/* Category Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
                  activeFilter === category.id
                    ? `bg-gradient-to-r ${categoryColors[category.id] || categoryColors.All} text-white shadow-lg shadow-cyan-500/25`
                    : 'bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {category.icon}
                  {category.label}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeFilter === category.id 
                    ? 'bg-white/20' 
                    : 'bg-zinc-800'
                }`}>
                  {category.count}
                </span>
                {activeFilter === category.id && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => setSelectedProject(project)}
                className="group relative cursor-pointer"
              >
                {/* Project Card */}
                <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm">
                  {/* Image Container */}
                  <div className="relative h-2/3 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r ${categoryColors[project.category] || categoryColors.All} text-white`}>
                        {project.category}
                      </span>
                    </div>
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-white/10 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.h3 
                      className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors"
                    >
                      {project.title}
                    </motion.h3>
                    
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags?.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-zinc-800/50 text-zinc-300 rounded">
                          {tag}
                        </span>
                      ))}
                      {project.tags?.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-zinc-800/50 text-zinc-500 rounded">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* View Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                        View Case Study
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${categoryColors[project.category] || categoryColors.All} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Stats Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 pt-12 border-t border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-5xl font-black bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-2">
                {projects?.length || 0}
              </div>
              <div className="text-zinc-400 text-sm uppercase tracking-widest">Total Projects</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                {projects?.filter(p => p.featured).length || 0}
              </div>
              <div className="text-zinc-400 text-sm uppercase tracking-widest">Featured Works</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                {categories.length - 1}
              </div>
              <div className="text-zinc-400 text-sm uppercase tracking-widest">Categories</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-zinc-400 text-sm uppercase tracking-widest">Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
};

// Enhanced Loading Skeleton
const LoadingSkeleton = () => (
  <section className="relative py-32 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <div className="h-8 w-48 bg-zinc-800 rounded-full animate-pulse mx-auto mb-8" />
        <div className="h-16 w-3/4 bg-zinc-800 rounded-xl animate-pulse mx-auto mb-6" />
        <div className="h-6 w-2/3 bg-zinc-800 rounded-lg animate-pulse mx-auto mb-12" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-[400px] bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  </section>
);

// Enhanced Error State
const ErrorState = ({ error }) => (
  <section className="relative py-32 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <X className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-3xl font-bold text-white mb-4">Failed to Load Projects</h3>
      <p className="text-zinc-400 mb-8 max-w-md mx-auto">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all"
      >
        Retry Loading
      </button>
    </div>
  </section>
);

export default ProjectsSection;