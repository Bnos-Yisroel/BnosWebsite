export function eligibleNews(articles, today) {
  return articles.filter(a => a.status === 'published' && a.date >= '2025-01-01' && a.date <= today).sort((a,b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
export function validateArticle(a) {
  for (const field of ['title','slug','date','status','body']) if (typeof a[field] !== 'string' || !a[field].trim()) throw new Error(`Article requires ${field}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug)) throw new Error('Invalid article slug');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date) || new Date(a.date).toISOString().slice(0,10) !== a.date) throw new Error('Invalid publication date');
  if (!['draft','published'].includes(a.status)) throw new Error('Invalid article status');
  if (a.image && !a.imageAlt) throw new Error('Featured images require imageAlt');
  if (/<script|\son\w+\s*=|javascript:/i.test(a.body)) throw new Error('Article contains executable content');
}
