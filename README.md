# aandjtech-landing

Static site for **aandjtech.com** — the A&J Tech app hub. Built with plain HTML/CSS + Express server for subdomain routing and waitlist API. Deployed on Railway.

## Structure

```
/
├── index.html              # Hub page — all apps listed
├── apps/
│   ├── rockhound/index.html    # Per-app landing pages (8 apps)
│   ├── fossilref/index.html
│   ├── fieldbuddy/index.html
│   ├── wildforage/index.html
│   ├── knotref/index.html
│   ├── herpetoguide/index.html
│   ├── trackref/index.html
│   └── shellref/index.html
├── privacy/                # Per-app privacy policy pages
├── robots.txt
├── sitemap.xml
├── server.js               # Express server (subdomain routing + waitlist API)
└── railway.json            # Railway deployment config
```

## Deployment

Railway auto-deploys from `main` branch. The server listens on `process.env.PORT` (default 3000) and serves:
- Root domain → hub index
- Subdomains (e.g. `rockhound.aandjtech.com`) → per-app pages via `apps/<slug>/index.html`
- `/.well-known/` → assetlinks.json for Android App Links

## SEO

- **sitemap.xml** includes all hub, app, and privacy pages. Referenced in robots.txt.
- **Canonical URLs** on every page.
- **Open Graph + Twitter Card** meta tags on hub and all app pages.
- **Structured data** (JSON-LD) on hub page (Organization schema).
- Per-app page titles/descriptions aligned with live ASO metadata from Play Console listings (AAN-1275/AAN-1293).

## UTM Tag Convention

All Play Store links from the hub and app pages use UTM parameters for install attribution:

```
utm_source=aandjtech-hub
utm_medium=web
utm_campaign=<app-name>          # e.g. rockhound, fossilref, fieldbuddy
utm_content=<placement>          # featured-card, mini-card, download-cta
```

### Placement values

| Placement        | Where                                       |
|------------------|---------------------------------------------|
| `featured-card`  | Hub index — featured app card Play button   |
| `mini-card`      | Hub index — "More Apps" compact card link   |
| `download-cta`   | Per-app page — download CTA Play badge      |

### Example

```
https://play.google.com/store/apps/details?id=com.rockhound.app
  &utm_source=aandjtech-hub
  &utm_medium=web
  &utm_campaign=rockhound
  &utm_content=featured-card
```

This lets Google Play Console attribute installs back to the hub page vs. per-app pages.

## Google Play Badge

All Play Store links use the official Google Play badge image:
`https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png`

## Adding a new app page

1. Create `apps/<slug>/index.html` from an existing app page template.
2. Add the app to `sitemap.xml`.
3. Add subdomain routing in `server.js` `APP_SUBDOMAINS` map.
4. UTM-tag the Play Store link per the convention above.