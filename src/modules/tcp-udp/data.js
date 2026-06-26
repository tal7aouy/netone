/**
 * TCP/UDP module — all data, pure exports. No DOM here.
 * Covers the two Layer 4 (Transport) protocols: TCP and UDP.
 */

/** High-level protocol profiles for the comparison tab. */
export const protocols = [
  {
    key: 'tcp',
    name: 'TCP',
    full: 'Transmission Control Protocol',
    tagline: 'Reliable, ordered, connection-oriented',
    connection: 'Connection-oriented (3-way handshake)',
    reliability: 'Reliable — retransmits lost data',
    ordering: 'Ordered — packets arrive in sequence',
    speed: 'Slower (handshake + ACKs + retransmits)',
    overhead: 'Higher (20+ byte header, state tracking)',
    uses: ['HTTP', 'HTTPS', 'SSH', 'FTP', 'Email (SMTP/IMAP)'],
    color: 4,
    headerSize: '20–60 bytes (20 base + up to 40 bytes of options)',
    headerFields: [
      'Source Port (16 bits)',
      'Destination Port (16 bits)',
      'Sequence Number (32 bits)',
      'Acknowledgment Number (32 bits)',
      'Flags (9 bits: SYN, ACK, FIN, RST, PSH, URG, …)',
      'Window Size (16 bits)',
      'Checksum (16 bits)',
      'Urgent Pointer (16 bits)'
    ],
    funFact:
      'TCP was described in RFC 793 in 1981 and is still the backbone of the internet.',
    portRange: {
      wellKnown: '0–1023 (HTTP=80, HTTPS=443, SSH=22)',
      registered: '1024–49151 (app-registered with IANA)',
      dynamic: '49152–65535 (ephemeral client ports)'
    }
  },
  {
    key: 'udp',
    name: 'UDP',
    full: 'User Datagram Protocol',
    tagline: 'Fast, fire-and-forget, connectionless',
    connection: 'Connectionless (just send it)',
    reliability: 'Unreliable — no retransmit, no ACK',
    ordering: 'No order guarantee — packets may arrive out of order',
    speed: 'Faster (no handshake, no waiting)',
    overhead: 'Lower (8-byte header, no state)',
    uses: ['DNS', 'DHCP', 'Video streaming', 'Gaming', 'VoIP'],
    color: 4,
    headerSize: '8 bytes (fixed, no options)',
    headerFields: [
      'Source Port (16 bits)',
      'Destination Port (16 bits)',
      'Length (16 bits, header + payload)',
      'Checksum (16 bits, optional in IPv4)'
    ],
    funFact:
      'UDP is used by DNS, which handles more queries than any other protocol on earth.',
    portRange: {
      wellKnown: '0–1023 (DNS=53, DHCP=67/68, SNMP=161)',
      registered: '1024–49151 (app-registered with IANA)',
      dynamic: '49152–65535 (ephemeral client ports)'
    }
  }
];

/** Row-by-row comparison: Feature | TCP | UDP. */
export const comparison = [
  { feature: 'Connection',        tcp: 'Connection-oriented',                 udp: 'Connectionless' },
  { feature: 'Reliability',       tcp: 'Reliable (retransmits lost data)',    udp: 'Unreliable (no retransmit)' },
  { feature: 'Ordering',          tcp: 'Guaranteed in-order delivery',        udp: 'No order guarantee' },
  { feature: 'Speed',             tcp: 'Slower (handshake + ACKs)',           udp: 'Faster (fire-and-forget)' },
  { feature: 'Overhead',          tcp: 'Higher (20+ byte header + state)',    udp: 'Lower (8-byte header)' },
  { feature: 'Flow control',      tcp: 'Yes (sliding window)',                udp: 'No' },
  { feature: 'Congestion control',tcp: 'Yes (backs off under loss)',          udp: 'No' },
  { feature: 'Use cases',         tcp: 'HTTP, HTTPS, SSH, FTP, email',        udp: 'DNS, DHCP, streaming, gaming, VoIP' }
];

export const analogy =
  'TCP is like a registered letter — tracked, signed, guaranteed. ' +
  'UDP is like a radio broadcast — sent out fast, if you miss it, it\'s gone.';

/** 3-way handshake (connection setup). */
export const handshake = [
  {
    step: 1, flag: 'SYN',
    from: 'Client', to: 'Server',
    msg: 'I want to talk, my sequence number is X.',
    detail: 'Client picks an initial sequence number (ISN) and sends a SYN. State: SYN_SENT.',
    wiresharkFilter: 'tcp.flags.syn==1 && tcp.flags.ack==0',
    seqDetail: 'Client ISN = X (e.g. 1000). ACK field is 0 — nothing to acknowledge yet.'
  },
  {
    step: 2, flag: 'SYN-ACK',
    from: 'Server', to: 'Client',
    msg: 'OK, my sequence number is Y, and I acknowledge your X.',
    detail: 'Server replies with its own ISN plus an ACK of the client\'s. State: SYN_RECEIVED.',
    wiresharkFilter: 'tcp.flags.syn==1 && tcp.flags.ack==1',
    seqDetail: 'Server ISN = Y (e.g. 7000). ACK = X+1 (1001) — "I got your SYN, send from 1001".'
  },
  {
    step: 3, flag: 'ACK',
    from: 'Client', to: 'Server',
    msg: 'Got it, I acknowledge Y. Let\'s talk.',
    detail: 'Client ACKs the server\'s ISN. Both sides are now ESTABLISHED — data can flow.',
    wiresharkFilter: 'tcp.flags.syn==0 && tcp.flags.ack==1 && tcp.len==0',
    seqDetail: 'SEQ = X+1 (1001), ACK = Y+1 (7001). No data yet — pure ACK, len=0.'
  }
];

/** 4-way teardown (connection close). */
export const teardown = [
  {
    step: 1, flag: 'FIN',
    from: 'Client', to: 'Server',
    msg: 'I\'m done sending data.',
    detail: 'Active close. Client enters FIN_WAIT_1.',
    wiresharkFilter: 'tcp.flags.fin==1 && tcp.flags.ack==0'
  },
  {
    step: 2, flag: 'ACK',
    from: 'Server', to: 'Client',
    msg: 'Got it — I acknowledge your FIN.',
    detail: 'Server ACKs. Client moves to FIN_WAIT_2; server to CLOSE_WAIT.',
    wiresharkFilter: 'tcp.flags.ack==1 && tcp.flags.fin==0'
  },
  {
    step: 3, flag: 'FIN',
    from: 'Server', to: 'Client',
    msg: 'I\'m done too.',
    detail: 'Server sends its own FIN, enters LAST_ACK.',
    wiresharkFilter: 'tcp.flags.fin==1 && tcp.flags.ack==0'
  },
  {
    step: 4, flag: 'ACK',
    from: 'Client', to: 'Server',
    msg: 'Bye — final ACK.',
    detail: 'Client ACKs and enters TIME_WAIT (waits 2MSL) before CLOSED. Server goes CLOSED.',
    wiresharkFilter: 'tcp.flags.ack==1 && tcp.flags.fin==0'
  }
];

export const handshakeCallout =
  'The 3-way handshake ensures both sides are ready before data flows. ' +
  'Without it, data could be lost at connection start — one side might not be listening yet.';

/** TCP connection states, in rough lifecycle order. */
export const states = [
  {
    name: 'LISTEN', who: 'Server',
    desc: 'Server is waiting for incoming connection requests.',
    wiresharkHint: 'No packets for this endpoint yet — it\'s just a listening socket waiting for a SYN.',
    debuggingTip: 'ss -ltn   # or: netstat -ltn   (lists sockets in LISTEN)'
  },
  {
    name: 'SYN_SENT', who: 'Client',
    desc: 'Client sent SYN, waiting for SYN-ACK from the server.',
    wiresharkHint: 'You see a single SYN going out and no reply — or a reply that never arrives.',
    debuggingTip: 'ss -t state syn-sent   # or: netstat -an | grep SYN_SENT'
  },
  {
    name: 'SYN_RECEIVED', who: 'Server',
    desc: 'Server received SYN and sent SYN-ACK, awaiting final ACK.',
    wiresharkHint: 'Server sent SYN-ACK but the third ACK from the client is missing (possible SYN flood).',
    debuggingTip: 'ss -t state syn-recv   # a flood of these = SYN flood attack'
  },
  {
    name: 'ESTABLISHED', who: 'Both',
    desc: 'Connection is live — data is flowing in both directions.',
    wiresharkHint: 'Steady stream of PSH/ACK packets carrying application data in both directions.',
    debuggingTip: 'netstat -an | grep ESTABLISHED   # or: ss -t state established'
  },
  {
    name: 'FIN_WAIT_1', who: 'Active closer',
    desc: 'Sent our FIN, waiting for an ACK from the other side.',
    wiresharkHint: 'A FIN packet was just sent; waiting for the matching ACK.',
    debuggingTip: 'ss -t state fin-wait-1   # stuck here = peer not ACKing the FIN'
  },
  {
    name: 'FIN_WAIT_2', who: 'Active closer',
    desc: 'Got ACK for our FIN, now waiting for the other side\'s FIN.',
    wiresharkHint: 'We got the ACK; now waiting silently for the peer\'s FIN.',
    debuggingTip: 'ss -t state fin-wait-2   # stuck here = peer never closes (app hasn\'t called close())'
  },
  {
    name: 'CLOSE_WAIT', who: 'Passive closer',
    desc: 'Received their FIN, sent ACK, waiting for app to close.',
    wiresharkHint: 'We ACKed their FIN but our app hasn\'t sent its own FIN yet.',
    debuggingTip: 'netstat -an | grep CLOSE_WAIT   # many of these = app not closing sockets (fd leak)'
  },
  {
    name: 'LAST_ACK', who: 'Passive closer',
    desc: 'Sent our own FIN, waiting for the final ACK before closing.',
    wiresharkHint: 'Our FIN is out; we wait for one last ACK before going CLOSED.',
    debuggingTip: 'ss -t state last-ack   # stuck here = final ACK lost in transit'
  },
  {
    name: 'TIME_WAIT', who: 'Active closer',
    desc: 'Waiting 2x MSL before truly closing — lets old/stale packets die.',
    wiresharkHint: 'No new packets — socket just sits for 60–120s before the OS reclaims it.',
    debuggingTip: 'ss -t state time-wait   # many = churn; tune net.ipv4.tcp_tw_reuse'
  },
  {
    name: 'CLOSED', who: 'Both',
    desc: 'No connection exists. The endpoint is fully shut down.',
    wiresharkHint: 'Nothing — the socket is gone from the table entirely.',
    debuggingTip: 'No entry in ss/netstat output — the connection is fully torn down.'
  }
];

export const timeWaitMnemonic =
  'TIME_WAIT is the "let old packets die" phase — 2x Maximum Segment Lifetime (usually 60–120s). ' +
  'Annoying for servers (it ties up a socket) but it prevents stale packets from a reused connection ' +
  'corrupting a brand-new one that reuses the same port pair.';

/** Cheat sheet rows: Property | TCP | UDP. */
export const cheatSheet = [
  { property: 'Full name',          tcp: 'Transmission Control Protocol', udp: 'User Datagram Protocol' },
  { property: 'Layer',              tcp: '4 (Transport)',                 udp: '4 (Transport)' },
  { property: 'Connection',         tcp: 'Connection-oriented',           udp: 'Connectionless' },
  { property: 'Header size',        tcp: '20–60 bytes',                   udp: '8 bytes' },
  { property: 'Reliability',        tcp: 'Reliable (ACK + retransmit)',   udp: 'Best-effort (no ACK)' },
  { property: 'Ordering',           tcp: 'In-order delivery',             udp: 'No guarantee' },
  { property: 'Flow control',       tcp: 'Yes (sliding window)',          udp: 'No' },
  { property: 'Congestion control', tcp: 'Yes (slow start, AIMD)',        udp: 'No' },
  { property: 'Handshake',          tcp: '3-way (SYN/SYN-ACK/ACK)',       udp: 'None' },
  { property: 'Broadcast/multicast',tcp: 'No (point-to-point only)',      udp: 'Yes' },
  { property: 'Typical use',        tcp: 'Web, email, file transfer',     udp: 'DNS, DHCP, streaming, VoIP' }
];

export const cheatQuote =
  'TCP is a phone call — you establish a connection, talk in order, and confirm the other person heard you. ' +
  'UDP is a megaphone — you shout and hope for the best.';

/** TCP congestion control algorithms. */
export const congestionControl = [
  { name: 'Slow Start', what: 'Starts with cwnd=1, doubles every RTT until threshold', why: 'Avoids overwhelming network at start' },
  { name: 'Congestion Avoidance', what: 'After threshold, cwnd grows linearly (+1 per RTT)', why: 'Gentle probing for available bandwidth' },
  { name: 'Fast Retransmit', what: 'On 3 duplicate ACKs, retransmit without waiting for timeout', why: 'Faster recovery than waiting for RTO' },
  { name: 'Fast Recovery', what: 'After fast retransmit, set cwnd to half and continue', why: 'Recover speed without going back to slow start' },
  { name: 'CUBIC', what: 'Default in Linux since 2.6.19. Uses cubic function for window growth', why: 'Better for high-bandwidth, high-latency links' },
  { name: 'BBR', what: 'Google\'s algorithm. Measures bottleneck bandwidth and RTT directly', why: 'Doesn\'t rely on packet loss as congestion signal' }
];

/** Practical tips for working with TCP/UDP in the real world. */
export const tips = [
  {
    icon: '💡',
    title: 'See live TCP connections',
    text: 'Use <code>ss -t</code> (faster than netstat) to list every TCP socket and its state. Add <code>-p</code> to see the owning process.'
  },
  {
    icon: '🔍',
    title: 'Filter the handshake in Wireshark',
    text: 'To see only the 3-way handshake, use <code>tcp.flags.syn==1</code> — pair with <code>&& tcp.flags.ack==0</code> for pure SYN, <code>==1</code> for SYN-ACK.'
  },
  {
    icon: '🚪',
    title: 'Spot half-open connections',
    text: 'A flood of <code>SYN_RECEIVED</code> states with no <code>ESTABLISHED</code> is the signature of a SYN flood. Check with <code>ss -t state syn-recv | wc -l</code>.'
  },
  {
    icon: '🧯',
    title: 'Diagnose CLOSE_WAIT piles',
    text: 'Many <code>CLOSE_WAIT</code> sockets mean your app received a FIN but never called <code>close()</code> — a file-descriptor leak. <code>netstat -an | grep CLOSE_WAIT</code>.'
  },
  {
    icon: '⏳',
    title: 'Tune TIME_WAIT churn',
    text: 'High-traffic servers accumulate TIME_WAIT. Enable <code>net.ipv4.tcp_tw_reuse=1</code> to safely recycle those sockets for outgoing connections.'
  },
  {
    icon: '🎯',
    title: 'Scan ports with nmap',
    text: '<code>nmap -sS target</code> does a SYN ("stealth") scan — it never completes the handshake, so it\'s quieter than <code>-sT</code> (full connect).'
  },
  {
    icon: '⚖️',
    title: 'Choose TCP vs UDP',
    text: 'Need every byte intact and in order (web, email, files)? TCP. Need low latency and can tolerate loss (VoIP, gaming, DNS)? UDP. Don\'t reinvent reliability on top of UDP unless you must.'
  },
  {
    icon: '📈',
    title: 'Tune the congestion window',
    text: 'Linux defaults to CUBIC. Try BBR on lossy/wifi links: <code>sysctl net.ipv4.tcp_congestion_control=bbr</code>. Measure before and after with <code>iperf3</code>.'
  },
  {
    icon: '🐢',
    title: 'Debug a slow TCP transfer',
    text: 'In Wireshark, filter <code>tcp.analysis.retransmission</code> to see retransmits, and <code>tcp.analysis.ack_rtt</code> to graph RTT. Lots of retransmits = congestion or packet loss.'
  },
  {
    icon: '🔌',
    title: 'Find which process owns a port',
    text: '<code>ss -tlnp</code> shows listening TCP sockets with PID/process. On macOS use <code>lsof -iTCP -sTCP:LISTEN</code>.'
  },
  {
    icon: '🛰️',
    title: 'Watch a DNS query over UDP',
    text: 'Filter <code>udp.port==53</code> in Wireshark. You\'ll see one request, one reply — no handshake, no ACK. That\'s UDP in its purest form.'
  },
  {
    icon: '🧪',
    title: 'Test throughput yourself',
    text: 'Run <code>iperf3 -s</code> on one host and <code>iperf3 -c serverIP</code> on another. Add <code>-u</code> for UDP and <code>-b 100M</code> to set the target bitrate.'
  }
];
