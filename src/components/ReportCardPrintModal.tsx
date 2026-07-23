import React from 'react';
import { X, Printer, GraduationCap, Award, CheckCircle } from 'lucide-react';
import { StudentAnalyticsSummary, GradeScale } from '../types';

interface ReportCardPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: StudentAnalyticsSummary;
  gradeScales: GradeScale[];
}

export const ReportCardPrintModal: React.FC<ReportCardPrintModalProps> = ({
  isOpen,
  onClose,
  summary,
  gradeScales
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const { student, classRoom, overallGpa, overallPercentage, subjectScores, recentGrades } = summary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-stone-900 border-2 border-stone-900 rounded-none w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] my-auto print:shadow-none print:border-none print:max-h-none print:m-0 print:p-0 print:w-full">
        {/* Printable Top Actions Bar (Hidden during print) */}
        <div className="p-4 bg-[#1C1917] text-white border-b border-stone-800 flex items-center justify-between print:hidden">
          <span className="text-xs font-serif font-bold flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Official Student Progress Report Card</span>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-stone-50 text-stone-900 text-xs font-bold border border-stone-900 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Paper Report Card Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 print:p-6 print:space-y-4 font-sans bg-[#FAF8F5]">
          {/* School Header */}
          <div className="border-b-2 border-stone-900 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-stone-900 text-stone-50 border border-stone-900">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-extrabold uppercase tracking-tight text-stone-900">
                    Oakridge International Academy
                  </h1>
                  <p className="text-xs text-stone-600 font-serif italic">100 Academic Way • Department of Assessment & Evaluation</p>
                </div>
              </div>
            </div>

            <div className="text-right font-serif">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block">OFFICIAL ACADEMIC TRANSCRIPT</span>
              <span className="text-xs text-stone-600 font-mono">Date: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Student Profile Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 border border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
            <div>
              <span className="text-[10px] text-stone-500 font-bold uppercase block tracking-widest font-mono">Student Name</span>
              <span className="text-sm font-serif font-bold text-stone-900">{student.firstName} {student.lastName}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-bold uppercase block tracking-widest font-mono">Student ID</span>
              <span className="text-sm font-mono font-bold text-stone-800">{student.studentIdNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-bold uppercase block tracking-widest font-mono">Class & Grade</span>
              <span className="text-sm font-bold text-stone-800">{classRoom?.name || 'Class'} ({classRoom?.academicYear})</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-bold uppercase block tracking-widest font-mono">Cumulative GPA</span>
              <span className="text-sm font-serif font-extrabold text-stone-900">{overallGpa.toFixed(2)} / 4.0 ({overallPercentage}%)</span>
            </div>
          </div>

          {/* Subject Performance Breakdown Table */}
          <div>
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900 mb-2">Subject Mastery Breakdown</h3>
            <table className="w-full text-left border-collapse border border-stone-900 bg-white">
              <thead>
                <tr className="bg-stone-100 text-[11px] font-mono font-bold text-stone-800 border-b border-stone-900 uppercase">
                  <th className="p-2 border-r border-stone-900">Subject Code & Name</th>
                  <th className="p-2 border-r border-stone-900 text-center">Assessments Taken</th>
                  <th className="p-2 border-r border-stone-900 text-center">Average Score</th>
                  <th className="p-2 text-center">Letter Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-300 text-xs text-stone-900">
                {subjectScores.map(ss => (
                  <tr key={ss.subject.id} className="hover:bg-stone-50">
                    <td className="p-2.5 font-bold border-r border-stone-300">
                      [{ss.subject.code}] {ss.subject.name}
                    </td>
                    <td className="p-2.5 text-center font-mono border-r border-stone-300">{ss.assessmentCount}</td>
                    <td className="p-2.5 text-center font-bold border-r border-stone-300">{ss.averagePercentage}%</td>
                    <td className="p-2.5 text-center font-serif font-extrabold text-stone-900">{ss.letterGrade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Assessment Detailed Logs */}
          <div>
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900 mb-2">Assessment Records & Instructor Remarks</h3>
            <div className="space-y-2">
              {recentGrades.map(({ assessment, gradeEntry, subject }) => (
                <div key={gradeEntry.id} className="p-3 border border-stone-300 bg-white text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-stone-900">
                      [{subject?.code}] {assessment?.title}
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      {gradeEntry.score} / {assessment?.totalPoints} pts ({gradeEntry.percentage}%) • Grade: {gradeEntry.letterGrade}
                    </span>
                  </div>
                  {gradeEntry.teacherFeedback && (
                    <p className="text-[11px] text-stone-700 italic bg-[#FAF8F5] p-2 border border-stone-200">
                      "{gradeEntry.teacherFeedback}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Grading Scale Footnote Key */}
          <div className="pt-4 border-t border-stone-300 text-[10px] text-stone-600 space-y-1 font-mono">
            <span className="font-bold uppercase block text-stone-900">Official Oakridge Grading Key:</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {gradeScales.map(gs => (
                <span key={gs.letter}>
                  <strong className="text-stone-900">{gs.letter}:</strong> {gs.minPercentage}% - {gs.maxPercentage}% ({gs.gpaPoint} GPA)
                </span>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-stone-800">
            <div className="border-t border-stone-900 pt-2">
              <span className="font-serif font-bold block text-stone-900">{classRoom?.teacherName || 'Head Teacher'}</span>
              <span className="text-[10px] text-stone-600 uppercase font-mono">Homeroom Teacher Signature</span>
            </div>
            <div className="border-t border-stone-900 pt-2 text-right">
              <span className="font-serif font-bold block text-stone-900">Dr. Elizabeth Vance</span>
              <span className="text-[10px] text-stone-600 uppercase font-mono">Principal / Academic Dean</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
