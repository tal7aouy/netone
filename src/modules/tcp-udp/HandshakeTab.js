import { handshake, teardown, handshakeCallout } from './data.js';

/**
 * HandshakeTab — visual step-by-step of the TCP 3-way handshake
 * (connection setup) and 4-way teardown (connection close).
 * Each step is a row showing flag, direction (from → to), and message.
 */
export function HandshakeTab(panel) {
  // ---- 3-way handshake ----
  panel.appendChild(sectionTitle('3-Way Handshake', 'Connection setup — both sides agree to talk.'));

  const setup = document.createElement('div');
  setup.className = 'journey';
  setup.style.gap = '0';

  const setupCol = document.createElement('div');
  setupCol.className = 'journey-col';
  for (const step of handshake) {
    setupCol.appendChild(stepRow(step, 'setup'));
  }
  setup.appendChild(setupCol);
  panel.appendChild(setup);

  const callout = document.createElement('div');
  callout.className = 'callout';
  callout.textContent = handshakeCallout;
  panel.appendChild(callout);

  // ---- 4-way teardown ----
  panel.appendChild(sectionTitle('4-Way Teardown', 'Connection close — both sides agree to stop.'));

  const close = document.createElement('div');
  close.className = 'journey';
  close.style.gap = '0';

  const closeCol = document.createElement('div');
  closeCol.className = 'journey-col';
  for (const step of teardown) {
    closeCol.appendChild(stepRow(step, 'teardown'));
  }
  close.appendChild(closeCol);
  panel.appendChild(close);

  const note = document.createElement('div');
  note.className = 'mnemonic';
  note.textContent =
    'Mnemonic for the flags: FIN = "FINished sending", ACK = "ACKnowledged". ' +
    'Each side must both FIN and ACK — that\'s why it takes 4 steps, not 2.';
  panel.appendChild(note);
}

function sectionTitle(text, sub) {
  const wrap = document.createElement('div');
  wrap.style.marginTop = '8px';
  wrap.style.marginBottom = '12px';
  const h = document.createElement('h3');
  h.style.margin = '0 0 4px';
  h.style.fontSize = '1.05rem';
  h.style.color = 'var(--text-accent)';
  h.textContent = text;
  wrap.appendChild(h);
  const s = document.createElement('p');
  s.style.margin = '0';
  s.style.fontSize = '0.85rem';
  s.style.color = 'var(--text-muted)';
  s.textContent = sub;
  wrap.appendChild(s);
  return wrap;
}

function stepRow(step, kind) {
  const row = document.createElement('div');
  row.className = 'journey-row';
  row.style.flexDirection = 'column';
  row.style.alignItems = 'stretch';
  row.style.gap = '6px';
  row.style.setProperty('--layer-bg', kind === 'setup' ? 'var(--bg-accent)' : 'var(--surface-1)');
  row.style.setProperty('--layer-fg', 'var(--text-primary)');

  const top = document.createElement('div');
  top.style.display = 'flex';
  top.style.alignItems = 'center';
  top.style.justifyContent = 'space-between';
  top.style.gap = '10px';
  top.style.flexWrap = 'wrap';

  const flag = document.createElement('span');
  flag.style.fontWeight = '700';
  flag.style.fontSize = '0.95rem';
  flag.style.color = 'var(--text-accent)';
  flag.textContent = `${step.step}. ${step.flag}`;
  top.appendChild(flag);

  const dir = document.createElement('span');
  dir.style.fontSize = '0.8rem';
  dir.style.color = 'var(--text-muted)';
  dir.style.whiteSpace = 'nowrap';
  dir.textContent = `${step.from} → ${step.to}`;
  top.appendChild(dir);

  row.appendChild(top);

  const msg = document.createElement('div');
  msg.style.fontSize = '0.9rem';
  msg.textContent = `“${step.msg}”`;
  row.appendChild(msg);

  const detail = document.createElement('div');
  detail.style.fontSize = '0.8rem';
  detail.style.color = 'var(--text-muted)';
  detail.textContent = step.detail;
  row.appendChild(detail);

  if (step.wiresharkFilter) {
    const filter = document.createElement('div');
    filter.style.fontSize = '0.78rem';
    filter.style.marginTop = '2px';
    filter.innerHTML =
      `<span style="color:var(--text-muted)">Wireshark: </span>` +
      `<code style="font-family:var(--mono,monospace);color:var(--text-accent)">${step.wiresharkFilter}</code>`;
    row.appendChild(filter);
  }

  if (step.seqDetail) {
    const seq = document.createElement('div');
    seq.style.fontSize = '0.78rem';
    seq.style.marginTop = '2px';
    seq.innerHTML =
      `<span style="color:var(--text-muted)">Seq/ACK: </span>` +
      `<span style="color:var(--text-primary)">${step.seqDetail}</span>`;
    row.appendChild(seq);
  }

  return row;
}
