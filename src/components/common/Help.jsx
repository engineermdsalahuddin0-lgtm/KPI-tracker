import React, { useId, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import { useLanguage } from '../../i18n/index.jsx';

const descriptions = {
  orgGoal: ['লক্ষ্যের সঙ্গে সামঞ্জস্য', 'ORG = প্রতিষ্ঠানের লক্ষ্য, DEPT = বিভাগের লক্ষ্য, SEC = শাখার লক্ষ্য। KPI কোন স্তরের লক্ষ্য পূরণে অবদান রাখে তা বেছে নিন।', 'Goal alignment', 'ORG = organization goals, DEPT = department goals, SEC = section goals. Choose the goal level this KPI supports.'],
  title: ['KPI কী?', 'কাজের সফলতা মাপার নির্দিষ্ট সূচক। কী অর্জন করতে হবে, কতটুকু এবং কখন—তা স্পষ্ট করে।', 'What is a KPI?', 'A measurable indicator of success. State what must be achieved, how much and by when.'],
  kra: ['KRA · দায়িত্বের ক্ষেত্র', 'যে বড় দায়িত্বের ক্ষেত্রে ফলাফল দিতে হবে। যেমন সেবার মান বা উৎপাদন দক্ষতা।', 'KRA · Key Result Area', 'The broad area of responsibility where results are expected, such as service quality.'],
  mo: ['MO · মূল লক্ষ্য', 'KRA-এর মধ্যে প্রধান যে ফলাফল অর্জন করতে চান। KPI দিয়ে এই লক্ষ্যের অগ্রগতি মাপা হয়।', 'MO · Major objective', 'The main outcome within a KRA. KPIs measure progress toward this objective.'],
  target: ['লক্ষ্যমাত্রা', 'নির্ধারিত মাসে যে মান অর্জন করার লক্ষ্য। মাসের আলাদা লক্ষ্য বা অনুমোদিত সমন্বয় থাকলে হিসাবের কার্যকর লক্ষ্য বদলাতে পারে।', 'Target', 'The expected result. A monthly override or approved workload adjustment may change the effective target.'],
  baseline: ['আগের মান', 'শুরুর বা আগের অবস্থার মান। উন্নতির তুলনায় কাজে লাগে; কর্মদক্ষতা হিসাবের ভাগের ভিত্তি নয়।', 'Baseline', 'The starting or previous value used to compare improvement. It is not the scoring denominator.'],
  weight: ['গুরুত্ব (%)', 'বিভাগের মোট কাজের মধ্যে এই KPI-এর গুরুত্ব। প্রতি বিভাগের সব KPI মিলিয়ে ১০০% হতে হবে।', 'Weight (%)', 'This KPI’s share of departmental importance. All KPI weights in a department must total 100%.'],
  threshold: ['ন্যূনতম গ্রহণযোগ্য স্কোর', '৫-এর মধ্যে ন্যূনতম স্কোর। ৪ মানে ৮০%, ৪.৫ মানে ৯০%, আর ৫ মানে ১০০% কর্মদক্ষতা।', 'Minimum acceptable score', 'Minimum score out of 5: 4 means 80%, 4.5 means 90%, and 5 means 100% performance.'],
  achievement: ['অর্জন', 'নির্বাচিত মাসের বাস্তব ফলাফল। শূন্য অর্জন ও উপকরণ না পাওয়া আলাদা বিষয়।', 'Achievement', 'The actual result for the selected month. Zero achievement differs from having no input.'],
  performance: ['কর্মদক্ষতা (%)', 'HIGH: অর্জন ÷ কার্যকর লক্ষ্য × ১০০। LOW: কার্যকর লক্ষ্য ÷ অর্জন × ১০০। স্কোর সর্বোচ্চ ৫।', 'Performance (%)', 'HIGH: achievement / effective target × 100. LOW: effective target / achievement × 100. Score is capped at 5.'],
  direction: ['ভালো ফলের দিক', 'HIGH হলে মান বেশি ভালো; LOW হলে মান কম ভালো। যেমন উৎপাদন বেশি ভালো, কাজ শেষ করার সময় কম ভালো।', 'Direction', 'HIGH means higher is better; LOW means lower is better, such as shorter turnaround time.'],
  unit: ['পরিমাপের একক', 'আগের মান, লক্ষ্য ও অর্জনের একই একক রাখুন। শতাংশে ৯০ লিখলে ৯০% বোঝায়।', 'Measurement unit', 'Use the same unit for baseline, target and achievement. Enter 90 for 90%.'],
  perspective: ['দৃষ্টিকোণ', 'এই KPI প্রক্রিয়া, হিসাব, শেখা ও উন্নয়ন অথবা গ্রাহক—কোন ক্ষেত্রে অবদান রাখে।', 'Perspective', 'The area this KPI contributes to: process, account, learning and development, or customer.'],
  requirements: ['প্রয়োজনীয় সহায়তা', 'কাজ শেষ করতে প্রয়োজনীয় জনবল, উপকরণ, অনুমোদন, সময় বা সরঞ্জাম।', 'Requirements', 'People, inputs, approvals, time or tools needed to complete the work.'],
  owner: ['দায়িত্বপ্রাপ্ত ব্যক্তি', 'KPI-এর action plan-এর কাজগুলো কে করবেন। প্রতিটি ধাপে আলাদা দায়িত্বপ্রাপ্ত থাকতে পারেন।', 'Owner', 'The responsible people in the KPI’s action plan. Each step may have a different owner.'],
  status: ['অবস্থা', 'অপেক্ষমাণ: রিপোর্ট হয়নি। রিপোর্ট করা: অর্জন লেখা হয়েছে। উপকরণ পাওয়া যায়নি: অনুমোদিত বাহ্যিক নির্ভরতার ব্যাখ্যা প্রয়োজন।', 'Status', 'Pending awaits reporting. Reported records achievement. No Input requires documented external dependency.'],
};

export default function Help({ field, children, value }) {
  const { language } = useLanguage();
  const id = useId(), ref = useRef(null), timer = useRef(null);
  const [position, setPosition] = useState(null);
  const copy = descriptions[field] || descriptions.title;
  const title = copy[language === 'bn' ? 0 : 2], description = copy[language === 'bn' ? 1 : 3];
  function hide() { clearTimeout(timer.current); setPosition(null); }
  function show() {
    clearTimeout(timer.current);
    const rect = ref.current.getBoundingClientRect();
    const width = Math.min(310, window.innerWidth - 24);
    const below = rect.top < 220;
    setPosition({ left: Math.max(12, Math.min(window.innerWidth - width - 12, rect.left + rect.width / 2 - width / 2)), top: below ? rect.bottom + 10 : rect.top - 10, width, below });
  }
  useEffect(() => {
    if (!position) return;
    const escape = (e) => { if (e.key === 'Escape') hide(); };
    window.addEventListener('scroll', hide, true); window.addEventListener('resize', hide); window.addEventListener('keydown', escape);
    return () => { window.removeEventListener('scroll', hide, true); window.removeEventListener('resize', hide); window.removeEventListener('keydown', escape); };
  }, [position]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const delayHide = () => { timer.current = setTimeout(hide, 150); };
  return <span className="help-wrap" ref={ref} onPointerEnter={show} onPointerLeave={delayHide} onFocus={show} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) delayHide(); }}>
    {children}
    <button type="button" className="help-trigger" aria-label={title} aria-describedby={position ? id : undefined} aria-expanded={!!position}
      onClick={(e) => { e.stopPropagation(); show(); }}><Info size={14}/></button>
    {position && createPortal(<div id={id} role="tooltip" className={'help-popover ' + (position.below ? 'below' : 'above')} style={{left: position.left, top: position.top, width: position.width}}
      onPointerEnter={() => clearTimeout(timer.current)} onPointerLeave={delayHide}>
      <strong>{title}</strong><p>{description}</p>{value != null && value !== '' && <div className="help-value">{value}</div>}
    </div>, document.body)}
  </span>;
}
