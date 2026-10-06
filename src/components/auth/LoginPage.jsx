import React from 'react';
import { Localized, useLanguage } from '../../i18n/index.jsx';
import { ChevronRight, Info } from 'lucide-react';
import { LanguageSwitch } from '../../i18n/index.jsx';
export default function LoginPage({ email,setEmail,password,setPassword,loginError,login }) {

  return <Localized><div className="login">
        <section className="login-story">
          <div className="brand">
            <span className="brandmark">B</span> BITOPI GROUP
          </div>
          <div>
            <span className="eyebrow">PERFORMANCE WORKSPACE</span>
            <h1>
              Clear goals.
              <br />
              Measurable progress.
            </h1>
            <p>A shared view of the work that moves your department forward.</p>
            <div className="login-preview">
              <span>Monthly performance</span>
              <strong>
                94.8<span>%</span>
              </strong>
              <div className="spark">▂ ▄ ▃ ▅ ▄ ▆ ▅ █</div>
              <small>Illustrative sample data</small>
            </div>
          </div>
          <small>Built around your goals, one KPI at a time.</small>
        </section>
        <section className="login-form">
          <div className="loginbox">
            <LanguageSwitch />
            <span className="eyebrow">WELCOME BACK</span>
            <h2>Sign in to your workspace</h2>
            <p>Choose your demo account to get started.</p>
            <div className="segmented">
              {['admin@gmail.com', 'employee@gmail.com'].map((x) => (
                <button
                  className={email === x ? 'active' : ''}
                  onClick={() => setEmail(x)}
                  key={x}
                >
                  {x.startsWith('admin') ? 'Super admin' : 'Employee'}
                </button>
              ))}
            </div>
            <form onSubmit={login}>
              <label>
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Demo@123"
                  required
                />
              </label>
              {loginError && <p className="error">{loginError}</p>}
              <button className="primary full">
                Sign in <ChevronRight size={18} />
              </button>
            </form>
            <div className="demo-note">
              <Info size={17} />
              <span>
                Both accounts use <b>Demo@123</b>.<br />
                Local demo · data stays in this browser.
              </span>
            </div>
          </div>
        </section>
      </div></Localized>;
}
