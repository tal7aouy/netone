/**
 * CheatTab — quick-reference table + closing analogy blockquote.
 * @param {HTMLElement} panel - the tab panel to render into
 */
import { cheatSheet, cheatQuote } from './data.js';

export function CheatTab(panel) {
  const intro = document.createElement('p');
  intro.className = 'module-sub';
  intro.textContent = 'Print this. Tape it to your monitor. The whole DNS cheat sheet on one screen.';
  panel.appendChild(intro);

  const wrap = document.createElement('div');
  wrap.style.overflowX = 'auto';

  const table = document.createElement('table');
  table.className = 'cheat-table';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['Record', 'Full name', 'Purpose', 'Example'].forEach((h) => {
    const th = document.createElement('th');
    th.textContent = h;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  cheatSheet.forEach((row) => {
    const tr = document.createElement('tr');

    const rCell = document.createElement('td');
    const code = document.createElement('strong');
    code.textContent = row.record;
    code.style.color = 'var(--text-accent)';
    rCell.appendChild(code);
    tr.appendChild(rCell);

    const nCell = document.createElement('td');
    nCell.textContent = row.fullName;
    tr.appendChild(nCell);

    const pCell = document.createElement('td');
    pCell.textContent = row.purpose;
    tr.appendChild(pCell);

    const eCell = document.createElement('td');
    eCell.textContent = row.example;
    eCell.style.fontFamily = 'var(--mono, monospace)';
    eCell.style.fontSize = '12px';
    eCell.style.whiteSpace = 'nowrap';
    tr.appendChild(eCell);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  panel.appendChild(wrap);

  // Closing analogy
  const quote = document.createElement('blockquote');
  quote.className = 'blockquote';
  quote.textContent = cheatQuote;
  panel.appendChild(quote);
}
