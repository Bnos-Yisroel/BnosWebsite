import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,cp,mkdir,writeFile,readFile,rm,access} from 'node:fs/promises';import {tmpdir} from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';
test('full build publishes individual articles, latest three, media and redirects; excludes drafts and old content',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'bnos-build-test-'));
 try{
  for(const folder of ['scripts','assets','content'])await cp(folder,path.join(dir,folder),{recursive:true});
  await writeFile(path.join(dir,'package.json'),'{"type":"module"}');
  for(const [slug,date,status] of [['one','2025-01-01','published'],['two','2025-02-01','published'],['three','2025-03-01','published'],['four','2025-04-01','published'],['old','2024-12-31','published'],['draft','2025-05-01','draft'],['future','2099-01-01','published']]){
   await writeFile(path.join(dir,'content/news',slug+'.json'),JSON.stringify({slug,title:'Fixture '+slug,date,status,image:'/assets/homepage/slide-1.jpg',imageAlt:'Test school image',body:'<h2>News detail</h2><p>Formatted <strong>article</strong> content.</p>'}));
  }
  const env={...process.env,BASE_PATH:'/test-site',SITE_URL:'https://example.org/test-site'};
  execFileSync(process.execPath,['scripts/build.mjs'],{cwd:dir,env});
  execFileSync(process.execPath,['scripts/validate.mjs'],{cwd:dir,env});
  const home=await readFile(path.join(dir,'dist/index.html'),'utf8');assert.ok(home.indexOf('Fixture four')<home.indexOf('Fixture three'));assert.ok(home.includes('Fixture two'));assert.ok(!home.includes('Fixture one'));assert.ok(!home.includes('Fixture old'));assert.ok(!home.includes('Fixture draft'));
  const article=await readFile(path.join(dir,'dist/news/one/index.html'),'utf8');assert.ok(article.includes('Formatted <strong>article</strong>'));assert.ok(article.includes('/test-site/assets/homepage/slide-1.jpg'));
  for(const slug of ['old','draft','future'])await assert.rejects(access(path.join(dir,'dist/news',slug,'index.html')));
  assert.ok((await readFile(path.join(dir,'dist/enrollment.html'),'utf8')).includes('/test-site/admissions/'));
 }finally{await rm(dir,{recursive:true,force:true});}
});
