/* CSLB 备考 · shared header, footer and quiz engine. Code: MIT. */
(function(){
const PAGES=[['index.html','首页'],['practice.html','章节练习'],['exam.html','模拟考试'],['notes.html','知识点讲义'],['guide.html','申请指南']];
const here=(location.pathname.split('/').pop()||'index.html').replace(/^$/,'index.html');
const cur=here.endsWith('.html')?here:(here+'.html');

document.addEventListener('DOMContentLoaded',()=>{
  const h=document.getElementById('top');
  if(h)h.innerHTML=`<div class="wrap"><a class="mark" href="index.html"><i></i><span>CSLB 备考</span></a>
    <nav class="nav" aria-label="主导航">${PAGES.map(([u,t])=>`<a href="${u}"${(cur===u||(cur==='index.html'&&u==='index.html'))?' aria-current="page"':''}>${t}</a>`).join('')}</nav></div>`;
  const f=document.getElementById('foot');
  for(const c of document.querySelectorAll('.stack td')){let i=0,p=c;while(p=p.previousElementSibling)i+=p.colSpan;c.dataset.l=c.closest('table').rows[0].cells[i]?.textContent||''}
  if(f)f.innerHTML=`<div class="wrap"><p>本站为独立的备考学习网站，与加州承包商执照委员会（CSLB）无任何关联。题目为根据公开法规原创编写的练习题，不是 CSLB 真题；法规数字以 2026 年为准，正式申请和考试请以 <a href="https://www.cslb.ca.gov">cslb.ca.gov</a> 为准。本站内容不构成法律意见。</p>
    <p>代码 MIT · 题库与讲义 CC BY-NC-SA 4.0 · <a href="https://github.com/sissit/cslb">GitHub 源码</a></p></div>`;
});

const store={
  get(k,d){try{const v=localStorage.getItem('cslb-'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('cslb-'+k,JSON.stringify(v))}catch(e){}}
};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const L='ABCD';
const topicName=q=>(window.TOPICS[q.x]||{})[q.t]||'';
const examName=x=>x==='law'?'法律与商务':'B 类专业';
function shuffle(a){a=a.slice();for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a}
/* shuffle answer choices so the correct letter varies */
function mix(list){return list.map(q=>{const idx=shuffle([0,1,2,3]);return Object.assign({},q,{o:idx.map(i=>q.o[i]),a:idx.indexOf(q.a)})})}
function wrongSet(){return new Set(store.get('wrong',[]))}
function markWrong(id,isWrong){const s=wrongSet();isWrong?s.add(id):s.delete(id);store.set('wrong',[...s])}

/* zh toggle: any checkbox with data-zh */
function bindZh(){
  const on=store.get('zh',true);
  document.body.classList.toggle('hide-zh',!on);
  document.querySelectorAll('input[data-zh]').forEach(c=>{c.checked=on;c.onchange=()=>{store.set('zh',c.checked);document.body.classList.toggle('hide-zh',!c.checked)}});
}

function optsHTML(x,picked,reveal){
  return `<ol class="opts">${x.o.map((o,k)=>{let c='opt';
    if(reveal){if(k===x.a)c+=' right';else if(k===picked)c+=' wrong'}else if(k===picked)c+=' pick';
    return `<li><button class="${c}" data-k="${k}" ${reveal?'disabled':''}><span class="bub">${L[k]}</span><span>${esc(o[0])}<span class="ozh">${esc(o[1])}</span></span></button></li>`}).join('')}</ol>`;
}

function results(el,list,ans,again){
  const right=list.filter((x,k)=>ans[k]===x.a).length,n=list.length,pct=Math.round(right/n*100);
  const groups={};list.forEach((x,k)=>{const g=examName(x.x)+' · '+topicName(x);(groups[g]=groups[g]||{r:0,n:0}).n++;if(ans[k]===x.a)groups[g].r++});
  const wrong=list.map((x,k)=>({x,k})).filter(o=>ans[o.k]!==o.x.a);
  el.innerHTML=`<div class="qcard"><p class="small" style="margin:0">你的成绩</p><p class="score">${pct}%</p>
  <p class="verdict">${right} / ${n} 题答对 · ${pct>=72?'达到约 72% 的参考及格线':'未达约 72% 的参考及格线'}</p>
  <div class="bars">${Object.entries(groups).map(([g,o])=>{const p=Math.round(o.r/o.n*100);return `<div class="bar"><div class="lab"><span>${g}</span><span>${o.r}/${o.n} · ${p}%</span></div><div class="meter" aria-hidden="true"><i style="width:${p}%"></i><b style="left:72%"></b></div></div>`}).join('')}</div>
  <p class="small">红线为约 72% 的参考及格线（来自公开备考资料，实际以考试通知为准）。答错的题已加入错题本。</p>
  ${wrong.length?`<h2>错题回顾</h2>${wrong.map(o=>`<div class="rv"><p><b>${esc(o.x.q)}</b></p><p class="zh" style="margin:0">${esc(o.x.z)}</p><p>你的答案：${ans[o.k]===null?'未作答':L[ans[o.k]]} · 正确：${L[o.x.a]}. ${esc(o.x.o[o.x.a][0])}<span class="ozh">${esc(o.x.o[o.x.a][1])}</span></p><p class="zh" style="margin:0">${esc(o.x.e)}</p></div>`).join('')}`:'<p>全部答对。</p>'}
  <div class="qnav"><button class="btn pri" id="again">再来一次</button><a class="btn" href="practice.html#wrong">去错题本</a></div></div>`;
  document.getElementById('again').onclick=again;
  window.scrollTo({top:0});
}

/* practice: instant feedback */
function practice(el,list,onEmpty){
  list=mix(list);
  const pg=document.getElementById('pg');
  if(!list.length){el.innerHTML=onEmpty;if(pg)pg.style.width='0';return}
  let i=0;const ans=new Array(list.length).fill(null);
  const show=()=>{
    const x=list[i],p=ans[i],done=p!==null;
    if(pg)pg.style.width=(ans.filter(v=>v!==null).length/list.length*100)+'%';
    el.innerHTML=`<div class="meta"><span>第 ${i+1} / ${list.length} 题</span><span class="tag">${examName(x.x)} · ${topicName(x)}</span></div>
    <div class="qcard"><p class="q">${esc(x.q)}</p><p class="zh">${esc(x.z)}</p>${optsHTML(x,p,done)}
    ${done?`<div class="exp"><b>${p===x.a?'答对了':'正确答案：'+L[x.a]}</b>${esc(x.e)}</div>`:''}
    <div class="qnav"><button class="btn" id="prev" ${i===0?'disabled':''}>上一题</button><button class="btn pri" id="next" ${done?'':'disabled'}>${i===list.length-1?'看成绩':'下一题'}</button></div></div>`;
    el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ans[i]=+b.dataset.k;markWrong(x.id,ans[i]!==x.a);show();document.getElementById('next').focus()});
    document.getElementById('prev').onclick=()=>{i--;show()};
    document.getElementById('next').onclick=()=>{if(i<list.length-1){i++;show()}else{if(pg)pg.style.width='100%';results(el,list,ans,()=>practice(el,list,onEmpty))}};
  };
  show();
}

/* exam: timed, no feedback until submit */
function exam(el,list,minutes,timerEl){
  list=mix(list);
  let i=0,left=minutes*60,tid=null;const ans=new Array(list.length).fill(null),flag=new Set();
  const pg=document.getElementById('pg');
  const fmt=s=>`${Math.floor(s/3600)}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const tick=()=>{left--;timerEl.textContent=fmt(Math.max(left,0));timerEl.classList.toggle('low',left<300);if(left<=0)submit(true)};
  const submit=(auto)=>{clearInterval(tid);timerEl.textContent=auto?'时间到':'已交卷';
    list.forEach((x,k)=>markWrong(x.id,ans[k]!==x.a));if(pg)pg.style.width='100%';
    results(el,list,ans,()=>exam(el,shuffle(list),minutes,timerEl))};
  const show=()=>{
    const x=list[i];
    if(pg)pg.style.width=(ans.filter(v=>v!==null).length/list.length*100)+'%';
    el.innerHTML=`<div class="meta"><span>第 ${i+1} / ${list.length} 题 · 已答 ${ans.filter(v=>v!==null).length}</span><span class="tag">${examName(x.x)}</span></div>
    <div class="qcard"><p class="q">${esc(x.q)}</p><p class="zh">${esc(x.z)}</p>${optsHTML(x,ans[i],false)}
    <div class="qnav"><div class="row"><button class="btn" id="prev" ${i===0?'disabled':''}>上一题</button><button class="btn" id="flag">${flag.has(i)?'取消标记':'标记此题'}</button></div>
    <div class="row">${i<list.length-1?'<button class="btn pri" id="next">下一题</button>':''}<button class="btn${i===list.length-1?' pri':''}" id="sub">交卷</button></div></div>
    <div class="pal" aria-label="题号">${list.map((_,k)=>`<button data-k="${k}" class="${ans[k]!==null?'done':''}${k===i?' cur':''}${flag.has(k)?' flag':''}" aria-label="第 ${k+1} 题">${k+1}</button>`).join('')}</div>
    <div id="confirm"></div></div>`;
    el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ans[i]=+b.dataset.k;show()});
    el.querySelectorAll('.pal button').forEach(b=>b.onclick=()=>{i=+b.dataset.k;show()});
    document.getElementById('prev').onclick=()=>{i--;show()};
    const nx=document.getElementById('next');if(nx)nx.onclick=()=>{i++;show()};
    document.getElementById('flag').onclick=()=>{flag.has(i)?flag.delete(i):flag.add(i);show()};
    document.getElementById('sub').onclick=()=>{
      const un=ans.filter(v=>v===null).length;
      document.getElementById('confirm').innerHTML=`<div class="exp"><b>${un?`还有 ${un} 题未作答，`:''}确定交卷吗？</b><div class="row" style="margin-top:8px"><button class="btn pri" id="yes">确定交卷</button><button class="btn" id="no">继续答题</button></div></div>`;
      document.getElementById('yes').onclick=()=>submit(false);document.getElementById('no').onclick=show;
    };
  };
  clearInterval(tid);timerEl.textContent=fmt(left);tid=setInterval(tick,1000);show();
}

window.CSLB={store,esc,shuffle,wrongSet,practice,exam,bindZh,examName,topicName};
})();
