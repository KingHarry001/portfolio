import React, { useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  Github,
  Filter,
  Eye,
  Star,
  Code2,
  Sparkles,
  X,
  Calendar,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
// UPDATED: Import from Supabase hook instead of mock data
import { useProjects } from "../hooks/useSupabase";


const ProjectModal = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef();
  const [touchStartX, setTouchStartX] = useState(0);

  // Reset image index when modal opens with new project
  useEffect(() => {
    if (isOpen && project) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, project]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();

      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      const handleKeyNavigation = (e) => {
        if (e.key === "ArrowLeft") {
          prevImage();
        } else if (e.key === "ArrowRight") {
          nextImage();
        }
      };

      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleKeyNavigation);

      return () => {
        document.body.style.overflow = originalStyle;
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("keydown", handleKeyNavigation);
      };
    }
  }, [isOpen, onClose]);

  const nextImage = () => {
    if (!project?.gallery) return;
    setCurrentImageIndex((prev) => 
      prev === project.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!project?.gallery) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.gallery.length - 1 : prev - 1
    );
  };

  if (!isOpen || !project) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-6xl max-h-[90vh] bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden shadow-2xl"
        tabIndex={-1}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-all duration-300"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header Section */}
          <div className="relative">
            {/* Image Gallery */}
            <div
              className="relative h-80 overflow-hidden bg-black"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                key={currentImageIndex}
                src={project.gallery[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {project.gallery.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-all duration-300 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-all duration-300 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {project.gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? "bg-white w-8"
                            : "bg-white/40 hover:bg-white/75"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Project badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {project.featured && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                    <Star size={14} className="fill-current" />
                    Featured
                  </span>
                )}
                <span
                  className={`px-3 py-1.5 text-sm font-medium rounded-full text-white bg-gradient-to-r ${
                    project.category === "Design"
                      ? "from-purple-500 to-pink-500"
                      : project.category === "Dev"
                      ? "from-blue-500 to-cyan-500"
                      : project.category === "Security"
                      ? "from-red-500 to-orange-500"
                      : project.category === "App"
                      ? "from-red-500 to-orange-500"
                      : "from-green-500 to-emerald-500"
                  }`}
                >
                  {project.category}
                </span>
              </div>

              {/* Image counter */}
              {project.gallery.length > 1 && (
                <div className="absolute top-4 right-16 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {project.gallery.length}
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Title and Description */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {project.title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {project.fullDescription}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 w-full flex-wrap">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-chart-1 to-purple-500 text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-chart-1/25 transition-all duration-300"
                >
                  <ExternalLink size={18} />
                  View Live Project
                </a>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-card/50 border border-border/50 text-muted-foreground rounded-2xl font-medium hover:border-chart-1/50 hover:text-chart-1 transition-all duration-300"
                  >
                    <Github size={18} />
                    View Code
                  </a>
                )}
              </div>
            </div>

            {/* Project Details Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-chart-1" />
                  <span className="font-medium text-foreground">Completed</span>
                </div>
                <p className="text-muted-foreground">
                  {new Date(project.completionDate).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </p>
              </div>

              <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-chart-1" />
                  <span className="font-medium text-foreground">Team Size</span>
                </div>
                <p className="text-muted-foreground">
                  {project.teamSize} {project.teamSize === 1 ? 'member' : 'members'}
                </p>
              </div>

              <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-chart-1" />
                  <span className="font-medium text-foreground">Duration</span>
                </div>
                <p className="text-muted-foreground">{project.duration}</p>
              </div>

              <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-chart-1" />
                  <span className="font-medium text-foreground">Client</span>
                </div>
                <p className="text-muted-foreground">{project.clientName}</p>
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-chart-1/10 to-purple-500/10 border border-chart-1/20 text-chart-1 font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features, Challenges, Results */}
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {project.keyFeatures.map((feature, index) => (
                    <li
                      key={index}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-chart-1 rounded-full mt-2 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Challenges
                </h3>
                <ul className="space-y-2">
                  {project.challenges.map((challenge, index) => (
                    <li
                      key={index}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Results
                </h3>
                <ul className="space-y-2">
                  {project.results.map((result, index) => (
                    <li
                      key={index}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // UPDATED: Fetch projects from Supabase
  const { data: projects, loading: projectsLoading, error: projectsError } = useProjects();

  const categories = ["All", "App", "Design", "Dev", "Security", "Experimental"];

  const categoryColors = {
    App: "from-green-500 to-emerald-500",
    Design: "from-purple-500 to-pink-500",
    Dev: "from-blue-500 to-cyan-500",
    Security: "from-red-500 to-orange-500",
    Experimental: "from-green-500 to-emerald-500",
  };

  // UPDATED: Initialize filtered projects when data loads
  useEffect(() => {
    if (projects) {
      setFilteredProjects(projects);
    }
  }, [projects]);

  const handleFilterChange = (category) => {
    setIsLoading(true);
    setActiveFilter(category);

    setTimeout(() => {
      if (category === "All") {
        setFilteredProjects(projects || []);
      } else {
        setFilteredProjects(
          (projects || []).filter((project) => project.category === category)
        );
      }
      setIsLoading(false);
    }, 500);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  // UPDATED: Show loading state
  if (projectsLoading) {
    return (
      <section className="relative py-20 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-chart-1 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // UPDATED: Show error state
  if (projectsError) {
    return (
      <section className="relative py-20 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 mb-4">Error loading projects</p>
              <p className="text-muted-foreground">{projectsError}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // UPDATED: Show empty state
  if (!projects || projects.length === 0) {
    return (
      <section className="relative py-20 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center py-20">
            <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground">Check back soon for amazing projects!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="relative py-20 bg-background overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-chart-1/10 border border-chart-1/20 rounded-full mb-6">
            <Code2 className="w-4 h-4 text-chart-1" />
            <span className="text-chart-1 text-sm font-medium">My Work</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Featured{" "}
            <span className="bg-gradient-to-r from-chart-1 to-purple-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A showcase of my latest work spanning design, development, security,
            and experimental technologies.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-chart-1 mr-6 px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full border border-border/50">
            <Filter size={18} />
            <span className="font-medium text-sm">Filter by:</span>
          </div>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              disabled={isLoading}
              className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 disabled:opacity-50 ${
                activeFilter === category
                  ? "bg-gradient-to-r from-chart-1 to-purple-500 text-white shadow-lg shadow-chart-1/25"
                  : "bg-card/40 backdrop-blur-sm text-muted-foreground border border-border/50 hover:border-chart-1/50 hover:text-chart-1 hover:bg-chart-1/5"
              }`}
            >
              {isLoading && activeFilter === category && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              <span
                className={
                  isLoading && activeFilter === category
                    ? "opacity-0"
                    : "opacity-100"
                }
              >
                {category}
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-chart-1/30 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105"
              onClick={() => handleProjectClick(project)}
            >
              {/* Enhanced glowing border */}
              <div className="absolute inset-0 bg-gradient-to-r from-chart-1/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10 rounded-2xl"></div>

              {/* Project Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                    <Star size={14} className="fill-current" />
                    Featured
                  </div>
                )}

                {/* Index number */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* View Details Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-chart-1 hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r ${
                      categoryColors[project.category] ||
                      "from-gray-500 to-gray-600"
                    } text-white`}
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-chart-1 transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Project Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags && project.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2.5 py-1 bg-gradient-to-r from-chart-1/10 to-purple-500/10 border border-chart-1/20 text-chart-1 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags && project.tags.length > 3 && (
                    <span className="px-2.5 py-1 bg-muted/50 text-muted-foreground text-xs font-medium rounded-full">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* View Project Button */}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-card/60 border border-border/50 text-muted-foreground rounded-xl font-medium hover:border-chart-1/50 hover:text-chart-1 hover:bg-chart-1/5 transition-all duration-300 group/btn">
                  <span>View Project Details</span>
                  <ExternalLink
                    size={16}
                    className="group-hover/btn:translate-x-1 transition-transform duration-300"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mb-20">
          <button
            onClick={() =>
              alert(
                "Loading more projects... This would load additional projects"
              )
            }
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-chart-1 to-purple-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-chart-1/25 transition-all duration-300 mx-auto group"
          >
            <Sparkles
              size={18}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span>Load More Projects</span>
          </button>
        </div>

        {/* Project Statistics - UPDATED to use dynamic data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-border/50">
          <div className="text-center group">
            <div className="relative">
              <div className="text-4xl font-bold text-chart-1 mb-2">
                {projects?.length || 0}
              </div>
              <div className="absolute -inset-2 bg-chart-1/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-muted-foreground font-medium">
              Total Projects
            </div>
          </div>

          <div className="text-center group">
            <div className="relative">
              <div className="text-4xl font-bold text-chart-1 mb-2">
                {projects?.filter((p) => p.featured).length || 0}
              </div>
              <div className="absolute -inset-2 bg-chart-1/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-muted-foreground font-medium">
              Featured Works
            </div>
          </div>

          <div className="text-center group">
            <div className="relative">
              <div className="text-4xl font-bold text-chart-1 mb-2">
                {categories.length - 1}
              </div>
              <div className="absolute -inset-2 bg-chart-1/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-muted-foreground font-medium">Categories</div>
          </div>

          <div className="text-center group">
            <div className="relative">
              <div className="text-4xl font-bold text-chart-1 mb-2">100%</div>
              <div className="absolute -inset-2 bg-chart-1/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-muted-foreground font-medium">
              Client Satisfaction
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default ProjectsSection;