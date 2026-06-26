/**
 * TLS / HTTPS module — all data, pure exports. No DOM here.
 * Covers the TLS handshake, certificates, cipher suites, and a cheat sheet.
 */

/**
 * TLS handshake steps (TLS 1.2 baseline; TLS 1.3 merges several of these).
 * @type {{ n: number, name: string, dir: string, payload: string, detail: string, tls13?: string, wiresharkFilter: string, realWorldNote: string }[]}
 */
export const handshakeSteps = [
  {
    n: 1,
    name: 'ClientHello',
    dir: 'Client → Server',
    payload: 'Supported cipher suites, max TLS version, client random',
    detail:
      'The client opens the conversation: "Hi, I speak these ciphers and this TLS version, here is my random number."',
    tls13: 'Same — but also sends key share guess up front to save a round trip.',
    wiresharkFilter: 'tls.handshake.type==1',
    realWorldNote:
      'Open your browser devtools → Security tab to see the negotiated cipher and cert chain. In Wireshark, the ClientHello reveals the SNI (which domain the client wants) — even before encryption starts.'
  },
  {
    n: 2,
    name: 'ServerHello',
    dir: 'Server → Client',
    payload: 'Chosen cipher, TLS version, server random',
    detail:
      'The server picks one cipher and version from the client\'s list and replies with its own random number.',
    tls13: 'Server replies with chosen cipher + its key share in the same flight.',
    wiresharkFilter: 'tls.handshake.type==2',
    realWorldNote:
      'This is where downgrade attacks happen — if an attacker forces a weak cipher/version here, the whole connection is weak. Modern servers refuse to negotiate below TLS 1.2.'
  },
  {
    n: 3,
    name: 'Certificate',
    dir: 'Server → Client',
    payload: 'X.509 certificate chain (contains server public key)',
    detail:
      'Server proves who it is by sending a certificate signed by a CA the client trusts. The public key inside will be used for key exchange / authentication.',
    tls13: 'Certificate sent encrypted (after key share) — less metadata leaks to eavesdroppers.',
    wiresharkFilter: 'tls.handshake.type==11',
    realWorldNote:
      'Click the padlock in your browser → "Certificate" to inspect the chain, validity dates, and SANs (Subject Alternative Names — all domains the cert covers).'
  },
  {
    n: 4,
    name: 'Key Exchange',
    dir: 'Both sides',
    payload: 'Shared secret derived (ECDHE or legacy RSA)',
    detail:
      'Both sides combine their secrets (via ECDHE) to compute the same symmetric session key without ever sending it. RSA key exchange encrypts a pre-master secret to the server\'s public key instead.',
    tls13: 'ECDHE only — RSA key exchange removed for forward secrecy.',
    wiresharkFilter: 'tls.handshake.type==10 || tls.handshake.type==16',
    realWorldNote:
      'ECDHE keys are ephemeral — thrown away after the session. That\'s why capturing traffic today and stealing the server key tomorrow still won\'t decrypt old sessions (forward secrecy).'
  },
  {
    n: 5,
    name: 'Finished',
    dir: 'Both → Each other',
    payload: 'Encrypted "Finished" MAC of the whole handshake',
    detail:
      'Each side sends an encrypted summary of the handshake. If anyone tampered with a message, the MACs won\'t match and the handshake aborts.',
    tls13: 'Combined with the first application flight — 1 round trip total.',
    wiresharkFilter: 'tls.handshake.type==20',
    realWorldNote:
      'If the Finished MAC fails, you get a "SSL handshake failed" / ERR_SSL_PROTOCOL_ERROR. This is TLS catching tampering in the act — the connection dies rather than continuing insecurely.'
  },
  {
    n: 6,
    name: 'Application Data',
    dir: 'Both ways',
    payload: 'Encrypted HTTP / app traffic',
    detail:
      'The handshake is done. From here on, everything is encrypted with the negotiated symmetric cipher (e.g. AES-GCM).',
    tls13: 'Same — but encryption starts earlier, right after key share.',
    wiresharkFilter: 'tls.record.content_type==23',
    realWorldNote:
      'In Wireshark this shows as "Application Data" — opaque bytes you can\'t read without the session key. Some setups export per-session keys (SSLKEYLOGFILE) so Wireshark can decrypt them for debugging.'
  }
];

/** Callout comparing TLS 1.2 vs 1.3 round trips. */
export const tls13Callout =
  'TLS 1.3 cuts this to 1 round-trip (vs 2 in TLS 1.2) by combining steps. Faster, more secure, no more RSA key exchange.';

/** Mnemonic for the handshake flow. */
export const handshakeMnemonic =
  '"Hello, Hello, Cert, Key, Done, Go!" — greet, greet, prove identity, agree on a secret, confirm, then talk.';

/**
 * Certificate concepts for the collapsible-cards tab.
 * @type {{ title: string, body: string, tags?: string[], funFact: string, command: string }[]}
 */
export const certificateCards = [
  {
    title: 'What is a certificate?',
    body:
      'A digital document that binds a public key to an identity (a domain, organization, or person). It lets a client verify "this public key really belongs to example.com" before encrypting anything.',
    tags: ['X.509', 'public key', 'identity'],
    funFact:
      'An X.509 certificate is just a structured text file (PEM = base64 of ASN.1 DER). You can read its raw contents with `cat` — it starts with "-----BEGIN CERTIFICATE-----".',
    command: 'openssl x509 -in cert.pem -text -noout'
  },
  {
    title: 'Certificate chain',
    body:
      'Root CA → Intermediate CA → End-entity certificate. Your browser trusts the Root CA (shipped with the OS), which signs the Intermediate, which signs your cert. Verification walks the chain top-down and checks every signature.',
    tags: ['Root CA', 'Intermediate', 'End-entity'],
    funFact:
      'Let\'s Encrypt issues over 300 million certificates — more than all other CAs combined. Their root, "ISRG Root X1", is trusted by every major OS and browser.',
    command: 'openssl s_client -connect google.com:443 -showcerts'
  },
  {
    title: 'Certificate Authority (CA)',
    body:
      'A trusted third party that verifies identity and issues certificates. Browsers and OSes ship a list of trusted root CAs. Examples: Let\'s Encrypt (free, automated), DigiCert, Sectigo, GlobalSign.',
    tags: ['Let\'s Encrypt', 'DigiCert', 'Sectigo'],
    funFact:
      'Your OS ships ~150 trusted root CAs. Any one of them (or their intermediates) can issue a cert for any domain — which is why CA trust failures (e.g. DigiNotar, 2011) are catastrophic.',
    command: 'openssl s_client -connect example.com:443 -showcerts < /dev/null 2>/dev/null | openssl x509 -text -noout'
  },
  {
    title: 'Validation levels',
    body:
      'DV (Domain Validation) — proves you control the domain; fast, free, the norm for the web. OV (Organization Validation) — verifies the org behind the domain. EV (Extended Validation) — strictest checks; once gave a "green bar" in browsers, now deprecated.',
    tags: ['DV', 'OV', 'EV'],
    funFact:
      'The EV "green bar" was killed in 2019 — Chrome and Firefox removed the special UI because users didn\'t notice it anyway. Today DV certs protect ~95% of the web, including most banks.',
    command: 'openssl x509 -in cert.pem -text -noout | grep -A2 "Subject:"'
  },
  {
    title: 'Expiry & renewal',
    body:
      'Certificates expire — Let\'s Encrypt certs last 90 days, typical paid certs 1 year (max 398 days per CA/B rules). They must be renewed before expiry or browsers show a scary warning. ACME automates this.',
    tags: ['90 days', 'renewal', 'ACME'],
    funFact:
      'The 398-day max (down from 5 years in 2015) exists because shorter certs limit the damage of a key compromise. Apple now pushes for a 47-day max by 2029 — the trend is "expire fast, renew often".',
    command: 'openssl x509 -in cert.pem -noout -dates'
  }
];

/** Passport analogy for certificates. */
export const certificateAnalogy =
  'A certificate is like a passport — a trusted authority (CA = government) verifies your identity and issues a document others can trust without having met you.';

/**
 * Cipher suite components.
 * @type {{ title: string, realWorldExample: string, options: { name: string, note: string, good?: boolean, bad?: boolean }[] }[]}
 */
export const cipherComponents = [
  {
    title: 'Key exchange',
    realWorldExample:
      'ECDHE with X25519 is the default in TLS 1.3 — used by Google, Cloudflare, and every modern browser. X25519 is a specific elliptic curve designed by Daniel Bernstein.',
    options: [
      { name: 'ECDHE', note: 'Elliptic-curve Diffie-Hellman. Gives forward secrecy.', good: true },
      { name: 'RSA', note: 'No forward secrecy; removed in TLS 1.3.', bad: true }
    ]
  },
  {
    title: 'Authentication',
    realWorldExample:
      'ECDSA with P-256 is what Let\'s Encrypt issues by default — smaller signatures, faster verification. RSA-2048 is still common for older clients and enterprise CAs.',
    options: [
      { name: 'RSA', note: 'Classic, widely supported signature algorithm.' },
      { name: 'ECDSA', note: 'Elliptic-curve signatures — smaller, faster.' }
    ]
  },
  {
    title: 'Encryption (bulk)',
    realWorldExample:
      'AES-256-GCM is used by TLS 1.3, your bank\'s website, and Signal. ChaCha20-Poly1305 is the default on Android and iOS when hardware AES isn\'t available.',
    options: [
      { name: 'AES-GCM', note: 'AEAD — authenticated encryption, fast with hardware.', good: true },
      { name: 'ChaCha20-Poly1305', note: 'AEAD, mobile-friendly when no AES hardware.', good: true },
      { name: 'AES-CBC', note: 'Older, vulnerable to padding oracle attacks.', bad: true }
    ]
  },
  {
    title: 'MAC / integrity',
    realWorldExample:
      'Poly1305 paired with ChaCha20 powers WireGuard and TLS 1.3 on mobile. SHA-256 inside AES-GCM is invisible to users but protects trillions of connections daily.',
    options: [
      { name: 'Poly1305', note: 'Paired with ChaCha20 — fast, modern.' },
      { name: 'SHA-256', note: 'Used inside AEAD constructions.' },
      { name: 'SHA-1', note: 'Broken — removed in TLS 1.3.', bad: true }
    ]
  }
];

/** Forward secrecy explanation. */
export const forwardSecrecy =
  'Forward secrecy: each session uses a unique ephemeral key. If the server\'s long-term private key leaks later, past recorded sessions stay safe — attackers can\'t decrypt old traffic.';

/** Algorithms removed in TLS 1.3. */
export const tls13Removed = [
  'RSA key exchange',
  'CBC mode',
  'SHA-1',
  'Static DH',
  'RC4',
  'MD5'
];

/** Mnemonic for a cipher suite name. */
export const cipherMnemonic =
  'A cipher suite name reads like a recipe: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 = exchange _ auth _ WITH _ cipher _ mode _ hash.';

/**
 * Cheat sheet rows: Concept | What it does | Why it matters.
 * @type {{ concept: string, does: string, matters: string }[]}
 */
export const cheatRows = [
  {
    concept: 'TLS',
    does: 'Wraps TCP traffic in encryption + integrity + identity.',
    matters: 'Keeps data confidential and tamper-proof in transit.'
  },
  {
    concept: 'HTTPS',
    does: 'HTTP over TLS (port 443).',
    matters: 'The secure version of the web — what the padlock means.'
  },
  {
    concept: 'Handshake',
    does: 'Negotiates cipher, verifies certs, derives session key.',
    matters: 'Sets up the encrypted channel before any app data flows.'
  },
  {
    concept: 'Certificate',
    does: 'Binds a public key to an identity, signed by a CA.',
    matters: 'Proof you\'re talking to the real site, not an impostor.'
  },
  {
    concept: 'CA',
    does: 'Trusted third party that issues and signs certificates.',
    matters: 'The root of trust browsers rely on to verify sites.'
  },
  {
    concept: 'Cipher suite',
    does: 'Bundle of algorithms for exchange, auth, encryption, MAC.',
    matters: 'Determines the strength and speed of the connection.'
  },
  {
    concept: 'Forward secrecy',
    does: 'Unique session keys via ECDHE.',
    matters: 'Past traffic safe even if long-term key leaks later.'
  },
  {
    concept: 'AEAD (AES-GCM)',
    does: 'Encrypts and authenticates in one operation.',
    matters: 'No separate MAC needed; fast and secure.'
  },
  {
    concept: 'HSTS',
    does: 'Header forcing browsers to use HTTPS, no downgrade.',
    matters: 'Blocks SSL-stripping man-in-the-middle attacks.'
  },
  {
    concept: 'TLS 1.3',
    does: 'Modern handshake in 1 round trip; removes weak crypto.',
    matters: 'Faster page loads and a smaller attack surface.'
  }
];

/** Closing blockquote for the cheat sheet. */
export const cheatQuote =
  'HTTPS is HTTP wearing a seatbelt — TLS wraps your traffic in encryption and identity verification so nobody can read or tamper with it in transit.';

/**
 * TLS/SSL version comparison.
 * @type {{ version: string, year: number, status: string, note: string }[]}
 */
export const tlsVersions = [
  { version: 'SSL 3.0', year: 1996, status: 'Deprecated (POODLE attack)', note: 'Do not use. Completely broken.' },
  { version: 'TLS 1.0', year: 1999, status: 'Deprecated (BEAST, CRIME)', note: 'Disabled by default in modern browsers.' },
  { version: 'TLS 1.1', year: 2006, status: 'Deprecated', note: 'Rarely seen. Removed from browsers in 2020.' },
  { version: 'TLS 1.2', year: 2008, status: 'Still widely used', note: 'Added AEAD ciphers (AES-GCM). Most sites still use this.' },
  { version: 'TLS 1.3', year: 2018, status: 'Current standard', note: '1-RTT handshake (vs 2-RTT), removed RSA/CBC/SHA-1, mandatory forward secrecy.' }
];

/**
 * Historical TLS/SSL attacks — what broke, how, and the fix.
 * @type {{ name: string, year: number, targets: string, how: string, fix: string }[]}
 */
export const tlsAttacks = [
  { name: 'POODLE', year: 2014, targets: 'SSL 3.0', how: 'Downgrade attack exploiting CBC padding oracle', fix: 'Disable SSL 3.0' },
  { name: 'Heartbleed', year: 2014, targets: 'OpenSSL 1.0.1', how: 'Buffer over-read in TLS heartbeat extension leaks private keys', fix: 'Patch OpenSSL, revoke and reissue certs' },
  { name: 'BEAST', year: 2011, targets: 'TLS 1.0 CBC', how: 'Exploits predictable IVs in CBC mode', fix: 'Use TLS 1.1+ or RC4 (now also broken)' },
  { name: 'CRIME', year: 2012, targets: 'TLS compression', how: 'Attacker observes compressed request sizes to steal cookies', fix: 'Disable TLS compression' },
  { name: 'Logjam', year: 2015, targets: 'DH key exchange', how: 'Downgrades to weak 512-bit export-grade DH', fix: 'Use ECDHE, disable export ciphers' }
];

/**
 * Practical TLS tips — debugging, openssl, cert management, testing.
 * @type {{ icon: string, title: string, text: string }[]}
 */
export const tips = [
  {
    icon: '🔍',
    title: 'Inspect a live site\'s cert chain',
    text:
      'Run <code>openssl s_client -connect example.com:443 -showcerts</code> to dump every cert the server sends, plus the negotiated cipher and TLS version. End the session with <code>Q</code> or <code>Ctrl+C</code>.'
  },
  {
    icon: '⏱️',
    title: 'Check cert expiry before it bites you',
    text:
      '<code>openssl x509 -in cert.pem -noout -dates</code> prints <code>notBefore</code> and <code>notAfter</code>. Pair with a monitoring check (or <code>certbot renew --dry-run</code>) so renewals never silently fail.'
  },
  {
    icon: '🧪',
    title: 'Test your site with SSL Labs',
    text:
      'Point <code>https://www.ssllabs.com/ssltest/</code> at your domain for a free grade (A+ is the goal). It checks cipher suites, protocol support, HSTS, and known weaknesses — the industry-standard external scan.'
  },
  {
    icon: '🚫',
    title: 'ERR_CERT_AUTHORITY_INVALID explained',
    text:
      'Browser doesn\'t trust the issuer. On localhost, use <code>mkcert</code> to install a local CA. In production, make sure the full chain (intermediate + leaf) is served — a common nginx misstep is sending only the leaf cert.'
  },
  {
    icon: '🔒',
    title: 'Force HTTPS with HSTS',
    text:
      'Send <code>Strict-Transport-Security: max-age=63072000; includeSubDomains; preload</code> so browsers refuse plain HTTP for your domain. Submit to the HSTS preload list at <code>hstspreload.org</code> to lock it in for all users.'
  },
  {
    icon: '🛠️',
    title: 'Debug "handshake failed" errors',
    text:
      'Use <code>openssl s_client -connect host:443 -tls1_2</code> (or <code>-tls1_3</code>) to force a version, and <code>-cipher</code> / <code>-ciphersuites</code> to pin a suite. Binary-search the failing algorithm instead of guessing.'
  },
  {
    icon: '📜',
    title: 'Read a cipher suite name like a pro',
    text:
      '<code>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</code> = exchange (ECDHE) _ auth (RSA) _ WITH _ cipher (AES-128) _ mode (GCM) _ hash (SHA256). TLS 1.3 dropped the verbose naming — suites are now just <code>TLS_AES_128_GCM_SHA256</code>.'
  },
  {
    icon: '♻️',
    title: 'Automate renewal with ACME',
    text:
      '<code>certbot renew</code> in a weekly cron / systemd timer handles Let\'s Encrypt\'s 90-day certs. Always run <code>--dry-run</code> first — it validates the challenge without hitting rate limits.'
  },
  {
    icon: '🎯',
    title: 'Pick cipher suites the modern way',
    text:
      'Let the server pick (disable client-side preference) and list only TLS 1.3 suites plus a few strong TLS 1.2 ones (ECDHE + AES-GCM / ChaCha20). Mozilla\'s SSL Configuration Generator at <code>mozilla.github.io/server-side-tls/ssl-config-generator</code> gives ready-to-paste configs.'
  },
  {
    icon: '🌐',
    title: 'Verify SNI is working',
    text:
      'Multiple certs on one IP need SNI. Test with <code>openssl s_client -connect host:443 -servername example.com</code> — omit <code>-servername</code> and you\'ll get the default (wrong) cert. Most "wrong cert served" bugs are missing SNI.'
  },
  {
    icon: '🧬',
    title: 'Decode a cert without OpenSSL',
    text:
      'Paste a PEM into <code>https://certlogik.com/decoder</code> or run <code>openssl x509 -in cert.pem -text -noout</code> to see subject, issuer, SANs, key usage, and extensions. SANs (not the Common Name) are what modern browsers actually check.'
  },
  {
    icon: '⚠️',
    title: 'Watch the common TLS footguns',
    text:
      'Serving the leaf only (no chain), mixed-content over HTTP on an HTTPS page, expired intermediates, SHA-1 chains, and <code>SSLv3</code> left enabled "for old clients". Run <code>nmap --script ssl-enum-ciphers -p 443 host</code> to catch them all at once.'
  }
];
