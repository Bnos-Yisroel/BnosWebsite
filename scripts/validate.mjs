import {readdir, readFile, stat} from 'node:fs/promises';
import path from 'node:path';
const config=JSON.parse(await readFile('content/site.json','utf8'));
const base=(process.env.BASE_PATH??config.basePath).replace(/\/$/,'');
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const files=await walk('dist'), errors=[];
let refs=0;
for(const f of files.filter(f=>f.endsWith('.html'))){
 const html=await readFile(f,'utf8');
 if(/wp-content|et_pb_|\[contact-form|<script[^>]+https?:/.test(html))errors.push(`${f}: legacy dependency`);
 if(!/<html lang="en"/.test(html)||!/<title>[^<]+<\/title>/.test(html)||!/<link rel="canonical"/.test(html)) errors.push(`${f}: missing document metadata`);
 if(!html.includes('http-equiv="refresh"')&&(html.match(/<h1[ >]/g)||[]).length!==1)errors.push(`${f}: expected one H1`);
 for(const tag of html.matchAll(/<img\b[^>]*>/g)) if(!/\balt="[^"]*"/.test(tag[0]))errors.push(`${f}: missing image alt`);
 for(const tag of html.matchAll(/<iframe\b[^>]*>/g)) if(!/\btitle="[^"]+"/.test(tag[0]))errors.push(`${f}: missing frame title`);
 for(const match of html.matchAll(/(?:href|src|action)="([^"]+)"/g)){
  const raw=match[1].replaceAll('&amp;','&');
  if(/^(https?:|mailto:|tel:|data:)/.test(raw))continue;
  if(raw.startsWith('#')){if(!html.includes(`id="${raw.slice(1)}"`))errors.push(`${f}: missing anchor ${raw}`);continue;}
  let u=decodeURIComponent(raw.split(/[?#]/)[0]);
  if(u.startsWith('/')){if(base&&!u.startsWith(base+'/')){errors.push(`${f}: reference outside base path ${u}`);continue;}u=u.slice(base.length);}
  else{u='/'+path.relative('dist',path.resolve(path.dirname(f),u));}
  const target=path.join('dist',u);refs++;
  try{const s=await stat(target);if(s.isDirectory())await stat(path.join(target,'index.html'));}catch{errors.push(`${f}: missing ${raw}`);}
 }
}
for(const forbidden of ['Legacy Site','bnosyisroel-mirror','.git','content'])if(files.some(f=>f.split(path.sep).includes(forbidden)))errors.push('Private reference/source material deployed');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`Validated ${files.filter(f=>f.endsWith('.html')).length} HTML files and ${refs} internal references.`);
