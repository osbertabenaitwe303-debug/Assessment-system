import { ClassRoom, Subject, Student, Rubric, Assessment, GradeEntry, GradeScale, User, TeacherActivityLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Dr. Elizabeth Vance',
    email: 'admin@oakridge.edu',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    title: 'Head Academic Administrator',
    department: 'School Directorate',
    status: 'active',
    lastLogin: '2026-07-23 08:30'
  },
  {
    id: 'usr-chem',
    name: 'Prof. Sarah Jenkins',
    email: 's.jenkins@oakridge.edu',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1580894732468-91823908f978?auto=format&fit=crop&q=80&w=250',
    title: 'Senior Organic Chemistry Teacher',
    assignedSubjectIds: ['sub-chem'],
    assignedClassIds: ['class-11stem', 'class-12adv'],
    department: 'Natural Sciences',
    status: 'active',
    lastLogin: '2026-07-23 07:15'
  },
  {
    id: 'usr-math',
    name: 'Mr. David Miller',
    email: 'd.miller@oakridge.edu',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    title: 'Mathematics & Physics Lead',
    assignedSubjectIds: ['sub-math', 'sub-phys'],
    assignedClassIds: ['class-10a', 'class-11stem'],
    department: 'Mathematics & Physical Sciences',
    status: 'active',
    lastLogin: '2026-07-22 16:40'
  },
  {
    id: 'usr-hum',
    name: 'Ms. Amanda Roberts',
    email: 'a.roberts@oakridge.edu',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    title: 'Humanities & History Educator',
    assignedSubjectIds: ['sub-eng', 'sub-hist'],
    assignedClassIds: ['class-10a', 'class-10b'],
    department: 'Humanities',
    status: 'active',
    lastLogin: '2026-07-21 11:20'
  },
  {
    id: 'usr-cs',
    name: 'Dr. Alan Turing',
    email: 'a.turing@oakridge.edu',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    title: 'Computer Science Instructor',
    assignedSubjectIds: ['sub-cs'],
    assignedClassIds: ['class-12adv'],
    department: 'Technology & Computing',
    status: 'active',
    lastLogin: '2026-07-22 09:10'
  }
];

export const INITIAL_ACTIVITY_LOGS: TeacherActivityLog[] = [
  {
    id: 'log-1',
    teacherId: 'usr-chem',
    teacherName: 'Prof. Sarah Jenkins',
    action: 'submitted_marks',
    details: 'Submitted 15 student marks for Organic Synthesis Lab Report (CHEM-202)',
    subjectId: 'sub-chem',
    subjectName: 'Organic Chemistry',
    timestamp: '2026-07-23 07:15'
  },
  {
    id: 'log-2',
    teacherId: 'usr-math',
    teacherName: 'Mr. David Miller',
    action: 'created_assessment',
    details: 'Created new assessment: Trigonometric Identities Quiz (MATH-101)',
    subjectId: 'sub-math',
    subjectName: 'Algebra & Trigonometry',
    timestamp: '2026-07-22 16:30'
  },
  {
    id: 'log-3',
    teacherId: 'usr-admin',
    teacherName: 'Dr. Elizabeth Vance',
    action: 'verified_marks',
    details: 'Verified and approved marks for World History Comparative Essay (HIST-105)',
    subjectId: 'sub-hist',
    subjectName: 'World History',
    timestamp: '2026-07-22 14:00'
  },
  {
    id: 'log-4',
    teacherId: 'usr-hum',
    teacherName: 'Ms. Amanda Roberts',
    action: 'updated_rubric',
    details: 'Designed 4-criterion essay rubric for English Literature Shakespeare Essay',
    subjectId: 'sub-eng',
    subjectName: 'English Literature',
    timestamp: '2026-07-21 11:15'
  }
];

export const DEFAULT_GRADE_SCALES: GradeScale[] = [
  { letter: 'A+', minPercentage: 90, maxPercentage: 100, gpaPoint: 4.0, badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { letter: 'A',  minPercentage: 80, maxPercentage: 89.9, gpaPoint: 3.7, badgeColor: 'bg-green-100 text-green-800 border-green-300' },
  { letter: 'B+', minPercentage: 75, maxPercentage: 79.9, gpaPoint: 3.3, badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' },
  { letter: 'B',  minPercentage: 70, maxPercentage: 74.9, gpaPoint: 3.0, badgeColor: 'bg-sky-100 text-sky-800 border-sky-300' },
  { letter: 'C+', minPercentage: 65, maxPercentage: 69.9, gpaPoint: 2.7, badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  { letter: 'C',  minPercentage: 60, maxPercentage: 64.9, gpaPoint: 2.0, badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { letter: 'D',  minPercentage: 50, maxPercentage: 59.9, gpaPoint: 1.0, badgeColor: 'bg-orange-100 text-orange-800 border-orange-300' },
  { letter: 'F',  minPercentage: 0,  maxPercentage: 49.9, gpaPoint: 0.0, badgeColor: 'bg-rose-100 text-rose-800 border-rose-300' },
];

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'class-10a',
    name: 'Grade 10-A',
    gradeLevel: 'Grade 10',
    academicYear: '2025-2026',
    teacherName: 'Dr. Sarah Jenkins',
    studentIds: ['stu-1', 'stu-2', 'stu-3', 'stu-4', 'stu-5'],
    subjectIds: ['sub-math', 'sub-eng', 'sub-hist']
  },
  {
    id: 'class-10b',
    name: 'Grade 10-B',
    gradeLevel: 'Grade 10',
    academicYear: '2025-2026',
    teacherName: 'Prof. Robert Thorne',
    studentIds: ['stu-6', 'stu-7', 'stu-8', 'stu-9'],
    subjectIds: ['sub-math', 'sub-eng', 'sub-hist']
  },
  {
    id: 'class-11stem',
    name: 'Grade 11-STEM',
    gradeLevel: 'Grade 11',
    academicYear: '2025-2026',
    teacherName: 'Dr. Alan Turing',
    studentIds: ['stu-10', 'stu-11', 'stu-12', 'stu-13'],
    subjectIds: ['sub-phys', 'sub-chem', 'sub-math']
  },
  {
    id: 'class-12adv',
    name: 'Grade 12-ADV',
    gradeLevel: 'Grade 12',
    academicYear: '2025-2026',
    teacherName: 'Elena Rostova',
    studentIds: ['stu-14', 'stu-15', 'stu-16'],
    subjectIds: ['sub-cs', 'sub-phys', 'sub-chem']
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-math',
    code: 'MATH-101',
    name: 'Algebra & Trigonometry',
    department: 'Mathematics',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'sub-phys',
    code: 'PHYS-201',
    name: 'General Physics',
    department: 'Natural Sciences',
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    id: 'sub-chem',
    code: 'CHEM-202',
    name: 'Organic Chemistry',
    department: 'Natural Sciences',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'sub-eng',
    code: 'ENG-102',
    name: 'English Literature & Composition',
    department: 'Humanities',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'sub-cs',
    code: 'CS-301',
    name: 'Computer Science & Data Structures',
    department: 'Technology',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    id: 'sub-hist',
    code: 'HIST-105',
    name: 'World History & Civics',
    department: 'Social Studies',
    color: 'bg-rose-50 text-rose-700 border-rose-200'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    studentIdNumber: 'STU-2025-001',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.m@oakridge.edu',
    classId: 'class-10a',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    guardianName: 'Maria Martinez',
    guardianContact: '+1 (555) 234-5678'
  },
  {
    id: 'stu-2',
    studentIdNumber: 'STU-2025-002',
    firstName: 'Ethan',
    lastName: 'Chen',
    email: 'ethan.c@oakridge.edu',
    classId: 'class-10a',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    guardianName: 'David Chen',
    guardianContact: '+1 (555) 345-6789'
  },
  {
    id: 'stu-3',
    studentIdNumber: 'STU-2025-003',
    firstName: 'Maya',
    lastName: 'Patel',
    email: 'maya.p@oakridge.edu',
    classId: 'class-10a',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    guardianName: 'Rajesh Patel',
    guardianContact: '+1 (555) 456-7890'
  },
  {
    id: 'stu-4',
    studentIdNumber: 'STU-2025-004',
    firstName: 'Liam',
    lastName: 'Johnson',
    email: 'liam.j@oakridge.edu',
    classId: 'class-10a',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    guardianName: 'Sarah Johnson',
    guardianContact: '+1 (555) 567-8901'
  },
  {
    id: 'stu-5',
    studentIdNumber: 'STU-2025-005',
    firstName: 'Ava',
    lastName: 'Williams',
    email: 'ava.w@oakridge.edu',
    classId: 'class-10a',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    guardianName: 'Robert Williams',
    guardianContact: '+1 (555) 678-9012'
  },
  {
    id: 'stu-6',
    studentIdNumber: 'STU-2025-006',
    firstName: 'Noah',
    lastName: 'Garcia',
    email: 'noah.g@oakridge.edu',
    classId: 'class-10b',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    guardianName: 'Carlos Garcia',
    guardianContact: '+1 (555) 789-0123'
  },
  {
    id: 'stu-7',
    studentIdNumber: 'STU-2025-007',
    firstName: 'Isabella',
    lastName: 'Kim',
    email: 'isabella.k@oakridge.edu',
    classId: 'class-10b',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    guardianName: 'Min-Soo Kim',
    guardianContact: '+1 (555) 890-1234'
  },
  {
    id: 'stu-8',
    studentIdNumber: 'STU-2025-008',
    firstName: 'Jackson',
    lastName: 'Davis',
    email: 'jackson.d@oakridge.edu',
    classId: 'class-10b',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    guardianName: 'Laura Davis',
    guardianContact: '+1 (555) 901-2345'
  },
  {
    id: 'stu-9',
    studentIdNumber: 'STU-2025-009',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    email: 'emma.r@oakridge.edu',
    classId: 'class-10b',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    guardianName: 'Luis Rodriguez',
    guardianContact: '+1 (555) 012-3456'
  },
  {
    id: 'stu-10',
    studentIdNumber: 'STU-2025-010',
    firstName: 'Lucas',
    lastName: 'Miller',
    email: 'lucas.m@oakridge.edu',
    classId: 'class-11stem',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    guardianName: 'Karen Miller',
    guardianContact: '+1 (555) 123-4567'
  },
  {
    id: 'stu-11',
    studentIdNumber: 'STU-2025-011',
    firstName: 'Chloe',
    lastName: 'Taylor',
    email: 'chloe.t@oakridge.edu',
    classId: 'class-11stem',
    avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150',
    guardianName: 'Mark Taylor',
    guardianContact: '+1 (555) 234-5679'
  },
  {
    id: 'stu-12',
    studentIdNumber: 'STU-2025-012',
    firstName: 'Benjamin',
    lastName: 'Anderson',
    email: 'benjamin.a@oakridge.edu',
    classId: 'class-11stem',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    guardianName: 'Paul Anderson',
    guardianContact: '+1 (555) 345-6780'
  },
  {
    id: 'stu-13',
    studentIdNumber: 'STU-2025-013',
    firstName: 'Harper',
    lastName: 'Thomas',
    email: 'harper.t@oakridge.edu',
    classId: 'class-11stem',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    guardianName: 'Rachel Thomas',
    guardianContact: '+1 (555) 456-7891'
  },
  {
    id: 'stu-14',
    studentIdNumber: 'STU-2025-014',
    firstName: 'Alexander',
    lastName: 'Jackson',
    email: 'alex.j@oakridge.edu',
    classId: 'class-12adv',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    guardianName: 'Thomas Jackson',
    guardianContact: '+1 (555) 567-8902'
  },
  {
    id: 'stu-15',
    studentIdNumber: 'STU-2025-015',
    firstName: 'Evelyn',
    lastName: 'White',
    email: 'evelyn.w@oakridge.edu',
    classId: 'class-12adv',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    guardianName: 'Claire White',
    guardianContact: '+1 (555) 678-9013'
  },
  {
    id: 'stu-16',
    studentIdNumber: 'STU-2025-016',
    firstName: 'Daniel',
    lastName: 'Harris',
    email: 'daniel.h@oakridge.edu',
    classId: 'class-12adv',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    guardianName: 'James Harris',
    guardianContact: '+1 (555) 789-0124'
  }
];

export const INITIAL_RUBRICS: Rubric[] = [
  {
    id: 'rubric-lab-1',
    title: 'Scientific Lab Experiment Rubric',
    subjectId: 'sub-phys',
    description: 'Standard evaluation scale for experimental setup, data precision, and evidence-based conclusion.',
    createdAt: '2025-09-01',
    criteria: [
      {
        id: 'crit-hyp',
        title: 'Hypothesis & Theoretical Setup',
        description: 'Clear statement of testable hypothesis and background theory.',
        weight: 20,
        levels: [
          { levelIndex: 4, levelName: 'Exemplary', points: 20, description: 'Hypothesis is razor sharp, grounded in physics laws with quantitative prediction.' },
          { levelIndex: 3, levelName: 'Proficient', points: 15, description: 'Clear hypothesis with reasonable theoretical rationale.' },
          { levelIndex: 2, levelName: 'Developing', points: 10, description: 'Hypothesis stated but lacks clear physical rationale.' },
          { levelIndex: 1, levelName: 'Novice', points: 5, description: 'Missing hypothesis or unrelated to experiment.' }
        ]
      },
      {
        id: 'crit-data',
        title: 'Data Collection & Measurement Precision',
        description: 'Accuracy of tables, uncertainty handling, and graph formatting.',
        weight: 30,
        levels: [
          { levelIndex: 4, levelName: 'Exemplary', points: 30, description: 'Flawless SI units, error bars included, clean structured tables.' },
          { levelIndex: 3, levelName: 'Proficient', points: 23, description: 'Complete data table with minor unit or precision formatting slips.' },
          { levelIndex: 2, levelName: 'Developing', points: 15, description: 'Data recorded but missing units or trials.' },
          { levelIndex: 1, levelName: 'Novice', points: 8, description: 'Incomplete or unorganized raw data.' }
        ]
      },
      {
        id: 'crit-calc',
        title: 'Mathematical Analysis & Error Discussion',
        description: 'Formulas used, percentage error calculation, and source of discrepancies.',
        weight: 30,
        levels: [
          { levelIndex: 4, levelName: 'Exemplary', points: 30, description: 'All steps shown, percentage error calculated, deep systematic error analysis.' },
          { levelIndex: 3, levelName: 'Proficient', points: 23, description: 'Correct calculations with minor error analysis.' },
          { levelIndex: 2, levelName: 'Developing', points: 15, description: 'Calculation errors present, vague error discussion.' },
          { levelIndex: 1, levelName: 'Novice', points: 8, description: 'Incorrect mathematical derivation.' }
        ]
      },
      {
        id: 'crit-conc',
        title: 'Scientific Conclusion & Real-world Link',
        description: 'Synthesis of results back to initial research question.',
        weight: 20,
        levels: [
          { levelIndex: 4, levelName: 'Exemplary', points: 20, description: 'Directly answers research question, relates findings to practical applications.' },
          { levelIndex: 3, levelName: 'Proficient', points: 15, description: 'Valid conclusion supported by experimental data.' },
          { levelIndex: 2, levelName: 'Developing', points: 10, description: 'Conclusion weak or not fully backed by data.' },
          { levelIndex: 1, levelName: 'Novice', points: 5, description: 'No clear conclusion provided.' }
        ]
      }
    ]
  },
  {
    id: 'rubric-essay-1',
    title: 'Literary & Critical Essay Rubric',
    subjectId: 'sub-eng',
    description: 'Holistic grading grid for argument clarity, textual evidence, structure, and academic prose.',
    createdAt: '2025-09-05',
    criteria: [
      {
        id: 'crit-thesis',
        title: 'Thesis & Argumentation',
        description: 'Originality and clarity of central claim.',
        weight: 25,
        levels: [
          { levelIndex: 4, levelName: 'Exemplary', points: 25, description: 'Compelling, nuanced thesis statement that guides the entire essay.' },
          { levelIndex: 3, levelName: 'Proficient', points: 19, description: 'Clear thesis statement with structured body paragraph support.' },
          { levelIndex: 2, levelName: 'Developing', points: 13, description: 'Thesis present but generic or simple plot summary.' },
          { levelIndex: 1, levelName: 'Novice', points: 7, description: 'Unclear or missing central thesis.' }
        ]
      },
      {
        id: 'crit-evidence',
        title: 'Textual Evidence & Citation',
        description: 'Integration of direct quotes and MLA citations.',
        weight: 25,
        levels: [
          { levelIndex: 4, levelName: 'Exemplary', points: 25, description: 'Primary quotes seamlessly woven into analytical context with correct citations.' },
          { levelIndex: 3, levelName: 'Proficient', points: 19, description: 'Good textual quotes supporting main points.' },
          { levelIndex: 2, levelName: 'Developing', points: 13, description: 'Quotes used without sufficient explanation or context.' },
          { levelIndex: 1, levelName: 'Novice', points: 7, description: 'Lack of supporting quotes or textual references.' }
        ]
      },
      {
        id: 'crit-struct',
        title: 'Organization & Transitions',
        description: 'Logical flow, paragraph coherence, and conclusion impact.',
        weight: 25,
        levels: [
          { levelIndex: 4, levelName: 'Exemplary', points: 25, description: 'Smooth transitions between ideas, powerful introductory and closing thoughts.' },
          { levelIndex: 3, levelName: 'Proficient', points: 19, description: 'Logical sequence of body paragraphs with transition phrases.' },
          { levelIndex: 2, levelName: 'Developing', points: 13, description: 'Choppy paragraph order or abrupt ending.' },
          { levelIndex: 1, levelName: 'Novice', points: 7, description: 'Disorganized thoughts with weak structure.' }
        ]
      },
      {
        id: 'crit-prose',
        title: 'Grammar, Style & Vocabulary',
        description: 'Academic tone, varied sentence structure, and mechanics.',
        weight: 25,
        levels: [
          { levelIndex: 4, levelName: 'Exemplary', points: 25, description: 'Rich vocabulary, elegant style, virtually free of mechanical errors.' },
          { levelIndex: 3, levelName: 'Proficient', points: 19, description: 'Formal academic tone with minor grammatical errors.' },
          { levelIndex: 2, levelName: 'Developing', points: 13, description: 'Informal tone or repeated mechanical errors.' },
          { levelIndex: 1, levelName: 'Novice', points: 7, description: 'Frequent grammatical errors impacting readability.' }
        ]
      }
    ]
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm-math-q1',
    title: 'Midterm Quiz: Quadratic Equations & Parabolas',
    code: 'MATH-Q1',
    subjectId: 'sub-math',
    classId: 'class-10a',
    type: 'quiz',
    totalPoints: 50,
    weightPercentage: 15,
    dueDate: '2025-10-15',
    status: 'published',
    instructions: 'Solve all 5 questions. Show full algebraic steps for factoring and quadratic formula derivations.',
    createdAt: '2025-10-01',
    questions: [
      { id: 'q1', text: 'Solve x² - 7x + 12 = 0 by factoring.', questionType: 'problem', points: 10, sampleAnswer: 'x = 3, x = 4' },
      { id: 'q2', text: 'Find the vertex and axis of symmetry for y = 2(x - 3)² + 5.', questionType: 'problem', points: 10, sampleAnswer: 'Vertex (3,5), Axis x=3' },
      { id: 'q3', text: 'Calculate the discriminant of 3x² - 5x + 8 = 0 and state the nature of roots.', questionType: 'problem', points: 10, sampleAnswer: 'Discriminant = -71, two complex roots' },
      { id: 'q4', text: 'A projectile follows the height equation h(t) = -5t² + 20t + 2. Find maximum height.', questionType: 'problem', points: 10, sampleAnswer: 'Max height = 22m at t = 2s' },
      { id: 'q5', text: 'Explain the geometric meaning of a quadratic function having a negative discriminant.', questionType: 'essay', points: 10, sampleAnswer: 'The parabola does not intersect the x-axis.' }
    ]
  },
  {
    id: 'asm-phys-lab1',
    title: 'Practical Lab: Simple Pendulum Acceleration due to Gravity (g)',
    code: 'PHYS-L1',
    subjectId: 'sub-phys',
    classId: 'class-11stem',
    type: 'lab',
    totalPoints: 100,
    weightPercentage: 20,
    dueDate: '2025-10-22',
    status: 'published',
    instructions: 'Perform pendulum oscillations across 5 different lengths (0.2m to 1.0m). Plot T² vs L and calculate g.',
    rubricId: 'rubric-lab-1',
    createdAt: '2025-10-05'
  },
  {
    id: 'asm-eng-essay1',
    title: 'Critical Essay: Ambition & Fate in Macbeth',
    code: 'ENG-E1',
    subjectId: 'sub-eng',
    classId: 'class-10a',
    type: 'assignment',
    totalPoints: 100,
    weightPercentage: 25,
    dueDate: '2025-11-02',
    status: 'published',
    instructions: 'Write a 1200-word analytical essay discussing whether Macbeth was victim of prophecy or architect of his own downfall.',
    rubricId: 'rubric-essay-1',
    createdAt: '2025-10-10'
  },
  {
    id: 'asm-cs-proj1',
    title: 'Term Project: Custom Binary Search Tree & Visualizer',
    code: 'CS-P1',
    subjectId: 'sub-cs',
    classId: 'class-12adv',
    type: 'project',
    totalPoints: 100,
    weightPercentage: 30,
    dueDate: '2025-11-20',
    status: 'grading',
    instructions: 'Implement insertion, deletion, and in-order traversal in TypeScript/JavaScript with animated UI visualization.',
    createdAt: '2025-10-12'
  },
  {
    id: 'asm-chem-exam1',
    title: 'Unit Test: Reaction Rates & Organic Functional Groups',
    code: 'CHEM-T1',
    subjectId: 'sub-chem',
    classId: 'class-11stem',
    type: 'exam',
    totalPoints: 80,
    weightPercentage: 20,
    dueDate: '2025-11-28',
    status: 'scheduled',
    instructions: 'Closed-book examination covering activation energy diagrams, catalysts, and IUPAC nomenclature.',
    createdAt: '2025-10-15'
  }
];

export const INITIAL_GRADES: GradeEntry[] = [
  // Quiz 1 (MATH-101) - Grade 10-A
  {
    id: 'grd-1-1',
    assessmentId: 'asm-math-q1',
    studentId: 'stu-1', // Sophia Martinez
    score: 48,
    percentage: 96,
    letterGrade: 'A+',
    status: 'graded',
    teacherFeedback: 'Outstanding algebraic clarity! Sophia demonstrated complete mastery of factoring quadratic equations and projectile trajectory calculations.',
    strengths: ['Flawless factoring step-by-step', 'Precise discriminant interpretation'],
    areasForImprovement: ['Double-check unit labels on word problems'],
    gradedAt: '2025-10-16'
  },
  {
    id: 'grd-1-2',
    assessmentId: 'asm-math-q1',
    studentId: 'stu-2', // Ethan Chen
    score: 43,
    percentage: 86,
    letterGrade: 'A',
    status: 'graded',
    teacherFeedback: 'Great work Ethan. Strong technical execution with only a small sign mistake in question 3.',
    strengths: ['Quick vertex form conversion', 'Clear handwritten notation'],
    areasForImprovement: ['Watch out for negative signs when expanding (x - h)²'],
    gradedAt: '2025-10-16'
  },
  {
    id: 'grd-1-3',
    assessmentId: 'asm-math-q1',
    studentId: 'stu-3', // Maya Patel
    score: 41,
    percentage: 82,
    letterGrade: 'A',
    status: 'graded',
    teacherFeedback: 'Solid performance across algebraic questions. Make sure to state the units in physics application problems.',
    strengths: ['Factoring technique', 'Good graphing skills'],
    areasForImprovement: ['Detailed sentence answer for conceptual questions'],
    gradedAt: '2025-10-16'
  },
  {
    id: 'grd-1-4',
    assessmentId: 'asm-math-q1',
    studentId: 'stu-4', // Liam Johnson
    score: 34,
    percentage: 68,
    letterGrade: 'C+',
    status: 'graded',
    teacherFeedback: 'Liam understands basic factoring but struggled with vertex completion and complex discriminant rules. Recommended for math clinic session.',
    strengths: ['Simple factoring'],
    areasForImprovement: ['Completing the square method', 'Understanding negative discriminants'],
    gradedAt: '2025-10-16'
  },
  {
    id: 'grd-1-5',
    assessmentId: 'asm-math-q1',
    studentId: 'stu-5', // Ava Williams
    score: 38,
    percentage: 76,
    letterGrade: 'B+',
    status: 'graded',
    teacherFeedback: 'Good effort Ava! Showed solid progress over the practice worksheets.',
    strengths: ['Projectile maximum height solution'],
    areasForImprovement: ['Quad formula arithmetic accuracy'],
    gradedAt: '2025-10-16'
  },

  // Lab Report (PHYS-201) - Grade 11-STEM
  {
    id: 'grd-2-10',
    assessmentId: 'asm-phys-lab1',
    studentId: 'stu-10', // Lucas Miller
    score: 95,
    percentage: 95,
    letterGrade: 'A+',
    status: 'graded',
    rubricScores: {
      'crit-hyp': { criterionId: 'crit-hyp', levelIndex: 4, pointsEarned: 20 },
      'crit-data': { criterionId: 'crit-data', levelIndex: 4, pointsEarned: 30 },
      'crit-calc': { criterionId: 'crit-calc', levelIndex: 4, pointsEarned: 28 },
      'crit-conc': { criterionId: 'crit-conc', levelIndex: 4, pointsEarned: 17 }
    },
    teacherFeedback: 'Incredible lab presentation. Graph of T² vs L yielded g = 9.81 m/s² with under 1.2% experimental uncertainty.',
    strengths: ['Error bar plotting', 'Rigorous systematic error discussion'],
    gradedAt: '2025-10-24'
  },
  {
    id: 'grd-2-11',
    assessmentId: 'asm-phys-lab1',
    studentId: 'stu-11', // Chloe Taylor
    score: 88,
    percentage: 88,
    letterGrade: 'A',
    status: 'graded',
    rubricScores: {
      'crit-hyp': { criterionId: 'crit-hyp', levelIndex: 4, pointsEarned: 20 },
      'crit-data': { criterionId: 'crit-data', levelIndex: 3, pointsEarned: 23 },
      'crit-calc': { criterionId: 'crit-calc', levelIndex: 4, pointsEarned: 30 },
      'crit-conc': { criterionId: 'crit-conc', levelIndex: 3, pointsEarned: 15 }
    },
    teacherFeedback: 'Excellent lab report Chloe! Very clear calculations and hypothesis.',
    strengths: ['Mathematical derivations', 'Clear theoretical setup'],
    gradedAt: '2025-10-24'
  },
  {
    id: 'grd-2-12',
    assessmentId: 'asm-phys-lab1',
    studentId: 'stu-12', // Benjamin Anderson
    score: 72,
    percentage: 72,
    letterGrade: 'B',
    status: 'graded',
    rubricScores: {
      'crit-hyp': { criterionId: 'crit-hyp', levelIndex: 3, pointsEarned: 15 },
      'crit-data': { criterionId: 'crit-data', levelIndex: 2, pointsEarned: 15 },
      'crit-calc': { criterionId: 'crit-calc', levelIndex: 3, pointsEarned: 23 },
      'crit-conc': { criterionId: 'crit-conc', levelIndex: 3, pointsEarned: 19 }
    },
    teacherFeedback: 'Good overall report Benjamin, but raw timing trials had significant human reaction error that affected the slope calculation.',
    strengths: ['Thoughtful conclusion'],
    areasForImprovement: ['Averaging timing trials over 10 periods rather than single oscillations'],
    gradedAt: '2025-10-24'
  },

  // English Essay (ENG-102) - Grade 10-A
  {
    id: 'grd-3-1',
    assessmentId: 'asm-eng-essay1',
    studentId: 'stu-1', // Sophia Martinez
    score: 92,
    percentage: 92,
    letterGrade: 'A+',
    status: 'graded',
    rubricScores: {
      'crit-thesis': { criterionId: 'crit-thesis', levelIndex: 4, pointsEarned: 25 },
      'crit-evidence': { criterionId: 'crit-evidence', levelIndex: 4, pointsEarned: 23 },
      'crit-struct': { criterionId: 'crit-struct', levelIndex: 4, pointsEarned: 24 },
      'crit-prose': { criterionId: 'crit-prose', levelIndex: 4, pointsEarned: 20 }
    },
    teacherFeedback: 'A masterclass in textual analysis. Sophia skillfully unpacked the dagger soliloquy to construct a persuasive argument regarding agency.',
    gradedAt: '2025-11-04'
  },
  {
    id: 'grd-3-2',
    assessmentId: 'asm-eng-essay1',
    studentId: 'stu-2', // Ethan Chen
    score: 84,
    percentage: 84,
    letterGrade: 'A',
    status: 'graded',
    teacherFeedback: 'Strong thesis and smooth evidence integration. Pay close attention to paragraph transition sentences.',
    gradedAt: '2025-11-04'
  }
];
