import { Tabs } from '../../components/Tabs.js';
import { CompareTab } from './CompareTab.js';
import { HandshakeTab } from './HandshakeTab.js';
import { StatesTab } from './StatesTab.js';
import { CheatTab } from './CheatTab.js';
import { CongestionTab } from './CongestionTab.js';
import { TipsTab } from './TipsTab.js';

/**
 * TCP/UDP Internals module entry. Composes the four tabs into a Tabs
 * component and mounts it into the container provided by the router.
 */
export default {
  id: 'tcp-udp',
  label: 'TCP/UDP Internals',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 3l3 3-3 3M17 3l-3 3 3 3M3 12h18M3 18h18"/></svg>',
  render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    const h = document.createElement('h1');
    h.className = 'module-title';
    h.textContent = 'TCP/UDP Internals';
    const sub = document.createElement('p');
    sub.className = 'module-sub';
    sub.textContent =
      'Layer 4 — how data actually gets delivered: the reliable phone call vs the fire-and-forget megaphone.';
    header.appendChild(h);
    header.appendChild(sub);
    container.appendChild(header);

    const tabs = Tabs({
      tabs: [
        { label: 'TCP vs UDP', render: CompareTab },
        { label: 'TCP Handshake', render: HandshakeTab },
        { label: 'TCP States', render: StatesTab },
        { label: 'Congestion Control', render: CongestionTab },
        { label: 'Tips & Tricks', render: TipsTab },
        { label: 'Cheat Sheet', render: CheatTab }
      ]
    });
    container.appendChild(tabs);
  }
};
