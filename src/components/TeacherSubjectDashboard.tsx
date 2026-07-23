import React, { useState } from 'react';
import {
  BookOpen,
  FileCheck,
  Table,
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Users,
  ChevronRight,
  TrendingUp,
  Award,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { User, Subject, Assessment, GradeEntry, ClassRoom, Student } from '../types';

interface TeacherSubjectDashboardProps {
  teacher: User;
  subjects: Subject[];
  assessments: Assessment[];
  grades: GradeEntry[];
  classes: ClassRoom[];
  students: Student[];
  onOpenCreateAssessment: () => void;
  onOpenMarksheetForAssessment: (asmId: string) => void;
  onOpenAiAssistantForSubject: (subjectName: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const TeacherSubjectDashboard: React.FC<TeacherSubjectDashboardProps> = ({
  teacher,
  subjects,
  assessments,
  grades,
  classes,
  students,
  onOpenCreateAssessment,
  onOpenMarksheetForAssessment,
  onOpenAiAssistantForSubject,
  onNavigateToTab
}) => {
  // Find subjects assigned to this teacher
  const assignedSubjects = subjects.filter(s =>
    teacher.assignedSubjectIds ? teacher.assignedSubjectIds.includes(s.id) : true
  );

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    assignedSubjects[0]?.id || subjects[0]?.id || ''
  );

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || assignedSubjects[0] || subjects[0];

  // Assessments for this teacher's selected subject
  const subjectAssessments = assessments.filter(a => a.subjectId === activeSubject?.id);

  // Student list enrolled in classes taking this subject
  const relevantClasses = classes.filter(c => c.subjectIds.includes(activeSubject?.id));
  const relevantClassIds = relevantClasses.map(c => c.id);
  const subjectStudents = students.filter(s => relevantClassIds.includes(s.classId));

  // Compute stats for this subject
  let totalGradesCount = 0;
  let gradedEntriesCount = 0;
  let verifiedCount = 0;
  let pendingVerificationCount = 0;
  let totalPctSum = 0;

  subjectAssessments.forEach(asm => {
    const asmGrades = grades.filter(g => g.assessmentId === asm.id);
    asmGrades.forEach(g => {
      totalGradesCount++;
      if (g.status === 'graded' || g.status === 'submitted') {
        gradedEntriesCount++;
        totalPctSum += g.percentage;
      }
      if (g.verificationStatus === 'verified' || asm.verificationStatus === 'verified') {
        verifiedCount++;
      } else if (g.verificationStatus === 'pending' || asm.verificationStatus === 'pending') {
        pendingVerificationCount++;
      }
    });
  });

  const classSubjectAverage = gradedEntriesCount > 0 ? Math.round((totalPctSum / gradedEntriesCount) * 10) / 10 : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Subject Switcher */}
      <div className="p-6 bg-stone-900 text-stone-50 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1580894732468-91823908f978?w=100'}
              alt={teacher.name}
              className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 bg-amber-400 text-stone-900 font-bold">
                  Subject Teacher Portal
                </span>
                <span className="text-xs text-stone-400 font-mono">ID: {teacher.id}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                Welcome back, {teacher.name}
              </h2>
              <p className="text-xs text-stone-300 font-serif italic">{teacher.title || 'Department Educator'}</p>
            </div>
          </div>

          {/* Subject Switcher dropdown if teacher has multiple subjects */}
          <div className="p-3 bg-stone-800 border border-stone-700 space-y-1">
            <label className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest block">
              Active Subject Follow-Up Focus
            </label>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <select
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                className="bg-stone-900 text-white text-xs font-bold font-serif border border-stone-600 px-3 py-1.5 focus:outline-none focus:border-amber-400"
              >
                {assignedSubjects.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.code}] {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick subject focus detail sub-bar */}
        <div className="pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-300 gap-2">
          <div className="flex items-center space-x-4">
            <span>
              Subject Code: <strong className="text-amber-300 font-mono">{activeSubject?.code}</strong>
            </span>
            <span>
              Department: <strong className="text-white">{activeSubject?.department}</strong>
            </span>
            <span>
              Enrolled Students: <strong className="text-white">{subjectStudents.length}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenAiAssistantForSubject(activeSubject?.name || '')}
              className="px-3 py-1 bg-purple-900 hover:bg-purple-950 text-purple-100 text-xs font-bold border border-purple-400 flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>AI {activeSubject?.code} Generator</span>
            </button>
            <button
              onClick={onOpenCreateAssessment}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold border border-stone-900 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="editorial-card p-4 space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">Total Subject Assessments</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-stone-900">{subjectAssessments.length}</span>
            <FileCheck className="w-5 h-5 text-stone-700" />
          </div>
          <p className="text-[11px] text-stone-600">Created for {activeSubject?.name}</p>
        </div>

        <div className="editorial-card p-4 space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">Marks Submitted</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-stone-900">{gradedEntriesCount}</span>
            <Table className="w-5 h-5 text-stone-700" />
          </div>
          <p className="text-[11px] text-stone-600">Student scores recorded</p>
        </div>

        <div className="editorial-card p-4 space-y-1 bg-emerald-50/50">
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-900 block">Admin Verified Scores</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-emerald-900">{verifiedCount}</span>
            <CheckCircle className="w-5 h-5 text-emerald-700" />
          </div>
          <p className="text-[11px] text-emerald-800">Approved by Admin</p>
        </div>

        <div className="editorial-card p-4 space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">Subject Average Score</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-stone-900">{classSubjectAverage}%</span>
            <TrendingUp className="w-5 h-5 text-stone-700" />
          </div>
          <p className="text-[11px] text-stone-600">Across enrolled classes</p>
        </div>
      </div>

      {/* Main Follow-up Section: Assessment & Marksheet Tracker */}
      <div className="editorial-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900 flex items-center space-x-2">
              <Table className="w-4 h-4 text-purple-900" />
              <span>Subject Assessment & Marksheet Follow-Up Status</span>
            </h3>
            <p className="text-xs text-stone-600 font-serif italic">
              Follow up on student scores, submit marksheets for administrative review, and track approval status.
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('marksheet')}
            className="px-3.5 py-1.5 bg-stone-900 text-stone-50 text-xs font-bold border border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>Open Marksheet Grid</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {subjectAssessments.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8F5] border border-dashed border-stone-400 space-y-3">
            <FileCheck className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-xs text-stone-600 font-serif">No assessments created for {activeSubject?.name} yet.</p>
            <button
              onClick={onOpenCreateAssessment}
              className="px-4 py-2 bg-stone-900 text-white font-bold text-xs"
            >
              + Create First {activeSubject?.code} Assessment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {subjectAssessments.map(asm => {
              const targetClass = classes.find(c => c.id === asm.classId);
              const classStudents = students.filter(s => s.classId === asm.classId || targetClass?.studentIds.includes(s.id));
              const asmGrades = grades.filter(g => g.assessmentId === asm.id);
              const scoredCount = asmGrades.filter(g => g.score > 0 || g.status === 'graded').length;
              const totalRequired = classStudents.length || 1;
              const percentageRecorded = Math.round((scoredCount / totalRequired) * 100);

              // Check verification status
              const isVerified = asm.verificationStatus === 'verified' || asmGrades.some(g => g.verificationStatus === 'verified');
              const isPending = asm.verificationStatus === 'pending' || asmGrades.some(g => g.verificationStatus === 'pending');
              const isRejected = asm.verificationStatus === 'rejected';

              return (
                <div key={asm.id} className="p-4 bg-[#FAF8F5] border border-stone-800 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs text-purple-900 uppercase bg-purple-100 border border-purple-300 px-2 py-0.5">
                          {asm.code}
                        </span>
                        <h4 className="text-sm font-serif font-bold text-stone-900">{asm.title}</h4>
                        <span className="text-[10px] font-mono text-stone-600">
                          Class: {targetClass?.name || 'All Students'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-stone-600">
                        <span>Total Points: <strong>{asm.totalPoints} pts</strong></span>
                        <span>Term Weight: <strong>{asm.weightPercentage}%</strong></span>
                        <span>Due Date: <strong>{asm.dueDate}</strong></span>
                      </div>
                    </div>

                    {/* Verification Badge */}
                    <div className="flex items-center space-x-2">
                      {isVerified ? (
                        <span className="flex items-center space-x-1 text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-400 px-2.5 py-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Admin Verified & Approved</span>
                        </span>
                      ) : isRejected ? (
                        <span className="flex items-center space-x-1 text-xs font-bold text-rose-900 bg-rose-100 border border-rose-400 px-2.5 py-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                          <span>Revision Requested by Admin</span>
                        </span>
                      ) : isPending ? (
                        <span className="flex items-center space-x-1 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-400 px-2.5 py-1">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Awaiting Admin Verification</span>
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-stone-600 bg-stone-200 px-2 py-1 border border-stone-400">
                          Marksheet Draft
                        </span>
                      )}

                      <button
                        onClick={() => onOpenMarksheetForAssessment(asm.id)}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 font-bold text-xs border border-stone-900"
                      >
                        Enter / Edit Marks
                      </button>
                    </div>
                  </div>

                  {/* Marks Entry Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-stone-600">
                        Marksheet Completion: <strong>{scoredCount} of {totalRequired} students graded</strong>
                      </span>
                      <span className="font-bold text-stone-900">{percentageRecorded}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 border border-stone-400 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          percentageRecorded >= 100 ? 'bg-emerald-700' : 'bg-purple-900'
                        }`}
                        style={{ width: `${Math.min(100, percentageRecorded)}%` }}
                      />
                    </div>
                  </div>

                  {/* Admin Notes Box if present */}
                  {asm.adminNotes && (
                    <div className="p-2.5 bg-rose-50 border border-rose-300 text-xs text-rose-950 font-serif italic flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Admin Feedback Note:</strong> "{asm.adminNotes}"
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
