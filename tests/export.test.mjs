import {test} from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import {buildDataWorkbook as buildReport} from '../src/features/export/data-export.mjs';
import {seed} from '../src/lib/model.mjs';
const load=async(ks,options)=>{const w=new ExcelJS.Workbook();await w.xlsx.load(await buildReport(null,ks,options));return w;};
test('clean export keeps long field values in their own unmerged columns',async()=>{
  const ks=seed().filter(k=>k.dept==='ERP & IT');
  ks[0].title='দীর্ঘ KPI বিবরণ '.repeat(18); ks[0].kra='KRA only'; ks[0].mo='MO only'; ks[0].requirements='Resources only';
  const w=await load(ks,{year:2026,dept:'ERP & IT',language:'bn'}),s=w.getWorksheet('KPI Report');
  assert.deepEqual(w.worksheets.map(s=>s.name),['KPI Report','Monthly Results','Action Plan']);
  assert.equal(s.getCell('A6').value,ks[0].id); assert.equal(s.getCell('B6').value,'KRA only'); assert.equal(s.getCell('C6').value,'MO only');
  assert.equal(s.getCell('D6').value,ks[0].title); assert.equal(s.getCell('L6').value,'Resources only');
  assert.equal(s.getCell('F6').value,.5); assert.equal(s.getCell('I6').value,.8); assert.equal(s.getCell('J6').value,1);
  assert.ok(s.getCell('D6').alignment.wrapText); assert.ok(s.getRow(6).height>36);
  for(const sheet of w.worksheets) assert.ok(sheet.model.merges.every(range=>Number(range.match(/\d+/)[0])<5));
  assert.equal(w.getWorksheet('Monthly Results').rowCount,29); assert.equal(w.getWorksheet('Action Plan').rowCount,11);
  assert.equal(s.pageSetup.orientation,'landscape'); assert.equal(s.views[0].ySplit,5);
});
test('monthly report preserves zero, overrides, percentage units and unscored entries',async()=>{
  const k=seed()[0]; k.entries['2026-0']={status:'Reported',achievement:0,override:80,policy:'Workload Adjusted',eligible:50,approved:true,remarks:'Zero delivered'};
  k.entries['2026-1']={status:'No Input',achievement:'',remarks:'Outside dependency',external:true};
  const w=await load([k],{year:2026,period:'Jan–Jun',language:'en'}),s=w.getWorksheet('Monthly Results');
  assert.equal(s.rowCount,11); assert.equal(s.getCell('E6').value,.8); assert.equal(s.getCell('F6').value,0);
  assert.equal(s.getCell('G6').value,.5); assert.equal(s.getCell('H6').value,0); assert.equal(s.getCell('I6').value,0);
  assert.equal(s.getCell('J7').value,'No Input'); assert.equal(s.getCell('F7').value,null); assert.equal(s.getCell('H7').value,null);
  assert.equal(s.getCell('O6').value,'Zero delivered'); assert.equal(s.getCell('N7').value,'Yes');
});
test('65 actions remain separate and half-year targets stay within selected months',async()=>{
  const k={...seed()[0],actions:Array.from({length:65},(_,i)=>({text:'Action '+i,owner:'Owner '+i,due:'2027-10-06',status:'Pending',remarks:'Remark '+i}))};
  const w=await load([k],{year:2027,period:'Jul–Dec',reportType:'Targets',language:'en'}),a=w.getWorksheet('Action Plan'),m=w.getWorksheet('Monthly Results');
  assert.equal(a.rowCount,70); assert.equal(a.getCell('D70').value,'Action 64'); assert.equal(a.getCell('E70').value,'Owner 64'); assert.equal(a.getCell('H70').value,'Remark 64');
  assert.ok(a.getCell('F70').value instanceof Date); assert.equal(m.rowCount,11); assert.equal(m.getCell('C6').value,'July'); assert.equal(m.getCell('C11').value,'December'); assert.equal(m.getCell('E6').value,1);
});
test('invalid report year is rejected',async()=>{await assert.rejects(buildReport(null,seed(),{year:2026.5}),/২০০০/);});
