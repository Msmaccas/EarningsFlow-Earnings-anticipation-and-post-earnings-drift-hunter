import { PrepBoardItem, ReactionItem, DriftItem } from '@earningsflow/core';
/**
 * Build a markdown table summarising preparation board items. We deliberately
 * keep the table concise—only numeric or categorical fields appear here. Longer
 * explanations are placed below the table as bullet lists.
 */
export declare function generatePrepMarkdown(items: PrepBoardItem[]): string;
export declare function generateReactionMarkdown(items: ReactionItem[]): string;
export declare function generateDriftMarkdown(items: DriftItem[]): string;
/**
 * Build a JSON evidence ledger for each board. Each entry includes the source
 * event, computed metrics and classification details. This ledger can be used
 * to support audit trails or machine processing downstream.
 */
export declare function buildPrepLedger(items: PrepBoardItem[]): unknown[];
export declare function buildReactionLedger(items: ReactionItem[]): unknown[];
export declare function buildDriftLedger(items: DriftItem[]): unknown[];
/**
 * Persist a report to disk. This helper writes both the markdown and ledger
 * files to the specified directory using a common prefix. It creates the
 * directory if it does not exist.
 */
export declare function writeReport(dir: string, prefix: string, markdown: string, ledger: unknown[]): Promise<void>;
