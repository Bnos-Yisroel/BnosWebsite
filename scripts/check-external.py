"""Read-only availability probe. A response does not verify forms or payments."""
import concurrent.futures,datetime,html,json,re,urllib.request,urllib.error
from pathlib import Path
urls=set()
for f in Path('dist').rglob('*.html'):
 for u in re.findall(r'(?:href|src|action)="(https?://[^"]+)"',f.read_text()):
  u=html.unescape(u)
  if not any(s in u for s in ['bnos-yisroel.github.io','og:']):urls.add(u)
def check(u):
 try:
  req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 (Bnos website migration link check)'})
  with urllib.request.urlopen(req,timeout=15) as r:return {'url':u,'status':r.status,'destination':r.url,'result':'reachable; workflow not verified'}
 except Exception as e:return {'url':u,'result':'needs manual review','error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:results=list(pool.map(check,sorted(urls)))
Path('docs/external-link-report.json').write_text(json.dumps({'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'GET only; no submissions, login, or payments','links':results},indent=2)+'\n')
print(json.dumps(results,indent=2))
