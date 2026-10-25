// Optional local QA. Uses an installed Chrome via the DevTools protocol; no npm dependencies.
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
const config=JSON.parse(await readFile('content/site.json','utf8'));
const base=config.basePath;
const server=createServer(async(req,res)=>{try{let url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(base&&!url.startsWith(base+'/')){res.writeHead(404).end();return;}url=url.slice(base.length);if(url.endsWith('/'))url+='index.html';const file=path.resolve('dist','.'+url);if(!file.startsWith(path.resolve('dist')+path.sep)){res.writeHead(403).end();return;}const data=await readFile(file);const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf'};res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(4173,'127.0.0.1',r));
const profile=await mkdtemp(path.join(tmpdir(),'bnos-chrome-'));
const chrome=spawn(process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--no-default-browser-check','--remote-debugging-port=9223',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
let socket;
try{
 let endpoint;for(let n=0;n<40;n++){try{endpoint=(await(await fetch('http://127.0.0.1:9223/json')).json()).find(t=>t.type==='page').webSocketDebuggerUrl;break;}catch{await new Promise(r=>setTimeout(r,250));}}
 if(!endpoint)throw new Error('Chrome DevTools unavailable');
 socket=new WebSocket(endpoint);await new Promise(r=>socket.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();
 socket.addEventListener('message',e=>{const m=JSON.parse(e.data);if(pending.has(m.id)){const {resolve,reject}=pending.get(m.id);pending.delete(m.id);m.error?reject(new Error(m.error.message)):resolve(m.result);}});
 const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});socket.send(JSON.stringify({id:n,method,params}));});
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await call('Page.enable');await call('Runtime.enable');
 const goto=async route=>{await call('Page.navigate',{url:`http://127.0.0.1:4173${base}${route}`});for(let i=0;i<50;i++){await new Promise(r=>setTimeout(r,100));if(await evaluate(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(base+route)} && !!document.querySelector('.menu-toggle')`))break;} if(!await evaluate(`!!document.querySelector('.menu-toggle')`))throw new Error('Site did not load. Check browser policy or preview server; no visual verification completed.');};
 const checks=[];await mkdir('docs/qa',{recursive:true});
 for(const width of [1440,768,390]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<640});
  for(const route of ['/','/parent-resources/','/admissions/','/about/','/supply-lists/','/calendar/']){
   await goto(route);
   const state=await evaluate(`({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),buttons:[...document.querySelectorAll('button')].filter(b=>!b.textContent.trim()&&!b.getAttribute('aria-label')).length})`);
   assert.ok(state.scroll<=state.width,`Overflow ${route} @ ${width}: ${JSON.stringify(state)}`);assert.equal(state.h1,1);assert.deepEqual(state.broken,[]);assert.equal(state.buttons,0);checks.push({width,route,...state});
   if(route==='/'||route==='/parent-resources/'){const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(`docs/qa/${route==='/'?'home':'resources'}-${width}.png`,Buffer.from(shot.data,'base64'));}
  }
 }
 await goto('/');
 await evaluate('document.querySelector(".menu-toggle").click()');assert.equal(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")'),'true');
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});assert.equal(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")'),'false');
 await evaluate('document.querySelector("[data-step=\"1\"]").click()');assert.equal(await evaluate('document.querySelector("[data-slide=\"1\"]").getAttribute("aria-pressed")'),'true');
 await evaluate('document.querySelector("[data-pause]").click()');assert.equal(await evaluate('document.querySelector("[data-pause]").getAttribute("aria-pressed")'),'true');
 await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await goto('/');assert.equal(await evaluate('document.querySelector("[data-pause]").textContent'),'Play slideshow');
 const first=await evaluate('document.querySelector("[data-slide=\"0\"]").getAttribute("aria-pressed")');await new Promise(r=>setTimeout(r,6500));assert.equal(await evaluate('document.querySelector("[data-slide=\"0\"]").getAttribute("aria-pressed")'),first);
 await writeFile('docs/qa/browser-results.json',JSON.stringify({checkedAt:new Date().toISOString(),checks,interactions:['mobile toggle','Escape closes navigation','next slide','pause','reduced motion disables autoplay']},null,2));
 console.log(`Browser checks passed: ${checks.length} page/viewport combinations; menu, slideshow, reduced motion.`);
}finally{socket?.close();chrome.kill();server.close();await new Promise(r=>setTimeout(r,500));await rm(profile,{recursive:true,force:true}).catch(()=>{});}
