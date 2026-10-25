import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const config=JSON.parse(await readFile('content/site.json','utf8'));
const base=(process.env.BASE_PATH??config.basePath).replace(/\/$/,'');
const server=createServer(async(req,res)=>{
 try{
  let url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(url==='/'&&base){res.writeHead(302,{Location:base+'/'}).end();return;}
  if(base&&!url.startsWith(base+'/')){res.writeHead(404).end('Not found');return;}
  url=url.slice(base.length);if(url.endsWith('/'))url+='index.html';
  const file=path.resolve('dist','.'+url);
  if(!file.startsWith(path.resolve('dist')+path.sep)){res.writeHead(403).end();return;}
  const data=await readFile(file);
  const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.pdf':'application/pdf','.xml':'application/xml'};
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data);
 }catch{res.writeHead(404,{'Content-Type':'text/html'});res.end(await readFile('dist/404.html').catch(()=>'Not found'));}
});
server.listen(4173,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:4173${base}/`));
