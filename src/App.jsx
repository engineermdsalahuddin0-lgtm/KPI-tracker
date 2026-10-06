import React, { useState } from 'react';
import { Localized } from './i18n/index.jsx';
import { departments } from './lib/model.mjs';
import useDemoAuth from './hooks/useDemoAuth.js';
import useKpiData from './hooks/useKpiData.js';
import useKpiEditor from './hooks/useKpiEditor.js';
import useMagneticHover from './hooks/useMagneticHover.js';
import useAssistant from './features/assistant/useAssistant.js';
import LoginPage from './components/auth/LoginPage.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import WorkspaceHeader from './components/layout/WorkspaceHeader.jsx';
import WorkspaceToolbar from './components/layout/WorkspaceToolbar.jsx';
import Overview from './features/dashboard/Overview.jsx';
import Board from './features/kpi/Board.jsx';
import KpiWizard from './features/kpi/KpiWizard.jsx';
import EntryModal from './features/kpi/EntryModal.jsx';
import ActionPlans from './features/actions/ActionPlans.jsx';
import Assistant from './features/assistant/Assistant.jsx';
import ExportModal from './features/export/ExportModal.jsx';

export default function App() {
  useMagneticHover();
  const [tab,setTab] = useState('Overview');
  const [year,setYear] = useState(2026), [month,setMonth] = useState(1);
  const [dept,setDept] = useState('All departments');
  const [exportOpen,setExportOpen] = useState(false);
  const auth = useDemoAuth((initialTab) => { setDept('All departments'); setTab(initialTab); });
  const {user,setUser} = auth;
  const admin = user?.role === 'admin';
  const {kpis,setKpis,update} = useKpiData();
  const editor = useKpiEditor({kpis,setKpis,update,year,month,dept,admin});
  const assistant = useAssistant();
  const visible = kpis.filter((k) => admin ? dept === 'All departments' || k.dept === dept : k.dept === user?.dept);

  if (!user) return <LoginPage {...auth}/>;
  return <Localized><div className="shell">
    <Sidebar admin={admin} tab={tab} setTab={setTab} setUser={setUser}/>
    <main>
      <WorkspaceHeader admin={admin} tab={tab} setUser={setUser}/>
      <div className="content">
        <WorkspaceToolbar tab={tab} year={year} setYear={setYear} month={month} setMonth={setMonth} dept={dept} setDept={setDept} admin={admin} setExportOpen={setExportOpen} newKpi={editor.newKpi}/>
        {tab === 'Overview' && <Overview kpis={kpis} visible={visible} year={year} month={month} dept={dept} setDept={setDept} setTab={setTab} setChat={assistant.setChat} setQuestion={assistant.setQuestion}/>}
        {tab === 'KPI board' && <Board kpis={visible} year={year} month={month} admin={admin} openEntry={editor.openEntry} update={update} newKpi={editor.newKpi} onEdit={editor.openField}/>}
        {tab === 'Action plan' && <ActionPlans kpis={visible} admin={admin} update={update}/>}
        <footer>Bitopi Group · KPI workspace <span>Browser saved · No backend connected</span></footer>
      </div>
    </main>
    {exportOpen && <ExportModal kpis={admin ? kpis : kpis.filter((k) => k.dept === user.dept)} departments={admin ? departments : [user.dept]} year={year} initialDept={admin ? dept : user.dept} onClose={() => setExportOpen(false)}/>}
    {editor.wizard && <KpiWizard {...editor} kpis={kpis} year={year}/>}
    {editor.edit && <EntryModal {...editor} admin={admin}/>}
    <Assistant {...assistant}/>
  </div></Localized>;
}
