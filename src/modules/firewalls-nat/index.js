import { Tabs } from '../../components/Tabs.js';
import { FirewallTypesTab } from './FirewallTypesTab.js';
import { NATTypesTab } from './NATTypesTab.js';
import { PortForwardingTab } from './PortForwardingTab.js';
import { CheatTab } from './CheatTab.js';
import { RulesTab } from './RulesTab.js';
import { TipsTab } from './TipsTab.js';

/**
 * Firewalls & NAT module entry. Composes the four tabs into a Tabs
 * component and mounts it into the container provided by the router.
 */
export default {
  id: 'firewalls-nat',
  label: 'Firewalls & NAT',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
  render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    const h = document.createElement('h1');
    h.className = 'module-title';
    h.textContent = 'Firewalls & NAT';
    const sub = document.createElement('p');
    sub.className = 'module-sub';
    sub.textContent = 'The bouncer and the receptionist — who gets in, and how everyone shares one address.';
    header.appendChild(h);
    header.appendChild(sub);
    container.appendChild(header);

    const tabs = Tabs({
      tabs: [
        { label: 'Firewall Types', render: FirewallTypesTab },
        { label: 'NAT Types', render: NATTypesTab },
        { label: 'Port Forwarding', render: PortForwardingTab },
        { label: 'Cheat Sheet', render: CheatTab },
        { label: 'Rules & Troubleshooting', render: RulesTab },
        { label: 'Tips & Tricks', render: TipsTab }
      ]
    });
    container.appendChild(tabs);
  }
};
