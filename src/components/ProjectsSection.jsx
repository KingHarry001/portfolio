import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Filter, Eye, Star, Code2, Sparkles } from "lucide-react";
import { projects } from "../data/mock";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isLoading, setIsLoading] = useState(false);

  const sectionRef = useRef();
  const headerRef = useRef();
  const filtersRef = useRef();
  const gridRef = useRef();
  const statsRef = useRef();
  const loadMoreRef = useRef();

  // Initialize animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([
        headerRef.current?.children || [],
        filtersRef.current?.children || [],
        gridRef.current?.children || [],
        statsRef.current?.children || [],
        loadMoreRef.current
      ], {
        opacity: 0,
        y: 50
      });

      // Header animation
      ScrollTrigger.create({
        trigger: headerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(headerRef.current.children, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
          });
        }
      });

      // Filters animation
      ScrollTrigger.create({
        trigger: filtersRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(filtersRef.current.children, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.4)"
          });
        }
      });

      // Project cards staggered animation
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(gridRef.current.children, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out"
          });
        }
      });

      // Stats animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(statsRef.current.children, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
          });
        }
      });

      // Load more button animation
      ScrollTrigger.create({
        trigger: loadMoreRef.current,
        start: "top 90%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(loadMoreRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.4)"
          });
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Stats counter animation
  useEffect(() => {
    if (!statsRef.current) return;

    const ctx = gsap.context(() => {
      const statEls = gsap.utils.toArray(statsRef.current.querySelectorAll(".stats-value"));

      statEls.forEach((el) => {
        const finalValue = parseInt(el.textContent.replace(/[^0-9]/g, ""));
        const suffix = el.textContent.replace(/[0-9]/g, "");
        const obj = { value: 0 };

        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reset",
          onEnter: () => {
            gsap.to(obj, {
              value: finalValue,
              duration: 2.5,
              ease: "power2.out",
              onUpdate: () => {
                el.innerText = new Intl.NumberFormat().format(Math.floor(obj.value)) + suffix;
              },
            });

            // Add scale effect
            gsap.fromTo(el,
              { scale: 0.8 },
              { scale: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
          },
        });
      });
    }, statsRef);

    return () => ctx.revert();
  }, []);

  // Enhanced individual card animations
  useEffect(() => {
    const cards = gsap.utils.toArray(gridRef.current?.children || []);
    
    cards.forEach((card) => {
      const image = card.querySelector('.project-image');
      const overlay = card.querySelector('.project-overlay');
      const buttons = card.querySelectorAll('.project-btn');
      const content = card.querySelector('.project-content');

      if (!image || !overlay || !content) return;

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -12,
          scale: 1.03,
          duration: 0.4,
          ease: "power2.out"
        });

        gsap.to(image, {
          scale: 1.1,
          duration: 0.6,
          ease: "power2.out"
        });

        gsap.to(overlay, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });

        gsap.to(buttons, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: 0.1,
          ease: "back.out(1.7)"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        });

        gsap.to(image, {
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        });

        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out"
        });

        gsap.to(buttons, {
          scale: 0.8,
          opacity: 0,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    });
  }, [filteredProjects]);

  const categories = ["All", "Design", "Dev", "Security", "Experimental"];

  const categoryColors = {
    Design: "from-purple-500 to-pink-500",
    Dev: "from-blue-500 to-cyan-500", 
    Security: "from-red-500 to-orange-500",
    Experimental: "from-green-500 to-emerald-500"
  };

  const handleFilterChange = (category) => {
    setIsLoading(true);
    setActiveFilter(category);
    
    // Animate out current projects
    gsap.to(gridRef.current.children, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.05,
      onComplete: () => {
        // Update projects
        if (category === "All") {
          setFilteredProjects(projects);
        } else {
          setFilteredProjects(
            projects.filter((project) => project.category === category)
          );
        }
        
        // Animate in new projects
        setTimeout(() => {
          gsap.fromTo(gridRef.current.children, 
            { opacity: 0, y: 30, scale: 0.9 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 0.5, 
              stagger: 0.1,
              ease: "back.out(1.4)",
              onComplete: () => setIsLoading(false)
            }
          );
        }, 100);
      }
    });
  };

  const handleProjectClick = (project) => {
    console.log("Viewing project:", project.title);
    alert(`Opening ${project.title} - This would navigate to project details`);
  };

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="relative py-20 bg-background overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Enhanced Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-chart-1/10 border border-chart-1/20 rounded-full mb-6">
            <Code2 className="w-4 h-4 text-chart-1" />
            <span className="text-chart-1 text-sm font-medium">My Work</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Featured{" "}
            <span className="text-gradient">
              Projects
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A showcase of my latest work spanning design, development, security,
            and experimental technologies.
          </p>
        </div>

        {/* Enhanced Filter Buttons */}
        <div ref={filtersRef} className="flex flex-wrap justify-center items-center gap-4 mb-12">
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
              <span className={isLoading && activeFilter === category ? 'opacity-0' : 'opacity-100'}>
                {category}
              </span>
            </button>
          ))}
        </div>

        {/* Enhanced Projects Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-chart-1/30 transition-all duration-500 cursor-pointer"
            >
              {/* Enhanced glowing border */}
              <div className="absolute inset-0 bg-gradient-to-r from-chart-1/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10 rounded-2xl"></div>

              {/* Project Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image w-full h-full object-cover transition-transform duration-700"
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

                {/* Enhanced Overlay */}
                <div className="project-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300"></div>

                {/* Project Action Buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.liveUrl, "_blank");
                    }}
                    className="project-btn p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-chart-1 hover:text-black transition-all duration-300 opacity-0 scale-75"
                    title="View Live"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>

              {/* Enhanced Project Content */}
              <div className="project-content p-6">
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r ${
                      categoryColors[project.category] || "from-gray-500 to-gray-600"
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

                {/* Enhanced Project Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2.5 py-1 bg-gradient-to-r from-chart-1/10 to-purple-500/10 border border-chart-1/20 text-chart-1 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2.5 py-1 bg-muted/50 text-muted-foreground text-xs font-medium rounded-full">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Enhanced View Project Button */}
                <button
                  onClick={() => handleProjectClick(project)}
                  className="w-full btn-secondary group/btn"
                >
                  <span>View Project Details</span>
                  <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Load More Button */}
        <div ref={loadMoreRef} className="text-center mb-20">
          <button
            onClick={() => alert("Loading more projects... This would load additional projects")}
            className="btn-primary group"
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>Load More Projects</span>
          </button>
        </div>

        {/* Enhanced Project Statistics */}
        <div
          ref={statsRef} 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-border/50"
        >
          <div className="text-center group">
            <div className="relative">
              <div className="text-4xl font-bold text-chart-1 mb-2 stats-value">
                {projects.length}
              </div>
              <div className="absolute -inset-2 bg-chart-1/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-muted-foreground font-medium">Total Projects</div>
          </div>
          
          <div className="text-center group">
            <div className="relative">
              <div className="text-4xl font-bold text-chart-1 mb-2 stats-value">
                {projects.filter((p) => p.featured).length}
              </div>
              <div className="absolute -inset-2 bg-chart-1/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-muted-foreground font-medium">Featured Works</div>
          </div>
          
          <div className="text-center group">
            <div className="relative">
              <div className="text-4xl font-bold text-chart-1 mb-2 stats-value">
                {categories.length - 1}
              </div>
              <div className="absolute -inset-2 bg-chart-1/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-muted-foreground font-medium">Categories</div>
          </div>
          
          <div className="text-center group">
            <div className="relative">
              <div className="text-4xl font-bold text-chart-1 mb-2 stats-value">100%</div>
              <div className="absolute -inset-2 bg-chart-1/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-muted-foreground font-medium">Client Satisfaction</div>
          </div>
        </div>
      </div>

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