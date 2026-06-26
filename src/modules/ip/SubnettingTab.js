import { ExpandCard } from '../../components/ExpandCard.js';
import { LayerBadge } from '../../components/LayerBadge.js';
import { subnetting } from './data.js';

/**
 * SubnettingTab — collapsible cards for subnet mask, CIDR, IP classes,
 * the bitwise calculation method, and a worked example.
 * @param {HTMLElement} panel - the tab panel to build content into
 */
export function SubnettingTab(panel) {
  for (const s of subnetting) {
    const title = document.createElement('span');
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.gap = '10px';
    title.style.flexWrap = 'wrap';
    title.appendChild(LayerBadge({ n: s.layer, name: 'Network' }));
    const name = document.createElement('strong');
    name.textContent = s.title;
    title.appendChild(name);

    const card = ExpandCard({
      title,
      renderBody(body) {
        const sum = document.createElement('p');
        sum.style.fontSize = '15px';
        sum.style.marginBottom = '12px';
        sum.textContent = s.summary;
        body.appendChild(sum);

        // CIDR examples table
        if (s.examples) {
          const table = document.createElement('table');
          table.className = 'cheat-table';
          const thead = document.createElement('thead');
          thead.innerHTML = '<tr><th>CIDR</th><th>Mask</th><th>Typical use</th></tr>';
          table.appendChild(thead);
          const tbody = document.createElement('tbody');
          for (const e of s.examples) {
            const tr = document.createElement('tr');
            tr.innerHTML =
              `<td><strong>${e.cidr}</strong></td>` +
              `<td style="font-variant-numeric:tabular-nums">${e.mask}</td>` +
              `<td>${e.use}</td>`;
            tbody.appendChild(tr);
          }
          table.appendChild(tbody);
          body.appendChild(table);
        }

        // IP classes table
        if (s.classes) {
          const table = document.createElement('table');
          table.className = 'cheat-table';
          const thead = document.createElement('thead');
          thead.innerHTML = '<tr><th>Class</th><th>First octet</th><th>Default mask</th><th>Dotted</th><th>Hosts/net</th></tr>';
          table.appendChild(thead);
          const tbody = document.createElement('tbody');
          for (const c of s.classes) {
            const tr = document.createElement('tr');
            tr.innerHTML =
              `<td><strong>${c.cls}</strong></td>` +
              `<td style="font-variant-numeric:tabular-nums">${c.firstOctet}</td>` +
              `<td>${c.defaultMask}</td>` +
              `<td style="font-variant-numeric:tabular-nums">${c.defaultDotted}</td>` +
              `<td>${c.hosts}</td>`;
            tbody.appendChild(tr);
          }
          table.appendChild(tbody);
          body.appendChild(table);
        }

        // Calculation steps
        if (s.steps) {
          const grid = document.createElement('div');
          grid.className = 'mini-grid';
          for (const step of s.steps) {
            const m = document.createElement('div');
            m.className = 'mini';
            m.innerHTML =
              `<div class="mini-label">${step.op}</div>` +
              `<div class="mini-body"><code style="font-family:var(--font-sans);font-weight:600">${step.formula}</code><br><span style="color:var(--text-secondary)">${step.result}</span></div>`;
            grid.appendChild(m);
          }
          body.appendChild(grid);
        }

        // Worked example rows
        if (s.rows) {
          const table = document.createElement('table');
          table.className = 'cheat-table';
          const tbody = document.createElement('tbody');
          for (const r of s.rows) {
            const tr = document.createElement('tr');
            tr.innerHTML =
              `<td style="color:var(--text-muted)">${r.label}</td>` +
              `<td style="font-variant-numeric:tabular-nums"><strong>${r.value}</strong></td>`;
            tbody.appendChild(tr);
          }
          table.appendChild(tbody);
          body.appendChild(table);
        }

        // Optional detail line
        if (s.detail) {
          const detail = document.createElement('p');
          detail.style.marginTop = '12px';
          detail.style.fontSize = '14px';
          detail.style.color = 'var(--text-secondary)';
          detail.textContent = s.detail;
          body.appendChild(detail);
        }

        // Optional example line (mask card)
        if (s.example) {
          const ex = document.createElement('p');
          ex.style.marginTop = '12px';
          ex.style.fontSize = '14px';
          ex.style.color = 'var(--text-secondary)';
          ex.innerHTML = `<strong style="color:var(--text-primary)">Example:</strong> ${s.example}`;
          body.appendChild(ex);
        }

        // Second worked example
        if (s.workedExample) {
          const we = document.createElement('div');
          we.className = 'callout';
          we.innerHTML = `<strong>Another worked example</strong>${s.workedExample}`;
          body.appendChild(we);
        }

        // Common mistake
        if (s.commonMistake) {
          const cm = document.createElement('div');
          cm.className = 'callout';
          cm.innerHTML = `<strong>Common mistake</strong>${s.commonMistake}`;
          body.appendChild(cm);
        }

        const mn = document.createElement('div');
        mn.className = 'mnemonic';
        mn.textContent = s.mnemonic;
        body.appendChild(mn);
      }
    });
    panel.appendChild(card);
  }
}
