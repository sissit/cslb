// 页面浏览计数（只记日期和页面，不记任何个人信息）
import { sql, body, PAGES } from './_db.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const page = String(body(req).page || '').replace(/\.html$/, '') || 'index';
  if (!PAGES.includes(page)) return res.status(204).end();
  await sql`INSERT INTO hits (day, page, n) VALUES ((now() AT TIME ZONE 'America/Chicago')::date, ${page}, 1)
            ON CONFLICT (day, page) DO UPDATE SET n = hits.n + 1`;
  res.status(204).end();
}
