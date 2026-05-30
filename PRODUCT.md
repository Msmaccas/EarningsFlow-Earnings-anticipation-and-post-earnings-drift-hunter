# Product Specification – EarningsFlow

## Core promise

**EarningsFlow** is a background product for active equity traders and small funds who want to focus their attention on the handful of earnings events that matter most each day.  It turns raw earnings dates, consensus estimates, results and price data into a **ranked observation system** with evidence, commentary and a persistent ledger.  By combining pre‑event preparation, immediate reaction classification and post‑event drift monitoring into one app, EarningsFlow helps users allocate their research time efficiently without claiming predictive edge.

## Job‑to‑be‑done

For an analyst overwhelmed by earnings season, the job is **to cut through the noise**, identify which companies deserve a live watch based on potential surprise and base strength, understand whether the market’s reaction to a print is justified, and track whether there is follow‑through or fade afterwards.  Existing tools provide calendars, transcripts or generic backtests, but they do not deliver a small, prioritized board with explanations.  EarningsFlow fills that gap.

## Target users

* **Active traders**: individuals or proprietary desk traders seeking to narrow down earnings opportunities with evidence rather than scanning endless calendars.
* **Small hedge funds and research teams**: groups that lack the resources of large institutions but need to systematize their earnings workflows and maintain an audit trail.
* **Serious solo operators**: experienced retail investors who manage their own portfolios and want a repeatable earnings process.

## Features

1. **Anticipation mode** – builds a prep board from upcoming earnings calendar data, ranking events by surprise potential and base health, penalising crowding risk and flagging unknowns.  Categories (`WORTH_STALKING`, `AVOID_CROWDING`, `WATCH_POST_PRINT`, `IGNORE`, `UNKNOWN`) help decide where to allocate attention.
2. **Reaction mode** – ingests actual earnings results and price reactions, computes EPS and revenue surprises, compares price moves against expectations and options implied moves, and classifies the reaction (`JUSTIFIED`, `UNDERREACTED`, `OVERREACTED`, `AMBIGUOUS`, `UNKNOWN`).  Produces a **reaction anatomy page** per ticker explaining what changed at the print and what would confirm or kill the follow‑through thesis.
3. **Drift mode** – monitors post‑event price drift over subsequent sessions and labels cases as `FOLLOW_THROUGH`, `FADE`, `AMBIGUOUS` or `UNKNOWN`.  Updates the ledger to inform future quarters.
4. **Multi‑agent architecture** – specialised agents (numbers, guidance, transcript, chart‑context, options‑context, sceptic) independently analyse their domain and produce structured outputs.  A sceptic agent reconciles these views into a final classification, capturing uncertainties and contradictions.
5. **Evidence‑first ledger** – every run writes a JSON ledger containing raw metrics, classification, reasoning, timestamp, confidence flags and references.  This ledger grows over time, forming a living knowledge base for future earnings seasons.
6. **API & dashboard** – A lightweight HTTP server (built on Node’s core `http` module) exposes endpoints for prep/reaction/drift boards and a simple HTML dashboard.  Users can integrate the API into their own tools or view the markdown reports directly without pulling in external dependencies.
7. **Scheduled worker** – A simple interval‑based worker runs the anticipation/reaction/drift pipelines on a configurable schedule (default 24 hours).  Jobs can be run once or as a daemon.  Configuration is entirely via environment variables.
8. **Graceful degradation** – When transcripts, options data or other inputs are missing, the system returns `NOT_AVAILABLE` rather than fabricating values, and flags events for manual review.

## Maturity target

EarningsFlow is an **evidence‑stage product**.  It is not a commercial trading system and does not aim to generate alpha directly.  The maturity target is:

* A **one‑command smoke path** that seeds fixtures, runs all three modes and produces reports without human intervention.
* **Deterministic unit tests** covering core logic, failure cases and messy inputs.
* A minimal but complete **CI pipeline** using `actions/setup-node` and least‑privilege permissions; build, test, smoke and start commands must pass.
* Clear documentation (this `PRODUCT.md`, `README.md`, `DEMO.md`, `PRICING.md` and `AGENTS.md`) specifying current capabilities, limitations and roadmap.  No claim of predictive edge unless validated by tests.
* **Future‑proof architecture** that can ingest real data sources, incorporate voice and language cues, options context and peer comparisons, and produce more sophisticated dashboards, while remaining transparent and configurable.

## What EarningsFlow does **not** do

* It does **not** place trades or connect to brokerage APIs.  All outputs are informational.
* It does **not** promise alpha or guaranteed performance.  Classifications are descriptive heuristics.
* It does **not** include proprietary or licensed financial data.  Users must provide their own data feeds or use the included fixtures for demonstration.
* It does **not** integrate with third‑party research platforms (e.g. AlphaSense) out of the box; such integrations are possible via connectors if provided.

## How this product exploits the gap

As shown in the competitor matrix, existing tools fall into two camps: **backtesters** that treat earnings as simple timestamps and **research workspaces** that summarise documents but stop short of analysis.  EarningsFlow sits between these extremes.  It builds a structured pipeline around discrete events, uses specialized agents to evaluate each element of the event (numbers, guidance, sentiment, price structure, options), and synthesises those perspectives into actionable boards.  By writing everything to a ledger with timestamps and reasons, it ensures reproducibility and continuous learning from prior quarters.