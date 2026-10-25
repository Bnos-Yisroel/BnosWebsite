# Bnos Yisroel website

A vanilla HTML, CSS, and JavaScript website with a dependency-free Node.js static build. Source content is migrated from the supplied WordPress export and wget mirror. Only `dist/` is deployed.

## Run locally

Requires Node.js 22 or newer. There are no npm packages to install.

```sh
npm run check
npm run preview
```

Open **http://127.0.0.1:4173/BnosWebsite/**. Stop the server with Ctrl+C. The site is generated into `dist/`; edit source files rather than generated HTML. If local network access is restricted, the preview server needs permission to listen on localhost.

## Project layout

- `content/site.json`: identity, base URL, homepage copy, slideshow and quick links.
- `content/pages/`: migrated public content, including original source URLs.
- `content/news/`: news article JSON files; published pages are generated automatically.
- `assets/`: site code and selected school assets, with stable replacement paths.
- `scripts/build.mjs`: shared page templates and static generation.
- `scripts/validate.mjs`: internal links, assets and basic semantic checks.
- `tests/`: school-local date boundaries, news retention, and isolated end-to-end build tests.
- `.github/workflows/pages.yml`: validation, artifact generation, and GitHub Pages deployment.
- `docs/`: inventory, maintenance guidance, source issues and launch review.

## Current status

The static build and automated checks pass. Production has not been deployed or configured. No qualifying news **posts** were present in the supplied export; the news page retains the 2026 newsletter collection and video. The homepage correctly renders no empty article cards.

Read [administrator instructions](docs/ADMINISTRATOR.md), [migration decisions](docs/MIGRATION.md), [launch review](docs/LAUNCH-REVIEW.md), and [verification results](docs/QA.md) before launch. Browser-based visual checks could not run because managed Chrome blocked the local preview. External availability checks do not establish that a form, calendar, or payment workflow is correct.
