import { team } from '../data/team.js';

export function renderTeam() {
  const grid = document.getElementById('teamGrid');
  grid.innerHTML = team
    .map(
      (member, i) => `
    <div class="team-card" data-reveal style="animation-delay:${i * 0.08}s">
      <div class="team-card-top">
        <div class="team-avatar">${member.initials}</div>
        <div>
          <div class="team-name">${escapeHtml(member.name)}</div>
          <div class="team-role">${escapeHtml(member.role)}</div>
        </div>
      </div>
      <p class="team-quote">&ldquo;${escapeHtml(member.quote)}&rdquo;</p>
      <p class="team-bio">${escapeHtml(member.bio)}</p>
      ${member.venture ? renderVentureBadge(member.venture) : ''}
      <div class="team-links">
        ${
          member.github
            ? `<a class="team-link" href="${member.github}" target="_blank" rel="noopener">GitHub &rarr;</a>`
            : ''
        }
        ${
          member.linkedin
            ? `<a class="team-link" href="${member.linkedin}" target="_blank" rel="noopener">LinkedIn &rarr;</a>`
            : ''
        }
      </div>
    </div>
  `
    )
    .join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Small calendar/event-planning glyph — represents PlanIt without
// pulling in an icon library. Inline SVG, currentColor-friendly.
const CALENDAR_ICON = `
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2"></rect>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <line x1="8" y1="3" x2="8" y2="7"></line>
    <line x1="16" y1="3" x2="16" y2="7"></line>
    <circle cx="8.5" cy="14.5" r="1.1" fill="currentColor" stroke="none"></circle>
    <circle cx="12.5" cy="14.5" r="1.1" fill="currentColor" stroke="none"></circle>
    <circle cx="16.5" cy="14.5" r="1.1" fill="currentColor" stroke="none"></circle>
  </svg>
`;

function renderVentureBadge(venture) {
  return `
    <a class="venture-badge" href="${venture.url}" target="_blank" rel="noopener">
      <span class="venture-badge-icon">${CALENDAR_ICON}</span>
      <span class="venture-badge-text">
        <strong>${escapeHtml(venture.role)}</strong> &middot; ${escapeHtml(venture.name)}
      </span>
      <span class="venture-badge-arrow">&rarr;</span>
    </a>
  `;
}
