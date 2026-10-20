import { lessons } from './data.js';
const escape = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readProgress() {
  try { const value = JSON.parse(localStorage.getItem('netone-web-progress') || '[]'); return new Set(Array.isArray(value) ? value.filter(i => Number.isInteger(i) && i >= 0 && i < lessons.length) : []); } catch { return new Set(); }
}
export default {
  id: 'web-security', label: 'Web Security',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/></svg>',
  render(container) {
    let selected = 0;
    const complete = readProgress();
    container.innerHTML = `<div class="page-top"><span>Learning paths <span class="crumb-divider">/</span> <b>Web security</b></span><span class="top-status"><i></i> LEARN BY DOING</span></div>
      <header class="security-hero"><div class="hero-copy"><span class="eyebrow">THE WEB SECURITY FIELD GUIDE</span><h1>Understand the web.<br><span>Think like a researcher.</span></h1><p>Go beyond the theory. Explore how browsers, servers, and security controls work through real HTTP conversations.</p><div class="hero-meta"><span>◷ 64 minutes</span><span>◈ 7 hands-on lessons</span><span>◎ Beginner friendly</span></div><button class="primary-btn start-course">Start learning <span>↗</span></button></div><div class="hero-visual" aria-hidden="true"><div class="visual-label">THE REQUEST–RESPONSE CYCLE</div><div class="flow-node">▣ <span>Browser<small>THE CLIENT</small></span><i></i></div><div class="flow-lines"><span>GET /learn →</span><span>← 200 OK</span></div><div class="flow-node server-node">▤ <span>Web server<small>THE ORIGIN</small></span><i></i></div><div class="visual-caption"><span>●</span> Every interaction tells a story.</div></div></header>
      <div class="curriculum-heading"><div><span class="eyebrow">YOUR LEARNING PATH</span><h2>What you’ll learn</h2><p>Seven concepts. A stronger foundation.</p></div><div class="progress-summary"><span class="progress-label"></span><div class="progress-track"><div></div></div></div></div>
      <div class="learning-layout"><nav class="lesson-list" aria-label="Security lessons"></nav><section class="lesson-detail" aria-label="Selected lesson"></section></div>`;
    const list = container.querySelector('.lesson-list');
    const detail = container.querySelector('.lesson-detail');
    const updateProgress = () => {
      container.querySelector('.progress-label').textContent = `${complete.size} of 7 completed`;
      container.querySelector('.progress-track div').style.width = `${complete.size / 7 * 100}%`;
      list.innerHTML = lessons.map((l, i) => `<button class="lesson-nav ${i === selected ? 'selected' : ''}" data-index="${i}" ${i === selected ? 'aria-current="step"' : ''}><span class="lesson-number ${complete.has(i) ? 'done' : ''}">${complete.has(i) ? '✓' : String(i+1).padStart(2,'0')}</span><span><b>${l.title}</b><small>${l.time} · ${i < 3 ? 'Foundations' : 'Browser security'}</small></span><span class="lesson-arrow">↗</span></button>`).join('');
      list.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { selected = Number(b.dataset.index); renderLesson(); }));
    };
    function renderLesson() {
      updateProgress();
      const l = lessons[selected];
      detail.innerHTML = `<div class="lesson-heading"><span class="eyebrow">LESSON ${String(selected+1).padStart(2,'0')} / 07 <span>· ${l.tag}</span></span><span class="lesson-glyph" aria-hidden="true">${l.icon}</span></div><h2>${l.title === 'CSRF' ? 'CSRF (Cross-Site Request Forgery)' : l.title}</h2><p class="lesson-summary">${l.summary}</p><p class="lesson-intro">${l.intro}</p><div class="concept-grid">${l.concepts.map(([title, text]) => `<div><h3>${title}</h3><p>${escape(text)}</p></div>`).join('')}</div>
        <div class="section-label"><span>↔</span><h3>Inside the HTTP exchange</h3><span class="demo-badge">INTERACTIVE EXAMPLE</span></div><p class="example-note">Caido-style inspection · illustrative lab responses · no network requests are sent</p><label class="scenario-control"><input type="checkbox" class="scenario-toggle"><span>${l.toggle}</span></label>
        <div class="http-workbench"><div class="http-pane"><div class="pane-title"><span><i class="request-dot"></i>Request <small>HTTP/1.1</small></span><button class="copy-btn" data-copy="request">Copy</button></div><pre class="request-code" tabindex="0"></pre></div><div class="http-pane"><div class="pane-title"><span><i class="response-dot"></i>Response <small class="response-status"></small></span><button class="copy-btn" data-copy="response">Copy</button></div><pre class="response-code" tabindex="0"></pre></div></div><div class="outcome" role="status"></div>
        <details class="annotations" open><summary>Read the exchange, line by line</summary><ol>${l.annotations.map(a => `<li>${escape(a)}</li>`).join('')}</ol></details><div class="practice-box"><span class="eyebrow">TRY IT IN CAIDO</span><h3>From explanation to investigation</h3><p>${escape(l.practice)}</p><a href="https://docs.caido.io/app/quickstart/replay" target="_blank" rel="noopener noreferrer">Open the Caido Replay guide ↗</a></div>
        <div class="knowledge-check"><span class="eyebrow">CHECK YOUR UNDERSTANDING</span><h3>${l.question}</h3><div class="quiz-options">${l.options.map((o,i) => `<button data-answer="${i}"><span>${String.fromCharCode(65+i)}</span>${o}</button>`).join('')}</div><p class="quiz-feedback" role="status"></p></div><div class="lesson-footer"><a href="${l.source[1]}" target="_blank" rel="noopener noreferrer">${l.source[0]} ↗</a><button class="primary-btn complete-btn">${complete.has(selected) ? 'Completed ✓' : 'Mark as complete'} <span>→</span></button></div><p class="save-status" role="status"></p>`;
      let changed = false;
      const requestText = () => {
        if (!changed) return l.request;
        if (selected === 0) return l.request.replace('\nCookie: session=demo-session', '');
        if (selected === 6) return l.request.replace('&csrf=demo-valid-token', '');
        return l.request;
      };
      const showExchange = () => {
        for (const [selector, value] of [['.request-code', requestText()], ['.response-code', changed ? l.alternate : l.response]]) {
          detail.querySelector(selector).innerHTML = value.split('\n').map((line, i) => `<span class="code-line"><span class="line-number" aria-hidden="true">${i+1}</span><span class="${i === 0 ? 'code-first' : line.includes(': ') ? 'code-header' : ''}">${escape(line) || ' '}</span></span>`).join('');
        }
        detail.querySelector('.response-status').textContent = (changed ? l.alternate : l.response).split('\n')[0].replace('HTTP/1.1 ', '');
        detail.querySelector('.outcome').textContent = changed ? l.changed : l.outcome;
      };
      showExchange();
      detail.querySelector('.scenario-toggle').addEventListener('change', e => { changed = e.target.checked; showExchange(); });
      detail.querySelectorAll('.copy-btn').forEach(b => b.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(b.dataset.copy === 'request' ? requestText() : changed ? l.alternate : l.response); b.textContent = 'Copied ✓'; } catch { b.textContent = 'Select text to copy'; }
      }));
      detail.querySelectorAll('[data-answer]').forEach(b => b.addEventListener('click', () => {
        detail.querySelectorAll('[data-answer]').forEach(o => { o.classList.remove('correct','incorrect'); o.setAttribute('aria-pressed', String(o === b)); });
        const correct = Number(b.dataset.answer) === l.answer;
        b.classList.add(correct ? 'correct' : 'incorrect');
        detail.querySelector('.quiz-feedback').textContent = `${correct ? 'Correct.' : 'Try again.'} ${l.explanation}`;
      }));
      detail.querySelector('.complete-btn').addEventListener('click', () => {
        complete.add(selected);
        let saved = true;
        try { localStorage.setItem('netone-web-progress', JSON.stringify([...complete])); } catch { saved = false; }
        if (selected < lessons.length-1) selected++;
        renderLesson();
        if (!saved) detail.querySelector('.save-status').textContent = 'Progress is available for this visit. Browser storage is unavailable.';
        detail.scrollIntoView({behavior:'smooth', block:'start'});
      });
    }
    container.querySelector('.start-course').addEventListener('click', () => detail.scrollIntoView({behavior:'smooth',block:'start'}));
    renderLesson();
  }
};
