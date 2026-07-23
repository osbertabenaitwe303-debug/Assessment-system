import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  FileCheck,
  SlidersHorizontal,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Assessment, Subject, ClassRoom, Rubric, AssessmentType, AssessmentStatus, AssessmentQuestion } from '../types';

interface AssessmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assessment: Assessment) => void;
  editingAssessment?: Assessment | null;
  subjects: Subject[];
  classes: ClassRoom[];
  rubrics: Rubric[];
  onOpenAiGenerator: (subjectName: string, topic: string) => void;
}

export const AssessmentFormModal: React.FC<AssessmentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAssessment,
  subjects,
  classes,
  rubrics,
  onOpenAiGenerator
}) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classId, setClassId] = useState('');
  const [type, setType] = useState<AssessmentType>('quiz');
  const [totalPoints, setTotalPoints] = useState(100);
  const [weightPercentage, setWeightPercentage] = useState(15);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<AssessmentStatus>('draft');
  const [instructions, setInstructions] = useState('');
  const [rubricId, setRubricId] = useState<string>('');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);

  useEffect(() => {
    if (editingAssessment) {
      setTitle(editingAssessment.title);
      setCode(editingAssessment.code);
      setSubjectId(editingAssessment.subjectId);
      setClassId(editingAssessment.classId);
      setType(editingAssessment.type);
      setTotalPoints(editingAssessment.totalPoints);
      setWeightPercentage(editingAssessment.weightPercentage);
      setDueDate(editingAssessment.dueDate);
      setStatus(editingAssessment.status);
      setInstructions(editingAssessment.instructions || '');
      setRubricId(editingAssessment.rubricId || '');
      setQuestions(editingAssessment.questions || []);
    } else {
      setTitle('');
      setCode(`ASM-${Math.floor(100 + Math.random() * 900)}`);
      setSubjectId(subjects[0]?.id || '');
      setClassId(classes[0]?.id || '');
      setType('quiz');
      setTotalPoints(100);
      setWeightPercentage(15);
      setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setStatus('published');
      setInstructions('');
      setRubricId('');
      setQuestions([]);
    }
  }, [editingAssessment, isOpen, subjects, classes]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    const newQ: AssessmentQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      text: '',
      questionType: 'short_answer',
      points: 10,
      sampleAnswer: ''
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleQuestionChange = (id: string, key: keyof AssessmentQuestion, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [key]: value } : q));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId || !classId) return;

    const asm: Assessment = {
      id: editingAssessment ? editingAssessment.id : `asm-${Date.now()}`,
      title,
      code,
      subjectId,
      classId,
      type,
      totalPoints: Number(totalPoints),
      weightPercentage: Number(weightPercentage),
      dueDate,
      status,
      instructions,
      rubricId: rubricId || undefined,
      questions: questions.length > 0 ? questions : undefined,
      createdAt: editingAssessment ? editingAssessment.createdAt : new Date().toISOString().split('T')[0]
    };

    onSave(asm);
    onClose();
  };

  const selectedSubjectObj = subjects.find(s => s.id === subjectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-2 border-stone-900 rounded-none w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] my-auto">
        {/* Modal Header */}
        <div className="p-4 bg-[#1C1917] text-stone-50 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-serif font-bold text-white">
              {editingAssessment ? 'Edit Assessment Specifications' : 'Create New Assessment'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-stone-900">
          {/* Quick AI Trigger Ribbon */}
          <div className="p-3.5 bg-purple-50 border border-purple-900 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-serif font-bold text-purple-900 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-900" />
                <span>Gemini AI Assessment Assistant</span>
              </span>
              <p className="text-xs text-stone-700">
                Generate questions, problem prompts, or assessment blueprints automatically
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onOpenAiGenerator(selectedSubjectObj?.name || 'General', title || 'Topic Quiz');
              }}
              className="px-3.5 py-1.5 bg-purple-900 hover:bg-purple-950 text-purple-100 text-xs font-bold transition-all border border-purple-950 whitespace-nowrap"
            >
              Launch AI Assistant
            </button>
          </div>

          {/* Row 1: Title & Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-stone-800">Assessment Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Midterm Test: Organic Nomenclature"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs sm:text-sm text-stone-900 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800">Assessment Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CHEM-Q2"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs sm:text-sm font-mono text-stone-900"
              />
            </div>
          </div>

          {/* Row 2: Subject, Class & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800">Subject Department *</label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs text-stone-900 font-medium"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800">Class / Grade Section *</label>
              <select
                value={classId}
                onChange={e => setClassId(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs text-stone-900 font-medium"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800">Assessment Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as AssessmentType)}
                className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs text-stone-900 font-medium"
              >
                <option value="quiz">Quiz</option>
                <option value="exam">Exam / Test</option>
                <option value="assignment">Homework / Assignment</option>
                <option value="lab">Practical Lab Report</option>
                <option value="project">Course Project</option>
                <option value="presentation">Presentation</option>
                <option value="oral">Oral Examination</option>
              </select>
            </div>
          </div>

          {/* Row 3: Total Marks, Weightage %, Due Date, Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800">Total Marks</label>
              <input
                type="number"
                min={1}
                max={1000}
                value={totalPoints}
                onChange={e => setTotalPoints(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs font-mono font-bold text-stone-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800">Term Weight %</label>
              <input
                type="number"
                min={1}
                max={100}
                value={weightPercentage}
                onChange={e => setWeightPercentage(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs font-mono font-bold text-stone-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs font-mono text-stone-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as AssessmentStatus)}
                className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs text-stone-900 font-medium"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="grading">Grading Open</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Attached Rubric Selector */}
          <div className="space-y-1 p-3 bg-[#FAF8F5] border border-stone-800">
            <label className="text-xs font-serif font-bold text-stone-900 flex items-center space-x-1.5">
              <SlidersHorizontal className="w-4 h-4 text-purple-900" />
              <span>Attach Grading Rubric Framework (Optional)</span>
            </label>
            <select
              value={rubricId}
              onChange={e => setRubricId(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs text-stone-900"
            >
              <option value="">No rubric attached (Standard total mark scoring)</option>
              {rubrics.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.criteria.length} criteria)
                </option>
              ))}
            </select>
          </div>

          {/* Instructions */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-800">Student Instructions & Guidelines</label>
            <textarea
              rows={2}
              placeholder="e.g. Show all calculations. Non-programmable calculators permitted..."
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-stone-800 text-xs text-stone-900"
            />
          </div>

          {/* Question / Item Builder */}
          <div className="space-y-3 pt-2 border-t border-stone-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-stone-800" />
                <h4 className="text-xs font-serif font-bold text-stone-900">Assessment Items & Questions ({questions.length})</h4>
              </div>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center space-x-1 px-2.5 py-1 bg-stone-900 text-stone-50 text-xs font-bold border border-stone-900"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {questions.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No specific question items added. You can grade as a single total mark or add items below.</p>
            ) : (
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-3 bg-[#FAF8F5] border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-serif font-bold text-stone-900">Item #{idx + 1}</span>
                      <div className="flex items-center space-x-2">
                        <select
                          value={q.questionType}
                          onChange={e => handleQuestionChange(q.id, 'questionType', e.target.value)}
                          className="bg-white border border-stone-800 text-[11px] text-stone-900 px-2 py-0.5"
                        >
                          <option value="short_answer">Short Answer</option>
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="problem">Math/Science Problem</option>
                          <option value="essay">Essay Prompt</option>
                        </select>
                        <input
                          type="number"
                          value={q.points}
                          onChange={e => handleQuestionChange(q.id, 'points', Number(e.target.value))}
                          className="w-16 bg-white border border-stone-800 text-xs font-mono text-center py-0.5 text-stone-900"
                          title="Item Points"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(q.id)}
                          className="p-1 text-rose-700 hover:text-rose-900"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Question prompt or problem statement..."
                      value={q.text}
                      onChange={e => handleQuestionChange(q.id, 'text', e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-stone-800 text-xs text-stone-900 font-medium"
                    />

                    <input
                      type="text"
                      placeholder="Sample solution or model answer..."
                      value={q.sampleAnswer || ''}
                      onChange={e => handleQuestionChange(q.id, 'sampleAnswer', e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-stone-300 text-[11px] text-stone-600"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-stone-300 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 text-stone-900 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-stone-900 text-stone-50 text-xs font-bold border border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
            >
              {editingAssessment ? 'Save Specs' : 'Create Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
