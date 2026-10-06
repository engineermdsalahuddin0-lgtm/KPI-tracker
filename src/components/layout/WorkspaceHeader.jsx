import React from 'react';
import { Localized, useLanguage } from '../../i18n/index.jsx';
import { ChevronRight, LogOut } from 'lucide-react';
import { LanguageSwitch } from '../../i18n/index.jsx';
export default function WorkspaceHeader({ admin,tab,setUser }) {

  return <Localized>        <header>
          <div className="crumb">
            Workspace <ChevronRight size={14} /> <b>{tab}</b>
          </div>
          <div className="profile">
            <LanguageSwitch />
            <span className="avatar">{admin ? 'MA' : 'ME'}</span>
            <div>
              <b>{admin ? 'Mr Admin' : 'Employee'}</b>
              <small>
                {admin
                  ? 'Super admin · All departments'
                  : 'ERP & IT · Team member'}
              </small>
            </div>
            <button
              className="mobile-logout"
              title="Sign out"
              onClick={() => setUser(null)}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header></Localized>;
}
