/**
 * RecordsTab — DNS record types as a table with hint mnemonics.
 * @param {HTMLElement} panel - the tab panel to render into
 */
import { recordTypes } from './data.js';

export function RecordsTab(panel) {
  const intro = document.createElement('p');
  intro.className = 'module-sub';
  intro.textContent = 'Every DNS answer is a "record". These are the nine types you will meet in the wild.';
  panel.appendChild(intro);

  const wrap = document.createElement('div');
  wrap.style.overflowX = 'auto';

  const table = document.createElement('table');
  table.className = 'cheat-table';

  // Header
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['Type', 'Full name', 'Purpose', 'Example', 'TTL note', 'dig it', 'Memory aid'].forEach((h) => {
    const th = document.createElement('th');
    th.textContent = h;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  recordTypes.forEach((r) => {
    const tr = document.createElement('tr');

    const typeCell = document.createElement('td');
    const code = document.createElement('strong');
    code.textContent = r.type;
    code.style.color = 'var(--text-accent)';
    typeCell.appendChild(code);
    tr.appendChild(typeCell);

    const nameCell = document.createElement('td');
    nameCell.textContent = r.name;
    tr.appendChild(nameCell);

    const purposeCell = document.createElement('td');
    purposeCell.textContent = r.purpose;
    tr.appendChild(purposeCell);

    const exCell = document.createElement('td');
    exCell.textContent = r.example;
    exCell.style.fontFamily = 'var(--mono, monospace)';
    exCell.style.fontSize = '12px';
    exCell.style.whiteSpace = 'nowrap';
    tr.appendChild(exCell);

    const ttlCell = document.createElement('td');
    ttlCell.textContent = r.ttlNote || '';
    ttlCell.style.color = 'var(--text-muted)';
    ttlCell.style.fontSize = '12px';
    tr.appendChild(ttlCell);

    const digCell = document.createElement('td');
    if (r.digExample) {
      const digCode = document.createElement('code');
      digCode.textContent = r.digExample;
      digCode.style.fontFamily = 'var(--mono, monospace)';
      digCode.style.fontSize = '12px';
      digCell.appendChild(digCode);
    }
    tr.appendChild(digCell);

    const hintCell = document.createElement('td');
    hintCell.textContent = r.hint || '';
    hintCell.style.color = 'var(--text-muted)';
    hintCell.style.fontSize = '12px';
    tr.appendChild(hintCell);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  panel.appendChild(wrap);

  // Mnemonic for the most common records
  const mn = document.createElement('div');
  mn.className = 'mnemonic';
  mn.textContent = 'Remember the "Big Five": A, AAAA, CNAME, MX, TXT — they cover ~99% of records you will touch. NS, SOA, PTR, SRV fill in the corners.';
  panel.appendChild(mn);
}
