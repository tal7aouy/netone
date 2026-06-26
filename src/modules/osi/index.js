import { Tabs } from '../../components/Tabs.js';
import { LayersTab } from './LayersTab.js';
import { JourneyTab } from './JourneyTab.js';
import { AttacksTab } from './AttacksTab.js';
import { CheatTab } from './CheatTab.js';
import { TipsTab } from './TipsTab.js';

/**
 * OSI module entry. Composes the five tabs into a Tabs component and
 * mounts it into the container provided by the router.
 */
export default {
  id: 'osi',
  label: 'OSI Model',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="17" width="18" height="4" rx="1"/></svg>',
  render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    const h = document.createElement('h1');
    h.className = 'module-title';
    h.textContent = 'OSI Model';
    const sub = document.createElement('p');
    sub.className = 'module-sub';
    sub.textContent = 'Seven layers, one stack — how data really travels, and where attackers strike.';
    header.appendChild(h);
    header.appendChild(sub);
    container.appendChild(header);

    const tabs = Tabs({
      tabs: [
        { label: 'Layers', render: LayersTab },
        { label: 'Data Journey', render: JourneyTab },
        { label: 'Hacks per Layer', render: AttacksTab },
        { label: 'Cheat Sheet', render: CheatTab },
        { label: 'Tips & Tricks', render: TipsTab }
      ]
    });
    container.appendChild(tabs);
  }
};
