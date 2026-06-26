/**
 * Tabs — accessible tablist with lazy-rendered + cached panels.
 *
 * @param {Object} opts
 * @param {{label: string, render: (panel: HTMLElement) => void}[]} opts.tabs
 * @param {number} [opts.active=0] - index of initially active tab
 * @returns {HTMLElement} the tabs root (contains the tablist + panels)
 *
 * Each panel's `render` is called once, the first time the tab is opened.
 * Switching back to an already-rendered tab does not re-render.
 */
export function Tabs({ tabs, active = 0 }) {
  const root = document.createElement('div');

  const tablist = document.createElement('div');
  tablist.className = 'tabs';
  tablist.setAttribute('role', 'tablist');

  const panels = tabs.map((t, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.type = 'button';
    btn.role = 'tab';
    btn.textContent = t.label;
    btn.setAttribute('aria-selected', String(i === active));
    if (i === active) btn.setAttribute('tabindex', '0');
    else btn.setAttribute('tabindex', '-1');

    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.role = 'tabpanel';
    panel.dataset.active = String(i === active);

    tablist.appendChild(btn);
    root.appendChild(tablist);
    root.appendChild(panel);

    return { btn, panel, rendered: false, def: t };
  });

  let current = active;

  function activate(i) {
    if (i === current) return;
    panels.forEach((p, idx) => {
      const on = idx === i;
      p.btn.setAttribute('aria-selected', String(on));
      p.btn.setAttribute('tabindex', on ? '0' : '-1');
      p.panel.dataset.active = String(on);
      if (on && !p.rendered) {
        p.def.render(p.panel);
        p.rendered = true;
      }
    });
    panels[current].btn.setAttribute('tabindex', '-1');
    current = i;
    panels[i].btn.focus();
  }

  tablist.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    const i = panels.findIndex((p) => p.btn === btn);
    if (i >= 0) activate(i);
  });

  tablist.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const last = panels.length - 1;
    let next = current;
    if (e.key === 'ArrowLeft') next = current === 0 ? last : current - 1;
    else if (e.key === 'ArrowRight') next = current === last ? 0 : current + 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    activate(next);
  });

  // render the initially active panel
  if (panels[active]) {
    panels[active].def.render(panels[active].panel);
    panels[active].rendered = true;
  }

  return root;
}
