import type { OmrJob } from '../types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitOmrImage(file: File): Promise<OmrJob> {
  await wait(1000);
  return { jobId: 'job-omr-1', status: 'queued' };
}

export async function pollOmrJob(jobId: string): Promise<OmrJob> {
  await wait(1500);
  const progress = jobId.length % 3;
  if (progress === 0) return { jobId, status: 'processing' };
  if (progress === 1) return { jobId, status: 'done', attemptId: 'attempt-omr-1' };
  return { jobId, status: 'failed', error: 'Corner markers were not detected clearly. Please retake the photo.' };
}
