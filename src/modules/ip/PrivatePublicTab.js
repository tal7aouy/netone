import { ExpandCard } from '../../components/ExpandCard.js';
import { LayerBadge } from '../../components/LayerBadge.js';
import { addressTypes } from './data.js';

/**
 * PrivatePublicTab — collapsible cards for private ranges, public addresses,
 * NAT, link-local/APIPA, and the rationale for private addressing.
 * @param {HTMLElement} panel - the tab panel to build content into
 */
export function PrivatePublicTab(panel) {
  for (const t of addressTypes) {
    const title = document.createElement('span');
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.gap = '10px';
    title.style.flexWrap = 'wrap';
    title.appendChild(LayerBadge({ n: t.layer, name: 'Network' }));
    const name = document.createElement('strong');
    name.textContent = t.name;
    title.appendChild(name);

    const card = ExpandCard({
      title,
      renderBody(body) {
        const purpose = document.createElement('p');
        purpose.style.fontSize = '15px';
        purpose.style.marginBottom = '12px';
        purpose.textContent = t.purpose;
        body.appendChild(purpose);

        // Range pills
        if (t.ranges) {
          const pills = document.createElement('div');
          pills.className = 'pills';
          for (const r of t.ranges) {
            const pill = document.createElement('span');
            pill.className = 'pill';
            pill.style.fontVariantNumeric = 'tabular-nums';
            pill.textContent = r;
            pills.appendChild(pill);
          }
          body.appendChild(pills);
        }

        // Bullet points (why-private card)
        if (t.points) {
          const ul = document.createElement('ul');
          ul.style.display = 'flex';
          ul.style.flexDirection = 'column';
          ul.style.gap = '6px';
          ul.style.marginTop = '4px';
          for (const p of t.points) {
            const li = document.createElement('li');
            li.style.fontSize = '14px';
            li.style.color = 'var(--text-secondary)';
            li.style.paddingLeft = '16px';
            li.style.position = 'relative';
            const dot = document.createElement('span');
            dot.textContent = '•';
            dot.style.position = 'absolute';
            dot.style.left = '0';
            dot.style.color = 'var(--text-accent)';
            li.prepend(dot);
            li.appendChild(document.createTextNode(p));
            ul.appendChild(li);
          }
          body.appendChild(ul);
        }

        if (t.detail) {
          const detail = document.createElement('p');
          detail.style.marginTop = '12px';
          detail.style.fontSize = '14px';
          detail.style.color = 'var(--text-secondary)';
          detail.textContent = t.detail;
          body.appendChild(detail);
        }

        // Security implication callout
        if (t.securityNote) {
          const sn = document.createElement('div');
          sn.className = 'callout';
          sn.innerHTML = `<strong>Security note</strong>${t.securityNote}`;
          body.appendChild(sn);
        }

        const mn = document.createElement('div');
        mn.className = 'mnemonic';
        mn.textContent = t.mnemonic;
        body.appendChild(mn);
      }
    });
    panel.appendChild(card);
  }
}
