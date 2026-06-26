import { handshakeSteps, tls13Callout, handshakeMnemonic } from './data.js';

/**
 * HandshakeTab — step-by-step TLS handshake as a two-column journey.
 * Left column = step number + name + direction; right column = payload + detail.
 * A callout at the end highlights the TLS 1.3 speedup.
 * @param {HTMLElement} panel
 */
export function HandshakeTab(panel) {
  const journey = document.createElement('div');
  journey.className = 'journey';

  const left = document.createElement('div');
  left.className = 'journey-col';
  const right = document.createElement('div');
  right.className = 'journey-col';

  for (const step of handshakeSteps) {
    // Left: step marker + name + direction
    const rowL = document.createElement('div');
    rowL.className = 'journey-row';

    const num = document.createElement('div');
    num.textContent = String(step.n);
    num.style.cssText =
      `width:34px;height:34px;border-radius:50%;display:flex;align-items:center;` +
      `justify-content:center;font-weight:700;flex-shrink:0;` +
      `background:var(--bg-accent);color:var(--text-accent);` +
      `border:1px solid var(--border);`;
    rowL.appendChild(num);

    const nameWrap = document.createElement('div');
    const name = document.createElement('div');
    name.textContent = step.name;
    name.style.cssText = 'font-weight:600;color:var(--text-primary);';
    nameWrap.appendChild(name);

    const dir = document.createElement('div');
    dir.textContent = step.dir;
    dir.style.cssText = 'font-size:0.82rem;color:var(--text-muted);margin-top:2px;';
    nameWrap.appendChild(dir);
    rowL.appendChild(nameWrap);

    left.appendChild(rowL);

    // Right: payload + detail + optional TLS 1.3 note
    const rowR = document.createElement('div');
    rowR.className = 'journey-row';
    rowR.style.flexDirection = 'column';
    rowR.style.alignItems = 'stretch';

    const payload = document.createElement('div');
    payload.innerHTML = `<strong style="color:var(--text-accent);">Payload:</strong> ${step.payload}`;
    rowR.appendChild(payload);

    const detail = document.createElement('div');
    detail.textContent = step.detail;
    detail.style.cssText = 'color:var(--text-muted);margin-top:6px;font-size:0.92rem;';
    rowR.appendChild(detail);

    if (step.tls13) {
      const note = document.createElement('div');
      note.style.cssText =
        'margin-top:8px;font-size:0.85rem;padding:6px 10px;border-radius:var(--radius);' +
        'background:var(--surface-1);border:1px solid var(--border);';
      note.innerHTML = `<strong>TLS 1.3:</strong> ${step.tls13}`;
      rowR.appendChild(note);
    }

    // Wireshark display filter for this handshake message
    if (step.wiresharkFilter) {
      const wf = document.createElement('div');
      wf.style.cssText =
        'margin-top:8px;font-size:0.82rem;padding:6px 10px;border-radius:var(--radius);' +
        'background:var(--surface-1);border:1px solid var(--border);' +
        'font-family:var(--font-mono, monospace);color:var(--text-accent);';
      wf.innerHTML = `<strong style="color:var(--text-muted);font-family:inherit;">Wireshark:</strong> ${step.wiresharkFilter}`;
      rowR.appendChild(wf);
    }

    // Real-world context
    if (step.realWorldNote) {
      const rw = document.createElement('div');
      rw.className = 'callout';
      rw.style.cssText = 'margin-top:8px;font-size:0.88rem;';
      rw.innerHTML = `<strong>In practice:</strong> ${step.realWorldNote}`;
      rowR.appendChild(rw);
    }

    right.appendChild(rowR);
  }

  journey.appendChild(left);
  journey.appendChild(right);
  panel.appendChild(journey);

  // Mnemonic
  const mn = document.createElement('div');
  mn.className = 'mnemonic';
  mn.textContent = handshakeMnemonic;
  panel.appendChild(mn);

  // TLS 1.3 callout
  const callout = document.createElement('div');
  callout.className = 'callout';
  callout.textContent = tls13Callout;
  panel.appendChild(callout);
}
