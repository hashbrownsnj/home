import { initHeroScene } from './three/heroScene.js';
import { renderTeam } from './components/team.js';
import { renderProjects } from './components/projects.js';
import { setupScrollReveal } from './scrollReveal.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('heroCanvas');
if (canvas && !prefersReducedMotion) initHeroScene(canvas);

renderTeam();
renderProjects();

const reobserve = setupScrollReveal();
reobserve();

requestAnimationFrame(() => document.querySelector('.hero')?.classList.add('is-loaded'));

const nav = document.getElementById('nav');
const progressBar = document.getElementById('scrollProgress');
let scrollY = window.scrollY;
let smoothScroll = scrollY;
let ticking = false;

function updateScrollEffects() {
  smoothScroll += (scrollY - smoothScroll) * 0.12;
  nav?.classList.toggle('scrolled', scrollY > 24);

  if (progressBar) {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
    progressBar.style.width = `${(scrollY / max) * 100}%`;
  }

  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const depth = Number(el.dataset.parallax || 0);
    el.style.transform = `translate3d(0, ${smoothScroll * depth * 0.004}px, 0)`;
  });

  ticking = false;
}

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}, { passive: true });
updateScrollEffects();

const cursorOrb = document.getElementById('cursorOrb');
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let orbX = pointerX;
let orbY = pointerY;

window.addEventListener('pointermove', (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;

  document.querySelectorAll('.feature-card, .team-card, .project-card, .panel').forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    }
  });
}, { passive: true });

function animateOrb() {
  if (cursorOrb && !prefersReducedMotion) {
    orbX += (pointerX - orbX) * 0.09;
    orbY += (pointerY - orbY) * 0.09;
    cursorOrb.style.transform = `translate3d(${orbX - 180}px, ${orbY - 180}px, 0)`;
    requestAnimationFrame(animateOrb);
  }
}
animateOrb();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
});
