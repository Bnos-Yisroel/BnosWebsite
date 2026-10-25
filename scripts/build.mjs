import { readFile, readdir, mkdir, writeFile, rm, cp } from 'node:fs/promises';
import { eligibleNews, validateArticle } from './content.mjs';
import { localDate, calendarYear, schoolYear } from '../assets/dates.js';
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const site = await read('content/site.json');
const escape = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const base = (process.env.BASE_PATH ?? site.basePath).replace(/\/$/,'');
if (base && !/^\/[A-Za-z0-9/_-]+$/.test(base)) throw new Error('Invalid BASE_PATH');
const origin = (process.env.SITE_URL ?? site.url).replace(/\/$/,'');
if (!/^https:\/\//.test(origin)) throw new Error('SITE_URL must use HTTPS');
for (const key of ['name','description','mission','contact','hero','quickLinks']) if (!site[key]) throw new Error(`Missing configuration: ${key}`);
for (const key of ['eyebrow','title','text']) if (typeof site.hero[key] !== 'string' || !site.hero[key]) throw new Error(`Missing hero ${key}`);
for (const key of ['address','phone','email']) if (typeof site.contact[key] !== 'string' || !site.contact[key]) throw new Error(`Missing contact ${key}`);
if (!Array.isArray(site.quickLinks) || !site.quickLinks.length || site.quickLinks.some(q=>!q.title || !q.href || !q.detail)) throw new Error('Invalid quick links');
if (!Array.isArray(site.hero.slides) || !Number.isFinite(site.hero.interval)) throw new Error('Invalid slideshow configuration');
if (!site.hero.slides.length || site.hero.interval < 5000) throw new Error('Configure slides and an interval >= 5000ms');
for (const slide of site.hero.slides) if (!slide.src || !slide.alt) throw new Error('Every slide needs src and alt');
const prefix = html => html.replace(/(href|src|action)="\/(?!\/)/g, `$1="${base}/`);
const files = await readdir('content/news');
const articles = await Promise.all(files.filter(f => f.endsWith('.json')).map(f => read(`content/news/${f}`)));
articles.forEach(validateArticle);
if (new Set(articles.map(a => a.slug)).size !== articles.length) throw new Error('Duplicate news slug');
const {year,month,day} = localDate();
const today = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
const news = eligibleNews(articles,today);
await rm('dist',{recursive:true,force:true}); await mkdir('dist'); await cp('assets','dist/assets',{recursive:true,filter:source => !source.split('/').some(part=>part.startsWith('.'))});
const navGroups = [
 ['About','/about/',[['Our mission','/about/'],['Testimonials','/testimonials/']]],
 ['Admissions','/admissions/'],
 ['News & Events','/news-and-events/',[['School news','/news-and-events/'],['Calendar','/calendar/']]],
 ['Parent Resources','/parent-resources/',[['Resource dashboard','/parent-resources/'],...site.quickLinks.map(x => [x.title,x.href]),['Testing calendars','/school-testing-calendars/']]],
 ['Alumnae','/alum/',[['Alumnae community','/alum/'],['Shidduch initiative','/shidduchinitiative/']]],['Contact','/contact-us/']
];
const nav = navGroups.map(([name,href,children]) => children ? `<details><summary>${escape(name)}</summary><div class="dropdown">${children.map(([n,u])=>`<a href="${u}">${escape(n)}</a>`).join('')}</div></details>` : `<a href="${href}">${name}</a>`).join('');
const paths = new Set();
async function page(slug,title,body,{description=site.description,article=null,home=false}={}) {
 const path = slug ? `/${slug}/` : '/'; if(paths.has(path)) throw new Error(`Duplicate route ${path}`); paths.add(path);
 const canonical = origin + path;
 const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} | Bnos Yisroel</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="${article?'article':'website'}">${article?`<meta property="article:published_time" content="${article.date}">`:''}<meta name="theme-color" content="#4d2960"><link rel="icon" href="/assets/branding/logo.png"><link rel="stylesheet" href="/assets/styles.css"><script type="module" src="/assets/site.js"></script></head><body><a class="skip" href="#main">Skip to content</a><div class="utility"><div class="wrap"><span>A community of learning. A lifetime of growth.</span><a href="https://bny.parentlocker.com/">ParentLocker ↗</a></div></div><header><div class="header-inner"><a class="brand" href="/" aria-label="Bnos Yisroel home"><img src="/assets/branding/logo.png" width="300" height="113" alt="Bnos Yisroel of Baltimore"></a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation">Menu <span aria-hidden="true">☰</span></button><nav id="navigation" aria-label="Main navigation">${nav}<a class="button small" href="/donate/">Support Bnos <span aria-hidden="true">↗</span></a></nav></div></header><main id="main">${home?body:`<div class="page-heading"><div class="wrap"><a class="breadcrumb" href="/">Home</a><span aria-hidden="true"> / </span><span>Bnos Yisroel</span><h1>${escape(title)}</h1></div></div><div class="wrap page-content">${body}</div>`}</main><footer><div class="wrap footer-grid"><div><img class="footer-logo" src="/assets/branding/logo.png" width="300" height="113" alt="Bnos Yisroel of Baltimore"><p>Growing together.<br>One student at a time.</p></div><div><h2>Get in touch</h2><p>${escape(site.contact.address)}</p><a href="tel:+14435243200">${site.contact.phone}</a><br><a href="mailto:${site.contact.email}">${site.contact.email}</a></div><div><h2>Explore</h2><a href="/about/">About our school</a><a href="/admissions/">Admissions</a><a href="/parent-resources/">Parent resources</a><a href="/alum/">Alumnae</a></div><div><h2>Make a difference</h2><a href="/donate/">Support & sponsorships</a><a href="/legacy/">Legacy giving</a><a href="/birthday-book-club/">Birthday Book Club</a><a href="/contact-us/">Contact us</a><a href="/tech-privacy-policy/">Technology privacy policy</a></div></div><div class="wrap footer-bottom"><span>© <span data-year>${calendarYear()}</span> Bnos Yisroel of Baltimore</span><span>School year <span data-school-year>${schoolYear()}</span></span></div></footer></body></html>`;
 await mkdir(`dist/${slug}`,{recursive:true}); await writeFile(`dist/${slug?slug+'/':''}index.html`,prefix(doc));
}
function cards(items) { return `<div class="cards">${items.map(a=>`<article class="card">${a.image?`<img src="${escape(a.image)}" alt="${escape(a.imageAlt)}" loading="lazy" width="600" height="400">`:''}<div class="card-body"><time datetime="${a.date}">${new Date(a.date+'T12:00:00Z').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric',timeZone:'America/New_York'})}</time><h3><a href="/news/${a.slug}/">${escape(a.title)}</a></h3>${a.summary?`<p>${escape(a.summary)}</p>`:''}<a href="/news/${a.slug}/">Read article <span aria-hidden="true">↗</span></a></div></article>`).join('')}</div>`; }
const quick = `<div class="quick-strip"><div class="wrap quick-inner"><span class="quick-label">FOR OUR<br><strong>FAMILIES</strong></span>${site.quickLinks.map((q,i)=>`<a href="${q.href}"><span class="quick-number" aria-hidden="true">0${i+1}</span><span><strong>${q.title}</strong><small>${q.detail}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div></div>`;
await page('','Welcome',`<section class="hero" aria-label="Welcome to Bnos Yisroel"><div class="hero-copy"><p class="eyebrow">${site.hero.eyebrow}</p><h1>${escape(site.hero.title).replace('\n','<br>')}</h1><div class="rule"></div><p class="hero-text">${site.hero.text}</p><div class="actions"><a class="button" href="/about/">Discover Bnos <span aria-hidden="true">↗</span></a><a class="text-link" href="/admissions/">Explore admissions <span aria-hidden="true">→</span></a></div></div><div class="hero-photo" data-slideshow data-interval="${site.hero.interval}" role="region" aria-roledescription="carousel" aria-label="School photographs">${site.hero.slides.map((s,i)=>`<div class="slide" role="group" aria-roledescription="slide" aria-label="${i+1} of ${site.hero.slides.length}" ${i?'hidden':''}><img src="${s.src}" alt="${escape(s.alt)}" width="800" height="533" ${i?'loading="lazy"':'fetchpriority="high"'}></div>`).join('')}<div class="slideshow-controls"><button data-step="-1" aria-label="Previous photograph">←</button><div class="dots">${site.hero.slides.map((s,i)=>`<button data-slide="${i}" aria-label="Show photograph ${i+1}" aria-pressed="${!i}"><span></span></button>`).join('')}</div><button data-step="1" aria-label="Next photograph">→</button><button class="pause" data-pause>Pause slideshow</button></div><span class="sr-only" data-status></span></div></section>${quick}<section class="mission wrap"><div><p class="eyebrow">Rooted in Torah. Inspired by possibility.</p><h2>Every student.<br>A world of potential.</h2></div><div><p>${site.mission}</p><a class="text-link" href="/about/">Our mission & commitment <span aria-hidden="true">→</span></a></div></section><section class="news-section"><div class="wrap"><div class="section-top"><div><p class="eyebrow">Life at Bnos</p><h2>From our school community</h2></div><a class="text-link" href="/news-and-events/">All news & events ↗</a></div>${news.length?cards(news.slice(0,3)):'<div class="news-empty"><p>Explore our school newsletters and moments from the classroom.</p><a href="/news-and-events/">Visit News & Events →</a></div>'}</div></section>`,{home:true});
for (const file of (await readdir('content/pages')).filter(f=>f.endsWith('.json'))) {
 const p=await read(`content/pages/${file}`);
 let body=p.body;
 // Source headings become the template title; avoid repeating it inside the article.
 body=body.replace(/^\s*<h2>(?:<span>)?[^<]*(?:<\/span>)?<\/h2>/,'');
 if(p.slug==='news-and-events') body=(news.length?cards(news):'')+'<h2>School newsletters & videos</h2><p>From the school’s 2026 newsletter collection.</p>'+body;
 await page(p.slug,p.title,`<article class="prose">${body}</article>`);
}
const custom = [
 ['admissions','Admissions',`<div class="intro-grid"><div class="prose"><p class="eyebrow">Your daughter’s next chapter</p><h2>A place to learn. A place to belong.</h2><p>${site.mission}</p><h2>Applications & enrollment</h2><p>For information about enrolling at Bnos Yisroel, contact the school office. Applications for the 2027–2028 school year are available through ParentLocker. For enrollment in the current school year, please contact the office.</p><div class="resource-list"><a href="https://bny.parentlocker.com/2027-2028Newstudentapplication-form/">2027–2028 new student application ↗</a></div><p><a href="mailto:${site.contact.email}">${site.contact.email}</a><br><a href="tel:+14435243200">${site.contact.phone}</a></p></div><img src="/assets/images/Bnos-First-Day-19.jpg" width="800" height="510" alt="Students at Bnos Yisroel on the first day of school"></div>`],
 ['birthday-book-club','Birthday Book Club','<div class="prose"><p>Celebrate your granddaughter’s birthday by donating a book to the school library in her honor. A bookplate with your name is placed inside the front cover — and she will be the first to bring the book home.</p><h2>Give a book in her honor</h2><p>To arrange a Birthday Book Club gift and bookplate, please contact <a href="mailto:businessoffice@bnosyisroel.org?subject=Birthday%20Book%20Club">the business office</a> or call <a href="tel:+14435243200">443-524-3200</a>.</p></div>'],
 ['ptby','PTBY','<div class="prose"><h2>Birthday Book Club</h2><p>Donate a book to the Bnos Yisroel library in honor of a student’s birthday.</p><a class="button" href="/birthday-book-club/">Learn about the Birthday Book Club →</a></div>'],
 ['sfsp','Summer Meals To-Go','<div class="prose"><p class="notice">Summer 2026 program — this season has ended.</p><p>The summer program offered a box containing seven breakfasts and seven lunches each week through drive-thru pickup locations.</p><p>For current meal programs and registration information, visit <a href="/parent-resources/food-service-resources/">Food Service Resources</a> or contact the school office.</p></div>']
];
for (const [slug,title,body] of custom) await page(slug,title,body);
const categories = [
 ['Everyday essentials',site.quickLinks.map(q=>[q.title,q.href,q.detail])],
 ['Accounts & enrollment', [['ParentLocker','https://bny.parentlocker.com/','Your family’s school account'],['Admissions','/admissions/','Applications & enrollment'],['Tuition inquiries','/contact-us/','Contact the business office']]],
 ['Student life & forms',[['Testing calendars','/school-testing-calendars/','Middle school & high school'],['Food service forms','/parent-resources/food-service-resources/','Lunch registration & meal benefits'],['Wellness','/wellness/','School wellness information'],['PTBY','/ptby/','Supporting our school community']]]
];
await page('parent-resources','Parent Resources',`<p class="page-lead">The school day, made simpler. Find the information your family needs in one place.</p>${categories.map(([title,links])=>`<section class="resource-category"><h2>${title}</h2><div class="resource-grid">${links.map(([n,u,d])=>`<a class="resource-card" href="${u}"><span class="resource-arrow" aria-hidden="true">↗</span><h3>${n}</h3><p>${d}</p></a>`).join('')}</div></section>`).join('')}`);
for (const a of news) await page(`news/${a.slug}`,a.title,`<article class="prose"><p><time datetime="${a.date}">${a.date}</time></p>${a.image?`<img src="${a.image}" alt="${escape(a.imageAlt)}" width="800" height="533">`:''}${a.body}<p><a href="/news-and-events/">← All news</a></p></article>`,{description:a.summary||site.description,article:a});
const redirects = {'enrollment':'admissions','uniform-2':'uniform','food-service-resources':'parent-resources/food-service-resources','contact-confirm':'contact-us','news':'news-and-events'};
for (const [old,target] of Object.entries(redirects)) {
 await mkdir(`dist/${old}`,{recursive:true});await writeFile(`dist/${old}/index.html`,`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Page moved | Bnos Yisroel</title><meta http-equiv="refresh" content="0;url=${base}/${target}/"><link rel="canonical" href="${origin}/${target}/"></head><body><p>This page has moved to <a href="${base}/${target}/">${target.replaceAll('-',' ')}</a>.</p></body></html>`);
}
await writeFile('dist/enrollment.html',await readFile('dist/enrollment/index.html'));
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...paths].map(p=>`<url><loc>${origin}${p}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile('dist/.nojekyll','');
await page('404','Page not found','<p>We couldn’t find this page. Visit the <a href="/">homepage</a> or <a href="/parent-resources/">Parent Resources</a>.</p>');
await cp('dist/404/index.html','dist/404.html');await rm('dist/404',{recursive:true});
console.log(`Built ${paths.size} pages, ${news.length} eligible articles. Base path: ${base || '/'}`);
