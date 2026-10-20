import { records, simulate } from './simulation.js';
export function LookupLab(panel) {
  panel.innerHTML = `<div class="dns-lab"><div class="dns-lab-intro"><div><span class="eyebrow">EXPERIMENT · OBSERVE · UNDERSTAND</span><h2>Follow a DNS lookup</h2><p>Change the query, step through the journey, and see why the answer changes.</p></div><span class="demo-badge">LOCAL SIMULATION</span></div>
    <form class="dns-controls"><label>Lab hostname<select name="hostname"><option value="www.example.com">www.example.com</option><option value="api.example.com">api.example.com</option><option value="mail.example.com">mail.example.com</option></select></label><label>Record type<select name="record">${Object.keys(records).map(t=>`<option>${t}</option>`).join('')}</select></label><label>Scenario<select name="scenario"><option value="cold">Cold resolver cache</option><option value="warm">Cached answer</option><option value="missing">Name does not exist</option><option value="dnssec">DNSSEC validation fails</option></select></label><button class="primary-btn" type="submit">Run lookup ↗</button></form>
    <p class="example-note">Synthetic zone and documentation addresses. No DNS traffic is sent. Every listed hostname has the selected record in this teaching model; real zones vary.</p>
    <div class="dns-cache" hidden><label>Time since the answer was cached <output>0 seconds</output><input aria-label="Seconds since caching" type="range" min="0" max="360" step="30" value="0"></label><p>Move beyond the 300-second TTL to trigger a new resolution. Expiry prompts a lookup when the next request arrives.</p></div>
    <div class="dns-results"><div class="dns-status" role="status"></div><div class="dns-journey" aria-label="Resolution steps"></div><div class="dns-step-detail" role="status"></div><div class="dns-step-controls"><button type="button" class="dns-prev">← Previous</button><span class="dns-step-count"></span><button type="button" class="dns-next">Next step →</button></div></div>
    <div class="section-label"><h3>Query & answer inspector</h3><span class="demo-badge">DIG-STYLE VIEW</span></div><div class="http-workbench dns-inspector"><div class="http-pane"><div class="pane-title">Query <button type="button" class="copy-btn dns-copy">Copy command</button></div><pre class="dns-query" tabindex="0"></pre></div><div class="http-pane"><div class="pane-title">Resolver response</div><pre class="dns-response" tabindex="0"></pre></div></div><p class="outcome dns-explanation"></p>
    <details class="annotations"><summary>How to read these fields</summary><ol><li>QUERY identifies the operation; the question contains a name, class IN (Internet), and record type.</li><li>qr means response, rd means recursion desired, and ra means recursion available. AA would mean authoritative answer; this inspector shows the recursive resolver’s reply.</li><li>TTL is measured in seconds. It limits cache reuse, rather than scheduling a global update. Different resolvers can hold different answers.</li><li>DNS normally uses a binary wire format. This is a readable dig-style representation, not an HTTP response or a complete packet dump.</li></ol></details>
    <div class="practice-box"><span class="eyebrow">CONNECT IT TO WEB SECURITY</span><h3>Where does Caido fit?</h3><p>Ordinary UDP/TCP DNS is not an HTTP request, so use dig or a packet capture to inspect it. Caido focuses on the HTTP exchange that follows. With an explicit HTTP proxy, the proxy may resolve the target rather than the browser. DoH carries binary DNS messages over HTTPS with application/dns-message; inspecting it requires that the traffic actually passes through your proxy.</p><p>Try <code>dig example.com A</code>, <code>dig example.com MX</code>, and <code>dig +trace example.com</code> locally to compare real results with this model.</p><a href="https://www.rfc-editor.org/rfc/rfc1034.html" target="_blank" rel="noopener noreferrer">RFC 1034 · DNS concepts ↗</a></div>
    <div class="knowledge-check"><span class="eyebrow">CHECK YOUR UNDERSTANDING</span><h3>A resolver has a cached answer with 120 seconds left. Does it need to ask the root again?</h3><div class="quiz-options"><button type="button" data-answer="wrong">Yes, every lookup starts at the root</button><button type="button" data-answer="right">No, it can reuse that cached answer</button></div><p class="quiz-feedback" role="status"></p></div></div>`;
  const form = panel.querySelector('form');
  const slider = panel.querySelector('input[type=range]');
  let model, step = 0;
  const renderStep = () => {
    panel.querySelector('.dns-journey').innerHTML = model.steps.map((s,i)=>`<button type="button" data-step="${i}" class="dns-hop ${i===step ? 'active' : ''}" ${i===step ? 'aria-current="step"' : ''}><span>${i+1}</span><b>${s.actor}</b></button>`).join('');
    panel.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{step=Number(b.dataset.step);renderStep();}));
    const current = model.steps[step];
    const box = panel.querySelector('.dns-step-detail');
    box.replaceChildren();
    const heading = document.createElement('h3'); heading.textContent=current.title;
    const text=document.createElement('p');text.textContent=current.description;box.append(heading,text);
    panel.querySelector('.dns-step-count').textContent=`Step ${step+1} of ${model.steps.length}`;
    panel.querySelector('.dns-prev').disabled=step===0;
    panel.querySelector('.dns-next').disabled=step===model.steps.length-1;
  };
  const run = () => {
    const name=form.elements.hostname.value,type=form.elements.record.value,scenario=form.elements.scenario.value;
    model=simulate({name,type,scenario,elapsed:Number(slider.value)});step=0;
    panel.querySelector('.dns-cache').hidden=scenario!=='warm';
    panel.querySelector('output').textContent=`${slider.value} seconds`;
    panel.querySelector('.dns-status').textContent=`${model.status} · ${model.cached ? `Cache hit · ${model.remaining}s remaining` : scenario==='warm' ? 'Cache expired · fresh lookup' : 'Fresh lookup'} · ${type}`;
    panel.querySelector('.dns-query').textContent=`$ dig ${name} ${type}\n\n;; QUERY (decoded)\n;; opcode: QUERY; flags: rd\n;; QUESTION SECTION:\n;${model.question}`;
    panel.querySelector('.dns-response').textContent=model.response;
    panel.querySelector('.dns-explanation').textContent=model.explanation;
    panel.querySelector('.dns-copy').textContent='Copy command';renderStep();
  };
  form.addEventListener('submit',e=>{e.preventDefault();run();});
  form.addEventListener('change',run);slider.addEventListener('input',run);
  panel.querySelector('.dns-prev').addEventListener('click',()=>{if(step>0){step--;renderStep();}});
  panel.querySelector('.dns-next').addEventListener('click',()=>{if(step<model.steps.length-1){step++;renderStep();}});
  panel.querySelector('.dns-copy').addEventListener('click',async e=>{try {await navigator.clipboard.writeText(`dig ${form.elements.hostname.value} ${form.elements.record.value}`);e.target.textContent='Copied ✓';}catch{e.target.textContent='Select command to copy';}});
  panel.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{
    panel.querySelectorAll('[data-answer]').forEach(o=>{o.classList.remove('correct','incorrect');o.setAttribute('aria-pressed',String(o===b));});
    const right=b.dataset.answer==='right';b.classList.add(right?'correct':'incorrect');panel.querySelector('.quiz-feedback').textContent=right?'Correct. A valid cached answer avoids upstream work. Even on a cache miss, cached delegations can let the resolver skip the root.':'Try again. Resolvers reuse unexpired cached answers; not every query traverses the whole hierarchy.';
  }));run();
}
