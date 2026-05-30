"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpcomingEvents = getUpcomingEvents;
exports.getResultsEvents = getResultsEvents;
exports.listFixtureFiles = listFixtureFiles;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
// Determine where fixture data resides. The environment variable FIXTURE_DIR can
// override the default. When unspecified, we assume a `fixtures` directory
// exists at the repository root. This indirection makes it easy to plug in
// real data providers in the future without changing callers.
const DEFAULT_FIXTURE_DIR = path_1.default.resolve(process.cwd(), 'fixtures');
const fixtureDir = process.env.FIXTURE_DIR || DEFAULT_FIXTURE_DIR;
async function readJsonFile(filename) {
    const filePath = path_1.default.join(fixtureDir, filename);
    try {
        const data = await promises_1.default.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }
    catch (err) {
        throw new Error(`Failed to read fixture ${filePath}: ${String(err)}`);
    }
}
/**
 * Return the scheduled upcoming earnings events for use in anticipation mode.
 * Events are loaded from the `upcoming_events.json` file in the fixture directory.
 */
async function getUpcomingEvents() {
    return readJsonFile('upcoming_events.json');
}
/**
 * Return events with actual earnings results populated. The `results_events.json`
 * file should contain the same structure as `upcoming_events.json` but with
 * realised EPS, revenue and price fields filled in. In a production system this
 * would be loaded from an API or database.
 */
async function getResultsEvents() {
    return readJsonFile('results_events.json');
}
/**
 * Enumerate all fixture event files present in the directory. Useful for
 * debugging and introspection.
 */
async function listFixtureFiles() {
    const entries = await promises_1.default.readdir(fixtureDir);
    return entries.filter((f) => f.endsWith('.json'));
}
//# sourceMappingURL=index.js.map