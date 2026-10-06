import React from 'react';
import { Localized, useLanguage } from '../../i18n/index.jsx';
import { LayoutDashboard, ListChecks, ClipboardList, LogOut } from 'lucide-react';
export default function Sidebar({ admin,tab,setTab,setUser }) {

  return <Localized>      <aside>
        <div className="brand">
          <span className="brandmark">B</span>
          <div>
            BITOPI<span>Performance workspace</span>
          </div>
        </div>
        <span className="nav-label">WORKSPACE</span>
        {[
          ['Overview', LayoutDashboard],
          ['KPI board', ListChecks],
          ['Action plan', ClipboardList],
        ]
          .filter(([t]) => admin || t !== 'Overview')
          .map(([t, Icon]) => (
            <button
              key={t}
              className={'nav ' + (tab === t ? 'selected' : '')}
              onClick={() => setTab(t)}
            >
              <Icon size={19} />
              {t}
            </button>
          ))}
        <div className="sidebar-bottom">
          <div className="local-badge">Local workspace</div>
          <p>Changes saved on this device</p>
          <button className="nav" onClick={() => setUser(null)}>
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside></Localized>;
}
