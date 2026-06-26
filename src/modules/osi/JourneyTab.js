import { layers } from './data.js';

/**
 * JourneyTab — two-column data journey: browser → google.com → back.
 * Left column = sender (encapsulation, headers added going 7→1).
 * Right column = receiver (decapsulation, headers stripped going 1→7).
 * Each row colored by its layer.
 */
export function JourneyTab(panel) {
  const journey = document.createElement('div');
  journey.className = 'journey';

  const sender = document.createElement('div');
  sender.className = 'journey-col';
  const senderHead = document.createElement('div');
  senderHead.className = 'journey-col-head';
  senderHead.textContent = 'Sender (you) — encapsulate ↓';
  sender.appendChild(senderHead);

  const arrow = document.createElement('div');
  arrow.className = 'journey-arrow';
  arrow.textContent = '⇄';

  const receiver = document.createElement('div');
  receiver.className = 'journey-col';
  const receiverHead = document.createElement('div');
  receiverHead.className = 'journey-col-head';
  receiverHead.textContent = 'Receiver (google.com) — decapsulate ↑';
  receiver.appendChild(receiverHead);

  // Sender: 7 → 1 (top to bottom)
  for (const layer of layers) {
    sender.appendChild(journeyRow(layer, 'add'));
  }
  // Receiver: 1 → 7 (so reverse order, top to bottom on the right)
  for (let i = layers.length - 1; i >= 0; i--) {
    receiver.appendChild(journeyRow(layers[i], 'strip'));
  }

  journey.appendChild(sender);
  journey.appendChild(arrow);
  journey.appendChild(receiver);
  panel.appendChild(journey);

  const callout = document.createElement('div');
  callout.className = 'callout';
  callout.innerHTML =
    '<strong>Encapsulation vs decapsulation</strong>' +
    'On the way down, each layer wraps the data from the layer above with its own header ' +
    '(a Segment becomes a Packet becomes a Frame becomes Bits). On the way up, the receiver ' +
    'peels each header off in reverse order, handing the payload to the layer above until the ' +
    'original message reaches the application.';
  panel.appendChild(callout);
}

function journeyRow(layer, mode) {
  const row = document.createElement('div');
  row.className = 'journey-row';
  row.style.setProperty('--layer-bg', `var(--layer-${layer.n}-bg)`);
  row.style.setProperty('--layer-fg', `var(--layer-${layer.n}-fg)`);

  const tag = document.createElement('div');
  tag.className = 'jr-layer';
  tag.textContent = `L${layer.n} · ${layer.name} · ${mode === 'add' ? '+ header' : '− header'}`;
  row.appendChild(tag);

  const pdu = document.createElement('div');
  pdu.className = 'jr-pdu';
  pdu.textContent = layer.pdu;
  row.appendChild(pdu);

  return row;
}
