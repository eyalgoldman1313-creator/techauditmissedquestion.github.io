import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/itaudit/guide/package.json');
const { marked } = require('marked');
marked.setOptions({ gfm: true, breaks: true });
const cases = JSON.parse(fs.readFileSync('C:/itaudit/practice/src/data/cases.json', 'utf8'));
const byId = Object.fromEntries(cases.map((c) => [c.id, c]));
// [caseId, part labels, session label, question, section, percent note]
const MISSED = [
  ['council-2017-summer-q3', ['נדרש 2'], 'אביב 2017', '3', 'נדרש 2', '4%'],
  ['council-2018-summer-q4', ['סעיף 4'], 'אביב 2018', '4', 'סעיף 4 (טענה 4)', 'לא פוצל — השאלה כולה 6%'],
  ['council-2024-special-q5', ['נדרש 2', 'נדרש 4'], 'מועד מיוחד 2024 (יוני)', '5', 'נדרש 2, נדרש 4', '2% + 4% (השאלה כולה 6% בחלק הרלוונטי)'],
  ['council-2025-summer-q5', ['נדרש 1', 'נדרש 2', 'נדרש 3'], 'אביב 2025', '5', 'נדרש 1, 2, 3 (המיפוי כולל רק את נדרש 4)', '4% + 2% + 4% (השאלה כולה 16%)'],
  ['council-2018-winter-q1', ['נדרש 1 (פריט 5)'], 'חורף 2018', '1', 'פריט 5', 'לא פוצל — השאלה כולה 14%'],
  ['council-2018-winter-q2', ['נדרש 4'], 'חורף 2018', '2', 'נדרש 4', '3%'],
  ['council-2019-winter-q5', ['נדרש 1', 'נדרש 2'], 'חורף 2019', '5', 'נדרש 1, נדרש 2', '3% + 3%'],
  ['council-2019-winter-q7', ['נדרש 6'], 'חורף 2019', '7', 'נדרש 6 (המיפוי כולל את נדרש 1–5)', '2%'],
  ['council-2021-winter-q7', ['נדרש 6'], 'חורף 2021', '7', 'נדרש 6 (המיפוי כולל את נדרש 1–5)', '2%'],
  ['council-2025-winter-q4', ['נדרש 4'], 'חורף 2025', '4', 'נדרש 4', '4%'],
];
const TOPIC = { process: 'תהליך הביקורת', controls: 'בקרות / ITGC', caat: 'כלים ממוחשבים', security: 'אבטחת מידע', sdlc: 'פיתוח מערכות', outsourcing: 'לשכות שירות / ענן', systems: 'מערכות מידע', bcp: 'המשכיות עסקית' };
const md = (s) => marked.parse(s ?? '');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rows = MISSED.map(([id, , ses, q, sec, pct], i) => `<tr><td data-label="#"><b>${i + 1}</b><a class="mo" href="#${id}"> · ${esc(ses)} · שאלה ${q}</a></td><td data-label="מועד"><a href="#${id}">${esc(ses)}</a></td><td data-label="שאלה">${q}</td><td data-label="סעיף">${esc(sec)}</td><td data-label="%">${esc(pct)}</td><td data-label="נושא">${esc(byId[id].parts.filter(p=>MISSED[i][1].includes(p.label)).map(p=>TOPIC[p.topic]??p.topic).filter((v,j,a)=>a.indexOf(v)===j).join(', '))}</td></tr>`).join('');
const body = MISSED.map(([id, labels, ses, q]) => {
  const c = byId[id];
  const parts = c.parts.filter((p) => labels.includes(p.label));
  return `<section class="case" id="${id}">
  <div class="head"><span class="badge">${esc(ses)} · שאלה ${q}</span><h2>${esc(c.title)}</h2><div class="src">${esc(c.source)}</div></div>
  <details open><summary>נתוני השאלה</summary><div class="md">${md(c.background)}</div></details>
  ${parts.map((p) => `<div class="part">
    <div class="ph"><span class="lbl">${esc(p.label)}</span>${p.points ? `<span class="pts">${p.points}%</span>` : ''}<span class="tp">${TOPIC[p.topic] ?? p.topic}</span></div>
    <div class="req"><h3>הנדרש — ${esc(p.label)}</h3><div class="md">${md(p.question)}</div></div>
    <div class="sol"><h3>פתרון רשמי</h3><div class="md">${md(p.solution)}</div></div>
  </div>`).join('')}
</section>`;
}).join('\n');
const css = fs.readFileSync('C:/itaudit/build/mdtable.css','utf8') + fs.readFileSync('C:/itaudit/guide/ref_style.css','utf8') + fs.readFileSync('C:/itaudit/guide/extra.css','utf8') + fs.readFileSync('C:/itaudit/guide/mobile.css','utf8');
const GUIDE='https://eyalgoldman1313-creator.github.io/tech_audit_guide.github.io/', PRAC='https://eyalgoldman1313-creator.github.io/tech_audit_practice.github.io/';
const navDD = MISSED.map(([id,,ses,q])=>`<a href="#${id}"><span class="dd-code">ש׳ ${q}</span>${esc(ses)}</a>`).join('');
const cards = MISSED.map(([id, labels, ses, q, sec, pct]) => {
  const c = byId[id]; const parts = c.parts.filter((p) => labels.includes(p.label));
  return `<article class="standard" id="${id}">
  <div class="standard-header"><span class="standard-code">${esc(ses)} · ש׳ ${q}</span><h3>${esc(c.title)}</h3></div>
  <div class="purpose"><strong>סעיף:</strong> ${esc(sec)} · <strong>משקל:</strong> ${esc(pct)}<br><span class="srcs">${esc(c.source)}</span></div>
  <details class="bg"><summary>📄 נתוני השאלה (לחצו לפתיחה)</summary><div class="summary">${md(c.background)}</div></details>
  ${parts.map((p,i)=>`<div class="section-label">${esc(p.label)}${p.points?` · ${p.points}%`:''} · ${TOPIC[p.topic]??p.topic}</div>
  <div class="req"><h4>הנדרש</h4>${md(p.question)}</div>
  <button class="reveal" onclick="this.nextElementSibling.hidden=false;this.remove()">הצגת הפתרון הרשמי</button>
  <div class="sol" hidden><h4>✓ פתרון רשמי</h4>${md(p.solution)}${p.keyPoints?.length?`<div class="kp"><b>נקודות מפתח לבדיקה עצמית:</b><ul>${p.keyPoints.map(k=>`<li>${esc(k)}</li>`).join('')}</ul></div>`:''}</div>`).join('')}
  <div class="art-foot"><div class="art-actions"><a class="practice-link" href="${PRAC}#/case/${id}" target="_blank" rel="noopener">🗂️ לסימולציה באתר התרגול</a></div></div>
</article>`;}).join('\n');
const mjs = fs.readFileSync('C:/itaudit/guide/mobile.js','utf8');
const sheet = `<details data-ch="qs" open><summary><span class="n" style="background:#D97706">10</span>השאלות<span class="chev">⌄</span></summary><div class="arts">${MISSED.map(([id,,ses,q])=>`<a href="#${id}">${esc(ses)} · שאלה ${q} — ${esc(byId[id].title)}</a>`).join('')}</div></details>`;
const html = `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>שאלות שהמיפוי פספס — ביקורת מערכות מידע</title>
<meta name="description" content="סעיפי מערכות מידע בבחינות המועצה 2015–2025 שאינם במיפוי המרצה — עם הנדרש והפתרון הרשמי.">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;800;900&family=Assistant:wght@400;600;700&display=swap" rel="stylesheet">
<style>${css}
.standard{--accent:#D97706;--accent-soft:#FDF3E3}
details.bg{background:#FAFBFE;border:1px solid var(--hairline);border-radius:16px;padding:4px 18px;margin:14px 0}details.bg summary{cursor:pointer;font-family:Heebo;font-weight:700;padding:10px 0}
.req{background:#EEF0FE;border-inline-start:5px solid #6366F1;border-radius:16px;padding:8px 20px;font-weight:600}.req h4,.sol h4{font-family:Heebo;margin:8px 0 0}.req h4{color:#6366F1}
.ans{width:100%;min-height:120px;margin-top:12px;border:1.5px solid var(--hairline);border-radius:14px;padding:12px 16px;font:inherit;resize:vertical}
.reveal{margin-top:10px;font-family:Heebo;font-weight:700;background:#171E33;color:#fff;border:0;border-radius:999px;padding:10px 22px;cursor:pointer}
.sol{background:#E6F7F0;border-inline-start:5px solid #0E9F6E;border-radius:16px;padding:8px 20px;margin-top:12px}.sol h4{color:#0E9F6E}
.kp{margin-top:12px;padding-top:10px;border-top:1px dashed rgba(0,0,0,.15)}
.sumtbl a{color:#6366F1}
.mo{display:none}
@media (max-width:760px){details.bg{padding:2px 12px}.req,.sol{padding:6px 14px}.reveal{width:100%;padding:13px}.sumtbl td[data-label="מועד"],.sumtbl td[data-label="שאלה"]{display:none}.mo{display:inline}}
</style></head><body><div class="mesh" aria-hidden="true"></div>
<div class="nav-wrap"><nav class="pill" aria-label="ניווט ראשי"><a class="brand" href="#top"><span class="dot"></span>שאלות שהמיפוי פספס</a>
<button class="hamburger" id="hamburger" aria-label="פתיחת תפריט" aria-expanded="false">☰</button>
<div class="nav-links" id="navLinks"><div class="nav-item"><a href="#top">טבלת סיכום</a></div>
<div class="nav-item"><a href="#qs">השאלות</a><div class="dropdown"><div class="dd-head">10 שאלות</div>${navDD}</div></div>
<div class="nav-item"><a class="ext" href="${GUIDE}" target="_blank">📘 מדריך ↗</a></div><div class="nav-item"><a class="ext" href="${PRAC}" target="_blank">📝 תרגול ↗</a></div></div></nav></div>
<header class="hero container" id="top"><span class="eyebrow">בחינות מועצה 2015–2025 · השלמה למיפוי</span>
<h1>שאלות שהמיפוי פספס</h1>
<p class="sub">סעיפים בבחינות המועצה שעוסקים בביקורת מערכות מידע ואינם מופיעים ב״מיפוי שאלות מועצה לפי נושאים״ של המרצה. לכל סעיף: נתוני השאלה, הנדרש, מקום לתשובה שלכם והפתרון הרשמי. אביב = קיץ, חורף = סתיו.</p>
<div class="meta"><span>10 שאלות</span><span>14 סעיפים</span><span>פתרונות רשמיים</span></div>
<div class="tbl-wrap" style="margin-top:34px;text-align:start;--local-accent:#6366F1"><table class="gtable sumtbl"><thead><tr><th>#</th><th>מועד</th><th>שאלה</th><th>סעיף</th><th>%</th><th>נושא</th></tr></thead><tbody>${rows}</tbody></table></div>
</header>
<section class="chapter container" id="qs">${cards}</section>
<footer class="foot"><span class="mark">ביקורת מערכות מידע ממוחשבות בשילוב AI</span>מקור: בחינות מועצת רואי החשבון 2015–2025 והפתרונות הרשמיים.<br><a href="${GUIDE}">מדריך</a> · <a href="${PRAC}">תרגול</a></footer>
<button class="b2t" id="b2t" aria-label="חזרה למעלה">↑</button>
<div class="progress" aria-hidden="true"><i></i></div>
<nav class="mbar" aria-label="ניווט מהיר"><button data-sheet><span class="ic">📋</span>שאלות</button><button data-top><span class="ic">↑</span>סיכום</button><a href="${GUIDE}" target="_blank"><span class="ic">📘</span>מדריך</a><a href="${PRAC}" target="_blank"><span class="ic">📝</span>תרגול</a></nav>
<div class="mscrim"></div><div class="msheet" role="dialog" aria-label="רשימת השאלות"><div class="grab"></div><h4>קפיצה לשאלה</h4>${sheet}</div>
<script>
var h=document.getElementById('hamburger'),n=document.getElementById('navLinks');h.onclick=function(){n.classList.toggle('open')};
document.querySelectorAll('.nav-item>a').forEach(function(a){a.addEventListener('click',function(e){var d=a.nextElementSibling;if(d&&matchMedia('(max-width:1180px)').matches){e.preventDefault();a.parentNode.classList.toggle('open')}})});
document.querySelectorAll('.dropdown a').forEach(function(a){a.onclick=function(){n.classList.remove('open')}});
var b=document.getElementById('b2t');b.onclick=function(){scrollTo({top:0,behavior:'smooth'})};addEventListener('scroll',function(){b.classList.toggle('on',scrollY>600)},{passive:true});
${mjs}
${fs.readFileSync('C:/itaudit/build/mdtable.js','utf8')}
enhanceTables(document);</script></body></html>`;
fs.writeFileSync(process.argv[2], html);
console.log('ok', html.length);
