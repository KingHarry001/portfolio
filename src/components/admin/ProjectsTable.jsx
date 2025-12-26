import { useState } from "react";
import {
  Search,
  Plus,
  Briefcase,
  Star,
  Edit,
  Trash2,
  ExternalLink,
  LayoutGrid,
  Globe
} from "lucide-react";

const ProjectsTable = ({
  projects,
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) => {
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // The filter checks if the project category matches the selected value exactly
    const matchesCategory =
      filterCategory === "All" || p.category === filterCategory;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            Projects
          </h3>
          <p className="text-gray-400">Manage and showcase your portfolio work.</p>
        </div>
        
        <button
          onClick={onAddProject}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          New Project
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="block w-full pl-11 pr-4 py-3 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
          />
        </div>
        <div className="h-px md:h-auto md:w-px bg-white/10 mx-2" />
        
        {/* FIXED DROPDOWN LOGIC */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-transparent border-none text-white focus:ring-0 py-3 pl-4 pr-10 cursor-pointer hover:text-cyan-400 transition-colors sm:text-sm font-medium"
        >
          {/* The 'value' must match exactly what is in your database (e.g. 'Dev', 'App') */}
          {/* The text inside the option is just for display */}
          <option value="All" className="bg-gray-900">All Categories</option>
          <option value="Dev" className="bg-gray-900">Web Development</option>
          <option value="App" className="bg-gray-900">Mobile Apps</option>
          <option value="Design" className="bg-gray-900">UI/UX Design</option>
          <option value="Security" className="bg-gray-900">Cybersecurity</option>
          <option value="Experimental" className="bg-gray-900">Experimental</option>
        </select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <LayoutGrid size={40} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
          <p className="text-gray-400 max-w-sm text-center mb-8">
            {searchQuery || filterCategory !== "All" 
              ? "Try adjusting your search or filters."
              : "Get started by adding your first project to showcase your work."}
          </p>
          <button
            onClick={onAddProject}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden bg-gray-900">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <Briefcase className="w-12 h-12 text-white/10" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
                    project.published 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {project.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {project.title}
                  </h4>
                  {project.featured && (
                    <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 bg-white/5 rounded-md text-xs font-medium text-gray-300 border border-white/5">
                    {project.category}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                      title="View Live"
                    >
                      <Globe size={18} />
                    </a>
                  )}
                  
                  <div className="flex-1" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProject(project);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(project.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;