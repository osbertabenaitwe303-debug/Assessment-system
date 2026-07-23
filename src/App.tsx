import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { AssessmentList } from './components/AssessmentList';
import { AssessmentFormModal } from './components/AssessmentFormModal';
import { MarksheetGrid } from './components/MarksheetGrid';
import { ClassSubjectManager } from './components/ClassSubjectManager';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LoginModal } from './components/LoginModal';
import { TeacherSubjectDashboard } from './components/TeacherSubjectDashboard';
import { AdminOversightPortal } from './components/AdminOversightPortal';

import {
  Assessment,
  ClassRoom,
  Subject,
  Student,
  Rubric,
  GradeEntry,
  User,
  TeacherActivityLog,
  VerificationStatus
} from './types';

import {
  getAssessments,
  getClasses,
  getSubjects,
  getStudents,
  getRubrics,
  getGrades,
  getGradeScaleRules,
  getUsers,
  getCurrentUser,
  setCurrentUser,
  saveUser,
  getActivityLogs,
  addActivityLog,
  verifyAssessment,
  verifyGradesBatch,
  saveAssessment,
  deleteAssessment,
  saveBulkGrades,
  saveRubric,
  deleteRubric,
  saveClass,
  saveSubject,
  resetToDefaultData,
  exportBackupJSON,
  importBackupJSON
} from './services/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('teacher-dashboard');

  // Application Data State
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [users, setUsersList] = useState<User[]>([]);
  const [currentUser, setCurrentUserObj] = useState<User | null>(null);
  const [activityLogs, setActivityLogsList] = useState<TeacherActivityLog[]>([]);

  // Modal & Target State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAssessmentFormOpen, setIsAssessmentFormOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiModalSubject, setAiModalSubject] = useState('');
  const [aiModalTopic, setAiModalTopic] = useState('');

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [marksheetAssessmentId, setMarksheetAssessmentId] = useState<string>('');

  // Initial Load from Storage
  const loadAllData = () => {
    const loadedAssessments = getAssessments();
    const loadedClasses = getClasses();
    const loadedSubjects = getSubjects();
    const loadedStudents = getStudents();
    const loadedRubrics = getRubrics();
    const loadedGrades = getGrades();
    const loadedUsers = getUsers();
    const loadedUser = getCurrentUser();
    const loadedLogs = getActivityLogs();

    setAssessments(loadedAssessments);
    setClasses(loadedClasses);
    setSubjects(loadedSubjects);
    setStudents(loadedStudents);
    setRubrics(loadedRubrics);
    setGrades(loadedGrades);
    setUsersList(loadedUsers);
    setCurrentUserObj(loadedUser);
    setActivityLogsList(loadedLogs);

    if (loadedUser) {
      if (loadedUser.role === 'teacher' && activeTab === 'dashboard') {
        setActiveTab('teacher-dashboard');
      } else if (loadedUser.role === 'admin' && activeTab === 'teacher-dashboard') {
        setActiveTab('admin-portal');
      }
    }

    if (loadedStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(loadedStudents[0].id);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    setCurrentUserObj(user);
    if (user.role === 'teacher') {
      setActiveTab('teacher-dashboard');
    } else {
      setActiveTab('admin-portal');
    }

    addActivityLog({
      teacherId: user.id,
      teacherName: user.name,
      action: 'login',
      details: `Logged in as ${user.title || user.role}`
    });
    setActivityLogsList(getActivityLogs());
  };

  const handleSaveTeacherUser = (user: User) => {
    const updated = saveUser(user);
    setUsersList(updated);
    addActivityLog({
      teacherId: currentUser?.id || 'admin',
      teacherName: currentUser?.name || 'Admin',
      action: 'created_assessment',
      details: `Created new teacher account for ${user.name} (${user.email})`
    });
    setActivityLogsList(getActivityLogs());
  };

  const handleVerifyGradesBatch = (asmId: string, status: VerificationStatus, notes?: string) => {
    const updatedGrades = verifyGradesBatch(asmId, status, currentUser?.name || 'Academic Admin', notes);
    setGrades(updatedGrades);
    setAssessments(getAssessments());

    const asm = assessments.find(a => a.id === asmId);
    addActivityLog({
      teacherId: currentUser?.id || 'admin',
      teacherName: currentUser?.name || 'Academic Admin',
      action: 'verified_marks',
      details: `${status === 'verified' ? 'Verified & approved' : 'Requested revision for'} marks in ${asm?.title || 'Assessment'} (${asm?.code || ''})`
    });
    setActivityLogsList(getActivityLogs());
  };

  const handleSaveAssessment = (asm: Assessment) => {
    if (currentUser?.role === 'teacher') {
      asm.createdByTeacherId = currentUser.id;
      asm.createdByName = currentUser.name;
    }
    const updated = saveAssessment(asm);
    setAssessments(updated);

    addActivityLog({
      teacherId: currentUser?.id || 'usr-1',
      teacherName: currentUser?.name || 'Teacher',
      action: 'created_assessment',
      details: `Created assessment ${asm.title} (${asm.code})`,
      subjectId: asm.subjectId
    });
    setActivityLogsList(getActivityLogs());
  };

  const handleDeleteAssessment = (asmId: string) => {
    if (window.confirm('Are you sure you want to delete this assessment and its associated marksheet entries?')) {
      const updated = deleteAssessment(asmId);
      setAssessments(updated);
      setGrades(getGrades());
    }
  };

  const handleSaveGrades = (updatedGradesList: GradeEntry[]) => {
    const allUpdatedGrades = saveBulkGrades(updatedGradesList);
    setGrades(allUpdatedGrades);

    if (currentUser?.role === 'teacher') {
      addActivityLog({
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        action: 'submitted_marks',
        details: `Updated/submitted marksheet for ${updatedGradesList.length} student scores`
      });
      setActivityLogsList(getActivityLogs());
    }
  };

  const handleSaveRubric = (rubric: Rubric) => {
    const updated = saveRubric(rubric);
    setRubrics(updated);

    if (currentUser?.role === 'teacher') {
      addActivityLog({
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        action: 'updated_rubric',
        details: `Saved rubric criteria for ${rubric.title}`,
        subjectId: rubric.subjectId
      });
      setActivityLogsList(getActivityLogs());
    }
  };

  const handleDeleteRubric = (rubricId: string) => {
    if (window.confirm('Are you sure you want to delete this rubric?')) {
      const updated = deleteRubric(rubricId);
      setRubrics(updated);
    }
  };

  const handleSaveClass = (classRoom: ClassRoom) => {
    const updated = saveClass(classRoom);
    setClasses(updated);
  };

  const handleSaveSubject = (subject: Subject) => {
    const updated = saveSubject(subject);
    setSubjects(updated);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all assessment records to initial demo dataset?')) {
      resetToDefaultData();
      loadAllData();
    }
  };

  const handleExportData = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oakridge_assessment_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = event => {
          const content = event.target?.result as string;
          if (content && importBackupJSON(content)) {
            loadAllData();
            alert('School assessment data imported successfully!');
          } else {
            alert('Invalid backup JSON file.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleOpenMarksheetForAssessment = (asmId: string) => {
    setMarksheetAssessmentId(asmId);
    setActiveTab('marksheet');
  };

  const handleOpenAiGeneratorForSubject = (subjectName?: string, topicName?: string) => {
    setAiModalSubject(subjectName || '');
    setAiModalTopic(topicName || '');
    setIsAiAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-stone-900 selection:text-stone-50 flex flex-col">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Main Tab Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Teacher Subject Specific Dashboard */}
        {activeTab === 'teacher-dashboard' && currentUser && (
          <TeacherSubjectDashboard
            teacher={currentUser}
            subjects={subjects}
            assessments={assessments}
            grades={grades}
            classes={classes}
            students={students}
            onOpenCreateAssessment={() => {
              setEditingAssessment(null);
              setIsAssessmentFormOpen(true);
            }}
            onOpenMarksheetForAssessment={handleOpenMarksheetForAssessment}
            onOpenAiAssistantForSubject={handleOpenAiGeneratorForSubject}
            onNavigateToTab={tab => setActiveTab(tab)}
          />
        )}

        {/* Admin Accounts & Verification Portal */}
        {activeTab === 'admin-portal' && currentUser && (
          <AdminOversightPortal
            adminUser={currentUser}
            users={users}
            subjects={subjects}
            classes={classes}
            students={students}
            assessments={assessments}
            grades={grades}
            activityLogs={activityLogs}
            onSaveUser={handleSaveTeacherUser}
            onVerifyAssessment={(id, status, notes) => verifyAssessment(id, status, currentUser.name, notes)}
            onVerifyGradesBatch={handleVerifyGradesBatch}
            onOpenMarksheetForAssessment={handleOpenMarksheetForAssessment}
          />
        )}

        {/* Schoolwide General Overview */}
        {activeTab === 'dashboard' && (
          <Dashboard
            assessments={assessments}
            students={students}
            grades={grades}
            subjects={subjects}
            classes={classes}
            onNavigate={tab => setActiveTab(tab)}
            onOpenCreateAssessment={() => {
              setEditingAssessment(null);
              setIsAssessmentFormOpen(true);
            }}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            onSelectStudent={id => setSelectedStudentId(id)}
          />
        )}

        {activeTab === 'assessments' && (
          <AssessmentList
            assessments={assessments}
            subjects={subjects}
            classes={classes}
            rubrics={rubrics}
            onOpenCreateModal={() => {
              setEditingAssessment(null);
              setIsAssessmentFormOpen(true);
            }}
            onEditAssessment={asm => {
              setEditingAssessment(asm);
              setIsAssessmentFormOpen(true);
            }}
            onDeleteAssessment={handleDeleteAssessment}
            onOpenMarksheet={handleOpenMarksheetForAssessment}
            onOpenAiGeneratorForAssessment={handleOpenAiGeneratorForSubject}
          />
        )}

        {activeTab === 'marksheet' && (
          <MarksheetGrid
            assessments={assessments}
            classes={classes}
            students={students}
            subjects={subjects}
            rubrics={rubrics}
            grades={grades}
            onSaveGrades={handleSaveGrades}
            initialAssessmentId={marksheetAssessmentId}
            currentUser={currentUser}
            onVerifyGradesBatch={handleVerifyGradesBatch}
          />
        )}

        {activeTab === 'classes' && (
          <ClassSubjectManager
            classes={classes}
            subjects={subjects}
            students={students}
            onSaveClass={handleSaveClass}
            onSaveSubject={handleSaveSubject}
            onDeleteClass={() => {}}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#F4F1EA] border-t border-stone-300 text-stone-600 text-xs py-4 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-serif">
          <span className="font-semibold">Oakridge School Assessment & Marksheet System © 2026</span>
          <span className="text-stone-500 font-sans text-[11px]">Subject Follow-Up & Academic Verification Portal</span>
        </div>
      </footer>

      {/* User Login & Account Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        users={users}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
      />

      {/* Assessment Form Modal */}
      <AssessmentFormModal
        isOpen={isAssessmentFormOpen}
        onClose={() => {
          setIsAssessmentFormOpen(false);
          setEditingAssessment(null);
        }}
        onSave={handleSaveAssessment}
        editingAssessment={editingAssessment}
        subjects={subjects}
        classes={classes}
        rubrics={rubrics}
        onOpenAiGenerator={handleOpenAiGeneratorForSubject}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        subjects={subjects}
        initialSubjectName={aiModalSubject}
        initialTopic={aiModalTopic}
      />
    </div>
  );
}

