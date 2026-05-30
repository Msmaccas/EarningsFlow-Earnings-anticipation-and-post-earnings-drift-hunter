# Demo Walkthrough

This demo shows how **EarningsFlow** operates end‑to‑end on the provided fixtures.  The goal is to illustrate the anticipated board, reaction classification and drift analysis without requiring any external data sources.  All commands assume you are in the repository root and have run `npm ci` and `npm run build`.

## Step 1 – run the smoke script

```bash
npm run smoke
```

This script performs the following tasks:

1. Loads upcoming events from `fixtures/upcoming_events.json` and builds an **anticipation prep board**.  It calculates each event’s surprise potential (difference between expected and prior EPS), adjusts for crowding and base quality, and assigns a prep category.
2. Loads results from `fixtures/results_events.json` and builds a **reaction board**.  It computes EPS surprise and price reaction, compares them to ratio thresholds and classifies each event as `JUSTIFIED`, `UNDERREACTED`, `OVERREACTED` or `AMBIGUOUS`.  A simple reaction anatomy summary is printed for each ticker.
3. Computes **drift** by measuring subsequent price changes and classifies each case as `FOLLOW_THROUGH`, `FADE` or `AMBIGUOUS`.
4. Writes markdown reports and JSON ledgers to the directory defined by `SMOKE_OUTPUT_DIR` (default `smoke_output`).

At the end of the run you will see console output similar to the following (abbreviated for brevity):

```
Loaded 4 upcoming events from fixtures/upcoming_events.json
Generated anticipation board with 4 items
- ABC – WORTH_STALKING (surprisePotential = 0.3, base = 0.8, crowding = 0.3)
- DEF – WATCH_POST_PRINT (surprisePotential = 0.2, base = 0.6, crowding = 0.1)
- GHI – WATCH_POST_PRINT (surprisePotential = 0.1, base = 0.7, crowding = 0.2)
- JKL – AVOID_CROWDING (surprisePotential = 0.02, crowding = 0.5)

Loaded 4 result events from fixtures/results_events.json
Generated reaction board with 4 items
- ABC – JUSTIFIED (surprise = 0.3, priceReaction = 0.12)
- DEF – UNDERREACTED (surprise = 0.5, priceReaction = 0.08)
- GHI – AMBIGUOUS (surprise = -0.2, priceReaction = 0.05)
- JKL – OVERREACTED (surprise = 0.02, priceReaction = 0.10)

Generated drift board with 4 items
- ABC – FOLLOW_THROUGH (drift = 0.07)
- DEF – FADE (drift = -0.05)
- GHI – FOLLOW_THROUGH (drift = 0.10)
- JKL – FADE (drift = -0.08)

Reports written to smoke_output/...
```

## Step 2 – inspect the reports

Navigate to the directory specified by `SMOKE_OUTPUT_DIR` (default `smoke_output`).  You will find three files:

* `prep_report.md` – Markdown table listing each upcoming event, its surprise potential, crowding risk and assigned category, along with bullet‑point reasons for the classification.
* `reaction_report.md` – Markdown table summarizing actual EPS surprises, price reactions and classification for each completed event, followed by explanatory notes.
* `drift_report.md` – Markdown table showing post‑event drift and classification for each ticker, with notes on whether the move held or faded.
* `prep_ledger.json`, `reaction_ledger.json`, `drift_ledger.json` – JSON files containing the same information with timestamps, raw metrics, categories, reasons and confidence flags.

Open `prep_report.md` in a text viewer to see something like:

```
| Ticker | Date | Surprise Potential | Crowding Risk | Category |
| --- | --- | --- | --- | --- |
| ABC | 2024‑05‑01 | 0.30 | 0.30 | WORTH_STALKING |
| DEF | 2024‑05‑03 | 0.20 | 0.10 | WATCH_POST_PRINT |
| GHI | 2024‑05‑05 | 0.10 | 0.20 | WATCH_POST_PRINT |
| JKL | 2024‑05‑07 | 0.02 | 0.50 | AVOID_CROWDING |

Reasons:

* **ABC** – High surprise potential relative to prior quarter, strong base structure, moderate crowding.
* **DEF** – Moderate surprise potential with low crowding; base not strong enough to justify immediate stalking.
* **GHI** – Small negative prior surprise and moderate crowding; better to watch post‑print.
* **JKL** – Low expected surprise and high crowding risk despite a strong base; avoid stalking going into the print.
```

## Step 3 – launch the API and dashboard

To explore the boards via HTTP, start the server:

```bash
npm start
```

By default the server listens on `http://localhost:3000`.  Open `http://localhost:3000/dashboard` in a browser to see the latest markdown reports rendered in the page.  You can also fetch JSON data from the API endpoints, e.g. `curl http://localhost:3000/api/reaction-board`.

## Step 4 – run the worker (optional)

The worker schedules anticipation, reaction and drift jobs on daily cron expressions.  To run the worker in one‑shot mode for testing:

```bash
npm run worker -- --once
```

This will perform a single run of each job using the current fixtures and write reports to `REPORT_DIR` (default `reports_out`).

## Extension ideas

To integrate real data, modify the `packages/data` module to fetch upcoming earnings calendars and results from an API or database.  You can also implement the transcript and options agents by connecting to a transcript provider or options analytics platform.  See `PRODUCT.md` and the roadmap in `README.md` for more suggestions.