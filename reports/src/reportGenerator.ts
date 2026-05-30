import { promises as fs } from 'fs';
import path from 'path';
import {
  PrepBoardItem,
  ReactionItem,
  DriftItem
} from '@earningsflow/core';

/**
 * Build a markdown table summarising preparation board items. We deliberately
 * keep the table concise—only numeric or categorical fields appear here. Longer
 * explanations are placed below the table as bullet lists.
 */
export function generatePrepMarkdown(items: PrepBoardItem[]): string {
  let md = '# Earnings Preparation Board\n\n';
  if (items.length === 0) {
    md += 'No upcoming events found.\n';
    return md;
  }
  md += '| Ticker | Date | Surprise Potential | Crowding Risk | Category |\n';
  md += '|-------|------|-------------------|---------------|----------|\n';
  for (const item of items) {
    const sp = item.surprisePotential !== null ? item.surprisePotential.toFixed(3) : 'N/A';
    const cr = item.crowdingRisk !== null ? item.crowdingRisk.toFixed(2) : 'N/A';
    md += `| ${item.event.ticker} | ${item.event.eventDate} | ${sp} | ${cr} | ${item.category} |\n`;
  }
  md += '\n';
  items.forEach((item) => {
    md += `### ${item.event.ticker} (${item.event.eventDate})\n\n`;
    md += `- **Category:** ${item.category}\n`;
    md += `- **Reasons:** ${item.reasons.join('; ')}\n\n`;
  });
  return md;
}

export function generateReactionMarkdown(items: ReactionItem[]): string {
  let md = '# Earnings Reaction Board\n\n';
  if (items.length === 0) {
    md += 'No results events found.\n';
    return md;
  }
  md += '| Ticker | Date | EPS Surprise | Price Reaction | Quality |\n';
  md += '|-------|------|-------------|---------------|---------|\n';
  for (const item of items) {
    const s = item.surprise !== null ? item.surprise.toFixed(3) : 'N/A';
    const pr = item.priceReaction !== null ? (item.priceReaction * 100).toFixed(2) + '%' : 'N/A';
    md += `| ${item.event.ticker} | ${item.event.eventDate} | ${s} | ${pr} | ${item.reactionQuality} |\n`;
  }
  md += '\n';
  items.forEach((item) => {
    md += `### ${item.event.ticker} (${item.event.eventDate})\n\n`;
    md += `- **Reaction Quality:** ${item.reactionQuality}\n`;
    md += `- **Reasons:** ${item.reasons.join('; ')}\n\n`;
  });
  return md;
}

export function generateDriftMarkdown(items: DriftItem[]): string {
  let md = '# Post‑Event Drift Board\n\n';
  if (items.length === 0) {
    md += 'No drift events found.\n';
    return md;
  }
  md += '| Ticker | Date | Drift | Classification |\n';
  md += '|-------|------|------|---------------|\n';
  for (const item of items) {
    const d = item.drift !== null ? (item.drift * 100).toFixed(2) + '%' : 'N/A';
    md += `| ${item.event.ticker} | ${item.event.eventDate} | ${d} | ${item.classification} |\n`;
  }
  md += '\n';
  items.forEach((item) => {
    md += `### ${item.event.ticker} (${item.event.eventDate})\n\n`;
    md += `- **Classification:** ${item.classification}\n`;
    md += `- **Reasons:** ${item.reasons.join('; ')}\n\n`;
  });
  return md;
}

/**
 * Build a JSON evidence ledger for each board. Each entry includes the source
 * event, computed metrics and classification details. This ledger can be used
 * to support audit trails or machine processing downstream.
 */
export function buildPrepLedger(items: PrepBoardItem[]): unknown[] {
  return items.map((item) => ({
    id: item.event.id,
    ticker: item.event.ticker,
    eventDate: item.event.eventDate,
    surprisePotential: item.surprisePotential,
    crowdingRisk: item.crowdingRisk,
    category: item.category,
    reasons: item.reasons,
    timestamp: new Date().toISOString()
  }));
}

export function buildReactionLedger(items: ReactionItem[]): unknown[] {
  return items.map((item) => ({
    id: item.event.id,
    ticker: item.event.ticker,
    eventDate: item.event.eventDate,
    surprise: item.surprise,
    priceReaction: item.priceReaction,
    quality: item.reactionQuality,
    reasons: item.reasons,
    timestamp: new Date().toISOString()
  }));
}

export function buildDriftLedger(items: DriftItem[]): unknown[] {
  return items.map((item) => ({
    id: item.event.id,
    ticker: item.event.ticker,
    eventDate: item.event.eventDate,
    drift: item.drift,
    classification: item.classification,
    reasons: item.reasons,
    timestamp: new Date().toISOString()
  }));
}

/**
 * Persist a report to disk. This helper writes both the markdown and ledger
 * files to the specified directory using a common prefix. It creates the
 * directory if it does not exist.
 */
export async function writeReport(dir: string, prefix: string, markdown: string, ledger: unknown[]): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
  const mdPath = path.join(dir, `${prefix}.md`);
  const jsonPath = path.join(dir, `${prefix}.json`);
  await fs.writeFile(mdPath, markdown, 'utf-8');
  await fs.writeFile(jsonPath, JSON.stringify(ledger, null, 2), 'utf-8');
}