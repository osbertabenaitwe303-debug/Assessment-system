import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  FileCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Search,
  Filter,
  Clock,
  MessageSquare,
  Plus,
  BookOpen,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  School,
  X
} from 'lucide-react';
import { User, Assessment, GradeEntry, Subject, ClassRoom, Student, TeacherActivityLog, VerificationStatus } from '../types';

interface AdminOversightPortalProps {
  adminUser: User;
  users: User[];
  subjects: Subject[];
  classes: ClassRoom[];
  students: Student[];
  assessments: Assessment[];
  grades: GradeEntry[];
  activityLogs: TeacherActivityLog[];
  onSaveUser: (user: User) => void;
  onVerifyAssessment: (assessmentId: string, status: VerificationStatus, notes?: string) => void;
  onVerifyGradesBatch: (assessmentId: string, status: VerificationStatus, notes?: string) => void;
  onOpenMarksheetForAssessment: (asmId: string) => void;
}

export const AdminOversightPortal: React.FC<AdminOversightPortalProps> = ({
  adminUser,
  users,
  subjects,
  classes,
  students,
  assessments,
  grades,
  activityLogs,
  onSaveUser,
  onVerifyAssessment,
  onVerifyGradesBatch,
  onOpenMarksheetForAssessment
}) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'teachers' | 'audit'>('verification');
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('pending');

  // Inspection Modal State for verification review
  const [inspectingAssessment, setInspectingAssessment] = useState<Assessment | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');

  // New Teacher Account Modal State
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherTitle, setNewTeacherTitle] = useState('Subject Educator');
  const [newTeacherDepartment, setNewTeacherDepartment] = useState('Natural Sciences');
  const [newTeacherSubjectIds, setNewTeacherSubjectIds] = useState<string[]>([]);

  // Filter assessments requiring or having verification
  const filteredAssessments = assessments.filter(asm => {
    if (filterSubjectId !== 'all' && asm.subjectId !== filterSubjectId) return false;
    
    const asmGrades = grades.filter(g => g.assessmentId === asm.id);
    const isVerified = asm.verificationStatus === 'verified' || asmGrades.some(g => g.verificationStatus === 'verified');
    const isPending = asm.verificationStatus === 'pending' || asmGrades.some(g => g.verificationStatus === 'pending');
    const isRejected = asm.verificationStatus === 'rejected';

    if (filterStatus === 'pending') return !isVerified;
    if (filterStatus === 'verified') return isVerified;
    if (filterStatus === 'rejected') return isRejected;
    return true;
  });

  const teacherUsers = users.filter(u => u.role === 'teacher');

  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherEmail.trim()) return;

    const newUser: User = {
      id: `usr-t-${Date.now()}`,
      name: newTeacherName,
      email: newTeacherEmail,
      role: 'teacher',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      title: newTeacherTitle,
      department: newTeacherDepartment,
      assignedSubjectIds: newTeacherSubjectIds.length > 0 ? newTeacherSubjectIds : [subjects[0]?.id || 'sub-chem'],
      status: 'active'
    };

    onSaveUser(newUser);
    setIsAddTeacherOpen(false);
    setNewTeacherName('');
    setNewTeacherEmail('');
  };

  const handleApprove = (asmId: string) => {
    onVerifyGradesBatch(asmId, 'verified', adminNotesInput || 'Verified and approved by Academic Admin.');
    setInspectingAssessment(null);
    setAdminNotesInput('');
  };

  const handleReject = (asmId: string) => {
    onVerifyGradesBatch(asmId, 'rejected', adminNotesInput || 'Revision requested. Please verify grade entry calculations.');
    setInspectingAssessment(null);
    setAdminNotesInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Admin Welcome Header */}
      <div className="p-6 bg-stone-900 text-stone-50 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-amber-400 text-stone-900 border border-stone-900 font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 bg-amber-400 text-stone-900 font-bold">
                Academic Admin Oversight
              </span>
              <span className="text-xs text-stone-400 font-mono">Logged as: {adminUser.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
              Teacher Accounts & Marks Verification Center
            </h2>
            <p className="text-xs text-stone-300 font-serif italic">
              Supervise subject teacher submissions, audit grading activity, and issue official mark verifications.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddTeacherOpen(true)}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold border border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] flex items-center space-x-1.5 self-start md:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Teacher Account</span>
        </button>
      </div>

      {/* Admin Portal Navigation Tabs */}
      <div className="flex border-b border-stone-300 bg-[#FAF8F5]">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-5 py-3 text-xs font-serif font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'verification'
              ? 'border-purple-900 text-purple-900 bg-white'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileCheck className="w-4 h-4 text-purple-900" />
          <span>Marks & Score Verification Queue ({filteredAssessments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-5 py-3 text-xs font-serif font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'teachers'
              ? 'border-purple-900 text-purple-900 bg-white'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4 text-purple-900" />
          <span>Teacher Accounts Oversight ({teacherUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-5 py-3 text-xs font-serif font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'audit'
              ? 'border-purple-900 text-purple-900 bg-white'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Clock className="w-4 h-4 text-purple-900" />
          <span>Teacher Activity Audit Trail</span>
        </button>
      </div>

      {/* SUB-VIEW 1: Marks & Score Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 bg-white border border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-stone-800">
                <Filter className="w-4 h-4 text-stone-700" />
                <span>Filter Queue:</span>
              </div>

              <select
                value={filterSubjectId}
                onChange={e => setFilterSubjectId(e.target.value)}
                className="px-3 py-1 bg-white border border-stone-800 font-medium text-stone-900"
              >
                <option value="all">All Subject Departments</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>[{s.code}] {s.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-1 bg-white border border-stone-800 font-medium text-stone-900"
              >
                <option value="pending">Awaiting Verification</option>
                <option value="verified">Verified & Approved</option>
                <option value="rejected">Revision Requested</option>
                <option value="all">All Submissions</option>
              </select>
            </div>

            <span className="text-xs font-mono font-bold text-stone-600">
              Showing {filteredAssessments.length} assessment marksheets
            </span>
          </div>

          {/* Verification Cards */}
          {filteredAssessments.length === 0 ? (
            <div className="p-12 text-center bg-white border border-stone-300 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-serif font-bold text-stone-900">Verification Queue Clear</h4>
              <p className="text-xs text-stone-600">All submitted assessment scores for this filter are verified!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAssessments.map(asm => {
                const subject = subjects.find(s => s.id === asm.subjectId);
                const classRoom = classes.find(c => c.id === asm.classId);
                const asmGrades = grades.filter(g => g.assessmentId === asm.id);
                const scoredCount = asmGrades.filter(g => g.score > 0 || g.status === 'graded').length;

                const teacherObj = users.find(u => u.id === asm.createdByTeacherId || u.assignedSubjectIds?.includes(asm.subjectId));

                const isVerified = asm.verificationStatus === 'verified' || asmGrades.some(g => g.verificationStatus === 'verified');
                const isRejected = asm.verificationStatus === 'rejected';

                return (
                  <div key={asm.id} className="editorial-card p-5 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs bg-stone-900 text-stone-50 px-2 py-0.5">
                            {subject?.code || 'SUB'}
                          </span>
                          <h4 className="text-base font-serif font-bold text-stone-900">{asm.title}</h4>
                          <span className="text-xs text-stone-600">Class: {classRoom?.name}</span>
                        </div>

                        <p className="text-xs text-stone-600">
                          Submitted by Subject Teacher: <strong className="text-stone-900">{teacherObj?.name || asm.createdByName || 'Subject Educator'}</strong>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isVerified ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-400 font-bold text-xs flex items-center space-x-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Verified by {asm.verifiedBy || 'Admin'}</span>
                          </span>
                        ) : isRejected ? (
                          <span className="px-3 py-1 bg-rose-100 text-rose-900 border border-rose-400 font-bold text-xs flex items-center space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                            <span>Revision Requested</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-400 font-bold text-xs flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Awaiting Verification</span>
                          </span>
                        )}

                        <button
                          onClick={() => setInspectingAssessment(asm)}
                          className="px-3.5 py-1.5 bg-stone-900 text-stone-50 font-bold text-xs border border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect & Verify</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] border border-stone-300 flex items-center justify-between text-xs font-mono">
                      <span>Total Marks Recorded: <strong>{scoredCount} student scores</strong></span>
                      <span>Total Assessment Points: <strong>{asm.totalPoints} pts</strong></span>
                      <span>Term Weight: <strong>{asm.weightPercentage}%</strong></span>
                    </div>

                    {asm.adminNotes && (
                      <p className="text-xs italic text-stone-700 bg-amber-50 p-2 border border-amber-300">
                        Admin Note: "{asm.adminNotes}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: Teacher Accounts Oversight */}
      {activeTab === 'teachers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teacherUsers.map(teacher => {
              const teacherSubjects = subjects.filter(s => teacher.assignedSubjectIds?.includes(s.id));
              const teacherAssessments = assessments.filter(a =>
                teacherSubjects.some(s => s.id === a.subjectId) || a.createdByTeacherId === teacher.id
              );

              return (
                <div key={teacher.id} className="editorial-card p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={teacher.name}
                        className="w-11 h-11 rounded-full object-cover border border-stone-800"
                      />
                      <div>
                        <h4 className="text-base font-serif font-bold text-stone-900">{teacher.name}</h4>
                        <p className="text-xs text-stone-600 font-serif italic">{teacher.title}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] border border-stone-300 space-y-2 text-xs">
                      <div>
                        <span className="font-mono text-stone-500 uppercase text-[10px] block font-bold">Assigned Subject Department(s)</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {teacherSubjects.map(s => (
                            <span key={s.id} className="px-2 py-0.5 bg-stone-900 text-stone-50 font-bold text-[10px] font-mono">
                              [{s.code}] {s.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200">
                        <span className="text-stone-600">Assessments Created</span>
                        <span className="font-bold text-stone-900 font-mono">{teacherAssessments.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-stone-500">Last login: {teacher.lastLogin || 'Recent'}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-[10px] uppercase">
                      Active Account
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Teacher Activity Audit Trail */}
      {activeTab === 'audit' && (
        <div className="editorial-card p-6 space-y-4">
          <h3 className="text-base font-serif font-bold text-stone-900 flex items-center space-x-2 border-b border-stone-200 pb-2">
            <Clock className="w-4 h-4 text-purple-900" />
            <span>Teacher System Activity Audit Trail</span>
          </h3>

          <div className="space-y-3">
            {activityLogs.map(log => (
              <div key={log.id} className="p-3.5 bg-[#FAF8F5] border border-stone-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-bold text-xs text-stone-900">{log.teacherName}</span>
                    <span className="text-[10px] font-mono uppercase font-bold bg-stone-200 px-1.5 py-0.5 text-stone-800 border border-stone-400">
                      {log.action.replace('_', ' ')}
                    </span>
                    {log.subjectName && (
                      <span className="text-[10px] font-mono text-purple-900 font-bold">
                        Subject: {log.subjectName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-700">{log.details}</p>
                </div>

                <span className="text-[10px] font-mono text-stone-500 whitespace-nowrap">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal 1: Inspection & Verification Drawer */}
      {inspectingAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-2 border-stone-900 rounded-none w-full max-w-3xl max-h-[92vh] flex flex-col shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] my-auto">
            {/* Header */}
            <div className="p-4 bg-[#1C1917] text-white border-b border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-bold block">Admin Score Verification Inspector</span>
                <h3 className="text-base font-serif font-bold text-white">
                  {inspectingAssessment.title} ({inspectingAssessment.code})
                </h3>
              </div>
              <button onClick={() => setInspectingAssessment(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-stone-900 text-xs">
              <div className="p-3 bg-purple-50 border border-purple-900 flex justify-between items-center">
                <span>Total Marks: <strong>{inspectingAssessment.totalPoints} pts</strong></span>
                <span>Term Weight: <strong>{inspectingAssessment.weightPercentage}%</strong></span>
                <span>Due Date: <strong>{inspectingAssessment.dueDate}</strong></span>
              </div>

              {/* Student Marksheet Breakdown List */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-stone-900 uppercase">Submitted Student Marks</h4>
                <div className="max-h-60 overflow-y-auto divide-y divide-stone-300 border border-stone-800 bg-white">
                  {students.map(st => {
                    const grade = grades.find(g => g.assessmentId === inspectingAssessment.id && g.studentId === st.id);

                    return (
                      <div key={st.id} className="p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] text-stone-500">{st.studentIdNumber}</span>
                          <span className="font-bold text-stone-900">{st.firstName} {st.lastName}</span>
                        </div>

                        {grade ? (
                          <div className="flex items-center space-x-3">
                            <span className="font-mono font-bold text-stone-900">
                              {grade.score} / {inspectingAssessment.totalPoints} pts ({grade.percentage}%)
                            </span>
                            <span className="font-serif font-extrabold text-stone-900 px-1.5 py-0.5 bg-stone-100 border border-stone-300">
                              {grade.letterGrade}
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic text-[11px]">No score recorded</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Admin Feedback Notes */}
              <div className="space-y-1">
                <label className="font-bold text-stone-800">Admin Review Feedback / Verification Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Marks verified and cross-checked with rubric. Approved for final term report cards."
                  value={adminNotesInput}
                  onChange={e => setAdminNotesInput(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-800 text-xs text-stone-900"
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 bg-[#FAF8F5] border-t border-stone-300 flex items-center justify-between">
              <button
                onClick={() => onOpenMarksheetForAssessment(inspectingAssessment.id)}
                className="px-3 py-1.5 bg-stone-200 text-stone-900 text-xs font-bold"
              >
                Open Full Marksheet Grid
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReject(inspectingAssessment.id)}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-stone-50 font-bold text-xs border border-rose-900 flex items-center space-x-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Request Revision</span>
                </button>
                <button
                  onClick={() => handleApprove(inspectingAssessment.id)}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-stone-50 font-bold text-xs border border-emerald-950 flex items-center space-x-1 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Verify Marks</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Create Teacher Account */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
          <div className="bg-white border-2 border-stone-900 rounded-none w-full max-w-md shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
            <div className="p-4 bg-[#1C1917] text-white flex items-center justify-between">
              <span className="font-serif font-bold text-sm">Create New Teacher Account</span>
              <button onClick={() => setIsAddTeacherOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacherSubmit} className="p-5 space-y-4 text-xs text-stone-900">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Teacher Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Michael Faraday"
                  value={newTeacherName}
                  onChange={e => setNewTeacherName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-800 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. m.faraday@oakridge.edu"
                  value={newTeacherEmail}
                  onChange={e => setNewTeacherEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-800 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Title / Rank</label>
                  <input
                    type="text"
                    value={newTeacherTitle}
                    onChange={e => setNewTeacherTitle(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-800 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Department</label>
                  <input
                    type="text"
                    value={newTeacherDepartment}
                    onChange={e => setNewTeacherDepartment(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-800 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Assign Subject Department</label>
                <select
                  multiple
                  value={newTeacherSubjectIds}
                  onChange={e => {
                    const selected = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
                    setNewTeacherSubjectIds(selected);
                  }}
                  className="w-full p-2 border border-stone-800 bg-white h-24 text-xs"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>[{s.code}] {s.name}</option>
                  ))}
                </select>
                <span className="text-[10px] text-stone-500 italic">Hold Ctrl / Cmd to select multiple subjects</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddTeacherOpen(false)}
                  className="px-3 py-1.5 bg-stone-200 text-stone-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 text-stone-50 font-bold border border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
