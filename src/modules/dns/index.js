/**
 * DNS Deep Dive module — composes the six DNS tabs.
 * @module modules/dns
 */
import { LookupLab } from './LookupLab.js';
import { Tabs } from '../../components/Tabs.js';
import { HierarchyTab } from './HierarchyTab.js';
import { RecordsTab } from './RecordsTab.js';
import { CheatTab } from './CheatTab.js';
import { SecurityTab } from './SecurityTab.js';
import { TipsTab } from './TipsTab.js';

export default {
  id: 'dns',
  label: 'DNS Deep Dive',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  /**
   * Render the DNS module into the given container.
   * @param {HTMLElement} container - the host element (cleared first)
   */
  render(container) {
    container.replaceChildren();

    const header = document.createElement('div');
    header.className = 'module-header';

    const title = document.createElement('h1');
    title.className = 'module-title';
    title.textContent = 'DNS Deep Dive';

    const sub = document.createElement('p');
    sub.className = 'module-sub';
    sub.textContent = 'Explore how names resolve, follow the packets, and experiment with records, caching, and DNS security.';

    header.appendChild(title);
    header.appendChild(sub);
    container.appendChild(header);

    const tabs = Tabs({
      tabs: [
        { label: 'Interactive Lab', render: LookupLab },
        { label: 'DNS Hierarchy', render: HierarchyTab },
        { label: 'Record Types', render: RecordsTab },
        { label: 'Cheat Sheet', render: CheatTab },
        { label: 'Security', render: SecurityTab },
        { label: 'Tips & Tricks', render: TipsTab },
      ],
    });
    container.appendChild(tabs);
  },
};
