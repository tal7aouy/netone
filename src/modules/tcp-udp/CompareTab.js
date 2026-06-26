import { LayerBadge } from '../../components/LayerBadge.js';
import { protocols, comparison, analogy } from './data.js';

/**
 * CompareTab — TCP vs UDP side-by-side.
 * Two protocol profile cards up top, then a feature comparison table,
 * then an analogy callout.
 */
export function CompareTab(panel) {
  // Layer badge to anchor us in the stack
  const badge = LayerBadge({ n: 4, name: 'Transport — TCP & UDP' });
  badge.style.marginBottom = '16px';
  badge.style.display = 'inline-flex';
  panel.appendChild(badge);

  // Profile cards
  const grid = document.createElement('div');
  grid.className = 'mini-grid';

  for (const p of protocols) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.padding = '0';

    const head = document.createElement('div');
    head.className = 'card-head';
    head.style.cursor = 'default';
    head.style.padding = '14px 16px';
    const title = document.createElement('span');
    title.className = 'card-title';
    title.style.display = 'flex';
    title.style.flexDirection = 'column';
    title.style.gap = '2px';
    const name = document.createElement('strong');
    name.textContent = p.name;
    name.style.fontSize = '1.1rem';
    const full = document.createElement('span');
    full.style.fontSize = '0.8rem';
    full.style.color = 'var(--text-muted)';
    full.textContent = p.full;
    title.appendChild(name);
    title.appendChild(full);
    head.appendChild(title);
    card.appendChild(head);

    const body = document.createElement('div');
    body.className = 'card-body';
    body.style.display = 'block';
    body.style.padding = '0 16px 16px';

    const tag = document.createElement('div');
    tag.className = 'mnemonic';
    tag.textContent = p.tagline;
    tag.style.marginBottom = '12px';
    body.appendChild(tag);

    const list = document.createElement('div');
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '8px';
    for (const [label, val] of [
      ['Connection', p.connection],
      ['Reliability', p.reliability],
      ['Ordering', p.ordering],
      ['Speed', p.speed],
      ['Overhead', p.overhead]
    ]) {
      const row = document.createElement('div');
      row.style.fontSize = '0.9rem';
      row.innerHTML =
        `<span style="color:var(--text-muted);display:inline-block;min-width:90px">${label}</span>` +
        `<span style="color:var(--text-primary)">${val}</span>`;
      list.appendChild(row);
    }
    body.appendChild(list);

    const usesLabel = document.createElement('div');
    usesLabel.className = 'mini-label';
    usesLabel.style.marginTop = '12px';
    usesLabel.textContent = 'Used by';
    body.appendChild(usesLabel);

    const pills = document.createElement('div');
    pills.className = 'pills';
    for (const u of p.uses) {
      const pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = u;
      pills.appendChild(pill);
    }
    body.appendChild(pills);

    // Header size
    const sizeLabel = document.createElement('div');
    sizeLabel.className = 'mini-label';
    sizeLabel.style.marginTop = '12px';
    sizeLabel.textContent = 'Header size';
    body.appendChild(sizeLabel);
    const sizeVal = document.createElement('div');
    sizeVal.style.fontSize = '0.9rem';
    sizeVal.textContent = p.headerSize;
    body.appendChild(sizeVal);

    // Header fields
    const fieldsLabel = document.createElement('div');
    fieldsLabel.className = 'mini-label';
    fieldsLabel.style.marginTop = '12px';
    fieldsLabel.textContent = 'Header fields';
    body.appendChild(fieldsLabel);
    const fieldPills = document.createElement('div');
    fieldPills.className = 'pills';
    for (const f of p.headerFields) {
      const pill = document.createElement('span');
      pill.className = 'pill';
      pill.style.fontFamily = 'var(--mono, monospace)';
      pill.style.fontSize = '0.78rem';
      pill.textContent = f;
      fieldPills.appendChild(pill);
    }
    body.appendChild(fieldPills);

    // Port ranges
    const portLabel = document.createElement('div');
    portLabel.className = 'mini-label';
    portLabel.style.marginTop = '12px';
    portLabel.textContent = 'Port ranges';
    body.appendChild(portLabel);
    const portGrid = document.createElement('div');
    portGrid.className = 'mini-grid';
    for (const [kind, val] of [
      ['Well-known', p.portRange.wellKnown],
      ['Registered', p.portRange.registered],
      ['Dynamic', p.portRange.dynamic]
    ]) {
      const m = document.createElement('div');
      m.className = 'mini';
      m.innerHTML = `<div class="mini-label">${kind}</div><div class="mini-body">${val}</div>`;
      portGrid.appendChild(m);
    }
    body.appendChild(portGrid);

    // Fun fact
    const fact = document.createElement('div');
    fact.className = 'callout';
    fact.style.marginTop = '12px';
    fact.innerHTML = `<strong>Fun fact:</strong> ${p.funFact}`;
    body.appendChild(fact);

    card.appendChild(body);
    grid.appendChild(card);
  }
  panel.appendChild(grid);

  // Comparison table
  const table = document.createElement('table');
  table.className = 'cheat-table';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Feature</th><th>TCP</th><th>UDP</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of comparison) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td><strong>${row.feature}</strong></td>` +
      `<td>${row.tcp}</td>` +
      `<td>${row.udp}</td>`;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  panel.appendChild(table);

  // Analogy callout
  const callout = document.createElement('div');
  callout.className = 'callout';
  callout.textContent = analogy;
  panel.appendChild(callout);
}
