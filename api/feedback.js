// 访客提交意见：题目有误 / 网站问题 / 建议
import { sql, body } from './_db.js';
const KINDS = ['question', 'site', 'idea'];
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const b = body(req);
  if (b.website) return res.status(200).json({ ok: true }); // 防机器人的隐藏字段
  const kind = KINDS.includes(b.kind) ? b.kind : 'idea';
  const message = String(b.message || '').trim().slice(0, 2000);
  const qid = /^[LB]\d{1,3}$/.test(b.qid || '') ? b.qid : null;
  const contact = String(b.contact || '').trim().slice(0, 120) || null;
  const page = String(b.page || '').slice(0, 200) || null;
  const lang = ['zh', 'en', 'es'].includes(b.lang) ? b.lang : null;
  if (message.length < 2) return res.status(400).json({ error: 'empty' });
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM feedback WHERE created_at > now() - interval '10 minutes'`;
  if (n > 30) return res.status(429).json({ error: 'busy' });
  await sql`INSERT INTO feedback (kind, qid, message, contact, page, lang) VALUES (${kind}, ${qid}, ${message}, ${contact}, ${page}, ${lang})`;
  res.status(200).json({ ok: true });
}
