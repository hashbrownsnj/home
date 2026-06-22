import { initHeroScene } from './three/heroScene.js';
import { renderTeam } from './components/team.js';
import { renderProjects } from './components/projects.js';
import { setupScrollReveal } from './scrollReveal.js';

// ---------- 1. Three.js hero background ----------
const canvas = document.getElementById('heroCanvas');
if (canvas) initHeroScene(canvas);

// ---------- 2. Render dynamic content ----------
renderTeam();
renderProjects();

// ---------- 3. Scroll-triggered reveals ----------
const reobserve = setupScrollReveal();
reobserve(); // catch the freshly-rendered team/project cards

// ---------- 4. Hero load-in sequence ----------
requestAnimationFrame(() => {
  document.querySelector('.hero').classList.add('is-loaded');
});

// ---------- 5. Nav background on scroll ----------
const nav = document.getElementById('nav');
function onScrollNav() {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}
window.addEventListener('scroll', onScrollNav, { passive: true });

// ---------- 6. Scroll progress bar ----------
const progressBar = document.getElementById('scrollProgress');
function onScrollProgress() {
  const doc = document.documentElement;
  const scrolled = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
  progressBar.style.width = `${scrolled}%`;
}
window.addEventListener('scroll', onScrollProgress, { passive: true });

// ---------- 7. Custom cursor ----------
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top = `${mouseY}px`;
});

function animateCursorRing() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top = `${ringY}px`;
  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

document.addEventListener('mouseover', (e) => {
  if (e.target.closest('a, button, .pillar, .project-card, .team-card')) {
    cursorRing.classList.add('hover');
  }
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest('a, button, .pillar, .project-card, .team-card')) {
    cursorRing.classList.remove('hover');
  }
});

// ---------- 8. Smooth-scroll for nav anchors ----------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
