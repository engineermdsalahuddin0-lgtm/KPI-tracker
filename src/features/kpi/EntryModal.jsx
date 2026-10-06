import React from 'react';
import { Localized, useLanguage } from '../../i18n/index.jsx';
import { X } from 'lucide-react';
export default function EntryModal({ edit,setEdit,error,saveEdit,admin }) {

  return <Localized><div className="overlay">
          <section className="modal">
            <div className="modal-top">
              <h2>{edit.label}</h2>
              <button aria-label="Close" onClick={() => setEdit(null)}>
                <X />
              </button>
            </div>
            <div className="form-area">
              {edit.kind === 'field' ? (
                <label>
                  Value
                  {['perspective', 'threshold', 'direction', 'unit'].includes(
                    edit.field,
                  ) ? (
                    <select
                      value={edit.value}
                      onChange={(e) =>
                        setEdit({ ...edit, value: e.target.value })
                      }
                    >
                      {{
                        perspective: [
                          'Process',
                          'Account',
                          'Learning&Development',
                          'Customer',
                        ],
                        threshold: [4, 4.5, 5],
                        direction: ['HIGH', 'LOW'],
                        unit: [
                          'Number',
                          'Percent',
                          'Day',
                          'Currency (BDT)',
                          'Unit',
                        ],
                      }[edit.field].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={
                        ['weight', 'target', 'baseline'].includes(edit.field)
                          ? 'number'
                          : 'text'
                      }
                      value={edit.value}
                      onChange={(e) =>
                        setEdit({ ...edit, value: e.target.value })
                      }
                    />
                  )}
                </label>
              ) : (
                <>
                  {[
                    'status',
                    'achievement',
                    'override',
                    'policy',
                    'eligible',
                    'remarks',
                  ].map((f) => (
                    <label key={f}>
                      {
                        {
                          status: 'Entry status',
                          achievement: 'Achievement',
                          override: 'Monthly target override (optional)',
                          policy: 'Target policy',
                          eligible: 'Eligible input available before deadline',
                          remarks: 'Remarks / RCA',
                        }[f]
                      }
                      {['status', 'policy'].includes(f) ? (
                        <select
                          value={edit.value[f]}
                          onChange={(e) =>
                            setEdit({
                              ...edit,
                              value: { ...edit.value, [f]: e.target.value },
                            })
                          }
                        >
                          {(f === 'status'
                            ? ['Pending', 'Reported', 'No Input']
                            : ['Fixed', 'Workload Adjusted']
                          ).map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={f === 'remarks' ? 'text' : 'number'}
                          min="0"
                          value={edit.value[f]}
                          onChange={(e) =>
                            setEdit({
                              ...edit,
                              value: { ...edit.value, [f]: e.target.value },
                            })
                          }
                        />
                      )}
                    </label>
                  ))}
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={!!edit.value.external}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          value: { ...edit.value, external: e.target.checked },
                        })
                      }
                    />
                    No input dependency is outside employee responsibility
                  </label>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      disabled={!admin}
                      checked={!!edit.value.approved}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          value: { ...edit.value, approved: e.target.checked },
                        })
                      }
                    />
                    Management approves workload adjustment
                  </label>
                </>
              )}
            </div>
            {error && <p className="error">{error}</p>}
            <div className="modal-bottom">
              <button className="button" onClick={() => setEdit(null)}>
                Cancel
              </button>
              <button className="primary" onClick={saveEdit}>
                Save changes
              </button>
            </div>
          </section>
        </div></Localized>;
}
