export type UserRole = 'student' | 'coaching_admin' | 'content_verifier';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type SourceType = 'past_paper' | 'practice';
export type SourcePool = 'past_paper' | 'practice' | 'both';
export type AttemptMode = 'in_app' | 'omr';
export type OmrStatus = 'queued' | 'processing' | 'done' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  coachingCenterId?: string;
}

export interface Question {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: Difficulty;
  sourceType: SourceType;
  text: string;
  options: string[];
  correctOption: string;
  verified: boolean;
}

export interface TestFilters {
  subject: string;
  chapters: string[];
  topics?: string[];
  difficulty: Difficulty;
  count: number;
  sourcePool: SourcePool;
}

export interface Test {
  id: string;
  title: string;
  filters: TestFilters;
  questionIds: string[];
  durationMinutes: number;
  createdAt: string;
}

export interface Attempt {
  id: string;
  testId: string;
  mode: AttemptMode;
  startedAt: string;
  finishedAt: string;
  score: number;
  total: number;
}

export interface AttemptedQuestion {
  attemptId: string;
  questionId: string;
  selectedOption: string | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface TopicStat {
  subject: string;
  chapter: string;
  topic: string;
  accuracy: number;
  attempted: number;
}

export interface AssistantAnswer {
  id: string;
  question: string;
  answer: string | null;
  citation: { subject: string; chapter: string; topic: string } | null;
  notFound: boolean;
}

export interface OmrJob {
  jobId: string;
  status: OmrStatus;
  attemptId?: string;
  error?: string;
}

export interface CoachingCenter {
  id: string;
  name: string;
  subscriptionTier: string;
  studentCount: number;
}

export interface AuthSession {
  token: string;
  user: User;
}
