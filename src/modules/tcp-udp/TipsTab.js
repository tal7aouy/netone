import { tips } from './data.js';

/**
 * TipsTab — practical, real-world tips for debugging and tuning TCP/UDP.
 * Each tip is rendered as a `.tip` block with an icon, title, and body.
 */
export function TipsTab(panel) {
  const intro = document.createElement('p');
  intro.style.color = 'var(--text-muted)';
  intro.style.fontSize = '0.9rem';
  intro.style.margin = '0 0 12px';
  intro.textContent =
    'Battle-tested commands and filters for working with TCP and UDP in the real world.';
  panel.appendChild(intro);

  for (const t of tips) {
    const tip = document.createElement('div');
    tip.className = 'tip';
    tip.innerHTML = `<div class="tip-icon">${t.icon}</div><div class="tip-body"><div class="tip-title">${t.title}</div><div class="tip-text">${t.text}</div></div>`;
    panel.appendChild(tip);
  }
}
