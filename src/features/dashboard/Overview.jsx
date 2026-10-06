import React from 'react';
import { Localized, useLanguage } from '../../i18n/index.jsx';
import { Info, ChevronRight, ArrowUpRight } from 'lucide-react';
import { departments, months, summary } from '../../lib/model.mjs';
export default function Overview({ kpis,visible,year,month,dept,setDept,setTab,setChat,setQuestion }) {
  const { language, t } = useLanguage();
  const stats = summary(visible, year, month);
  const actions = visible.flatMap((k) => k.actions);
  const done = actions.filter((a) => a.status === 'Completed').length, total = actions.length;
  const fmt = (x) => x == null ? '—' : x.toFixed(1);
  return <Localized><>
              <div className="metrics">
                {[
                  [
                    'Weighted performance',
                    stats.performance == null
                      ? '—'
                      : fmt(stats.performance) + '%',
                    'Valid reported KPIs only',
                  ],
                  [
                    'Average score',
                    stats.score == null ? '—' : fmt(stats.score) + ' / 5',
                    'Weighted by KPI allocation',
                  ],
                  [
                    'Scoring coverage',
                    fmt(stats.coverage) + '%',
                    'Share of assigned weight scored',
                  ],
                  [
                    'Action completion',
                    `${done} / ${total}`,
                    total
                      ? `${Math.round((done / total) * 100)}% of steps completed`
                      : 'No steps assigned',
                  ],
                ].map(([label, value, sub]) => (
                  <div className="metric" key={label}>
                    <div>
                      {label}
                      <Info size={15} title={t(sub)} />
                    </div>
                    <strong>{value}</strong>
                    <small>{sub}</small>
                  </div>
                ))}
              </div>
              <div className="overview-grid">
                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h3>Department performance</h3>
                      <p>
                        {months[month]} {year} · weighted results
                      </p>
                    </div>
                    <span className="pill">
                      {dept === 'All departments' ? departments.length : 1}{' '}
                      departments
                    </span>
                  </div>
                  <div className="department-list">
                    {(dept === 'All departments' ? departments : [dept]).map(
                      (d) => {
                        let ks = kpis.filter((k) => k.dept === d),
                          s = summary(ks, year, month);
                        return (
                          <button
                            className="department-row"
                            key={d}
                            onClick={() => {
                              setDept(d);
                              setTab('KPI board');
                            }}
                          >
                            <span className="dept-icon">
                              {d.slice(0, 2).toUpperCase()}
                            </span>
                            <div className="dept-name">
                              <b>{d}</b>
                              <small>
                                {ks.length} KPIs · {fmt(s.coverage)}% coverage
                              </small>
                            </div>
                            <div className="bar">
                              <i
                                style={{
                                  width:
                                    Math.min(100, s.performance || 0) + '%',
                                }}
                              />
                            </div>
                            <strong>
                              {s.performance == null
                                ? 'Pending'
                                : fmt(s.performance) + '%'}
                            </strong>
                            <span
                              className={
                                'pill ' +
                                (s.assigned === 100 ? 'green' : 'amber')
                              }
                            >
                              {s.assigned}% weight
                            </span>
                            <ChevronRight size={16} />
                          </button>
                        );
                      },
                    )}
                  </div>
                </section>
                <div>
                  <section className="panel annual">
                    <h3>Year at a glance</h3>
                    <p>{year} · monthly weighted performance</p>
                    <div className="chart">
                      {months.map((m, i) => {
                        let s = summary(visible, year, i);
                        return (
                          <div
                            key={m}
                            title={`${t(m)}: ${s.performance == null ? t('Pending') : fmt(s.performance) + '%'}`}
                          >
                            <div className="chart-track">
                              <i
                                style={{
                                  height:
                                    Math.min(100, s.performance || 0) + '%',
                                }}
                              />
                            </div>
                            <small>{language === 'bn' ? t(m).slice(0, 3) : m.slice(0, 3)}</small>
                          </div>
                        );
                      })}
                    </div>
                    <small>Pending and No Input entries are excluded.</small>
                  </section>
                  <section className="panel insight">
                    <span className="eyebrow">READ YOUR RESULTS</span>
                    <h3>A score needs context.</h3>
                    <p>
                      Performance reflects reported work. Coverage shows how
                      much assigned work was evaluated.
                    </p>
                    <button
                      className="textbutton"
                      onClick={() => {
                        setChat(true);
                        setQuestion(language === 'bn' ? 'KPI-এর ওজন (Weight) কেন গুরুত্বপূর্ণ?' : 'What is KPI weight?');
                      }}
                    >
                      Ask the KPI assistant <ArrowUpRight size={16} />
                    </button>
                  </section>
                  <section className="panel">
                    <h3>Weight allocation</h3>
                    <p>
                      {
                        departments.filter(
                          (d) =>
                            kpis
                              .filter((k) => k.dept === d)
                              .reduce((a, k) => a + Number(k.weight), 0) !==
                            100,
                        ).length
                      }{' '}
                      departments need review
                    </p>
                    <small>
                      Every department must total 100%. New weight cannot exceed
                      100%.
                    </small>
                  </section>
                </div>
              </div>
            </></Localized>;
}
