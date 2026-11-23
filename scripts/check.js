// node scripts/check.js — validates content/questions.js
const fs=require('fs'),vm=require('vm'),path=require('path');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','content','questions.js'),'utf8'),ctx);
const {QUESTIONS:Q,TOPICS:T}=ctx.window;let bad=0;const ids=new Set();
for(const q of Q){
  const err=m=>{bad++;console.error(q.id+': '+m)};
  if(ids.has(q.id))err('duplicate id');ids.add(q.id);
  if(!T[q.x]||!T[q.x][q.t])err('unknown exam/topic '+q.x+'/'+q.t);
  if(!q.q||!q.z||!q.e||!q.ee)err('missing text');
  if(!Array.isArray(q.o)||q.o.length!==4||q.o.some(o=>o.length!==2||!o[0]||!o[1]))err('options must be 4 [en,zh] pairs');
  if(!(q.a>=0&&q.a<4))err('bad answer index');
  if(new Set(q.o.map(o=>o[0])).size!==4)err('duplicate option');
}
const by={};Q.forEach(q=>{const k=q.x+'/'+q.t;by[k]=(by[k]||0)+1});
console.log(Q.length+' questions',by,'answer spread',[0,1,2,3].map(i=>Q.filter(q=>q.a===i).length));
process.exit(bad?1:0);
