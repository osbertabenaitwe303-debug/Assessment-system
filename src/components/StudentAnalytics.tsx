import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Printer,
  GraduationCap,
  Award,
  TrendingUp,
  AlertCircle,
  Sparkles,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Student,
  Assessment,
  GradeEntry,
  ClassRoom,
  Subject,
  GradeScale,
  StudentAnalyticsSummary
} from '../types';
import { getGradeScaleForPercentage } from '../services/storage';
import { ReportCardPrintModal } from './ReportCardPrintModal';

interface StudentAnalyticsProps {
  students: Student[];
  classes: ClassRoom[];
  subjects: Subject[];
  assessments: Assessment[];
  grades: GradeEntry[];
  gradeScales: GradeScale[];
  selectedStudentId?: string;
  onSelectStudent: (studentId: string) => void;
}

export const StudentAnalytics: React.FC<StudentAnalyticsProps> = ({
  students,
  classes,
  subjects,
  assessments,
  grades,
  gradeScales,
  selectedStudentId,
  onSelectStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');

  // Currently viewed student
  const activeStudent = useMemo(() => {
    if (selectedStudentId) {
      return students.find(s => s.id === selectedStudentId) || students[0];
    }
    return students[0];
  }, [students, selectedStudentId]);

  // Report card modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // AI Learning Plan State
  const [aiPlanText, setAiPlanText] = useState<string | null>(null);
  const [isAiPlanLoading, setIsAiPlanLoading] = useState(false);

  // Filtered student list for sidebar
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch =
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClassId === 'all' || s.classId === selectedClassId;
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, selectedClassId]);

  // Compute Active Student Analytics Summary
  const studentSummary = useMemo<StudentAnalyticsSummary | null>(() => {
    if (!activeStudent) return null;

    const classRoom = classes.find(c => c.id === activeStudent.classId);
    const studentGrades = grades.filter(g => g.studentId === activeStudent.id && g.status === 'graded');

    if (studentGrades.length === 0) {
      return {
        student: activeStudent,
        classRoom,
        overallGpa: 0,
        overallPercentage: 0,
        subjectScores: [],
        recentGrades: []
      };
    }

    // Percentage & GPA
    const totalPercentage = studentGrades.reduce((acc, g) => acc + g.percentage, 0);
    const overallPercentage = Math.round((totalPercentage / studentGrades.length) * 10) / 10;
    const overallScale = getGradeScaleForPercentage(overallPercentage);
    const overallGpa = overallScale.gpaPoint;

    // Subject Scores
    const subjectMap = new Map<string, { totalPct: number; count: number }>();
    studentGrades.forEach(g => {
      const asm = assessments.find(a => a.id === g.assessmentId);
      if (asm) {
        const cur = subjectMap.get(asm.subjectId) || { totalPct: 0, count: 0 };
        cur.totalPct += g.percentage;
        cur.count += 1;
        subjectMap.set(asm.subjectId, cur);
      }
    });

    const subjectScores = Array.from(subjectMap.entries()).map(([subId, stat]) => {
      const subjectObj = subjects.find(s => s.id === subId) || { id: subId, name: 'Subject', code: 'SUB', description: '' };
      const avgPct = Math.round((stat.totalPct / stat.count) * 10) / 10;
      const letter = getGradeScaleForPercentage(avgPct).letter;
      return {
        subject: subjectObj,
        averagePercentage: avgPct,
        letterGrade: letter,
        assessmentCount: stat.count
      };
    });

    // Recent Grades
    const recentGrades = studentGrades.map(g => {
      const asm = assessments.find(a => a.id === g.assessmentId);
      const sub = asm ? subjects.find(s => s.id === asm.subjectId) : undefined;
      return {
        gradeEntry: g,
        assessment: asm,
        subject: sub
      };
    });

    return {
      student: activeStudent,
      classRoom,
      overallGpa,
      overallPercentage,
      subjectScores,
      recentGrades
    };
  }, [activeStudent, classes, grades, assessments, subjects]);

  // Timeline Trend Data for line chart
  const timelineData = useMemo(() => {
    if (!studentSummary) return [];
    return studentSummary.recentGrades.map(({ assessment, gradeEntry }) => ({
      date: assessment?.dueDate || 'Term',
      title: assessment?.code || 'Test',
      scorePct: gradeEntry.percentage
    }));
  }, [studentSummary]);

  // Radar chart data
  const radarData = useMemo(() => {
    if (!studentSummary) return [];
    return studentSummary.subjectScores.map(ss => ({
      subject: ss.subject.code,
      score: ss.averagePercentage,
      fullMark: 100
    }));
  }, [studentSummary]);

  // AI Learning Remediation Plan
  const handleGenerateAiLearningPlan = async () => {
    if (!studentSummary || !activeStudent) return;
    setIsAiPlanLoading(true);

    try {
      const res = await fetch('/api/ai/remediation-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: `${activeStudent.firstName} ${activeStudent.lastName}`,
          overallPercentage: studentSummary.overallPercentage,
          weakSubjects: studentSummary.subjectScores.filter(s => s.averagePercentage < 70).map(s => s.subject.name),
          strongSubjects: studentSummary.subjectScores.filter(s => s.averagePercentage >= 80).map(s => s.subject.name)
        })
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setAiPlanText(data.plan);
      }
    } catch (err) {
      console.error('AI plan error:', err);
    } finally {
      setIsAiPlanLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-300 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-stone-900" />
            <span>Student Academic Analytics & Transcripts</span>
          </h2>
          <p className="text-xs text-stone-600 mt-1 font-sans">
            Comprehensive individual student performance tracking, mastery radars, and printable report cards.
          </p>
        </div>

        {studentSummary && (
          <button
            id="print-report-card-top-btn"
            onClick={() => setIsPrintModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 border border-stone-900 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report Card</span>
          </button>
        )}
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Student Directory Search */}
        <div className="lg:col-span-1 editorial-card p-4 space-y-3">
          <span className="tracking-widest uppercase text-[10px] font-mono font-bold text-stone-700 block border-b border-stone-200 pb-2">
            Student Roster ({students.length})
          </span>

          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-500" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 bg-white border border-stone-800 text-xs text-stone-900 placeholder-stone-500 focus:outline-none"
              />
            </div>

            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full bg-white border border-stone-800 px-2 py-1 text-xs text-stone-900 focus:outline-none"
            >
              <option value="all">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredStudents.map(st => {
              const isSelected = activeStudent?.id === st.id;
              const cls = classes.find(c => c.id === st.classId);

              return (
                <div
                  key={st.id}
                  onClick={() => onSelectStudent(st.id)}
                  className={`p-2.5 border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]'
                      : 'bg-[#FAF8F5] border-stone-300 hover:border-stone-800 text-stone-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={st.avatarUrl}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-stone-800"
                    />
                    <div>
                      <h4 className="text-xs font-serif font-bold leading-tight">
                        {st.firstName} {st.lastName}
                      </h4>
                      <span className="text-[10px] opacity-75 font-mono block">{st.studentIdNumber}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 opacity-60" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Student Detailed Profile & Charts */}
        <div className="lg:col-span-3 space-y-6">
          {studentSummary ? (
            <>
              {/* Student Hero Header Card */}
              <div className="editorial-card p-6 bg-[#F4F1EA] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={studentSummary.student.avatarUrl}
                      alt={`${studentSummary.student.firstName} ${studentSummary.student.lastName}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-stone-900 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-2xl font-serif font-bold text-stone-900">
                          {studentSummary.student.firstName} {studentSummary.student.lastName}
                        </h3>
                        <span className="text-xs font-mono font-bold bg-stone-900 text-stone-50 px-2 py-0.5">
                          {studentSummary.student.studentIdNumber}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 font-mono mt-0.5">
                        {studentSummary.classRoom?.name || 'Class'} • {studentSummary.classRoom?.academicYear}
                      </p>
                    </div>
                  </div>

                  {/* Summary GPA Stat */}
                  <div className="p-4 bg-white border border-stone-900 flex items-center space-x-4 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
                    <div>
                      <span className="tracking-widest uppercase text-[9px] font-bold text-stone-500 block">Cumulative Mean</span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-serif font-bold text-stone-900">{studentSummary.overallPercentage}%</span>
                        <span className="text-xs font-bold font-mono text-emerald-800">
                          ({studentSummary.overallGpa.toFixed(1)} GPA)
                        </span>
                      </div>
                    </div>
                    <Award className="w-8 h-8 text-amber-700" />
                  </div>
                </div>
              </div>

              {/* Charts Row: Score Progress Trend & Subject Mastery Radar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score Progress Line Chart */}
                <div className="editorial-card p-5 space-y-3">
                  <h4 className="text-sm font-serif font-bold text-stone-900">Assessment Score Progression</h4>
                  <p className="text-xs text-stone-600">Chronological percentage score trajectory across tests</p>

                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="title" stroke="#44403C" fontSize={11} tickLine={false} />
                        <YAxis domain={[0, 100]} stroke="#44403C" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1C1917', borderColor: '#1C1917', color: '#FAF8F5', borderRadius: '0px' }}
                        />
                        <Line type="monotone" dataKey="scorePct" stroke="#1C1917" strokeWidth={2.5} dot={{ fill: '#1C1917', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Subject Mastery Radar Chart */}
                <div className="editorial-card p-5 space-y-3">
                  <h4 className="text-sm font-serif font-bold text-stone-900">Subject Mastery Radar</h4>
                  <p className="text-xs text-stone-600">Multi-axis department competency breakdown</p>

                  <div className="h-56 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#E7E5E4" />
                        <PolarAngleAxis dataKey="subject" stroke="#1C1917" fontSize={11} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#78716C" fontSize={10} />
                        <Radar name="Score" dataKey="score" stroke="#1C1917" fill="#1C1917" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="editorial-card p-5 space-y-3">
                <h4 className="text-sm font-serif font-bold text-stone-900">Department Mastery Breakdown</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-stone-300 text-xs">
                    <thead>
                      <tr className="bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-widest text-stone-700 border-b border-stone-300 font-mono">
                        <th className="p-2.5 border-r border-stone-300">Subject Department</th>
                        <th className="p-2.5 border-r border-stone-300 text-center">Tests Taken</th>
                        <th className="p-2.5 border-r border-stone-300 text-center">Mean Score</th>
                        <th className="p-2.5 text-center">Letter Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {studentSummary.subjectScores.map(ss => (
                        <tr key={ss.subject.id} className="hover:bg-[#FAF8F5]">
                          <td className="p-2.5 font-bold border-r border-stone-200">
                            [{ss.subject.code}] {ss.subject.name}
                          </td>
                          <td className="p-2.5 text-center font-mono border-r border-slate-200">{ss.assessmentCount}</td>
                          <td className="p-2.5 text-center font-bold border-r border-slate-200">{ss.averagePercentage}%</td>
                          <td className="p-2.5 text-center font-bold font-mono text-emerald-800">{ss.letterGrade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Remediation Plan Ribbon */}
              <div className="p-5 bg-purple-50 border border-purple-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-purple-900">
                    <Sparkles className="w-5 h-5 text-purple-900" />
                    <h4 className="text-sm font-serif font-bold">AI Personalized Learning Strategy</h4>
                  </div>
                  <button
                    onClick={handleGenerateAiLearningPlan}
                    disabled={isAiPlanLoading}
                    className="px-3 py-1.5 bg-purple-900 hover:bg-purple-950 text-purple-100 text-xs font-bold transition-all disabled:opacity-50 flex items-center space-x-1"
                  >
                    {isAiPlanLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Generate AI Remediation Strategy</span>
                  </button>
                </div>

                {aiPlanText && (
                  <div className="p-4 bg-white border border-purple-900 text-xs text-stone-900 whitespace-pre-line font-sans leading-relaxed">
                    {aiPlanText}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-stone-500 editorial-card">
              <Users className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-xs font-medium">Select a student from the sidebar to inspect transcripts.</p>
            </div>
          )}
        </div>
      </div>

      {/* Official Report Card Print Modal */}
      {isPrintModalOpen && studentSummary && (
        <ReportCardPrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          summary={studentSummary}
          gradeScales={gradeScales}
        />
      )}
    </div>
  );
};
