export function setupScrollReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -80px 0px' });

  function observeAll() {
    document.querySelectorAll('[data-reveal], .team-card, .project-card').forEach((el) => observer.observe(el));
  }

  observeAll();
  return observeAll;
}
