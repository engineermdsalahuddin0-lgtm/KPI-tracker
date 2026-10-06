# Dashboard link audit — 2026-10-07

Follow-up: Mobile Compact/Detailed and monthly expansion now work after the requested UI update. Excel export uses the original template again at the user's request, with corrected merged metadata mapping and adaptive wrapping. Details open on demand. The state-only URL/history limitation remains. See README.md and MEMORY.md for the current behavior.

Scope: local source and browser UI at http://localhost:5173/. No application code changed. No deployed URL was supplied.

## Verified

- Admin Overview, KPI board and Action plan navigation opens the corresponding view.
- All 21 department buttons open the KPI board with two matching sample KPIs.
- Add KPI opens its setup wizard; closing it works without creating a record.
- Ask the KPI assistant opens chat and prefills the weight question.
- KPI View details selects the requested KPI; History opens monthly records.
- Update this month opens the correct KPI/month modal. Desktop Expand months exposes all 12 months; October opens October 2026.
- Sign out returns to login. Employee login opens KPI board, hides admin Overview, and Action plan opens normally.
- Excel export opens the preview/options form. Both public asset endpoints return HTTP 200: /report-template.xlsx and /Bitopi_KPI_QA_RAG.jsonl.
- All seven existing tests pass, including report generation; production build passes. No browser error/warning logs observed in the inspected log snapshot.

## Findings

1. Tabs have no distinct URLs or browser history entries (src.jsx:49, 487, 658). They use React state. Sharing/bookmarking a particular view and browser Back/Forward between views are unavailable; reload returns to login because user state is in memory.
2. At widths <=800px, Compact/Detailed remains clickable but only changes hidden table columns (Board.jsx:76, 82; style.css:1342). Mobile cards do not change, so the control appears ineffective. Monthly expand buttons are also confined to the hidden table; mobile users must change the global Month selector before updating another month.
3. Asset fetches start at the domain root (src.jsx:80; ExportModal.jsx:37). They work at the tested root URL. Hosting under a subdirectory requires checking base-path behavior; otherwise assistant data and export template requests can target the wrong location.

## Verification limit

The browser download-event check timed out. The export form returned to an enabled Download button without a visible error, and report-generation tests pass, but receipt of the browser-generated .xlsx file was not confirmed. This is unverified, not a confirmed broken link.

No broken primary navigation destination was found in the local audit. The findings above concern navigation behavior and deployment conditions.
