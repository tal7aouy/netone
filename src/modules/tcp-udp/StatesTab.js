import { ExpandCard } from '../../components/ExpandCard.js';
import { states, timeWaitMnemonic } from './data.js';

/**
 * StatesTab — the TCP connection state machine as collapsible cards,
 * roughly in lifecycle order. Each card shows who owns the state and
 * what it means. A mnemonic callout explains the notorious TIME_WAIT.
 */
export function StatesTab(panel) {
  const intro = document.createElement('p');
  intro.style.color = 'var(--text-muted)';
  intro.style.fontSize = '0.9rem';
  intro.style.margin = '0 0 12px';
  intro.textContent =
    'A TCP connection moves through a set of states on each endpoint. ' +
    'Tap a state to see who owns it and what it means.';
  panel.appendChild(intro);

  for (const s of states) {
    const title = document.createElement('span');
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.gap = '10px';
    title.style.flexWrap = 'wrap';

    const name = document.createElement('strong');
    name.style.fontFamily = 'var(--mono, monospace)';
    name.textContent = s.name;
    title.appendChild(name);

    const who = document.createElement('span');
    who.className = 'pill';
    who.textContent = s.who;
    title.appendChild(who);

    const card = ExpandCard({
      title,
      open: s.name === 'ESTABLISHED',
      renderBody(body) {
        const d = document.createElement('div');
        d.className = 'mini';
        d.innerHTML = `<div class="mini-label">Meaning</div><div class="mini-body">${s.desc}</div>`;
        body.appendChild(d);

        const ws = document.createElement('div');
        ws.className = 'mini';
        ws.innerHTML = `<div class="mini-label">In Wireshark</div><div class="mini-body">${s.wiresharkHint}</div>`;
        body.appendChild(ws);

        const dbg = document.createElement('div');
        dbg.className = 'mini';
        dbg.innerHTML = `<div class="mini-label">How to check</div><div class="mini-body"><code style="font-family:var(--mono,monospace)">${s.debuggingTip}</code></div>`;
        body.appendChild(dbg);
      }
    });

    panel.appendChild(card);
  }

  const mn = document.createElement('div');
  mn.className = 'mnemonic';
  mn.textContent = timeWaitMnemonic;
  panel.appendChild(mn);
}
