/**
 * HierarchyTab — collapsible cards for the four DNS hierarchy tiers.
 * @param {HTMLElement} panel - the tab panel to render into
 */
import { ExpandCard } from '../../components/ExpandCard.js';
import { LayerBadge } from '../../components/LayerBadge.js';
import { hierarchyTiers, hierarchyAnalogy } from './data.js';

export function HierarchyTab(panel) {
  // Intro line
  const intro = document.createElement('p');
  intro.className = 'module-sub';
  intro.textContent = 'DNS is a tree. From the root down to your domain, each tier delegates to the next. Expand a card to meet the cast.';
  panel.appendChild(intro);

  // Pills row — quick visual of the tree
  const pills = document.createElement('div');
  pills.className = 'pills';
  ['Root (.)', 'TLD', 'Authoritative', 'Recursive'].forEach((label) => {
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = label;
    pills.appendChild(pill);
  });
  panel.appendChild(pills);

  // One ExpandCard per tier
  hierarchyTiers.forEach((tier, i) => {
    const card = ExpandCard({
      title: tier.title,
      open: i === 0,
      renderBody: (body) => {
        // Tagline + layer badge
        const head = document.createElement('div');
        head.style.display = 'flex';
        head.style.alignItems = 'center';
        head.style.gap = '10px';
        head.style.flexWrap = 'wrap';
        head.style.marginBottom = '10px';

        const badge = LayerBadge({ n: 7, name: tier.layer });
        head.appendChild(badge);

        const tag = document.createElement('span');
        tag.style.color = 'var(--text-muted)';
        tag.style.fontSize = '13px';
        tag.textContent = tier.tagline;
        head.appendChild(tag);
        body.appendChild(head);

        // Bullet points
        const ul = document.createElement('ul');
        ul.style.margin = '8px 0 14px';
        ul.style.paddingLeft = '20px';
        ul.style.lineHeight = '1.6';
        tier.points.forEach((p) => {
          const li = document.createElement('li');
          li.textContent = p;
          ul.appendChild(li);
        });
        body.appendChild(ul);

        // Examples as mini-grid
        const grid = document.createElement('div');
        grid.className = 'mini-grid';
        tier.examples.forEach((ex) => {
          const mini = document.createElement('div');
          mini.className = 'mini';
          const lbl = document.createElement('div');
          lbl.className = 'mini-label';
          lbl.textContent = ex.label;
          const det = document.createElement('div');
          det.className = 'mini-body';
          det.textContent = ex.detail;
          mini.appendChild(lbl);
          mini.appendChild(det);
          grid.appendChild(mini);
        });
        body.appendChild(grid);

        // Mnemonic
        if (tier.mnemonic) {
          const m = document.createElement('div');
          m.className = 'mnemonic';
          m.textContent = tier.mnemonic;
          body.appendChild(m);
        }

        // Fun fact callout
        if (tier.funFact) {
          const fact = document.createElement('div');
          fact.className = 'callout';
          const factStrong = document.createElement('strong');
          factStrong.textContent = 'Fun fact';
          fact.appendChild(factStrong);
          const factText = document.createElement('span');
          factText.textContent = ' ' + tier.funFact;
          fact.appendChild(factText);
          body.appendChild(fact);
        }

        // dig command to query this tier
        if (tier.digCommand) {
          const dig = document.createElement('div');
          dig.className = 'callout';
          const digStrong = document.createElement('strong');
          digStrong.textContent = 'Try it';
          dig.appendChild(digStrong);
          const digText = document.createElement('span');
          digText.innerHTML = ' <code>' + tier.digCommand + '</code>';
          dig.appendChild(digText);
          body.appendChild(dig);
        }
      },
    });
    panel.appendChild(card);
  });

  // Analogy callout
  const callout = document.createElement('div');
  callout.className = 'callout';
  const strong = document.createElement('strong');
  strong.textContent = 'The phone-book analogy';
  callout.appendChild(strong);
  const text = document.createElement('span');
  text.textContent = hierarchyAnalogy;
  callout.appendChild(text);
  panel.appendChild(callout);
}
