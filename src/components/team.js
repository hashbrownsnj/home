import { team } from '../data/team.js';

const ICONS = {
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><path d="M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>',
  spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 9.7 9.7 2 12l7.7 2.3L12 22l2.3-7.7L22 12l-7.7-2.3L12 2Z"/></svg>',
};

function escapeHtml(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderVentureBadge(venture) {
  return `<a class="venture-badge" href="${venture.url}" target="_blank" rel="noopener">${ICONS.spark}<span><strong>${escapeHtml(venture.role)}</strong> · ${escapeHtml(venture.name)}</span></a>`;
}

export function renderTeam() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;

  grid.innerHTML = team.map((member, i) => `
    <article class="team-card" data-reveal style="--delay:${i * 70}ms">
      <div class="team-card-top">
        <div class="team-avatar" aria-hidden="true">${escapeHtml(member.initials)}</div>
        <div>
          <h3 class="team-name">${escapeHtml(member.name)}</h3>
          <div class="team-role">${escapeHtml(member.role)}</div>
        </div>
      </div>
      <p class="team-quote">“${escapeHtml(member.quote)}”</p>
      <p class="team-bio">${escapeHtml(member.bio)}</p>
      ${member.venture ? renderVentureBadge(member.venture) : ''}
      <div class="team-links" aria-label="${escapeHtml(member.name)} social links">
        ${member.github ? `<a class="team-link" href="${member.github}" target="_blank" rel="noopener">${ICONS.github}<span>GitHub</span></a>` : ''}
        ${member.linkedin ? `<a class="team-link" href="${member.linkedin}" target="_blank" rel="noopener">${ICONS.linkedin}<span>LinkedIn</span></a>` : ''}
      </div>
    </article>`).join('');
}
