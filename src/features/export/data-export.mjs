import ExcelJS from 'exceljs';
import { months, score } from '../../lib/model.mjs';
const bnMonths = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
const bnValues = { Pending:'অপেক্ষমাণ', Reported:'রিপোর্ট করা হয়েছে', 'No Input':'উপকরণ পাওয়া যায়নি', Completed:'সম্পন্ন', 'In progress':'চলমান', Fixed:'নির্ধারিত', 'Workload Adjusted':'কাজ অনুযায়ী সমন্বয়', HIGH:'বেশি ভালো', LOW:'কম ভালো', Number:'সংখ্যা', Percent:'শতাংশ', Day:'দিন', 'Currency (BDT)':'টাকা (BDT)', Unit:'একক', Process:'প্রক্রিয়া', Account:'হিসাব', 'Learning&Development':'শেখা ও উন্নয়ন', Customer:'গ্রাহক' };
const border = { style:'thin', color:{argb:'FFCBD8D2'} };
const asNumber = (v) => v === '' || v == null || !Number.isFinite(Number(v)) ? null : Number(v);
function measurement(cell, value, unit) {
  const n=asNumber(value); cell.value=n==null?null:unit==='Percent'?n/100:n;
  cell.numFmt=unit==='Percent'?'0.0%':unit==='Currency (BDT)'?'#,##0.00" BDT"':'0.##';
}
function makeSheet(wb,name,columns,title,metadata,language) {
  const sheet=wb.addWorksheet(name); sheet.columns=columns.map(([key,en,bn,width])=>({key,width}));
  const last=columns.length;
  sheet.mergeCells(1,1,1,last); sheet.getCell(1,1).value=title; sheet.getRow(1).height=34;
  sheet.getCell(1,1).font={name:'Nirmala UI',size:16,bold:true,color:{argb:'FFFFFFFF'}};
  sheet.getCell(1,1).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF123D32'}};
  sheet.getCell(1,1).alignment={vertical:'middle'};
  metadata.forEach((text,i)=>{
    sheet.mergeCells(i+2,1,i+2,last); sheet.getCell(i+2,1).value=text;
    sheet.getCell(i+2,1).font={name:'Nirmala UI',size:11,color:{argb:'FF244A3D'}};
    sheet.getCell(i+2,1).alignment={wrapText:true,vertical:'middle'}; sheet.getRow(i+2).height=32;
  });
  const header=metadata.length+3;
  columns.forEach(([,en,bn],i)=>{
    const cell=sheet.getCell(header,i+1); cell.value=language==='bn'?bn:en;
    cell.font={name:'Nirmala UI',size:11,bold:true,color:{argb:'FFFFFFFF'}};
    cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF087751'}};
    cell.alignment={wrapText:true,vertical:'middle'}; cell.border={top:border,bottom:border,left:border,right:border};
  });
  sheet.getRow(header).height=42;
  sheet.views=[{state:'frozen',ySplit:header,xSplit:1,showGridLines:false}];
  sheet.pageSetup={paperSize:8,orientation:'landscape',fitToPage:true,fitToWidth:1,fitToHeight:0,printTitlesRow:`${header}:${header}`,margins:{left:.25,right:.25,top:.4,bottom:.4,header:.2,footer:.2}};
  sheet.headerFooter.oddFooter='&LBitopi Group&RPage &P of &N';
  return {sheet,header,columns};
}
function finish({sheet,header,columns}) {
  for(let index=header+1;index<=sheet.rowCount;index++) {
    const row=sheet.getRow(index); let lines=1;
    columns.forEach(([, , ,width],column)=>{
      const cell=row.getCell(column+1);
      cell.font={name:'Nirmala UI',size:11,color:{argb:'FF16352B'}};
      cell.alignment={wrapText:true,vertical:'top',horizontal:typeof cell.value==='number'?'right':'left'};
      cell.border={top:border,bottom:border,left:border,right:border};
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:(index-header)%2===0?'FFEBF3EF':'FFFFFFFF'}};
      if(typeof cell.value==='string') {
        const usable=Math.max(5,Math.floor((width-2)*.78));
        lines=Math.max(lines,cell.value.split('\n').reduce((n,line)=>n+Math.max(1,Math.ceil([...line].length/usable)),0));
      }
    });
    row.height=Math.min(409,Math.max(36,lines*17+12));
  }
  sheet.autoFilter={from:{row:header,column:1},to:{row:Math.max(header,sheet.rowCount),column:columns.length}};
  sheet.pageSetup.printArea=`A1:${sheet.getColumn(columns.length).letter}${sheet.rowCount}`;
}

// Retain the original signature; the merged legacy template is no longer needed.
export async function buildDataWorkbook(_template,ks,{year=2026,dept='',period='Full year',reportType='Performance',language='bn',hod='',unit='',location='',section='',subsection=''}={}) {
  if(!Number.isInteger(Number(year))||Number(year)<2000||Number(year)>2100) throw Error(language==='bn'?'বছর ২০০০–২১০০-এর মধ্যে দিন।':'Enter a year between 2000 and 2100.');
  if(!ks.length) throw Error(language==='bn'?'কোনো KPI নির্বাচন করা হয়নি।':'No KPIs selected.');
  const wb=new ExcelJS.Workbook(); wb.creator='Bitopi Group';
  const label=(en,bn)=>language==='bn'?bn:en;
  const value=(text)=>language==='bn'?bnValues[text]||text:text;
  const start=period==='Jul–Dec'?6:0,end=period==='Jan–Jun'?5:11;
  const periodName=label(period,{'Full year':'পুরো বছর','Jan–Jun':'জানুয়ারি–জুন','Jul–Dec':'জুলাই–ডিসেম্বর'}[period]||period);
  const metadata=[`${label('Department','বিভাগ')}: ${dept}    ${label('Year','বছর')}: ${year}    ${label('Period','সময়কাল')}: ${periodName}`,
    `${label('HOD','বিভাগীয় প্রধান')}: ${hod||'—'}    ${label('Unit','ইউনিট')}: ${unit||'—'}    ${label('Location','অবস্থান')}: ${location||'—'}    ${label('Section','শাখা')}: ${section||'—'}    ${label('Subsection','উপশাখা')}: ${subsection||'—'}`];
  const kpi=makeSheet(wb,'KPI Report',[
    ['id','KPI ID','KPI ID',16],['kra','KRA','KRA · দায়িত্বের ক্ষেত্র',27],['mo','Major objective','MO · মূল লক্ষ্য',30],['title','SMART KPI','SMART KPI',44],
    ['perspective','Perspective','দৃষ্টিকোণ',20],['weight','Weight','গুরুত্ব',12],['direction','Direction','ভালো ফলের দিক',17],['unit','Unit','একক',16],
    ['baseline','Baseline','আগের মান',14],['target','Default target','নির্ধারিত লক্ষ্য',15],['threshold','Threshold / 5','ন্যূনতম স্কোর / ৫',17],['requirements','Requirements','প্রয়োজনীয় সহায়তা',36],
  ],label('Bitopi Group · KPI Report','বিটপী গ্রুপ · KPI তথ্য'),metadata,language);
  for(const k of ks) {
    const row=kpi.sheet.addRow({id:k.id,kra:k.kra,mo:k.mo,title:k.title,perspective:value(k.perspective),weight:Number(k.weight)/100,direction:value(k.direction),unit:value(k.unit),threshold:Number(k.threshold),requirements:k.requirements});
    row.getCell('weight').numFmt='0.0%'; measurement(row.getCell('baseline'),k.baseline,k.unit); measurement(row.getCell('target'),k.target,k.unit);
  }
  const monthly=makeSheet(wb,'Monthly Results',[
    ['id','KPI ID','KPI ID',16],['title','KPI','KPI',42],['month','Month','মাস',17],['unit','Unit','একক',16],['target','Monthly target','মাসের লক্ষ্য',16],
    ['actual','Achievement','অর্জন',15],['effective','Effective target','হিসাবের কার্যকর লক্ষ্য',18],['performance','Performance','কর্মদক্ষতা',15],['score','Score / 5','স্কোর / ৫',13],
    ['status','Entry status','এন্ট্রির অবস্থা',23],['policy','Target policy','লক্ষ্যের নিয়ম',24],['eligible','Eligible input','পাওয়া কার্যকর উপকরণ',18],['approved','Approved','অনুমোদন',14],['external','External dependency','বাহ্যিক নির্ভরতা',18],['remarks','Remarks / RCA','মন্তব্য / কারণ',38],
  ].filter(([key]) => reportType !== 'Targets' || !['actual','performance','score'].includes(key)),label(`Monthly ${reportType==='Targets'?'Targets':'Results'} · ${year}`,`মাসিক ${reportType==='Targets'?'লক্ষ্যমাত্রা':'ফলাফল'} · ${year}`),[metadata[0],label('Performance uses valid reported entries. Score capped at 5. Pending / No Input is unscored.','বৈধ রিপোর্ট অনুযায়ী কর্মদক্ষতা। সর্বোচ্চ স্কোর ৫। অপেক্ষমাণ / উপকরণ না পাওয়া এন্ট্রির স্কোর নেই।')],language);
  for(const k of ks) for(let month=start;month<=end;month++) {
    const entry=k.entries[`${year}-${month}`],calc=score(k,entry);
    const target=entry?.override===''||entry?.override==null?k.target:entry.override;
    const row=monthly.sheet.addRow({id:k.id,title:k.title,month:language==='bn'?bnMonths[month]:months[month],unit:value(k.unit),performance:calc?calc.performance/100:null,score:calc?.score??null,status:value(entry?.status||'Pending'),policy:value(entry?.policy||'Fixed'),approved:entry?.approved?label('Yes','হ্যাঁ'):label('No','না'),external:entry?.external?label('Yes','হ্যাঁ'):label('No','না'),remarks:entry?.remarks||''});
    measurement(row.getCell('target'),target,k.unit);
    if(reportType !== 'Targets') measurement(row.getCell('actual'),entry?.status==='Reported'?entry.achievement:null,k.unit);
    measurement(row.getCell('effective'),calc?.target,k.unit); measurement(row.getCell('eligible'),entry?.eligible,k.unit);
    if(reportType !== 'Targets') { row.getCell('performance').numFmt='0.0%'; row.getCell('score').numFmt='0.00'; }
  }
  const actions=makeSheet(wb,'Action Plan',[
    ['id','KPI ID','KPI ID',16],['title','KPI','KPI',42],['step','Step','ধাপ',10],['action','Action','কাজের বিবরণ',48],['owner','Owner','দায়িত্বপ্রাপ্ত',24],['due','Due date','শেষ তারিখ',17],['status','Status','অবস্থা',20],['remarks','Remarks','মন্তব্য',36],
  ],label('Bitopi Group · Action Plan','বিটপী গ্রুপ · কর্মপরিকল্পনা'),[metadata[0],label('Action steps are not restricted to the monthly reporting period.','কর্মপরিকল্পনার ধাপগুলো মাসিক রিপোর্টের সময়কাল দিয়ে সীমাবদ্ধ করা হয়নি।')],language);
  for(const k of ks) (k.actions||[]).forEach((action,index)=>{
    const date=/^\d{4}-\d{2}-\d{2}$/.test(action.due||'')?new Date(`${action.due}T00:00:00Z`):null;
    const row=actions.sheet.addRow({id:k.id,title:k.title,step:index+1,action:action.text,owner:action.owner,due:date&&Number.isFinite(date.getTime())?date:null,status:value(action.status),remarks:action.remarks||''});
    row.getCell('due').numFmt='dd mmm yyyy';
  });
  [kpi,monthly,actions].forEach(finish);
  return wb.xlsx.writeBuffer();
}
