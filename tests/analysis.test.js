const test = require('node:test');
const assert = require('node:assert/strict');

// Import compiled core functions. The build script outputs compiled files into
// each package's `dist` directory. When running tests with `npm run test` we
// assume `npm run build` has already been executed so that these files exist.
const {
  computeSurprisePotential,
  classifyPrep,
  classifyReaction,
  classifyDrift
} = require('../packages/core/dist/index.js');

test('computeSurprisePotential calculates absolute difference', () => {
  const evt = {
    id: 'A',
    ticker: 'AAPL',
    eventDate: '2026-01-01',
    expectedEPS: 1.2,
    priorQuarterEPS: 1.0
  };
  const result = computeSurprisePotential(evt);
  assert.ok(Math.abs(result - 0.2) < 1e-6, `expected 0.2 but got ${result}`);
});

test('classifyPrep returns WORTH_STALKING for high surprise and good base', () => {
  const evt = {
    id: 'B',
    ticker: 'GOOG',
    eventDate: '2026-01-02',
    expectedEPS: 2.0,
    priorQuarterEPS: 1.0,
    baseStructureScore: 0.7,
    crowdingScore: 0.4
  };
  const { category } = classifyPrep(evt);
  assert.equal(category, 'WORTH_STALKING');
});

test('classifyPrep returns AVOID_CROWDING for high crowding', () => {
  const evt = {
    id: 'C',
    ticker: 'MSFT',
    eventDate: '2026-01-03',
    expectedEPS: 1.5,
    priorQuarterEPS: 1.4,
    baseStructureScore: 0.8,
    crowdingScore: 0.8
  };
  const { category } = classifyPrep(evt);
  assert.equal(category, 'AVOID_CROWDING');
});

test('classifyPrep returns IGNORE for weak base', () => {
  const evt = {
    id: 'D',
    ticker: 'TSLA',
    eventDate: '2026-01-04',
    expectedEPS: 1.1,
    priorQuarterEPS: 1.0,
    baseStructureScore: 0.2,
    crowdingScore: 0.3
  };
  const { category } = classifyPrep(evt);
  assert.equal(category, 'IGNORE');
});

test('classifyPrep returns UNKNOWN when data missing', () => {
  const evt = {
    id: 'E',
    ticker: 'AMZN',
    eventDate: '2026-01-05'
  };
  const { category } = classifyPrep(evt);
  assert.equal(category, 'UNKNOWN');
});

test('classifyReaction identifies underreaction', () => {
  const evt = {
    id: 'F',
    ticker: 'IBM',
    eventDate: '2026-01-06',
    expectedEPS: 1.0,
    actualEPS: 1.3,
    priceBefore: 100,
    priceAfter: 105
  };
  const result = classifyReaction(evt);
  assert.equal(result.quality, 'UNDERREACTED');
});

test('classifyReaction identifies justified reaction', () => {
  const evt = {
    id: 'G',
    ticker: 'NFLX',
    eventDate: '2026-01-07',
    expectedEPS: 2.0,
    actualEPS: 2.3,
    priceBefore: 100,
    priceAfter: 130
  };
  const result = classifyReaction(evt);
  assert.equal(result.quality, 'JUSTIFIED');
});

test('classifyReaction identifies ambiguous reaction when signs differ', () => {
  const evt = {
    id: 'H',
    ticker: 'ORCL',
    eventDate: '2026-01-08',
    expectedEPS: 1.0,
    actualEPS: 0.8,
    priceBefore: 100,
    priceAfter: 105
  };
  const result = classifyReaction(evt);
  assert.equal(result.quality, 'AMBIGUOUS');
});

test('classifyDrift classifies follow‑through', () => {
  const evt = {
    id: 'I',
    ticker: 'META',
    eventDate: '2026-01-09',
    postEventDrift: 0.03
  };
  const result = classifyDrift(evt);
  assert.equal(result.classification, 'FOLLOW_THROUGH');
});

test('classifyDrift classifies fade', () => {
  const evt = {
    id: 'J',
    ticker: 'INTC',
    eventDate: '2026-01-10',
    postEventDrift: -0.04
  };
  const result = classifyDrift(evt);
  assert.equal(result.classification, 'FADE');
});

test('classifyDrift returns UNKNOWN when drift missing', () => {
  const evt = {
    id: 'K',
    ticker: 'NVDA',
    eventDate: '2026-01-11'
  };
  const result = classifyDrift(evt);
  assert.equal(result.classification, 'UNKNOWN');
});