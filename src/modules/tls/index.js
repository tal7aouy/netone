import { Tabs } from '../../components/Tabs.js';
import { HandshakeTab } from './HandshakeTab.js';
import { CertificatesTab } from './CertificatesTab.js';
import { CipherTab } from './CipherTab.js';
import { CheatTab } from './CheatTab.js';
import { VersionsTab } from './VersionsTab.js';
import { TipsTab } from './TipsTab.js';

/**
 * TLS / HTTPS module entry. Composes the four tabs into a Tabs component and
 * mounts it into the container provided by the router.
 */
export default {
  id: 'tls',
  label: 'TLS / HTTPS',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    const h = document.createElement('h1');
    h.className = 'module-title';
    h.textContent = 'TLS / HTTPS';
    const sub = document.createElement('p');
    sub.className = 'module-sub';
    sub.textContent =
      'The padlock explained — handshakes, certificates, cipher suites, and why TLS 1.3 changed the game.';
    header.appendChild(h);
    header.appendChild(sub);
    container.appendChild(header);

    const tabs = Tabs({
      tabs: [
        { label: 'TLS Handshake', render: HandshakeTab },
        { label: 'Certificates', render: CertificatesTab },
        { label: 'Cipher Suites', render: CipherTab },
        { label: 'Cheat Sheet', render: CheatTab },
        { label: 'Versions & Attacks', render: VersionsTab },
        { label: 'Tips & Tricks', render: TipsTab }
      ]
    });
    container.appendChild(tabs);
  }
};
