import { EarningsEvent } from '@earningsflow/core';
/**
 * Return the scheduled upcoming earnings events for use in anticipation mode.
 * Events are loaded from the `upcoming_events.json` file in the fixture directory.
 */
export declare function getUpcomingEvents(): Promise<EarningsEvent[]>;
/**
 * Return events with actual earnings results populated. The `results_events.json`
 * file should contain the same structure as `upcoming_events.json` but with
 * realised EPS, revenue and price fields filled in. In a production system this
 * would be loaded from an API or database.
 */
export declare function getResultsEvents(): Promise<EarningsEvent[]>;
/**
 * Enumerate all fixture event files present in the directory. Useful for
 * debugging and introspection.
 */
export declare function listFixtureFiles(): Promise<string[]>;
