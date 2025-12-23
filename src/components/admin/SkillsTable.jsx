// src/components/admin/SkillsTable.jsx
import { Plus, Edit, Trash2, Code, Palette, Shield } from 'lucide-react';

const categoryIcons = {
  'Graphic Design': Palette,
  'Frontend': Code,
  'Backend': Code,
  'Programming': Code,
  'Security': Shield,
  'Crypto': Shield,
  'AI/ML': Code,
};

const SkillsTable = ({ skills, onAddSkill, onEditSkill, onDeleteSkill }) => {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Skills Management</h3>
          <p className="text-gray-400">Manage your expertise and skill levels</p>
        </div>
        <button
          onClick={onAddSkill}
          className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {Object.keys(groupedSkills).length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
          <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">No skills added yet</p>
          <button
            onClick={onAddSkill}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => {
            const Icon = categoryIcons[category] || Code;
            
            return (
              <div key={category} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white">{category}</h4>
                  <span className="ml-auto text-sm text-gray-400">
                    {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                  </span>
                </div>

                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors gap-4"
                    >
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{skill.name}</span>
                          <span className="text-sm font-semibold text-cyan-400">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => onEditSkill(skill)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="sm:hidden">Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteSkill(skill.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sm:hidden">Delete</span>
                        </button>
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