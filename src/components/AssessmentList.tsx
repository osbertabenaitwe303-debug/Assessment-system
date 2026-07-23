import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  FileCheck,
  Calendar,
  Layers,
  Sparkles,
  Edit2,
  Trash2,
  Table,
  CheckCircle,
  Clock,
  SlidersHorizontal,
  HelpCircle
} from 'lucide-react';
import { Assessment, Subject, ClassRoom, Rubric, AssessmentType } from '../types';

interface AssessmentListProps {
  assessments: Assessment[];
  subjects: Subject[];
  classes: ClassRoom[];
  rubrics: Rubric[];
  onOpenCreateModal: () => void;
  onEditAssessment: (assessment: Assessment) => void;
  onDeleteAssessment: (assessmentId: string) => void;
  onOpenMarksheet: (assessmentId: string) => void;
  onOpenAiGeneratorForAssessment: (subjectId?: string) => void;
}

export const AssessmentList: React.FC<AssessmentListProps> = ({
  assessments,
  subjects,
  classes,
  rubrics,
  onOpenCreateModal,
  onEditAssessment,
  onDeleteAssessment,
  onOpenMarksheet,
  onOpenAiGeneratorForAssessment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredAssessments = useMemo(() => {
    return assessments.filter(asm => {
      const matchesSearch =
        asm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asm.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClass = selectedClass === 'all' || asm.classId === selectedClass;
      const matchesSubject = selectedSubject === 'all' || asm.subjectId === selectedSubject;
      const matchesType = selectedType === 'all' || asm.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || asm.status === selectedStatus;

      return matchesSearch && matchesClass && matchesSubject && matchesType && matchesStatus;
    });
  }, [assessments, searchQuery, selectedClass, selectedSubject, selectedType, selectedStatus]);

  const STATUS_BADGES: Record<string, { label: string; style: string; icon: any }> = {
    draft: { label: 'Draft', style: 'bg-stone-100 text-stone-700 border-stone-400', icon: Clock },
    scheduled: { label: 'Scheduled', style: 'bg-blue-50 text-blue-900 border-blue-800', icon: Calendar },
    grading: { label: 'Grading', style: 'bg-amber-50 text-amber-900 border-amber-800', icon: SlidersHorizontal },
    published: { label: 'Published', style: 'bg-emerald-50 text-emerald-900 border-emerald-800', icon: CheckCircle }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-300 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-stone-900" />
            <span>School Assessment Directory</span>
          </h2>
          <p className="text-xs text-stone-600 mt-1 font-sans">
            Manage quizzes, exams, practical labs, assignments, and rubric-evaluated projects.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="ai-generate-asm-top-btn"
            onClick={() => onOpenAiGeneratorForAssessment()}
            className="flex items-center space-x-2 px-3.5 py-2 bg-purple-900 hover:bg-purple-950 text-purple-100 border border-purple-950 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>AI Quiz Generator</span>
          </button>
          <button
            id="create-asm-top-btn"
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 border border-stone-900 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Plus className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 editorial-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
            <input
              type="text"
              placeholder="Search title or code (e.g. MATH-Q1)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-800 text-xs sm:text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="bg-white border border-stone-800 px-3 py-1.5 text-xs text-stone-900 focus:outline-none"
          >
            <option value="all">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-white border border-stone-800 px-3 py-1.5 text-xs text-stone-900 focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-white border border-stone-800 px-3 py-1.5 text-xs text-stone-900 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="grading">Grading</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Assessment Grid */}
      {filteredAssessments.length === 0 ? (
        <div className="p-12 text-center editorial-card space-y-3">
          <FileCheck className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-sm font-serif font-bold text-stone-800">No assessments found matching filters</h3>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new assessment for your class.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-stone-900 text-stone-50 text-xs font-bold border border-stone-900"
          >
            Create Assessment Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssessments.map(asm => {
            const sub = subjects.find(s => s.id === asm.subjectId);
            const cls = classes.find(c => c.id === asm.classId);
            const attachedRubric = rubrics.find(r => r.id === asm.rubricId);
            const statusConfig = STATUS_BADGES[asm.status] || STATUS_BADGES.draft;
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={asm.id}
                className="editorial-card p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="tracking-widest uppercase text-[9px] font-bold px-2 py-0.5 bg-stone-900 text-stone-50">
                        {sub?.code || 'SUB'}
                      </span>
                      <span className="text-[10px] font-bold text-stone-700 bg-stone-100 border border-stone-300 px-2 py-0.5">
                        {cls?.name || 'Class'}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-stone-900 bg-stone-200 border border-stone-400 px-2 py-0.5 uppercase">
                        {asm.type}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 border flex items-center space-x-1 uppercase ${statusConfig.style}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusConfig.label}</span>
                    </span>
                  </div>

                  {/* Title & Code */}
                  <div>
                    <h3 className="text-base font-serif font-bold text-stone-900 line-clamp-2">{asm.title}</h3>
                    <p className="text-xs text-stone-600 font-mono mt-0.5">Code: {asm.code}</p>
                  </div>

                  {/* Instructions snippet */}
                  {asm.instructions && (
                    <p className="text-xs text-stone-600 line-clamp-2 bg-[#FAF8F5] p-2 border border-stone-300">
                      {asm.instructions}
                    </p>
                  )}

                  {/* Metadata specs */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center border-t border-stone-200">
                    <div className="bg-stone-50 p-2 border border-stone-200">
                      <span className="text-[9px] tracking-widest font-bold text-stone-500 block uppercase">Marks</span>
                      <span className="text-xs font-bold font-mono text-stone-900">{asm.totalPoints} pts</span>
                    </div>
                    <div className="bg-stone-50 p-2 border border-stone-200">
                      <span className="text-[9px] tracking-widest font-bold text-stone-500 block uppercase">Weight</span>
                      <span className="text-xs font-bold font-mono text-stone-900">{asm.weightPercentage}%</span>
                    </div>
                    <div className="bg-stone-50 p-2 border border-stone-200">
                      <span className="text-[9px] tracking-widest font-bold text-stone-500 block uppercase">Due Date</span>
                      <span className="text-xs font-bold font-mono text-stone-800">{asm.dueDate}</span>
                    </div>
                  </div>

                  {/* Rubric attachment tag if present */}
                  {attachedRubric ? (
                    <div className="flex items-center space-x-1.5 text-[11px] text-purple-900 bg-purple-50 border border-purple-800 p-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-purple-900" />
                      <span className="truncate font-semibold">Rubric: {attachedRubric.title}</span>
                    </div>
                  ) : asm.questions && asm.questions.length > 0 ? (
                    <div className="flex items-center space-x-1.5 text-[11px] text-stone-800 bg-stone-100 border border-stone-300 p-2 font-mono">
                      <HelpCircle className="w-3.5 h-3.5 text-stone-700" />
                      <span>{asm.questions.length} Items attached</span>
                    </div>
                  ) : null}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-stone-300 flex items-center justify-between">
                  <button
                    id={`asm-grade-btn-${asm.id}`}
                    onClick={() => onOpenMarksheet(asm.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-bold border border-stone-900 transition-colors"
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Enter Grades</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      id={`asm-edit-btn-${asm.id}`}
                      onClick={() => onEditAssessment(asm)}
                      title="Edit Assessment Specs"
                      className="p-1.5 hover:bg-stone-200 text-stone-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      id={`asm-del-btn-${asm.id}`}
                      onClick={() => onDeleteAssessment(asm.id)}
                      title="Delete Assessment"
                      className="p-1.5 hover:bg-stone-200 text-rose-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
