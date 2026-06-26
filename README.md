# NetOne

Interactive networking & security reference, built for engineers learning networking from the ground up — the funny and easy way.

Vanilla JS + Vite. No frameworks, no UI libraries. Dark mode via `prefers-color-scheme`, no JS theme toggle.

## Modules
- [x] **OSI Model** — 7 layers with real-world examples, deep dives, fun facts; data journey; attacks with severity & real incidents; cheat sheet; tips & tricks
- [x] **IP & Subnetting** — IPv4/IPv6 headers, subnetting math with worked examples, private vs public with security notes, cheat sheet, tips & tricks
- [x] **DNS Deep Dive** — hierarchy with dig commands, resolution flow, record types with TTL notes, security (DNSSEC/DoH/DoT), cheat sheet, tips & tricks
- [x] **TCP/UDP Internals** — TCP vs UDP with header fields, handshake with Wireshark filters, TCP states with debugging commands, congestion control (CUBIC/BBR), cheat sheet, tips & tricks
- [x] **TLS / HTTPS** — handshake with Wireshark filters, certificates with openssl commands, cipher suites, versions & historical attacks (POODLE/Heartbleed/BEAST), cheat sheet, tips & tricks
- [x] **Firewalls & NAT** — firewall types with real products, NAT types, port forwarding with iptables, rules & troubleshooting, cheat sheet, tips & tricks

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build locally
```

## Deploy to Vercel
1. Push this repo to GitHub.
2. Import the repo in Vercel — it auto-detects Vite.
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy. Vercel builds and hosts on a free plan, auto-deploying on every push to `main`.

## Add a new module
1. Create `src/modules/<id>/` with:
   - `index.js` — exports `{ id, label, icon, render(container) }`
   - `data.js` — pure data exports
   - one file per tab
2. Register it in `src/main.js`:
   ```js
   import ip from './modules/ip/index.js';
   const modules = [osi, ip]; // add here
   ```
3. Done. The new module shows up in the nav automatically.

See `.devin/skills/netsec-module/SKILL.md` for the full module contract and `.devin/skills/netsec-design-system/SKILL.md` for the design tokens every module must use.

## Project structure
```
netone/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.js              # app shell, router, module registry
    ├── style.css            # design tokens + reset (light/dark)
    ├── components/
    │   ├── Tabs.js          # lazy-rendered, cached tablist
    │   ├── ExpandCard.js    # collapsible card (lazy body)
    │   └── LayerBadge.js    # colored layer pill
    └── modules/
        ├── osi/             # OSI Model (5 tabs)
        ├── ip/              # IP & Subnetting (5 tabs)
        ├── dns/             # DNS Deep Dive (6 tabs)
        ├── tcp-udp/         # TCP/UDP Internals (6 tabs)
        ├── tls/             # TLS / HTTPS (6 tabs)
        └── firewalls-nat/   # Firewalls & NAT (6 tabs)
```

## Author

**tal7aouy** — [github.com/tal7aouy](https://github.com/tal7aouy)

## License

MIT — see [LICENSE](./LICENSE)
