"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workflows_1 = require("@earningsflow/workflows");
const reports_1 = require("@earningsflow/reports");
async function main() {
    console.log('Running EarningsFlow smoke test...');
    const prep = await (0, workflows_1.runAnticipationBoard)();
    const reaction = await (0, workflows_1.runReactionBoard)();
    const drift = await (0, workflows_1.runDriftBoard)();
    console.log('Preparation board:');
    console.log((0, reports_1.generatePrepMarkdown)(prep));
    console.log('Reaction board:');
    console.log((0, reports_1.generateReactionMarkdown)(reaction));
    console.log('Drift board:');
    console.log((0, reports_1.generateDriftMarkdown)(drift));
    const outDir = process.env.SMOKE_OUTPUT_DIR || 'smoke_output';
    // Persist reports for manual inspection
    await (0, reports_1.writeReport)(outDir, 'prep', (0, reports_1.generatePrepMarkdown)(prep), (0, reports_1.buildPrepLedger)(prep));
    await (0, reports_1.writeReport)(outDir, 'reaction', (0, reports_1.generateReactionMarkdown)(reaction), (0, reports_1.buildReactionLedger)(reaction));
    await (0, reports_1.writeReport)(outDir, 'drift', (0, reports_1.generateDriftMarkdown)(drift), (0, reports_1.buildDriftLedger)(drift));
    console.log(`Smoke reports written to ${outDir}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
//# sourceMappingURL=smoke.js.map