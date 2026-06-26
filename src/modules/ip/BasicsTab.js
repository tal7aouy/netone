import { ExpandCard } from '../../components/ExpandCard.js';
import { LayerBadge } from '../../components/LayerBadge.js';
import { ipVersions, ipStructure, specialAddresses } from './data.js';

/**
 * BasicsTab — collapsible cards for IPv4, IPv6, IP structure, and special addresses.
 * @param {HTMLElement} panel - the tab panel to build content into
 */
export function BasicsTab(panel) {
  // --- IPv4 & IPv6 cards ---
  for (const v of ipVersions) {
    const title = document.createElement('span');
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.gap = '10px';
    title.style.flexWrap = 'wrap';
    title.appendChild(LayerBadge({ n: v.layer, name: 'Network' }));
    const name = document.createElement('strong');
    name.textContent = v.name;
    title.appendChild(name);
    const bits = document.createElement('span');
    bits.className = 'pill';
    bits.textContent = `${v.bits}-bit`;
    title.appendChild(bits);

    const card = ExpandCard({
      title,
      renderBody(body) {
        const grid = document.createElement('div');
        grid.className = 'mini-grid';

        const fmt = document.createElement('div');
        fmt.className = 'mini';
        fmt.innerHTML = `<div class="mini-label">Format</div><div class="mini-body">${v.format}</div>`;
        grid.appendChild(fmt);

        const ex = document.createElement('div');
        ex.className = 'mini';
        ex.innerHTML = `<div class="mini-label">Example</div><div class="mini-body" style="font-variant-numeric:tabular-nums"><strong>${v.example}</strong></div>`;
        grid.appendChild(ex);

        const sp = document.createElement('div');
        sp.className = 'mini';
        sp.innerHTML = `<div class="mini-label">Address space</div><div class="mini-body">${v.space}</div>`;
        grid.appendChild(sp);

        body.appendChild(grid);

        const note = document.createElement('p');
        note.style.marginTop = '12px';
        note.style.fontSize = '14px';
        note.style.color = 'var(--text-secondary)';
        note.textContent = v.notation;
        body.appendChild(note);

        const mn = document.createElement('div');
        mn.className = 'mnemonic';
        mn.textContent = v.mnemonic;
        body.appendChild(mn);

        // Header structure
        if (v.headerStructure) {
          const hs = document.createElement('div');
          hs.className = 'mini';
          hs.style.marginTop = '12px';
          hs.innerHTML = `<div class="mini-label">Header structure</div><div class="mini-body">${v.headerStructure}</div>`;
          body.appendChild(hs);
        }

        // Fun fact callout
        if (v.funFact) {
          const ff = document.createElement('div');
          ff.className = 'callout';
          ff.innerHTML = `<strong>Did you know?</strong>${v.funFact}`;
          body.appendChild(ff);
        }

        // Migration tip callout
        if (v.migrationTip) {
          const mt = document.createElement('div');
          mt.className = 'callout';
          mt.innerHTML = `<strong>Migration tip</strong>${v.migrationTip}`;
          body.appendChild(mt);
        }
      }
    });
    panel.appendChild(card);
  }

  // --- IP structure card ---
  const structTitle = document.createElement('span');
  structTitle.style.display = 'flex';
  structTitle.style.alignItems = 'center';
  structTitle.style.gap = '10px';
  structTitle.appendChild(LayerBadge({ n: 3, name: 'Network' }));
  const st = document.createElement('strong');
  st.textContent = 'IP Structure: Network + Host';
  structTitle.appendChild(st);

  const structCard = ExpandCard({
    title: structTitle,
    renderBody(body) {
      const sum = document.createElement('p');
      sum.style.fontSize = '15px';
      sum.style.marginBottom = '12px';
      sum.textContent = ipStructure.summary;
      body.appendChild(sum);

      const grid = document.createElement('div');
      grid.className = 'mini-grid';
      for (const part of ipStructure.parts) {
        const m = document.createElement('div');
        m.className = 'mini';
        m.innerHTML = `<div class="mini-label">${part.label}</div><div class="mini-body">${part.desc}</div>`;
        grid.appendChild(m);
      }
      body.appendChild(grid);

      const callout = document.createElement('div');
      callout.className = 'callout';
      callout.innerHTML = `<strong>Analogy</strong>${ipStructure.analogy}`;
      body.appendChild(callout);
    }
  });
  panel.appendChild(structCard);

  // --- Special addresses card ---
  const specTitle = document.createElement('span');
  specTitle.style.display = 'flex';
  specTitle.style.alignItems = 'center';
  specTitle.style.gap = '10px';
  specTitle.appendChild(LayerBadge({ n: 3, name: 'Network' }));
  const spn = document.createElement('strong');
  spn.textContent = 'Special Addresses';
  specTitle.appendChild(spn);

  const specCard = ExpandCard({
    title: specTitle,
    renderBody(body) {
      const table = document.createElement('table');
      table.className = 'cheat-table';
      const thead = document.createElement('thead');
      thead.innerHTML = '<tr><th>Address</th><th>Name</th><th>Purpose</th><th>Range</th></tr>';
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      for (const s of specialAddresses) {
        const tr = document.createElement('tr');
        tr.innerHTML =
          `<td style="font-variant-numeric:tabular-nums"><strong>${s.address}</strong></td>` +
          `<td>${s.name}</td>` +
          `<td>${s.purpose}</td>` +
          `<td style="color:var(--text-muted)">${s.range}</td>`;
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      body.appendChild(table);

      const mn = document.createElement('div');
      mn.className = 'mnemonic';
      mn.textContent = '127 = myself, 0 = nothing, 255 = everyone on my block.';
      body.appendChild(mn);
    }
  });
  panel.appendChild(specCard);
}
