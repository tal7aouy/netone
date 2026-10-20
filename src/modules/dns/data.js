/**
 * DNS module — pure data exports (no DOM).
 * All content used by the DNS Deep Dive tabs lives here so tab files
 * stay focused on presentation.
 */

/**
 * The four tiers of the DNS hierarchy, top to bottom.
 * @typedef {Object} HierarchyTier
 * @property {string} title       - card title
 * @property {string} tagline     - one-line summary shown in the header
 * @property {string} layer       - OSI layer label, e.g. "L7 Application"
 * @property {string[]} points    - bullet points describing the tier
 * @property {{label:string, detail:string}[]} examples - concrete examples
 * @property {string} [mnemonic]  - optional memory aid
 * @property {string} [funFact]   - a surprising real-world fact about this tier
 * @property {string} [digCommand] - an actual dig/nslookup command to query this tier
 */
/** @type {HierarchyTier[]} */
export const hierarchyTiers = [
  {
    title: 'Root servers (.)',
    tagline: 'The top of the DNS tree — used when the resolver needs an uncached delegation.',
    layer: 'L7 Application',
    points: [
      '13 logical root server clusters, labelled A through M (a.root-servers.net → m.root-servers.net).',
      'Each cluster is replicated across hundreds of physical instances via anycast.',
      'They do not know the answer — they know who to ask next (the TLD).',
      'Represented by the trailing dot in a fully qualified name: www.example.com.',
    ],
    examples: [
      { label: 'a.root-servers.net', detail: 'Operated by Verisign' },
      { label: 'f.root-servers.net', detail: 'Operated by ISC (Internet Systems Consortium)' },
      { label: 'k.root-servers.net', detail: 'Operated by RIPE NCC' },
    ],
    mnemonic: 'Root = CEO. They never do the work, they just point you to the right department.',
    funFact: 'There are 13 root server LETTERS (A–M) but over 1700 physical instances worldwide, using anycast — so querying "a.root-servers.net" likely hits a server in your own country.',
    digCommand: 'dig @a.root-servers.net . NS',
  },
  {
    title: 'TLD servers',
    tagline: 'Top Level Domains — one step down from the root.',
    layer: 'L7 Application',
    points: [
      'Handle the last label of a name: .com, .org, .net, .edu, .gov.',
      'Country-code TLDs (ccTLDs): .uk, .jp, .de, .br, .in.',
      'Know which authoritative servers are responsible for each second-level domain.',
      'Newer gTLDs (.app, .dev, .xyz) follow the same model.',
    ],
    examples: [
      { label: '.com', detail: 'The largest registry, ~150M+ names' },
      { label: '.uk', detail: 'United Kingdom ccTLD' },
      { label: '.io', detail: 'British Indian Ocean Territory — popular with tech' },
    ],
    mnemonic: 'TLD = Department Heads. Each owns a slice of the org chart.',
    funFact: 'The .com TLD alone answers billions of queries per day. The full list of TLDs is over 1,500 long — including .pizza, .ninja, and .sucks.',
    digCommand: 'dig com. NS',
  },
  {
    title: 'Authoritative servers',
    tagline: 'The final authority for a specific domain — they hold the actual records.',
    layer: 'L7 Application',
    points: [
      'Run by the domain owner (or their registrar / DNS provider).',
      'Answer questions about a zone with authority — no guessing, no recursion.',
      'Typically deployed in pairs: ns1.example.com and ns2.example.com for redundancy.',
      'Serve A, AAAA, MX, TXT, NS, SOA and other record types.',
    ],
    examples: [
      { label: 'ns1.example.com', detail: 'Primary authoritative server' },
      { label: 'ns-aws.example.com', detail: 'Secondary, often in another region' },
      { label: 'ns-cloud-*.googledomains.com', detail: 'Google Cloud DNS nameservers' },
    ],
    mnemonic: 'Authoritative = The Employee. They actually know the phone number.',
    funFact: 'A single domain can have up to 13 authoritative nameservers (limited by the 512-byte UDP packet size) — but most use 2–4 for simplicity.',
    digCommand: 'dig @a.iana-servers.net example.com SOA',
  },
  {
    title: 'Recursive resolvers',
    tagline: 'Your DNS sherpa — does all the walking so your browser does not have to.',
    layer: 'L7 Application',
    points: [
      'Also called "recursive nameservers" or "caching resolvers".',
      'Receives your query and chases root → TLD → authoritative on your behalf.',
      'Caches every answer for the record\'s TTL, speeding up repeat lookups.',
      'Usually provided by your ISP, or public resolvers like Google 8.8.8.8 and Cloudflare 1.1.1.1.',
    ],
    examples: [
      { label: '8.8.8.8 / 8.8.4.4', detail: 'Google Public DNS' },
      { label: '1.1.1.1 / 1.0.0.1', detail: 'Cloudflare (privacy-focused)' },
      { label: '9.9.9.9', detail: 'Quad9 (security-filtered)' },
    ],
    mnemonic: 'Recursive Resolver = The Receptionist. You ask once, they do all the running around.',
    funFact: 'Cloudflare\'s 1.1.1.1 resolver answers most queries in under 15ms — and was briefly "banned" by some networks because 1.1.1.1 was a reserved training address for decades.',
    digCommand: 'dig @1.1.1.1 example.com A',
  },
];

/**
 * The analogy tying the four tiers together.
 * @type {string}
 */
export const hierarchyAnalogy =
  'DNS is like a phone book with managers — root is the CEO, TLDs are the department heads, ' +
  'authoritative servers are the employees who actually know the number, and the recursive ' +
  'resolver is the receptionist who walks the halls for you.';

/**
 * The 8 steps of resolving www.example.com.
 * Each step has an actor and an action.
 * @typedef {Object} ResolutionStep
 * @property {string} actor  - who is acting
 * @property {string} action - what happens
 * @property {string} [note] - small clarifying note
 * @property {string} [queryType] - the DNS query type at this step
 */
/** @type {ResolutionStep[]} */
export const resolutionSteps = [
  { actor: 'User', action: 'Types www.example.com into the browser address bar.', queryType: 'No query yet — user input' },
  { actor: 'Browser', action: 'Checks its local DNS cache for www.example.com.', note: 'Cache miss — proceed to resolver.', queryType: 'Local cache lookup (no network query)' },
  { actor: 'Browser', action: 'Sends the query to the configured recursive resolver (e.g. 8.8.8.8).', queryType: 'A record query (recursive)' },
  { actor: 'Resolver', action: 'Asks a root server: "who handles .com?"', queryType: 'NS query for .com' },
  { actor: 'Root', action: 'Responds with the list of .com TLD servers.', note: 'Root does not know example.com — it delegates.', queryType: 'NS referral (root → TLD)' },
  { actor: 'Resolver', action: 'Asks a .com TLD server: "who handles example.com?"', queryType: 'NS query for example.com' },
  { actor: 'TLD', action: 'Responds with the authoritative servers for example.com.', queryType: 'NS referral (TLD → authoritative)' },
  { actor: 'Resolver', action: 'Asks the authoritative server for www.example.com, gets the A record (IP), returns it to the browser, which caches it.', note: 'Done — browser now opens a TCP connection to the IP.', queryType: 'A record query (authoritative answer)' },
];

/**
 * Callout explaining recursive vs iterative resolution.
 * @type {string}
 */
export const resolutionCallout =
  'Recursive = the resolver does all the work and returns the final answer. ' +
  'Iterative = the client asks each server itself and follows referrals. ' +
  'Browsers use recursive resolvers — they only ever send one query.';

/**
 * The common DNS record types.
 * @typedef {Object} RecordType
 * @property {string} type    - short code (A, AAAA, ...)
 * @property {string} name    - full name
 * @property {string} purpose - what it does
 * @property {string} example - a sample record value
 * @property {string} [hint]  - memory aid
 * @property {string} [ttlNote] - typical TTL values and why
 * @property {string} [digExample] - a dig command example
 */
/** @type {RecordType[]} */
export const recordTypes = [
  {
    type: 'A',
    name: 'Address (IPv4)',
    purpose: 'Maps a hostname to an IPv4 address. The most common record on the internet.',
    example: 'example.com.   IN  A   93.184.216.34',
    hint: 'A = Address. The classic "name → IPv4" lookup.',
    ttlNote: '300–3600s. Short TTLs enable fast load-balancing failover; long TTLs cut query volume.',
    digExample: 'dig example.com A',
  },
  {
    type: 'AAAA',
    name: 'Address (IPv6)',
    purpose: 'Maps a hostname to an IPv6 address. Called "quad-A"; IPv6 addresses have four times the bits of IPv4 (128 versus 32).',
    example: 'example.com.   IN  AAAA   2606:2800:220:1::',
    hint: 'AAAA = four A\'s = four times the bits = IPv6.',
    ttlNote: '300–3600s. Same strategy as A — often set identically so dual-stack clients fail over together.',
    digExample: 'dig example.com AAAA',
  },
  {
    type: 'CNAME',
    name: 'Canonical Name',
    purpose: 'Alias — points one name to another name. The target is the "canonical" host.',
    example: 'blog.example.com.  IN  CNAME  example.github.io.',
    hint: 'CNAME = "see name". It is a DNS alias, not an HTTP redirect.',
    ttlNote: '600–3600s. Avoid at the zone apex (root of the domain) — it is not allowed there.',
    digExample: 'dig blog.example.com CNAME',
  },
  {
    type: 'MX',
    name: 'Mail Exchange',
    purpose: 'Tells senders which server handles email for the domain, with a priority value.',
    example: 'example.com.  IN  MX  10 mail.example.com.',
    hint: 'MX = Mail eXchange. Lower priority number = preferred server.',
    ttlNote: '3600–86400s. Long TTLs reduce queries but can delay mail-routing changes; choose them with migration plans in mind.',
    digExample: 'dig example.com MX',
  },
  {
    type: 'TXT',
    name: 'Text',
    purpose: 'Arbitrary text. Used for SPF, DKIM, DMARC, and domain-ownership verification.',
    example: 'example.com.  IN  TXT  "v=spf1 include:_spf.google.com ~all"',
    hint: 'TXT = free-form Text. The "notes" field of DNS.',
    ttlNote: '1800–3600s. SPF/DKIM changes are rare, but you want them live within an hour if you rotate keys.',
    digExample: 'dig example.com TXT',
  },
  {
    type: 'NS',
    name: 'Nameserver',
    purpose: 'Declares which server is authoritative for the zone. Used in delegations.',
    example: 'example.com.  IN  NS  ns1.example.com.',
    hint: 'NS = NameServer. "Who is in charge here?"',
    ttlNote: '86400s (1 day) typical. Delegations change rarely; long TTLs keep the internet stable.',
    digExample: 'dig example.com NS',
  },
  {
    type: 'SOA',
    name: 'Start of Authority',
    purpose: 'Metadata about the zone: primary nameserver, admin email, serial, refresh, retry, TTL.',
    example: 'example.com.  IN  SOA  ns1.example.com. admin.example.com. 2024010101 7200 3600 1209600 3600',
    hint: 'SOA = the zone\'s ID card.',
    ttlNote: 'Negative caching uses the smaller of the SOA record TTL and its final MINIMUM field. It can cache NXDOMAIN or missing record types.',
    digExample: 'dig example.com SOA',
  },
  {
    type: 'PTR',
    name: 'Pointer (reverse DNS)',
    purpose: 'Maps an IP address back to a hostname — the opposite of an A record. Uses in-addr.arpa for IPv4 and ip6.arpa for IPv6.',
    example: '34.216.184.93.in-addr.arpa.  IN  PTR  example.com.',
    hint: 'PTR = PoinTeR. Reverse lookup: IP → name.',
    ttlNote: '3600–86400s. Reverse mappings rarely change, so long TTLs are fine.',
    digExample: 'dig -x 93.184.216.34',
  },
  {
    type: 'SRV',
    name: 'Service',
    purpose: 'Defines the host and port for a specific service (e.g. _sip._tcp.example.com).',
    example: '_sip._tcp.example.com.  IN  SRV  10 60 5060 sip.example.com.',
    hint: 'SRV = SeRVice. Tells clients where a service lives.',
    ttlNote: '300–3600s. Service discovery benefits from shorter TTLs so clients pick up moved services quickly.',
    digExample: 'dig _sip._tcp.example.com SRV',
  },
];

/**
 * Cheat-sheet rows: Record | Full name | Purpose | Example.
 * Derived from recordTypes so the data stays single-source.
 * @type {{record:string, fullName:string, purpose:string, example:string}[]}
 */
export const cheatSheet = recordTypes.map((r) => ({
  record: r.type,
  fullName: r.name,
  purpose: r.purpose,
  example: r.example,
}));

/**
 * The closing analogy for the cheat sheet.
 * @type {string}
 */
export const cheatQuote =
  'DNS is the internet\'s phone book — you type google.com, DNS looks up the number (IP), ' +
  'and your browser makes the call.';

/**
 * DNS security topics — threats and protections for the DNS ecosystem.
 * @typedef {Object} DnsSecurityTopic
 * @property {string} name   - topic name
 * @property {string} what   - plain-English description
 * @property {string} why    - why it matters / what it prevents
 * @property {string} enable - how to enable or defend against it
 */
/** @type {DnsSecurityTopic[]} */
export const dnsSecurity = [
  {
    name: 'DNSSEC',
    what: 'Adds cryptographic signatures (DNSKEY, RRSIG) to DNS records so resolvers can verify that an answer genuinely came from the zone owner and was not tampered with in transit.',
    why: 'A validating resolver rejects bogus signed answers when a valid chain of trust is established. DNSSEC does not encrypt queries or protect an unsigned zone as if it were signed.',
    enable: 'Enable signing at your authoritative DNS provider and publish the matching DS through your registrar in the parent zone. Validate the chain before and after changes; a mismatched DS can break resolution.',
  },
  {
    name: 'DNS over HTTPS (DoH)',
    what: 'DNS queries are sent inside ordinary HTTPS requests to a DoH-capable resolver (e.g. 1.1.1.1 or 8.8.8.8), encrypting them so they look like normal web traffic.',
    why: 'Encrypts the client-to-resolver connection against local eavesdropping and modification. The chosen resolver still sees queries; DoH does not guarantee censorship bypass or hide all browsing metadata.',
    enable: 'Configure your browser (Firefox/Chrome) or OS to use a DoH resolver like 1.1.1.1 or dns.google.',
  },
  {
    name: 'DNS over TLS (DoT)',
    what: 'DNS queries travel over a TLS-encrypted TCP connection on port 853 instead of plaintext UDP port 53. Same encryption goal as DoH, different transport.',
    why: 'Encrypts DNS transport to the chosen resolver. Coverage depends on configuration; applications using their own DNS path can bypass a system resolver.',
    enable: 'Configure systemd-resolved, NetworkManager, or dnsmasq to use a DoT upstream on port 853.',
  },
  {
    name: 'DNS Cache Poisoning',
    what: 'An attacker races the real authoritative server by flooding a resolver with forged responses, hoping one matches the query\'s random transaction ID and source port and gets cached as the "answer".',
    why: 'Redirects users to malicious sites while the URL still looks legitimate — a classic phishing vector.',
    enable: 'Use DNSSEC validation, unpredictable transaction IDs, source-port randomization, and strict referral/bailiwick checks. Query-name case randomization (0x20) is a separate technique, not source-port randomization.',
  },
];

/**
 * Practical DNS tips — dig tricks, debugging, common issues, TTL strategy.
 * @typedef {Object} DnsTip
 * @property {string} icon  - emoji shown in the tip badge
 * @property {string} title - short tip title
 * @property {string} text  - tip body (may contain inline HTML like <code>)
 */
/** @type {DnsTip[]} */
export const tips = [
  {
    icon: '💡',
    title: 'Trace the whole delegation path',
    text: 'Run <code>dig +trace example.com</code> to follow the resolver from root → TLD → authoritative, step by step. It is the fastest way to see where a lookup breaks.',
  },
  {
    icon: '🔍',
    title: 'Bypass your local cache',
    text: 'Add <code>+trace</code> or query a public resolver directly: <code>dig @1.1.1.1 example.com</code>. A different answer can reflect caching, split-horizon DNS, geographic routing, or resolver policy; compare TTLs and authoritative answers before diagnosing.',
  },
  {
    icon: '⏱️',
    title: 'Check TTLs before a migration',
    text: 'Lower your TTL to <code>300</code> at least one old-TTL period before a planned IP change. After the switch, raise it back up to cut query load.',
  },
  {
    icon: '🧹',
    title: 'Flush caches when debugging',
    text: 'macOS: <code>sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder</code>. Chrome keeps its own cache too — visit <code>chrome://net-internals/#dns</code> to clear it.',
  },
  {
    icon: '🌐',
    title: 'Verify propagation worldwide',
    text: 'Use <code>dig</code> against multiple resolvers or a service like dnschecker.org. "It works for me" is not propagation — resolvers cache independently.',
  },
  {
    icon: '🔒',
    title: 'Confirm DNSSEC is signing your zone',
    text: 'Run <code>dig +dnssec example.com A</code> and look for the <code>RRSIG</code> record in the answer. RRSIG shows signatures were returned, not that they were validated. An AD flag from a trusted validating resolver or a validation tool gives stronger evidence; missing signatures require further investigation.',
  },
  {
    icon: '📧',
    title: 'Email not arriving? Check MX + SPF',
    text: 'Missing or wrong <code>MX</code> records are the #1 cause of undelivered mail. Then verify <code>TXT</code> SPF (<code>v=spf1 ...</code>) so recipients do not spam-folder you.',
  },
  {
    icon: '🔁',
    title: 'CNAME at the apex is illegal',
    text: 'You cannot put a <code>CNAME</code> on the bare domain (example.com). Use ALIAS/ANAME pseudo-records or A/AAAA records instead — many providers offer a "CNAME flattening" feature for this.',
  },
  {
    icon: '📏',
    title: 'Watch the 512-byte UDP limit',
    text: 'Classic DNS over UDP caps answers at 512 bytes. EDNS allows larger UDP messages. If a response is truncated (TC flag), clients can retry over TCP; allow TCP as well as UDP port 53.',
  },
  {
    icon: '🧪',
    title: 'Pick the right record for the job',
    text: 'Need a redirect? <code>CNAME</code> for subdomains, never at apex. Pointing to a service by name+port? <code>SRV</code>. Proving you own a domain? <code>TXT</code>. Reverse an IP? <code>PTR</code> via your IP provider.',
  },
  {
    icon: '🚑',
    title: '"It works on my phone but not my laptop"',
    text: 'Different devices use different resolvers (Wi-Fi vs cellular). Compare <code>dig example.com</code> on each — a stale NXDOMAIN cached on one resolver is the usual culprit.',
  },
  {
    icon: '📜',
    title: 'Read the SOA serial to spot stale secondaries',
    text: 'The SOA serial should increment on every zone edit. If your secondary nameserver shows an older serial than the primary, zone transfers (AXFR/IXFR) are broken — check <code>allow-transfer</code> and firewall rules.',
  },
];
