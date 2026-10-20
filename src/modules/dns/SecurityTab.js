/**
 * SecurityTab — expand cards for DNS security topics (DNSSEC, DoH, DoT, poisoning).
 * Each card body shows what / why / enable as a mini-grid.
 * @param {HTMLElement} panel - the tab panel to render into
 */
import { ExpandCard } from '../../components/ExpandCard.js';
import { dnsSecurity } from './data.js';

export function SecurityTab(panel) {
  const intro = document.createElement('p');
  intro.className = 'module-sub';
  intro.textContent = 'DNS was built for a trusting 1980s internet. These are the protections and attacks that shape modern DNS security — expand a card to dig in.';
  panel.appendChild(intro);

  dnsSecurity.forEach((topic, i) => {
    const card = ExpandCard({
      title: topic.name,
      open: i === 0,
      renderBody: (body) => {
        const grid = document.createElement('div');
        grid.className = 'mini-grid';

        const rows = [
          { label: 'What it is', detail: topic.what },
          { label: 'Why it matters', detail: topic.why },
          { label: 'How to enable', detail: topic.enable },
        ];

        rows.forEach((row) => {
          const mini = document.createElement('div');
          mini.className = 'mini';

          const lbl = document.createElement('div');
          lbl.className = 'mini-label';
          lbl.textContent = row.label;

          const det = document.createElement('div');
          det.className = 'mini-body';
          det.textContent = row.detail;

          mini.appendChild(lbl);
          mini.appendChild(det);
          grid.appendChild(mini);
        });

        body.appendChild(grid);
      },
    });
    panel.appendChild(card);
  });

  const callout = document.createElement('div');
  callout.className = 'callout';
  const strong = document.createElement('strong');
  strong.textContent = 'The golden rule';
  callout.appendChild(strong);
  const text = document.createElement('span');
  text.textContent = ' DNSSEC validates signed DNS data through a chain of trust. DoH/DoT encrypt transport to your resolver; that resolver can still see your queries. They address different threats.';
  callout.appendChild(text);
  panel.appendChild(callout);
}
