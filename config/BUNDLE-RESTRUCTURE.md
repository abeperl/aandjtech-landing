# Catalog Restructure: Tiered Offers (AAN-685)

Generated 2026-06-10 from live API pulls. Context: May 2026 report (AAN-683) — entire
catalog has **0 lifetime sales**. Strategy: collapse flat catalog into tiered offers per
theme: free lead magnet → $4.99–$9.99 singles → $19–$29 theme bundle.

Catalog sizes at generation time (live API, not the stale issue numbers):
- **Gumroad: 165 published SKUs**, 0 sales (`gumroad-bundle-restructure.json`)
- **LemonSqueezy: 169 published + 15 drafts** (`ls-bundle-restructure.json`)

## Tier rules

| Tier | Rule |
|---|---|
| Free | 1 lead magnet per theme, price $0(+), email capture feeds Kit list |
| Single | $4.99–$9.99 band; out-of-band prices clamped to $9.99 (or $4.99 floor) |
| Bundle | 1 new native Gumroad bundle per theme at $19–$29 containing all theme SKUs |
| Premium | 5 existing premium products (Notion Business OS line, Starter Bundle) keep current price |

## Themes (Gumroad)

| Theme | SKUs | Bundle price | Singles value | Free lead magnet |
|---|---|---|---|---|
| Events & Celebrations | 13 | $19 | ~$100 | Party Planning Checklist |
| Creator & Marketing Studio | 26 | $29 | ~$221 | Social Media Content Calendar |
| Business & Freelance Toolkit | 34 | $29 | ~$275 | Small Business Invoice Template PDF |
| Health & Wellness | 26 | $24 | ~$195 | Printable Daily Gratitude Journal |
| Home & Family Organization | 38 | $29 | ~$281 | Home Cleaning Schedule & Chore Checklist |
| Planner & Productivity Vault | 22 | $24 | ~$166 | Daily Habit Tracker (30-Day Challenge) |
| Printable Wall Art Gallery | 6 | $19 | ~$47 | Minimalist Botanical SVG Set of 4 |

7 themes, not 6 — wall art is a distinct buyer intent and makes a clean low-ticket bundle.

## LemonSqueezy mirror

Same 7 themes; 11 LS-only products (SaaS/dev kits) manually assigned to business/creator/planner.
Art theme has only 1 LS SKU → no art bundle on LS (6 bundles there).
Constraints: LS API is GET-only for products — every change is dashboard work. LS has no
native bundle product type — each bundle is a new product whose files are the combined archive.

## Execution notes

- Gumroad API supports no price edits or bundle creation → dashboard/browser automation.
- Gumroad native bundles: Products → New → Bundle, select existing products. Creating the 7
  bundle products is the deliverable; "no new SKUs" applies to singles.
- Free tier on Gumroad: set price to $0+; configure Gumroad→Kit integration so free
  downloads land on the Kit email list.
- Per-SKU actions (165 + 169 rows) live in the two JSON files next to this doc.
