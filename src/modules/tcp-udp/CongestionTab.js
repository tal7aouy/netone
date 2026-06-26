import { ExpandCard } from '../../components/ExpandCard.js';
import { congestionControl } from './data.js';

/**
 * CongestionTab — TCP congestion control algorithms as expandable cards.
 * Each card shows the algorithm name as the title and a mini-grid of
 * "what it does" and "why it matters" in the body.
 */
export function CongestionTab(panel) {
  const intro = document.createElement('p');
  intro.style.color = 'var(--text-muted)';
  intro.style.fontSize = '0.9rem';
  intro.style.margin = '0 0 12px';
  intro.textContent =
    'TCP doesn\'t just send — it probes for available bandwidth and backs off under loss. ' +
    'Tap an algorithm to see what it does and why it exists.';
  panel.appendChild(intro);

  for (const algo of congestionControl) {
    const card = ExpandCard({
      title: algo.name,
      open: algo.name === 'Slow Start',
      renderBody(body) {
        const grid = document.createElement('div');
        grid.className = 'mini-grid';

        const what = document.createElement('div');
        what.className = 'mini';
        what.innerHTML =
          `<div class="mini-label">What it does</div>` +
          `<div class="mini-body">${algo.what}</div>`;
        grid.appendChild(what);

        const why = document.createElement('div');
        why.className = 'mini';
        why.innerHTML =
          `<div class="mini-label">Why it matters</div>` +
          `<div class="mini-body">${algo.why}</div>`;
        grid.appendChild(why);

        body.appendChild(grid);
      }
    });

    panel.appendChild(card);
  }

  const note = document.createElement('div');
  note.className = 'callout';
  note.textContent =
    'Classic TCP (Reno/NewReno) uses Slow Start → Congestion Avoidance → Fast Retransmit → Fast Recovery. ' +
    'Modern Linux defaults to CUBIC; BBR is gaining ground on lossy or high-latency links.';
  panel.appendChild(note);
}
