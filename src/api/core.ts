import type { Attempt, AssistantAnswer, AuthSession, Question, Test, TopicStat, User } from '../types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginMock(email: string, password: string): Promise<AuthSession> {
  await wait(650);
  if (email === 'ahmed@preptron.pk' && password === 'password123') {
    return {
      token: 'mock-token-student',
      user: {
        id: 'u-1',
        name: 'Ahmed Ali',
        email: 'ahmed@preptron.pk',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        role: 'student',
      },
    };
  }
  if (email === 'admin@preptron.pk' && password === 'password123') {
    return {
      token: 'mock-token-admin',
      user: {
        id: 'u-2',
        name: 'Nadia Khan',
        email: 'admin@preptron.pk',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        role: 'coaching_admin',
        coachingCenterId: 'center-1',
      },
    };
  }
  throw new Error('Incorrect credentials');
}

export async function getDashboardData() {
  await wait(700);
  return {
    weakestTopic: { name: 'Electromagnetism', score: 42, subject: 'Physics' },
    overall: { accuracy: 74, change: 8, streak: 12 },
    recentAttempts: [
      { id: 'a-1', title: 'Biology Chapter Practice', subject: 'Biology', dateLabel: '2d ago', accuracy: 82.5 },
      { id: 'a-2', title: 'Chemistry Mixed Drill', subject: 'Chemistry', dateLabel: '4d ago', accuracy: 71 },
      { id: 'a-3', title: 'Physics Revision Sprint', subject: 'Physics', dateLabel: '1w ago', accuracy: 63 },
    ],
  };
}

export async function getStudentAttempts(): Promise<Attempt[]> {
  await wait(600);
  return [
    { id: 'attempt-1', testId: 't-1', mode: 'in_app', startedAt: '2026-09-24T08:00:00Z', finishedAt: '2026-09-24T08:45:00Z', score: 33, total: 40 },
    { id: 'attempt-2', testId: 't-2', mode: 'omr', startedAt: '2026-09-17T07:00:00Z', finishedAt: '2026-09-17T07:28:00Z', score: 29, total: 40 },
    { id: 'attempt-3', testId: 't-3', mode: 'in_app', startedAt: '2026-09-10T05:00:00Z', finishedAt: '2026-09-10T05:43:00Z', score: 26, total: 40 },
  ];
}

export async function getQuestions(): Promise<Question[]> {
  await wait(450);
  return [
    {
      id: 'q-1',
      subject: 'Biology',
      chapter: 'Cell Structure',
      topic: 'Cell organelles',
      difficulty: 'medium',
      sourceType: 'practice',
      text: 'Which organelle is primarily responsible for ATP production?',
      options: ['Golgi apparatus', 'Mitochondria', 'Ribosome', 'Nucleus'],
      correctOption: 'B',
      verified: true,
    },
    {
      id: 'q-2',
      subject: 'Biology',
      chapter: 'Cell Structure',
      topic: 'Cell membrane',
      difficulty: 'easy',
      sourceType: 'past_paper',
      text: 'The plasma membrane is best described as:',
      options: ['Rigid and impermeable', 'Selectively permeable', 'Protein-free', 'Completely solid'],
      correctOption: 'B',
      verified: true,
    },
    {
      id: 'q-3',
      subject: 'Physics',
      chapter: 'Electromagnetism',
      topic: 'Magnetic fields',
      difficulty: 'hard',
      sourceType: 'past_paper',
      text: 'The force on a moving charge in a magnetic field is maximum when the angle between velocity and field is:',
      options: ['0°', '45°', '90°', '180°'],
      correctOption: 'C',
      verified: true,
    },
  ];
}

export async function generateTest(filters: any): Promise<Test> {
  await wait(1800);
  return {
    id: 'test-100',
    title: 'Chemistry Practice',
    filters,
    questionIds: ['q-1', 'q-2', 'q-3'],
    durationMinutes: 25,
    createdAt: new Date().toISOString(),
  };
}

export async function getTestResult(testId: string): Promise<{ accuracy: number; totalCorrect: number; total: number; topicStats: TopicStat[] }> {
  await wait(600);
  return {
    accuracy: 82.5,
    totalCorrect: 33,
    total: 40,
    topicStats: [
      { subject: 'Biology', chapter: 'Cell Structure', topic: 'Cell organelles', accuracy: 60, attempted: 10 },
      { subject: 'Physics', chapter: 'Electromagnetism', topic: 'Magnetic fields', accuracy: 42, attempted: 8 },
      { subject: 'Chemistry', chapter: 'Chemical Bonding', topic: 'Hybridization', accuracy: 85, attempted: 7 },
    ],
  };
}

export async function getAssistantResponse(question: string): Promise<AssistantAnswer> {
  await wait(1200);
  const lower = question.toLowerCase();
  if (lower.includes('electromagnetism') || lower.includes('magnetic')) {
    return {
      id: 'a-1',
      question,
      answer: 'Electromagnetism uses the Lorentz force concept: a moving charge experiences force perpendicular to both its velocity and the magnetic field. The force magnitude is $F = qvB\sin\theta$ and is strongest at 90°.',
      citation: { subject: 'Physics', chapter: 'Electromagnetism', topic: 'Magnetic fields' },
      notFound: false,
    };
  }
  if (lower.includes('cell membrane')) {
    return {
      id: 'a-2',
      question,
      answer: 'The cell membrane is selectively permeable; it allows some substances to pass while restricting others based on polarity and size.',
      citation: { subject: 'Biology', chapter: 'Cell Structure', topic: 'Cell membrane' },
      notFound: false,
    };
  }
  return {
    id: 'a-3',
    question,
    answer: null,
    citation: null,
    notFound: true,
  };
}

export async function getAnalytics(): Promise<{ topicStats: TopicStat[]; trend: number[]; weakest: string[] }> {
  await wait(700);
  return {
    topicStats: [
      { subject: 'Physics', chapter: 'Electromagnetism', topic: 'Magnetic fields', accuracy: 42, attempted: 14 },
      { subject: 'Biology', chapter: 'Genetics', topic: 'Mendelian ratios', accuracy: 58, attempted: 9 },
      { subject: 'Chemistry', chapter: 'Acids and Bases', topic: 'pH calculations', accuracy: 72, attempted: 12 },
    ],
    trend: [65, 72, 82.5],
    weakest: ['Magnetic fields', 'Mendelian ratios'],
  };
}

export async function getAdminOverview(): Promise<{ centerName: string; students: number; cohortStats: TopicStat[]; trend: number[] }> {
  await wait(700);
  return {
    centerName: 'City Scholars Academy',
    students: 15,
    cohortStats: [
      { subject: 'Physics', chapter: 'Electromagnetism', topic: 'Magnetic fields', accuracy: 46, attempted: 80 },
      { subject: 'Biology', chapter: 'Cell Structure', topic: 'Cell membrane', accuracy: 63, attempted: 68 },
      { subject: 'Chemistry', chapter: 'Bonding', topic: 'Hybridization', accuracy: 76, attempted: 66 },
    ],
    trend: [61, 68, 73],
  };
}

export async function getStudentsRoster(): Promise<{ students: User[]; averages: Record<string, number> }> {
  await wait(700);
  const students: User[] = [
    { id: 's-1', name: 'Ahmed Ali', email: 'ahmed@preptron.pk', avatarUrl: '', role: 'student' },
    { id: 's-2', name: 'Fatima Noor', email: 'fatima@preptron.pk', avatarUrl: '', role: 'student' },
    { id: 's-3', name: 'Hamza Qureshi', email: 'hamza@preptron.pk', avatarUrl: '', role: 'student' },
  ];
  return { students, averages: { 's-1': 82.5, 's-2': 71, 's-3': 59 } };
}
