import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Filter } from "lucide-react";
import { projects } from "../data/mock";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const statsRef = useRef();

  useEffect(() => {
    if (!statsRef.current) return;

    const statEls = gsap.utils.selector(statsRef)(".stats-value");

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
            duration: 3,
            ease: "power2.out",
            onUpdate: () => {
              el.innerText =
                new Intl.NumberFormat().format(Math.floor(obj.value)) + suffix;
            },
          });
        },
      });
    });

    // Cleanup triggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const categories = ["All", "Design", "Dev", "Security", "Experimental"];

  const handleFilterChange = (category) => {
    setActiveFilter(category);
    if (category === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => project.category === category)
      );
    }
  };

  const handleProjectClick = (project) => {
    // Mock project view
    console.log("Viewing project:", project.title);
    alert(`Opening ${project.title} - This would navigate to project details`);
  };

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Featured{" "}
            <span className="bg-gradient-to-r from-chart-1 to-foreground bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A showcase of my latest work spanning design, development, security,
            and experimental technologies.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-chart-1 mr-4">
            <Filter size={20} />
            <span className="font-medium">Filter:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`px-6 py-2 border transition-all duration-300 cursor-target ${
                activeFilter === category
                  ? "text-chart-1 border-[#00FFD1]"
                  : "bg-muted text-muted-foreground shadow-lg border-white/20 hover:border-[#00FFD1]/50 hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-muted border border-white/10 overflow-hidden hover:border-[#00FFD1]/30 transition-all duration-500 hover:-translate-y-2 cursor-target"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {project.featured && (
                  <div className="absolute top-4 left-4 chart-1 text-black px-3 py-1 text-sm font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Project Links Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => window.open(project.liveUrl, "_blank")}
                    className="p-3 bg-white/20 backdrop-blur-md hover:chart-1 hover:text-black transition-all duration-300"
                  >
                    <ExternalLink size={20} />
                  </button>
                  <button
                    onClick={() => window.open(project.githubUrl, "_blank")}
                    className="p-3 bg-white/20 backdrop-blur-md hover:chart-1 hover:text-black transition-all duration-300"
                  >
                    <Github size={20} />
                  </button>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-medium border cursor-target ${
                      project.category === "Design"
                        ? "border-purple-500 text-purple-400"
                        : project.category === "Dev"
                        ? "border-blue-500 text-blue-400"
                        : project.category === "Security"
                        ? "border-red-500 text-red-400"
                        : "border-green-500 text-green-400"
                    }`}
                  >
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-chart-1 transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Project Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/10 text-muted-foreground text-xs border border-chart-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View Project Button */}
                <button
                  onClick={() => handleProjectClick(project)}
                  className="w-full btn-secondary text-foreground ring-2 ring-ring text-center justify-center"
                >
                  View Project Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button
            onClick={() =>
              alert(
                "Loading more projects... This would load additional projects"
              )
            }
            className="btn-primary bg-chart-1 text-foreground"
          >
            Load More Projects
          </button>
        </div>

        {/* Project Statistics */}
        <div
           ref={statsRef} 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-white/10"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-chart-1 mb-2 stats-value">
              {projects.length}
            </div>
            <div className="text-muted-foreground">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-chart-1 mb-2 stats-value">
              {projects.filter((p) => p.featured).length}
            </div>
            <div className="text-muted-foreground">Featured Works</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-chart-1 mb-2  stats-value">
              {categories.length - 1}
            </div>
            <div className="text-muted-foreground">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-chart-1 mb-2  stats-value">100%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
