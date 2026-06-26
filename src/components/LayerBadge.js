/**
 * LayerBadge — colored pill showing layer number + name.
 * @param {Object} opts
 * @param {number} opts.n        - layer number (1-7)
 * @param {string} [opts.name]   - optional layer name text
 * @param {string} [opts.text]   - optional custom text instead of name
 * @returns {HTMLElement}
 */
export function LayerBadge({ n, name, text }) {
  const el = document.createElement('span');
  el.className = 'layer-badge';
  el.style.setProperty('--layer-bg', `var(--layer-${n}-bg)`);
  el.style.setProperty('--layer-fg', `var(--layer-${n}-fg)`);

  const num = document.createElement('span');
  num.className = 'layer-num';
  num.textContent = `L${n}`;
  el.appendChild(num);

  const label = text ?? name ?? '';
  if (label) {
    const lbl = document.createElement('span');
    lbl.textContent = label;
    el.appendChild(lbl);
  }
  return el;
}
