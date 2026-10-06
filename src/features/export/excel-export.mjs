import ExcelJS from 'exceljs';
import { months } from '../../lib/model.mjs';
import { buildDataWorkbook } from './data-export.mjs';
import { getReportTemplate } from './report-template.mjs';

export function buildOriginalReport(ks, options = {}) {
  return buildReport(getReportTemplate(), ks, options);
}

const clone = (value) => JSON.parse(JSON.stringify(value));
const shortMonths = ['জানু','ফেব্রু','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টে','অক্টো','নভে','ডিসে'];
const masterRows = [1,2,3,4,5,6,7,8];
const topRow = (range) => Number(range.match(/\d+/)[0]);

export async function buildReport(template, ks, options = {}) {
  if (!template) throw Error('Excel template is required.');
  // Reuse the validated typed results without replacing the supplied report layout.
  const data = new ExcelJS.Workbook();
  await data.xlsx.load(await buildDataWorkbook(null, ks, options));
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(template);
  const sheet = wb.getWorksheet('Goal Setting_Dept');
  if (!sheet) throw Error('The report template sheet could not be found.');
  const { year=2026, dept='', period='Full year', reportType='Performance', language='bn', hod='', unit='', location='', section='', subsection='' } = options;
  const bn = language === 'bn', label = (en, bangla) => bn ? bangla : en;
  const merges = [...sheet.model.merges];
  const styles = Array.from({length:25},(_,i)=>clone(sheet.getCell(9,i+1).style));
  const footer = Array.from({length:10},(_,index)=>{
    const row=59+index;
    return {height:sheet.getRow(row).height,cells:Array.from({length:25},(_,i)=>{
      const cell=sheet.getCell(row,i+1);
      return {value:cell.master.address===cell.address?cell.value:null,style:clone(cell.style)};
    })};
  });
  const count=ks.reduce((n,k)=>n+Math.max(1,k.actions?.length||0),0);
  // Keep header merges; rebuild only the KPI blocks and relocated footer.
  merges.filter(range=>topRow(range)>=9).forEach(range=>sheet.unMergeCells(range));
  for(let r=9;r<=Math.max(68,9+count+10);r++) for(let c=1;c<=25;c++) {
    const cell=sheet.getCell(r,c);cell.value=null;cell.style={};
  }
  sheet.getCell('A1').value=`${label(reportType==='Targets'?'Goal Setting':'KPI Performance Report',reportType==='Targets'?'লক্ষ্য নির্ধারণ':'KPI কর্মদক্ষতার রিপোর্ট')} — ${year} (${label(period,{'Full year':'পুরো বছর','Jan–Jun':'জানুয়ারি–জুন','Jul–Dec':'জুলাই–ডিসেম্বর'}[period]||period)})`;
  // These are distinct merged masters in the original workbook.
  for(const [address,value] of Object.entries({A2:label('Department:','বিভাগ:'),C2:dept,I2:label('Unit:','ইউনিট:'),J2:unit,M2:label('Location:','অবস্থান:'),Q2:location,A3:label('Department HOD:','বিভাগীয় প্রধান:'),C3:hod,I3:label('Sections:','শাখা:'),J3:section,A4:label('Sub-sections:','উপশাখা:'),C4:subsection})) sheet.getCell(address).value=value;
  const headers={A6:label('Sl.','ক্রম'),B6:label('KRA (Key Result Area)','KRA · দায়িত্বের ক্ষেত্র'),C6:label('Major Objective','মূল লক্ষ্য'),D6:label('Aligned with ORG/DEPT/Section goals','ORG/DEPT/শাখার লক্ষ্যের সঙ্গে সামঞ্জস্য'),E6:label('Perspective','দৃষ্টিকোণ'),F6:label('Key Performance Indicators (KPI)','কর্মদক্ষতার সূচক (KPI)'),G6:label('Weightage','গুরুত্ব'),H6:label('Measurement Parameter','পরিমাপের নিয়ম'),I6:label('Action Required to Achieve the TARGET','লক্ষ্য পূরণের কাজ'),K6:label('Threshold (RCL)','ন্যূনতম স্কোর (RCL)'),L6:label('Support Required','প্রয়োজনীয় সহায়তা'),M6:`${label(reportType==='Targets'?'Month-wise targets':'Month-wise achievements',reportType==='Targets'?'মাসভিত্তিক লক্ষ্য':'মাসভিত্তিক অর্জন')} — ${year}`,Y6:label('Remarks','মন্তব্য')};
  Object.entries(headers).forEach(([address,value])=>{sheet.getCell(address).value=value;});
  for(let m=0;m<12;m++) sheet.getCell(8,m+13).value=bn?shortMonths[m]:months[m].slice(0,3);
  // Widths and header/quarter geometry remain those of the uploaded template.
  for(const r of masterRows) for(let c=1;c<=25;c++) {
    const cell=sheet.getCell(r,c);
    cell.alignment={...cell.alignment,wrapText:true,vertical:'middle'};
    if(bn) cell.font={...cell.font,name:'Nirmala UI'};
  }
  sheet.getRow(6).height=Math.max(24,sheet.getRow(6).height||0);
  sheet.getRow(7).height=Math.max(23,sheet.getRow(7).height||0);
  sheet.getRow(8).height=Math.max(24,sheet.getRow(8).height||0);
  const start=period==='Jul–Dec'?6:0,end=period==='Jan–Jun'?5:11;
  let row=9;
  for(const [index,k] of ks.entries()) {
    const n=Math.max(1,k.actions?.length||0),last=row+n-1;
    const remarks=Object.entries(k.entries).filter(([key])=>{
      const [entryYear,month]=key.split('-').map(Number);
      return entryYear===Number(year)&&month>=start&&month<=end;
    }).map(([key,entry])=>entry.remarks?`${bn?shortMonths[Number(key.split('-')[1])]:months[Number(key.split('-')[1])]}: ${entry.remarks}`:'').filter(Boolean).join('\n');
    for(let r=row;r<=last;r++) for(let c=1;c<=25;c++) {
      const cell=sheet.getCell(r,c);cell.style=clone(styles[c-1]);
      cell.alignment={...cell.alignment,wrapText:true,vertical:'middle',shrinkToFit:false};
      cell.font={...cell.font,name:bn?'Nirmala UI':cell.font?.name||'Arial',size:11};
    }
    for(const c of [1,2,3,4,5,6,7,8,11,12,25,...Array.from({length:12},(_,m)=>m+13)]) if(n>1) sheet.mergeCells(row,c,last,c);
    const values={1:String(index+1).padStart(2,'0'),2:k.kra,3:k.mo,4:k.orgGoal||'',5:k.perspective,6:k.title,7:Number(k.weight)/100,
      8:`${label(k.direction==='HIGH'?'Higher is better':'Lower is better',k.direction==='HIGH'?'বেশি ভালো':'কম ভালো')} · ${k.unit}\n${label('Baseline','আগের মান')}: ${k.baseline}\n${label('Target','লক্ষ্য')}: ${k.target}`,11:Number(k.threshold),12:k.requirements,25:remarks};
    Object.entries(values).forEach(([column,value])=>sheet.getCell(row,Number(column)).value=value);
    sheet.getCell(row,7).numFmt='0%';
    // Size each action row; distribute long merged text across the block height.
    let blockHeight=0;
    for(const c of [2,3,5,6,8,12,25]) {
      const width=Math.max(5,(sheet.getColumn(c).width||12)-2);
      const lines=String(values[c]||'').split('\n').reduce((sum,line)=>sum+Math.max(1,Math.ceil([...line].length/(width*.78))),0);
      blockHeight=Math.max(blockHeight,lines*17+14);
    }
    for(let j=0;j<n;j++) {
      const r=row+j,action=k.actions?.[j];sheet.mergeCells(r,9,r,10);
      const text=action?`${j+1}. ${action.text}\n${label('Owner','দায়িত্বপ্রাপ্ত')}: ${action.owner}\n${label('Due','শেষ তারিখ')}: ${action.due||'—'} · ${action.status}`:'—';
      sheet.getCell(r,9).value=text;
      const width=(sheet.getColumn(9).width||40)+(sheet.getColumn(10).width||6)-3;
      const lines=text.split('\n').reduce((sum,line)=>sum+Math.max(1,Math.ceil([...line].length/(width*.78))),0);
      sheet.getRow(r).height=Math.min(409,Math.max(55,lines*17+12,Math.ceil(blockHeight/n)));
    }
    for(let m=0;m<12;m++) {
      const entry=k.entries[`${year}-${m}`],cell=sheet.getCell(row,m+13);
      let value=m<start||m>end?'—':reportType==='Targets'?Number(entry?.override===''||entry?.override==null?k.target:entry.override):entry?.status==='Reported'?Number(entry.achievement):entry?.status||'Pending';
      if(typeof value==='number') {
        cell.value=k.unit==='Percent'?value/100:value;
        cell.numFmt=k.unit==='Percent'?'0.0%':k.unit==='Currency (BDT)'?'#,##0.00':'0.##';
      } else cell.value=bn?({'Pending':'অপেক্ষমাণ','No Input':'উপকরণ নেই'}[value]||value):value;
    }
    row=last+1;
  }
  const shift=row-59;
  footer.forEach((source,index)=>{
    sheet.getRow(row+index).height=source.height;
    source.cells.forEach((cell,c)=>{const dest=sheet.getCell(row+index,c+1);dest.style=clone(cell.style);dest.value=cell.value;dest.alignment={...dest.alignment,wrapText:true,vertical:'middle'};});
  });
  merges.filter(range=>topRow(range)>=59).forEach(range=>sheet.mergeCells(range.replace(/\d+/g,match=>String(Number(match)+shift))));
  // Replace stale template formulas and grading bands with the application's rules.
  sheet.getCell(row,7).value=ks.reduce((sum,k)=>sum+Number(k.weight),0)/100;sheet.getCell(row,7).numFmt='0%';
  sheet.getCell(row+2,1).value=label('Performance Scoring Guideline (app calculation)','কর্মদক্ষতার স্কোরের নিয়ম');
  const scoring=[['Score = MIN(5, Performance × 5)','স্কোর = MIN(৫, কর্মদক্ষতা × ৫)'],['Threshold 4 = 80%','স্কোর ৪ = ৮০%'],['Threshold 4.5 = 90%','স্কোর ৪.৫ = ৯০%'],['Threshold 5 = 100%','স্কোর ৫ = ১০০%'],['HIGH = Achievement / Effective target','HIGH = অর্জন / কার্যকর লক্ষ্য'],['LOW = Effective target / Achievement','LOW = কার্যকর লক্ষ্য / অর্জন'],['Pending / No Input = N/A','অপেক্ষমাণ / উপকরণ নেই = মূল্যায়ন নেই'],['See Monthly Results','Monthly Results দেখুন']];
  [row+3,row+4].forEach((r,i)=>[1,7,10,16].forEach((c,j)=>{sheet.getCell(r,c).value=label(...scoring[i*4+j]);sheet.getCell(r,c).alignment={wrapText:true,vertical:'middle'};}));
  sheet.getRow(row+3).height=45;sheet.getRow(row+4).height=45;
  sheet.pageSetup={...sheet.pageSetup,printArea:`A1:Y${row+9}`,orientation:'landscape',fitToPage:true,fitToWidth:1,fitToHeight:0,printTitlesRow:'1:8'};
  const existing=wb.getWorksheet('Monthly Results');if(existing) wb.removeWorksheet(existing.id);
  const results=wb.addWorksheet('Monthly Results');
  const resultsModel=clone(data.getWorksheet('Monthly Results').model);resultsModel.id=results.id;results.model=resultsModel;
  results.name='Monthly Results';
  return wb.xlsx.writeBuffer();
}
