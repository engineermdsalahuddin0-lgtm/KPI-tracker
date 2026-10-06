import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext(null);
export const bangla = {
  'HR & Admin':'HR ও প্রশাসন', 'Industrial Engineering':'ইন্ডাস্ট্রিয়াল ইঞ্জিনিয়ারিং', 'CAD & Sample':'CAD ও নমুনা', 'Commercial':'বাণিজ্যিক',
  'Engineering & Services':'ইঞ্জিনিয়ারিং ও সেবা', 'ERP & IT':'ERP ও IT', 'Finance & Accounts':'অর্থ ও হিসাব', 'General':'সাধারণ',
  'HR, Admin & Compliance':'HR, প্রশাসন ও কমপ্লায়েন্স', 'MIS & Internal Audit':'MIS ও অভ্যন্তরীণ নিরীক্ষা', 'Production':'উৎপাদন',
  'Production Planning & control':'উৎপাদন পরিকল্পনা ও নিয়ন্ত্রণ', 'QA, Audit & Technical':'মান নিশ্চিতকরণ, নিরীক্ষা ও টেকনিক্যাল', 'Store & Warehouse':'স্টোর ও গুদাম',
  'Technical':'টেকনিক্যাল', 'Washing':'ওয়াশিং', 'Design & Product Development':'ডিজাইন ও পণ্য উন্নয়ন', 'ESG':'ESG',
  'Marketing & Merchandising':'বিপণন ও মার্চেন্ডাইজিং', 'Supply Chain':'সরবরাহ ব্যবস্থা', 'IE':'IE',
  'Enter one KRA and one major objective.':'একটি KRA ও একটি মূল লক্ষ্য লিখুন।', 'Complete all SMART fields; achievable and relevant must be Yes.':'SMART-এর সব ঘর পূরণ করুন। অর্জনযোগ্য ও প্রাসঙ্গিক—দুটিতেই হ্যাঁ থাকতে হবে।',
  'Enter a measurable KPI.':'পরিমাপযোগ্য একটি KPI লিখুন।', 'Add an action and responsible person for each entered action.':'অন্তত একটি কাজ লিখুন এবং প্রতিটি কাজের দায়িত্বপ্রাপ্ত ব্যক্তির নাম দিন।',
  'Enter non-negative baseline and target.':'আগের মান ও লক্ষ্যমাত্রা শূন্য বা তার বেশি দিন।', 'Achievement cannot be negative.':'অর্জন ঋণাত্মক হতে পারবে না।',
  'This version supports up to 60 KPIs.':'এই সংস্করণে সর্বোচ্চ ৬০টি KPI রাখা যায়।', 'Reported achievement must be a non-negative number.':'রিপোর্ট করা অর্জনে শূন্য বা তার বেশি সংখ্যা দিন।',
  'Target cannot be negative.':'লক্ষ্যমাত্রা ঋণাত্মক হতে পারবে না।', 'No Input needs an external dependency and remarks/RCA.':'উপকরণ না পাওয়া হলে বাহ্যিক নির্ভরতা ও মন্তব্য / কারণ লিখুন।',
  'Workload adjustment requires admin approval and non-negative eligible input.':'কাজ অনুযায়ী সমন্বয়ের জন্য অ্যাডমিনের অনুমোদন ও শূন্য বা তার বেশি কার্যকর উপকরণ প্রয়োজন।',
  'Ask admin to approve workload adjustment first.':'আগে অ্যাডমিনকে কাজ অনুযায়ী সমন্বয় অনুমোদন করতে বলুন।', 'Enter a non-negative number.':'শূন্য বা তার বেশি সংখ্যা দিন।',
  'Department weights cannot exceed 100%.':'বিভাগের মোট গুরুত্ব ১০০% ছাড়াতে পারবে না।', 'This field is required.':'এই ঘরটি পূরণ করুন।',
  'Deliver 100% of monthly reports by the agreed deadline':'নির্ধারিত শেষ তারিখের মধ্যে মাসিক রিপোর্টের ১০০% জমা দিন',
  'People, approved input, tools or resources':'জনবল, অনুমোদিত উপকরণ, সরঞ্জাম বা সহায়তা',
  '· weighted results':'· ওজনভিত্তিক ফলাফল', '· monthly weighted performance':'· মাসভিত্তিক ওজনযুক্ত কর্মদক্ষতা',
  'of':'এর মধ্যে', 'steps complete':'ধাপ সম্পন্ন', '· Due':'· শেষ তারিখ', '· Achievement:':'· অর্জন:',
  'Overview': 'সারসংক্ষেপ', 'KPI board': 'KPI বোর্ড', 'Action plan': 'কর্মপরিকল্পনা',
  'Workspace': 'কর্মক্ষেত্র', 'WORKSPACE': 'কর্মক্ষেত্র', 'Performance workspace': 'কর্মদক্ষতার কর্মক্ষেত্র',
  'Performance overview': 'কর্মদক্ষতার সারসংক্ষেপ', 'Action plans': 'কর্মপরিকল্পনা',
  'See how every department is progressing against its goals.': 'প্রতিটি বিভাগ লক্ষ্যের তুলনায় কতটা এগিয়েছে দেখুন।',
  'Define goals, record achievements and keep progress visible.': 'লক্ষ্য নির্ধারণ করুন, অর্জন লিখুন এবং অগ্রগতি দেখুন।',
  'Turn objectives into clear, accountable steps.': 'লক্ষ্য পূরণের কাজ ও দায়িত্ব নির্ধারণ করুন।',
  'Download Excel': 'Excel ডাউনলোড', 'Add KPI': 'KPI যোগ করুন', 'Sign out': 'সাইন আউট',
  'All departments': 'সব বিভাগ', 'Department': 'বিভাগ', 'Year': 'বছর', 'Month': 'মাস',
  'Super admin': 'প্রধান অ্যাডমিন', 'Employee': 'কর্মী', 'Mr Admin': 'অ্যাডমিন',
  'Super admin · All departments': 'প্রধান অ্যাডমিন · সব বিভাগ', 'ERP & IT · Team member': 'ERP ও IT · দলের সদস্য',
  'Local workspace': 'স্থানীয় কর্মক্ষেত্র', 'Changes saved on this device': 'পরিবর্তন এই ডিভাইসে সংরক্ষিত',
  'Weighted performance': 'ওজনভিত্তিক কর্মদক্ষতা', 'Average score': 'গড় স্কোর',
  'Scoring coverage': 'মূল্যায়নের আওতা', 'Action completion': 'কাজ সম্পন্ন',
  'Valid reported KPIs only': 'শুধু বৈধ রিপোর্ট করা KPI', 'Weighted by KPI allocation': 'KPI-এর গুরুত্ব অনুযায়ী হিসাব',
  'Share of assigned weight scored': 'বরাদ্দ গুরুত্বের কতটুকু মূল্যায়ন হয়েছে', 'No steps assigned': 'কোনো কাজ নির্ধারিত নেই',
  'Department performance': 'বিভাগের কর্মদক্ষতা', 'weighted results': 'ওজনভিত্তিক ফলাফল',
  'departments': 'বিভাগ', 'KPIs ·': 'KPI ·', '% coverage': '% মূল্যায়ন', '% weight': '% গুরুত্ব',
  'Year at a glance': 'এক নজরে পুরো বছর', 'monthly weighted performance': 'মাসভিত্তিক ওজনযুক্ত কর্মদক্ষতা',
  'Pending and No Input entries are excluded.': 'অপেক্ষমাণ ও উপকরণ না পাওয়া এন্ট্রি হিসাবে ধরা হয় না।',
  'READ YOUR RESULTS': 'ফলাফল বুঝুন', 'A score needs context.': 'স্কোরের পাশাপাশি মূল্যায়নের আওতা দেখুন।',
  'Performance reflects reported work. Coverage shows how much assigned work was evaluated.': 'কর্মদক্ষতা রিপোর্ট করা কাজের ফলাফল। মূল্যায়নের আওতা দেখায় বরাদ্দ কাজের কতটুকু হিসাব হয়েছে।',
  'Ask the KPI assistant': 'KPI সহকারীকে জিজ্ঞেস করুন', 'Weight allocation': 'গুরুত্ব বণ্টন',
  'departments need review': 'বিভাগের বণ্টন যাচাই প্রয়োজন',
  'Every department must total 100%. New weight cannot exceed 100%.': 'প্রতি বিভাগের মোট গুরুত্ব ১০০% হতে হবে। নতুন গুরুত্ব যোগ করে ১০০% ছাড়ানো যাবে না।',
  'Each department must total 100%.': 'প্রতি বিভাগের মোট গুরুত্ব ১০০% হতে হবে।',
  'Assigned weight:': 'বরাদ্দ গুরুত্ব:', 'KPIs': 'KPI', 'Compact': 'সংক্ষিপ্ত', 'Detailed': 'বিস্তারিত',
  'KPI / Owner': 'KPI / দায়িত্বপ্রাপ্ত', 'Target': 'লক্ষ্যমাত্রা', 'Achievement': 'অর্জন',
  'Performance': 'কর্মদক্ষতা', 'Status': 'অবস্থা', 'Weight': 'গুরুত্ব', 'Threshold': 'ন্যূনতম স্কোর',
  'Direction': 'ভালো ফলের দিক', 'Unit': 'একক', 'Baseline': 'আগের মান', 'Perspective': 'দৃষ্টিকোণ',
  'KRA': 'KRA · দায়িত্বের ক্ষেত্র', 'Major objective': 'MO · মূল লক্ষ্য', 'SMART KPI': 'SMART KPI',
  'Requirements': 'প্রয়োজনীয় সহায়তা', 'On track': 'লক্ষ্য অনুযায়ী চলছে', 'Below threshold': 'ন্যূনতম স্কোরের নিচে',
  'Pending': 'অপেক্ষমাণ', 'Reported': 'রিপোর্ট করা হয়েছে', 'No Input': 'উপকরণ পাওয়া যায়নি',
  'Completed': 'সম্পন্ন', 'In progress': 'চলমান', 'Unassigned': 'দায়িত্ব নির্ধারিত নয়',
  'Higher': 'বেশি', 'Lower': 'কম', 'is better': 'হলে ভালো', 'Higher is better': 'বেশি হলে ভালো', 'Lower is better': 'কম হলে ভালো',
  'HIGH': 'HIGH · বেশি ভালো', 'LOW': 'LOW · কম ভালো', 'Number': 'সংখ্যা', 'Percent': 'শতাংশ', 'Day': 'দিন', 'Currency (BDT)': 'টাকা (BDT)',
  'Update this month': 'এই মাসের অর্জন লিখুন', 'View details': 'বিস্তারিত দেখুন', 'No KPIs found.': 'কোনো KPI পাওয়া যায়নি।',
  'Pending and documented No Input entries are excluded from scoring.': 'অপেক্ষমাণ ও ব্যাখ্যাসহ উপকরণ না পাওয়া এন্ট্রি মূল্যায়নে ধরা হয় না।',
  'History': 'পূর্বের রেকর্ড', 'Monthly record history': 'মাসভিত্তিক পূর্বের রেকর্ড', 'Calculation': 'হিসাবের নিয়ম', 'Score': 'স্কোর',
  'Awaiting a valid reported entry.': 'বৈধ অর্জনের রিপোর্টের অপেক্ষায়।', 'Update achievement': 'অর্জন হালনাগাদ করুন',
  'Score capped at 5. Zero values follow the configured zero rules.': 'সর্বোচ্চ স্কোর ৫। শূন্য মানের জন্য নির্ধারিত নিয়ম প্রযোজ্য।',
  'This local prototype stores monthly records, not a full audit trail.': 'এই স্থানীয় অ্যাপ মাসভিত্তিক রেকর্ড রাখে; সব পরিবর্তনের ইতিহাস রাখে না।',
  'completed': 'সম্পন্ন', 'Due': 'শেষ তারিখ', 'Progress across your selected department': 'নির্বাচিত বিভাগের কাজের অগ্রগতি',
  'Action description': 'কাজের বিবরণ', 'Responsible person': 'দায়িত্বপ্রাপ্ত ব্যক্তি', 'Due date': 'শেষ তারিখ',
  'Action remarks': 'কাজের মন্তব্য', 'Search KPIs…': 'KPI খুঁজুন…', 'Expand months': 'মাসগুলো দেখুন',
  'PERFORMANCE WORKSPACE': 'কর্মদক্ষতার কর্মক্ষেত্র', 'Clear goals.': 'স্পষ্ট লক্ষ্য।', 'Measurable progress.': 'পরিমাপযোগ্য অগ্রগতি।',
  'A shared view of the work that moves your department forward.': 'আপনার বিভাগের লক্ষ্য ও অগ্রগতি এক জায়গায় দেখুন।',
  'Monthly performance': 'মাসিক কর্মদক্ষতা', 'Illustrative sample data': 'বোঝানোর জন্য নমুনা তথ্য',
  'Built around your goals, one KPI at a time.': 'প্রতিটি KPI দিয়ে আপনার লক্ষ্যে এগিয়ে যান।',
  'WELCOME BACK': 'স্বাগতম', 'Sign in to your workspace': 'কর্মক্ষেত্রে সাইন ইন করুন',
  'Choose your demo account to get started.': 'শুরু করতে নমুনা অ্যাকাউন্ট বেছে নিন।',
  'Email address': 'ইমেইল ঠিকানা', 'Password': 'পাসওয়ার্ড', 'Sign in': 'সাইন ইন',
  'Both accounts use': 'দুই অ্যাকাউন্টের পাসওয়ার্ড', 'Local demo · data stays in this browser.': 'স্থানীয় ডেমো · তথ্য এই ব্রাউজারেই থাকে।',
  'Use a demo account and password Demo@123.': 'নমুনা অ্যাকাউন্ট ও Demo@123 পাসওয়ার্ড ব্যবহার করুন।',
  'Define the objective': 'মূল লক্ষ্য নির্ধারণ করুন', 'Build your SMART KPI': 'SMART KPI তৈরি করুন',
  'Plan the work': 'কাজের পরিকল্পনা করুন', 'Allocate weight': 'গুরুত্ব বণ্টন করুন', 'Set the measurement': 'পরিমাপের নিয়ম ঠিক করুন',
  'First monthly achievement': 'প্রথম মাসের অর্জন', 'Key result area (one KRA)': 'দায়িত্বের ক্ষেত্র (একটি KRA)',
  'Major objective (one MO)': 'মূল লক্ষ্য (একটি MO)', 'Direct KPI': 'সরাসরি KPI লিখুন', 'SMART builder': 'SMART দিয়ে তৈরি করুন',
  'Specific goal (S)': 'সুনির্দিষ্ট লক্ষ্য (S)', 'Measure (M)': 'পরিমাপের উপায় (M)', 'Achievable (A)': 'অর্জন করা সম্ভব? (A)',
  'Relevant (R)': 'কাজের সঙ্গে প্রাসঙ্গিক? (R)', 'Time / deadline (T)': 'সময় / শেষ তারিখ (T)', 'Yes': 'হ্যাঁ', 'No': 'না',
  'Process': 'প্রক্রিয়া', 'Account': 'হিসাব', 'Learning&Development': 'শেখা ও উন্নয়ন', 'Customer': 'গ্রাহক',
  'Step': 'ধাপ', 'Action': 'কাজ', 'Add action': 'আরও কাজ যোগ করুন', 'Weight (%)': 'গুরুত্ব (%)',
  'Threshold (minimum score / 5)': 'ন্যূনতম গ্রহণযোগ্য স্কোর (৫-এর মধ্যে)', 'Measurement unit': 'পরিমাপের একক',
  'Current department allocation:': 'বিভাগে বর্তমানে বরাদ্দ গুরুত্ব:',
  '%. Total may not exceed 100%. Threshold 4 / 4.5 / 5 means 80% / 90% / 100%.': '%. মোট ১০০% ছাড়ানো যাবে না। স্কোর ৪ / ৪.৫ / ৫ মানে ৮০% / ৯০% / ১০০%।',
  'For percent, use percentage points: 90 means 90%. Baseline and target use the same unit.': 'শতাংশ হলে ৯০ লিখলে ৯০% ধরা হবে। আগের মান ও লক্ষ্যমাত্রায় একই একক ব্যবহার করুন।',
  'Leave blank to create a Pending entry.': 'অপেক্ষমাণ রাখতে ঘরটি খালি রাখুন।', 'Back': 'পেছনে', 'Continue': 'পরবর্তী ধাপ', 'Create KPI': 'KPI তৈরি করুন',
  'Value': 'মান', 'Entry status': 'এন্ট্রির অবস্থা', 'Monthly target override (optional)': 'এই মাসের আলাদা লক্ষ্য (ঐচ্ছিক)',
  'Target policy': 'লক্ষ্যমাত্রার নিয়ম', 'Eligible input available before deadline': 'শেষ তারিখের আগে পাওয়া কার্যকর উপকরণ',
  'Remarks / RCA': 'মন্তব্য / কারণের বিশ্লেষণ', 'Fixed': 'নির্ধারিত', 'Workload Adjusted': 'পাওয়া কাজ অনুযায়ী সমন্বয়',
  'No input dependency is outside employee responsibility': 'উপকরণ না পাওয়ার বিষয়টি কর্মীর দায়িত্বের বাইরে',
  'Management approves workload adjustment': 'কাজ অনুযায়ী সমন্বয়ে ব্যবস্থাপনার অনুমোদন আছে',
  'Cancel': 'বাতিল', 'Save changes': 'পরিবর্তন সংরক্ষণ', 'Close': 'বন্ধ করুন',
  'Open KPI assistant': 'KPI সহকারী খুলুন', 'KPI assistant': 'KPI সহকারী', 'Answers from your supplied dataset': 'আপনার দেওয়া প্রশ্নোত্তর থেকে উত্তর',
  'Clear chat history': 'আলোচনার ইতিহাস মুছুন', 'Clear': 'মুছুন', 'How can I help?': 'কী জানতে চান?',
  'Ask about KPIs, SMART goals, weights or department objectives. বাংলা বা English-এ লিখুন।': 'KPI, SMART লক্ষ্য, গুরুত্ব বা বিভাগের কাজ নিয়ে লিখুন। নিচের প্রশ্ন থেকে বেছে নিতে পারেন।',
  'Question for KPI assistant': 'KPI সহকারীর জন্য প্রশ্ন', 'Ask a KPI question…': 'KPI নিয়ে লিখুন…', 'Send question': 'প্রশ্ন পাঠান',
  'Local text matching · no external AI service': 'স্থানীয় প্রশ্নোত্তর অনুসন্ধান · বাইরের AI সেবা নেই', 'Dataset reference:': 'তথ্যসূত্র:',
  'Related questions': 'মিল আছে এমন প্রশ্ন', 'Choose a question to fill the input': 'প্রশ্নে চাপ দিলে নিচের ঘরে বসবে',
  'Try these topics': 'এই বিষয়গুলো দেখুন', 'No matching question. Try KPI, SMART, weight or a department name.': 'মিল পাওয়া যায়নি। KPI, SMART, গুরুত্ব বা বিভাগের নাম লিখে দেখুন।',
  'Download KPI report': 'KPI রিপোর্ট ডাউনলোড', 'Clean columns, readable rows, no merged data cells.': 'আলাদা কলাম, পড়তে সহজ সারি—তথ্যের ঘর merge করা নেই।',
  'Single KPI': 'একটি KPI', 'Reporting period': 'রিপোর্টের সময়কাল', 'Report content': 'রিপোর্টের বিষয়',
  'Full year': 'পুরো বছর', 'Jan–Jun': 'জানুয়ারি–জুন', 'Jul–Dec': 'জুলাই–ডিসেম্বর', 'Targets': 'লক্ষ্যমাত্রা',
  'Department details': 'বিভাগের তথ্য', 'hod': 'বিভাগীয় প্রধান', 'unit': 'ইউনিট', 'location': 'অবস্থান', 'section': 'শাখা', 'subsection': 'উপশাখা',
  'Three sheets: KPI Report, Monthly Results and Action Plan.': 'তিনটি sheet: KPI তথ্য, মাসিক ফলাফল ও কর্মপরিকল্পনা।',
  'Each KPI, month and action has its own row. Text wraps inside its cell.': 'প্রতিটি KPI, মাস ও কাজের আলাদা সারি। লম্বা লেখা একই ঘরে পরের লাইনে যাবে।',
  'Excel report preview': 'Excel রিপোর্টের প্রিভিউ', 'Layout summary ·': 'নির্বাচিত তথ্য ·', 'KPI Performance Report': 'KPI কর্মদক্ষতার রিপোর্ট',
  'Goal Setting': 'লক্ষ্য নির্ধারণ', 'Department:': 'বিভাগ:', 'HOD:': 'বিভাগীয় প্রধান:', 'Major Objective': 'মূল লক্ষ্য', 'Owner': 'দায়িত্বপ্রাপ্ত',
  'Preparing…': 'তৈরি হচ্ছে…', 'Download .xlsx': '.xlsx ডাউনলোড', 'No KPIs selected.': 'কোনো KPI নির্বাচন করা হয়নি।',
  'Report language': 'রিপোর্টের ভাষা', 'Bitopi Group · KPI workspace': 'বিটপী গ্রুপ · KPI কর্মক্ষেত্র',
  'Browser saved · No backend connected': 'ব্রাউজারে সংরক্ষিত · কোনো সার্ভার সংযুক্ত নয়', 'Jan–Feb: sample · Mar–Dec: pending': 'জানুয়ারি–ফেব্রুয়ারি: নমুনা · মার্চ–ডিসেম্বর: অপেক্ষমাণ',
  'January':'জানুয়ারি', 'February':'ফেব্রুয়ারি', 'March':'মার্চ', 'April':'এপ্রিল', 'May':'মে', 'June':'জুন',
  'July':'জুলাই', 'August':'আগস্ট', 'September':'সেপ্টেম্বর', 'October':'অক্টোবর', 'November':'নভেম্বর', 'December':'ডিসেম্বর',
};

export function translate(text, language) {
  if (language !== 'bn' || typeof text !== 'string') return text;
  const key = text.replace(/\s+/g, ' ').trim();
  if (bangla[key]) return text.replace(text.trim(), bangla[key]);
  if (/^\d+% of steps completed$/.test(key)) return key.replace('% of steps completed', '% কাজ সম্পন্ন');
  if (/^Status for /.test(key)) return key.replace('Status for ', 'কাজের অবস্থা: ');
  if (/^Achievement \(.+\) — optional$/.test(key)) return `অর্জন (${translate(key.match(/\((.+)\)/)[1], language)}) — ঐচ্ছিক`;
  if (/^NEW KPI · STEP$/.test(key)) return 'নতুন KPI · ধাপ';
  if (key === 'OF 7') return '/ ৭';
  const allocation = key.match(/^Department already has (.+)% assigned\. Reduce existing weights first; total cannot exceed 100%\.$/);
  if (allocation) return `বিভাগে ইতিমধ্যে ${allocation[1]}% গুরুত্ব বরাদ্দ আছে। আগে বর্তমান গুরুত্ব কমান; মোট ১০০% ছাড়ানো যাবে না।`;
  for (const month of ['January','February','March','April','May','June','July','August','September','October','November','December']) {
    if (key.includes(month) && /KPI-|^(January|February|March|April|May|June|July|August|September|October|November|December):/.test(key)) return key.replace(month,bangla[month]).replace('Pending',bangla.Pending);
  }
  return text;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('bitopi-language') === 'en' ? 'en' : 'bn'; } catch { return 'bn'; }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem('bitopi-language', language); } catch { /* Storage may be disabled. */ }
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: (text) => translate(text, language) }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }

// Localize the UI element tree, leaving stored enum values and user content intact.
// This never rewrites the DOM or input values; React owns every rendered label.
export function Localized({ children }) {
  const { t } = useLanguage();
  const visit = (node) => {
    if (typeof node === 'string') return t(node);
    if (Array.isArray(node)) return React.Children.map(node, visit);
    if (!React.isValidElement(node) || node.props['data-user-content']) return node;
    if (typeof node.type !== 'string' && node.type !== React.Fragment) return node;
    const props = {};
    for (const key of ['aria-label', 'placeholder', 'title']) if (typeof node.props[key] === 'string') props[key] = t(node.props[key]);
    // An option without value normally takes its label as the value. Keep its original value.
    if (node.type === 'option' && node.props.value == null && typeof node.props.children === 'string') props.value = node.props.children;
    return React.cloneElement(node, { ...props, children: visit(node.props.children) });
  };
  return visit(children);
}
export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  return <div className="language-switch" role="group" aria-label="ভাষা / Language">
    <button type="button" lang="bn" aria-pressed={language === 'bn'} onClick={() => setLanguage('bn')}>বাংলা</button>
    <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button>
  </div>;
}
