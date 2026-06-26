import { ExpandCard } from '../../components/ExpandCard.js';
import { certificateCards, certificateAnalogy } from './data.js';

/**
 * CertificatesTab — collapsible cards covering what a certificate is,
 * the chain, CAs, validation levels, and expiry. Ends with the passport analogy.
 * @param {HTMLElement} panel
 */
export function CertificatesTab(panel) {
  for (const c of certificateCards) {
    const card = ExpandCard({
      title: c.title,
      open: c === certificateCards[0],
      renderBody(body) {
        const text = document.createElement('p');
        text.textContent = c.body;
        text.style.cssText = 'margin:0 0 10px;color:var(--text-primary);line-height:1.5;';
        body.appendChild(text);

        if (c.tags && c.tags.length) {
          const pills = document.createElement('div');
          pills.className = 'pills';
          for (const t of c.tags) {
            const pill = document.createElement('span');
            pill.className = 'pill';
            pill.textContent = t;
            pills.appendChild(pill);
          }
          body.appendChild(pills);
        }

        // Surprising fact
        if (c.funFact) {
          const fact = document.createElement('div');
          fact.className = 'callout';
          fact.style.cssText = 'margin-top:10px;';
          fact.innerHTML = `<strong>Did you know?</strong> ${c.funFact}`;
          body.appendChild(fact);
        }

        // openssl command to inspect this
        if (c.command) {
          const cmd = document.createElement('div');
          cmd.style.cssText =
            'margin-top:10px;font-size:0.85rem;padding:8px 10px;border-radius:var(--radius);' +
            'background:var(--surface-1);border:1px solid var(--border);' +
            'font-family:var(--font-mono, monospace);color:var(--text-accent);' +
            'overflow-x:auto;white-space:nowrap;';
          cmd.innerHTML = `<strong style="color:var(--text-muted);font-family:inherit;">$ </strong>${c.command}`;
          body.appendChild(cmd);
        }
      }
    });
    panel.appendChild(card);
  }

  // Analogy as a styled blockquote
  const quote = document.createElement('blockquote');
  quote.className = 'blockquote';
  quote.textContent = certificateAnalogy;
  panel.appendChild(quote);
}
