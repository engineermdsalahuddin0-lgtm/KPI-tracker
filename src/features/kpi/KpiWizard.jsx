import React from 'react';
import { Localized, useLanguage } from '../../i18n/index.jsx';
import { X, Plus, ChevronRight } from 'lucide-react';
import { departments, months, goalAlignments } from '../../lib/model.mjs';
export default function KpiWizard({ wizard,step,mode,error,setWizard,setStep,setMode,w,next,kpis,year }) {
  const field = (label, key, type = 'text') => (
    <label>
      {label}
      <input
        type={type}
        min={type === 'number' ? 0 : undefined}
        value={wizard[key]}
        onChange={(e) => w(key, e.target.value)}
      />
    </label>
  );
  const select = (label, key, opts) => (
    <label>
      {label}
      <select value={wizard[key]} onChange={(e) => w(key, e.target.value)}>
        {opts.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
    </label>
  );

  return <Localized><div className="overlay">
          <section className="modal">
            <div className="modal-top">
              <div>
                <span className="eyebrow">NEW KPI · STEP {step + 1} OF 7</span>
                <h2>
                  {
                    [
                      'Define the objective',
                      'Build your SMART KPI',
                      'Plan the work',
                      'Requirements',
                      'Allocate weight',
                      'Set the measurement',
                      'First monthly achievement',
                    ][step]
                  }
                </h2>
              </div>
              <button onClick={() => setWizard(null)} aria-label="Close">
                <X />
              </button>
            </div>
            <div className="progress-steps">
              {Array.from({ length: 7 }, (_, i) => (
                <span key={i} className={i <= step ? 'filled' : ''} />
              ))}
            </div>
            <div className="form-area">
              {step === 0 && (
                <>
                  {select('Department', 'dept', departments)}
                  {field('Key result area (one KRA)', 'kra')}
                  {field('Major objective (one MO)', 'mo')}
                  <label>Aligned with ORG/DEPT/Section goals
                    <select aria-label="Aligned with ORG/DEPT/Section goals" value={wizard.orgGoal} onChange={(e) => w('orgGoal', e.target.value)}>
                      <option value="">Select alignment</option>
                      {goalAlignments.map((alignment) => <option key={alignment} value={alignment}>{alignment}</option>)}
                    </select>
                  </label>
                </>
              )}
              {step === 1 && (
                <>
                  <div className="segmented">
                    {['Direct KPI', 'SMART builder'].map((x) => (
                      <button
                        className={mode === x ? 'active' : ''}
                        onClick={() => setMode(x)}
                        key={x}
                      >
                        {x}
                      </button>
                    ))}
                  </div>
                  {mode === 'Direct KPI' ? (
                    <label>
                      SMART KPI
                      <textarea
                        value={wizard.title}
                        onChange={(e) => w('title', e.target.value)}
                        placeholder="Deliver 100% of monthly reports by the agreed deadline"
                      />
                    </label>
                  ) : (
                    <>
                      {field('Specific goal (S)', 'specific')}
                      {field('Measure (M)', 'measure')}
                      {select('Achievable (A)', 'achievable', ['Yes', 'No'])}
                      {select('Relevant (R)', 'relevant', ['Yes', 'No'])}
                      {field('Time / deadline (T)', 'time')}
                    </>
                  )}
                  {select('Perspective', 'perspective', [
                    'Process',
                    'Account',
                    'Learning&Development',
                    'Customer',
                  ])}
                </>
              )}
              {step === 2 && (
                <>
                  {wizard.actions.map((a, i) => (
                    <div className="action-input" key={i}>
                      <b>Step {i + 1}</b>
                      <input
                        placeholder="Action"
                        value={a.text}
                        onChange={(e) =>
                          w(
                            'actions',
                            wizard.actions.map((x, j) =>
                              j === i ? { ...x, text: e.target.value } : x,
                            ),
                          )
                        }
                      />
                      <input
                        placeholder="Responsible person"
                        value={a.owner}
                        onChange={(e) =>
                          w(
                            'actions',
                            wizard.actions.map((x, j) =>
                              j === i ? { ...x, owner: e.target.value } : x,
                            ),
                          )
                        }
                      />
                      <input
                        type="date"
                        aria-label="Due date"
                        value={a.due}
                        onChange={(e) =>
                          w(
                            'actions',
                            wizard.actions.map((x, j) =>
                              j === i ? { ...x, due: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </div>
                  ))}
                  <button
                    className="button"
                    onClick={() =>
                      w('actions', [
                        ...wizard.actions,
                        {
                          text: '',
                          owner: '',
                          due: '',
                          status: 'Pending',
                          remarks: '',
                        },
                      ])
                    }
                  >
                    <Plus size={16} />
                    Add action
                  </button>
                </>
              )}
              {step === 3 && (
                <label>
                  Requirements
                  <textarea
                    value={wizard.requirements}
                    onChange={(e) => w('requirements', e.target.value)}
                    placeholder="People, approved input, tools or resources"
                  />
                </label>
              )}
              {step === 4 && (
                <>
                  {select('Weight (%)', 'weight', [
                    0,
                    ...Array.from({ length: 100 }, (_, i) => i + 1),
                  ])}
                  {select(
                    'Threshold (minimum score / 5)',
                    'threshold',
                    [4, 4.5, 5],
                  )}
                  <p className="demo-note">
                    Current department allocation:{' '}
                    {kpis
                      .filter((k) => k.dept === wizard.dept)
                      .reduce((a, k) => a + Number(k.weight), 0)}
                    %. Total may not exceed 100%. Threshold 4 / 4.5 / 5 means
                    80% / 90% / 100%.
                  </p>
                </>
              )}
              {step === 5 && (
                <>
                  <div className="segmented">
                    {['HIGH', 'LOW'].map((x) => (
                      <button
                        key={x}
                        className={wizard.direction === x ? 'active' : ''}
                        onClick={() => w('direction', x)}
                      >
                        {x === 'HIGH' ? 'Higher is better' : 'Lower is better'}
                      </button>
                    ))}
                  </div>
                  {select('Measurement unit', 'unit', [
                    'Number',
                    'Percent',
                    'Day',
                    'Currency (BDT)',
                    'Unit',
                  ])}
                  <p className="hint">
                    For percent, use percentage points: 90 means 90%. Baseline
                    and target use the same unit.
                  </p>
                  {field('Baseline', 'baseline', 'number')}
                  {field('Target', 'target', 'number')}
                </>
              )}
              {step === 6 && (
                <>
                  <label>
                    Month
                    <select
                      value={wizard.entryMonth}
                      onChange={(e) => w('entryMonth', Number(e.target.value))}
                    >
                      {months.map((m, i) => (
                        <option value={i} key={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>
                  {field(
                    `Achievement (${wizard.unit}) — optional`,
                    'achievement',
                    'number',
                  )}
                  <p className="hint">Leave blank to create a Pending entry.</p>
                </>
              )}
            </div>
            {error && <p className="error">{error}</p>}
            <div className="modal-bottom">
              <button
                className="button"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
              <button className="primary" onClick={next}>
                {step === 6 ? 'Create KPI' : 'Continue'}
                <ChevronRight size={16} />
              </button>
            </div>
          </section>
        </div></Localized>;
}
