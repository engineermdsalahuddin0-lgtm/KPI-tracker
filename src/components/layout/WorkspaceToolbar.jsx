import React from 'react';
import { Localized, useLanguage } from '../../i18n/index.jsx';
import { Plus, Download } from 'lucide-react';
import { departments, months } from '../../lib/model.mjs';
export default function WorkspaceToolbar({ tab,year,setYear,month,setMonth,dept,setDept,admin,setExportOpen,newKpi }) {

  return <Localized><>          <div className="page-head">
            <div>
              <span className="eyebrow">BITOPI GROUP / {year}</span>
              <h1>
                {tab === 'Overview'
                  ? 'Performance overview'
                  : tab === 'KPI board'
                    ? 'KPI board'
                    : 'Action plans'}
              </h1>
              <p>
                {tab === 'Overview'
                  ? 'See how every department is progressing against its goals.'
                  : tab === 'KPI board'
                    ? 'Define goals, record achievements and keep progress visible.'
                    : 'Turn objectives into clear, accountable steps.'}
              </p>
            </div>
            <div className="head-actions">
              <button className="button" onClick={() => setExportOpen(true)}>
                <Download size={16} />
                Download Excel
              </button>
              {admin && (
                <button className="primary" onClick={newKpi}>
                  <Plus size={18} />
                  Add KPI
                </button>
              )}
            </div>
          </div>
          <div className="toolbar">
            <div className="filters">
              {admin && (
                <select
                  aria-label="Department"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                >
                  <option>All departments</option>
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              )}
              <select
                aria-label="Year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {[2025, 2026, 2027, 2028].map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
              <select
                aria-label="Month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {months.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <span className="sample">Jan–Feb: sample · Mar–Dec: pending</span>
          </div>
</></Localized>;
}
