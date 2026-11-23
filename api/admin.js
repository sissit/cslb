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
    const [tot] = await sql`SELECT coalesce(sum(n),0)::int AS total,
      coalesce(sum(n) FILTER (WHERE day = (now() AT TIME ZONE 'America/Chicago')::date),0)::int AS today,
      coalesce(sum(n) FILTER (WHERE day > (now() AT TIME ZONE 'America/Chicago')::date - 7),0)::int AS week,
      coalesce(sum(n) FILTER (WHERE day > (now() AT TIME ZONE 'America/Chicago')::date - 30),0)::int AS month FROM hits`;
    const [vis] = await sql`SELECT
      count(DISTINCT vid) FILTER (WHERE day = (now() AT TIME ZONE 'America/Chicago')::date)::int AS today,
      count(DISTINCT (day, vid)) FILTER (WHERE day > (now() AT TIME ZONE 'America/Chicago')::date - 7)::int AS week,
      count(DISTINCT (day, vid)) FILTER (WHERE day > (now() AT TIME ZONE 'America/Chicago')::date - 30)::int AS month,
      count(DISTINCT (day, vid))::int AS total FROM events WHERE type = 'view'`;
    const days = await sql`SELECT to_char(h.day,'YYYY-MM-DD') AS day, sum(h.n)::int AS n,
      (SELECT count(DISTINCT vid)::int FROM events e WHERE e.type='view' AND e.day=h.day) AS v
      FROM hits h WHERE h.day > (now() AT TIME ZONE 'America/Chicago')::date - 30 GROUP BY h.day ORDER BY h.day`;
    const W = 30;
    const grp = async col => sql.query(`SELECT coalesce(${col}::text,'') AS k, count(*)::int AS n FROM events
      WHERE type='view' AND day > (now() AT TIME ZONE 'America/Chicago')::date - ${W} GROUP BY 1 ORDER BY 2 DESC LIMIT 15`);
    const [refs, regions, devices, langs, pages] = await Promise.all(['ref', 'region', 'device', 'lang', 'page'].map(grp));
    const hours = await sql`SELECT extract(hour FROM ts AT TIME ZONE 'America/Chicago')::int AS h, count(*)::int AS n FROM events
      WHERE type='view' AND day > (now() AT TIME ZONE 'America/Chicago')::date - 30 GROUP BY 1 ORDER BY 1`;
    const exams = await sql`SELECT coalesce(paper,'') AS paper, count(*)::int AS n, round(avg(score))::int AS avg,
      round(100.0 * count(*) FILTER (WHERE score >= 72) / count(*))::int AS pass FROM events WHERE type='exam' GROUP BY 1 ORDER BY 2 DESC`;
    const allPages = await sql`SELECT page AS k, sum(n)::int AS n FROM hits GROUP BY page ORDER BY n DESC`;
    return res.status(200).json({ feedback, ...tot, visitors: vis, days, refs, regions, devices, langs, pages, allPages, hours, exams });
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
