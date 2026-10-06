# Security — local prototype
2026-10-07 source organization: Code moved into src/components, src/features, src/hooks and src/lib. Demo authentication, UI permissions, storage keys, public assets and local-only data flows are unchanged.
2026-10-07 status styling: Semantic status colors add no new data access or permissions; editing behavior is unchanged.
2026-10-07 interaction refinement: Action-plan dialogs preserve the existing UI editing permissions and localStorage persistence. No new external service, data transmission or authorization mechanism was introduced.
2026-10-07 audit note: Local navigation audit made no authentication or permission changes. Employee Overview remains hidden in the tested UI; this does not establish secure authorization. See LINK-AUDIT.md for scope and verification limits.
This is a frontend-only demonstration. Account checks and permissions exist in React UI only and are not secure authorization. Demo password is public. Do not use real employee, payroll or confidential company data.
KPI records and chat history are stored in localStorage, accessible to browser users and developer tools. The supplied QA dataset is a publicly readable frontend asset. React escapes displayed content; no dataset HTML is rendered.
No backend, remote AI calls or database is connected. Inter font is requested from Google Fonts; system font is the fallback.
Before production: replace demo authentication with server-backed authentication, enforce department permissions on the server, validate all inputs server-side, secure sessions, add audit logs and durable storage, and review dataset exposure.

Excel export happens locally in the browser. At the user's request, it again uses the supplied template and preserves its original legacy worksheets. The main report and Monthly Results reflect selected KPI data; legacy sheets retain the template's existing sample content. The supplied template is publicly bundled.

2026-10-07 UI update: Language preference is stored in bitopi-language. Question suggestions and bilingual answers are computed locally from the existing public dataset. No remote AI service, telemetry or new credential flow was added. Tooltip and user content render as React text; no HTML from the dataset is injected. Export writes user strings as text cells, not executable formulas.
