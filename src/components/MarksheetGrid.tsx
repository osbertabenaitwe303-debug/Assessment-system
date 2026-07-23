import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Save,
  Sparkles,
  SlidersHorizontal,
  CheckCircle,
  AlertCircle,
  User,
  Search,
  Filter,
  Check,
  Award,
  Loader2,
  Clock,
  AlertTriangle,
  Send,
  ShieldCheck
} from 'lucide-react';
import {
  Assessment,
  Student,
  GradeEntry,
  ClassRoom,
  Subject,
  Rubric,
  CriterionScore,
  User as UserType,
  VerificationStatus
} from '../types';
import { getGradeScaleForPercentage } from '../services/storage';
import { RubricScoringModal } from './RubricScoringModal';

interface MarksheetGridProps {
  assessments: Assessment[];
  classes: ClassRoom[];
  students: Student[];
  subjects: Subject[];
  rubrics: Rubric[];
  grades: GradeEntry[];
  onSaveGrades: (updatedGrades: GradeEntry[]) => void;
  initialAssessmentId?: string;
  currentUser?: UserType | null;
  onVerifyGradesBatch?: (asmId: string, status: VerificationStatus, notes?: string) => void;
}

export const MarksheetGrid: React.FC<MarksheetGridProps> = ({
  assessments,
  classes,
  students,
  subjects,
  rubrics,
  grades,
  onSaveGrades,
  initialAssessmentId,
  currentUser,
  onVerifyGradesBatch
}) => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    initialAssessmentId || assessments[0]?.id || ''
  );

  useEffect(() => {
    if (initialAssessmentId) {
      setSelectedAssessmentId(initialAssessmentId);
    }
  }, [initialAssessmentId]);

  const currentAssessment = useMemo(() => {
    return assessments.find(a => a.id === selectedAssessmentId) || assessments[0];
  }, [assessments, selectedAssessmentId]);

  const currentClass = useMemo(() => {
    return classes.find(c => c.id === currentAssessment?.classId);
  }, [classes, currentAssessment]);

  const currentSubject = useMemo(() => {
    return subjects.find(s => s.id === currentAssessment?.subjectId);
  }, [subjects, currentAssessment]);

  const attachedRubric = useMemo(() => {
    return rubrics.find(r => r.id === currentAssessment?.rubricId);
  }, [rubrics, currentAssessment]);

  // Enrolled students in current class
  const classStudents = useMemo(() => {
    if (!currentClass) return students;
    return students.filter(s => s.classId === currentClass.id || currentClass.studentIds.includes(s.id));
  }, [students, currentClass]);

  // Working Local Grade state for the active assessment
  const [localGradesMap, setLocalGradesMap] = useState<Record<string, GradeEntry>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [aiLoadingStudentId, setAiLoadingStudentId] = useState<string | null>(null);

  // Rubric Modal state
  const [rubricStudent, setRubricStudent] = useState<Student | null>(null);

  // Search in table
  const [tableSearch, setTableSearch] = useState('');

  // Sync working state when assessment changes
  useEffect(() => {
    if (!currentAssessment) return;

    const map: Record<string, GradeEntry> = {};
    classStudents.forEach(st => {
      const existing = grades.find(g => g.assessmentId === currentAssessment.id && g.studentId === st.id);
      if (existing) {
        map[st.id] = { ...existing };
      } else {
        map[st.id] = {
          id: `grd-${currentAssessment.id}-${st.id}`,
          assessmentId: currentAssessment.id,
          studentId: st.id,
          score: 0,
          percentage: 0,
          letterGrade: 'F',
          status: 'pending',
          teacherFeedback: ''
        };
      }
    });

    setLocalGradesMap(map);
    setIsSaved(false);
  }, [currentAssessment, classStudents, grades]);

  const handleScoreChange = (studentId: string, rawScore: number) => {
    if (!currentAssessment) return;
    const maxPts = currentAssessment.totalPoints || 100;
    const boundedScore = Math.min(Math.max(0, rawScore), maxPts);
    const pct = Math.round((boundedScore / maxPts) * 1000) / 10;
    const scale = getGradeScaleForPercentage(pct);

    setLocalGradesMap(prev => {
      const cur = prev[studentId] || {
        id: `grd-${currentAssessment.id}-${studentId}`,
        assessmentId: currentAssessment.id,
        studentId,
        score: boundedScore,
        percentage: pct,
        letterGrade: scale.letter,
        status: 'graded',
        teacherFeedback: ''
      };

      return {
        ...prev,
        [studentId]: {
          ...cur,
          score: boundedScore,
          percentage: pct,
          letterGrade: scale.letter,
          status: 'graded'
        }
      };
    });
    setIsSaved(false);
  };

  const handleFeedbackChange = (studentId: string, feedback: string) => {
    setLocalGradesMap(prev => {
      const cur = prev[studentId];
      if (!cur) return prev;
      return {
        ...prev,
        [studentId]: { ...cur, teacherFeedback: feedback }
      };
    });
    setIsSaved(false);
  };

  const handleApplyRubricScore = (
    scaledScore: number,
    rubricScoresMap: Record<string, CriterionScore>,
    summaryFeedback: string
  ) => {
    if (!rubricStudent || !currentAssessment) return;
    const maxPts = currentAssessment.totalPoints || 100;
    const pct = Math.round((scaledScore / maxPts) * 1000) / 10;
    const scale = getGradeScaleForPercentage(pct);

    setLocalGradesMap(prev => {
      const cur = prev[rubricStudent.id];
      return {
        ...prev,
        [rubricStudent.id]: {
          ...cur,
          score: scaledScore,
          percentage: pct,
          letterGrade: scale.letter,
          status: 'graded',
          rubricScores: rubricScoresMap,
          teacherFeedback: cur?.teacherFeedback || summaryFeedback
        }
      };
    });
    setIsSaved(false);
  };

  // AI Student Feedback API Call
  const handleGenerateAiFeedbackForStudent = async (student: Student) => {
    const stGrade = localGradesMap[student.id];
    if (!stGrade || !currentAssessment) return;

    setAiLoadingStudentId(student.id);
    try {
      const res = await fetch('/api/ai/student-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: `${student.firstName} ${student.lastName}`,
          subjectName: currentSubject?.name || 'Subject',
          percentageScore: stGrade.percentage,
          letterGrade: stGrade.letterGrade,
          assessmentTitle: currentAssessment.title,
          strengths: stGrade.strengths?.join(', ') || 'Good grasp of core concepts',
          weaknesses: stGrade.areasForImprovement?.join(', ') || 'Needs attention on exam details'
        })
      });

      const data = await res.json();
      if (data.success && data.feedbackData) {
        const text = `${data.feedbackData.feedbackText}\n• Growth Tip: ${data.feedbackData.actionableTip}`;
        handleFeedbackChange(student.id, text);
      }
    } catch (err) {
      console.error('AI feedback error:', err);
    } finally {
      setAiLoadingStudentId(null);
    }
  };

  const handleSaveAll = () => {
    const listToSave = Object.values(localGradesMap) as GradeEntry[];
    onSaveGrades(listToSave);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Filter table by student name or ID
  const filteredClassStudents = useMemo(() => {
    if (!tableSearch.trim()) return classStudents;
    return classStudents.filter(s =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(tableSearch.toLowerCase()) ||
      s.studentIdNumber.toLowerCase().includes(tableSearch.toLowerCase())
    );
  }, [classStudents, tableSearch]);

  // Marksheet stats summary
  const summaryStats = useMemo(() => {
    const entries = (Object.values(localGradesMap) as GradeEntry[]).filter(g => g.status === 'graded');
    if (entries.length === 0) return { meanPct: 0, passRate: 0, gradedCount: 0 };

    const totalPct = entries.reduce((acc, g) => acc + g.percentage, 0);
    const meanPct = Math.round((totalPct / entries.length) * 10) / 10;
    const passingCount = entries.filter(g => g.percentage >= 60).length;
    const passRate = Math.round((passingCount / entries.length) * 100);

    return { meanPct, passRate, gradedCount: entries.length };
  }, [localGradesMap]);

  return (
    <div className="space-y-6">
      {/* Top Header & Selectors */}
      <div className="editorial-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center space-x-2">
              <Table className="w-5 h-5 text-stone-900" />
              <span>Assessment Marksheet & Gradebook</span>
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Select assessment to enter scores, perform rubric evaluations, and generate report comments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isSaved && (
              <span className="text-xs font-bold font-mono text-emerald-800 flex items-center space-x-1 animate-fade-in">
                <Check className="w-4 h-4" />
                <span>Marksheet Saved!</span>
              </span>
            )}

            <button
              id="save-marksheet-btn"
              onClick={handleSaveAll}
              className="flex items-center space-x-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 font-bold text-xs sm:text-sm border border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Marksheet</span>
            </button>

            {/* Verification Button Actions */}
            {currentUser?.role === 'admin' && onVerifyGradesBatch && (
              <button
                onClick={() => {
                  onVerifyGradesBatch(currentAssessment.id, 'verified', currentUser.name, 'Verified directly via Gradebook Grid');
                  setIsSaved(true);
                  setTimeout(() => setIsSaved(false), 3000);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs border border-emerald-950 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Approve Marks</span>
              </button>
            )}

            {currentUser?.role === 'teacher' && onVerifyGradesBatch && (
              <button
                onClick={() => {
                  handleSaveAll();
                  onVerifyGradesBatch(currentAssessment.id, 'pending', currentUser.name, 'Submitted by Subject Teacher for Admin Review');
                  setIsSaved(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs border border-purple-950 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* Verification Status Notice Banner */}
        {currentAssessment?.verificationStatus === 'verified' ? (
          <div className="p-3 bg-emerald-50 border border-emerald-400 flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span className="font-bold">Official Verification: Marks Approved by Academic Admin ({currentAssessment.verifiedBy || 'Admin'})</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-800">Verified on {currentAssessment.verifiedAt || 'Today'}</span>
          </div>
        ) : currentAssessment?.verificationStatus === 'rejected' ? (
          <div className="p-3 bg-rose-50 border border-rose-400 space-y-1 text-xs text-rose-950">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              <span className="font-bold">Admin Feedback Note (Revision Requested):</span>
            </div>
            <p className="italic pl-6">"{currentAssessment.adminNotes || 'Please double check student raw scores and recalculate percentages.'}"</p>
          </div>
        ) : currentAssessment?.verificationStatus === 'pending' ? (
          <div className="p-2.5 bg-amber-50 border border-amber-400 flex items-center space-x-2 text-xs text-amber-950">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Marksheet Submitted — Pending Academic Admin Review & Verification</span>
          </div>
        ) : null}

        {/* Assessment Switcher Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="space-y-1">
            <label className="tracking-widest uppercase text-[10px] font-bold text-stone-700">Select Assessment *</label>
            <select
              value={selectedAssessmentId}
              onChange={e => setSelectedAssessmentId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-800 text-xs sm:text-sm text-stone-900 focus:outline-none font-medium"
            >
              {assessments.map(a => {
                const sub = subjects.find(s => s.id === a.subjectId);
                return (
                  <option key={a.id} value={a.id}>
                    [{sub?.code || 'SUB'}] {a.title} ({a.code})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="bg-[#FAF8F5] border border-stone-800 p-3 flex items-center justify-between">
            <div>
              <span className="tracking-widest uppercase text-[9px] font-bold text-stone-500 block">Class & Subject</span>
              <span className="text-xs font-serif font-bold text-stone-900">
                {currentClass?.name || 'Class'} • {currentSubject?.name || 'Subject'}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-stone-900 bg-stone-200 px-2 py-0.5 border border-stone-400">
              {currentAssessment?.totalPoints || 100} Pts Total
            </span>
          </div>

          <div className="bg-[#FAF8F5] border border-stone-800 p-3 flex items-center justify-between">
            <div>
              <span className="tracking-widest uppercase text-[9px] font-bold text-stone-500 block">Class Mean / Pass Rate</span>
              <span className="text-xs font-bold font-mono text-emerald-900">
                {summaryStats.meanPct}% Mean • {summaryStats.passRate}% Pass Rate
              </span>
            </div>
            <span className="text-xs text-stone-600 font-mono">
              {summaryStats.gradedCount}/{classStudents.length} Graded
            </span>
          </div>
        </div>
      </div>

      {/* Roster Search & Table */}
      <div className="editorial-card overflow-hidden">
        <div className="p-4 bg-[#F4F1EA] border-b border-stone-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
            <input
              type="text"
              placeholder="Search student name or ID..."
              value={tableSearch}
              onChange={e => setTableSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-800 text-xs text-stone-900 placeholder-stone-500 focus:outline-none"
            />
          </div>

          {attachedRubric && (
            <div className="flex items-center space-x-2 text-xs font-bold text-purple-900 bg-purple-50 border border-purple-800 px-3 py-1.5">
              <SlidersHorizontal className="w-4 h-4 text-purple-900" />
              <span>Rubric Attached: {attachedRubric.title}</span>
            </div>
          )}
        </div>

        {/* Marksheet Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-widest text-stone-700 border-b border-stone-900 font-mono">
                <th className="py-3 px-4 w-12 border-r border-stone-300">#</th>
                <th className="py-3 px-4 border-r border-stone-300">Student Details</th>
                <th className="py-3 px-4 w-32 border-r border-stone-300">Raw Score</th>
                <th className="py-3 px-4 w-28 border-r border-stone-300">Score %</th>
                <th className="py-3 px-4 w-24 border-r border-stone-300">Grade</th>
                {attachedRubric && <th className="py-3 px-4 w-36 border-r border-stone-300">Rubric Scoring</th>}
                <th className="py-3 px-4 min-w-[280px]">Teacher Feedback & AI Comments</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-300 text-xs text-stone-900">
              {filteredClassStudents.map((student, idx) => {
                const gradeEntry = localGradesMap[student.id] || {
                  id: `grd-${currentAssessment.id}-${student.id}`,
                  assessmentId: currentAssessment.id,
                  studentId: student.id,
                  score: 0,
                  percentage: 0,
                  letterGrade: 'F',
                  status: 'pending',
                  teacherFeedback: ''
                };

                const gradeScale = getGradeScaleForPercentage(gradeEntry.percentage);
                const isAiLoading = aiLoadingStudentId === student.id;

                return (
                  <tr key={student.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4 font-mono text-stone-500 border-r border-stone-200">{idx + 1}</td>

                    {/* Student Info */}
                    <td className="py-3 px-4 border-r border-stone-200">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.avatarUrl}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-8 h-8 rounded-full object-cover border border-stone-800"
                        />
                        <div>
                          <span className="font-serif font-bold text-stone-900 block text-xs sm:text-sm">
                            {student.firstName} {student.lastName}
                          </span>
                          <span className="text-[10px] font-mono text-stone-500">{student.studentIdNumber}</span>
                        </div>
                      </div>
                    </td>

                    {/* Score Input */}
                    <td className="py-3 px-4 border-r border-stone-200">
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          step={0.5}
                          min={0}
                          max={currentAssessment?.totalPoints || 100}
                          value={gradeEntry.score}
                          onChange={e => handleScoreChange(student.id, parseFloat(e.target.value) || 0)}
                          className="w-20 px-2.5 py-1.5 bg-white border border-stone-800 text-xs font-bold font-mono text-stone-900 text-center focus:outline-none"
                        />
                        <span className="text-[10px] text-stone-500 font-mono">/ {currentAssessment?.totalPoints || 100}</span>
                      </div>
                    </td>

                    {/* Percentage */}
                    <td className="py-3 px-4 font-mono font-bold text-stone-900 border-r border-stone-200">
                      {gradeEntry.percentage}%
                    </td>

                    {/* Letter Grade Badge */}
                    <td className="py-3 px-4 border-r border-stone-200">
                      <span className="text-xs px-2.5 py-1 font-bold font-mono border border-stone-900 bg-stone-100 text-stone-900 inline-block">
                        {gradeScale.letter}
                      </span>
                    </td>

                    {/* Attached Rubric Modal Button */}
                    {attachedRubric && (
                      <td className="py-3 px-4 border-r border-stone-200">
                        <button
                          id={`rubric-score-btn-${student.id}`}
                          onClick={() => setRubricStudent(student)}
                          className="px-2.5 py-1 bg-purple-900 hover:bg-purple-950 text-purple-100 text-xs font-bold border border-purple-950 transition-colors flex items-center space-x-1"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Evaluate</span>
                        </button>
                      </td>
                    )}

                    {/* Feedback & AI Button */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <textarea
                          rows={1}
                          placeholder="Teacher observations or report card feedback..."
                          value={gradeEntry.teacherFeedback || ''}
                          onChange={e => handleFeedbackChange(student.id, e.target.value)}
                          className="w-full px-2.5 py-1 bg-white border border-stone-800 text-xs text-stone-900 placeholder-stone-400 focus:outline-none resize-none"
                        />
                        <button
                          id={`ai-feedback-btn-${student.id}`}
                          onClick={() => handleGenerateAiFeedbackForStudent(student)}
                          disabled={isAiLoading}
                          title="Generate AI Student Feedback"
                          className="p-1.5 bg-purple-900 hover:bg-purple-950 text-purple-100 border border-purple-950 transition-colors disabled:opacity-50"
                        >
                          {isAiLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-purple-300" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rubric Scoring Modal */}
      {attachedRubric && rubricStudent && (
        <RubricScoringModal
          isOpen={!!rubricStudent}
          onClose={() => setRubricStudent(null)}
          rubric={attachedRubric}
          student={rubricStudent}
          initialCriterionScores={localGradesMap[rubricStudent.id]?.rubricScores}
          totalAssessmentPoints={currentAssessment?.totalPoints || 100}
          onApplyScore={handleApplyRubricScore}
        />
      )}
    </div>
  );
};
