/**
 * Firewalls & NAT module — all data, pure exports. No DOM here.
 */

/**
 * Firewall types (Tab 1). Each entry describes a firewall technology,
 * the OSI layer(s) it operates at, what it inspects, and its strengths.
 */
export const firewallTypes = [
  {
    name: 'Packet Filtering (Stateless)',
    layer: { n: 3, name: 'Network' },
    layerExtra: 'L3–L4',
    checks: 'IP address, port, protocol — each packet judged alone against rules.',
    strength: 'Fast and cheap. No memory of past packets, so it can\'t tell if a packet belongs to an existing connection.',
    mnemonic: 'Amnesia bouncer — checks your ID every single time, even if you just walked in 10 seconds ago.',
    pills: ['Fast', 'No state', 'Rule-based', 'Header only'],
    funFact: 'The first packet-filtering firewalls appeared in the late 1980s — routers could drop packets by ACL before "firewall" was even a product category.',
    realExample: 'iptables / nftables on Linux, ACLs on Cisco routers, Windows IPsec filter rules.',
    command: 'iptables -A INPUT -p tcp --dport 22 -j DROP'
  },
  {
    name: 'Stateful Inspection',
    layer: { n: 4, name: 'Transport' },
    layerExtra: 'L3–L4',
    checks: 'Same headers as packet filtering, plus a state table tracking every open connection (SYN, ESTABLISHED, CLOSED).',
    strength: 'Knows whether a packet is part of an established session — smarter, blocks unsolicited inbound replies automatically.',
    mnemonic: 'Bouncer with a guest list — remembers who\'s already inside, so return guests sail through.',
    pills: ['State table', 'Connection-aware', 'Default enterprise choice'],
    funFact: 'Stateful inspection was patented by Check Point in 1993 and became the default for almost every enterprise firewall for two decades.',
    realExample: 'Windows Defender Firewall, iptables conntrack module, Cisco ASA, pfSense default ruleset.',
    command: 'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT'
  },
  {
    name: 'Proxy / Application Layer (WAF)',
    layer: { n: 7, name: 'Application' },
    layerExtra: 'L7',
    checks: 'Full packet contents — understands HTTP, SQL, JSON. Can block SQL injection, XSS, and bad requests.',
    strength: 'Deepest inspection possible. Slower, and must decode/encode each protocol it proxies.',
    mnemonic: 'Bouncer who also searches your bags — looks at what you\'re carrying, not just your ID.',
    pills: ['Deep inspection', 'L7 aware', 'Blocks SQLi/XSS', 'Slower'],
    funFact: 'Cloudflare\'s WAF blocks ~140 billion malicious requests per day — more traffic than many entire ISPs carry.',
    realExample: 'Cloudflare WAF, ModSecurity for Apache/Nginx, AWS WAF, F5 BIG-IP ASM.',
    command: 'SecRule ARGS "@detectSQLi" "id:1001,deny,log,msg:\'SQL Injection Attempt\'"'
  },
  {
    name: 'Next-Gen Firewall (NGFW)',
    layer: { n: 4, name: 'Transport' },
    layerExtra: 'L3–L7',
    checks: 'Stateful filtering + deep packet inspection + IPS + identity awareness (who is the user?) + app awareness.',
    strength: 'Modern enterprise standard — one box sees the user, the app, and the threat.',
    mnemonic: 'Bouncer with a metal detector, face recognition, and a police database — all in one.',
    pills: ['Stateful + DPI', 'IPS built-in', 'Identity-aware', 'App-aware'],
    funFact: 'The firewall market is worth over $5 billion — Palo Alto Networks, Fortinet, and Cisco dominate it.',
    realExample: 'Palo Alto Networks PA-Series, Fortinet FortiGate, Cisco Firepower, Check Point Quantum.',
    command: 'set security policies from-zone trust to-zone untrust policy ALLOW-SSH match source-address any destination-address any application junos-ssh then permit'
  }
];

/** Analogy comparing the firewall types (Tab 1 callout). */
export const firewallAnalogy =
  'A packet filter is a bouncer checking IDs at the door. A stateful firewall is a bouncer who remembers who\'s ' +
  'already inside. A proxy firewall is a bouncer who also searches your bags.';

/**
 * NAT types (Tab 2). Each entry is a NAT variant with a mapping pattern,
 * a use case, and a mnemonic.
 */
export const natTypes = [
  {
    name: 'Static NAT',
    pattern: '1 : 1',
    mapping: 'One private IP → one fixed public IP.',
    use: 'Servers that must be reachable from the outside (web, mail, DNS).',
    mnemonic: 'Reserved parking spot — one plate, one bay, always the same.',
    pills: ['1:1', 'Predictable', 'For public servers'],
    funFact: 'Static NAT is how cloud providers give your VM a "floating IP" — AWS Elastic IP and DigitalOcean Floating IP are static NAT under the hood.',
    realExample: 'Web server with a public IP mapped to an internal DMZ IP; AWS Elastic IP attached to a private EC2 instance.',
    command: 'iptables -t nat -A PREROUTING -d 203.0.113.10 -j DNAT --to-destination 10.0.0.50'
  },
  {
    name: 'Dynamic NAT',
    pattern: 'N : Pool',
    mapping: 'Private IPs mapped to a pool of public IPs, first-come first-served.',
    use: 'Organizations with more internal hosts than public IPs, but no need to expose specific servers.',
    mnemonic: 'Company car pool — grab whichever vehicle is free, return it when done.',
    pills: ['Pool-based', 'First-come', 'No fixed mapping'],
    funFact: 'Dynamic NAT was the norm in the 1990s when a company might own a /29 (8 IPs) but have hundreds of internal hosts.',
    realExample: 'A branch office with a pool of 8 public IPs shared among 200 employees for outbound browsing.',
    command: 'iptables -t nat -A POSTROUTING -o eth0 -j SNAT --to-source 203.0.113.10-203.0.113.17'
  },
  {
    name: 'PAT (NAT Overload)',
    pattern: 'Many : 1',
    mapping: 'Many private IPs → one public IP, differentiated by source port.',
    use: 'What your home router does. Lets a whole household share one public IP.',
    mnemonic: 'Office switchboard — everyone dials out on one number, the receptionist tracks extensions.',
    pills: ['Many:1', 'Port-based', 'Home routers', 'a.k.a. NAT overload'],
    funFact: 'Your home router uses PAT — all your devices share one public IP, differentiated by source port. Without it, IPv4 would have run out in the 1990s.',
    realExample: 'A home Wi-Fi router sharing one ISP-assigned public IP across phones, laptops, and smart TVs.',
    command: 'iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE'
  }
];

/** Why NAT exists (Tab 2 callout). */
export const natReasons = [
  { label: 'IPv4 exhaustion', text: '~4 billion addresses for ~8 billion people — NAT lets millions share a handful of public IPs.' },
  { label: 'Security', text: 'Hides internal network topology — external hosts can\'t directly address private machines.' },
  { label: 'Avoids renumbering', text: 'Change ISPs without re-numbering every internal device; NAT handles the translation.' }
];

/** NAT analogy (Tab 2 blockquote). */
export const natAnalogy =
  'NAT is like a receptionist at an office — everyone inside calls through one main number (public IP). ' +
  'The receptionist (NAT) tracks who called what extension (port) and routes replies back to the right person.';

/**
 * Port forwarding steps (Tab 3). Ordered flow of how a forwarded packet
 * travels from the internet to an internal host.
 */
export const portForwardingSteps = [
  { step: 'External host', detail: 'A client on the internet sends traffic to your public IP on port 8080.', iptablesExample: '# From the internet: curl http://203.0.113.10:8080' },
  { step: 'Router receives', detail: 'Your router (running NAT) sees inbound traffic on port 8080 and checks its forwarding table.', iptablesExample: 'iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.100:80' },
  { step: 'NAT rewrites', detail: 'NAT changes the destination to 192.168.1.100:80 and records the mapping in its table.', iptablesExample: 'iptables -t nat -A POSTROUTING -d 192.168.1.100 -p tcp --dport 80 -j SNAT --to-source 192.168.1.1' },
  { step: 'Internal host', detail: 'The internal server at 192.168.1.100:80 receives the packet and replies.', iptablesExample: 'iptables -A FORWARD -p tcp -d 192.168.1.100 --dport 80 -j ACCEPT' },
  { step: 'Reply returns', detail: 'NAT reverses the mapping so the reply appears to come from your public IP:8080.', iptablesExample: '# Conntrack auto-reverses: iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT' }
];

/** Common port-forwarding use cases (Tab 3). */
export const portForwardingUses = [
  { use: 'Gaming', detail: 'Open NAT type for peer-to-peer matchmaking (Xbox, PlayStation).' },
  { use: 'Self-hosting', detail: 'Expose a web server, Plex media server, or game server from home.' },
  { use: 'Remote access', detail: 'Reach SSH, RDP, or a home camera dashboard from anywhere.' }
];

/** Port-forwarding analogy (Tab 3 callout). */
export const portForwardingAnalogy =
  'Port forwarding is like telling the office receptionist: "if anyone calls asking for extension 8080, ' +
  'send them to desk 100."';

/** DMZ note (Tab 3). */
export const dmzNote =
  'DMZ (Demilitarized Zone) exposes one internal host completely — every inbound port is forwarded to it. ' +
  'It bypasses NAT\'s protection entirely, so the host must be hardened. Use only when you truly need it.';

/**
 * Cheat sheet rows (Tab 4). Type | Layer | What it checks | Strength.
 */
export const cheatSheet = [
  { type: 'Packet Filtering', layer: 'L3–L4', checks: 'IP, port, protocol headers', strength: 'Fast, no context' },
  { type: 'Stateful Inspection', layer: 'L3–L4', checks: 'Headers + connection state table', strength: 'Connection-aware' },
  { type: 'Proxy / WAF', layer: 'L7', checks: 'Full packet contents (HTTP, SQL)', strength: 'Deepest inspection' },
  { type: 'NGFW', layer: 'L3–L7', checks: 'Stateful + DPI + IPS + identity', strength: 'All-in-one enterprise' },
  { type: 'Static NAT', layer: 'L3', checks: '1:1 IP rewrite', strength: 'Reachable servers' },
  { type: 'Dynamic NAT', layer: 'L3', checks: 'Pool-based IP rewrite', strength: 'Conserves public IPs' },
  { type: 'PAT (Overload)', layer: 'L3–L4', checks: 'Many:1 IP + port rewrite', strength: 'Home router default' }
];

/** Final analogy blockquote (Tab 4). */
export const finalAnalogy =
  'A firewall is the bouncer at the club door of your network — it decides who gets in, who gets blocked, and ' +
  'who gets kicked out. NAT is the receptionist who lets everyone inside share one phone line to the outside world.';

/**
 * Common firewall rule patterns (Rules & Troubleshooting tab). Each entry
 * is a real-world iptables rule with the command and the reasoning behind it.
 */
export const firewallRules = [
  { rule: 'Allow SSH from specific IP', command: 'iptables -A INPUT -p tcp -s 10.0.0.5 --dport 22 -j ACCEPT', why: 'Restrict SSH to known hosts only' },
  { rule: 'Drop all by default', command: 'iptables -P INPUT DROP', why: 'Default deny — only explicitly allowed traffic passes' },
  { rule: 'Allow established connections', command: 'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT', why: 'Let responses to outbound traffic back in' },
  { rule: 'Block a specific IP', command: 'iptables -A INPUT -s 1.2.3.4 -j DROP', why: 'Blacklist a known attacker' },
  { rule: 'Rate limit SSH', command: 'iptables -A INPUT -p tcp --dport 22 -m limit --limit 3/min -j ACCEPT', why: 'Prevent brute-force attacks' },
  { rule: 'Log dropped packets', command: 'iptables -A INPUT -j LOG --log-prefix "DROPPED: "', why: 'See what your firewall is blocking' }
];

/**
 * Common NAT troubleshooting scenarios (Rules & Troubleshooting tab).
 * Each entry maps a symptom to its cause and a concrete fix.
 */
export const natTroubleshooting = [
  { problem: 'Can\'t host a game server', cause: 'NAT blocks inbound connections', fix: 'Set up port forwarding on your router for the game\'s port' },
  { problem: 'VoIP one-way audio', cause: 'NAT breaks SIP/RTP signaling', fix: 'Use STUN/TURN server or SIP ALG on router' },
  { problem: 'NAT traversal fails for P2P', cause: 'Symmetric NAT blocks STUN', fix: 'Use TURN relay server as fallback' },
  { problem: 'Hairpin NAT fails', cause: 'Accessing public IP from inside NAT fails', fix: 'Enable NAT hairpinning / NAT reflection on router' },
  { problem: 'Double NAT', cause: 'Router behind another router (ISP modem+router)', fix: 'Set ISP modem to bridge mode, or use DMZ' }
];

/**
 * Tips & tricks (Tips tab). Twelve practical tips covering iptables tricks,
 * NAT debugging, firewall best practices, port forwarding gotchas, security
 * hardening, and common firewall mistakes.
 */
export const tips = [
  { icon: '💡', title: 'Default-deny first', text: 'Start every firewall with <code>iptables -P INPUT DROP</code>, then add only the rules you need. It\'s easier to open a hole than to chase down every stray open port.' },
  { icon: '🔍', title: 'List rules with line numbers', text: 'Use <code>iptables -L -n -v --line-numbers</code> to see rules with counters and positions — essential before inserting or deleting a rule.' },
  { icon: '🧹', title: 'Flush with care', text: '<code>iptables -F</code> wipes all rules but leaves policies intact. If your default policy is <code>DROP</code>, flushing can lock you out of a remote box — always allow established first.' },
  { icon: '⏱️', title: 'Rate-limit log spam', text: 'Add <code>-m limit --limit 5/min --limit-burst 10</code> to LOG rules so a flood doesn\'t fill your disk or tank CPU writing to syslog.' },
  { icon: '🚪', title: 'Allow established before anything', text: '<code>iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT</code> should be your first rule — it lets outbound traffic\'s replies back in without per-service holes.' },
  { icon: '🛡️', title: 'Never expose SSH to the world', text: 'SSH on port 22 open to 0.0.0.0/0 will be brute-forced within hours. Bind to a VPN, restrict by source IP, move the port, and disable password auth in favor of keys.' },
  { icon: '🔁', title: 'Persist your rules', text: 'iptables rules live in memory and vanish on reboot. Save with <code>iptables-save &gt; /etc/iptables/rules.v4</code> or install <code>iptables-persistent</code> on Debian/Ubuntu.' },
  { icon: '🌐', title: 'Debug NAT with conntrack', text: '<code>conntrack -L</code> shows the live NAT translation table — every mapping of internal:port to public:port. It\'s the fastest way to see if PAT is working.' },
  { icon: '📡', title: 'tcpdump is your friend', text: 'When port forwarding fails, run <code>tcpdump -i any port 8080</code> on the router to see whether packets arrive, get rewritten, and reach the internal host — or vanish.' },
  { icon: '🎮', title: 'UPnP is convenient, not safe', text: 'UPnP lets apps open port-forwarding rules automatically — great for gaming, but also lets malware open holes. Disable it and forward ports manually when security matters.' },
  { icon: '🧱', title: 'Test from the outside', text: 'A firewall that blocks locally may pass remotely. Use <code>nmap -p 22 your.public.ip</code> from a VPS or a phone hotspot to verify what the internet actually sees.' },
  { icon: '🪞', title: 'Beware double NAT', text: 'If your ISP modem is also a router, you\'re behind two NATs — port forwarding on the inner router won\'t work. Put the ISP modem in bridge mode, or forward through both layers.' }
];
