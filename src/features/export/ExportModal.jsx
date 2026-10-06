import React, { useState } from 'react';
import { X, Download, Check } from 'lucide-react';
import { Localized, useLanguage } from '../../i18n/index.jsx';
import { goalAlignments } from '../../lib/model.mjs';
export default function ExportModal({
  kpis,
  departments,
  year,
  initialDept,
  onClose,
}) {
  const { language, t } = useLanguage();
  const [reportLanguage, setReportLanguage] = useState(language);
  const [alignmentOverrides, setAlignmentOverrides] = useState({});
  const [downloadReady, setDownloadReady] = useState(false);
  const [scope, setScope] = useState('Department'),
    [dept, setDept] = useState(
      initialDept === 'All departments' ? departments[0] : initialDept,
    ),
    [reportYear, setYear] = useState(year),
    [period, setPeriod] = useState('Full year'),
    [type, setType] = useState('Performance'),
    [id, setId] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [meta, setMeta] = useState({
      hod: '',
      unit: '',
      location: '',
      section: '',
      subsection: '',
    });
  const list = kpis.filter((k) => k.dept === dept),
    selected =
      scope === 'Single KPI'
        ? list.filter((k) => k.id === (id || list[0]?.id))
        : list,
    chosen = selected.map((k) => ({ ...k, orgGoal: alignmentOverrides[k.id] ?? k.orgGoal ?? '' }));
  async function download() {
    setBusy(true);
    setError('');
    setDownloadReady(false);
    try {
      if (!chosen.length) throw Error(t('No KPIs selected.'));
      const { buildOriginalReport } = await import('./excel-export.mjs');
      const b = await buildOriginalReport(chosen, {
        year: Number(reportYear),
        dept,
        period,
        reportType: type,
        language: reportLanguage,
        ...meta,
      });
      const url = URL.createObjectURL(
        new Blob([b], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bitopi-${dept.replace(/[^a-z0-9]/gi, '_')}-${reportYear}-${type}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setDownloadReady(true);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Localized><div className="overlay">
      <section className="modal export-modal">
        <div className="modal-top">
          <div>
            <h2>Download KPI report</h2>
            <p>{language === 'bn' ? 'আগের Excel template-এর format-এ ডাউনলোড হবে।' : 'Download in the original Excel template format.'}</p>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="export-layout">
          <div className="export-settings">
            <div className="segmented">
              {['Department', 'Single KPI'].map((s) => (
                <button
                  key={s}
                  className={s === scope ? 'active' : ''}
                  onClick={() => setScope(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <label>
              Department
              <select
                value={dept}
                onChange={(e) => {
                  setDept(e.target.value);
                  setId('');
                }}
              >
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            {scope === 'Single KPI' && (
              <label>
                KPI
                <select
                  value={id || list[0]?.id || ''}
                  onChange={(e) => setId(e.target.value)}
                >
                  {list.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.id} · {k.title}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label>
              Year
              <input
                type="number"
                min="2000"
                max="2100"
                value={reportYear}
                onChange={(e) => setYear(e.target.value)}
              />
            </label>
            <label>
              Reporting period
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                {['Full year', 'Jan–Jun', 'Jul–Dec'].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Report content
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option>Performance</option>
                <option>Targets</option>
              </select>
            </label>
            <label>Report language<select value={reportLanguage} onChange={(e) => setReportLanguage(e.target.value)}><option value="bn">বাংলা</option><option value="en">English</option></select></label>
            <details>
              <summary>Department details</summary>
              {Object.keys(meta).map((f) => (
                <label key={f}>
                  {f}
                  <input
                    value={meta[f]}
                    onChange={(e) => setMeta({ ...meta, [f]: e.target.value })}
                  />
                </label>
              ))}
            </details>
            <div className="demo-note">v.3 HR 25.6.26.xlsx</div>
            <small>{language === 'bn' ? 'আগের column, quarter/month এবং action row-এর format থাকবে। বিস্তারিত হিসাব Monthly Results-এ পাবেন।' : 'Original columns, quarter/month layout and action rows. Detailed calculations are in Monthly Results.'}</small>
          </div>
          <div className="export-preview">
            <h3>Excel report preview</h3>
            <p>
              Layout summary · {chosen.length} KPIs ·{' '}
              {chosen.reduce((a, k) => a + Number(k.weight), 0)}% weight
            </p>
            <div className="sheet-preview">
              <h3>
                {type === 'Targets' ? 'Goal Setting' : 'KPI Performance Report'}
                : Department ({period} {reportYear})
              </h3>
              <p>
                Department: {dept} · HOD: {meta.hod || '—'}
              </p>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      {[
                        'KPI ID',
                        'KRA',
                        'Major Objective',
                        'Aligned with ORG/DEPT/Section goals',
                        'KPI',
                        'Weight',
                        'Baseline',
                        'Target',
                        'Unit',
                        'Threshold',
                        'Requirements',
                      ].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chosen.map((k, i) => (
                      <tr key={k.id}>
                        <td>{k.id}</td>
                        <td data-user-content>{k.kra}</td>
                        <td data-user-content>{k.mo}</td>
                        <td><select aria-label={`${t('Aligned with ORG/DEPT/Section goals')}: ${k.id}`} value={k.orgGoal}
                          onChange={(e) => setAlignmentOverrides((values) => ({ ...values, [k.id]: e.target.value }))}>
                          <option value="">Select alignment</option>
                          {goalAlignments.map((alignment) => <option key={alignment} value={alignment}>{alignment}</option>)}
                        </select></td>
                        <td data-user-content>{k.title}</td>
                        <td>{k.weight}%</td>
                        <td>{k.baseline}</td>
                        <td>{k.target}</td>
                        <td>{k.unit}</td>
                        <td>{k.threshold}</td>
                        <td data-user-content>{k.requirements}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="board-note">
              {language === 'bn' ? 'প্রিভিউতে প্রতিটি KPI-এর ORG / DEPT / SEC বেছে নিতে পারেন। এই পরিবর্তন শুধু ডাউনলোডে প্রযোজ্য; মূল KPI-তে save হবে না।' : 'Choose ORG / DEPT / SEC for each KPI in the preview. These selections apply to this download only; stored KPIs stay unchanged.'}
            </p>
            <p className="board-note">
              {language === 'bn' ? 'এখানে নির্বাচিত KPI-এর সংক্ষিপ্ত প্রিভিউ। ডাউনলোডে আগের template-এর merged KPI/action row এবং ১২ মাসের column থাকবে।' : 'This is a short preview of the selected KPIs. Download uses the original template’s merged KPI/action rows and 12 monthly columns.'}
            </p>
            <small>
              {language === 'bn' ? 'বাংলা বা English রিপোর্ট বেছে নিন। আপনার লেখা KPI ও অন্য তথ্য অপরিবর্তিত থাকবে।' : 'Choose Bangla or English report labels. Your entered KPI content stays unchanged.'}
            </small>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        {downloadReady && <p role="status">{language === 'bn' ? 'Excel ফাইল তৈরি হয়েছে। ব্রাউজারের Downloads-এ দেখুন।' : 'Excel file prepared. Check your browser downloads.'}</p>}
        <div className="modal-bottom">
          <button className="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary"
            disabled={busy || !chosen.length}
            onClick={download}
          >
            <Download size={16} />
            {busy ? 'Preparing…' : 'Download .xlsx'}
          </button>
        </div>
      </section>
    </div></Localized>
  );
}
