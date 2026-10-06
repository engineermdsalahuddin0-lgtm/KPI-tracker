import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ExcelJS from 'exceljs';
import {buildReport, buildOriginalReport} from '../src/features/export/excel-export.mjs';
import {getReportTemplate} from '../src/features/export/report-template.mjs';
import {seed} from '../src/lib/model.mjs';
const template=fs.readFileSync(new URL('../public/report-template.xlsx',import.meta.url));
test('download uses bundled original template without a template network request',async()=>{
  assert.deepEqual(Buffer.from(getReportTemplate()),template);
  const workbook=new ExcelJS.Workbook();
  await workbook.xlsx.load(await buildOriginalReport(seed().slice(0,1),{year:2026}));
  assert.ok(workbook.getWorksheet('Goal Setting_Dept'));
  assert.ok(workbook.getWorksheet('Monthly Results'));
});
test('ORG, DEPT and SEC alignments export to their own merged template column',async()=>{
  const ks=seed().slice(0,3).map((k,index)=>({...k,orgGoal:['ORG','DEPT','SEC'][index]}));
  const w=new ExcelJS.Workbook();await w.xlsx.load(await buildReport(template,ks,{year:2026,language:'en'}));
  const s=w.getWorksheet('Goal Setting_Dept');
  assert.equal(s.getCell('D6').value,'Aligned with ORG/DEPT/Section goals');
  for(const [index,k] of ks.entries()) {
    const row=9+index*3;assert.equal(s.getCell(row,4).value,k.orgGoal);
    assert.equal(s.getCell(row+2,4).value,k.orgGoal);
    assert.equal(s.getCell(row,3).value,k.mo);assert.equal(s.getCell(row,6).value,k.title);
  }
});
test('original template layout retains distinct metadata masters and KPI/month columns',async()=>{
  const ks=seed().filter(k=>k.dept==='ERP & IT');
  ks[0].title='লম্বা বাংলা KPI লেখা '.repeat(16);
  const w=new ExcelJS.Workbook();await w.xlsx.load(await buildReport(template,ks,{year:2026,dept:'ERP & IT',unit:'Unit value',location:'Location value',hod:'HOD value',section:'Section value',subsection:'Subsection value',language:'en'}));
  const s=w.getWorksheet('Goal Setting_Dept');
  assert.equal(s.getCell('A2').value,'Department:');assert.equal(s.getCell('C2').value,'ERP & IT');
  assert.equal(s.getCell('I2').value,'Unit:');assert.equal(s.getCell('J2').value,'Unit value');
  assert.equal(s.getCell('M2').value,'Location:');assert.equal(s.getCell('Q2').value,'Location value');
  assert.equal(s.getCell('C3').value,'HOD value');assert.equal(s.getCell('J3').value,'Section value');assert.equal(s.getCell('C4').value,'Subsection value');
  assert.equal(s.getCell('B9').value,ks[0].kra);assert.equal(s.getCell('C9').value,ks[0].mo);assert.equal(s.getCell('F9').value,ks[0].title);assert.equal(s.getCell('G9').value,.5);
  assert.equal(s.getCell('N9').value,ks[0].entries['2026-1'].achievement/100);
  assert.ok(s.model.merges.includes('M7:O7'));assert.ok(s.model.merges.includes('B9:B11'));assert.ok(s.model.merges.includes('I9:J9'));
  assert.equal(s.getCell('F9').alignment.wrapText,true);assert.ok(s.getRow(9).height>55);
  assert.equal(w.getWorksheet('Monthly Results').rowCount,29);assert.equal(w.worksheets.length,5);
  const original=new ExcelJS.Workbook();await original.xlsx.load(template);
  assert.equal(s.getColumn(13).width,original.getWorksheet('Goal Setting_Dept').getColumn(13).width);
  assert.deepEqual(w.worksheets.slice(1,4).map(x=>x.name),original.worksheets.slice(1,4).map(x=>x.name));
});
test('template supports 65 action rows and half-year targets without footer collision',async()=>{
  const k={...seed()[0],actions:Array.from({length:65},(_,i)=>({text:'Action '+i,owner:'Owner '+i,status:'Pending'}))};
  const w=new ExcelJS.Workbook();await w.xlsx.load(await buildReport(template,[k],{year:2027,period:'Jul–Dec',reportType:'Targets',language:'en'}));
  const s=w.getWorksheet('Goal Setting_Dept');assert.equal(s.getCell('M9').value,'—');assert.equal(s.getCell('S9').value,1);
  assert.match(s.getCell('I73').value,/Action 64/);assert.equal(s.getCell('G74').value,.5);assert.equal(s.pageSetup.printArea,'A1:Y83');
  assert.equal(w.getWorksheet('Monthly Results').rowCount,11);
});
