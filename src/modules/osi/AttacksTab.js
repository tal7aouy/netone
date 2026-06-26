import { ExpandCard } from '../../components/ExpandCard.js';
import { LayerBadge } from '../../components/LayerBadge.js';
import { attacks } from './data.js';

/**
 * AttacksTab — collapsible attack cards. Each card shows a layer tag pill
 * (colored by layer) + attack name; expanded body has "How it works" and
 * "Impact + Defense" mini-cards side by side.
 */
export function AttacksTab(panel) {
  for (const a of attacks) {
    const title = document.createElement('span');
    title.textContent = a.name;

    const card = ExpandCard({
      title,
      className: 'attack-card',
      renderBody(body) {
        // Severity pill (colored inline)
        const sevColors = {
          Critical: 'color:#fff;background:#c0392b',
          High: 'color:#fff;background:#e67e22',
          Medium: 'color:#000;background:#f1c40f'
        };
        const sevPill = document.createElement('span');
        sevPill.className = 'pill';
        sevPill.style.cssText = sevColors[a.severity] || '';
        sevPill.style.marginBottom = '10px';
        sevPill.style.display = 'inline-block';
        sevPill.textContent = `Severity: ${a.severity}`;
        body.appendChild(sevPill);

        const grid = document.createElement('div');
        grid.className = 'mini-grid';

        const how = document.createElement('div');
        how.className = 'mini';
        how.innerHTML = `<div class="mini-label">How it works</div><div class="mini-body">${a.how}</div>`;
        grid.appendChild(how);

        const impact = document.createElement('div');
        impact.className = 'mini';
        impact.innerHTML =
          `<div class="mini-label">Impact + Defense</div>` +
          `<div class="mini-body"><strong>Impact:</strong> ${a.impact}</div>` +
          `<div class="mini-body" style="margin-top:6px"><strong>Defense:</strong> ${a.defend}</div>`;
        grid.appendChild(impact);

        body.appendChild(grid);

        // Real-world example + Detection mini-grid
        const grid2 = document.createElement('div');
        grid2.className = 'mini-grid';

        const ex = document.createElement('div');
        ex.className = 'mini';
        ex.innerHTML = `<div class="mini-label">Real-world example</div><div class="mini-body">${a.realExample}</div>`;
        grid2.appendChild(ex);

        const det = document.createElement('div');
        det.className = 'mini';
        det.innerHTML = `<div class="mini-label">Detection</div><div class="mini-body">${a.detectionTip}</div>`;
        grid2.appendChild(det);

        body.appendChild(grid2);
      }
    });

    // layer tag pill on the right of the title
    const titleEl = card.querySelector('.card-title');
    const tag = LayerBadge({ n: a.layer, text: `L${a.layer}` });
    tag.classList.add('attack-layer-tag');
    titleEl.appendChild(tag);

    panel.appendChild(card);
  }
}
