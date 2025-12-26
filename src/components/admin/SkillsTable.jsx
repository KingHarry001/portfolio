import { 
  Plus, 
  Edit, 
  Trash2, 
  Code, 
  Palette, 
  Shield, 
  Cpu, 
  Terminal, 
  Database, 
  Globe,
  Layers
} from 'lucide-react';

const categoryIcons = {
  'Graphic Design': Palette,
  'Frontend': Globe,
  'Backend': Database,
  'Programming': Terminal,
  'Security': Shield,
  'Cybersecurity': Shield,
  'Crypto': Shield,
  'AI/ML': Cpu,
  'Data Science': Layers,
};

const SkillsTable = ({ skills, onAddSkill, onEditSkill, onDeleteSkill }) => {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            Skills & Expertise
          </h3>
          <p className="text-gray-400">Manage your technical proficiency levels.</p>
        </div>
        
        <button
          onClick={onAddSkill}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add Skill
        </button>
      </div>

      {/* Content Grid */}
      {Object.keys(groupedSkills).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Code size={40} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No skills found</h3>
          <p className="text-gray-400 max-w-sm text-center mb-8">
            Add your hard skills to showcase your expertise levels.
          </p>
          <button
            onClick={onAddSkill}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add First Skill
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => {
            const Icon = categoryIcons[category] || Code;
            
            return (
              <div 
                key={category} 
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] transition-all duration-300 flex flex-col h-full"
              >
                {/* Category Header */}
                <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-white/10 text-cyan-400">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg">{category}</h4>
                    <p className="text-xs text-gray-500">{categorySkills.length} skills</p>
                  </div>
                </div>

                {/* Skills List */}
                <div className="p-4 space-y-3 flex-1">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-200 text-sm">{skill.name}</span>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditSkill(skill)}
                            className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteSkill(skill.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-end mt-1">
                        <span className="text-[10px] font-mono text-cyan-400/80">{skill.level}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillsTable;