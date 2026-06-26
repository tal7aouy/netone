import { cheatSheet, cheatQuote } from './data.js';

/**
 * CheatTab — quick-reference table (Property | TCP | UDP) plus a
 * styled blockquote with the phone-call vs megaphone analogy.
 */
export function CheatTab(panel) {
  const table = document.createElement('table');
  table.className = 'cheat-table';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Property</th><th>TCP</th><th>UDP</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of cheatSheet) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td><strong>${row.property}</strong></td>` +
      `<td>${row.tcp}</td>` +
      `<td>${row.udp}</td>`;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  panel.appendChild(table);

  const quote = document.createElement('blockquote');
  quote.className = 'blockquote';
  quote.textContent = cheatQuote;
  panel.appendChild(quote);
}
