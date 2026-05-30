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

// Determine where reports are written. All configuration uses environment
// variables exclusively; we avoid loading a .env file to eliminate external
// dependencies. The default directory is `generated_reports` within the
// current working directory.
const REPORT_DIR = process.env.REPORT_DIR || 'generated_reports';

// Interval in milliseconds between successive runs of the daily jobs when
// running in daemon mode. Defaults to 24 hours (86400000 ms). This can be
// overridden via the SCHEDULE_INTERVAL_MS environment variable.
const INTERVAL_MS = parseInt(process.env.SCHEDULE_INTERVAL_MS || '86400000', 10);

/**
 * Run the anticipation workflow, generate a report and save it.
 */
async function runPrepJob(): Promise<void> {
  const items = await runAnticipationBoard();
  const md = generatePrepMarkdown(items);
  const ledger = buildPrepLedger(items);
  const prefix = `prep_${new Date().toISOString().split('T')[0]}`;
  await writeReport(REPORT_DIR, prefix, md, ledger);
  console.log(`[${new Date().toISOString()}] Prep report written: ${prefix}`);
}

/**
 * Run the reaction workflow, generate a report and save it.
 */
async function runReactionJob(): Promise<void> {
  const items = await runReactionBoard();
  const md = generateReactionMarkdown(items);
  const ledger = buildReactionLedger(items);
  const prefix = `reaction_${new Date().toISOString().split('T')[0]}`;
  await writeReport(REPORT_DIR, prefix, md, ledger);
  console.log(`[${new Date().toISOString()}] Reaction report written: ${prefix}`);
}

/**
 * Run the drift workflow, generate a report and save it.
 */
async function runDriftJob(): Promise<void> {
  const items = await runDriftBoard();
  const md = generateDriftMarkdown(items);
  const ledger = buildDriftLedger(items);
  const prefix = `drift_${new Date().toISOString().split('T')[0]}`;
  await writeReport(REPORT_DIR, prefix, md, ledger);
  console.log(`[${new Date().toISOString()}] Drift report written: ${prefix}`);
}

/**
 * Setup and start scheduled jobs. In daemon mode this will run all three
 * workflows immediately and then repeat them at a fixed interval. This is a
 * simple alternative to cron that does not require external dependencies.
 */
function startScheduler(): void {
  // Immediately run once to produce initial reports.
  void (async () => {
    await runPrepJob();
    await runReactionJob();
    await runDriftJob();
  })();
  // Schedule repeated runs at the configured interval. Use a single interval
  // rather than multiple timers to keep alignment.
  setInterval(async () => {
    try {
      await runPrepJob();
      await runReactionJob();
      await runDriftJob();
    } catch (err) {
      console.error('Scheduled job error:', err);
    }
  }, INTERVAL_MS);
  console.log('EarningsFlow worker started with interval (ms):', INTERVAL_MS);
}

/**
 * Entry point. Depending on command line arguments, run jobs once or start
 * scheduled daemon mode. To run once, invoke `node dist/packages/worker/dist/index.js once`.
 */
async function main(): Promise<void> {
  const mode = process.argv[2];
  if (mode === 'once') {
    await runPrepJob();
    await runReactionJob();
    await runDriftJob();
    return;
  }
  startScheduler();
}

// Execute main if this script is run directly. We do not await main() to
// maintain compatibility with top‑level await restrictions.
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();