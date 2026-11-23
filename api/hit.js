// 访问统计。不存 IP，位置只到城市。
// 访客 ID 是浏览器本地生成的随机数（localStorage），用来区分新访客和回访；清除浏览器数据后会变成新访客。
// 会话 ID：30 分钟无操作算一次新的访问。
import { createHash } from 'node:crypto';
import { sql, body, PAGES } from './_db.js';
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;
const ID = /^[0-9a-f]{16}$/;
const EV = ['lang', 'feedback', 'practice', 'practice_start', 'exam_start', 'out'];
const int = (v, lo, hi) => Math.max(lo, Math.min(hi, parseInt(v, 10) || 0));
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const ua = String(req.headers['user-agent'] || '');
  if (BOT.test(ua)) return res.status(204).end();
  const b = body(req);
  const type = ['view', 'exam', 'ev', 'leave'].includes(b.type) ? b.type : 'view';
  const page = String(b.page || '').replace(/\.html$/, '') || 'index';
  if (!PAGES.includes(page)) return res.status(204).end();
  const sid = ID.test(b.sid) ? b.sid : null, pv = ID.test(b.pv) ? b.pv : null;
  const [{ day }] = await sql`SELECT to_char((now() AT TIME ZONE 'America/Chicago')::date,'YYYY-MM-DD') AS day`;
  let vid = ID.test(b.vid) ? b.vid : null;
  if (!vid) {
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    vid = createHash('sha256').update(`${day}|${ip}|${ua}|${process.env.DATABASE_URL}`).digest('hex').slice(0, 16);
  }
  if (type === 'leave') {
    if (pv) await sql`UPDATE events SET dur = ${int(b.dur, 0, 14400)} WHERE pv = ${pv} AND vid = ${vid} AND type = 'view'`;
    return res.status(204).end();
  }
  const lang = ['zh', 'en', 'es'].includes(b.lang) ? b.lang : null;
  const device = /iPad|Tablet/i.test(ua) ? 'tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop';
  const c = req.headers['x-vercel-ip-country'] || '', r = req.headers['x-vercel-ip-country-region'] || '';
  const region = c ? (r ? `${c}-${r}` : c) : null;
  let city = null;
  try { city = decodeURIComponent(req.headers['x-vercel-ip-city'] || '').slice(0, 80) || null; } catch {}
  if (type === 'view') {
    let ref = null;
    try { const h = new URL(b.ref).hostname.replace(/^www\./, ''); ref = /(^|\.)(cslb\.vercel\.app|cslbexam\.org)$/.test(h) ? 'internal' : h.slice(0, 100); } catch {}
    await sql`INSERT INTO hits (day, page, n) VALUES (${day}, ${page}, 1) ON CONFLICT (day, page) DO UPDATE SET n = hits.n + 1`;
    await sql`INSERT INTO events (day, type, page, ref, lang, device, region, city, vid, sid, pv, nv)
      VALUES (${day}, 'view', ${page}, ${ref}, ${lang}, ${device}, ${region}, ${city}, ${vid}, ${sid}, ${pv}, ${b.nv ? true : null})`;
  } else if (type === 'exam') {
    const paper = ['law', 'b', 'all'].includes(b.paper) ? b.paper : null;
    await sql`INSERT INTO events (day, type, page, lang, device, region, city, vid, sid, pv, paper, score, n)
      VALUES (${day}, 'exam', ${page}, ${lang}, ${device}, ${region}, ${city}, ${vid}, ${sid}, ${pv}, ${paper}, ${int(b.score, 0, 100)}, ${int(b.n, 0, 400)})`;
  } else {
    if (!EV.includes(b.name)) return res.status(204).end();
    const score = b.score == null ? null : int(b.score, 0, 100), n = b.n == null ? null : int(b.n, 0, 400);
    await sql`INSERT INTO events (day, type, page, lang, device, region, city, vid, sid, pv, name, detail, score, n)
      VALUES (${day}, 'ev', ${page}, ${lang}, ${device}, ${region}, ${city}, ${vid}, ${sid}, ${pv}, ${b.name}, ${String(b.detail || '').slice(0, 200) || null}, ${score}, ${n})`;
  }
  res.status(204).end();
}
