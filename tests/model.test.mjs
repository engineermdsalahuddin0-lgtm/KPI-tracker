import{test}from'node:test';import assert from'node:assert/strict';import{score,summary,seed}from'../src/lib/model.mjs';
const k={direction:'HIGH',target:100,weight:50,entries:{}};const e={status:'Reported',achievement:80,policy:'Fixed',override:''};
test('HIGH performance and capped score',()=>{assert.equal(score(k,e).performance,80);assert.equal(score(k,{...e,achievement:150}).score,5)});
test('LOW zero and zero-target edge cases',()=>{assert.equal(score({...k,direction:'LOW'},{...e,achievement:0}).score,5);assert.equal(score({...k,direction:'LOW',target:0},{...e,achievement:1}).performance,0);assert.equal(score({...k,target:0},e),null)});
test('Pending / No Input exclusion and coverage',()=>{assert.equal(score(k,{...e,status:'No Input'}),null);assert.equal(score(k,{...e,status:'Pending'}),null);const s=summary([{...k,entries:{'2026-1':e}},{...k,entries:{}}],2026,1);assert.equal(s.coverage,50);assert.equal(s.performance,80)});
test('approved workload and monthly override',()=>{assert.equal(score(k,{...e,policy:'Workload Adjusted',approved:true,eligible:80}).performance,100);assert.equal(score(k,{...e,override:80}).performance,100)});
test('sample departments have 100 percent weights',()=>{const data=seed();for(const dept of new Set(data.map(k=>k.dept)))assert.equal(data.filter(k=>k.dept===dept).reduce((a,k)=>a+k.weight,0),100)});
