/**
 * Sets up an IntersectionObserver that adds `.is-visible` to any
 * section/element containing [data-reveal] children once it enters
 * the viewport, triggering the CSS reveal animations defined in
 * style.css.
 */
export function setupScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  function observeAll() {
    document
      .querySelectorAll('section, .team-card, .project-card, .pillar')
      .forEach((el) => observer.observe(el));
  }

  observeAll();
  return observeAll;
}
