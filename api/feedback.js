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
  const [row] = await sql`INSERT INTO feedback (kind, qid, message, contact, page, lang) VALUES (${kind}, ${qid}, ${message}, ${contact}, ${page}, ${lang}) RETURNING id`;
  try { await notify({ id: row.id, kind, qid, message, contact, page, lang }); } catch (e) { console.error('notify', e); }
  res.status(200).json({ ok: true });
}

// 新意见邮件通知：用 Gmail（应用专用密码）发到 FEEDBACK_EMAIL
import nodemailer from 'nodemailer';
const KIND_ZH = { question: '题目有误', site: '网站问题', idea: '建议' };
const LANG_ZH = { zh: '中文', en: '英文', es: '西语' };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
async function notify(f) {
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return;
  const rows = [['类型', KIND_ZH[f.kind]], ['题号', f.qid], ['页面', f.page], ['语言', LANG_ZH[f.lang]], ['联系方式', f.contact]]
    .filter(r => r[1]).map(([k, v]) => `<tr><td style="color:#666;padding:2px 12px 2px 0">${k}</td><td>${esc(v)}</td></tr>`).join('');
  const html = `<p style="white-space:pre-wrap;font-size:15px">${esc(f.message)}</p><table style="font-size:14px">${rows}</table>
    <p><a href="https://cslb.vercel.app/admin/">打开后台处理</a></p>`;
  const reply = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.contact || '') ? f.contact : undefined;
  const tx = nodemailer.createTransport({ service: 'gmail', auth: { user, pass: pass.replace(/\s/g, '') } });
  await tx.sendMail({
    from: `"CSLB 备考" <${user}>`,
    to: process.env.FEEDBACK_EMAIL || user,
    replyTo: reply,
    subject: `[CSLB 备考] 新意见：${KIND_ZH[f.kind]}${f.qid ? ' ' + f.qid : ''} #${f.id}`,
    html,
  });
}
