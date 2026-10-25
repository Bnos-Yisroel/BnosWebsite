import { schoolYear, calendarYear } from './dates.js';
function updateDates() {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = calendarYear());
  document.querySelectorAll('[data-school-year]').forEach(el => el.textContent = schoolYear(new Date(), el.dataset.schoolYear === 'full'));
}
updateDates(); setInterval(updateDates, 60000);
const menu = document.querySelector('#navigation');
const toggle = document.querySelector('.menu-toggle');
toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', open); menu.classList.toggle('open', open); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const open = document.querySelector('details[open]'); if (open) { open.open = false; open.querySelector('summary').focus(); } else if (menu.classList.contains('open')) { toggle.click(); toggle.focus(); } } });
document.querySelectorAll('nav details').forEach(detail => detail.addEventListener('toggle', () => { if (detail.open) document.querySelectorAll('nav details').forEach(other => { if (other !== detail) other.open = false; }); }));
document.addEventListener('click', e => { if (!e.target.closest('nav')) document.querySelectorAll('nav details').forEach(d => d.open = false); });
const hero = document.querySelector('[data-slideshow]');
if (hero) {
  const slides = [...hero.querySelectorAll('.slide')], dots = [...hero.querySelectorAll('[data-slide]')], pause = hero.querySelector('[data-pause]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, paused = reduced.matches, timer;
  const show = next => { index = (next + slides.length) % slides.length; slides.forEach((s,i) => s.hidden = i !== index); dots.forEach((d,i) => d.setAttribute('aria-pressed', String(i === index))); hero.querySelector('[data-status]').textContent = `Photograph ${index + 1} of ${slides.length}`; };
  const sync = () => { clearInterval(timer); pause.textContent = paused ? 'Play slideshow' : 'Pause slideshow'; pause.setAttribute('aria-pressed', String(paused)); if (!paused && !document.hidden && !hero.contains(document.activeElement) && slides.length > 1) timer = setInterval(() => show(index+1), Number(hero.dataset.interval)); };
  pause.addEventListener('click', () => { paused = !paused; sync(); });
  hero.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => { show(index + Number(b.dataset.step)); sync(); }));
  dots.forEach((b,i) => b.addEventListener('click', () => { show(i); sync(); }));
  hero.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); show(index + (e.key === 'ArrowLeft' ? -1 : 1)); sync(); } });
  hero.addEventListener('focusin', sync); hero.addEventListener('focusout', () => setTimeout(sync));
  document.addEventListener('visibilitychange', sync); reduced.addEventListener('change', () => { paused = reduced.matches; sync(); });
  show(0); sync();
}
