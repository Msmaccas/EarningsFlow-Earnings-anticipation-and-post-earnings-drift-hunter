"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDriftBoard = runDriftBoard;
const data_1 = require("@earningsflow/data");
const core_1 = require("@earningsflow/core");
/**
 * Generate a drift board that classifies how stocks behaved in the days
 * following their earnings announcements. This function assumes that
 * `postEventDrift` has been populated on each event. If not, drift entries
 * will default to UNKNOWN.
 */
async function runDriftBoard() {
    const events = await (0, data_1.getResultsEvents)();
    const items = events.map((evt) => (0, core_1.buildDriftItem)(evt));
    return items;
}
//# sourceMappingURL=drift.js.map