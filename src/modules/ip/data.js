/**
 * IP & Subnetting module — all data, pure exports. No DOM here.
 */

/** IPv4 and IPv6 fundamentals. */
export const ipVersions = [
  {
    id: 'ipv4',
    name: 'IPv4',
    bits: 32,
    format: '4 octets, dotted decimal',
    example: '192.168.1.1',
    space: '~4.3 billion addresses (2^32)',
    notation: 'Each octet 0–255, separated by dots.',
    mnemonic: 'Four dots, four numbers — the classic internet address.',
    layer: 3,
    headerStructure: '20-byte fixed header (no options). Key fields: Version (4 bits), IHL — header length in 32-bit words (4 bits), TTL — hops left before discard (8 bits), Protocol — upper-layer payload e.g. 6=TCP, 17=UDP (8 bits), Source IP (32 bits), Destination IP (32 bits). Options can extend it up to 60 bytes.',
    funFact: 'IPv4 was defined in RFC 791 in 1981 — over 40 years ago. It was never meant to scale to billions of devices; NAT and CIDR were invented later to keep it alive.',
    migrationTip: 'Run dual-stack (IPv4 + IPv6 on the same host) during transition. Where that is not possible, use tunneling (6to4, 6in4) to carry IPv6 over IPv4, or NAT64/DNS64 to let IPv6-only clients reach IPv4-only servers.'
  },
  {
    id: 'ipv6',
    name: 'IPv6',
    bits: 128,
    format: '8 groups of hex, colon-separated',
    example: '2001:db8::1',
    space: '~340 undecillion addresses (2^128)',
    notation: 'Hex groups, :: shorthand collapses consecutive zero groups.',
    mnemonic: 'Hex and colons — enough addresses to number every grain of sand, many times over.',
    layer: 3,
    headerStructure: '40-byte fixed header. Key fields: Version (4 bits), Traffic Class (8 bits, like IPv4 ToS), Flow Label (20 bits — identifies a flow for QoS), Hop Limit (8 bits — replaces TTL), Source Address (128 bits), Destination Address (128 bits). Extension headers (routing, fragmentation, IPSec) chain after the fixed header instead of bloating it.',
    funFact: 'IPv6 was published as RFC 2460 in 1998 — yet after more than 25 years only roughly 40–45% of Google traffic is IPv6. The long tail of legacy gear and apps keeps IPv4 alive.',
    migrationTip: 'Prefer dual-stack as the default. For IPv6-only islands, use 464XLAT (stateless translation) so apps that hardcode IPv4 still work. Disable IPv6 only as a last resort — it breaks reachability and slows the global rollout.'
  }
];

/** IP address structure — network + host portions. */
export const ipStructure = {
  summary: 'Every IP address = Network portion + Host portion.',
  analogy: 'Like a postal address: the street name = network, the house number = host.',
  parts: [
    { label: 'Network', desc: 'Identifies the network segment. Shared by all hosts on that segment.' },
    { label: 'Host', desc: 'Identifies a specific device on that network. Unique within the segment.' }
  ]
};

/** Special / reserved IPv4 addresses. */
export const specialAddresses = [
  {
    address: '127.0.0.1',
    name: 'Loopback (localhost)',
    purpose: 'Talks to itself. Used for testing — "is my own network stack working?"',
    range: '127.0.0.0/8 (whole block reserved)'
  },
  {
    address: '0.0.0.0',
    name: 'Unspecified',
    purpose: '"not this host" — used as a source during DHCP discovery, or to bind to all interfaces.',
    range: '0.0.0.0/8'
  },
  {
    address: '255.255.255.255',
    name: 'Limited broadcast',
    purpose: 'Sent to every host on the local subnet. Routers do not forward it.',
    range: 'Single address'
  }
];

/** Subnetting concepts. */
export const subnetting = [
  {
    id: 'mask',
    title: 'Subnet Mask',
    layer: 3,
    summary: 'A 32-bit mask that separates the network bits from the host bits.',
    example: '255.255.255.0 = /24 — first 24 bits are network, last 8 are host.',
    detail: 'A 1 bit = "this is network", a 0 bit = "this is host". Masks are always contiguous 1s followed by 0s.',
    mnemonic: 'Mask is a pair of scissors: it cuts the address into "street" and "house".',
    workedExample: '10.20.30.44 with mask 255.255.255.128 (/25). The first 25 bits are network, so 10.20.30.0 is the network and 10.20.30.127 is the broadcast. Usable hosts: 10.20.30.1 – 10.20.30.126 (126 hosts).',
    commonMistake: 'Treating the mask as a literal number instead of a bit pattern. 255.255.255.0 and 255.255.254.0 are only one bit apart, but the second one doubles the host count — the difference is not "1 host", it is 256 more hosts.'
  },
  {
    id: 'cidr',
    title: 'CIDR Notation',
    layer: 3,
    summary: 'Shorthand for the mask: a slash + the number of network bits.',
    examples: [
      { cidr: '/8',  mask: '255.0.0.0',     use: 'Big networks (legacy Class A)' },
      { cidr: '/16', mask: '255.255.0.0',   use: 'Medium networks (legacy Class B)' },
      { cidr: '/24', mask: '255.255.255.0', use: 'Small networks (legacy Class C)' },
      { cidr: '/30', mask: '255.255.255.252', use: 'Point-to-point links (2 usable hosts)' }
    ],
    mnemonic: 'The slash number = how many bits belong to the network. Bigger slash = smaller network, fewer hosts.',
    workedExample: 'You need 50 hosts. 2^6 = 64, minus 2 (network + broadcast) = 62 usable — so borrow 6 host bits. That means 32 − 6 = 26 network bits, i.e. a /26 (255.255.255.192).',
    commonMistake: 'Forgetting to subtract 2 for the network and broadcast addresses. A /28 has 16 total addresses but only 14 are assignable to hosts.'
  },
  {
    id: 'classes',
    title: 'IP Classes (legacy)',
    layer: 3,
    summary: 'Before CIDR, addresses were split into fixed classes. Still useful to recognize.',
    classes: [
      { cls: 'A', firstOctet: '1–126',  defaultMask: '/8',  defaultDotted: '255.0.0.0',     hosts: '~16 million' },
      { cls: 'B', firstOctet: '128–191', defaultMask: '/16', defaultDotted: '255.255.0.0',   hosts: '~65,000' },
      { cls: 'C', firstOctet: '192–223', defaultMask: '/24', defaultDotted: '255.255.255.0', hosts: '254' }
    ],
    mnemonic: 'Class A = few huge networks, Class C = many tiny networks.',
    workedExample: 'See 172.20.5.3. First octet 172 falls in 128–191 → Class B → default mask /16. So without CIDR, the network is 172.20.0.0 and hosts are 172.20.0.1 – 172.20.255.254.',
    commonMistake: 'Assuming a class from the first octet when a CIDR mask is actually in use. 192.168.5.0/22 is NOT a /24 just because it "looks like Class C" — the /22 wins and covers 192.168.4.0 – 192.168.7.255.'
  },
  {
    id: 'calc',
    title: 'How to Calculate',
    layer: 3,
    summary: 'Three bitwise operations give you everything about a subnet.',
    steps: [
      { op: 'Network address', formula: 'IP AND mask', result: 'Lowest address in the subnet — the network ID.' },
      { op: 'Broadcast address', formula: 'IP OR (NOT mask)', result: 'Highest address — sent to all hosts in the subnet.' },
      { op: 'Host range', formula: 'between network+1 and broadcast-1', result: 'The usable addresses you can assign to devices.' }
    ],
    mnemonic: 'AND finds the network, OR-with-inverted-mask finds the broadcast, the gap in between is yours.',
    workedExample: 'IP 172.16.45.200, mask 255.255.240.0 (/20). AND gives network 172.16.32.0. The host bits cover 0.0.15.255, so broadcast = 172.16.47.255. Usable hosts: 172.16.32.1 – 172.16.47.254 (4094 hosts).',
    commonMistake: 'Doing the AND in decimal instead of binary. 172.16.45 AND 255.255.240 is NOT 172.16.45 — the 240 mask zeros out the low 4 bits of the third octet, so 45 (00101101) becomes 32 (00100000).'
  },
  {
    id: 'example',
    title: 'Worked Example: 192.168.1.0/24',
    layer: 3,
    summary: 'Walk through a /24 subnet end to end.',
    rows: [
      { label: 'IP address',   value: '192.168.1.0' },
      { label: 'Mask',         value: '255.255.255.0 (/24)' },
      { label: 'Network',      value: '192.168.1.0   (IP AND mask)' },
      { label: 'Broadcast',    value: '192.168.1.255 (IP OR NOT mask)' },
      { label: 'Usable hosts', value: '192.168.1.1 – 192.168.1.254 (254 hosts)' }
    ],
    mnemonic: 'Network is the floor, broadcast is the ceiling, hosts live in between.',
    workedExample: 'Subnet 10.0.0.0/22. Mask 255.255.252.0 borrows 2 extra bits from the third octet. Network = 10.0.0.0, broadcast = 10.0.3.255, usable hosts = 10.0.0.1 – 10.0.3.254 (1022 hosts). Four /24s merged into one /22.',
    commonMistake: 'Counting the network or broadcast address as a usable host. On 192.168.1.0/24 you can assign .1 through .254 — .0 and .255 are reserved, giving 254, not 256.'
  }
];

/** Private vs public vs special-use ranges. */
export const addressTypes = [
  {
    id: 'private',
    name: 'Private Ranges (RFC 1918)',
    layer: 3,
    purpose: 'Used inside homes and offices. Not routable on the public internet.',
    ranges: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'],
    detail: 'Anyone can use these internally — they are reused by millions of networks worldwide.',
    mnemonic: '10, 172.16, 192.168 — the three "inside-only" neighborhoods.',
    securityNote: 'Not routable on the internet — your router uses NAT to reach the public internet. Attackers outside cannot directly address your 192.168.x.x devices, but NAT is not a firewall: any outbound connection can be tracked back, and a misconfigured port forward exposes an internal host to the world.'
  },
  {
    id: 'public',
    name: 'Public Addresses',
    layer: 3,
    purpose: 'Globally routable on the internet. Every public IP is unique.',
    ranges: ['Everything outside the private, loopback, and link-local blocks'],
    detail: 'Assigned by ISPs and regional registries (IANA → RIR → ISP → you).',
    mnemonic: 'Public = your real, globally-unique internet address.',
    securityNote: 'A public address is reachable from anywhere on the internet. Anything exposed on it — open ports, services, web apps — must be hardened and firewalled. Shodan and Censys continuously scan the entire public space, so assume your public IP is being probed right now.'
  },
  {
    id: 'nat',
    name: 'NAT (Network Address Translation)',
    layer: 3,
    purpose: 'Translates many private addresses into one public address (and back).',
    ranges: ['Performed by your home router / firewall'],
    detail: 'How a whole house shares one public IP. Covered in depth in the Firewalls & NAT module.',
    mnemonic: 'NAT is the mailroom: one public door, many private desks behind it.',
    securityNote: 'NAT hides internal hosts by rewriting source ports, which incidentally blocks unsolicited inbound traffic — but it is not access control. Outbound connections can still leak data, and inbound port forwards punch a hole straight through. Always pair NAT with a real stateful firewall ruleset.'
  },
  {
    id: 'linklocal',
    name: 'Link-Local (APIPA)',
    layer: 3,
    purpose: 'Self-assigned when DHCP fails. Only works on the local segment.',
    ranges: ['169.254.0.0/16'],
    detail: 'A host that cannot reach a DHCP server picks a random 169.254.x.x address. No gateway = no internet.',
    mnemonic: '169.254 = "I could not get a real address, so I made one up."',
    securityNote: 'A device showing a 169.254.x.x address failed DHCP — often a cable, VLAN, or DHCP-server outage. Two hosts in this state can still talk to each other on the same segment, which means a rogue device could communicate without ever touching your managed network. Treat sustained APIPA as a monitoring alert.'
  },
  {
    id: 'whyprivate',
    name: 'Why Private Ranges Exist',
    layer: 3,
    purpose: 'Three reasons IPv4 is still alive.',
    points: [
      'IPv4 exhaustion — 4.3 billion addresses is nowhere near enough for the planet.',
      'Security — private addresses are not reachable from the internet by default.',
      'Reuse — the same 10.x range can exist in a million separate networks without conflict.'
    ],
    mnemonic: 'Private space = conservation + obscurity + reuse. NAT glues it together.',
    securityNote: 'Reusing the same private ranges everywhere means 10.0.0.5 means nothing without context. Logging and correlation must record the source network/VLAN, or you will chase the wrong machine. Overlapping private ranges also break site-to-site VPNs unless you do NAT traversal.'
  }
];

/** Cheat sheet table rows: Class | Range | Default Mask | Networks | Hosts per net. */
export const classCheatSheet = [
  { cls: 'A', range: '1.0.0.0 – 126.255.255.255',  mask: '/8  (255.0.0.0)',     networks: '126',   hosts: '16,777,214' },
  { cls: 'B', range: '128.0.0.0 – 191.255.255.255', mask: '/16 (255.255.0.0)',   networks: '16,384', hosts: '65,534' },
  { cls: 'C', range: '192.0.0.0 – 223.255.255.255', mask: '/24 (255.255.255.0)', networks: '2,097,152', hosts: '254' },
  { cls: 'D', range: '224.0.0.0 – 239.255.255.255', mask: '— (multicast)',        networks: '—',      hosts: '—' },
  { cls: 'E', range: '240.0.0.0 – 255.255.255.255', mask: '— (reserved)',         networks: '—',      hosts: '—' }
];

/** Quick-reference CIDR table. */
export const cidrCheatSheet = [
  { cidr: '/8',  mask: '255.0.0.0',       hosts: '16,777,216' },
  { cidr: '/16', mask: '255.255.0.0',     hosts: '65,536' },
  { cidr: '/24', mask: '255.255.255.0',   hosts: '256' },
  { cidr: '/25', mask: '255.255.255.128', hosts: '128' },
  { cidr: '/26', mask: '255.255.255.192', hosts: '64' },
  { cidr: '/27', mask: '255.255.255.224', hosts: '32' },
  { cidr: '/28', mask: '255.255.255.240', hosts: '16' },
  { cidr: '/30', mask: '255.255.255.252', hosts: '4 (2 usable)' }
];

/** Postal-address analogy for the cheat sheet blockquote. */
export const analogy =
  'An IP address is like a postal address — the network part is the street, the host part is the house number. Subnetting is like dividing one street into numbered blocks.';

/**
 * Tips & Tricks — 12 practical, exam-and-real-world tips for IP and subnetting.
 * Each tip is { icon, title, text }. HTML is allowed inside `text`.
 */
export const tips = [
  {
    icon: '💡',
    title: 'The 2^n minus 2 rule',
    text: 'Usable hosts = <code>2^(host bits) − 2</code>. The two you lose are the network address (all host bits 0) and the broadcast (all host bits 1). For a /24: <code>2^8 − 2 = 254</code>.'
  },
  {
    icon: '⚡',
    title: 'CIDR quick math: powers of 2',
    text: 'Memorize the subnet boundary values: 128, 192, 224, 240, 248, 252, 254, 255. Each step borrows one more bit. <code>/25 = .128</code>, <code>/26 = .192</code>, <code>/27 = .224</code> — the mask octet is just <code>256 − 2^(8−n)</code> where n is bits borrowed in that octet.'
  },
  {
    icon: '🪜',
    title: 'Subnet size from host count',
    text: 'Need N hosts? Find the smallest power of 2 that is ≥ N+2, that exponent is your host-bit count. 50 hosts → 64 (=2^6) → 6 host bits → <code>/26</code>. The +2 covers network and broadcast.'
  },
  {
    icon: '🧮',
    title: 'Block size = 256 − mask octet',
    text: 'In the interesting octet, block size = <code>256 − mask</code>. Mask .224 → block 32. Subnets start at 0, 32, 64, 96… and the network your IP belongs to is the largest block start ≤ that octet.'
  },
  {
    icon: '🎯',
    title: 'Exam trick: "which subnet is X in?"',
    text: 'Take the interesting octet of the IP, integer-divide by the block size, multiply back. IP <code>.100</code>, mask <code>.224</code> (block 32): <code>floor(100/32)=3</code>, <code>3×32=96</code> → network <code>.96</code>, broadcast <code>.127</code>. Fast and reliable.'
  },
  {
    icon: '🚫',
    title: 'Never use .0 or .255 blindly',
    text: 'In a /24, .0 is the network and .255 is the broadcast — both unassignable. But in a /23, .255 of the first half is a normal host! Always check the mask before assuming an address is reserved.'
  },
  {
    icon: '🏠',
    title: 'Remember the private ranges',
    text: '<code>10.0.0.0/8</code> = "ten is huge" (one giant block). <code>172.16.0.0/12</code> = "172 starts at 16" (the 16 is the giveaway). <code>192.168.0.0/16</code> = "home" (every home router uses it). Mnemonic: <strong>10 big, 172 in the middle, 192 at home.</strong>'
  },
  {
    icon: '🌐',
    title: 'IPv6 abbreviation rules',
    text: 'Drop leading zeros in each group, then replace the <strong>longest single run</strong> of all-zero groups with <code>::</code> — but only once. <code>2001:0db8:0000:0000:0000:ff00:0042:8329</code> → <code>2001:db8::ff00:42:8329</code>. Using <code>::</code> twice is illegal — it would be ambiguous.'
  },
  {
    icon: '🔍',
    title: 'Debugging: ping the right things',
    text: 'Can\'t reach a host? Work bottom-up: <code>ping 127.0.0.1</code> (my stack), <code>ping &lt;my gateway&gt;</code> (my subnet), <code>ping 8.8.8.8</code> (internet by IP), <code>ping google.com</code> (DNS). The first one that fails tells you the layer.'
  },
  {
    icon: '🧭',
    title: '169.254.x.x means "DHCP failed"',
    text: 'A Windows/Mac host showing <code>169.254.x.x</code> could not reach a DHCP server. Check the cable, the VLAN, the DHCP relay, or the server itself. It is a symptom, not the disease.'
  },
  {
    icon: '📊',
    title: 'VLSM: biggest subnet first',
    text: 'When carving Variable-Length Subnets out of one block, allocate the <strong>largest</strong> subnet first. Sort requirements descending, place each, then move down. This avoids fragmentation and wasted gaps you cannot use later.'
  },
  {
    icon: '🛡️',
    title: 'NAT ≠ firewall',
    text: 'NAT hides internal IPs by accident, not by design. A port forward exposes a private host to the public internet with no filtering. Always put a real stateful firewall rule in front of any forwarded service, and log the hits.'
  }
];
