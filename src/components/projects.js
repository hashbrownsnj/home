import { projects } from '../data/projects.js';

/**
 * Builds a live screenshot preview URL for any project link using
 * a free, no-key screenshot microservice (microlink.io's image API).
 * If you'd rather supply your own image, just set `cover` on the
 * project object in src/data/projects.js and it'll be used instead.
 */
function buildPreviewUrl(url) {
  return `https://api.microlink.io/?url=${encodeURIComponent(
    url
  )}&screenshot=true&meta=false&embed=screenshot.url&waitFor=600`;
}

function escapeHtml(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderCard(project, i) {
  const cover = project.cover || buildPreviewUrl(project.url);
  const accent = project.accent || 'var(--gold)';

  return `
    <div class="project-card" data-reveal style="animation-delay:${(i % 6) * 0.07}s; --accent:${accent}">
      <div class="project-cover">
        <div class="project-cover-fallback">NO PREVIEW</div>
        <img
          src="${cover}"
          alt="${escapeHtml(project.title)} preview"
          loading="lazy"
          onerror="this.style.display='none'"
        />
        <div class="project-status">
          <span class="status-pip ${project.status || 'build'}"></span>
          ${escapeHtml(project.status || 'build')}
        </div>
      </div>
      <div class="project-body">
        <div class="project-meta">
          <span class="project-title">${escapeHtml(project.title)}</span>
          <span class="project-year">${escapeHtml(project.year || '')}</span>
        </div>
        <p class="project-desc">${escapeHtml(project.description)}</p>
        <div class="project-tags">
          ${(project.tags || [])
            .map((t) => `<span class="project-tag">${escapeHtml(t)}</span>`)
            .join('')}
        </div>
        <div class="project-actions">
          <a href="${project.url}" target="_blank" rel="noopener" class="primary">Visit</a>
          ${
            project.repo
              ? `<a href="${project.repo}" target="_blank" rel="noopener">Source</a>`
              : ''
          }
        </div>
      </div>
    </div>
  `;
}

export function renderProjects() {
  const grid = document.getElementById('projectsGrid');

  if (!projects.length) {
    grid.innerHTML = `
      <div class="projects-empty">
        No projects yet. Add one in <code>src/data/projects.js</code> —
        just drop in a URL and a description, the preview builds itself.
      </div>
    `;
    return;
  }

  grid.innerHTML = projects.map(renderCard).join('');
}
