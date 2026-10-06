import React, { useState } from 'react';
import { ChevronRight, X, Plus, Search } from 'lucide-react';
import { months, score } from '../../lib/model.mjs';
import { Localized, useLanguage } from '../../i18n/index.jsx';
import Help from '../../components/common/Help.jsx';
import { statusClass } from '../../lib/status-style.mjs';
export default function Board({
  kpis,
  year,
  month,
  admin,
  openEntry,
  onEdit,
  update,
  newKpi,
}) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null),
    [expanded, setExpanded] = useState(null),
    [query, setQuery] = useState(''),
    [detail, setDetail] = useState(false),
    [pane, setPane] = useState('Overview');
  const ks = kpis.filter((k) =>
      (k.title + ' ' + k.id + ' ' + k.kra)
        .toLowerCase()
        .includes(query.toLowerCase()),
    ),
    k = kpis.find((x) => x.id === selected),
    s = k ? score(k, k.entries[`${year}-${month}`]) : null;
  const num = (x) => (x == null ? '—' : Number(x).toFixed(1));
  function selectKpi(id) { setSelected(id); setPane('Overview'); }
  const rowKey = (event, id) => {
    if (event.target === event.currentTarget && ['Enter', ' '].includes(event.key)) { event.preventDefault(); selectKpi(id); }
  };
  const actions = (kk) => (
    <>
      <div className="action-summary">
        <b>
          {kk.actions.filter((a) => a.status === 'Completed').length}/
          {kk.actions.length} completed
        </b>
        <div className="bar">
          <i
            style={{
              width:
                (kk.actions.length
                  ? (kk.actions.filter((a) => a.status === 'Completed').length /
                      kk.actions.length) *
                    100
                  : 0) + '%',
            }}
          />
        </div>
      </div>
      {kk.actions.map((a, i) => (
        <div className="action-step" key={i}>
          <span className={'step-num ' + statusClass(a.status)}>{i + 1}</span>
          <div>
            <b data-user-content>{a.text}</b>
            <small>
              {a.owner} · Due {a.due || '—'} · <span className={'status-badge ' + statusClass(a.status)}>{t(a.status)}</span>
            </small>
          </div>
        </div>
      ))}
    </>
  );
  return (
    <Localized><div className={'board-layout ' + (!k ? 'no-detail' : '')}>
      <div>
        <section className="panel">
          <div className="panel-head">
            <div className="search">
              <Search size={16} />
              <input
                placeholder="Search KPIs…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="segmented">
              <button
                className={!detail ? 'active' : ''}
                onClick={() => setDetail(false)}
              >
                Compact
              </button>
              <button
                className={detail ? 'active' : ''}
                onClick={() => setDetail(true)}
              >
                Detailed
              </button>
            </div>
          </div>
          {detail && <div className="weight-strip">
            <b>Weight allocation</b>
            <span>
              Assigned weight: {kpis.reduce((a, k) => a + Number(k.weight), 0)}%
              · {kpis.length} KPIs
            </span>
            <small>Each department must total 100%.</small>
          </div>}
          <div className="board-table">
            <table>
              <thead>
                <tr>
                  <th><Help field="title">{t('KPI / Owner')}</Help></th>
                  <th><Help field="target">{t('Target')}</Help></th>
                  <th><Help field="achievement">{t('Achievement')}</Help></th>
                  <th><Help field="performance">{t('Performance')}</Help></th>
                  <th><Help field="status">{t('Status')}</Help></th>
                  {detail && (
                    <>{[['Weight','weight'],['Threshold','threshold'],['Direction','direction'],['KRA','kra'],['Major objective','mo'],['Baseline','baseline'],['Unit','unit'],['Perspective','perspective'],['Requirements','requirements']].map(([label, field]) => <th key={field}><Help field={field}>{t(label)}</Help></th>)}</>
                  )}
                </tr>
              </thead>
              <tbody>
                {ks.map((kk) => {
                  let e = kk.entries[`${year}-${month}`],
                    sc = score(kk, e);
                  return (
                    <React.Fragment key={kk.id}>
                      <tr className={'selectable-kpi-row ' + (k?.id === kk.id ? 'selected-row' : '')}
                        tabIndex={0} aria-label={`${t('View details')}: ${kk.id}`} aria-selected={k?.id === kk.id}
                        onClick={() => selectKpi(kk.id)} onKeyDown={(event) => rowKey(event, kk.id)}>
                        <td>
                          <div className="kpi-row-name">
                            <button
                              aria-label="Expand months"
                              aria-expanded={expanded === kk.id}
                              onClick={(event) => { event.stopPropagation(); setExpanded(expanded === kk.id ? null : kk.id); }}
                            >
                              <ChevronRight className="month-chevron" size={16} />
                            </button>
                            <button onClick={() => selectKpi(kk.id)}>
                              <small>{kk.id}</small>
                              <b data-user-content>{kk.title}</b>
                              <small data-user-content>
                                {kk.actions[0]?.owner || 'Unassigned'}
                              </small>
                            </button>
                          </div>
                        </td>
                        <td>
                          {kk.target}
                          <small>{kk.unit}</small>
                        </td>
                        <td>
                          <button
                            className={'entry-button ' + statusClass(e?.status || 'Pending')}
                            onClick={() => openEntry(kk)}
                          >
                            {e?.status === 'Reported'
                              ? e.achievement
                              : e?.status || 'Pending'}
                          </button>
                        </td>
                        <td>{sc ? num(sc.performance) + '%' : '—'}</td>
                        <td>
                          <span
                            className={
                              'pill ' +
                              (sc
                                ? sc.score >= kk.threshold
                                  ? 'green'
                                  : 'amber'
                                : statusClass(e?.status || 'Pending'))
                            }
                          >
                            {sc
                              ? sc.score >= kk.threshold
                                ? 'On track'
                                : 'Below threshold'
                              : e?.status || 'Pending'}
                          </span>
                        </td>
                        {detail && (
                          <>
                            <td>{kk.weight}%</td>
                            <td>{kk.threshold}/5</td>
                            <td>{t(kk.direction)}</td>
                            <td><span data-user-content>{kk.kra}</span></td>
                            <td><span data-user-content>{kk.mo}</span></td>
                            <td>{kk.baseline}</td>
                            <td>{t(kk.unit)}</td>
                            <td>{t(kk.perspective)}</td>
                            <td><span data-user-content>{kk.requirements}</span></td>
                          </>
                        )}
                      </tr>
                      {expanded === kk.id && (
                        <tr>
                          <td colSpan={detail ? 14 : 5}>
                            <div className="monthly-grid">
                              {months.map((m, i) => {
                                let sc = score(kk, kk.entries[`${year}-${i}`]);
                                return (
                                  <button
                                    key={m}
                                    onClick={() => openEntry(kk, i)}
                                  >
                                    <small>
                                      {t(m)} {year}
                                    </small>
                                    <b>
                                      {sc
                                        ? num(sc.performance) + '%'
                                        : kk.entries[`${year}-${i}`]?.status ||
                                          'Pending'}
                                    </b>
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mobile-kpis">
            {ks.map((kk) => {
              const e = kk.entries[`${year}-${month}`],
                sc = score(kk, e);
              return (
                  <article key={kk.id} className={k?.id === kk.id ? 'selected-card' : ''} tabIndex={0}
                    aria-label={`${t('View details')}: ${kk.id}`} onClick={() => selectKpi(kk.id)} onKeyDown={(event) => rowKey(event, kk.id)}>
                  <small>{kk.id}</small>
                  <h3 data-user-content>{kk.title}</h3>
                  <p>
                    {kk.direction === 'HIGH' ? 'Higher' : 'Lower'} is better
                  </p>
                  <div className="mobile-values">
                    <span>
                      {t('Target')}
                      <b>
                        {kk.target} {kk.unit}
                      </b>
                    </span>
                    <span>
                      {t('Achievement')}
                      <b>{e?.status === 'Reported' ? e.achievement : '—'}</b>
                    </span>
                    <span>
                      {t('Performance')}<b>{sc ? num(sc.performance) + '%' : '—'}</b>
                    </span>
                  </div>
                  {detail && <dl className="mobile-details">{[['KRA','kra'],['Major objective','mo'],['Baseline','baseline'],['Weight','weight'],['Threshold','threshold'],['Unit','unit'],['Perspective','perspective'],['Requirements','requirements']].map(([label, field]) => <div key={field}><dt>{t(label)}</dt><dd data-user-content>{kk[field]}</dd></div>)}</dl>}
                  <button
                    className="primary full"
                    onClick={() => openEntry(kk)}
                  >
                    Update this month
                  </button>
                  <button
                    className="textbutton"
                    onClick={() => selectKpi(kk.id)}
                  >
                    View details
                  </button>
                  <button type="button" className="textbutton" aria-expanded={expanded === kk.id} onClick={(event) => { event.stopPropagation(); setExpanded(expanded === kk.id ? null : kk.id); }}>Expand months</button>
                  {expanded === kk.id && <div className="monthly-grid">{months.map((m, index) => <button key={m} onClick={() => openEntry(kk, index)}><small>{t(m)} {year}</small><b>{t(kk.entries[`${year}-${index}`]?.status || 'Pending')}</b></button>)}</div>}
                </article>
              );
            })}
          </div>
          {!ks.length && <div className="empty">No KPIs found.</div>}
        </section>
        <p className="board-note">
          Pending and documented No Input entries are excluded from scoring.
        </p>
      </div>
      {k && (
        <section className="panel detail-pane">
          <div className="detail-heading">
            <div>
              <h2 data-user-content>{k.title}</h2>
              <small>{k.id}</small>
            </div>
            <button type="button" className="detail-close" aria-label={t('Close')} onClick={() => setSelected(null)}><X size={18}/></button>
          </div>
          <div className="segmented">
            {['Overview', 'Action plan', 'History'].map((t) => (
              <button
                key={t}
                className={pane === t ? 'active' : ''}
                onClick={() => setPane(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {pane === 'Overview' && (
            <>
              <dl>
                {[
                  ['KRA', 'kra'],
                  ['Major objective', 'mo'],
                  ['Aligned with ORG/DEPT/Section goals', 'orgGoal'],
                  ['SMART KPI', 'title'],
                  ['Perspective', 'perspective'],
                  ['Weight', 'weight'],
                  ['Threshold', 'threshold'],
                  ['Direction', 'direction'],
                  ['Unit', 'unit'],
                  ['Baseline', 'baseline'],
                  ['Target', 'target'],
                  ['Requirements', 'requirements'],
                ].map(([label, f]) => (
                  <div key={f}>
                    <dt><Help field={f}>{t(label)}</Help></dt>
                    <dd>
                      <button data-user-content disabled={!admin} onClick={() => onEdit(k, f)}>
                        {['perspective','direction','unit'].includes(f) ? t(k[f]) : k[f] === '' || k[f] == null ? '—' : k[f]}
                        {f === 'weight' ? '%' : f === 'threshold' ? ' / 5' : ''}
                      </button>
                    </dd>
                  </div>
                ))}
                <div>
                  <dt>Performance</dt>
                  <dd>
                    {num(s?.performance)}
                    {s ? '%' : ''}
                  </dd>
                </div>
                <div>
                  <dt>Score</dt>
                  <dd>{num(s?.score)} / 5</dd>
                </div>
              </dl>
              <div className="calculation">
                <b>Calculation</b>
                <p>
                  {s
                    ? `${k.direction === 'HIGH' ? k.entries[`${year}-${month}`].achievement : s.target} / ${k.direction === 'HIGH' ? s.target : k.entries[`${year}-${month}`].achievement} × 100 = ${num(s.performance)}%`
                    : 'Awaiting a valid reported entry.'}
                </p>
                <small>
                  Score capped at 5. Zero values follow the configured zero
                  rules.
                </small>
              </div>
              <button className="primary full" onClick={() => openEntry(k)}>
                Update achievement
              </button>
            </>
          )}
          {pane === 'Action plan' && actions(k)}
          {pane === 'History' && (
            <>
              <p>Monthly record history</p>
              {Object.entries(k.entries)
                .sort()
                .map(([key, e]) => (
                  <div className="history-row" key={key}>
                    <b>
                      {months[Number(key.split('-')[1])]} {key.split('-')[0]}
                    </b>
                    <p>
                      {t(e.status)} · {t('Achievement')}: {e.achievement ?? '—'}
                    </p>
                    <small data-user-content>{e.remarks}</small>
                  </div>
                ))}
              <small>
                This local prototype stores monthly records, not a full audit
                trail.
              </small>
            </>
          )}
        </section>
      )}
    </div></Localized>
  );
}
