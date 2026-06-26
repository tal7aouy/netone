import { ExpandCard } from '../../components/ExpandCard.js';
import { LayerBadge } from '../../components/LayerBadge.js';
import { firewallTypes, firewallAnalogy } from './data.js';

/**
 * FirewallTypesTab — each firewall technology as a collapsible card.
 * Title row shows the name + a layer badge. Expanded body shows what it
 * checks, its strength, a mnemonic, and characteristic pills.
 *
 * @param {HTMLElement} panel - the tab panel to build into
 */
export function FirewallTypesTab(panel) {
  for (const fw of firewallTypes) {
    // Title: name + layer badge
    const title = document.createElement('span');
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.gap = '10px';
    title.style.flexWrap = 'wrap';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = fw.name;
    title.appendChild(nameSpan);

    title.appendChild(LayerBadge({ n: fw.layer.n, text: fw.layerExtra }));

    const card = ExpandCard({
      title,
      renderBody(body) {
        const grid = document.createElement('div');
        grid.className = 'mini-grid';

        // What it checks
        const checks = document.createElement('div');
        checks.className = 'mini';
        checks.innerHTML =
          `<div class="mini-label">What it checks</div>` +
          `<div class="mini-body">${fw.checks}</div>`;
        grid.appendChild(checks);

        // Strength
        const strength = document.createElement('div');
        strength.className = 'mini';
        strength.innerHTML =
          `<div class="mini-label">Strength</div>` +
          `<div class="mini-body">${fw.strength}</div>`;
        grid.appendChild(strength);

        body.appendChild(grid);

        // Characteristic pills
        const pills = document.createElement('div');
        pills.className = 'pills';
        for (const p of fw.pills) {
          const pill = document.createElement('span');
          pill.className = 'pill';
          pill.textContent = p;
          pills.appendChild(pill);
        }
        body.appendChild(pills);

        // Mnemonic
        const mn = document.createElement('div');
        mn.className = 'mnemonic';
        mn.textContent = fw.mnemonic;
        body.appendChild(mn);

        // Fun fact
        const fun = document.createElement('div');
        fun.className = 'callout';
        fun.style.marginTop = '12px';
        fun.innerHTML =
          `<strong>Fun fact</strong>${fw.funFact}`;
        body.appendChild(fun);

        // Real-world example
        const ex = document.createElement('div');
        ex.className = 'mini';
        ex.style.marginTop = '12px';
        ex.innerHTML =
          `<div class="mini-label">Real-world example</div>` +
          `<div class="mini-body">${fw.realExample}</div>`;
        body.appendChild(ex);

        // Command
        const cmd = document.createElement('div');
        cmd.className = 'callout';
        cmd.style.marginTop = '12px';
        cmd.innerHTML =
          `<strong>Example command</strong><code>${fw.command}</code>`;
        body.appendChild(cmd);
      }
    });

    panel.appendChild(card);
  }

  // Analogy callout
  const callout = document.createElement('div');
  callout.className = 'callout';
  callout.innerHTML =
    `<strong>The bouncer analogy</strong>${firewallAnalogy}`;
  panel.appendChild(callout);
}
