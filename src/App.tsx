import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Circle,
  FileText,
  Gauge,
  Home,
  LogOut,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  Users,
} from 'lucide-react';
import { setupWorker } from 'msw/browser';
import { handlers } from './mocks/handlers';
import { useAuth, AuthProvider } from './lib/auth';
import type { Attempt, Question, TestFilters, TopicStat, User as AppUser } from './types';

const worker = setupWorker(...handlers);

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/tests', label: 'Tests', icon: FileText },
  { to: '/assistant', label: 'Assistant', icon: MessageSquareText },
  { to: '/profile', label: 'Profile', icon: UserIcon },
];

const adminNav = [
  { to: '/admin', label: 'Overview', icon: BarChart3 },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/profile', label: 'Profile', icon: UserIcon },
];

const topicStats: TopicStat[] = [
  { subject: 'Physics', chapter: 'Electromagnetism', topic: 'Magnetic fields', accuracy: 42, attempted: 18 },
  { subject: 'Biology', chapter: 'Cell Structure', topic: 'Cell organelles', accuracy: 61, attempted: 14 },
  { subject: 'Chemistry', chapter: 'Chemical Bonding', topic: 'Hybridization', accuracy: 83, attempted: 12 },
];

const allQuestions: Question[] = [
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
  {
    id: 'q-3',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding',
    topic: 'Hybridization',
    difficulty: 'medium',
    sourceType: 'practice',
    text: 'Hybridization of carbon in methane is:',
    options: ['sp', 'sp2', 'sp3', 'dsp2'],
    correctOption: 'C',
    verified: true,
  },
  {
    id: 'q-4',
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
];

const recentAttempts = [
  { id: 'attempt-1', title: 'Biology Chapter Practice', subject: 'Biology', dateLabel: '2d ago', accuracy: 82.5 },
  { id: 'attempt-2', title: 'Chemistry Mixed Drill', subject: 'Chemistry', dateLabel: '4d ago', accuracy: 71 },
  { id: 'attempt-3', title: 'Physics Revision Sprint', subject: 'Physics', dateLabel: '1w ago', accuracy: 63 },
];

const scoreTrend = [65, 72, 82.5];

function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
    if (useMocks) {
      worker.start({ onUnhandledRequest: 'bypass' });
    }
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/tests/new" element={<GenerateTestPage />} />
          <Route path="/tests/:testId/take" element={<TakeTestPage />} />
          <Route path="/tests/:testId/results" element={<ResultsPage />} />
          <Route path="/tests/:testId/print" element={<PrintPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/omr" element={<OmrPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<StudentsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

function ProtectedLayout() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  return <AppShell />;
}

function AppShell() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const items = session?.user.role === 'coaching_admin' ? adminNav : navItems;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="no-print hidden min-h-screen w-[260px] border-r border-slate-200 bg-white lg:block">
          <div className="px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">P</div>
              <div>
                <div className="text-lg font-bold text-slate-900">Preptron</div>
              </div>
            </div>
          </div>
          <nav className="space-y-2 px-3">
            {items.map((item) => {
              const Icon = item.icon;
              const current = location.pathname === item.to;
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => navigate(item.to)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${current ? 'bg-sky-100 text-primary' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="no-print border-b border-slate-200 bg-white/70 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 text-slate-900">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 p-2 lg:hidden"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h1 className="text-xl font-bold">{session?.user.role === 'coaching_admin' ? 'Admin Dashboard' : 'Dashboard'}</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden text-right md:block">
                  <div className="text-sm font-semibold text-slate-900">{session?.user.name}</div>
                  <div className="text-xs text-slate-500">{session?.user.email}</div>
                </div>
                <img src={session?.user.avatarUrl || 'https://placehold.co/38x38'} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tests" element={<TestsPage />} />
              <Route path="/tests/new" element={<GenerateTestPage />} />
              <Route path="/tests/:testId/take" element={<TakeTestPage />} />
              <Route path="/tests/:testId/results" element={<ResultsPage />} />
              <Route path="/tests/:testId/print" element={<PrintPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/omr" element={<OmrPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<StudentsPage />} />
            </Routes>
          </div>

          <nav className="no-print fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white px-3 py-2 lg:hidden">
            <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => navigate(item.to)}
                    className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium ${active ? 'bg-primary text-white' : 'text-slate-500'}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </main>
      </div>
    </div>
  );
}

function LoginPage() {
  const { login, session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('ahmed@preptron.pk');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate(session.user.role === 'coaching_admin' ? '/admin' : '/');
    }
  }, [navigate, session]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const next = await login(email, password);
      navigate(next.user.role === 'coaching_admin' ? '/admin' : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">P</div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0" />
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white disabled:opacity-60">
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <div className="mt-5 text-xs text-slate-500">Demo: ahmed@preptron.pk / admin@preptron.pk · password123</div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const firstName = session?.user.name.split(' ')[0] ?? 'Student';

  return (
    <div className="space-y-6 pb-24 lg:pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-bold text-slate-900">Assalam-o-Alaikum {firstName},</div>
          <div className="text-slate-500">Let’s perfect your prep today</div>
        </div>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">MDCAT FOCUS</span>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold">Weakest topic: Electromagnetism</div>
            <div className="mt-1 text-red-700/90">Current score: 42% · Physics</div>
          </div>
          <button onClick={() => navigate('/assistant?topic=Electromagnetism')} className="text-sm font-semibold text-primary underline">Tap to revise concept with AI tutor now</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Overall accuracy</div>
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">+8% w/w</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-4xl font-bold text-slate-900">74%</div>
              <div className="mt-1 text-sm text-slate-500">Daily streak: 12 days</div>
            </div>
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">+8% from last week</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Practice mode</div>
          <div className="space-y-2">
            <button onClick={() => navigate('/tests/new')} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white">Generate Practice Test</button>
            <button onClick={() => navigate('/omr')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">Scan OMR Sheet</button>
            <button onClick={() => navigate('/assistant')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">Ask Assistant</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Attempts</h3>
          <button onClick={() => navigate('/tests')} className="text-sm font-semibold text-primary">View All</button>
        </div>
        <div className="space-y-3">
          {recentAttempts.map((attempt) => (
            <button key={attempt.id} onClick={() => navigate(`/tests/${attempt.id}/results`)} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left">
              <div>
                <div className="font-semibold text-slate-900">{attempt.title}</div>
                <div className="text-xs text-slate-500">{attempt.subject} • {attempt.dateLabel}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{attempt.accuracy}%</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestsPage() {
  const [attempts] = useState<Attempt[]>([
    { id: 'attempt-1', testId: 't-1', mode: 'in_app', startedAt: '2026-09-24T08:00:00Z', finishedAt: '2026-09-24T08:45:00Z', score: 33, total: 40 },
    { id: 'attempt-2', testId: 't-2', mode: 'omr', startedAt: '2026-09-17T07:00:00Z', finishedAt: '2026-09-17T07:28:00Z', score: 29, total: 40 },
  ]);
  const navigate = useNavigate();

  return (
    <div className="space-y-5 pb-24 lg:pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Attempts</h2>
        <button onClick={() => navigate('/tests/new')} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white">Generate Practice Test</button>
      </div>
      <div className="space-y-3">
        {attempts.map((attempt) => (
          <button key={attempt.id} onClick={() => navigate(`/tests/${attempt.testId}/results`)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left">
            <div>
              <div className="font-semibold text-slate-900">Biology Chapter Practice</div>
              <div className="mt-1 text-xs text-slate-500">{attempt.mode === 'in_app' ? 'In-app' : 'OMR'} • {new Date(attempt.finishedAt).toLocaleDateString()}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900">{Math.round((attempt.score / attempt.total) * 100)}%</div>
              <div className="text-xs text-slate-500">{attempt.score}/{attempt.total}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function GenerateTestPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<'prompt' | 'filters'>('prompt');
  const [subject, setSubject] = useState('Biology');
  const [chapters, setChapters] = useState(['Cell Structure']);
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(20);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerated(true);
    const payload: TestFilters = {
      subject,
      chapters,
      difficulty: difficulty.toLowerCase() as TestFilters['difficulty'],
      count,
      sourcePool: 'both',
    };
    localStorage.setItem('preptron-latest-test', JSON.stringify(payload));
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Generate Practice Test</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex rounded-xl bg-slate-100 p-1">
            <button onClick={() => setActive('prompt')} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${active === 'prompt' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}>AI Instant Prompt</button>
            <button onClick={() => setActive('filters')} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${active === 'filters' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}>Manual Filters</button>
          </div>

          {active === 'prompt' ? (
            <div>
              <textarea className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 p-3" defaultValue="25 hard Biology MCQs from chapters 3–5" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <option>Biology</option>
                  <option>Chemistry</option>
                  <option>Physics</option>
                  <option>English</option>
                  <option>Logical Reasoning</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Chapters</label>
                <div className="flex flex-wrap gap-2">
                  {['Cell Structure', 'Genetics', 'Bioenergetics'].map((chapter) => (
                    <button key={chapter} onClick={() => setChapters((prev) => prev.includes(chapter) ? prev.filter((item) => item !== chapter) : [...prev, chapter])} className={`rounded-full border px-3 py-1.5 text-sm ${chapters.includes(chapter) ? 'border-primary bg-sky-100 text-primary' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                      {chapter}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Difficulty</label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard'].map((level) => (
                    <button key={level} onClick={() => setDifficulty(level)} className={`flex-1 rounded-xl border px-3 py-2 text-sm ${difficulty === level ? 'border-primary bg-sky-100 text-primary' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>{level}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Question Count</label>
                <div className="flex gap-2">
                  {[10, 20, 30, 50].map((n) => (
                    <button key={n} onClick={() => setCount(n)} className={`flex-1 rounded-xl border px-3 py-2 text-sm ${count === n ? 'border-primary bg-sky-100 text-primary' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Preview</div>
          <div className="space-y-2 text-sm text-slate-600">
            <div><span className="font-semibold text-slate-900">Target exam:</span> MDCAT</div>
            <div><span className="font-semibold text-slate-900">Duration:</span> 24 minutes</div>
            <div><span className="font-semibold text-slate-900">Summary:</span> {subject} • {chapters.join(', ')} • {difficulty} • {count} questions</div>
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-500"> Scan Filled OMR Answer Sheet </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleGenerate} className="rounded-xl bg-primary px-5 py-3 font-semibold text-white">{generated ? 'Generate Again' : 'Generate Test'}</button>
      </div>

      {generated && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-slate-900">Next steps</div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/tests/test-100/take')} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white">Start in App</button>
            <button onClick={() => navigate('/tests/test-100/print')} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-700">Print for OMR</button>
          </div>
        </div>
      )}
    </div>
  );
}

function TakeTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timer, setTimer] = useState(20 * 60);
  const question = allQuestions[current % allQuestions.length];

  useEffect(() => {
    const id = window.setInterval(() => setTimer((previous) => (previous > 0 ? previous - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const leaveConfirm = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = 'You have unsaved test progress.';
    };
    window.addEventListener('beforeunload', leaveConfirm);
    return () => window.removeEventListener('beforeunload', leaveConfirm);
  }, []);

  const answerQuestion = (option: string) => {
    setAnswers((previous) => ({ ...previous, [question.id]: option }));
  };

  const submitAndAdvance = () => {
    setCurrent((previous) => previous + 1);
  };

  return (
    <div className="space-y-6 pb-28 lg:pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xl font-bold text-slate-900">Biology Chapter Practice</div>
          <div className="text-sm text-slate-500">Question {current + 1} of {allQuestions.length}</div>
        </div>
        <div className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</div>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-primary" style={{ width: `${((current + 1) / allQuestions.length) * 100}%` }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Biology • Cell Structure</div>
          <h3 className="mb-5 text-xl font-bold text-slate-900">{question.text}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const selected = answers[question.id] === option;
              return (
                <button key={option} type="button" onClick={() => answerQuestion(option)} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left ${selected ? 'border-primary bg-sky-50 text-primary' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${selected ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white text-slate-600'}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-medium">{option}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={submitAndAdvance} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white">Submit Answer</button>
            <button onClick={submitAndAdvance} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-700">Skip Question</button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Question Navigator</div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: allQuestions.length }, (_, index) => {
              const filled = Boolean(answers[allQuestions[index].id]);
              const active = index === current;
              return (
                <button key={allQuestions[index].id} onClick={() => setCurrent(index)} className={`flex h-10 items-center justify-center rounded-lg text-sm font-semibold ${active ? 'bg-primary text-white' : filled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-400" /> Answered</div>
            <div className="mt-2 flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary" /> Current</div>
            <div className="mt-2 flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-200" /> Unanswered</div>
          </div>
          <button onClick={() => navigate(`/tests/${testId}/results`)} className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">Finish Test</button>
        </div>
      </div>
    </div>
  );
}

function ResultsPage() {
  const navigate = useNavigate();
  const [stats] = useState({ accuracy: 82.5, totalCorrect: 33, total: 40 });
  const [topicStatsData] = useState<TopicStat[]>(topicStats);

  return (
    <div className="space-y-6 pb-24 lg:pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Score card</div>
            <div className="mt-2 text-4xl font-bold text-slate-900">{stats.accuracy}%</div>
            <div className="text-slate-500">{stats.totalCorrect} / {stats.total} Questions Correct</div>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Passed</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Accuracy by Topic</div>
          <div className="space-y-3">
            {topicStatsData.map((stat) => (
              <div key={`${stat.subject}-${stat.topic}`}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{stat.topic}</span>
                  <span className="font-semibold text-slate-900">{stat.accuracy}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${stat.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Weakest Area</div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900">
            <div className="font-bold">Electromagnetism</div>
            <div className="mt-2 text-sm">42% accuracy · Physics</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => navigate('/assistant?topic=Electromagnetism')} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Ask AI Assistant</button>
              <button onClick={() => navigate('/tests/new')} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700">Revise Topics</button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Score Progression</div>
        <div className="h-40 rounded-xl bg-slate-50 p-3">
          <div className="flex h-full items-end gap-4">
            {scoreTrend.map((score, index) => (
              <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                <div className="w-full rounded-t-lg bg-primary/80" style={{ height: `${score}%` }} />
                <span className="text-xs text-slate-500">{['Test 1','Test 2','Test 3'][index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Per-question review</div>
        <div className="space-y-3">
          {allQuestions.map((question, index) => (
            <div key={question.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-900">Q{index + 1}</span>
                <span className="font-medium text-emerald-600">Correct</span>
              </div>
              <div className="mt-2 text-slate-700">{question.text}</div>
              <div className="mt-2 text-sm text-slate-500">Your answer: B • Correct answer: B • Time spent: 28 sec</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-24 lg:pb-10">
      <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {topicStats.map((item) => (
          <div key={`${item.subject}-${item.topic}`} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.subject}</div>
            <div className="mt-2 text-lg font-bold text-slate-900">{item.topic}</div>
            <div className="mt-3 h-2 rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-primary" style={{ width: `${item.accuracy}%` }} />
            </div>
            <div className="mt-2 text-sm text-slate-600">{item.accuracy}% accuracy</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssistantPage() {
  const [messages, setMessages] = useState([
    { id: 'm1', author: 'assistant', text: 'Ask me about any MDCAT concept and I will answer from verified notes.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const send = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), author: 'user', text: input }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), author: 'assistant', text: 'This concept appears in verified notes: the particle experiences maximum force when it is perpendicular to the field.' }]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-3xl pb-24 lg:pb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Study Assistant</h2>
        <button onClick={() => navigate('/tests/new')} className="text-sm font-semibold text-primary">Revise weak topic</button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`rounded-xl p-3 ${message.author === 'assistant' ? 'bg-slate-100 text-slate-700' : 'bg-primary text-white'}`}>
              {message.text}
            </div>
          ))}
          {loading && <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-500">Generating answer…</div>}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          <button onClick={send} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white">Send</button>
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-xl pb-24 lg:pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <img src={session?.user.avatarUrl || 'https://placehold.co/80x80'} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
          <div>
            <div className="text-2xl font-bold text-slate-900">{session?.user.name}</div>
            <div className="text-sm text-slate-500">{session?.user.email}</div>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Role</span><span className="font-semibold text-slate-900">{session?.user.role}</span></div>
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Coaching center</span><span className="font-semibold text-slate-900">City Scholars Academy</span></div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button onClick={() => navigate('/analytics')} className="rounded-xl bg-primary px-4 py-3 font-semibold text-white">Full Analytics</button>
          <button onClick={logout} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">Log out</button>
        </div>
      </div>
    </div>
  );
}

function OmrPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<'capture' | 'preview' | 'processing' | 'done'>('capture');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (state !== 'processing') return;
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 20, 100);
        if (next >= 100) {
          setState('done');
          clearInterval(interval);
        }
        return next;
      });
    }, 1100);
    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="mx-auto max-w-2xl pb-24 lg:pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-bold text-slate-900">OMR Scan</h2>
        <p className="mt-2 text-sm text-slate-600">Good lighting, flat sheet, and all four corner markers visible.</p>

        {state === 'capture' && (
          <div className="mt-5 space-y-4">
            <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <div className="absolute inset-6 rounded-2xl border-2 border-dashed border-primary/60" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setState('preview')} className="flex-1 rounded-xl bg-primary px-4 py-3 font-semibold text-white">Capture photo</button>
              <label className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-semibold text-slate-700">
                Choose file
                <input type="file" accept="image/*" capture="environment" className="hidden" />
              </label>
            </div>
          </div>
        )}

        {state === 'preview' && (
          <div className="mt-5 space-y-4">
            <div className="h-64 rounded-2xl border border-slate-200 bg-slate-100" />
            <div className="flex gap-3">
              <button onClick={() => setState('capture')} className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">Retake</button>
              <button onClick={() => { setState('processing'); setProgress(15); setError(''); }} className="flex-1 rounded-xl bg-primary px-4 py-3 font-semibold text-white">Submit for Grading</button>
            </div>
          </div>
        )}

        {state === 'processing' && (
          <div className="mt-5 space-y-4">
            <div className="text-sm font-medium text-slate-700">Correcting perspective…</div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-slate-500">Photo is deleted after grading.</div>
          </div>
        )}

        {state === 'done' && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            Grading complete. <button onClick={() => navigate('/tests/attempt-omr-1/results')} className="font-semibold underline">View results</button>
          </div>
        )}

        {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}
      </div>
    </div>
  );
}

function PrintPage() {
  return (
    <div className="space-y-6 pb-24 lg:pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Print OMR Sheet</h2>
        <button onClick={() => window.print()} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white">Print</button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 text-sm text-slate-500">Question pages will be followed by the OMR answer sheet.</div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6 pb-24 lg:pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-slate-900">City Scholars Academy</div>
            <div className="text-sm text-slate-500">Subscription: Premium</div>
          </div>
          <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">15 students</div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Cohort topic-wise performance</div>
          <div className="space-y-3">
            {topicStats.map((stat) => (
              <div key={`${stat.subject}-${stat.topic}`}>
                <div className="flex items-center justify-between text-sm"><span>{stat.topic}</span><span>{stat.accuracy}%</span></div>
                <div className="mt-1 h-2 rounded-full bg-slate-200"><div className="h-full rounded-full bg-primary" style={{ width: `${stat.accuracy}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Cohort score trend</div>
          <div className="flex h-40 items-end gap-4">
            {[62, 69, 74].map((score, index) => (
              <div key={index} className="flex-1">
                <div className="rounded-t-lg bg-primary/80" style={{ height: `${score}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsPage() {
  const students: AppUser[] = [
    { id: 's-1', name: 'Ahmed Ali', email: 'ahmed@preptron.pk', avatarUrl: '', role: 'student' },
    { id: 's-2', name: 'Fatima Noor', email: 'fatima@preptron.pk', avatarUrl: '', role: 'student' },
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Student Roster</h2>
        <button className="rounded-xl bg-primary px-4 py-2 font-semibold text-white">Export CSV</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Tests</th>
              <th className="px-4 py-3">Overall Accuracy</th>
              <th className="px-4 py-3">Weakest Topic</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                <td className="px-4 py-3 text-slate-600">{student.email}</td>
                <td className="px-4 py-3 text-slate-600">8</td>
                <td className="px-4 py-3 text-slate-900">74%</td>
                <td className="px-4 py-3 text-slate-600">Electromagnetism</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
