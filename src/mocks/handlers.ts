import { http, HttpResponse } from 'msw';
import { mockQuestions, mockUsers } from './seed';

const withDelay = async () => new Promise((resolve) => setTimeout(resolve, 700));

export const handlers = [
  http.post('/api/core/login', async ({ request }) => {
    await withDelay();
    const body = await request.json() as { email?: string; password?: string };
    if (body.email === 'ahmed@preptron.pk' && body.password === 'password123') {
      return HttpResponse.json({ token: 'token-student', user: mockUsers[0] }, { status: 200 });
    }
    if (body.email === 'admin@preptron.pk' && body.password === 'password123') {
      return HttpResponse.json({ token: 'token-admin', user: mockUsers[1] }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  http.get('/api/core/questions', async () => {
    await withDelay();
    return HttpResponse.json(mockQuestions);
  }),

  http.get('/api/core/dashboard', async () => {
    await withDelay();
    return HttpResponse.json({
      weakestTopic: { name: 'Electromagnetism', score: 42, subject: 'Physics' },
      overall: { accuracy: 74, change: 8, streak: 12 },
      recentAttempts: [
        { id: 'a-1', title: 'Biology Chapter Practice', subject: 'Biology', dateLabel: '2d ago', accuracy: 82.5 },
        { id: 'a-2', title: 'Chemistry Mixed Drill', subject: 'Chemistry', dateLabel: '4d ago', accuracy: 71 },
        { id: 'a-3', title: 'Physics Revision Sprint', subject: 'Physics', dateLabel: '1w ago', accuracy: 63 },
      ],
    });
  }),

  http.post('/api/core/tests/generate', async ({ request }) => {
    await withDelay();
    const body = await request.json() as { subject?: string };
    return HttpResponse.json({
      id: 'test-100',
      title: `${body.subject ?? 'Chemistry'} Practice`,
      filters: body,
      questionIds: ['q-1', 'q-2', 'q-3'],
      durationMinutes: 25,
      createdAt: new Date().toISOString(),
    });
  }),

  http.get('/api/rag/assistant', async ({ request }) => {
    await withDelay();
    const url = new URL(request.url);
    const question = url.searchParams.get('question') ?? 'Electromagnetism';
    if (question.toLowerCase().includes('electromagnetism')) {
      return HttpResponse.json({
        id: 'assistant-1',
        question,
        answer: 'Magnetic force is strongest when the velocity is perpendicular to the field, giving maximum force at 90°.',
        citation: { subject: 'Physics', chapter: 'Electromagnetism', topic: 'Magnetic fields' },
        notFound: false,
      });
    }
    return HttpResponse.json({
      id: 'assistant-2',
      question,
      answer: null,
      citation: null,
      notFound: true,
    });
  }),

  http.post('/api/omr/upload', async () => {
    await withDelay();
    return HttpResponse.json({ jobId: 'job-123', status: 'queued' });
  }),

  http.get('/api/omr/jobs/:jobId', async () => {
    await withDelay();
    return HttpResponse.json({ jobId: 'job-123', status: 'done', attemptId: 'attempt-omr-1' });
  }),
];
