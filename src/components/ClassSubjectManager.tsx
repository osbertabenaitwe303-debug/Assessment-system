import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Plus,
  Trash2,
  Edit2,
  GraduationCap,
  Sparkles,
  School,
  CheckCircle,
  X
} from 'lucide-react';
import { ClassRoom, Subject, Student } from '../types';

interface ClassSubjectManagerProps {
  classes: ClassRoom[];
  subjects: Subject[];
  students: Student[];
  onAddClass: (newClass: ClassRoom) => void;
  onDeleteClass: (classId: string) => void;
  onAddSubject: (newSubject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export const ClassSubjectManager: React.FC<ClassSubjectManagerProps> = ({
  classes,
  subjects,
  students,
  onAddClass,
  onDeleteClass,
  onAddSubject,
  onDeleteSubject
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');

  // New Class Form State
  const [className, setClassName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 10');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [teacherName, setTeacherName] = useState('Dr. Elizabeth Vance');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);

  // New Subject Form State
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectDepartment, setSubjectDepartment] = useState('Science');
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    const newCls: ClassRoom = {
      id: `cls-${Date.now()}`,
      name: className,
      gradeLevel,
      academicYear,
      teacherName,
      studentIds: [],
      subjectIds: subjects.map(s => s.id)
    };

    onAddClass(newCls);
    setClassName('');
    setIsClassModalOpen(false);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !subjectCode.trim()) return;

    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      name: subjectName,
      code: subjectCode.toUpperCase(),
      department: subjectDepartment,
      color: '#1C1917'
    };

    onAddSubject(newSub);
    setSubjectName('');
    setSubjectCode('');
    setIsSubjectModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-300 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center space-x-2">
            <School className="w-5 h-5 text-stone-900" />
            <span>Classes & Academic Subjects Manager</span>
          </h2>
          <p className="text-xs text-stone-600 mt-1 font-sans">
            Configure homeroom sections, academic subject departments, and course curricula.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSubjectModalOpen(true)}
            className="px-3.5 py-2 bg-[#FAF8F5] hover:bg-stone-100 text-stone-900 border border-stone-900 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all"
          >
            + New Subject
          </button>
          <button
            onClick={() => setIsClassModalOpen(true)}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 border border-stone-900 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            + New Class Section
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-stone-300">
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 text-xs font-serif font-bold transition-all border-b-2 ${
            activeTab === 'classes'
              ? 'border-stone-900 text-stone-900 bg-stone-100'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Classes & Homerooms ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-2 text-xs font-serif font-bold transition-all border-b-2 ${
            activeTab === 'subjects'
              ? 'border-stone-900 text-stone-900 bg-stone-100'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Subject Departments ({subjects.length})
        </button>
      </div>

      {/* View 1: Classes Grid */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map(c => {
            const enrolled = students.filter(s => s.classId === c.id || c.studentIds.includes(s.id));

            return (
              <div key={c.id} className="editorial-card p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="tracking-widest uppercase text-[9px] font-bold px-2 py-0.5 bg-stone-900 text-stone-50">
                      {c.gradeLevel}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-stone-600">{c.academicYear}</span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-stone-900">{c.name}</h3>
                  <p className="text-xs text-stone-600 font-mono">Head Teacher: {c.teacherName}</p>

                  <div className="p-3 bg-[#FAF8F5] border border-stone-300 flex items-center justify-between text-xs">
                    <span className="text-stone-600">Enrolled Students</span>
                    <span className="font-bold font-mono text-stone-900">{enrolled.length} Students</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-300 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-500">ID: {c.id}</span>
                  <button
                    onClick={() => onDeleteClass(c.id)}
                    className="p-1.5 hover:bg-stone-200 text-rose-700 transition-colors"
                    title="Delete Class"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Subjects Grid */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map(s => (
            <div key={s.id} className="editorial-card p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="tracking-widest uppercase text-[10px] font-bold px-2 py-0.5 bg-stone-900 text-stone-50 font-mono">
                    {s.code}
                  </span>
                  <BookOpen className="w-4 h-4 text-stone-700" />
                </div>

                <h3 className="text-base font-serif font-bold text-stone-900">{s.name}</h3>
                <p className="text-xs text-stone-600 font-mono bg-[#FAF8F5] p-2 border border-stone-300">
                  Department: {s.department || 'General'}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-300 flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-500">ID: {s.id}</span>
                <button
                  onClick={() => onDeleteSubject(s.id)}
                  className="p-1.5 hover:bg-stone-200 text-rose-700 transition-colors"
                  title="Delete Subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Create Class */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
          <div className="bg-white border-2 border-stone-900 rounded-none w-full max-w-md shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
            <div className="p-4 bg-[#1C1917] text-stone-50 flex items-center justify-between">
              <span className="font-serif font-bold text-sm">Create Homeroom Class</span>
              <button onClick={() => setIsClassModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="p-5 space-y-4 text-xs text-stone-900">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Class Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10-A (Honors Biology)"
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Grade Level</label>
                  <input
                    type="text"
                    value={gradeLevel}
                    onChange={e => setGradeLevel(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Academic Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Head Teacher Name</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={e => setTeacherName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-3 py-1.5 bg-stone-200 text-stone-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 text-stone-50 font-bold border border-stone-900"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create Subject */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
          <div className="bg-white border-2 border-stone-900 rounded-none w-full max-w-md shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
            <div className="p-4 bg-[#1C1917] text-stone-50 flex items-center justify-between">
              <span className="font-serif font-bold text-sm">Add Subject Department</span>
              <button onClick={() => setIsSubjectModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="p-5 space-y-4 text-xs text-stone-900">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-stone-700">Subject Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Chemistry"
                    value={subjectName}
                    onChange={e => setSubjectName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="CHEM"
                    value={subjectCode}
                    onChange={e => setSubjectCode(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-800 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Natural Sciences"
                  value={subjectDepartment}
                  onChange={e => setSubjectDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-3 py-1.5 bg-stone-200 text-stone-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 text-stone-50 font-bold border border-stone-900"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
