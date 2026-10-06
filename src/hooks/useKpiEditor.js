import { useState } from 'react';
import { months } from '../lib/model.mjs';
const emptyEntry = () => ({
  status: 'Pending',
  achievement: '',
  remarks: '',
  override: '',
  policy: 'Fixed',
  eligible: '',
  approved: false,
});

export default function useKpiEditor({kpis,setKpis,update,year,month,dept,admin}) {
  const [wizard,setWizard] = useState(null), [step,setStep] = useState(0), [mode,setMode] = useState('Direct KPI'), [error,setError] = useState(''), [edit,setEdit] = useState(null);
  function newKpi() {
    setStep(0);
    setError('');
    setWizard({
      id: `KPI-${Date.now().toString().slice(-6)}`,
      dept: dept === 'All departments' ? 'ERP & IT' : dept,
      kra: '',
      mo: '',
      title: '',
      specific: '',
      measure: '',
      achievable: 'Yes',
      relevant: 'Yes',
      time: '',
      perspective: 'Process',
      weight: 0,
      threshold: 4.5,
      requirements: '',
      direction: 'HIGH',
      unit: 'Number',
      baseline: 0,
      target: '',
      actions: Array.from({ length: 3 }, () => ({
        text: '',
        owner: '',
        due: '',
        status: 'Pending',
        remarks: '',
      })),
      entryMonth: month,
      achievement: '',
      entries: {},
    });
  }
  const w = (field, val) => setWizard((x) => ({ ...x, [field]: val }));
  function next() {
    setError('');
    if (step === 0 && (!wizard.kra.trim() || !wizard.mo.trim()))
      return setError('Enter one KRA and one major objective.');
    if (step === 1) {
      if (mode === 'SMART builder') {
        if (
          !wizard.specific.trim() ||
          !wizard.measure.trim() ||
          !wizard.time.trim() ||
          wizard.achievable !== 'Yes' ||
          wizard.relevant !== 'Yes'
        )
          return setError(
            'Complete all SMART fields; achievable and relevant must be Yes.',
          );
        w(
          'title',
          `${wizard.specific}. Measure: ${wizard.measure}. Deadline: ${wizard.time}.`,
        );
      } else if (!wizard.title.trim())
        return setError('Enter a measurable KPI.');
    }
    if (
      step === 2 &&
      (!wizard.actions.some((a) => a.text.trim()) ||
        wizard.actions.some((a) => a.text.trim() && !a.owner.trim()))
    )
      return setError(
        'Add an action and responsible person for each entered action.',
      );
    if (step === 4) {
      let used = kpis
        .filter((k) => k.dept === wizard.dept)
        .reduce((a, k) => a + Number(k.weight), 0);
      if (Number(wizard.weight) <= 0 || used + Number(wizard.weight) > 100)
        return setError(
          `Department already has ${used}% assigned. Reduce existing weights first; total cannot exceed 100%.`,
        );
    }
    if (
      step === 5 &&
      (wizard.target === '' ||
        Number(wizard.target) < 0 ||
        Number(wizard.baseline) < 0)
    )
      return setError('Enter non-negative baseline and target.');
    if (step === 6) {
      if (wizard.achievement !== '' && Number(wizard.achievement) < 0)
        return setError('Achievement cannot be negative.');
      if (kpis.length >= 60)
        return setError('This version supports up to 60 KPIs.');
      let entries = {};
      if (wizard.achievement !== '')
        entries[`${year}-${wizard.entryMonth}`] = {
          ...emptyEntry(),
          status: 'Reported',
          achievement: Number(wizard.achievement),
        };
      setKpis([
        ...kpis,
        {
          ...wizard,
          actions: wizard.actions.filter((a) => a.text.trim()),
          entries,
        },
      ]);
      setWizard(null);
    } else setStep(step + 1);
  }

  function saveEdit() {
    setError('');
    if (edit.kind === 'entry') {
      let e = edit.value;
      if (
        e.status === 'Reported' &&
        (e.achievement === '' || Number(e.achievement) < 0)
      )
        return setError('Reported achievement must be a non-negative number.');
      if (e.override !== '' && Number(e.override) < 0)
        return setError('Target cannot be negative.');
      if (e.status === 'No Input' && (!e.external || !e.remarks.trim()))
        return setError(
          'No Input needs an external dependency and remarks/RCA.',
        );
      if (
        e.policy === 'Workload Adjusted' &&
        (!e.approved || e.eligible === '' || Number(e.eligible) < 0)
      )
        return setError(
          'Workload adjustment requires admin approval and non-negative eligible input.',
        );
      if (!admin && e.policy === 'Workload Adjusted' && !edit.original.approved)
        return setError('Ask admin to approve workload adjustment first.');
      let k = kpis.find((k) => k.id === edit.id);
      update(k.id, 'entries', { ...k.entries, [edit.key]: e });
    } else {
      let val = edit.value;
      if (['weight', 'baseline', 'target', 'threshold'].includes(edit.field)) {
        val = Number(val);
        if (!Number.isFinite(val) || val < 0)
          return setError('Enter a non-negative number.');
      }
      if (edit.field === 'weight') {
        let k = kpis.find((k) => k.id === edit.id),
          used = kpis
            .filter((x) => x.dept === k.dept && x.id !== k.id)
            .reduce((a, x) => a + Number(x.weight), 0);
        if (used + val > 100)
          return setError('Department weights cannot exceed 100%.');
      }
      if (typeof val === 'string' && !val.trim())
        return setError('This field is required.');
      update(edit.id, edit.field, val);
    }
    setEdit(null);
  }
  function openEntry(k, m = month) {
    let e = k.entries[`${year}-${m}`] || emptyEntry();
    setError('');
    setEdit({
      kind: 'entry',
      id: k.id,
      key: `${year}-${m}`,
      label: `${k.id} · ${months[m]} ${year}`,
      value: { ...e },
      original: { ...e },
    });
  }

  function openField(k,field) {
    setError('');
    setEdit({kind:'field',id:k.id,field,value:k[field],label:`${k.id} · ${field}`});
  }
  return {wizard,setWizard,step,setStep,mode,setMode,error,setError,edit,setEdit,newKpi,w,next,saveEdit,openEntry,openField};
}
