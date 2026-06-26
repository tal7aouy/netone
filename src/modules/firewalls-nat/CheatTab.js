import { cheatSheet, finalAnalogy } from './data.js';

/**
 * CheatTab — a clean cheat-sheet table (Type | Layer | What it checks |
 * Strength) covering both firewalls and NAT, followed by the module's
 * signature analogy as a blockquote.
 *
 * @param {HTMLElement} panel - the tab panel to build into
 */
export function CheatTab(panel) {
  const table = document.createElement('table');
  table.className = 'cheat-table';

  const thead = document.createElement('thead');
  thead.innerHTML =
    '<tr><th>Type</th><th>Layer</th><th>What it checks</th><th>Strength</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of cheatSheet) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td><strong>${row.type}</strong></td>` +
      `<td>${row.layer}</td>` +
      `<td>${row.checks}</td>` +
      `<td>${row.strength}</td>`;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  panel.appendChild(table);

  const quote = document.createElement('blockquote');
  quote.className = 'blockquote';
  quote.textContent = finalAnalogy;
  panel.appendChild(quote);
}
