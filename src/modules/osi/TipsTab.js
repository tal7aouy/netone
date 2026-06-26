import { tips } from './data.js';

/**
 * TipsTab — renders the `tips` array from data.js as a list of tip cards.
 * Each tip shows an icon, title, and explanatory text (HTML allowed).
 * Covers mnemonics, misconceptions, interview prep, debugging, and protocol quirks.
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
