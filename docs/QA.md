# Verification results

## Passed

- `npm run check`: 15 tests, static generation, and validation of 39 HTML files / 1,120 local references.
- All six PRD school-year examples, the exact New York midnight rollover, full-year formatting, and New York calendar-year boundary.
- News cutoff, chronological ordering, drafts/future exclusion, content validation, and empty news behavior.
- Isolated full build with temporary news fixtures verifies individual articles, latest-three selection, featured images, formatted text, deployment base paths and legacy redirects. Fixtures are not shipped in the public site.
- Every generated local link and asset reference resolves. Images have alt attributes and embedded calendars have titles. Normal pages have one H1 and canonical metadata.
- Deployed output excludes source content and WordPress reference material. No WordPress scripts or external tracking scripts are loaded.
- Read-only live endpoint checks: ParentLocker, 2027–28 application, lunch login, calendar URLs, Google Forms, kindergarten video, and general PayPal endpoint respond. See `external-link-report.json` for redirects and failures.

## Not verified

Managed Chrome returned “This page is blocked — Your organization doesn’t allow you to view this site” for the local preview. No browser layout, interaction, screenshot, or accessibility result is claimed. Diagnostic images of that policy block were removed. The optional browser runner now requires the actual site shell before counting a page as checked; it must be rerun in an allowed browser environment.

No authenticated workflows, submissions, payments, GitHub Actions execution, production DNS, screen-reader audit, or Core Web Vitals measurement was performed. Some inherited documents are image-only and need accessible alternatives before claiming WCAG 2.2 AA. Semantic/link checks are useful but are not an accessibility certification.

## Repeat checks

```sh
npm run check
npm run preview
npm run check:external
npm run check:browser
```

The optional browser check needs installed Chrome and access to localhost ports 4173 and 9223; stop the preview server first. Set `CHROME_PATH` if Chrome is installed elsewhere. It creates a temporary browser profile and closes its own browser/server on exit. It checks page overflow, missing images, headings, button names, mobile navigation, slideshow controls and reduced-motion behavior, then writes screenshots/results to `docs/qa/`. External checking uses Python 3 and read-only GET requests.
