import { tips } from './data.js';

/**
 * TipsTab — renders the practical tips & tricks list from data.js.
 * @param {HTMLElement} panel - the tab panel to build content into
 */
export function TipsTab(panel) {
  for (const t of tips) {
    const tip = document.createElement('div');
    tip.className = 'tip';
    tip.innerHTML =
      `<div class="tip-icon">${t.icon}</div>` +
      `<div class="tip-body">` +
      `<div class="tip-title">${t.title}</div>` +
      `<div class="tip-text">${t.text}</div>` +
      `</div>`;
    panel.appendChild(tip);
  }
}
