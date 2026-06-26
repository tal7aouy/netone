import { tips } from './data.js';

/**
 * TipsTab — renders the tips array as a list of styled tip cards.
 * Each tip shows an icon, a title, and explanatory text (which may
 * contain inline <code> snippets).
 *
 * @param {HTMLElement} panel - the tab panel to build into
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
