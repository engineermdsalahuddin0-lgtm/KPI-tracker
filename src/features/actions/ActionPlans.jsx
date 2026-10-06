import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, X } from 'lucide-react';
import { Localized, useLanguage } from '../../i18n/index.jsx';
import { statusClass } from '../../lib/status-style.mjs';

export default function ActionPlans({ kpis, admin, update }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const current = kpis.find((k) => k.id === selected);
  const all = kpis.flatMap((k) => k.actions);
  const done = all.filter((a) => a.status === 'Completed').length;
  useEffect(() => {
    if (!current) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector('button')?.focus();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, [current?.id]);
  const setAction = (k, index, field, value) => update(k.id, 'actions', k.actions.map((a, i) => i === index ? { ...a, [field]: value } : a));
  function keyboard(event) {
    if (event.key === 'Escape') { event.preventDefault(); setSelected(null); }
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button, input, select, textarea, [tabindex="0"]')].filter((node) => !node.disabled);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return <Localized><>
    <div className="action-summary">
      <div><h3>{done} of {all.length} steps complete</h3><p>Progress across your selected department</p></div>
      <div className="bar"><i style={{ width: `${all.length ? done / all.length * 100 : 0}%` }}/></div>
      <b>{all.length ? Math.round(done / all.length * 100) : 0}%</b>
    </div>
    <div className="action-grid compact-actions">
      {kpis.map((k) => {
        const completed = k.actions.filter((a) => a.status === 'Completed').length;
        const percent = k.actions.length ? Math.round(completed / k.actions.length * 100) : 0;
        const status = k.actions.length && completed === k.actions.length ? 'Completed' : k.actions.some((a) => a.status === 'In progress' || a.status === 'Completed') ? 'In progress' : 'Pending';
        return <button type="button" key={k.id} className="panel action-card" aria-haspopup="dialog" onClick={() => setSelected(k.id)}>
          <div className="action-card-top"><span>{k.id}</span><span className={'status-badge ' + statusClass(status)}>{t(status)}</span><ChevronRight size={17}/></div>
          <h3 data-user-content>{k.title}</h3>
          <div className="action-card-progress"><span>{completed} / {k.actions.length} {t('completed')}</span><b>{percent}%</b></div>
          <div className={'bar status-bar ' + statusClass(status)} role="progressbar" aria-label={`${t('Action completion')}: ${k.id}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><i style={{width:`${percent}%`}}/></div>
        </button>;
      })}
    </div>
    {current && <div className="overlay action-overlay" onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section ref={dialog} className="modal action-modal" role="dialog" aria-modal="true" aria-labelledby="action-plan-title" onKeyDown={keyboard}>
        <div className="modal-top"><div><span className="eyebrow">{current.id} · {t('Action plan')}</span><h2 id="action-plan-title" data-user-content>{current.title}</h2></div><button type="button" aria-label={t('Close')} onClick={() => setSelected(null)}><X size={20}/></button></div>
        <div className="action-modal-body">
          {!current.actions.length && <p>{t('No steps assigned')}</p>}
          {current.actions.map((a, index) => <div className="action-step" key={index}>
            <span className={'step-num ' + statusClass(a.status)}>{a.status === 'Completed' ? <Check size={16}/> : index + 1}</span>
            <div>
              {admin ? <label>Action description<input value={a.text} onChange={(e) => setAction(current,index,'text',e.target.value)}/></label> : <b data-user-content>{a.text}</b>}
              {admin ? <div className="action-owner-date"><label>Responsible person<input value={a.owner} onChange={(e) => setAction(current,index,'owner',e.target.value)}/></label><label>Due date<input type="date" value={a.due || ''} onChange={(e) => setAction(current,index,'due',e.target.value)}/></label></div> : <small><span data-user-content>{a.owner}</span> · {t('Due')}: {a.due || '—'}</small>}
              <label>Status<select className={statusClass(a.status)} value={a.status} onChange={(e) => setAction(current,index,'status',e.target.value)}>{['Pending','In progress','Completed'].map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
              <label>Action remarks<input value={a.remarks || ''} onChange={(e) => setAction(current,index,'remarks',e.target.value)}/></label>
            </div>
          </div>)}
        </div>
        <div className="modal-bottom"><small>{t('Changes saved on this device')}</small><button type="button" className="button" onClick={() => setSelected(null)}>Close</button></div>
      </section>
    </div>}
  </></Localized>;
}
