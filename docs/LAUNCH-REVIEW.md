# Launch review — pending school approval

Development is complete enough for local/staging review, but the PRD’s production acceptance criteria are not fully satisfied. Do not switch the production domain until these items are resolved.

| Item | Evidence / action needed |
| --- | --- |
| Admissions | 2027–28 application responds; 2026–27 is 404 and removed. Confirm enrollment scope and complete a school-approved application test. |
| Contact | Confirm address, phone, and office email. Resolve fax 443-770-1860 versus 410-367-8510; fax omitted from HTML but retained inside supplied calendar image. |
| Birthday Book Club | Choose office-assisted handling, existing ParentLocker form, or approved external Apps Script/PayPal flow. Confirm the school receives bookplate details and reconciles payments. |
| Donations | Verify general, alumnae, monthly contribution amounts, recipient, receipt, cancellation behavior, and reconciliation in an approved test process. No money was sent. Alumnae PayPal probe returned 403. |
| Calendars/forms | URLs respond, sometimes via sign-in; confirm actual calendar visibility, dates, form ownership, and successful school receipt. |
| Documents | Supply current wellness and CACFP replacements and missing Workspace Guard privacy-policy PDF. Confirm retained supply lists, uniforms, menus and calendar are approved. |
| Photo use | Confirm permission to republish the selected authentic school photos and newsletter documents. |
| Accessibility | Run browser/keyboard/screen-reader review, contrast checks and automated accessibility scan. Supply accessible text/PDF alternatives for image-only menus, supply lists, uniforms, newsletters and calendar. Alt labels alone cannot reproduce their detailed content. |
| Responsive/performance | Review 390px, 768px, and 1440px layouts, navigation, image crops, and Core Web Vitals. Local browser checks were blocked by managed Chrome policy. |
| GitHub Pages | Enable Actions publishing; push approved changes; verify the workflow and staging URL. No remote push or deployment was performed. |
| Domain | Only after review, configure custom domain/DNS, root base path, canonical URL, HTTPS, and any required legacy URL redirects. |

Read-only endpoint checks were performed without submitting forms or transactions. HTTP 200 means reachable, not operationally approved. USDA PDF and alumnae PayPal returned 403 and require manual review. Existing nondiscrimination statements were preserved from the supplied content, not newly authored or legally reviewed.
