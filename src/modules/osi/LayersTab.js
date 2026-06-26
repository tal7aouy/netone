import { ExpandCard } from '../../components/ExpandCard.js';
import { LayerBadge } from '../../components/LayerBadge.js';
import { layers } from './data.js';

/**
 * LayersTab — all 7 layers as collapsible cards (L7 top → L1 bottom).
 * Each expanded card shows Job / Protocols / PDU+Attacks side by side,
 * plus a mnemonic line.
 */
export function LayersTab(panel) {
  for (const layer of layers) {
    const title = document.createElement('span');
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.gap = '10px';
    title.style.flexWrap = 'wrap';

    title.appendChild(LayerBadge({ n: layer.n, name: layer.name }));
    const badge = document.createElement('span');
    badge.className = 'layer-badge';
    badge.textContent = layer.badge;
    title.appendChild(badge);

    const card = ExpandCard({
      title,
      renderBody(body) {
        const grid = document.createElement('div');
        grid.className = 'mini-grid';

        // Job
        const job = document.createElement('div');
        job.className = 'mini';
        job.innerHTML = `<div class="mini-label">Job</div><div class="mini-body">${layer.job}</div>`;
        grid.appendChild(job);

        // Protocols
        const proto = document.createElement('div');
        proto.className = 'mini';
        proto.innerHTML = `<div class="mini-label">Protocols</div><div class="mini-body">${layer.protocols}</div>`;
        grid.appendChild(proto);

        // PDU + Attacks
        const pdu = document.createElement('div');
        pdu.className = 'mini';
        pdu.innerHTML = `<div class="mini-label">PDU + Attacks</div><div class="mini-body"><strong>${layer.pdu}</strong></div>`;
        const pills = document.createElement('div');
        pills.className = 'pills';
        for (const h of layer.hacks) {
          const pill = document.createElement('span');
          pill.className = 'pill';
          pill.style.setProperty('--layer-bg', `var(--layer-${layer.n}-bg)`);
          pill.style.setProperty('--layer-fg', `var(--layer-${layer.n}-fg)`);
          pill.textContent = h;
          pills.appendChild(pill);
        }
        pdu.appendChild(pills);
        grid.appendChild(pdu);

        body.appendChild(grid);

        // Second mini-grid row: Real World / Devices / Common Ports
        const grid2 = document.createElement('div');
        grid2.className = 'mini-grid';

        const rw = document.createElement('div');
        rw.className = 'mini';
        rw.innerHTML = `<div class="mini-label">Real World</div><div class="mini-body">${layer.realWorld}</div>`;
        grid2.appendChild(rw);

        const dev = document.createElement('div');
        dev.className = 'mini';
        dev.innerHTML = `<div class="mini-label">Devices</div><div class="mini-body">${layer.devices}</div>`;
        grid2.appendChild(dev);

        const ports = document.createElement('div');
        ports.className = 'mini';
        ports.innerHTML = `<div class="mini-label">Common Ports</div><div class="mini-body">${layer.commonPorts}</div>`;
        grid2.appendChild(ports);

        body.appendChild(grid2);

        // Deep Dive callout
        const deep = document.createElement('div');
        deep.className = 'callout';
        deep.innerHTML = `<strong>Deep Dive —</strong> ${layer.deepDive}`;
        body.appendChild(deep);

        // Fun fact mnemonic
        const fn = document.createElement('div');
        fn.className = 'mnemonic';
        fn.textContent = `Fun fact — ${layer.funFact}`;
        body.appendChild(fn);

        // Original mnemonic (kept)
        const mn = document.createElement('div');
        mn.className = 'mnemonic';
        mn.textContent = layer.mnemonic;
        body.appendChild(mn);
      }
    });

    panel.appendChild(card);
  }
}
