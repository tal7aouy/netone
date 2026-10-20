import './style.css';
import webSecurity from './modules/web-security/index.js';

import dns from './modules/dns/index.js';
import llmMcp from './modules/llm-mcp/index.js';

/**
 * Module registry.
 * To add a module: drop a folder under src/modules/<id>/ with an index.js
 * exporting { id, label, icon, render(container) }, then import it here and
 * add it to this array. Nothing else changes.
 */
const modules = [webSecurity, dns, llmMcp];

const app = document.getElementById('app');

function brandMark() {
  return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="currentColor"/>
    <g fill="none" stroke="var(--surface-0)" stroke-width="3" stroke-linecap="round">
      <circle cx="32" cy="20" r="5"/>
      <circle cx="18" cy="44" r="5"/>
      <circle cx="46" cy="44" r="5"/>
      <path d="M32 25 L32 39"/>
      <path d="M32 25 L20 39"/>
      <path d="M32 25 L44 39"/>
      <path d="M23 44 L41 44"/>
    </g>
  </svg>`;
}

function renderShell() {
  app.innerHTML = '';

  const shell = document.createElement('div');
  shell.className = 'app';

  // ---- nav ----
  const nav = document.createElement('aside');
  nav.className = 'nav';

  const brand = document.createElement('div');
  brand.className = 'brand';
  const mark = document.createElement('span');
  mark.className = 'brand-mark';
  mark.style.color = 'var(--text-accent)';
  mark.innerHTML = brandMark();
  brand.appendChild(mark);
  const brandText = document.createElement('span');
  brandText.textContent = 'NetOne';
  brand.appendChild(brandText);
  const themeToggle = document.createElement('button');
  themeToggle.type = 'button';
  themeToggle.className = 'theme-toggle';
  const updateThemeToggle = () => {
    const dark = document.documentElement.dataset.theme !== 'light';
    themeToggle.textContent = dark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggle.title = themeToggle.getAttribute('aria-label');
    themeToggle.setAttribute('aria-pressed', String(dark));
  };
  updateThemeToggle();
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('netone-theme', theme); } catch { /* Keep the choice for this visit. */ }
    updateThemeToggle();
  });
  brand.appendChild(themeToggle);
  nav.appendChild(brand);

  const navList = document.createElement('div');
  navList.className = 'nav-list';
  nav.appendChild(navList);
  const navCaption = document.createElement('div');
  navCaption.className = 'nav-caption';
  navCaption.textContent = 'YOUR LEARNING PATHS';
  nav.insertBefore(navCaption, navList);

  const navFoot = document.createElement('div');
  navFoot.className = 'nav-foot';
  navFoot.innerHTML = '<div class="nav-foot-icon">↗</div><b>A little curiosity. A lot of clarity.</b><p>Your field guide to networking,<br>web security, and AI systems.</p><span>NETONE · LEARN SOMETHING NEW</span>';
  nav.appendChild(navFoot);

  // ---- main ----
  const main = document.createElement('main');
  main.className = 'main';

  shell.appendChild(nav);
  shell.appendChild(main);
  app.appendChild(shell);

  return { navList, main };
}

const { navList, main } = renderShell();

// ---- module nav buttons ----
let activeId = modules[0]?.id ?? null;
let disposeModule = null;
const rendered = new Set();

modules.forEach((m) => {
  const btn = document.createElement('button');
  btn.className = 'nav-item';
  btn.type = 'button';
  btn.dataset.id = m.id;
  btn.setAttribute('aria-current', String(m.id === activeId));

  const icon = document.createElement('span');
  icon.className = 'nav-icon';
  icon.innerHTML = m.icon;
  btn.appendChild(icon);

  const label = document.createElement('span');
  label.textContent = m.label;
  btn.appendChild(label);

  btn.addEventListener('click', () => activate(m.id));
  navList.appendChild(btn);
});

function activate(id) {
  if (id === activeId) return;
  activeId = id;
  navList.querySelectorAll('.nav-item').forEach((b) => {
    b.setAttribute('aria-current', String(b.dataset.id === id));
  });
  renderModule();
}

function renderModule() {
  const mod = modules.find((m) => m.id === activeId);
  if (!mod) {
    main.innerHTML = '<div class="placeholder">No module selected.</div>';
    return;
  }
  // clear and (re)render — modules are cheap to re-render, and this keeps
  // state simple. For heavier modules you could cache by id like the tabs do.
  disposeModule?.();
  disposeModule = null;
  main.innerHTML = '';
  const dispose = mod.render(main);
  if (typeof dispose === 'function') disposeModule = dispose;
  rendered.add(activeId);
}

// initial render
renderModule();
