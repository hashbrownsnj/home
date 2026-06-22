import { projects } from '../data/projects.js';

function buildPreviewUrl(url) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&waitFor=600`;
}

function escapeHtml(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderCard(project, i) {
  const cover = project.cover || buildPreviewUrl(project.url);
  const accent = project.accent || '#38bdf8';
  return `
    <article class="project-card" data-reveal style="--delay:${i * 90}ms;--accent:${accent}">
      <div class="project-cover">
        <div class="project-cover-fallback">Preview loading</div>
        <img src="${cover}" alt="${escapeHtml(project.title)} preview" loading="lazy" decoding="async" onerror="this.style.display='none'" />
        <div class="project-status"><span class="status-pip ${escapeHtml(project.status || 'build')}"></span>${escapeHtml(project.status || 'build')}</div>
      </div>
      <div class="project-body">
        <div class="project-meta"><h3 class="project-title">${escapeHtml(project.title)}</h3><span class="project-year">${escapeHtml(project.year || '')}</span></div>
        <p class="project-desc">${escapeHtml(project.description)}</p>
        <div class="project-tags">${(project.tags || []).map((tag) => `<span class="project-tag">${escapeHtml(tag)}</span>`).join('')}</div>
        <div class="project-actions">
          <a class="primary" href="${project.url}" target="_blank" rel="noopener">Launch</a>
          ${project.repo ? `<a href="${project.repo}" target="_blank" rel="noopener">Source</a>` : ''}
        </div>
      </div>
    </article>`;
}

export function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = projects.length
    ? projects.map(renderCard).join('')
    : '<div class="empty-state projects-empty"><strong>No projects yet</strong><span>Add one in src/data/projects.js.</span></div>';
}
