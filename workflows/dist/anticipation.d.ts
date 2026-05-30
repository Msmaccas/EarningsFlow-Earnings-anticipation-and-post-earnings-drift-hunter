import { PrepBoardItem } from '@earningsflow/core';
/**
 * Generate the earnings preparation board by scanning upcoming events and
 * computing surprise potential, crowding risk and a categorical label for each.
 *
 * The resulting board is sorted by descending surprise potential (highest first)
 * and includes all events returned by the data provider.
 */
export declare function runAnticipationBoard(): Promise<PrepBoardItem[]>;
