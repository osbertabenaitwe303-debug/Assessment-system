import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Award,
  PlusCircle,
  X
} from 'lucide-react';
import { Rubric, RubricCriterion, Subject } from '../types';

interface RubricManagerProps {
  rubrics: Rubric[];
  subjects: Subject[];
  onSaveRubric: (rubric: Rubric) => void;
  onDeleteRubric: (rubricId: string) => void;
  onOpenAiRubricGenerator: (subjectName: string, topic: string) => void;
}

export const RubricManager: React.FC<RubricManagerProps> = ({
  rubrics,
  subjects,
  onSaveRubric,
  onDeleteRubric,
  onOpenAiRubricGenerator
}) => {
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(rubrics[0] || null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);

  // Form states for rubric creation / editing
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState<RubricCriterion[]>([]);

  const handleOpenNewModal = () => {
    setTitle('');
    setSubjectId(subjects[0]?.id || '');
    setDescription('');
    setCriteria([
      {
        id: `crit-1`,
        title: 'Conceptual Understanding & Accuracy',
        description: 'Demonstrates deep mastery of subject principles and domain language',
        weight: 40,
        levels: [
          { levelIndex: 3, levelName: 'Exemplary', points: 40, description: 'Flawless comprehension with subtle insight' },
          { levelIndex: 2, levelName: 'Proficient', points: 30, description: 'Solid understanding with minor minor oversights' },
          { levelIndex: 1, levelName: 'Developing', points: 20, description: 'Partial comprehension; key gaps present' },
          { levelIndex: 0, levelName: 'Beginning', points: 10, description: 'Limited grasp of underlying concepts' }
        ]
      },
      {
        id: `crit-2`,
        title: 'Analytical Clarity & Problem Solving',
        description: 'Applies logical reasoning and methodical steps to solve problems',
        weight: 30,
        levels: [
          { levelIndex: 3, levelName: 'Exemplary', points: 30, description: 'Rigorous analysis with clear proof steps' },
          { levelIndex: 2, levelName: 'Proficient', points: 22.5, description: 'Good logical structure with slight gaps' },
          { levelIndex: 1, levelName: 'Developing', points: 15, description: 'Incomplete reasoning steps' },
          { levelIndex: 0, levelName: 'Beginning', points: 7.5, description: 'Lacks structured problem-solving approach' }
        ]
      }
    ]);
    setIsEditingModalOpen(true);
  };

  const handleEditRubric = (rubric: Rubric) => {
    setSelectedRubric(rubric);
    setTitle(rubric.title);
    setSubjectId(rubric.subjectId);
    setDescription(rubric.description);
    setCriteria(rubric.criteria);
    setIsEditingModalOpen(true);
  };

  const handleAddCriterion = () => {
    const newCrit: RubricCriterion = {
      id: `crit-${Date.now()}`,
      title: 'New Performance Criterion',
      description: 'Criteria description...',
      weight: 20,
      levels: [
        { levelIndex: 3, levelName: 'Exemplary', points: 20, description: 'Outstanding execution' },
        { levelIndex: 2, levelName: 'Proficient', points: 15, description: 'Meets expectations' },
        { levelIndex: 1, levelName: 'Developing', points: 10, description: 'Below expectations' },
        { levelIndex: 0, levelName: 'Beginning', points: 5, description: 'Insufficient evidence' }
      ]
    };
    setCriteria([...criteria, newCrit]);
  };

  const handleRemoveCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    const newRubric: Rubric = {
      id: selectedRubric ? selectedRubric.id : `rub-${Date.now()}`,
      title,
      subjectId,
      description,
      criteria,
      createdAt: selectedRubric ? selectedRubric.createdAt : new Date().toISOString().split('T')[0]
    };

    onSaveRubric(newRubric);
    setSelectedRubric(newRubric);
    setIsEditingModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-300 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-stone-900" />
            <span>Grading Rubric Library</span>
          </h2>
          <p className="text-xs text-stone-600 mt-1 font-sans">
            Build multi-tiered performance rubrics for qualitative projects, essays, and practical presentations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="ai-rubric-gen-top-btn"
            onClick={() => onOpenAiRubricGenerator(subjects[0]?.name || 'General', 'Rubric Matrix')}
            className="flex items-center space-x-2 px-3.5 py-2 bg-purple-900 hover:bg-purple-950 text-purple-100 border border-purple-950 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>AI Rubric Architect</span>
          </button>
          <button
            id="create-rubric-top-btn"
            onClick={handleOpenNewModal}
            className="flex items-center space-x-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 border border-stone-900 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Rubric</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout (Sidebar list + Detail view) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rubric List Column */}
        <div className="editorial-card p-4 space-y-3">
          <span className="tracking-widest uppercase text-[10px] font-mono font-bold text-stone-700 block border-b border-stone-200 pb-2">
            Saved Rubric Frameworks ({rubrics.length})
          </span>

          <div className="space-y-2">
            {rubrics.map(r => {
              const sub = subjects.find(s => s.id === r.subjectId);
              const isSelected = selectedRubric?.id === r.id;

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRubric(r)}
                  className={`p-3 border cursor-pointer transition-all space-y-1 ${
                    isSelected
                      ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]'
                      : 'bg-[#FAF8F5] border-stone-300 hover:border-stone-800 text-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 ${
                      isSelected ? 'bg-stone-100 text-stone-900' : 'bg-stone-900 text-stone-50'
                    }`}>
                      {sub?.code || 'SUB'}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">{r.criteria.length} Criteria</span>
                  </div>
                  <h4 className="text-xs font-serif font-bold line-clamp-1">{r.title}</h4>
                  <p className="text-[11px] opacity-75 line-clamp-2">{r.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Rubric Detail Matrix */}
        <div className="md:col-span-2 editorial-card p-6 space-y-5">
          {selectedRubric ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="tracking-widest uppercase text-[9px] font-bold px-2 py-0.5 bg-stone-900 text-stone-50">
                      {subjects.find(s => s.id === selectedRubric.subjectId)?.code || 'SUB'}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-stone-900">{selectedRubric.title}</h3>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">{selectedRubric.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    id={`edit-rubric-btn-${selectedRubric.id}`}
                    onClick={() => handleEditRubric(selectedRubric)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-800 text-xs font-bold transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Criteria</span>
                  </button>
                  <button
                    id={`del-rubric-btn-${selectedRubric.id}`}
                    onClick={() => onDeleteRubric(selectedRubric.id)}
                    className="p-1.5 hover:bg-stone-200 text-rose-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Criteria Matrix Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-800">Criteria Matrix</h4>
                {selectedRubric.criteria.map((crit, idx) => (
                  <div key={crit.id} className="p-4 bg-[#FAF8F5] border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 bg-stone-900 text-stone-50 font-mono text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <h5 className="text-sm font-serif font-bold text-stone-900">{crit.title}</h5>
                      </div>
                      <span className="text-xs font-mono font-bold text-stone-900 bg-stone-200 px-2 py-0.5 border border-stone-400">
                        Weight: {crit.weight}%
                      </span>
                    </div>

                    <p className="text-xs text-stone-600">{crit.description}</p>

                    {/* Level Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                      {crit.levels.map(level => (
                        <div key={level.levelIndex} className="p-2.5 bg-white border border-stone-300 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                            <span>{level.levelName}</span>
                            <span className="font-mono text-emerald-800">{level.points} pts</span>
                          </div>
                          <p className="text-[11px] text-stone-600 leading-tight">{level.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-stone-500">
              <SlidersHorizontal className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-xs font-medium">No rubric selected. Choose a framework on the left or create one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit / Create Rubric Modal */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-2 border-stone-900 rounded-none w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] my-auto">
            <div className="p-4 bg-[#1C1917] text-stone-50 flex items-center justify-between">
              <span className="font-serif font-bold text-sm">
                {selectedRubric ? 'Edit Rubric Criteria Framework' : 'Create New Rubric Matrix'}
              </span>
              <button onClick={() => setIsEditingModalOpen(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-4 text-stone-900 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-stone-700">Rubric Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Lab Report Evaluation Rubric"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Subject Department *</label>
                  <select
                    value={subjectId}
                    onChange={e => setSubjectId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs font-medium"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-serif font-bold text-stone-900">Criteria ({criteria.length})</h4>
                  <button
                    type="button"
                    onClick={handleAddCriterion}
                    className="px-2.5 py-1 bg-stone-900 text-stone-50 text-xs font-bold border border-stone-900"
                  >
                    + Add Criterion
                  </button>
                </div>

                {criteria.map((c, cIdx) => (
                  <div key={c.id} className="p-3 bg-[#FAF8F5] border border-stone-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={c.title}
                        onChange={e => {
                          const updated = [...criteria];
                          updated[cIdx].title = e.target.value;
                          setCriteria(updated);
                        }}
                        className="font-serif font-bold bg-white border border-stone-800 px-2 py-1 text-xs w-full"
                      />
                      <input
                        type="number"
                        value={c.weight}
                        onChange={e => {
                          const updated = [...criteria];
                          updated[cIdx].weight = Number(e.target.value);
                          setCriteria(updated);
                        }}
                        className="w-16 bg-white border border-stone-800 px-1 py-1 font-mono text-center text-xs"
                        title="Weight %"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCriterion(c.id)}
                        className="p-1 text-rose-700 hover:text-rose-900"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-900 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-stone-50 text-xs font-bold border border-stone-900"
                >
                  Save Rubric Framework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
