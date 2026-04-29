# Ideal Builders — House Build Checklist

A self-contained construction-tracking dashboard for managing builds across multiple houses.

## What's in this package

- `index.html` — the entire app: a single self-contained HTML file with inlined CSS and JavaScript. No build step, no external dependencies.

## What it does

- **Checklist tab** — every house is a column, every construction task is a row. Check tasks off manually or let the Slack auto-sync do it for you. Notes can be attached to any task. Houses, sections, and items are all editable inline.
- **Summary tab** — one card per house with a progress bar, a list of completed tasks (grouped by phase), and any linked Google Drive documents that match the house's address.
- **Costs tab (one per house)** — full Estimate vs Paid breakdown by category, plus Lot cost, Sales Price, and an auto-calculated Profit. Categories are shared across houses and editable inline.

## Integrations

The app calls out to three Cowork MCP tools when run inside Cowork:

- `slack_search_channels` and `slack_read_channel` — auto-checks tasks based on Slack updates from your build channels (one channel per house, configurable via the channel name field at the top of each column)
- `search_files` (Google Drive) — finds documents that mention each house's number AND street name, with per-house exclude/restore for false positives

If you open the file outside Cowork (e.g., directly in a browser), the integrations are no-ops but the checklist, notes, and cost tracking still work — everything persists in `localStorage` under the key `house-build-checklist-v2`.

## To run locally

Just open `index.html` in any modern browser. State is stored in browser localStorage, so opening it on a different machine starts fresh.

## To deploy as a Cowork artifact

The first 17 lines contain a `cowork-artifact-meta` JSON block declaring the MCP tools and server names this artifact uses. When uploaded to Cowork, these wire up the connector calls automatically.
