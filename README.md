# Preptron Frontend

A mock-driven React + TypeScript frontend for the Preptron MCQ prep platform.

## Setup

1. Install dependencies:
   npm install
2. Start the app:
   npm run dev
3. Open the preview in the browser at:
   http://localhost:5173

## Environment

- `VITE_USE_MOCKS=true` enables the local mock API layer.
- To switch to a real API, set this to `false` and wire the services in `src/api`.

## Routes

- `/login`
- `/`
- `/tests`
- `/tests/new`
- `/tests/:testId/take`
- `/tests/:testId/results`
- `/tests/:testId/print`
- `/assistant`
- `/analytics`
- `/profile`
- `/omr`
- `/admin`
- `/admin/students`

## Demo accounts

- Student: ahmed@preptron.pk / password123
- Admin: admin@preptron.pk / password123

## Notes

- The mock API layer is intentionally isolated behind `src/api` and `src/mocks` so it can be swapped for real services later.
- The OMR print layout is prepared with a single config location for the CV service to adapt later.
