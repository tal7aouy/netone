/**
 * RecordsTab — DNS record types as a table with hint mnemonics.
 * @param {HTMLElement} panel - the tab panel to render into
 */
import { recordTypes } from './data.js';

export function RecordsTab(panel) {
  const intro = document.createElement('p');
  intro.className = 'module-sub';
  intro.textContent = 'Explore nine common record types. Search by type or purpose, then inspect an example and a command to try.';
  panel.appendChild(intro);

  const searchLabel = document.createElement('label');
  searchLabel.className = 'dns-record-search';
  searchLabel.textContent = 'Find a record';
  const search = document.createElement('input');
  search.type = 'search';
  search.placeholder = 'Search A, mail, reverse, service…';
  searchLabel.appendChild(search);
  panel.appendChild(searchLabel);
  const count = document.createElement('p');
  count.className = 'example-note';
  count.setAttribute('role', 'status');
  panel.appendChild(count);
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
  const filter = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    [...tbody.rows].forEach((row, index) => {
      const record = recordTypes[index];
      const match = !query || (query.length <= 4 && recordTypes.some(r => r.type.toLowerCase() === query)
        ? record.type.toLowerCase() === query
        : [record.type, record.name, record.purpose].join(' ').toLowerCase().includes(query));
      row.hidden = !match;
      if (match) visible++;
    });
    count.textContent = visible ? `${visible} of ${recordTypes.length} record types` : 'No matching records. Try mail, address, or TXT.';
  };
  search.addEventListener('input', filter);
  filter();

  // Mnemonic for the most common records
  const mn = document.createElement('div');
  mn.className = 'mnemonic';
  mn.textContent = 'Start with A and AAAA for addresses, CNAME for aliases, MX for mail routing, and TXT for text policies. NS and SOA describe zones; PTR supports reverse lookups; SRV locates services.';
  panel.appendChild(mn);
}
