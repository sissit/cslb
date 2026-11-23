import { neon } from '@neondatabase/serverless';
export const sql = neon(process.env.DATABASE_URL);
export function body(req) {
  const b = req.body;
  if (b && typeof b === 'object') return b;
  try { return JSON.parse(b || '{}'); } catch { return {}; }
}
export const PAGES = ['index', 'practice', 'exam', 'notes', 'guide'];
