import { tips } from './data.js';

/**
 * TipsTab — renders the practical TLS tips array (debugging, openssl commands,
 * cert management, cipher selection, testing, common errors) as `.tip` cards.
 * @param {HTMLElement} panel
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
