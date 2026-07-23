export type AssessmentType = 
  | 'exam' 
  | 'quiz' 
  | 'assignment' 
  | 'project' 
  | 'lab' 
  | 'presentation' 
  | 'oral';

export type AssessmentStatus = 'draft' | 'scheduled' | 'grading' | 'published';

export type UserRole = 'admin' | 'teacher';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  title?: string; // e.g. "Head Academic Administrator" or "Senior Chemistry Teacher"
  assignedSubjectIds?: string[]; // IDs of subjects assigned to this teacher
  assignedClassIds?: string[]; // IDs of classes taught by this teacher
  department?: string;
  status: 'active' | 'suspended';
  lastLogin?: string;
}

export interface TeacherActivityLog {
  id: string;
  teacherId: string;
  teacherName: string;
  action: 'created_assessment' | 'submitted_marks' | 'updated_rubric' | 'login' | 'verified_marks';
  details: string;
  subjectId?: string;
  subjectName?: string;
  timestamp: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. "Grade 10-A"
  gradeLevel: string; // e.g. "Grade 10"
  academicYear: string; // e.g. "2025-2026"
  teacherName: string;
  studentIds: string[];
  subjectIds: string[];
}

export interface Subject {
  id: string;
  code: string; // e.g. "MATH-101"
  name: string; // e.g. "Algebra & Trigonometry"
  department: string; // e.g. "Mathematics"
  color: string; // Tailwind color or hex
  iconName?: string;
}

export interface Student {
  id: string;
  studentIdNumber: string; // e.g. "STU-2025-001"
  firstName: string;
  lastName: string;
  email: string;
  classId: string;
  avatarUrl: string;
  guardianName: string;
  guardianContact: string;
}

export interface RubricLevel {
  levelIndex: number;
  levelName: string; // e.g. "Exemplary", "Proficient", "Developing", "Novice"
  points: number; // e.g. 4, 3, 2, 1
  description: string;
}

export interface RubricCriterion {
  id: string;
  title: string; // e.g. "Critical Analysis"
  description: string;
  weight: number; // e.g. percentage or multiplier
  levels: RubricLevel[];
}

export interface Rubric {
  id: string;
  title: string;
  subjectId: string;
  description: string;
  criteria: RubricCriterion[];
  createdAt: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  questionType: 'multiple_choice' | 'short_answer' | 'essay' | 'problem';
  points: number;
  options?: string[]; // for multiple choice
  sampleAnswer?: string;
}

export interface Assessment {
  id: string;
  title: string;
  code: string; // e.g. "MATH-Q1"
  subjectId: string;
  classId: string;
  type: AssessmentType;
  totalPoints: number;
  weightPercentage: number; // % contribution to term grade
  dueDate: string;
  status: AssessmentStatus;
  instructions: string;
  questions?: AssessmentQuestion[];
  rubricId?: string;
  createdAt: string;
  createdByTeacherId?: string;
  createdByName?: string;
  verificationStatus?: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  adminNotes?: string;
}

export interface CriterionScore {
  criterionId: string;
  levelIndex: number;
  pointsEarned: number;
  comment?: string;
}

export interface GradeEntry {
  id: string;
  assessmentId: string;
  studentId: string;
  score: number; // raw total score
  percentage: number;
  letterGrade: string; // "A+", "A", "B", etc.
  status: 'pending' | 'submitted' | 'graded';
  rubricScores?: Record<string, CriterionScore>; // criterionId -> details
  teacherFeedback?: string;
  strengths?: string[];
  areasForImprovement?: string[];
  submittedAt?: string;
  gradedAt?: string;
  verificationStatus?: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  adminNotes?: string;
}

export interface GradeScale {
  letter: string;
  minPercentage: number;
  maxPercentage: number;
  gpaPoint: number;
  badgeColor: string;
}

export interface StudentAnalyticsSummary {
  student: Student;
  classRoom?: ClassRoom;
  overallGpa: number;
  overallPercentage: number;
  totalAssessmentsTaken: number;
  completedCount: number;
  subjectScores: {
    subject: Subject;
    averagePercentage: number;
    letterGrade: string;
    assessmentCount: number;
  }[];
  recentGrades: {
    assessment: Assessment;
    gradeEntry: GradeEntry;
    subject: Subject;
  }[];
}
