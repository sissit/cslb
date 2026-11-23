// 后台：查看和处理意见、浏览统计。密码存在 Vercel 环境变量 ADMIN_PASSWORD 里。
import { timingSafeEqual, createHash } from 'node:crypto';
import { sql, body } from './_db.js';
const h = s => createHash('sha256').update(String(s)).digest();
const ok = pw => !!process.env.ADMIN_PASSWORD && timingSafeEqual(h(pw), h(process.env.ADMIN_PASSWORD));
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!ok(req.headers['x-admin-password'] || '')) {
    await new Promise(r => setTimeout(r, 800));
    return res.status(401).json({ error: 'auth' });
  }
  if (req.method === 'GET') {
    const feedback = await sql`SELECT * FROM feedback ORDER BY created_at DESC LIMIT 1000`;
    const days = await sql`SELECT to_char(day,'YYYY-MM-DD') AS day, sum(n)::int AS n FROM hits WHERE day > (now() AT TIME ZONE 'America/Chicago')::date - 30 GROUP BY day ORDER BY day`;
    const pages = await sql`SELECT page, sum(n)::int AS n FROM hits GROUP BY page ORDER BY n DESC`;
    const [tot] = await sql`SELECT coalesce(sum(n),0)::int AS total,
      coalesce(sum(n) FILTER (WHERE day = (now() AT TIME ZONE 'America/Chicago')::date),0)::int AS today,
      coalesce(sum(n) FILTER (WHERE day > (now() AT TIME ZONE 'America/Chicago')::date - 7),0)::int AS week FROM hits`;
    return res.status(200).json({ feedback, days, pages, ...tot });
  }
  if (req.method === 'POST') {
    const b = body(req), id = parseInt(b.id, 10);
    if (!id) return res.status(400).json({ error: 'id' });
    if (b.action === 'delete') await sql`DELETE FROM feedback WHERE id = ${id}`;
    else {
      const status = ['new', 'done', 'ignored'].includes(b.status) ? b.status : 'new';
      await sql`UPDATE feedback SET status = ${status}, note = ${String(b.note || '').slice(0, 1000) || null} WHERE id = ${id}`;
    }
    return res.status(200).json({ ok: true });
  }
  res.status(405).end();
}
