/**
 * ExpandCard — collapsible card with a header button and a body.
 * Body content is built lazily via `renderBody` the first time the card opens,
 * then cached. This keeps large lists cheap until the user opens them.
 *
 * @param {Object} opts
 * @param {string|HTMLElement} opts.title   - text or element for the title row
 * @param {(body: HTMLElement) => void} [opts.renderBody] - builds body content on first open
 * @param {string} [opts.className]         - extra class on the card root
 * @param {boolean} [opts.open=false]       - start expanded
 * @returns {HTMLElement} the card root
 */
export function ExpandCard({ title, renderBody, className = '', open = false }) {
  const card = document.createElement('div');
  card.className = `card ${className}`.trim();
  card.dataset.open = String(open);

  const head = document.createElement('button');
  head.className = 'card-head';
  head.type = 'button';
  head.setAttribute('aria-expanded', String(open));

  const titleEl = document.createElement('span');
  titleEl.className = 'card-title';
  if (typeof title === 'string') {
    titleEl.textContent = title;
  } else {
    titleEl.appendChild(title);
  }
  head.appendChild(titleEl);

  const chev = document.createElement('span');
  chev.className = 'card-chev';
  chev.setAttribute('aria-hidden', 'true');
  chev.textContent = '›';
  head.appendChild(chev);

  const body = document.createElement('div');
  body.className = 'card-body';

  card.appendChild(head);
  card.appendChild(body);

  let bodyBuilt = false;

  function ensureBody() {
    if (bodyBuilt || !renderBody) return;
    renderBody(body);
    bodyBuilt = true;
  }

  head.addEventListener('click', () => {
    const next = card.dataset.open !== 'true';
    if (next) ensureBody();
    card.dataset.open = String(next);
    head.setAttribute('aria-expanded', String(next));
  });

  if (open) ensureBody();

  return card;
}
