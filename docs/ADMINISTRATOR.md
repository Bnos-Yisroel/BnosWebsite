# Administrator instructions

## Replace a menu, calendar, or supply list

Replace the file in `assets/documents/` using its **exact existing filename and file type**. No HTML or JavaScript changes are needed. The file is copied on the next deployment. Git history retains the earlier version; old copies should not be placed in the public asset directory.

| File | Source edition |
| --- | --- |
| `lunch-menu.png` | October 2026 lunch |
| `lunch-menu-next.jpg` | November 2026 lunch |
| `snack-menu.png` | October 2026 snack |
| `snack-menu-next.jpg` | November 2026 snack |
| `school-calendar.jpg` | 2026–2027 school calendar |
| `supply-list-preschool.jpg` | 2026–2027 preschool |
| `supply-list-grades-1-3.png` | 2026–2027 grades 1–3 |
| `supply-list-grades-4-8.png` | 2026–2027 grades 4–8 |
| `uniform-guidelines-1.png`, `uniform-guidelines-2.png` | 2026–2027 uniforms |
| `lunch-program-information.pdf` | 2026–2027 lunch program |
| `meal-benefit-application.pdf` | 2026–2027 meal benefit application |
| `meal-benefit-instructions.pdf` | 2026–2027 instructions |
| `income-eligibility-guidelines.pdf` | 2026–2027 guidelines |

The supplied menus, calendar, and supply lists are images, so their genuine types are retained instead of renaming images to `.pdf`. To adopt an accessible PDF later, add the PDF and update the corresponding content link once.

A replacement within the same edition needs only the file replacement. For a **new month or school year**, also update the explicit edition label in the relevant `content/pages/*.json` content file. This is a content change, not an application-code change. Dates are intentionally not inferred from the computer clock: an automatic “2027–28” heading must never disguise an old 2026–27 document. Remove expired menu editions. Use accessible source documents or provide an HTML transcript for documents whose information is available only in an image.

Rebuild, deploy, and verify the direct download. If your browser caches the old document, reload without cache. Do not replace permanent article photographs with newer ones.

## Replace homepage photographs

Replace `assets/homepage/slide-1.jpg`, `slide-2.jpg`, or `slide-3.jpg`. Use actual, approved school photographs; roughly 1200 × 800 pixels and modest file sizes work well. Keep the exact filenames. Update the descriptive `alt` text in `content/site.json` if the scene changes. Adding or removing a slide requires only editing the `hero.slides` array in that configuration. `hero.interval` is in milliseconds; default is 6000.

The supplied 800-pixel school photos are retained without upscaling. Confirm public-use permission before launch. Do not put student names in alternative text without authorization.

## Publish news

Add a JSON file such as `content/news/classroom-update.json`:

```json
{
  "title": "Your approved article title",
  "slug": "classroom-update",
  "date": "2026-10-24",
  "status": "draft",
  "summary": "An optional short summary for the news card.",
  "image": "/assets/news/classroom-update.jpg",
  "imageAlt": "A specific description of the photograph",
  "body": "<p>Your article text.</p><h2>A section heading</h2><p>More text.</p>"
}
```

Add the real photograph at the named path, or omit both image fields. Change `status` to `published` when approved. Use the **actual publication date**, never an inferred upload or modification date. Articles before January 1, 2025, drafts, and future-dated articles are excluded from the public build. The homepage selects up to three eligible articles automatically, newest first. Individual articles use `/news/your-slug/` URLs. Keep slugs stable after publication.

`body` supports HTML paragraphs, lists, links, headings starting at h2, images, PDF links, and titled video frames. For example:

```html
<p><a href="/assets/news/event-program.pdf">Download the event program (PDF)</a></p>
<img src="/assets/news/event-photo.jpg" alt="Describe the scene" loading="lazy" width="800" height="533">
<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Describe the school video" loading="lazy" allowfullscreen></iframe>
<iframe src="https://player.vimeo.com/video/VIDEO_ID" title="Describe the school video" loading="lazy" allowfullscreen></iframe>
```

Use actual approved video IDs, captions, and transcripts. Content is maintained by trusted repository editors. Do not paste scripts, tracking tags, WordPress shortcodes, or unreviewed third-party HTML. Build validation rejects executable article markup and missing local assets.

The daily Actions schedule rebuilds future-dated content after its publication date. GitHub schedules can be delayed; manually run the workflow if release time matters. The date filter uses America/New_York.

## Dates and configuration

`assets/dates.js` computes the calendar year and abbreviated/full school year in America/New_York. The school year rolls over at midnight on July 15. Visible automatic dates update on page load and every minute. Published article dates and document editions remain fixed.

Update `content/site.json` for homepage text, quick links, slideshow options, or site identity. Contact information must be verified with the school. Page content lives in `content/pages/*.json`; use valid JSON and escape quotes inside HTML strings.

## Validate and deploy

1. Run `npm run check` before submitting changes.
2. Review the local site using `npm run preview`.
3. Merge approved changes to `main`. The Pages workflow validates, builds, and deploys only `dist/`.
4. Confirm the Actions run succeeded, then open the deployed pages and downloads.

For first deployment, set repository **Settings → Pages → Build and deployment → Source → GitHub Actions**. The default URL/base path is `https://bnos-yisroel.github.io/BnosWebsite` and `/BnosWebsite`. The workflow is prepared but was not executed in this session.

After testing and school approval, configure the custom domain separately. Set `content/site.json` `url` to `https://bnosyisroel.org` and `basePath` to an empty string, rebuild, set the GitHub Pages domain and DNS, enable HTTPS, and verify canonicals, sitemap and redirects. No `CNAME` or DNS change has been made. Environment variables `SITE_URL` and `BASE_PATH` can override the configuration for staging; set both consistently.

## Roll back

Revert the relevant source/content commit in GitHub and allow Actions to redeploy. Restore an old document only if it is still the correct current edition. Keep the old WordPress export and mirror offline as references; neither is deployed.
