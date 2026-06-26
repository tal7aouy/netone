import { ExpandCard } from '../../components/ExpandCard.js';
import { firewallRules, natTroubleshooting } from './data.js';

/**
 * RulesTab — common firewall rule patterns rendered as a cheat table,
 * plus NAT troubleshooting scenarios as expandable cards.
 *
 * @param {HTMLElement} panel - the tab panel to build into
 */
export function RulesTab(panel) {
  // Section heading: firewall rules
  const rulesHead = document.createElement('div');
  rulesHead.style.fontSize = '13px';
  rulesHead.style.textTransform = 'uppercase';
  rulesHead.style.letterSpacing = '0.06em';
  rulesHead.style.color = 'var(--text-muted)';
  rulesHead.textContent = 'Common firewall rule patterns';
  panel.appendChild(rulesHead);

  // Cheat table of firewall rules
  const table = document.createElement('table');
  table.className = 'cheat-table';

  const thead = document.createElement('thead');
  thead.innerHTML =
    '<tr><th>Rule</th><th>Command</th><th>Why</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const r of firewallRules) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td><strong>${r.rule}</strong></td>` +
      `<td><code>${r.command}</code></td>` +
      `<td>${r.why}</td>`;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  panel.appendChild(table);

  // Section heading: NAT troubleshooting
  const tsHead = document.createElement('div');
  tsHead.style.marginTop = '24px';
  tsHead.style.fontSize = '13px';
  tsHead.style.textTransform = 'uppercase';
  tsHead.style.letterSpacing = '0.06em';
  tsHead.style.color = 'var(--text-muted)';
  tsHead.textContent = 'NAT troubleshooting';
  panel.appendChild(tsHead);

  // One expand card per troubleshooting scenario
  for (const t of natTroubleshooting) {
    const card = ExpandCard({
      title: t.problem,
      renderBody(body) {
        const grid = document.createElement('div');
        grid.className = 'mini-grid';

        const cause = document.createElement('div');
        cause.className = 'mini';
        cause.innerHTML =
          `<div class="mini-label">Cause</div>` +
          `<div class="mini-body">${t.cause}</div>`;
        grid.appendChild(cause);

        const fix = document.createElement('div');
        fix.className = 'mini';
        fix.innerHTML =
          `<div class="mini-label">Fix</div>` +
          `<div class="mini-body">${t.fix}</div>`;
        grid.appendChild(fix);

        body.appendChild(grid);
      }
    });
    panel.appendChild(card);
  }
}
