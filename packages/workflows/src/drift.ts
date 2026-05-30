import { getResultsEvents } from '@earningsflow/data';
import { buildDriftItem, DriftItem } from '@earningsflow/core';

/**
 * Generate a drift board that classifies how stocks behaved in the days
 * following their earnings announcements. This function assumes that
 * `postEventDrift` has been populated on each event. If not, drift entries
 * will default to UNKNOWN.
 */
export async function runDriftBoard(): Promise<DriftItem[]> {
  const events = await getResultsEvents();
  const items = events.map((evt) => buildDriftItem(evt));
  return items;
}