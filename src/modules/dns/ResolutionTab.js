/**
 * ResolutionTab — step-by-step journey of resolving www.example.com.
 * Uses a numbered step list with actor badges and a closing callout.
 * @param {HTMLElement} panel - the tab panel to render into
 */
import { LayerBadge } from '../../components/LayerBadge.js';
import { resolutionSteps, resolutionCallout } from './data.js';

export function ResolutionTab(panel) {
  const intro = document.createElement('p');
  intro.className = 'module-sub';
  intro.textContent = 'Follow a single lookup for www.example.com from keystroke to IP address. Eight hops, one answer.';
  panel.appendChild(intro);

  // Step list — each step is a row with a number, actor badge, and action.
  const list = document.createElement('div');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '10px';

  resolutionSteps.forEach((step, i) => {
    const row = document.createElement('div');
    row.className = 'journey-row';
    row.style.display = 'flex';
    row.style.alignItems = 'flex-start';
    row.style.gap = '14px';

    // Number bubble
    const num = document.createElement('span');
    num.textContent = String(i + 1);
    num.style.flexShrink = '0';
    num.style.width = '28px';
    num.style.height = '28px';
    num.style.display = 'flex';
    num.style.alignItems = 'center';
    num.style.justifyContent = 'center';
    num.style.borderRadius = '50%';
    num.style.background = 'var(--bg-accent)';
    num.style.color = 'var(--text-accent)';
    num.style.fontWeight = '700';
    num.style.fontSize = '13px';
    row.appendChild(num);

    // Content column
    const col = document.createElement('div');
    col.style.flex = '1';
    col.style.minWidth = '0';

    const actorRow = document.createElement('div');
    actorRow.style.display = 'flex';
    actorRow.style.alignItems = 'center';
    actorRow.style.gap = '8px';
    actorRow.style.marginBottom = '4px';

    const badge = LayerBadge({ n: 7, text: step.actor });
    actorRow.appendChild(badge);

    col.appendChild(actorRow);

    const action = document.createElement('div');
    action.textContent = step.action;
    action.style.color = 'var(--text-primary)';
    action.style.lineHeight = '1.55';
    col.appendChild(action);

    if (step.queryType) {
      const q = document.createElement('div');
      q.className = 'callout';
      q.style.marginTop = '6px';
      q.style.padding = '6px 10px';
      const qStrong = document.createElement('strong');
      qStrong.textContent = 'Query type';
      q.appendChild(qStrong);
      const qText = document.createElement('span');
      qText.textContent = ' ' + step.queryType;
      q.appendChild(qText);
      col.appendChild(q);
    }

    if (step.note) {
      const note = document.createElement('div');
      note.textContent = step.note;
      note.style.color = 'var(--text-muted)';
      note.style.fontSize = '12px';
      note.style.marginTop = '4px';
      note.style.fontStyle = 'italic';
      col.appendChild(note);
    }

    row.appendChild(col);
    list.appendChild(row);
  });

  panel.appendChild(list);

  // Recursive vs iterative callout
  const callout = document.createElement('div');
  callout.className = 'callout';
  const strong = document.createElement('strong');
  strong.textContent = 'Recursive vs Iterative';
  callout.appendChild(strong);
  const text = document.createElement('span');
  text.textContent = resolutionCallout;
  callout.appendChild(text);
  panel.appendChild(callout);
}
