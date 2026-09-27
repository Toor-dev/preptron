import type { AssistantAnswer } from '../types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function askAssistant(question: string): Promise<AssistantAnswer> {
  await wait(1300);

  const q = question.toLowerCase();
  if (q.includes('electro') || q.includes('magnetic')) {
    return {
      id: 'assistant-1',
      question,
      answer: 'Magnetic force is strongest when the particle moves perpendicular to the field: $F = qvB\sin\theta$, so the ideal angle is 90°.',
      citation: { subject: 'Physics', chapter: 'Electromagnetism', topic: 'Magnetic fields' },
      notFound: false,
    };
  }

  if (q.includes('cell membrane')) {
    return {
      id: 'assistant-2',
      question,
      answer: 'The cell membrane is selectively permeable and regulates the movement of materials in and out of the cell.',
      citation: { subject: 'Biology', chapter: 'Cell Structure', topic: 'Cell membrane' },
      notFound: false,
    };
  }

  return {
    id: 'assistant-3',
    question,
    answer: null,
    citation: null,
    notFound: true,
  };
}
