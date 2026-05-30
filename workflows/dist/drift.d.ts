import { DriftItem } from '@earningsflow/core';
/**
 * Generate a drift board that classifies how stocks behaved in the days
 * following their earnings announcements. This function assumes that
 * `postEventDrift` has been populated on each event. If not, drift entries
 * will default to UNKNOWN.
 */
export declare function runDriftBoard(): Promise<DriftItem[]>;
