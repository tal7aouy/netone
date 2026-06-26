import { cheatRows, cheatQuote } from './data.js';

/**
 * CheatTab — a clean cheat-sheet table (Concept | What it does | Why it matters)
 * followed by the closing blockquote.
 * @param {HTMLElement} panel
 */
export function CheatTab(panel) {
  const table = document.createElement('table');
  table.className = 'cheat-table';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Concept</th><th>What it does</th><th>Why it matters</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const r of cheatRows) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td><strong>${r.concept}</strong></td>` +
      `<td>${r.does}</td>` +
      `<td>${r.matters}</td>`;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  panel.appendChild(table);

  const quote = document.createElement('blockquote');
  quote.className = 'blockquote';
  quote.textContent = cheatQuote;
  panel.appendChild(quote);
}
