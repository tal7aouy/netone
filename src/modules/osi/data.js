/**
 * OSI module — all data, pure exports. No DOM here.
 * Layer 7 is first (top of the stack), Layer 1 last (bottom).
 */

export const layers = [
  {
    n: 7, name: 'Application', badge: 'Where users live',
    pdu: 'Message / data',
    protocols: 'HTTP, HTTPS, DNS, FTP, SMTP, SSH, WebSocket',
    job: 'Provides network services directly to end-user apps. Defines what the data means.',
    mnemonic: 'Think: your browser, email client, Slack — anything a user touches.',
    hacks: ['SQL injection', 'XSS', 'DNS spoofing', 'Directory traversal', 'CSRF', 'Cookie theft'],
    realWorld: 'When you open Chrome and type google.com, Chrome is the application. HTTP tells the server "GET me the homepage."',
    funFact: 'HTTP status code 418 "I\'m a teapot" started as an April Fools\' joke in RFC 2324 — and real servers still implement it.',
    commonPorts: 'HTTP:80, HTTPS:443, DNS:53, SSH:22, SMTP:25, FTP:21',
    devices: 'Browser, email client, web server, DNS resolver',
    deepDive: 'Layer 7 is the only layer a user ever "sees." It defines the semantics of the data — what a request means, not how it gets there. Every API call, every web form, and every email lives here. Security at this layer is about validating what the user is asking to do, not how the bytes travel.'
  },
  {
    n: 6, name: 'Presentation', badge: 'Translator',
    pdu: 'Data',
    protocols: 'TLS/SSL, JPEG, MP4, ASCII, JSON, gzip',
    job: 'Translates, encrypts/decrypts, and compresses data between app and session layer.',
    mnemonic: 'Think: TLS handshake, HTTPS encryption, JSON encoding.',
    hacks: ['SSL stripping', 'Padding oracle attack', 'Weak cipher downgrade'],
    realWorld: 'When a site loads with a padlock icon, TLS is encrypting your data here. When a photo loads as JPEG instead of raw, that\'s compression at Layer 6.',
    funFact: 'TLS 1.3 killed off every cipher that was ever broken — it\'s so strict that older devices literally cannot connect to modern servers.',
    commonPorts: 'HTTPS/TLS:443, FTPS:990, IMAPS:993, POP3S:995',
    devices: 'TLS terminator, encryption gateway, media codec, load balancer (SSL offload)',
    deepDive: 'This layer is the "shape shifter" — it turns data into a form both sides can understand regardless of their internal representation. Encryption, compression, and character encoding all live here. It\'s why a Japanese browser can read an English page: both agree on UTF-8 at Layer 6.'
  },
  {
    n: 5, name: 'Session', badge: 'Conversation manager',
    pdu: 'Data',
    protocols: 'NetBIOS, RPC, SMB (session), OAuth tokens',
    job: 'Opens, maintains, and closes communication sessions between apps.',
    mnemonic: 'Think: login sessions, video call state, "are we still talking?"',
    hacks: ['Session hijacking', 'Pass-the-hash', 'Replay attack'],
    realWorld: 'When you log into a website and stay logged in across page reloads, a session token is keeping that conversation alive at Layer 5.',
    funFact: 'A Zoom call keeps a session alive for hours even if no one speaks — the session layer handles the "we\'re still connected" heartbeat.',
    commonPorts: 'RPC:135, SMB:445, NetBIOS:139, SMB over QUIC:443',
    devices: 'Session manager, OAuth provider, SIP server, video conferencing server',
    deepDive: 'Sessions are the "state" of a conversation in an otherwise stateless network. This layer handles checkpoints, keepalives, and graceful teardown. Without it, every request would feel like a brand-new stranger knocking on the door — no memory of the last exchange.'
  },
  {
    n: 4, name: 'Transport', badge: 'Reliable delivery',
    pdu: 'Segment (TCP) / Datagram (UDP)',
    protocols: 'TCP, UDP',
    job: 'End-to-end delivery with error checking. TCP = reliable + ordered. UDP = fast, no guarantee.',
    mnemonic: 'Think: TCP 3-way handshake (SYN → SYN-ACK → ACK), port numbers.',
    hacks: ['SYN flood (DoS)', 'Port scanning', 'TCP session hijacking', 'UDP flood'],
    realWorld: 'Loading a webpage uses TCP (every byte must arrive in order). A live video call uses UDP — a dropped frame is better than a frozen video.',
    funFact: 'TCP was designed in the 1970s and still carries most of the internet — QUIC (HTTP/3) is essentially TCP rebuilt on UDP to fix its aging quirks.',
    commonPorts: 'TCP:80, TCP:443, TCP:22, TCP:25, UDP:53, UDP:123 (NTP)',
    devices: 'Firewall (port-based), load balancer (L4), TCP optimizer',
    deepDive: 'This is where reliability is born. TCP numbers every byte, acknowledges receipt, retransmits losses, and backs off when congested — it\'s a full conversation about the conversation. UDP skips all that for raw speed, which is why games, DNS, and streaming love it.'
  },
  {
    n: 3, name: 'Network', badge: 'Routing & addressing',
    pdu: 'Packet',
    protocols: 'IP (v4/v6), ICMP, OSPF, BGP',
    job: 'Logical addressing (IP) and routing — getting packets from source to destination across networks.',
    mnemonic: 'Think: IP addresses, routers, traceroute, ping.',
    hacks: ['IP spoofing', 'ICMP flood', 'BGP hijacking', 'Smurf attack'],
    realWorld: 'When you ping 8.8.8.8 and get a reply, ICMP packets are hopping across routers worldwide to reach Google and back.',
    funFact: 'There are only ~4 billion IPv4 addresses — we ran out in 2011. IPv6 has 340 undecillion addresses, more than grains of sand on Earth.',
    commonPorts: 'N/A (ports are Layer 4) — protocols: ICMP, OSPF:89, BGP:179, EIGRP:88',
    devices: 'Router, L3 switch, firewall (routing rules), IPSec VPN gateway',
    deepDive: 'The network layer is the internet\'s postal system — it stamps each packet with a logical address (IP) and lets routers decide the next hop. It\'s connectionless: each packet finds its own way, and they may arrive out of order (TCP at Layer 4 fixes that). This is also where the biggest internet outages happen, via BGP.'
  },
  {
    n: 2, name: 'Data Link', badge: 'Node-to-node delivery',
    pdu: 'Frame',
    protocols: 'Ethernet, Wi-Fi (802.11), ARP, MAC',
    job: 'Hardware addressing (MAC), framing, and error detection on a single link.',
    mnemonic: 'Think: Ethernet frames, switches, MAC addresses, your NIC card.',
    hacks: ['ARP spoofing / poisoning', 'MAC flooding', 'VLAN hopping'],
    realWorld: 'When your laptop joins Wi-Fi, it gets a MAC address on the local network. The switch uses it to send frames only to your port, not everyone\'s.',
    funFact: 'MAC addresses were meant to be permanent and unique — but modern OSes randomize them on every Wi-Fi connect to protect your privacy.',
    commonPorts: 'N/A — uses MAC addresses; protocols: ARP, STP, 802.1Q (VLAN)',
    devices: 'Switch, bridge, NIC (network interface card), wireless access point',
    deepDive: 'Layer 2 is local — it only cares about the next hop on the same physical link. It wraps packets in frames, slaps on a MAC address, and uses ARP to ask "who has this IP?" Switches learn MACs and build a map of the network. This is also where VLANs segment broadcast domains.'
  },
  {
    n: 1, name: 'Physical', badge: 'Bits on a wire',
    pdu: 'Bit',
    protocols: 'Ethernet cables, fiber optic, Wi-Fi radio, USB',
    job: 'Raw transmission of bits over a physical medium — voltage, light pulses, radio waves.',
    mnemonic: 'Think: cables, Wi-Fi signals, network adapters, hubs.',
    hacks: ['Cable tapping / wiretapping', 'RF jamming', 'Physical access attack'],
    realWorld: 'When you plug an Ethernet cable into your router, electrical voltage pulses carry the 1s and 0s. Wi-Fi does the same with radio waves through the air.',
    funFact: 'A single undersea fiber optic cable can carry over 100 terabits per second — enough for 5 million HD video streams at once.',
    commonPorts: 'N/A — physical media; standards: 1000BASE-T, 10GBASE-SR, 802.11ax (Wi-Fi 6)',
    devices: 'Hub, cable, fiber, NIC transceiver, repeater, wireless antenna',
    deepDive: 'This is the only layer that physically exists. Everything above is logical abstraction; here it\'s electrons, photons, or radio waves. The choice of medium dictates speed, distance, and security — fiber is nearly impossible to tap silently, while copper leaks electromagnetic signals you can sniff with the right gear.'
  }
];

export const attacks = [
  {
    layer: 7, name: 'SQL Injection',
    how: 'Attacker inserts SQL code into a form field. The server executes it against the database.',
    impact: 'Full database dump, data deletion, admin access.',
    defend: 'Parameterized queries, input validation, WAF.',
    severity: 'Critical',
    realExample: 'In 2019, a SQL injection in a Citrix portal exposed 300,000+ records. The classic case: the 2008 Heartland Payment Systems breach — 130M card numbers stolen via SQLi.',
    detectionTip: 'Watch for SQL keywords (UNION, OR 1=1, --) in form inputs and WAF logs; unexpected DB query latency spikes.'
  },
  {
    layer: 7, name: 'DNS Spoofing',
    how: "Attacker poisons DNS cache with fake records. Your browser resolves bank.com to the attacker's IP.",
    impact: 'Traffic redirected to fake sites → credential theft.',
    defend: 'DNSSEC, DNS over HTTPS (DoH).',
    severity: 'High',
    realExample: 'In 2013, the New York Times and Twitter were knocked offline when the Syrian Electronic Army poisoned the registrar\'s DNS records for twitter.com and nytimes.com.',
    detectionTip: 'Compare resolved IPs against known-good records; alert on DNS responses with abnormally short TTLs or unexpected ASNs.'
  },
  {
    layer: 6, name: 'SSL Stripping',
    how: "Man-in-the-middle intercepts HTTPS and downgrades to HTTP before forwarding to the server.",
    impact: 'All traffic is cleartext — passwords, cookies visible.',
    defend: 'HSTS headers, certificate pinning.',
    severity: 'High',
    realExample: 'Moxie Marlinspike demonstrated SSL stripping live at DefCon 2009, stealing credentials from attendees browsing on the open conference Wi-Fi.',
    detectionTip: 'Alert on HTTP login pages that should be HTTPS; monitor for 301/302 redirects that drop the scheme from https to http.'
  },
  {
    layer: 5, name: 'Session Hijacking',
    how: 'Attacker steals a valid session token via XSS or sniffing, then impersonates the user.',
    impact: 'Full account takeover without knowing the password.',
    defend: 'HttpOnly/Secure cookies, short session TTLs, re-auth on sensitive actions.',
    severity: 'Critical',
    realExample: 'The 2017 "Fireball" malware hijacked 250M browser sessions worldwide, letting attackers remotely control victims\' browsers and steal tokens.',
    detectionTip: 'Flag session tokens used from a new geolocation or user-agent mid-session; watch for rapid token reuse across IPs.'
  },
  {
    layer: 4, name: 'SYN Flood (DoS)',
    how: 'Attacker sends thousands of TCP SYN packets but never completes the handshake. Server fills its half-open connection table.',
    impact: 'Server becomes unresponsive — classic denial of service.',
    defend: 'SYN cookies, rate limiting, firewall rules.',
    severity: 'High',
    realExample: 'In 2016, the Mirai botnet used SYN floods alongside other vectors to take down Dyn DNS, crippling Twitter, Netflix, and Reddit for hours.',
    detectionTip: 'A surge of SYN packets without matching ACKs; SYN_RECV state count climbing abnormally on the server.'
  },
  {
    layer: 4, name: 'Port Scanning',
    how: 'Attacker probes every port to discover which services are listening.',
    impact: 'Reconnaissance — reveals attack surface before exploitation.',
    defend: 'Firewall rules, IDS/IPS, close unused ports.',
    severity: 'Medium',
    realExample: 'Every major breach starts here — the 2017 Equifax attackers used nmap-style scanning to find the vulnerable Apache Struts endpoint on port 443.',
    detectionTip: 'Many connection attempts to sequential ports from one source; SYN packets with no follow-up across a port range.'
  },
  {
    layer: 3, name: 'IP Spoofing',
    how: "Attacker forges the source IP in packets to impersonate another host or hide identity.",
    impact: 'Bypass IP-based ACLs, amplify DDoS attacks, fake traffic origin.',
    defend: 'Ingress/egress filtering (BCP38), IPsec.',
    severity: 'High',
    realExample: 'The 2013 Spamhaus DDoS (300 Gbps) used DNS amplification with spoofed source IPs — the largest attack of its kind at the time.',
    detectionTip: 'Packets arriving on an interface with a source IP that should live on a different interface (uRPF check); asymmetric routing alerts.'
  },
  {
    layer: 3, name: 'BGP Hijacking',
    how: "Attacker announces ownership of IP ranges they don't own via BGP. Routers globally reroute traffic.",
    impact: 'Traffic for major services redirected globally — has happened to Amazon and Google.',
    defend: 'RPKI (Route Origin Validation), BGP monitoring.',
    severity: 'Critical',
    realExample: 'In 2008, Pakistan Telecom accidentally hijacked YouTube\'s BGP route, taking YouTube offline globally for 2 hours.',
    detectionTip: 'Monitor for a new AS announcing a prefix it has never advertised before; sudden MOAS (Multiple Origin AS) alerts.'
  },
  {
    layer: 2, name: 'ARP Spoofing',
    how: "Attacker broadcasts fake ARP replies, mapping their MAC to the gateway's IP. All LAN traffic flows through them.",
    impact: 'Full man-in-the-middle on the local network.',
    defend: 'Dynamic ARP Inspection (DAI), static ARP entries, 802.1X.',
    severity: 'High',
    realExample: 'Tools like Ettercap and Cain & Abel made ARP spoofing trivial on any open Wi-Fi — hotel and cafe networks were classic hunting grounds.',
    detectionTip: 'The gateway IP suddenly maps to two different MACs; unexplained ARP replies with your IP but a stranger\'s MAC.'
  },
  {
    layer: 1, name: 'Wiretapping / Cable tap',
    how: 'Physical access to a network cable allows passive sniffing of all traffic on that segment.',
    impact: 'Full packet capture without leaving any trace on systems.',
    defend: 'Fiber optic (harder to tap), physical security, full encryption.',
    severity: 'Medium',
    realExample: 'The NSA\'s "TAO" catalog (leaked by Snowden) included devices that clip onto Ethernet cables to silently exfiltrate traffic at the physical layer.',
    detectionTip: 'Unexpected cable taps or splitters in patch panels; link flapping or CRC errors on a previously clean segment.'
  }
];

/** Per-layer device for the cheat sheet. */
export const devices = {
  7: '—',
  6: '—',
  5: '—',
  4: '—',
  3: 'Router',
  2: 'Switch',
  1: 'Hub / Cable / NIC'
};

/** Mnemonics for the cheat sheet. */
export const mnemonics = [
  { label: 'Top → bottom (7→1)', text: 'All People Seem To Need Data Processing' },
  { label: 'Bottom → top (1→7)', text: 'Please Do Not Throw Sausage Pizza Away' }
];

export const analogy =
  'OSI is like sending a letter through a post office — the letter writer (Layer 7) doesn\'t care if it travels by plane or truck (Layer 1).';

/**
 * Tips & Tricks — 10 practical tips for mastering the OSI model.
 * Covers mnemonics, common misconceptions, interview prep, debugging, and protocol quirks.
 */
export const tips = [
  {
    icon: '💡',
    title: 'Memorize top-down with one sentence',
    text: 'Use <code>All People Seem To Need Data Processing</code> — Application, Presentation, Session, Transport, Network, Data Link, Physical. Say it 5 times and you\'ll never forget the order.'
  },
  {
    icon: '🔁',
    title: 'Memorize bottom-up too',
    text: 'Reversed: <code>Please Do Not Throw Sausage Pizza Away</code>. Interviewers love asking bottom-up — most people only know top-down, so this gives you an edge.'
  },
  {
    icon: '⚠️',
    title: 'TCP/IP is NOT the same as OSI',
    text: 'The TCP/IP model has 4 layers (Link, Internet, Transport, Application). OSI has 7. OSI is the reference; TCP/IP is what actually runs the internet. Don\'t mix them up in interviews.'
  },
  {
    icon: '🎯',
    title: 'Ports live at Layer 4, not Layer 7',
    text: 'A common mistake: saying "HTTP is port 80, so HTTP owns port 80." Wrong — <code>port numbers</code> are a Transport (L4) concept. HTTP just happens to be the default service on port 80.'
  },
  {
    icon: '🔍',
    title: 'Debugging trick: work the stack bottom-up',
    text: 'Can\'t reach a server? Check Layer 1 (cable plugged in?) → Layer 2 (link up, MAC learned?) → Layer 3 (ping the IP?) → Layer 4 (port open?) → Layer 7 (HTTP responds?). Eliminate layers in order.'
  },
  {
    icon: '🧩',
    title: 'PDU per layer — the cheat code',
    text: 'Each layer has a data unit name: <code>Segment</code> (L4), <code>Packet</code> (L3), <code>Frame</code> (L2), <code>Bit</code> (L1). Layers 5–7 just call it "Data." Memorize these four — they\'re on every exam.'
  },
  {
    icon: '🛡️',
    title: 'Where does encryption live?',
    text: 'TLS is Layer 6 (Presentation) — but IPsec is Layer 3 (Network) and WPA2 is Layer 2 (Data Link). Encryption can happen at ANY layer. The lower the layer, the more transparent it is to apps.'
  },
  {
    icon: '🚦',
    title: 'TCP vs UDP — the one-liner',
    text: '<code>TCP</code> = reliable, ordered, slow (web, email, file transfer). <code>UDP</code> = fast, no guarantee (DNS, video, games). If losing a packet ruins it → TCP. If latency ruins it → UDP.'
  },
  {
    icon: '🗺️',
    title: 'Switches vs Routers — never confuse them',
    text: 'A <code>switch</code> works at Layer 2 using MAC addresses (same network). A <code>router</code> works at Layer 3 using IP addresses (between networks). Switches connect devices; routers connect networks.'
  },
  {
    icon: '🐛',
    title: 'Encapsulation is a Russian nesting doll',
    text: 'As data goes DOWN the stack, each layer wraps the previous layer\'s data in its own header. Going UP, each layer strips its header. <code>[L2 Frame [L3 Packet [L4 Segment [L7 Data]]]]</code> — visualize it this way.'
  }
];
