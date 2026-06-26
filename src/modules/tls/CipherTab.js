import { ExpandCard } from '../../components/ExpandCard.js';
import { cipherComponents, forwardSecrecy, tls13Removed, cipherMnemonic } from './data.js';

/**
 * CipherTab — each cipher-suite component as a collapsible card listing the
 * algorithm options with good/bad flags. Followed by a forward-secrecy callout,
 * a "removed in TLS 1.3" pill row, and a mnemonic.
 * @param {HTMLElement} panel
 */
export function CipherTab(panel) {
  for (const comp of cipherComponents) {
    const card = ExpandCard({
      title: comp.title,
      open: comp === cipherComponents[0],
      renderBody(body) {
        const list = document.createElement('div');
        list.style.cssText = 'display:flex;flex-direction:column;gap:10px;';

        for (const opt of comp.options) {
          const row = document.createElement('div');
          row.style.cssText =
            'display:flex;align-items:flex-start;gap:10px;flex-wrap:wrap;' +
            'padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);' +
            'background:var(--surface-1);';

          const name = document.createElement('strong');
          name.textContent = opt.name;
          name.style.cssText = 'min-width:150px;color:var(--text-primary);';
          row.appendChild(name);

          const note = document.createElement('span');
          note.textContent = opt.note;
          note.style.cssText = 'color:var(--text-muted);flex:1;min-width:200px;';
          row.appendChild(note);

          if (opt.good) {
            const tag = document.createElement('span');
            tag.className = 'pill';
            tag.textContent = '✓ recommended';
            tag.style.background = 'var(--bg-accent)';
            tag.style.color = 'var(--text-accent)';
            row.appendChild(tag);
          } else if (opt.bad) {
            const tag = document.createElement('span');
            tag.className = 'pill';
            tag.textContent = '✗ avoid';
            tag.style.background = 'rgba(220,38,38,0.12)';
            tag.style.color = '#dc2626';
            row.appendChild(tag);
          }

          list.appendChild(row);
        }

        body.appendChild(list);

        // Real-world example for this component
        if (comp.realWorldExample) {
          const ex = document.createElement('div');
          ex.className = 'callout';
          ex.style.cssText = 'margin-top:12px;';
          ex.innerHTML = `<strong>In the wild:</strong> ${comp.realWorldExample}`;
          body.appendChild(ex);
        }
      }
    });
    panel.appendChild(card);
  }

  // Forward secrecy callout
  const fs = document.createElement('div');
  fs.className = 'callout';
  fs.textContent = forwardSecrecy;
  panel.appendChild(fs);

  // Removed in TLS 1.3
  const removedWrap = document.createElement('div');
  removedWrap.style.cssText = 'margin-top:16px;';
  const removedLabel = document.createElement('div');
  removedLabel.textContent = 'Removed in TLS 1.3 (insecure):';
  removedLabel.style.cssText = 'font-weight:600;margin-bottom:8px;color:var(--text-primary);';
  removedWrap.appendChild(removedLabel);

  const pills = document.createElement('div');
  pills.className = 'pills';
  for (const item of tls13Removed) {
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = item;
    pill.style.background = 'rgba(220,38,38,0.10)';
    pill.style.color = '#dc2626';
    pills.appendChild(pill);
  }
  removedWrap.appendChild(pills);
  panel.appendChild(removedWrap);

  // Mnemonic
  const mn = document.createElement('div');
  mn.className = 'mnemonic';
  mn.textContent = cipherMnemonic;
  panel.appendChild(mn);
}
