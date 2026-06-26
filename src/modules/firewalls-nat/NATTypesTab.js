import { ExpandCard } from '../../components/ExpandCard.js';
import { natTypes, natReasons, natAnalogy } from './data.js';

/**
 * NATTypesTab — "What is NAT?" intro card, then one collapsible card per
 * NAT variant. Each body shows the mapping pattern, use case, pills, and
 * a mnemonic. Closes with "Why NAT exists" reasons and a blockquote analogy.
 *
 * @param {HTMLElement} panel - the tab panel to build into
 */
export function NATTypesTab(panel) {
  // Intro: What is NAT?
  const intro = ExpandCard({
    title: 'What is NAT?',
    open: true,
    renderBody(body) {
      const d = document.createElement('div');
      d.className = 'mini';
      d.innerHTML =
        `<div class="mini-label">Definition</div>` +
        `<div class="mini-body">Network Address Translation — rewrites IP addresses (and often ports) ` +
        `in packet headers as they pass through a router. It maps private IPs to a public IP so many ` +
        `internal hosts can share one internet-facing address.</div>`;
      body.appendChild(d);
    }
  });
  panel.appendChild(intro);

  // One card per NAT type
  for (const nat of natTypes) {
    const title = document.createElement('span');
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.gap = '10px';
    title.style.flexWrap = 'wrap';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = nat.name;
    title.appendChild(nameSpan);

    const patternPill = document.createElement('span');
    patternPill.className = 'pill';
    patternPill.textContent = nat.pattern;
    title.appendChild(patternPill);

    const card = ExpandCard({
      title,
      renderBody(body) {
        const grid = document.createElement('div');
        grid.className = 'mini-grid';

        const mapping = document.createElement('div');
        mapping.className = 'mini';
        mapping.innerHTML =
          `<div class="mini-label">Mapping</div>` +
          `<div class="mini-body">${nat.mapping}</div>`;
        grid.appendChild(mapping);

        const use = document.createElement('div');
        use.className = 'mini';
        use.innerHTML =
          `<div class="mini-label">Used for</div>` +
          `<div class="mini-body">${nat.use}</div>`;
        grid.appendChild(use);

        body.appendChild(grid);

        const pills = document.createElement('div');
        pills.className = 'pills';
        for (const p of nat.pills) {
          const pill = document.createElement('span');
          pill.className = 'pill';
          pill.textContent = p;
          pills.appendChild(pill);
        }
        body.appendChild(pills);

        const mn = document.createElement('div');
        mn.className = 'mnemonic';
        mn.textContent = nat.mnemonic;
        body.appendChild(mn);

        // Fun fact
        const fun = document.createElement('div');
        fun.className = 'callout';
        fun.style.marginTop = '12px';
        fun.innerHTML =
          `<strong>Fun fact</strong>${nat.funFact}`;
        body.appendChild(fun);

        // Real-world example
        const ex = document.createElement('div');
        ex.className = 'mini';
        ex.style.marginTop = '12px';
        ex.innerHTML =
          `<div class="mini-label">Real-world example</div>` +
          `<div class="mini-body">${nat.realExample}</div>`;
        body.appendChild(ex);

        // Command
        const cmd = document.createElement('div');
        cmd.className = 'callout';
        cmd.style.marginTop = '12px';
        cmd.innerHTML =
          `<strong>Example command</strong><code>${nat.command}</code>`;
        body.appendChild(cmd);
      }
    });

    panel.appendChild(card);
  }

  // Why NAT exists — reasons as mini-cards
  const reasonsHead = document.createElement('div');
  reasonsHead.style.marginTop = '22px';
  reasonsHead.style.fontSize = '13px';
  reasonsHead.style.textTransform = 'uppercase';
  reasonsHead.style.letterSpacing = '0.06em';
  reasonsHead.style.color = 'var(--text-muted)';
  reasonsHead.textContent = 'Why NAT exists';
  panel.appendChild(reasonsHead);

  const reasonsGrid = document.createElement('div');
  reasonsGrid.className = 'mini-grid';
  for (const r of natReasons) {
    const m = document.createElement('div');
    m.className = 'mini';
    m.innerHTML =
      `<div class="mini-label">${r.label}</div>` +
      `<div class="mini-body">${r.text}</div>`;
    reasonsGrid.appendChild(m);
  }
  panel.appendChild(reasonsGrid);

  // Analogy blockquote
  const quote = document.createElement('blockquote');
  quote.className = 'blockquote';
  quote.textContent = natAnalogy;
  panel.appendChild(quote);
}
