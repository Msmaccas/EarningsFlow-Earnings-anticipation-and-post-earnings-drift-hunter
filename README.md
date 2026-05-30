# EarningsFlow

EarningsFlow is a research and observation tool for active traders, small funds and serious solo operators who want to understand how companies’ quarterly earnings events translate into actionable opportunities.  Unlike generic backtesters and research portals, EarningsFlow focuses on the **entire earnings lifecycle**: preparing before the print, classifying the market’s reaction and monitoring post‑event drift.  It structures raw data into entities, applies a **multi‑agent workflow** to extract insight and produces reproducible boards, reaction anatomy pages and a persistent event ledger.

## Use case

During earnings season dozens of companies report each day.  Traders must decide which names are worth monitoring, what constitutes a surprise, whether the market’s reaction is justified and whether follow‑through is likely.  EarningsFlow turns the firehose of earnings data into ranked lists with explanations:

* **Anticipation mode** scans upcoming earnings dates, compares consensus estimates to prior quarters, evaluates price base health and crowding risk, and classifies events as `WORTH_STALKING`, `AVOID_CROWDING`, `WATCH_POST_PRINT`, `IGNORE` or `UNKNOWN`.
* **Reaction mode** ingests actual results and market moves, computes EPS and revenue surprise, compares price reaction to the magnitude of the surprise, and classifies the move as `JUSTIFIED`, `UNDERREACTED`, `OVERREACTED`, `AMBIGUOUS` or `UNKNOWN`.
* **Drift mode** measures post‑event drift over subsequent sessions and labels each case as `FOLLOW_THROUGH`, `FADE`, `AMBIGUOUS` or `UNKNOWN`.

The system writes a report and JSON ledger for each run so that future quarters can build on historical observations.  Fixtures and tests include canonical cases such as a clean beat and hold, a beat‑and‑fade, a miss‑but‑rip due to guidance, and a big move with low information value.

## Repository layout

This monorepo follows a layered architecture:

```
EarningsFlow/
  packages/
    core/            // domain entities and analysis logic
    data/            // data ingestion and fixture handling
    workflows/       // high‑level pipelines for anticipation, reaction and drift
    reports/         // markdown and JSON report generation
    server/          // Express API and simple dashboard
    worker/          // scheduled jobs for nightly processing
  scripts/
    smoke.ts         // deterministic smoke script
  fixtures/          // sample upcoming and results events used by tests & smoke
  research/          // competitor analysis and benchmark ladder
  tests/             // unit tests for core analysis
  README.md, PRODUCT.md, DEMO.md, PRICING.md, AGENTS.md
  package.json       // monorepo root with workspace configuration
  jest.config.js     // jest test runner configuration
  tsconfig.*         // TypeScript build configurations
  .github/workflows/ // CI configuration
```

## Getting started

EarningsFlow uses **Node.js** and **TypeScript** with workspaces.  To install dependencies and build from a clean clone:

```bash
# from the `EarningsFlow` directory
npm install         # install workspace links (no external network fetches)
npm run build       # compile TypeScript packages and scripts
npm test            # run unit tests using Node’s built‑in test runner
npm run smoke       # run the smoke script on the provided fixtures
npm start           # start the HTTP API server and dashboard
```

### Environment variables

Configuration is driven entirely by environment variables.  No secrets are hard‑coded.  You can set these variables in a `.env` file or export them in your shell:

| Variable | Description | Default |
| --- | --- | --- |
| `FIXTURE_DIR` | Path to directory containing `upcoming_events.json` and `results_events.json`. | `fixtures` |
| `REPORT_DIR` | Directory where the worker writes markdown reports and JSON ledgers. | `generated_reports` |
| `SMOKE_OUTPUT_DIR` | Directory where the smoke script writes outputs. | `smoke_output` |
| `PORT` | Port for the HTTP API server. | `3000` |
| `SCHEDULE_INTERVAL_MS` | Interval in milliseconds between successive runs of the worker jobs when running in daemon mode. | `86400000` (24 hours) |

### Commands

| Script | Purpose |
| --- | --- |
| `npm run build` | Compile all TypeScript packages under `packages/**` and the smoke script using project references.  Each package emits compiled JavaScript into its own `dist/` directory. |
| `npm test` | Execute unit tests defined in `tests/` using Node’s built‑in test runner to verify core domain logic. |
| `npm run smoke` | Run the smoke pipeline on the sample fixtures.  This seeds upcoming events, generates a prep board, processes results, and writes markdown and JSON reports to `smoke_output`.  The script logs progress and highlights classification outcomes. |
| `npm start` | Launch the built‑in HTTP API server.  The API exposes `/api/prep-board`, `/api/reaction-board`, `/api/drift-board`, `/dashboard` and `/healthz`.  The server is dependency‑free and uses Node’s `http` module. |
| `npm run worker` | Start the worker daemon.  The worker runs all three jobs immediately and then repeats them every `SCHEDULE_INTERVAL_MS` milliseconds.  Pass `once` as the first argument to run each job a single time for testing (e.g. `npm run worker -- once`). |

### API examples

When the server is running on `localhost:3000` the following endpoints are available:

* `GET /api/prep-board` – returns a JSON array of prep board items sorted by surprise potential.
* `GET /api/reaction-board` – returns reaction items for completed events.
* `GET /api/drift-board` – returns drift items summarizing post‑event performance.
* `GET /dashboard` – serves an HTML page that displays the latest markdown reports.
* `GET /healthz` – simple health check returning `{ status: 'ok' }`.

These endpoints are read‑only; the application does not accept or execute trading instructions and does **not** provide financial advice.

## Interpretation and limitations

EarningsFlow is a **research tool**.  It ranks names based on heuristics derived from consensus estimates, price action and simple ratio rules.  The classifications (`WORTH_STALKING`, `JUSTIFIED`, `FOLLOW_THROUGH`, etc.) are descriptive rather than predictive.  **No trading or investment recommendations are made.**  Users should treat the outputs as an organized starting point for their own analysis and consult professional advisers before acting on any information.

Limitations include:

* **Data quality** – The fixtures and any live data feed may contain errors or omissions.  The system uses `UNKNOWN` or `MANUAL_REVIEW` states when information is missing.  All inputs are treated as untrusted and parsed defensively.
* **Simplistic heuristics** – Surprise potential is estimated using a simple difference between expected and prior EPS.  Reaction classification uses ratio thresholds.  These rules may not capture all market subtleties.
* **No real‑time connectivity** – EarningsFlow is designed to run daily or around market closes.  It does not stream intraday prices or options data.
* **Limited multi‑asset support** – The current implementation focuses on equity earnings.  Adding macro events, FX or commodities would require extending the entity definitions and analysis logic.

## Roadmap

Future iterations might include:

* **Live data adapters** for pulling real earnings calendars, consensus estimates and option implied moves.
* **Voice‑to‑text integration** to automatically fetch and analyse transcripts when available, falling back gracefully when not.
* **Options context** to compare price reactions against implied moves and open interest.
* **Peer and sector scoring** to adjust surprise potential based on industry trends.
* **User interface enhancements** – interactive dashboards with filters and alerts.
* **Automation of data ingestion** through connectors into brokerage or market‑data APIs while maintaining strict security and configuration via environment variables.

EarningsFlow is open for improvement.  Contributions to extend the analysis logic, improve testing, or integrate additional data sources are welcome (see `CONTRIBUTING.md` when available).