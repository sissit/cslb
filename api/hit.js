// 访问统计：只记日期、页面、来源网站、语言、设备类型、国家/州、模拟考试成绩。
// 不存 IP；“访客数”用当天 IP+浏览器的不可逆哈希去重，第二天自动换盐，无法跨天追踪。
import { createHash } from 'node:crypto';
import { sql, body, PAGES } from './_db.js';
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const ua = String(req.headers['user-agent'] || '');
  if (BOT.test(ua)) return res.status(204).end();
  const b = body(req);
  const type = b.type === 'exam' ? 'exam' : 'view';
  const page = String(b.page || '').replace(/\.html$/, '') || 'index';
  if (!PAGES.includes(page)) return res.status(204).end();
  const lang = ['zh', 'en', 'es'].includes(b.lang) ? b.lang : null;
  const device = /iPad|Tablet/i.test(ua) ? 'tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop';
  const c = req.headers['x-vercel-ip-country'] || '', r = req.headers['x-vercel-ip-country-region'] || '';
  const region = c ? (r ? `${c}-${r}` : c) : null;
  let ref = null;
  try { const h = new URL(b.ref).hostname.replace(/^www\./, ''); ref = /(^|\.)cslb\.vercel\.app$/.test(h) ? 'internal' : h.slice(0, 100); } catch {}
  const [{ day }] = await sql`SELECT to_char((now() AT TIME ZONE 'America/Chicago')::date,'YYYY-MM-DD') AS day`;
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const vid = createHash('sha256').update(`${day}|${ip}|${ua}|${process.env.DATABASE_URL}`).digest('hex').slice(0, 16);
  if (type === 'view') {
    await sql`INSERT INTO hits (day, page, n) VALUES (${day}, ${page}, 1) ON CONFLICT (day, page) DO UPDATE SET n = hits.n + 1`;
    await sql`INSERT INTO events (day, type, page, ref, lang, device, region, vid) VALUES (${day}, 'view', ${page}, ${ref}, ${lang}, ${device}, ${region}, ${vid})`;
  } else {
    const paper = ['law', 'b', 'all'].includes(b.paper) ? b.paper : null;
    const score = Math.max(0, Math.min(100, parseInt(b.score, 10) || 0)), n = Math.max(0, Math.min(400, parseInt(b.n, 10) || 0));
    await sql`INSERT INTO events (day, type, page, lang, device, region, vid, paper, score, n) VALUES (${day}, 'exam', ${page}, ${lang}, ${device}, ${region}, ${vid}, ${paper}, ${score}, ${n})`;
  }
  res.status(204).end();
}
