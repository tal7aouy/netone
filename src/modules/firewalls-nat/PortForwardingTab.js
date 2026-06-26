import { ExpandCard } from '../../components/ExpandCard.js';
import {
  portForwardingSteps,
  portForwardingUses,
  portForwardingAnalogy,
  dmzNote
} from './data.js';

/**
 * PortForwardingTab — what/why/how cards, a numbered step-by-step flow,
 * common uses, a risks callout, and a DMZ warning.
 *
 * @param {HTMLElement} panel - the tab panel to build into
 */
export function PortForwardingTab(panel) {
  // What / Why / How cards
  const basics = [
    { label: 'What it is', text: 'Telling NAT to forward incoming traffic on a specific port to a specific internal IP.' },
    { label: 'Why', text: 'Lets external hosts reach services behind NAT — a home server, game console, or security camera.' },
    { label: 'How it works', text: 'External → router:8080 → NAT rewrites to 192.168.1.100:80 and forwards internally.' }
  ];
  const basicsGrid = document.createElement('div');
  basicsGrid.className = 'mini-grid';
  for (const b of basics) {
    const m = document.createElement('div');
    m.className = 'mini';
    m.innerHTML = `<div class="mini-label">${b.label}</div><div class="mini-body">${b.text}</div>`;
    basicsGrid.appendChild(m);
  }
  panel.appendChild(basicsGrid);

  // Step-by-step flow
  const stepsHead = document.createElement('div');
  stepsHead.style.marginTop = '24px';
  stepsHead.style.fontSize = '13px';
  stepsHead.style.textTransform = 'uppercase';
  stepsHead.style.letterSpacing = '0.06em';
  stepsHead.style.color = 'var(--text-muted)';
  stepsHead.textContent = 'Step-by-step: a forwarded packet';
  panel.appendChild(stepsHead);

  const stepsWrap = document.createElement('div');
  stepsWrap.style.display = 'flex';
  stepsWrap.style.flexDirection = 'column';
  stepsWrap.style.gap = '8px';
  stepsWrap.style.marginTop = '10px';

  portForwardingSteps.forEach((s, i) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'flex-start';
    row.style.gap = '12px';
    row.style.padding = '10px 14px';
    row.style.border = '1px solid var(--border)';
    row.style.borderRadius = 'var(--radius)';
    row.style.background = 'var(--surface-1)';

    const num = document.createElement('span');
    num.textContent = String(i + 1);
    num.style.flex = '0 0 auto';
    num.style.width = '24px';
    num.style.height = '24px';
    num.style.display = 'inline-flex';
    num.style.alignItems = 'center';
    num.style.justifyContent = 'center';
    num.style.borderRadius = '50%';
    num.style.background = 'var(--bg-accent)';
    num.style.color = 'var(--text-accent)';
    num.style.fontWeight = '700';
    num.style.fontSize = '12px';
    row.appendChild(num);

    const txt = document.createElement('div');
    txt.innerHTML =
      `<strong style="color:var(--text-primary)">${s.step}</strong>` +
      `<div style="color:var(--text-muted);margin-top:2px">${s.detail}</div>`;
    row.appendChild(txt);

    stepsWrap.appendChild(row);

    // iptables example for this step
    const cmd = document.createElement('div');
    cmd.className = 'callout';
    cmd.style.marginTop = '6px';
    cmd.innerHTML = `<code>${s.iptablesExample}</code>`;
    stepsWrap.appendChild(cmd);
  });
  panel.appendChild(stepsWrap);

  // Common uses — collapsible card
  const usesCard = ExpandCard({
    title: 'Common uses',
    renderBody(body) {
      const grid = document.createElement('div');
      grid.className = 'mini-grid';
      for (const u of portForwardingUses) {
        const m = document.createElement('div');
        m.className = 'mini';
        m.innerHTML =
          `<div class="mini-label">${u.use}</div>` +
          `<div class="mini-body">${u.detail}</div>`;
        grid.appendChild(m);
      }
      body.appendChild(grid);
    }
  });
  panel.appendChild(usesCard);

  // Risks callout
  const risks = document.createElement('div');
  risks.className = 'callout';
  risks.innerHTML =
    `<strong>Risks</strong>` +
    `Port forwarding opens a hole in your firewall — the outside world can now reach an internal service. ` +
    `Only forward what you need, keep the service patched, and use strong authentication (long passwords, ` +
    `keys, 2FA). A forwarded port is only as safe as the service behind it.`;
  panel.appendChild(risks);

  // DMZ warning — collapsible
  const dmzCard = ExpandCard({
    title: 'DMZ — use with caution',
    renderBody(body) {
      const warn = document.createElement('div');
      warn.className = 'callout';
      warn.style.marginTop = '0';
      warn.innerHTML = `<strong>What it is</strong>${dmzNote}`;
      body.appendChild(warn);
    }
  });
  panel.appendChild(dmzCard);

  // Analogy blockquote
  const quote = document.createElement('blockquote');
  quote.className = 'blockquote';
  quote.textContent = portForwardingAnalogy;
  panel.appendChild(quote);
}
