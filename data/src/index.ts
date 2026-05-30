import fs from 'fs/promises';
import path from 'path';
import { EarningsEvent } from '@earningsflow/core';

// Determine where fixture data resides. The environment variable FIXTURE_DIR can
// override the default. When unspecified, we assume a `fixtures` directory
// exists at the repository root. This indirection makes it easy to plug in
// real data providers in the future without changing callers.
const DEFAULT_FIXTURE_DIR = path.resolve(process.cwd(), 'fixtures');
const fixtureDir = process.env.FIXTURE_DIR || DEFAULT_FIXTURE_DIR;

async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(fixtureDir, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (err) {
    throw new Error(`Failed to read fixture ${filePath}: ${String(err)}`);
  }
}

/**
 * Return the scheduled upcoming earnings events for use in anticipation mode.
 * Events are loaded from the `upcoming_events.json` file in the fixture directory.
 */
export async function getUpcomingEvents(): Promise<EarningsEvent[]> {
  return readJsonFile<EarningsEvent[]>('upcoming_events.json');
}

/**
 * Return events with actual earnings results populated. The `results_events.json`
 * file should contain the same structure as `upcoming_events.json` but with
 * realised EPS, revenue and price fields filled in. In a production system this
 * would be loaded from an API or database.
 */
export async function getResultsEvents(): Promise<EarningsEvent[]> {
  return readJsonFile<EarningsEvent[]>('results_events.json');
}

/**
 * Enumerate all fixture event files present in the directory. Useful for
 * debugging and introspection.
 */
export async function listFixtureFiles(): Promise<string[]> {
  const entries = await fs.readdir(fixtureDir);
  return entries.filter((f) => f.endsWith('.json'));
}