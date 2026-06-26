import { ExpandCard } from '../../components/ExpandCard.js';
import { tlsVersions, tlsAttacks } from './data.js';

/**
 * VersionsTab — TLS/SSL version comparison table plus a set of expandable
 * cards covering historical TLS attacks (POODLE, Heartbleed, BEAST, etc.).
 * @param {HTMLElement} panel
 */
export function VersionsTab(panel) {
  // --- Versions table -------------------------------------------------------
  const heading = document.createElement('h3');
  heading.className = 'section-title';
  heading.textContent = 'TLS / SSL versions';
  heading.style.cssText = 'margin:0 0 10px;color:var(--text-primary);';
  panel.appendChild(heading);

  const table = document.createElement('table');
  table.className = 'cheat-table';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Version</th><th>Year</th><th>Status</th><th>Note</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const v of tlsVersions) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td><strong>${v.version}</strong></td>` +
      `<td>${v.year}</td>` +
      `<td>${v.status}</td>` +
      `<td>${v.note}</td>`;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  panel.appendChild(table);

  // --- Attacks as expand cards ---------------------------------------------
  const attacksHeading = document.createElement('h3');
  attacksHeading.className = 'section-title';
  attacksHeading.textContent = 'Historical TLS attacks';
  attacksHeading.style.cssText = 'margin:24px 0 10px;color:var(--text-primary);';
  panel.appendChild(attacksHeading);

  for (const a of tlsAttacks) {
    const card = ExpandCard({
      title: `${a.name} (${a.year})`,
      open: a === tlsAttacks[0],
      renderBody(body) {
        const grid = document.createElement('div');
        grid.className = 'mini-grid';

        const targets = document.createElement('div');
        targets.className = 'mini';
        targets.innerHTML =
          `<div class="mini-label">Targets</div>` +
          `<div class="mini-body">${a.targets}</div>`;
        grid.appendChild(targets);

        const how = document.createElement('div');
        how.className = 'mini';
        how.innerHTML =
          `<div class="mini-label">How it works</div>` +
          `<div class="mini-body">${a.how}</div>`;
        grid.appendChild(how);

        const fix = document.createElement('div');
        fix.className = 'mini';
        fix.innerHTML =
          `<div class="mini-label">Fix</div>` +
          `<div class="mini-body">${a.fix}</div>`;
        grid.appendChild(fix);

        body.appendChild(grid);
      }
    });
    panel.appendChild(card);
  }
}
