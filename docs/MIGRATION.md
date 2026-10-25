# Migration inventory and decisions

The supplied `Legacy Site/wordpress-data/{pages,posts,media}.json` export and `bnosyisroel-mirror/bnosyisroel.org/` mirror are authoritative. Inventory found 23 pages, 13 posts and 92 media records; the mirror contains 284 files. No application code existed at the start of this work.

`page-inventory.csv` records every exported page/post, its destination, date, and retention decision. `asset-catalog.csv` records selected assets and original locations. `reference-issues.json` preserves missing/excluded source links discovered during migration. `external-link-report.json` records read-only availability checks; it is not a certification of workflows.

## Branding and content

The existing logo and school photos were copied from the mirror. The original homepage repeatedly uses `#4d2960`, `#380066`, `#5e006b`, and `#2e222e`; these anchor the new palette. No stock imagery, generated school information, or invented testimonials are used. Evergreen mission, commitments, alumnae copy, legacy giving, sponsorship information, and current resources are retained. Old photo upload dates do not make evergreen school photography historical news; their public-use approval remains a launch item.

The 10 testimonial posts are retained under their original URLs as the explicit age exception. The other three posts (newsletter, chesed, and 3D printer Mishkan) predate 2025 and are excluded. The current News & Events page includes 2026 newsletter images and the 25–26 kindergarten video. The page’s 2026 modification date is not used to invent article publication dates; accordingly, no article cards are seeded. Adding genuine eligible articles exercises the complete news system.

## Consolidations and URLs

Most public paths remain unchanged. `/parent-resources/food-service-resources/` remains the food-service destination. `/enrollment/` and `/enrollment.html` lead to `/admissions/`; `/uniform-2/` leads to `/uniform/`; `/food-service-resources/` leads to the nested resource page; `/contact-confirm/` leads to `/contact-us/`; `/news/` leads to `/news-and-events/`.

GitHub Pages cannot serve arbitrary HTTP 301 redirects. The above paths have static HTML meta-refresh redirects with canonical metadata and a visible fallback link. Query-based WordPress paths such as `?page_id=...` and original `wp-content/uploads/...` file URLs are not redirected. If those need durable HTTP redirects, configure them at a separate edge/proxy or retain a legacy host. Excluded historical posts receive the site’s normal 404 page. The sitemap lists current content, excluding redirect stubs and the 404 page.

## Resource retention

2026–27 supplies, uniforms, school calendar, meal-benefit forms, October 2026 menus, and November 2026 upcoming menus are retained. Routine files use stable names and full-resolution source assets. Source thumbnails and unused imported media have been removed. Menu/calendar editions are fixed content labels. School-year calculation does not alter them.

Pre-2025 wellness PDFs, 2023 alumnae newsletter, old CACFP attachments, and decorative historical lunch/snack labels are omitted. Current replacements for wellness and CACFP attachments are needed. The summer 2026 meal program is explicitly marked ended; expired registration dates are not promoted as active. Expired uniform gemach summer dates are removed while its appointment/pickup links are retained.

## Integrations and unresolved decisions

- Admissions: exported Enrollment links to 2027–28; exported Contact links to 2026–27. GET verification found 2027–28 reachable and 2026–27 returning 404. Only the reachable application is shown; current-year inquiries go to the office.
- Contact: preserve the school’s common address, phone and office email. Omit the conflicting fax number from page text pending confirmation. Historical fax details embedded in the source calendar are not edited.
- Birthday Book Club: the 2026 source uses an external Google Apps Script event endpoint and PayPal donation SDK (hosted button `2L9NQUQGDPEQC`); older PTBY uses a separate ParentLocker form. This is not simply a WordPress-only workflow. Source JavaScript includes client-reported payment completion, which is not independent payment verification. The replacement page explains the program and provides direct office contact. No pledge logging, personal data transmission, or payment-submission experiment was performed. School approval is needed to select the production flow.
- Monthly giving: the original external PayPal form fields, button ID `DD6GM4FUL9KDW`, seven contribution levels, currency, and optional note are preserved in a labeled native HTML form. General giving and alumnae PayPal links remain. Payment outcomes are untested.
- The old Contact Form 7 confirmation page is replaced by a redirect; the contact page provides working email and phone links without claiming a message was submitted.
- Missing tuition and scrip ordering destinations route visitors to the school office. The scrip contact and program explanation are preserved. A working external ordering destination must be supplied if online ordering is required.
- Teacher login is excluded. No working approved external destination was supplied.
- The Workspace Guard privacy-policy PDF is missing from the mirror. The page offers office contact pending a replacement; no policy text is invented.

The source export/mirror remain untouched, ignored by Git, and outside the deployment artifact. Migration data is now editable independently of WordPress; rebuilding does not read the legacy files.
