/* CSLB 备考 · shared header, footer, language switch and quiz engine. Code: MIT. */
(function(){
const store={
  get(k,d){try{const v=localStorage.getItem('cslb-'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('cslb-'+k,JSON.stringify(v))}catch(e){}}
};
const lang=/^\/zh\//.test(location.pathname)?'zh':/^\/es\//.test(location.pathname)?'es':'en';store.set('lang',lang);
const EN=lang==='en',ES=lang==='es';
document.documentElement.lang={zh:'zh-CN',en:'en',es:'es'}[lang];
/* Spanish: swap in Spanish translation and explanation */
if(ES&&window.QUESTIONS&&window.QUESTIONS_ES){window.QUESTIONS.forEach(q=>{const e=window.QUESTIONS_ES[q.id];if(!e)return;q.z=e[0];q.o=q.o.map((o,i)=>[o[0],e[1][i]||'']);q.e=e[2]})}

const S={
  zh:{brand:'CSLB 备考',nav:['首页','章节练习','模拟考试','知识点讲义','申请指南'],sw:'EN',swl:'Switch to English',navl:'主导航',
    fb:'提意见',fbTitle:'提意见',fbKind:'类型',fbKinds:[['question','题目有误'],['site','网站问题'],['idea','建议']],fbQ:'题号（选填）',fbMsg:'具体内容',fbPh:'例如：答案应为 C，因为……',fbContact:'联系方式（选填，只用于回复你）',fbSend:'提交',fbCancel:'取消',fbThanks:'已收到，谢谢！我们会尽快核对。',fbErr:'提交失败，请稍后再试。',fbReport:'这题有误？',
    foot1:'本站为独立的备考学习网站，与加州承包商执照委员会（CSLB）无任何关联。题目为根据公开法规原创编写的练习题，不是 CSLB 真题；法规数字以 2026 年为准，正式申请和考试请以 <a href="https://www.cslb.ca.gov">cslb.ca.gov</a> 为准。本站内容不构成法律意见。',
    foot2:'最后更新 2026-11-22 · 代码 MIT · 题库与讲义 CC BY-NC-SA 4.0 · <a href="https://github.com/sissit/cslb">GitHub 源码</a>',
    law:'法律与商务',b:'B 类专业',qn:(i,n)=>`第 ${i} / ${n} 题`,answered:n=>`已答 ${n}`,prev:'上一题',next:'下一题',result:'看成绩',
    right:'答对了',correct:l=>'正确答案：'+l,flag:'标记此题',unflag:'取消标记',submit:'交卷',confirm:n=>`${n?`还有 ${n} 题未作答，`:''}确定交卷吗？`,
    yes:'确定交卷',no:'继续答题',timeup:'时间到',done:'已交卷',yours:'你的成绩',score:(r,n)=>`${r} / ${n} 题答对`,
    pass:'达到约 72% 的参考及格线',fail:'未达约 72% 的参考及格线',
    barnote:'红线为约 72% 的参考及格线（来自公开备考资料，实际以考试通知为准）。答错的题已加入错题本。',
    review:'错题回顾',src:'出处',your:'你的答案：',none:'未作答',right2:'正确：',all:'全部答对。',again:'再来一次',towrong:'去错题本',qlabel:k=>`第 ${k} 题`},
  en:{brand:'CSLB Prep',nav:['Home','Practice','Mock exam','Study notes','License guide'],sw:'中文',swl:'切换到中文',navl:'Main',
    fb:'Feedback',fbTitle:'Send feedback',fbKind:'Type',fbKinds:[['question','Error in a question'],['site','Website problem'],['idea','Suggestion']],fbQ:'Question no. (optional)',fbMsg:'Details',fbPh:'e.g. The answer should be C because…',fbContact:'Email or phone (optional, only to reply to you)',fbSend:'Send',fbCancel:'Cancel',fbThanks:'Received, thank you! We will check it soon.',fbErr:'Could not send. Please try again later.',fbReport:'Report an error',
    foot1:'An independent study site, not affiliated with the California Contractors State License Board (CSLB). Questions are original practice items written from public law, not actual CSLB exam questions; figures are as of 2026. For official applications and exams, rely on <a href="https://www.cslb.ca.gov">cslb.ca.gov</a>. Nothing here is legal advice.',
    foot2:'Last updated 2026-11-22 · Code MIT · Questions and notes CC BY-NC-SA 4.0 · <a href="https://github.com/sissit/cslb">Source on GitHub</a>',
    law:'Law & Business',b:'General Building (B)',qn:(i,n)=>`Question ${i} of ${n}`,answered:n=>`${n} answered`,prev:'Previous',next:'Next',result:'See score',
    right:'Correct',correct:l=>'Answer: '+l,flag:'Flag',unflag:'Unflag',submit:'Submit',confirm:n=>`${n?`${n} unanswered. `:''}Submit the exam?`,
    yes:'Submit',no:'Keep working',timeup:'Time’s up',done:'Submitted',yours:'Your score',score:(r,n)=>`${r} of ${n} correct`,
    pass:'At or above the ~72% reference passing mark',fail:'Below the ~72% reference passing mark',
    barnote:'The red line marks the ~72% reference passing mark (from public prep sources; your exam notice governs). Missed questions were added to your review list.',
    review:'Review missed questions',src:'Source',your:'Your answer: ',none:'blank',right2:'Correct: ',all:'All correct.',again:'Try again',towrong:'Review list',qlabel:k=>`Question ${k}`},
  es:{brand:'CSLB Prep',nav:['Inicio','Práctica','Examen de prueba','Apuntes','Guía de licencia'],navl:'Principal',
    fb:'Sugerencias',fbTitle:'Enviar comentarios',fbKind:'Tipo',fbKinds:[['question','Error en una pregunta'],['site','Problema del sitio'],['idea','Sugerencia']],fbQ:'N.º de pregunta (opcional)',fbMsg:'Detalles',fbPh:'p. ej. La respuesta debe ser C porque…',fbContact:'Correo o teléfono (opcional, solo para responderle)',fbSend:'Enviar',fbCancel:'Cancelar',fbThanks:'¡Recibido, gracias! Lo revisaremos pronto.',fbErr:'No se pudo enviar. Intente más tarde.',fbReport:'Reportar un error',
    foot1:'Sitio de estudio independiente, sin relación con la Junta Estatal de Licencias de Contratistas de California (CSLB). Las preguntas son de práctica, escritas a partir de leyes públicas; no son preguntas reales del examen. Datos vigentes a 2026. Para solicitudes y exámenes oficiales, consulte <a href="https://www.cslb.ca.gov">cslb.ca.gov</a>. Nada aquí es asesoría legal.',
    foot2:'Actualizado 2026-11-22 · Código MIT · Preguntas y apuntes CC BY-NC-SA 4.0 · <a href="https://github.com/sissit/cslb">Código en GitHub</a>',
    law:'Leyes y Negocios',b:'Construcción General (B)',qn:(i,n)=>`Pregunta ${i} de ${n}`,answered:n=>`${n} respondidas`,prev:'Anterior',next:'Siguiente',result:'Ver resultado',
    right:'Correcto',correct:l=>'Respuesta: '+l,flag:'Marcar',unflag:'Desmarcar',submit:'Entregar',confirm:n=>`${n?`${n} sin responder. `:''}¿Entregar el examen?`,
    yes:'Entregar',no:'Seguir',timeup:'Se acabó el tiempo',done:'Entregado',yours:'Su resultado',score:(r,n)=>`${r} de ${n} correctas`,
    pass:'Igual o arriba de la nota de referencia de ~72%',fail:'Abajo de la nota de referencia de ~72%',
    barnote:'La línea roja marca la nota de referencia de ~72% (de fuentes públicas de estudio; manda el aviso de su examen). Las preguntas falladas se guardaron en su lista de repaso.',
    review:'Repaso de preguntas falladas',src:'Fuente',your:'Su respuesta: ',none:'en blanco',right2:'Correcta: ',all:'Todas correctas.',again:'Otra vez',towrong:'Lista de repaso',qlabel:k=>`Pregunta ${k}`}
};
const t=S[lang];
const PAGES=['index.html','practice.html','exam.html','notes.html','guide.html'];
let here=location.pathname.split('/').pop()||'index.html';if(!here.endsWith('.html'))here+='.html';
const section=/^notes-/.test(here)?'notes.html':here;

document.addEventListener('DOMContentLoaded',()=>{
  const h=document.getElementById('top');
  if(h){
    h.innerHTML=`<div class="wrap"><a class="mark" href="./"><i></i><span>${t.brand}</span></a>
      <nav class="nav" aria-label="${t.navl}">${PAGES.map((u,k)=>`<a href="${u==='index.html'?'./':u}"${section===u?' aria-current="page"':''}>${t.nav[k]}</a>`).join('')}</nav>
      <div class="langs" role="group" aria-label="Language">${[['en','EN'],['zh','中文'],['es','ES']].map(([k,n])=>`<button class="lang" data-lang="${k}" aria-pressed="${lang===k}">${n}</button>`).join('')}</div></div>`;
    h.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{const k=b.dataset.lang;if(k===lang)return;track({type:'ev',name:'lang',detail:k});store.set('lang',k);location.href=(k==='en'?'/':'/'+k+'/')+(here==='index.html'?'':here)+(location.hash?location.hash.replace(/-(en|es)$/,'')+(k==='zh'?'':'-'+k):'')});
  }
  for(const c of document.querySelectorAll('.stack td')){let i=0,p=c;while(p=p.previousElementSibling)i+=p.colSpan;const hd=c.closest('table').rows[0].cells[i];c.dataset.l=hd?hd.innerText.trim():''}
  const f=document.getElementById('foot');
  if(f)f.innerHTML=`<div class="wrap"><p>${t.foot1}</p><p>${t.foot2}</p></div>`;
  const tt=document.querySelector(`meta[name=title-${lang}]`);if(lang!=='en'&&tt)document.title=tt.content;
  if(h)feedbackUI();
  if(h)track({ref:document.referrer,nv:newVisitor});
});

/* analytics: random local visitor id (no IP), 30-min sessions, time on page, a few events */
const rid=()=>{const a=new Uint8Array(8);crypto.getRandomValues(a);return Array.from(a,b=>b.toString(16).padStart(2,'0')).join('')};
let vid=store.get('vid',''),newVisitor=false;if(!/^[0-9a-f]{16}$/.test(vid)){vid=rid();newVisitor=true;store.set('vid',vid)}
let ss=store.get('ss',null);if(!ss||!ss.id||Date.now()-ss.t>1800000)ss={id:rid(),t:0};
const pv=rid();
function track(o){if(/^(localhost|127\.)/.test(location.hostname))return;ss.t=Date.now();store.set('ss',ss);
  try{navigator.sendBeacon('/api/hit',JSON.stringify(Object.assign({lang,vid,sid:ss.id,pv,page:section},o)))}catch(e){}}
let shown=document.visibilityState==='visible'?Date.now():0,stay=0;
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){if(shown){stay+=Date.now()-shown;shown=0}track({type:'leave',dur:Math.round(stay/1000)})}else shown=Date.now()});
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="http"]');if(a&&a.hostname!==location.hostname)track({type:'ev',name:'out',detail:(a.hostname.replace(/^www\./,'')+a.pathname).slice(0,200)})});
/* feedback */
function feedbackUI(){
  const b=document.createElement('button');b.type='button';b.className='fbbtn';b.textContent=t.fb;b.onclick=()=>openFeedback();
  document.body.appendChild(b);
  const d=document.createElement('dialog');d.className='fbdlg';d.innerHTML=`<form method="dialog" class="fbform">
    <h2>${t.fbTitle}</h2>
    <label>${t.fbKind}<select name="kind">${t.fbKinds.map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}</select></label>
    <label class="fbqrow">${t.fbQ}<input name="qid" maxlength="4" pattern="[LBlb][0-9]{1,3}" placeholder="L12 / B34"></label>
    <label>${t.fbMsg}<textarea name="message" rows="5" maxlength="2000" required placeholder="${t.fbPh}"></textarea></label>
    <label>${t.fbContact}<input name="contact" maxlength="120" autocomplete="email"></label>
    <input name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
    <p class="fbmsg" role="status"></p>
    <div class="qnav"><button class="btn" value="cancel" formnovalidate>${t.fbCancel}</button><button class="btn pri" id="fbsend" value="send">${t.fbSend}</button></div></form>`;
  document.body.appendChild(d);
  const f=d.querySelector('form'),m=d.querySelector('.fbmsg'),qr=d.querySelector('.fbqrow');
  f.onsubmit=async e=>{
    if(e.submitter&&e.submitter.value==='cancel')return;
    e.preventDefault();const btn=d.querySelector('#fbsend');btn.disabled=true;m.textContent='';
    try{const r=await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:f.kind.value,qid:f.qid.value.trim().toUpperCase(),message:f.message.value,contact:f.contact.value,website:f.website.value,page:location.pathname,lang})});
      if(!r.ok)throw 0;track({type:'ev',name:'feedback',detail:f.kind.value+(f.qid.value.trim()?' '+f.qid.value.trim().toUpperCase():'')});m.textContent=t.fbThanks;f.message.value='';setTimeout(()=>d.close(),1600)}
    catch(_){m.textContent=t.fbErr}finally{btn.disabled=false}
  };
  document.addEventListener('click',e=>{const q=e.target.closest('[data-fb]');if(q)openFeedback(q.dataset.fb)});
}
function openFeedback(qid){
  const d=document.querySelector('.fbdlg');if(!d)return;const f=d.querySelector('form');
  f.kind.value=qid?'question':'idea';f.qid.value=qid||'';d.querySelector('.fbmsg').textContent='';
  d.showModal();(qid?f.message:f.kind).focus();
}

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const L='ABCD';
const topicName=q=>((EN?window.TOPICS_EN:ES?window.TOPICS_ES:window.TOPICS)[q.x]||{})[q.t]||'';
const examName=x=>x==='law'?t.law:t.b;
const expl=q=>EN?q.ee:q.e;
const srcHTML=q=>`<span class="src">${q.s?`${t.src}${lang==='zh'?'：':': '}<a href="${esc(q.s[1])}" target="_blank" rel="noopener">${esc(q.s[0])}</a> · `:''}<button type="button" class="fbq" data-fb="${esc(q.id)}">${t.fbReport}</button></span>`;
function shuffle(a){a=a.slice();for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a}
/* shuffle answer choices so the correct letter varies */
function mix(list){return list.map(q=>{const idx=shuffle([0,1,2,3]);return Object.assign({},q,{o:idx.map(i=>q.o[i]),a:idx.indexOf(q.a)})})}
function wrongSet(){return new Set(store.get('wrong',[]))}
function markWrong(id,isWrong){const s=wrongSet();isWrong?s.add(id):s.delete(id);store.set('wrong',[...s])}

/* Chinese-translation toggle: any checkbox with data-zh */
function bindZh(){
  const on=store.get('zh',true);
  document.body.classList.toggle('hide-zh',!on);
  document.querySelectorAll('input[data-zh]').forEach(c=>{c.checked=on;c.onchange=()=>{store.set('zh',c.checked);document.body.classList.toggle('hide-zh',!c.checked)}});
}

function optsHTML(x,picked,reveal){
  return `<ol class="opts">${x.o.map((o,k)=>{let c='opt';
    if(reveal){if(k===x.a)c+=' right';else if(k===picked)c+=' wrong'}else if(k===picked)c+=' pick';
    return `<li><button class="${c}" data-k="${k}" ${reveal?'disabled':''}><span class="bub">${L[k]}</span><span>${esc(o[0])}${o[1]?`<span class="ozh">${esc(o[1])}</span>`:''}</span></button></li>`}).join('')}</ol>`;
}

function results(el,list,ans,again){
  const right=list.filter((x,k)=>ans[k]===x.a).length,n=list.length,pct=Math.round(right/n*100);
  const groups={};list.forEach((x,k)=>{const g=examName(x.x)+' · '+topicName(x);(groups[g]=groups[g]||{r:0,n:0}).n++;if(ans[k]===x.a)groups[g].r++});
  const wrong=list.map((x,k)=>({x,k})).filter(o=>ans[o.k]!==o.x.a);
  el.innerHTML=`<div class="qcard"><p class="small" style="margin:0">${t.yours}</p><p class="score">${pct}%</p>
  <p class="verdict">${t.score(right,n)} · ${pct>=72?t.pass:t.fail}</p>
  <div class="bars">${Object.entries(groups).map(([g,o])=>{const p=Math.round(o.r/o.n*100);return `<div class="bar"><div class="lab"><span>${g}</span><span>${o.r}/${o.n} · ${p}%</span></div><div class="meter" aria-hidden="true"><i style="width:${p}%"></i><b style="left:72%"></b></div></div>`}).join('')}</div>
  <p class="small">${t.barnote}</p>
  ${wrong.length?`<h2>${t.review}</h2>${wrong.map(o=>`<div class="rv"><p><b>${esc(o.x.q)}</b></p><p class="zh" style="margin:0">${esc(o.x.z)}</p><p>${t.your}${ans[o.k]===null?t.none:L[ans[o.k]]} · ${t.right2}${L[o.x.a]}. ${esc(o.x.o[o.x.a][0])}<span class="ozh">${esc(o.x.o[o.x.a][1])}</span></p><p class="small" style="margin:0">${esc(expl(o.x))} ${srcHTML(o.x)}</p></div>`).join('')}`:`<p>${t.all}</p>`}
  <div class="qnav"><button class="btn pri" id="again">${t.again}</button><a class="btn" href="practice.html#wrong">${t.towrong}</a></div></div>`;
  document.getElementById('again').onclick=again;
  window.scrollTo({top:0});
}

/* practice: instant feedback */
function practice(el,list,onEmpty){
  list=mix(list);
  const pg=document.getElementById('pg');
  if(!list.length){el.innerHTML=onEmpty;if(pg)pg.style.width='0';return}
  track({type:'ev',name:'practice_start',n:list.length,detail:(()=>{const xs=[...new Set(list.map(x=>x.x))],ts=[...new Set(list.map(x=>x.t))];return (location.hash==='#wrong'?'wrong ':'')+xs.join('+')+(ts.length===1?':'+ts[0]:'')})()});
  let i=0;const ans=new Array(list.length).fill(null);
  const show=()=>{
    const x=list[i],p=ans[i],done=p!==null;
    if(pg)pg.style.width=(ans.filter(v=>v!==null).length/list.length*100)+'%';
    el.innerHTML=`<div class="meta"><span>${t.qn(i+1,list.length)}</span><span class="tag">${examName(x.x)} · ${topicName(x)}</span></div>
    <div class="qcard"><p class="q">${esc(x.q)}</p><p class="zh">${esc(x.z)}</p>${optsHTML(x,p,done)}
    ${done?`<div class="exp"><b>${p===x.a?t.right:t.correct(L[x.a])}</b>${esc(expl(x))}${srcHTML(x)}</div>`:''}
    <div class="qnav"><button class="btn" id="prev" ${i===0?'disabled':''}>${t.prev}</button><button class="btn pri" id="next" ${done?'':'disabled'}>${i===list.length-1?t.result:t.next}</button></div></div>`;
    el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ans[i]=+b.dataset.k;markWrong(x.id,ans[i]!==x.a);show();document.getElementById('next').focus()});
    document.getElementById('prev').onclick=()=>{i--;show()};
    document.getElementById('next').onclick=()=>{if(i<list.length-1){i++;show()}else{if(pg)pg.style.width='100%';track({type:'ev',name:'practice',n:list.length,score:Math.round(list.filter((x,k)=>ans[k]===x.a).length/list.length*100)});results(el,list,ans,()=>practice(el,list,onEmpty))}};
  };
  show();
}

/* exam: timed, no feedback until submit */
function exam(el,list,minutes,timerEl){
  list=mix(list);
  track({type:'ev',name:'exam_start',detail:store.get('e-paper','law'),n:list.length});
  let i=0,left=minutes*60,tid=null;const ans=new Array(list.length).fill(null),flag=new Set();
  const pg=document.getElementById('pg');
  const fmt=s=>`${Math.floor(s/3600)}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const tick=()=>{left--;timerEl.textContent=fmt(Math.max(left,0));timerEl.classList.toggle('low',left<300);if(left<=0)submit(true)};
  const submit=auto=>{clearInterval(tid);timerEl.textContent=auto?t.timeup:t.done;
    list.forEach((x,k)=>markWrong(x.id,ans[k]!==x.a));if(pg)pg.style.width='100%';
    track({type:'exam',page:'exam',paper:store.get('e-paper','law'),score:Math.round(list.filter((x,k)=>ans[k]===x.a).length/list.length*100),n:list.length});
    results(el,list,ans,()=>exam(el,shuffle(list),minutes,timerEl))};
  const show=()=>{
    const x=list[i],nA=ans.filter(v=>v!==null).length;
    if(pg)pg.style.width=(nA/list.length*100)+'%';
    el.innerHTML=`<div class="meta"><span>${t.qn(i+1,list.length)} · ${t.answered(nA)}</span><span class="tag">${examName(x.x)}</span></div>
    <div class="qcard"><p class="q">${esc(x.q)}</p><p class="zh">${esc(x.z)}</p>${optsHTML(x,ans[i],false)}
    <div class="qnav"><div class="row"><button class="btn" id="prev" ${i===0?'disabled':''}>${t.prev}</button><button class="btn" id="flag">${flag.has(i)?t.unflag:t.flag}</button></div>
    <div class="row">${i<list.length-1?`<button class="btn pri" id="next">${t.next}</button>`:''}<button class="btn${i===list.length-1?' pri':''}" id="sub">${t.submit}</button></div></div>
    <div class="pal">${list.map((_,k)=>`<button data-k="${k}" class="${ans[k]!==null?'done':''}${k===i?' cur':''}${flag.has(k)?' flag':''}" aria-label="${t.qlabel(k+1)}">${k+1}</button>`).join('')}</div>
    <div id="confirm"></div></div>`;
    el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ans[i]=+b.dataset.k;show()});
    el.querySelectorAll('.pal button').forEach(b=>b.onclick=()=>{i=+b.dataset.k;show()});
    document.getElementById('prev').onclick=()=>{i--;show()};
    const nx=document.getElementById('next');if(nx)nx.onclick=()=>{i++;show()};
    document.getElementById('flag').onclick=()=>{flag.has(i)?flag.delete(i):flag.add(i);show()};
    document.getElementById('sub').onclick=()=>{
      const un=ans.filter(v=>v===null).length;
      document.getElementById('confirm').innerHTML=`<div class="exp"><b>${t.confirm(un)}</b><div class="row" style="margin-top:8px"><button class="btn pri" id="yes">${t.yes}</button><button class="btn" id="no">${t.no}</button></div></div>`;
      document.getElementById('yes').onclick=()=>submit(false);document.getElementById('no').onclick=show;
    };
  };
  clearInterval(tid);timerEl.textContent=fmt(left);tid=setInterval(tick,1000);show();
}

window.CSLB={openFeedback,store,esc,shuffle,wrongSet,practice,exam,bindZh,examName,topicName,EN,ES,lang};
})();
