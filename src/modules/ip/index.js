import { Tabs } from '../../components/Tabs.js';
import { BasicsTab } from './BasicsTab.js';
import { SubnettingTab } from './SubnettingTab.js';
import { PrivatePublicTab } from './PrivatePublicTab.js';
import { CheatTab } from './CheatTab.js';
import { TipsTab } from './TipsTab.js';

/**
 * IP & Subnetting module entry. Composes the five tabs into a Tabs component
 * and mounts it into the container provided by the router.
 */
export default {
  id: 'ip',
  label: 'IP & Subnetting',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>',
  render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    const h = document.createElement('h1');
    h.className = 'module-title';
    h.textContent = 'IP & Subnetting';
    const sub = document.createElement('p');
    sub.className = 'module-sub';
    sub.textContent = 'Addresses, masks, and the math that slices one network into many.';
    header.appendChild(h);
    header.appendChild(sub);
    container.appendChild(header);

    const tabs = Tabs({
      tabs: [
        { label: 'IP Basics', render: BasicsTab },
        { label: 'Subnetting', render: SubnettingTab },
        { label: 'Private vs Public', render: PrivatePublicTab },
        { label: 'Cheat Sheet', render: CheatTab },
        { label: 'Tips & Tricks', render: TipsTab }
      ]
    });
    container.appendChild(tabs);
  }
};
