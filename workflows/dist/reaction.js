"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runReactionBoard = runReactionBoard;
const data_1 = require("@earningsflow/data");
const core_1 = require("@earningsflow/core");
/**
 * Generate the reaction board by evaluating how the market responded to each
 * earnings event. The board is not sorted because reactions could be
 * interpreted in multiple ways; downstream consumers may sort based on their
 * own criteria (e.g. magnitude of mispricing).
 */
async function runReactionBoard() {
    const events = await (0, data_1.getResultsEvents)();
    const items = events.map((evt) => (0, core_1.buildReactionItem)(evt));
    return items;
}
//# sourceMappingURL=reaction.js.map