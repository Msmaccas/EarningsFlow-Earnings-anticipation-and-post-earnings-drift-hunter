import {
  runAnticipationBoard,
  runReactionBoard,
  runDriftBoard
} from '@earningsflow/workflows';
import {
  generatePrepMarkdown,
  buildPrepLedger,
  generateReactionMarkdown,
  buildReactionLedger,
  generateDriftMarkdown,
  buildDriftLedger,
  writeReport
} from '@earningsflow/reports';

async function main(): Promise<void> {
  console.log('Running EarningsFlow smoke test...');
  const prep = await runAnticipationBoard();
  const reaction = await runReactionBoard();
  const drift = await runDriftBoard();
  console.log('Preparation board:');
  console.log(generatePrepMarkdown(prep));
  console.log('Reaction board:');
  console.log(generateReactionMarkdown(reaction));
  console.log('Drift board:');
  console.log(generateDriftMarkdown(drift));
  const outDir = process.env.SMOKE_OUTPUT_DIR || 'smoke_output';
  // Persist reports for manual inspection
  await writeReport(outDir, 'prep', generatePrepMarkdown(prep), buildPrepLedger(prep));
  await writeReport(outDir, 'reaction', generateReactionMarkdown(reaction), buildReactionLedger(reaction));
  await writeReport(outDir, 'drift', generateDriftMarkdown(drift), buildDriftLedger(drift));
  console.log(`Smoke reports written to ${outDir}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});