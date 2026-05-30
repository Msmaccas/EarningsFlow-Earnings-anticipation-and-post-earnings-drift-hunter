"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAnticipationBoard = runAnticipationBoard;
const data_1 = require("@earningsflow/data");
const core_1 = require("@earningsflow/core");
/**
 * Generate the earnings preparation board by scanning upcoming events and
 * computing surprise potential, crowding risk and a categorical label for each.
 *
 * The resulting board is sorted by descending surprise potential (highest first)
 * and includes all events returned by the data provider.
 */
async function runAnticipationBoard() {
    const events = await (0, data_1.getUpcomingEvents)();
    const items = events.map((evt) => (0, core_1.buildPrepBoardItem)(evt));
    // Sort by surprise potential descending. Nulls (unknown) go last.
    items.sort((a, b) => {
        if (a.surprisePotential === null && b.surprisePotential === null)
            return 0;
        if (a.surprisePotential === null)
            return 1;
        if (b.surprisePotential === null)
            return -1;
        return b.surprisePotential - a.surprisePotential;
    });
    return items;
}
//# sourceMappingURL=anticipation.js.map