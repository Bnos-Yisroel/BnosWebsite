/** School-local dates; resource/document years deliberately remain fixed. */
export function localDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return Object.fromEntries(parts.filter(p => ['year', 'month', 'day'].includes(p.type)).map(p => [p.type, Number(p.value)]));
}
export function schoolYear(date = new Date(), full = false) {
  const { year, month, day } = localDate(date);
  const start = year - (month < 7 || (month === 7 && day < 15) ? 1 : 0);
  return full ? `${start}-${start + 1}` : `${String(start).slice(-2)}-${String(start + 1).slice(-2)}`;
}
export function calendarYear(date = new Date()) { return localDate(date).year; }
