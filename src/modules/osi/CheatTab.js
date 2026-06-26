import { layers, devices, mnemonics, analogy } from './data.js';

/**
 * CheatTab — clean table (Layer # | Name | PDU | Key Protocols | Device),
 * two mnemonic strings, and a styled blockquote with the real-world analogy.
 */
export function CheatTab(panel) {
  const table = document.createElement('table');
  table.className = 'cheat-table';

  const thead = document.createElement('thead');
  thead.innerHTML =
    '<tr><th>#</th><th>Name</th><th>PDU</th><th>Key Protocols</th><th>Device</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const l of layers) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td>${l.n}</td>` +
      `<td><strong>${l.name}</strong></td>` +
      `<td>${l.pdu}</td>` +
      `<td>${l.protocols}</td>` +
      `<td>${devices[l.n] ?? '—'}</td>`;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  panel.appendChild(table);

  const mn = document.createElement('div');
  mn.className = 'mnemonics';
  for (const m of mnemonics) {
    const d = document.createElement('div');
    d.innerHTML = `<strong>${m.label}</strong>${m.text}`;
    mn.appendChild(d);
  }
  panel.appendChild(mn);

  const quote = document.createElement('blockquote');
  quote.className = 'blockquote';
  quote.textContent = analogy;
  panel.appendChild(quote);
}
