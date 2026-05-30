# Agents & Operational Guide

EarningsFlow uses a **multi‑agent workflow** inspired by real trading desks.  Each agent has a narrow responsibility and produces interpretable outputs that are combined into the final board or reaction page.  This document describes those agents and defines the criteria for running, building, verifying and completing the system.

## Agent Roles

| Agent | Responsibilities | Inputs | Outputs |
| --- | --- | --- | --- |
| **Numbers Agent** | Reads consensus estimates, actual results and prior quarter data.  Computes the raw EPS and revenue surprise and normalizes them.  Flags missing or suspicious values. | `earnings_event` with fields for expectations and results. | Numeric metrics: `surprisePotential`, `surprise`, ratio of price reaction to surprise.  Confidence flags (`LOW_CONFIDENCE`, `UNKNOWN`) when data is absent. |
| **Guidance Agent** | Parses forward guidance (EPS and revenue) and compares it to the prior guidance trend.  Signals whether guidance was raised, lowered or reaffirmed. | `earnings_event` fields for `guidanceEPS`, `guidanceRevenue`, `priorSurprise`. | Qualitative tag: `UPBEAT`, `DOWNBEAT`, `IN_LINE` or `NOT_AVAILABLE` along with a confidence score. |
| **Transcript Agent** | (Optional) Ingests earnings call transcript if available.  Extracts sentiment (positive/negative), identifies key themes (e.g., headwinds, tailwinds) and summarises management commentary. | Transcript text from an external source (or `null`). | Structured summary of sentiment and topics; may produce keywords for the sceptic.  When no transcript is available, returns `NOT_AVAILABLE`. |
| **Chart‑Context Agent** | Examines recent price structure (base score) and volume trend.  Determines whether the stock had a healthy base leading into earnings or was extended/crowded. | Price series and `baseStructureScore`. | Score categories: `STRONG_BASE`, `WEAK_BASE`, `NEUTRAL`; returns `UNKNOWN` if missing. |
| **Options‑Context Agent** | Evaluates options implied move and open interest to judge whether the reaction exceeded what options markets priced in. | `optionsImpliedMove` and options chain where available. | Tag: `WITHIN_EXPECTED`, `BEYOND_EXPECTED`, `NO_OPTIONS_DATA`. |
| **Sceptic** | Serves as a risk‑control agent.  Reviews outputs from other agents for contradictions or unrealistic assumptions.  Assigns final categories (`WORTH_STALKING`, etc.), provides reasons and triggers `MANUAL_REVIEW` when conflicting signals arise. | Aggregated outputs from agents. | Final classification and reasons, plus an evidence ledger entry with timestamp, source and confidence. |

## Run / Build / Verify / Done criteria

* **Run** – Each pipeline (anticipation, reaction, drift) can be invoked via a one‑shot function (`runAnticipationBoard`, `runReactionBoard`, `runDriftBoard`) or scheduled via the worker.  A run is considered successful when it produces a markdown report and JSON ledger with the expected structure and no uncaught exceptions.  The smoke script demonstrates a successful run by seeding fixtures and processing all three stages.
* **Build** – A build is successful when `npm run build` compiles all TypeScript packages without errors and outputs compiled JavaScript under `dist/`.  The build must be deterministic and work from a clean clone using `npm ci` to install dependencies.
* **Verify** – Verification has multiple layers:
  * **Unit tests** (`npm test`) must pass, covering core analysis logic, failure modes and classification rules.  Tests must include messy and hostile inputs (e.g. missing fields, contradictory data) and ensure the system returns appropriate `UNKNOWN` or `MANUAL_REVIEW` statuses.
  * **Smoke test** (`npm run smoke`) must complete and generate reports without throwing.  The classification outcomes should match the golden outputs in the `fixtures` and `smoke_output` directories.
  * **CI workflow** defined in `.github/workflows/node.yml` must pass on all supported Node versions with least‑privilege permissions.
* **Done** – The product is considered ready for use when the following hold:
  * `npm ci`, `npm run build`, `npm test`, `npm run smoke` and `npm start` all succeed from a clean clone.
  * Reports are generated with human‑readable markdown tables and explanatory bullet points, and JSON ledgers include source, timestamp, classification and confidence.
  * Agents degrade gracefully when data is missing, returning `NOT_AVAILABLE`, `LOW_CONFIDENCE` or `UNKNOWN` as appropriate.
  * Documentation (`README.md`, `PRODUCT.md`, `DEMO.md`, `PRICING.md`, `AGENTS.md`) is complete and consistent with the implementation.  No feature is described without corresponding code or a clear roadmap item.

## Best practices

* **Least privilege** – All data access is read‑only.  Environment variables control sensitive paths.  The GitHub Actions workflow uses `permissions: contents: read` and avoids secrets.
* **Determinism** – Test fixtures and golden outputs ensure that classification logic yields the same results across runs.  When introducing new heuristics, update fixtures and tests accordingly.
* **Transparency** – Each ledger entry contains the raw metrics, classification, a breakdown of reasons and the timestamp.  Consumers can audit why a particular event was categorized a certain way.
* **Graceful degradation** – When transcripts or options data are unavailable, the system explicitly notes `NOT_AVAILABLE` and avoids hallucinating values.
* **Hostile input handling** – The system guards against malformed JSON, missing fields, invalid dates and unsafe text (e.g. formulas in CSV).  When encountering such cases the agents return `MANUAL_REVIEW` or `UNKNOWN` rather than crash.