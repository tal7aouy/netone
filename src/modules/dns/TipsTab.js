/**
 * TipsTab — practical DNS tips rendered as a list of `.tip` cards.
 * @param {HTMLElement} panel - the tab panel to render into
 */
import { tips } from './data.js';

export function TipsTab(panel) {
  const intro = document.createElement('p');
  intro.className = 'module-sub';
  intro.textContent = 'Twelve hard-won DNS habits — dig tricks, debugging shortcuts, TTL strategy, and the gotchas that bite at 3am.';
  panel.appendChild(intro);

  for (const t of tips) {
    const tip = document.createElement('div');
    tip.className = 'tip';
    tip.innerHTML = `<div class="tip-icon">${t.icon}</div><div class="tip-body"><div class="tip-title">${t.title}</div><div class="tip-text">${t.text}</div></div>`;
    panel.appendChild(tip);
  }
}
