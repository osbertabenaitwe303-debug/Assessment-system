import React, { useMemo } from 'react';
import {
  FileText,
  Users,
  Award,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
  Table,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Assessment, Student, GradeEntry, Subject, ClassRoom } from '../types';
import { getGradeScaleForPercentage } from '../services/storage';

interface DashboardProps {
  assessments: Assessment[];
  students: Student[];
  grades: GradeEntry[];
  subjects: Subject[];
  classes: ClassRoom[];
  onNavigate: (tab: string) => void;
  onOpenCreateAssessment: () => void;
  onOpenAiAssistant: () => void;
  onSelectStudent: (studentId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  assessments,
  students,
  grades,
  subjects,
  classes,
  onNavigate,
  onOpenCreateAssessment,
  onOpenAiAssistant,
  onSelectStudent
}) => {
  // Compute Dashboard Metrics
  const metrics = useMemo(() => {
    const totalAssessments = assessments.length;
    const publishedAssessments = assessments.filter(a => a.status === 'published' || a.status === 'grading').length;
    const totalStudents = students.length;

    const gradedEntries = grades.filter(g => g.status === 'graded');

    // Average percentage
    const avgPercentage = gradedEntries.length > 0
      ? Math.round((gradedEntries.reduce((acc, g) => acc + g.percentage, 0) / gradedEntries.length) * 10) / 10
      : 0;

    // Grade scale
    const overallScale = getGradeScaleForPercentage(avgPercentage);

    // At Risk Students
    const studentAverages = new Map<string, { total: number; count: number }>();
    gradedEntries.forEach(g => {
      const cur = studentAverages.get(g.studentId) || { total: 0, count: 0 };
      cur.total += g.percentage;
      cur.count += 1;
      studentAverages.set(g.studentId, cur);
    });

    const atRiskList: { student: Student; avgPct: number; failingCount: number }[] = [];
    students.forEach(st => {
      const stat = studentAverages.get(st.id);
      if (stat && stat.count > 0) {
        const avg = stat.total / stat.count;
        if (avg < 65) {
          atRiskList.push({
            student: st,
            avgPct: Math.round(avg * 10) / 10,
            failingCount: grades.filter(g => g.studentId === st.id && g.percentage < 60).length
          });
        }
      }
    });

    // Grade Distribution Histogram
    const gradeCounts: Record<string, number> = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D': 0, 'F': 0 };
    gradedEntries.forEach(g => {
      const letter = g.letterGrade || getGradeScaleForPercentage(g.percentage).letter;
      gradeCounts[letter] = (gradeCounts[letter] || 0) + 1;
    });

    const gradeDistData = Object.entries(gradeCounts).map(([grade, count]) => ({
      grade,
      count
    }));

    // Subject Performance comparison
    const subjectStatsMap = new Map<string, { name: string; code: string; totalPct: number; count: number }>();
    subjects.forEach(s => subjectStatsMap.set(s.id, { name: s.name, code: s.code, totalPct: 0, count: 0 }));

    gradedEntries.forEach(g => {
      const asm = assessments.find(a => a.id === g.assessmentId);
      if (asm && subjectStatsMap.has(asm.subjectId)) {
        const item = subjectStatsMap.get(asm.subjectId)!;
        item.totalPct += g.percentage;
        item.count += 1;
      }
    });

    const subjectData = Array.from(subjectStatsMap.values())
      .filter(s => s.count > 0)
      .map(s => ({
        subject: s.code,
        fullName: s.name,
        average: Math.round((s.totalPct / s.count) * 10) / 10
      }));

    return {
      totalAssessments,
      publishedAssessments,
      totalStudents,
      totalGradedCount: gradedEntries.length,
      avgPercentage,
      overallScale,
      atRiskList,
      gradeDistData,
      subjectData
    };
  }, [assessments, students, grades, subjects]);

  const GRADE_COLORS: Record<string, string> = {
    'A+': '#1B4332',
    'A': '#2D6A4F',
    'B+': '#1D4ED8',
    'B': '#2563EB',
    'C+': '#D97706',
    'C': '#F59E0B',
    'D': '#C85A32',
    'F': '#991B1B'
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-[#F4F1EA] border border-stone-900 p-6 text-stone-900 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <span className="tracking-widest uppercase font-bold text-[10px] px-2.5 py-1 bg-stone-200 text-stone-800 border border-stone-800 inline-block">
              Academic Term 2 • Oakridge System
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight mt-2 text-stone-900">
              School Assessment Directory & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl font-sans">
              Evaluate marksheets with custom rubric criteria, track student growth trends across subjects, and generate AI-driven feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="dash-create-asm-btn"
              onClick={onOpenCreateAssessment}
              className="flex items-center space-x-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 font-bold text-xs sm:text-sm border border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              <PlusCircle className="w-4 h-4 text-stone-300" />
              <span>Create Assessment</span>
            </button>
            <button
              id="dash-marksheet-btn"
              onClick={() => onNavigate('marksheet')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-900 font-bold text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all"
            >
              <Table className="w-4 h-4 text-stone-800" />
              <span>Grade Marksheet</span>
            </button>
            <button
              id="dash-ai-btn"
              onClick={onOpenAiAssistant}
              className="flex items-center space-x-2 px-4 py-2.5 bg-purple-900 hover:bg-purple-950 text-purple-100 border border-purple-950 font-bold text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Assessments */}
        <div id="kpi-assessments" className="editorial-card p-5 flex items-center justify-between">
          <div>
            <p className="tracking-widest uppercase text-[10px] font-bold text-stone-600">Total Assessments</p>
            <h3 className="text-3xl font-serif font-bold mt-1 text-stone-900">{metrics.totalAssessments}</h3>
            <p className="text-xs text-stone-600 mt-1 flex items-center space-x-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{metrics.publishedAssessments} active/grading</span>
            </p>
          </div>
          <div className="p-3 bg-stone-100 border border-stone-800 text-stone-900">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Overall School Grade Average */}
        <div id="kpi-average" className="editorial-card p-5 flex items-center justify-between">
          <div>
            <p className="tracking-widest uppercase text-[10px] font-bold text-stone-600">School Mean</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <h3 className="text-3xl font-serif font-bold text-stone-900">{metrics.avgPercentage}%</h3>
              <span className="text-xs px-2 py-0.5 font-bold font-mono border border-stone-900 bg-stone-100 text-stone-900">
                {metrics.overallScale.letter}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1 flex items-center space-x-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>GPA: {metrics.overallScale.gpaPoint.toFixed(1)} / 4.0</span>
            </p>
          </div>
          <div className="p-3 bg-emerald-50 border border-stone-800 text-emerald-900">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Total Enrolled Students */}
        <div id="kpi-students" className="editorial-card p-5 flex items-center justify-between">
          <div>
            <p className="tracking-widest uppercase text-[10px] font-bold text-stone-600">Active Roster</p>
            <h3 className="text-3xl font-serif font-bold mt-1 text-stone-900">{metrics.totalStudents}</h3>
            <p className="text-xs text-stone-600 mt-1 font-mono">Across {classes.length} Classes / Grades</p>
          </div>
          <div className="p-3 bg-blue-50 border border-stone-800 text-blue-900">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: At-Risk Students */}
        <div id="kpi-at-risk" className="editorial-card p-5 flex items-center justify-between">
          <div>
            <p className="tracking-widest uppercase text-[10px] font-bold text-stone-600">At-Risk Alerts</p>
            <h3 className="text-3xl font-serif font-bold mt-1 text-rose-900">{metrics.atRiskList.length} Students</h3>
            <p className="text-xs text-rose-700 font-mono mt-1">Below 65% target mean</p>
          </div>
          <div className="p-3 bg-rose-50 border border-stone-800 text-rose-900">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Grade Distribution */}
        <div className="editorial-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">Grade Distribution Histogram</h3>
              <p className="text-xs text-stone-600">Frequency count of letter grades across all graded submissions</p>
            </div>
            <span className="tracking-widest uppercase text-[10px] font-mono font-bold px-2 py-1 bg-stone-100 border border-stone-800 text-stone-800">
              {metrics.totalGradedCount} Logs
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.gradeDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="grade" stroke="#44403C" fontSize={12} tickLine={false} />
                <YAxis stroke="#44403C" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1917', borderColor: '#1C1917', color: '#FAF8F5', borderRadius: '0px' }}
                  cursor={{ fill: 'rgba(28, 25, 23, 0.05)' }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {metrics.gradeDistData.map((entry) => (
                    <Cell key={`cell-${entry.grade}`} fill={GRADE_COLORS[entry.grade] || '#1C1917'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Subject Performance Averages */}
        <div className="editorial-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">Subject Department Mean Score</h3>
              <p className="text-xs text-stone-600">Class average percentage scores across core subject departments</p>
            </div>
            <button
              onClick={() => onNavigate('assessments')}
              className="text-xs font-bold text-stone-900 hover:underline flex items-center space-x-1"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.subjectData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#44403C" fontSize={12} tickLine={false} />
                <YAxis dataKey="subject" type="category" stroke="#44403C" fontSize={12} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1917', borderColor: '#1C1917', color: '#FAF8F5', borderRadius: '0px' }}
                  formatter={(val: any) => [`${val}%`, 'Average Score']}
                />
                <Bar dataKey="average" fill="#1C1917" barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Assessments + At-Risk Student Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Assessments Feed (2 Cols) */}
        <div className="lg:col-span-2 editorial-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">Active Assessments & Quizzes</h3>
              <p className="text-xs text-stone-600">Scheduled tests and current grading queues</p>
            </div>
            <button
              onClick={() => onNavigate('assessments')}
              className="text-xs font-bold text-stone-900 hover:underline"
            >
              View All ({assessments.length})
            </button>
          </div>

          <div className="space-y-3">
            {assessments.slice(0, 4).map(asm => {
              const sub = subjects.find(s => s.id === asm.subjectId);
              const cls = classes.find(c => c.id === asm.classId);
              const asmGrades = grades.filter(g => g.assessmentId === asm.id && g.status === 'graded');

              return (
                <div
                  key={asm.id}
                  className="p-4 bg-[#FAF8F5] border border-stone-300 hover:border-stone-900 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="tracking-widest uppercase text-[9px] font-bold px-2 py-0.5 bg-stone-900 text-stone-50">
                        {sub?.code || 'SUB'}
                      </span>
                      <span className="text-xs font-bold text-stone-700">{cls?.name}</span>
                      <span className="text-[10px] font-mono tracking-wider font-bold text-stone-900 bg-stone-200 px-2 py-0.5 border border-stone-400 uppercase">
                        {asm.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-stone-900">{asm.title}</h4>
                    <p className="text-xs text-stone-600 font-mono">
                      Due: {asm.dueDate} • Marks: {asm.totalPoints} pts • Weight: {asm.weightPercentage}%
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-emerald-800 block">{asmGrades.length} Graded</span>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider">{asm.status}</span>
                    </div>

                    <button
                      id={`grade-btn-${asm.id}`}
                      onClick={() => onNavigate('marksheet')}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-bold border border-stone-900 transition-colors"
                    >
                      Grade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* At-Risk Student Alert Sidebar (1 Col) */}
        <div className="editorial-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-800" />
              <h3 className="text-base font-serif font-bold text-stone-900">Intervention Radar</h3>
            </div>
            <span className="text-[10px] tracking-widest font-mono font-bold px-2 py-0.5 bg-rose-100 text-rose-900 border border-rose-800 uppercase">
              {metrics.atRiskList.length} Alerts
            </span>
          </div>
          <p className="text-xs text-stone-600">Students needing academic support or re-assessment</p>

          {metrics.atRiskList.length === 0 ? (
            <div className="p-6 text-center text-stone-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <p className="text-xs font-medium">All students are meeting baseline criteria!</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {metrics.atRiskList.map(({ student, avgPct, failingCount }) => {
                const cls = classes.find(c => c.id === student.classId);
                return (
                  <div
                    key={student.id}
                    onClick={() => {
                      onSelectStudent(student.id);
                      onNavigate('marksheet');
                    }}
                    className="p-3 bg-rose-50/60 border border-rose-300 hover:border-rose-900 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.avatarUrl}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="w-8 h-8 rounded-full object-cover border border-rose-800"
                      />
                      <div>
                        <h4 className="text-xs font-serif font-bold text-stone-900">
                          {student.firstName} {student.lastName}
                        </h4>
                        <span className="text-[10px] text-stone-600 font-mono">{cls?.name || 'Class'} • {student.studentIdNumber}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-rose-900 block">{avgPct}% Avg</span>
                      <span className="text-[10px] text-rose-700">{failingCount} low grades</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => onNavigate('marksheet')}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 border border-stone-800 text-xs font-bold text-stone-900 transition-colors"
          >
            Open Marksheet Grid
          </button>
        </div>
      </div>
    </div>
  );
};
