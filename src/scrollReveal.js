/**
 * Sets up an IntersectionObserver that adds `.is-visible` to any
 * section/element containing [data-reveal] children once it enters
 * the viewport, triggering the CSS reveal animations defined in
 * style.css. Re-observes dynamically injected content (team/projects)
 * by being called again after render, or via the mutation-safe
 * `observeAll` helper below.
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
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  function observeAll() {
    document
      .querySelectorAll('section, .team-card, .project-card')
      .forEach((el) => observer.observe(el));
  }

  observeAll();
  return observeAll; // call again after injecting dynamic content
}
