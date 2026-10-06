# Bitopi KPI Tracker

বিটপী গ্রুপের বিভাগভিত্তিক লক্ষ্য, মাসিক অর্জন ও কর্মপরিকল্পনা পরিচালনার জন্য একটি বাংলা-প্রধান React application। Super admin সব বিভাগের কর্মদক্ষতা দেখতে পারেন; employee নিজের বিভাগের মাসিক তথ্য ও কাজের অগ্রগতি লিখতে পারেন।

এটি একটি **frontend-only local demo**। তথ্য browser-এর `localStorage`-এ থাকে। Backend, database বা external AI API প্রয়োজন হয় না।

## সূচি

- [প্রধান সুবিধা](#প্রধান-সুবিধা)
- [Technology stack](#technology-stack)
- [লোকালি চালানো](#লোকালি-চালানো)
- [Demo account ও ভূমিকা](#demo-account-ও-ভূমিকা)
- [ব্যবহারের নিয়ম](#ব্যবহারের-নিয়ম)
- [কর্মদক্ষতার হিসাব](#কর্মদক্ষতার-হিসাব)
- [Data model ও storage](#data-model-ও-storage)
- [Folder structure](#folder-structure)
- [Component ও function reference](#component-ও-function-reference)
- [Excel export](#excel-export)
- [পরীক্ষা ও build](#পরীক্ষা-ও-build)
- [Customization](#customization)
- [সীমাবদ্ধতা ও নিরাপত্তা](#সীমাবদ্ধতা-ও-নিরাপত্তা)

## প্রধান সুবিধা

- বাংলা default interface; English-এ বদলানো যায় এবং ভাষার পছন্দ সংরক্ষিত থাকে।
- Department, year ও month অনুযায়ী performance overview, weighted score এবং coverage।
- সাত ধাপের KPI setup: KRA, major objective, SMART KPI, action plan, requirements, weight ও measurement।
- সরাসরি KPI লেখা অথবা SMART builder ব্যবহার করা।
- KPI row/card ক্লিক করে details খোলা; মাস expand করে নির্দিষ্ট মাসের অর্জন লেখা।
- Header ও details-এর field tooltip; hover, keyboard focus ও tap সমর্থিত।
- Compact action cards: KPI ID, title ও progress bar; ক্লিক করলে editable detail modal।
- পৃথক status color: Completed সবুজ, In progress নীল, Pending অ্যাম্বার এবং No Input বেগুনি।
- Fixed target, monthly override ও অনুমোদিত workload adjustment।
- স্থানীয় বাংলা/English প্রশ্নোত্তর সহকারী; টাইপ করার সময় প্রশ্নের suggestion ও keyboard selection।
- আগের Excel template-এর format-এ report download, সঙ্গে বিস্তারিত `Monthly Results` sheet।
- Mobile layout, keyboard interaction এবং reduced-motion সমর্থিত magnetic hover।

## Technology stack

| প্রযুক্তি | ব্যবহার |
| --- | --- |
| React 19 / React DOM | Component, state ও browser rendering |
| Vite 8 | Development server ও production build |
| ExcelJS 4 | Browser-এ `.xlsx` report তৈরি |
| Lucide React | Interface icons |
| CSS | Layout, responsive view, colors ও animation |
| Browser localStorage | KPI, chat history ও ভাষার পছন্দ সংরক্ষণ |
| Node.js built-in test runner | Regression tests |

নির্দিষ্ট dependency version [package.json](package.json) এবং [package-lock.json](package-lock.json)-এ আছে।

## লোকালি চালানো

**প্রয়োজন:** Node.js **22.13.0 বা নতুন সংস্করণ** এবং npm।

Repository clone বা download করে project folder-এ terminal খুলুন:

```bash
npm ci
npm run dev
```

Terminal-এ দেখানো localhost URL খুলুন। Default port `5173`; ব্যস্ত থাকলে Vite পরের available port ব্যবহার করে, যেমন `5174`।

এই demo চালাতে `.env`, database setup বা API key লাগে না।

### Commands

| Command | কাজ |
| --- | --- |
| `npm ci` | Lockfile অনুযায়ী dependencies install |
| `npm run dev` | Development server চালু |
| `npm test` | সব automated test চালানো |
| `npm run build` | `dist/`-এ production files তৈরি |
| `npm run preview` | তৈরি করা build লোকালি preview |

Production preview:

```bash
npm run build
npm run preview
```

## Demo account ও ভূমিকা

| ভূমিকা | Email | Password | Scope |
| --- | --- | --- | --- |
| Super admin | `admin@gmail.com` | `Demo@123` | সব বিভাগ |
| Employee | `employee@gmail.com` | `Demo@123` | ERP & IT |

**Super admin:** Overview দেখতে, KPI যোগ করতে, setup field edit করতে, action description/owner/date পরিবর্তন করতে এবং workload adjustment অনুমোদন করতে পারেন।

**Employee:** নিজের বিভাগের KPI দেখতে, মাসিক অর্জন লিখতে এবং action status/remarks পরিবর্তন করতে পারেন। Admin Overview তাঁর navigation-এ থাকে না।

এগুলো demo-এর **UI permission**; server-side authentication বা secure authorization নয়।

## ব্যবহারের নিয়ম

### 1. Overview

Admin হিসেবে sign in করুন। বিভাগ, বছর ও মাস বেছে নিন। এখানে পাবেন:

- **Weighted performance:** গুরুত্ব অনুযায়ী গড় কর্মদক্ষতা।
- **Average score:** গুরুত্ব অনুযায়ী গড় স্কোর, সর্বোচ্চ ৫।
- **Scoring coverage:** বরাদ্দ গুরুত্বের কতটুকু মূল্যায়ন হয়েছে।
- **Action completion:** মোট কাজের কতটি সম্পন্ন হয়েছে।

Department row ক্লিক করলে সেই বিভাগের KPI board খুলবে।

### 2. KPI তৈরি

`Add KPI` / `KPI যোগ করুন` থেকে সাতটি ধাপ পূরণ করুন:

| ধাপ | তথ্য |
| --- | --- |
| 1 | Department, একটি KRA এবং একটি major objective |
| 2 | Direct KPI অথবা SMART builder; perspective |
| 3 | Action steps, দায়িত্বপ্রাপ্ত ব্যক্তি ও শেষ তারিখ |
| 4 | প্রয়োজনীয় সহায়তা বা resources |
| 5 | Weight এবং minimum threshold |
| 6 | HIGH/LOW, unit, baseline এবং target |
| 7 | ঐচ্ছিক প্রথম মাসের achievement |

অন্তত একটি action ও তার owner প্রয়োজন। নতুন KPI-এর weight শূন্যের বেশি হতে হবে। বিভাগে আগে থেকেই ১০০% বরাদ্দ থাকলে নতুন KPI যোগ করার আগে বর্তমান weight কমাতে হবে। অ্যাপ সর্বোচ্চ **৬০টি KPI** তৈরির সীমা প্রয়োগ করে।

### 3. মাসিক অর্জন ও details

KPI row/card ক্লিক করলে details panel খুলবে। সেখানে Overview, Action plan এবং History আছে। Desktop-এর বাম `>` arrow ক্লিক করলে animation দিয়ে নিচের দিকে ঘুরে ১২ মাসের entry দেখাবে। Mobile-এ `মাসগুলো দেখুন` ব্যবহার করুন।

Achievement button বা মাসের button থেকে entry modal খুলুন। প্রয়োজন অনুযায়ী status, achievement, target override, policy ও remarks লিখুন। একই KPI/year/month আবার save করলে আগের entry update হবে।

### 4. Action plan

ছোট card-এ ID, title, status ও completion progress দেখাবে। Card ক্লিক করলে modal-এ কাজের বিস্তারিত পাওয়া যাবে। Role অনুযায়ী field edit করা যায়; পরিবর্তন locally save হয়। Escape, Close বা backdrop দিয়ে modal বন্ধ করা যায়।

### 5. KPI সহকারী

নিচের assistant button খুলে প্রশ্ন টাইপ করুন। মিল থাকা dataset question suggestion হিসেবে আসবে; প্রশ্নে চাপ দিলে input পূরণ হবে। এরপর Send চাপুন। Arrow Up/Down ও Enter দিয়েও suggestion নির্বাচন করা যায়।

উদাহরণ: `KPI`, `SMART`, `weight`, `ojon`। কিছু Roman Bangla শব্দের alias সমর্থিত; এটি সব Roman Bangla বাক্য অনুবাদ করে না। প্রশ্ন বেছে নেওয়া বা পাঠানোর পরে suggestion সরে যায়, যাতে উত্তর পড়তে সুবিধা হয়।

সহকারী supplied dataset থেকে উত্তর খুঁজে দেয়। এটি **generative AI নয়**; নতুন উত্তর তৈরি করে না।

## কর্মদক্ষতার হিসাব

Scoring logic: [src/lib/model.mjs](src/lib/model.mjs)।

### Target ও unit

সাধারণত KPI-এর target ব্যবহৃত হয়। Monthly override থাকলে সেই মাসে override ব্যবহৃত হয়। অনুমোদিত `Workload Adjusted` policy-তে:

```text
Effective target = MIN(monthly target, eligible input)
```

Baseline আগের অবস্থার reference; scoring denominator নয়। Baseline, target ও achievement একই unit-এ লিখতে হবে। **শতাংশে 90 লিখলে 90% বোঝায়; 0.9 লিখলে 0.9%।**

### HIGH / LOW

```text
HIGH performance (%) = Achievement / Effective target × 100
LOW performance (%)  = Effective target / Achievement × 100
Score                = MIN(5, performance (%) / 100 × 5)
```

| পরিস্থিতি | ফলাফল |
| --- | --- |
| HIGH, effective target শূন্য বা কম | Scored নয় |
| LOW, achievement শূন্য | ১০০% performance, score ৫ |
| LOW, target শূন্য এবং achievement positive | ০% performance |
| Pending বা No Input | Score/weighted average থেকে বাদ |
| Negative achievement/target | UI validation-এ গ্রহণ করা হয় না |

`No Input` save করতে employee-এর দায়িত্বের বাইরের dependency এবং remarks/RCA প্রয়োজন। `Workload Adjusted` policy-তে management approval ও non-negative eligible input প্রয়োজন।

### Weight, threshold ও coverage

```text
Weighted performance = Σ(performance × weight) / Σ(scored KPI weight)
Weighted score       = Σ(score × weight) / Σ(scored KPI weight)
Coverage (%)         = Scored weight / Assigned weight × 100
```

দুটি scored KPI-এর weight ৬০% ও ৪০%, performance ৮০% ও ১০০% হলে weighted performance **৮৮%**। Pending KPI বাদ পড়লে শুধু scored KPI-এর weight দিয়ে গড় হয়; তাই ভালো performance দেখলেও coverage কম থাকতে পারে।

| Threshold | Minimum performance |
| --- | --- |
| 4 / 5 | ৮০% |
| 4.5 / 5 | ৯০% |
| 5 / 5 | ১০০% |

প্রতি বিভাগের weight মোট ১০০% হওয়া উচিত। UI ১০০%-এর বেশি বরাদ্দ আটকায় এবং অসম্পূর্ণ বণ্টন flag করে।

## Data model ও storage

### KPI record

| Field | অর্থ |
| --- | --- |
| `id`, `dept` | KPI identifier ও department |
| `kra`, `mo`, `title` | দায়িত্বের ক্ষেত্র, মূল লক্ষ্য ও KPI |
| `perspective`, `requirements` | দৃষ্টিকোণ ও প্রয়োজনীয় সহায়তা |
| `weight`, `threshold` | গুরুত্ব ও minimum score |
| `direction`, `unit` | HIGH/LOW এবং measurement unit |
| `baseline`, `target` | আগের মান ও নির্ধারিত লক্ষ্য |
| `actions` | কাজের তালিকা: `text`, `owner`, `due`, `status`, `remarks` |
| `entries` | Year/month key অনুযায়ী monthly records |

Month index **zero-based**: January = `0`, December = `11`। যেমন `entries['2026-9']` হলো October 2026। Monthly record-এ `status`, `achievement`, `remarks`, `override`, `policy`, `eligible`, `approved` এবং প্রয়োজন হলে `external` থাকে।

### Browser storage keys

| Key | তথ্য |
| --- | --- |
| `bitopi-kpi-v1` | KPI setup, action plan ও monthly entries |
| `bitopi-chat` | প্রশ্ন, উত্তর ও dataset reference-সহ chat history |
| `bitopi-language` | `bn` অথবা `en` |

প্রথমবার seed data-তে ২১টি বিভাগ ও ৪২টি KPI থাকে, প্রতি বিভাগে দুটি KPI-এর weight ৫০% করে। January/February 2026 illustrative sample; বাকি মাস Pending।

একই browser/origin-এর demo account-গুলো একই stored data ব্যবহার করে। অন্য browser, device বা port-এর origin-এ আলাদা storage থাকে। Sign out করলে KPI data মুছে যায় না; reload করলে আবার sign in করতে হয়। Site data clear করলে locally saved data হারাবে।

## Folder structure

```text
src/
├── main.jsx                         # React entry + language provider
├── App.jsx                          # Workspace composition ও filters
├── components/
│   ├── auth/LoginPage.jsx
│   ├── common/Help.jsx
│   └── layout/
│       ├── Sidebar.jsx
│       ├── WorkspaceHeader.jsx
│       └── WorkspaceToolbar.jsx
├── features/
│   ├── dashboard/Overview.jsx
│   ├── kpi/
│   │   ├── Board.jsx
│   │   ├── KpiWizard.jsx
│   │   └── EntryModal.jsx
│   ├── actions/ActionPlans.jsx
│   ├── assistant/
│   │   ├── Assistant.jsx
│   │   ├── useAssistant.js
│   │   └── search.mjs
│   └── export/
│       ├── ExportModal.jsx
│       ├── excel-export.mjs
│       └── data-export.mjs
├── hooks/
│   ├── useDemoAuth.js
│   ├── useKpiData.js
│   ├── useKpiEditor.js
│   └── useMagneticHover.js
├── lib/
│   ├── model.mjs
│   └── status-style.mjs
├── i18n/index.jsx
└── styles/global.css

public/                              # QA dataset, Excel template, icons
tests/                               # Regression tests
index.html                           # Browser entry document
vite.config.ts                       # Vite config
package.json
package-lock.json
```

## Component ও function reference

### UI components

| Component | দায়িত্ব |
| --- | --- |
| `App` | Shared filters, role-based visible KPIs, page selection ও modal composition |
| `LoginPage` | Demo account selection ও sign-in form |
| `Sidebar`, `WorkspaceHeader`, `WorkspaceToolbar` | Navigation, language switch, filters এবং primary actions |
| `Overview` | Weighted metrics, department results, annual chart ও allocation warning |
| `Board` | Search, compact/detailed list, row selection, monthly expansion ও details |
| `KpiWizard` | সাত ধাপের setup UI; editor hook-এর state/validation ব্যবহার করে |
| `EntryModal` | Setup field অথবা monthly record edit UI |
| `ActionPlans` | Progress cards, action dialog ও role-based action editing |
| `Assistant` | Chat history, typing suggestions ও keyboard interaction |
| `ExportModal` | Export scope, year, period, language, metadata ও preview |
| `Help` | Portal tooltip; hover/focus/tap, viewport position ও Escape dismissal |

### State ও editor hooks

| Function | Input / কাজ | Return / ফল |
| --- | --- | --- |
| `useDemoAuth(onSignIn)` | Demo account ও password যাচাই; successful login-এ callback | User, form state এবং `login` handler |
| `login(event)` | Form submit; দুই demo account ও `Demo@123` যাচাই | User/role set অথবা login error |
| `useKpiData()` | Stored KPI load; প্রয়োজন হলে `seed()`; পরিবর্তন persist | `kpis`, `setKpis`, `update` |
| `update(id, field, value)` | ID অনুযায়ী একটি KPI field immutable update | Updated state, পরে storage persist |
| `useKpiEditor({...})` | KPI data, update function, period, department ও admin role | Wizard/edit state এবং নিচের editor handlers |
| `newKpi()` | Default values ও তিনটি blank action দিয়ে wizard শুরু | নতুন wizard state |
| `w(field, value)` | Wizard-এর একটি field পরিবর্তন | Updated wizard |
| `next()` | বর্তমান ধাপ validate; শেষ ধাপে KPI create | পরের ধাপ, validation error অথবা saved KPI |
| `openField(kpi, field)` | একটি setup field edit শুরু | Field-specific modal state |
| `openEntry(kpi, month)` | Existing/default monthly record load; month না দিলে selected month | Entry modal state; key `year-month` |
| `saveEdit()` | Weight, numeric values, No Input ও workload approval যাচাই | Saved setup/monthly record অথবা error |
| `useMagneticHover()` | Fine pointer-এর button movement, touch/reduced-motion guard | Event listeners; unmount-এ cleanup |

### Scoring ও shared helpers

| Function | দায়িত্ব |
| --- | --- |
| `seed()` | নতুন browser-এর জন্য illustrative KPI/action/monthly data |
| `score(kpi, entry)` | Effective target, HIGH/LOW ও zero rules; `{ performance, score, target }` অথবা `null` |
| `summary(kpis, year, month)` | `{ assigned, coverage, performance, score }` aggregate |
| `statusClass(status)` | Status-এর semantic CSS class নির্বাচন |

`departments` ও `months` array-ও `src/lib/model.mjs` থেকে export হয়।

### Assistant functions

| Function | দায়িত্ব |
| --- | --- |
| `useAssistant()` | Dataset fetch, chat state, history persistence, suggestions ও input ref |
| `normalize(text)` | Unicode normalization, lowercase ও punctuation cleanup |
| `rankQuestions(dataset, query, language, limit)` | Bilingual প্রশ্ন group/rank করা; duplicate QA বাদ; default limit ৫ |
| `findAnswer(dataset, query, language)` | Ranked result-এর প্রথম matching record অথবা `null` |
| `chooseQuestion(text)` | Input পূরণ, suggestions hide এবং input focus |
| `ask(event)` | Matching answer/fallback এবং source reference history-তে যোগ |

Dataset: [public/Bitopi_KPI_QA_RAG.jsonl](public/Bitopi_KPI_QA_RAG.jsonl)। প্রতিটি record-এর `metadata`-তে question, answer, language এবং `qa_id` থাকে। Search partial input, কিছু শব্দের alias ও preferred language ব্যবহার করে।

### Language functions

| Function / Component | দায়িত্ব |
| --- | --- |
| `LanguageProvider` | Current language, storage preference ও document language |
| `useLanguage()` | `language`, `setLanguage`, `t` পাওয়া |
| `translate(text, language)` | UI dictionary ও নির্দিষ্ট dynamic label-এর অনুবাদ |
| `Localized` | React UI tree-এর labels, placeholders ও accessible text অনুবাদ; original option values রাখে |
| `LanguageSwitch` | বাংলা/English selection |

User content-এ `data-user-content` marker ব্যবহার করা হয়, যাতে KPI title বা remarks অনুবাদে পরিবর্তিত না হয়।

### Excel functions

| Function | দায়িত্ব |
| --- | --- |
| `download()` in `ExportModal` | Public template fetch, builder lazy-load এবং browser download |
| `buildReport(template, kpis, options)` | Original template load, selected data mapping, merged action blocks/footer rebuild ও `Monthly Results` যোগ; workbook buffer return |
| `buildDataWorkbook(_template, kpis, options)` | Internal typed workbook builder; downloaded report-এর detailed monthly sheet-এর source |
| `measurement(cell, value, unit)` | Numeric/percentage/currency value ও Excel format set |
| `makeSheet(...)` | Internal data sheet-এর columns, headings, freeze panes ও print setup |
| `finish(...)` | Internal data sheet-এর wrapping, row heights, filters ও print area |

`buildDataWorkbook()` internal-ভাবে KPI Report, Monthly Results ও Action Plan তৈরি করে। User-facing download **`buildReport()`** ব্যবহার করে; তাই downloadable main sheet আগের template-এর format-এ থাকে।

## Excel export

`Download Excel` থেকে নির্বাচন করা যায়:

- Department অথবা Single KPI।
- Reporting year।
- Full year, January–June অথবা July–December।
- Performance অথবা Targets।
- বাংলা অথবা English report labels।
- HOD, unit, location, section ও subsection metadata।

মূল template: [public/report-template.xlsx](public/report-template.xlsx)।

Download-এ `Goal Setting_Dept` sheet-এর original columns/widths, quarter/month headers এবং merged KPI/action layout রাখা হয়। লম্বা লেখা wrap হয়; action row height content অনুযায়ী বাড়ে। Metadata আলাদা merged master cell-এ বসে, যাতে label overwrite না হয়। Selected half-year-এর বাইরের মাস main sheet-এ `—` দেখায়।

`Monthly Results`-এ নির্বাচিত KPI/month-এর target, effective target, achievement, performance, score, policy ও remarks থাকে। Targets report-এ detail sheet থেকে achievement/performance/score column বাদ যায়। Numbers/percentages typed values হিসেবে লেখা হয়; user text formula হিসেবে লেখা হয় না।

Template-এর original legacy worksheets রাখা হয়। Main sheet-এর scoring legend app-এর active calculation অনুযায়ী update হয়। Web preview একটি সংক্ষিপ্ত data summary, Excel-এর pixel-exact preview নয়।

## পরীক্ষা ও build

```bash
npm test
npm run build
```

বর্তমানে **১৩টি automated test** আছে:

| Test file | Coverage |
| --- | --- |
| `tests/model.test.mjs` | HIGH/LOW, zero handling, exclusions, coverage, override, approval ও sample weight |
| `tests/assistant.test.mjs` | Partial/Roman Bangla suggestions, bilingual retrieval ও exact selected-question answers |
| `tests/export.test.mjs` | Internal typed data sheets, long Bangla text, zero/override values, dates, ৬৫ actions ও invalid year |
| `tests/template-export.test.mjs` | Original template geometry, metadata cell isolation, merged blocks, monthly values ও footer relocation |

Tests এবং production build refactor-এর পরে pass করেছে। Browser checks-এ login, navigation, wizard validation, monthly modal, action modal, assistant ও language switch যাচাই করা হয়েছে। Browser checks manual; এগুলো `npm test`-এর অংশ নয়।

ExcelJS lazy-loaded হলেও build-এ বড় chunk warning আসতে পারে; এটি build failure নয়।

## Customization

| পরিবর্তন | কোথায় কাজ করবেন |
| --- | --- |
| নতুন feature UI | `src/features/<feature>/` |
| Shared component | `src/components/` |
| KPI validation / wizard rule | `src/hooks/useKpiEditor.js` |
| Scoring rule / department list / sample data | `src/lib/model.mjs` |
| Demo login | `src/hooks/useDemoAuth.js` |
| বাংলা/English UI text | `src/i18n/index.jsx` |
| Assistant question/answer | `public/Bitopi_KPI_QA_RAG.jsonl` |
| Search aliases/ranking | `src/features/assistant/search.mjs` |
| Excel mapping / print layout | `src/features/export/excel-export.mjs` |
| Typed monthly detail sheet | `src/features/export/data-export.mjs` |
| Colors / spacing / responsive style | `src/styles/global.css` |

Scoring বা workbook layout বদলালে সংশ্লিষ্ট tests update করুন। UI changes-এর পরে admin/employee এবং desktop/mobile—দুটিই যাচাই করুন। `App.jsx`-এ feature implementation না রেখে composition রাখুন।

## সীমাবদ্ধতা ও নিরাপত্তা

- Demo password public; login ও department restriction React UI-তে প্রয়োগ করা হয়। Production authentication নেই।
- KPI এবং chat শুধু browser-এ সংরক্ষিত; multi-user synchronization, server backup বা durable database নেই।
- Real employee, payroll বা confidential company data ব্যবহারের জন্য এটি প্রস্তুত নয়।
- Public QA dataset ও Excel template website visitor-এর কাছে accessible। Template-এর legacy sheet-এ existing sample content থাকতে পারে।
- Monthly History পূর্ণ audit trail নয়; প্রতিটি edit-এর revision log রাখে না।
- আলাদা page URL/router নেই; browser Back/Forward দিয়ে workspace tab বদলায় না।
- Excel import বা backup restore workflow নেই।
- User-entered KPI text স্বয়ংক্রিয় অনুবাদ করা হয় না।
- Fonts-এর জন্য Google Fonts request হয়; unavailable হলে system/Bangla font fallback ব্যবহৃত হয়।

Production ব্যবহারের আগে server-backed authentication/authorization, input validation, durable storage, audit logging ও dataset/template review প্রয়োজন। বিস্তারিত: [SECURITY.md](SECURITY.md)।

## Project documents

| File | বিষয় |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Original requirements ও business workflow |
| [MEMORY.md](MEMORY.md) | Implementation history ও decisions |
| [SECURITY.md](SECURITY.md) | Demo security model ও production considerations |
| [LINK-AUDIT.md](LINK-AUDIT.md) | Local navigation audit ও follow-up notes |

Repository public/private করা এবং application production-ready হওয়া আলাদা বিষয়। বর্তমান project একটি local prototype।
