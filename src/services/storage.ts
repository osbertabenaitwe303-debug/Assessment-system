import {
  ClassRoom,
  Subject,
  Student,
  Rubric,
  Assessment,
  GradeEntry,
  GradeScale,
  StudentAnalyticsSummary,
  User,
  TeacherActivityLog,
  VerificationStatus
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_RUBRICS,
  INITIAL_ASSESSMENTS,
  INITIAL_GRADES,
  DEFAULT_GRADE_SCALES,
  INITIAL_USERS,
  INITIAL_ACTIVITY_LOGS
} from '../data/mockData';

const KEYS = {
  CLASSES: 'school_asm_classes_v1',
  SUBJECTS: 'school_asm_subjects_v1',
  STUDENTS: 'school_asm_students_v1',
  RUBRICS: 'school_asm_rubrics_v1',
  ASSESSMENTS: 'school_asm_assessments_v1',
  GRADES: 'school_asm_grades_v1',
  SCALES: 'school_asm_scales_v1',
  USERS: 'school_asm_users_v1',
  CURRENT_USER: 'school_asm_current_user_v1',
  LOGS: 'school_asm_logs_v1'
};

// Generic LocalStorage Loader
function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error loading key ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key} to localStorage:`, err);
  }
}

// Reset data to defaults
export function resetToDefaultData() {
  saveData(KEYS.CLASSES, INITIAL_CLASSES);
  saveData(KEYS.SUBJECTS, INITIAL_SUBJECTS);
  saveData(KEYS.STUDENTS, INITIAL_STUDENTS);
  saveData(KEYS.RUBRICS, INITIAL_RUBRICS);
  saveData(KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
  saveData(KEYS.GRADES, INITIAL_GRADES);
  saveData(KEYS.SCALES, DEFAULT_GRADE_SCALES);
  saveData(KEYS.USERS, INITIAL_USERS);
  saveData(KEYS.LOGS, INITIAL_ACTIVITY_LOGS);
  saveData(KEYS.CURRENT_USER, INITIAL_USERS[1]); // Default to Prof. Sarah Jenkins (Teacher)
}

// User API & Auth
export function getUsers(): User[] {
  return loadData(KEYS.USERS, INITIAL_USERS);
}

export function saveUser(user: User): User[] {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  saveData(KEYS.USERS, users);
  return users;
}

export function getCurrentUser(): User | null {
  const user = loadData<User | null>(KEYS.CURRENT_USER, INITIAL_USERS[1]);
  return user;
}

export function setCurrentUser(user: User | null): void {
  saveData(KEYS.CURRENT_USER, user);
  if (user) {
    // update last login
    user.lastLogin = new Date().toISOString().replace('T', ' ').substring(0, 16);
    saveUser(user);
  }
}

// Activity Log API
export function getActivityLogs(): TeacherActivityLog[] {
  return loadData(KEYS.LOGS, INITIAL_ACTIVITY_LOGS);
}

export function addActivityLog(log: Omit<TeacherActivityLog, 'id' | 'timestamp'>): TeacherActivityLog[] {
  const logs = getActivityLogs();
  const newLog: TeacherActivityLog = {
    ...log,
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  logs.unshift(newLog);
  saveData(KEYS.LOGS, logs);
  return logs;
}

// Assessment & Grade Verification API
export function verifyAssessment(
  assessmentId: string,
  status: VerificationStatus,
  adminName: string,
  notes?: string
): Assessment[] {
  const assessments = getAssessments();
  const idx = assessments.findIndex(a => a.id === assessmentId);
  if (idx >= 0) {
    assessments[idx].verificationStatus = status;
    assessments[idx].verifiedBy = adminName;
    assessments[idx].verifiedAt = new Date().toISOString().split('T')[0];
    if (notes) assessments[idx].adminNotes = notes;
    saveData(KEYS.ASSESSMENTS, assessments);
  }
  return assessments;
}

export function verifyGradesBatch(
  assessmentId: string,
  status: VerificationStatus,
  adminName: string,
  notes?: string
): GradeEntry[] {
  const grades = getGrades();
  const updatedGrades = grades.map(g => {
    if (g.assessmentId === assessmentId) {
      return {
        ...g,
        verificationStatus: status,
        verifiedBy: adminName,
        verifiedAt: new Date().toISOString().split('T')[0],
        adminNotes: notes || g.adminNotes
      };
    }
    return g;
  });
  saveData(KEYS.GRADES, updatedGrades);
  
  // also sync assessment verification status
  verifyAssessment(assessmentId, status, adminName, notes);
  return updatedGrades;
}

// Class API
export function getClasses(): ClassRoom[] {
  return loadData(KEYS.CLASSES, INITIAL_CLASSES);
}

export function saveClass(classRoom: ClassRoom): ClassRoom[] {
  const classes = getClasses();
  const index = classes.findIndex(c => c.id === classRoom.id);
  if (index >= 0) {
    classes[index] = classRoom;
  } else {
    classes.push(classRoom);
  }
  saveData(KEYS.CLASSES, classes);
  return classes;
}

export function deleteClass(classId: string): ClassRoom[] {
  const classes = getClasses().filter(c => c.id !== classId);
  saveData(KEYS.CLASSES, classes);
  return classes;
}

// Subject API
export function getSubjects(): Subject[] {
  return loadData(KEYS.SUBJECTS, INITIAL_SUBJECTS);
}

export function saveSubject(subject: Subject): Subject[] {
  const subjects = getSubjects();
  const index = subjects.findIndex(s => s.id === subject.id);
  if (index >= 0) {
    subjects[index] = subject;
  } else {
    subjects.push(subject);
  }
  saveData(KEYS.SUBJECTS, subjects);
  return subjects;
}

// Student API
export function getStudents(): Student[] {
  return loadData(KEYS.STUDENTS, INITIAL_STUDENTS);
}

export function saveStudent(student: Student): Student[] {
  const students = getStudents();
  const index = students.findIndex(s => s.id === student.id);
  if (index >= 0) {
    students[index] = student;
  } else {
    students.push(student);
  }
  saveData(KEYS.STUDENTS, students);
  return students;
}

export function deleteStudent(studentId: string): Student[] {
  const students = getStudents().filter(s => s.id !== studentId);
  saveData(KEYS.STUDENTS, students);
  return students;
}

// Rubric API
export function getRubrics(): Rubric[] {
  return loadData(KEYS.RUBRICS, INITIAL_RUBRICS);
}

export function saveRubric(rubric: Rubric): Rubric[] {
  const rubrics = getRubrics();
  const index = rubrics.findIndex(r => r.id === rubric.id);
  if (index >= 0) {
    rubrics[index] = rubric;
  } else {
    rubrics.unshift(rubric);
  }
  saveData(KEYS.RUBRICS, rubrics);
  return rubrics;
}

export function deleteRubric(rubricId: string): Rubric[] {
  const rubrics = getRubrics().filter(r => r.id !== rubricId);
  saveData(KEYS.RUBRICS, rubrics);
  return rubrics;
}

// Assessment API
export function getAssessments(): Assessment[] {
  return loadData(KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
}

export function saveAssessment(assessment: Assessment): Assessment[] {
  const assessments = getAssessments();
  const index = assessments.findIndex(a => a.id === assessment.id);
  if (index >= 0) {
    assessments[index] = assessment;
  } else {
    assessments.unshift(assessment);
  }
  saveData(KEYS.ASSESSMENTS, assessments);
  return assessments;
}

export function deleteAssessment(assessmentId: string): Assessment[] {
  const assessments = getAssessments().filter(a => a.id !== assessmentId);
  saveData(KEYS.ASSESSMENTS, assessments);
  
  // also clean up associated grades
  const grades = getGrades().filter(g => g.assessmentId !== assessmentId);
  saveData(KEYS.GRADES, grades);
  
  return assessments;
}

// Grade Scale Calculator
export function getGradeScaleRules(): GradeScale[] {
  return loadData(KEYS.SCALES, DEFAULT_GRADE_SCALES);
}

export function getGradeScaleForPercentage(pct: number): GradeScale {
  const scales = getGradeScaleRules();
  const sorted = [...scales].sort((a, b) => b.minPercentage - a.minPercentage);
  for (const scale of sorted) {
    if (pct >= scale.minPercentage) {
      return scale;
    }
  }
  return sorted[sorted.length - 1] || DEFAULT_GRADE_SCALES[DEFAULT_GRADE_SCALES.length - 1];
}

// Grade Entries API
export function getGrades(): GradeEntry[] {
  return loadData(KEYS.GRADES, INITIAL_GRADES);
}

export function saveGrade(grade: GradeEntry): GradeEntry[] {
  const grades = getGrades();
  const scale = getGradeScaleForPercentage(grade.percentage);
  grade.letterGrade = scale.letter;

  const index = grades.findIndex(g => g.id === grade.id || (g.assessmentId === grade.assessmentId && g.studentId === grade.studentId));
  if (index >= 0) {
    grades[index] = { ...grades[index], ...grade };
  } else {
    grades.push(grade);
  }
  saveData(KEYS.GRADES, grades);
  return grades;
}

export function saveBulkGrades(updatedGrades: GradeEntry[]): GradeEntry[] {
  let grades = getGrades();
  for (const item of updatedGrades) {
    const scale = getGradeScaleForPercentage(item.percentage);
    item.letterGrade = scale.letter;
    const idx = grades.findIndex(g => g.id === item.id || (g.assessmentId === item.assessmentId && g.studentId === item.studentId));
    if (idx >= 0) {
      grades[idx] = { ...grades[idx], ...item };
    } else {
      grades.push(item);
    }
  }
  saveData(KEYS.GRADES, grades);
  return grades;
}

// Analytics Helpers
export function getStudentSummary(studentId: string): StudentAnalyticsSummary | null {
  const students = getStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  const classes = getClasses();
  const classRoom = classes.find(c => c.id === student.classId);
  const subjects = getSubjects();
  const assessments = getAssessments();
  const grades = getGrades().filter(g => g.studentId === studentId && g.status === 'graded');

  if (grades.length === 0) {
    return {
      student,
      classRoom,
      overallGpa: 0,
      overallPercentage: 0,
      totalAssessmentsTaken: 0,
      completedCount: 0,
      subjectScores: [],
      recentGrades: []
    };
  }

  // Calculate subject averages
  const subjectMap = new Map<string, { totalPct: number; count: number }>();
  for (const grade of grades) {
    const asm = assessments.find(a => a.id === grade.assessmentId);
    if (asm) {
      const cur = subjectMap.get(asm.subjectId) || { totalPct: 0, count: 0 };
      cur.totalPct += grade.percentage;
      cur.count += 1;
      subjectMap.set(asm.subjectId, cur);
    }
  }

  const subjectScores = Array.from(subjectMap.entries()).map(([subId, stat]) => {
    const subject = subjects.find(s => s.id === subId) || {
      id: subId,
      code: 'SUB',
      name: 'General Subject',
      department: 'General',
      color: 'bg-gray-100 text-gray-800'
    };
    const avgPct = Math.round((stat.totalPct / stat.count) * 10) / 10;
    const scale = getGradeScaleForPercentage(avgPct);
    return {
      subject,
      averagePercentage: avgPct,
      letterGrade: scale.letter,
      assessmentCount: stat.count
    };
  });

  const totalPercentage = grades.reduce((acc, g) => acc + g.percentage, 0);
  const overallPct = Math.round((totalPercentage / grades.length) * 10) / 10;
  
  // Calculate GPA
  const totalGpaPoints = grades.reduce((acc, g) => acc + getGradeScaleForPercentage(g.percentage).gpaPoint, 0);
  const overallGpa = Math.round((totalGpaPoints / grades.length) * 100) / 100;

  const recentGrades = grades
    .map(g => {
      const asm = assessments.find(a => a.id === g.assessmentId);
      const sub = subjects.find(s => s.id === asm?.subjectId);
      return {
        assessment: asm!,
        gradeEntry: g,
        subject: sub!
      };
    })
    .filter(item => item.assessment && item.subject);

  return {
    student,
    classRoom,
    overallGpa,
    overallPercentage: overallPct,
    totalAssessmentsTaken: grades.length,
    completedCount: grades.length,
    subjectScores,
    recentGrades
  };
}

export function exportBackupJSON(): string {
  const data = {
    classes: getClasses(),
    subjects: getSubjects(),
    students: getStudents(),
    rubrics: getRubrics(),
    assessments: getAssessments(),
    grades: getGrades(),
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.classes && Array.isArray(parsed.classes)) saveData(KEYS.CLASSES, parsed.classes);
    if (parsed.subjects && Array.isArray(parsed.subjects)) saveData(KEYS.SUBJECTS, parsed.subjects);
    if (parsed.students && Array.isArray(parsed.students)) saveData(KEYS.STUDENTS, parsed.students);
    if (parsed.rubrics && Array.isArray(parsed.rubrics)) saveData(KEYS.RUBRICS, parsed.rubrics);
    if (parsed.assessments && Array.isArray(parsed.assessments)) saveData(KEYS.ASSESSMENTS, parsed.assessments);
    if (parsed.grades && Array.isArray(parsed.grades)) saveData(KEYS.GRADES, parsed.grades);
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}
