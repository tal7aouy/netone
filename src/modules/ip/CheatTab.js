import { classCheatSheet, cidrCheatSheet, analogy } from './data.js';

/**
 * CheatTab — class reference table + CIDR quick-reference table,
 * plus a styled blockquote analogy.
 * @param {HTMLElement} panel - the tab panel to build content into
 */
export function CheatTab(panel) {
  // --- Class table ---
  const classHeading = document.createElement('h3');
  classHeading.style.fontSize = '15px';
  classHeading.style.margin = '0 0 10px';
  classHeading.style.color = 'var(--text-secondary)';
  classHeading.textContent = 'IP Class Reference';
  panel.appendChild(classHeading);

  const classTable = document.createElement('table');
  classTable.className = 'cheat-table';
  const cthead = document.createElement('thead');
  cthead.innerHTML = '<tr><th>Class</th><th>Range</th><th>Default Mask</th><th>Networks</th><th>Hosts per net</th></tr>';
  classTable.appendChild(cthead);

  const ctbody = document.createElement('tbody');
  for (const c of classCheatSheet) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td><strong>${c.cls}</strong></td>` +
      `<td style="font-variant-numeric:tabular-nums">${c.range}</td>` +
      `<td>${c.mask}</td>` +
      `<td style="font-variant-numeric:tabular-nums">${c.networks}</td>` +
      `<td style="font-variant-numeric:tabular-nums">${c.hosts}</td>`;
    ctbody.appendChild(tr);
  }
  classTable.appendChild(ctbody);
  panel.appendChild(classTable);

  // --- CIDR quick reference ---
  const cidrHeading = document.createElement('h3');
  cidrHeading.style.fontSize = '15px';
  cidrHeading.style.margin = '22px 0 10px';
  cidrHeading.style.color = 'var(--text-secondary)';
  cidrHeading.textContent = 'CIDR Quick Reference';
  panel.appendChild(cidrHeading);

  const cidrTable = document.createElement('table');
  cidrTable.className = 'cheat-table';
  const ithead = document.createElement('thead');
  ithead.innerHTML = '<tr><th>CIDR</th><th>Subnet mask</th><th>Total addresses</th></tr>';
  cidrTable.appendChild(ithead);

  const itbody = document.createElement('tbody');
  for (const c of cidrCheatSheet) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td><strong>${c.cidr}</strong></td>` +
      `<td style="font-variant-numeric:tabular-nums">${c.mask}</td>` +
      `<td style="font-variant-numeric:tabular-nums">${c.hosts}</td>`;
    itbody.appendChild(tr);
  }
  cidrTable.appendChild(itbody);
  panel.appendChild(cidrTable);

  // --- Analogy blockquote ---
  const quote = document.createElement('blockquote');
  quote.className = 'blockquote';
  quote.textContent = analogy;
  panel.appendChild(quote);
}
