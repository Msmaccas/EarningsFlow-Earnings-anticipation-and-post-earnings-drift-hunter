import { getUpcomingEvents } from '@earningsflow/data';
import { buildPrepBoardItem, PrepBoardItem } from '@earningsflow/core';

/**
 * Generate the earnings preparation board by scanning upcoming events and
 * computing surprise potential, crowding risk and a categorical label for each.
 *
 * The resulting board is sorted by descending surprise potential (highest first)
 * and includes all events returned by the data provider.
 */
export async function runAnticipationBoard(): Promise<PrepBoardItem[]> {
  const events = await getUpcomingEvents();
  const items = events.map((evt) => buildPrepBoardItem(evt));
  // Sort by surprise potential descending. Nulls (unknown) go last.
  items.sort((a, b) => {
    if (a.surprisePotential === null && b.surprisePotential === null) return 0;
    if (a.surprisePotential === null) return 1;
    if (b.surprisePotential === null) return -1;
    return b.surprisePotential - a.surprisePotential;
  });
  return items;
}