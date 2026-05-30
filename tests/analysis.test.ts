import {
  computeSurprisePotential,
  classifyPrep,
  classifyReaction,
  classifyDrift,
  EarningsEvent
} from '@earningsflow/core';

describe('Core analysis functions', () => {
  test('computeSurprisePotential calculates absolute difference', () => {
    const evt: EarningsEvent = {
      id: 'A',
      ticker: 'AAPL',
      eventDate: '2026-01-01',
      expectedEPS: 1.2,
      priorQuarterEPS: 1.0
    };
    expect(computeSurprisePotential(evt)).toBeCloseTo(0.2);
  });

  test('classifyPrep returns WORTH_STALKING for high surprise and good base', () => {
    const evt: EarningsEvent = {
      id: 'B',
      ticker: 'GOOG',
      eventDate: '2026-01-02',
      expectedEPS: 2.0,
      priorQuarterEPS: 1.0,
      baseStructureScore: 0.7,
      crowdingScore: 0.4
    };
    const { category } = classifyPrep(evt);
    expect(category).toBe('WORTH_STALKING');
  });

  test('classifyPrep returns AVOID_CROWDING for high crowding', () => {
    const evt: EarningsEvent = {
      id: 'C',
      ticker: 'MSFT',
      eventDate: '2026-01-03',
      expectedEPS: 1.5,
      priorQuarterEPS: 1.4,
      baseStructureScore: 0.8,
      crowdingScore: 0.8
    };
    const { category } = classifyPrep(evt);
    expect(category).toBe('AVOID_CROWDING');
  });

  test('classifyPrep returns IGNORE for weak base', () => {
    const evt: EarningsEvent = {
      id: 'D',
      ticker: 'TSLA',
      eventDate: '2026-01-04',
      expectedEPS: 1.1,
      priorQuarterEPS: 1.0,
      baseStructureScore: 0.2,
      crowdingScore: 0.3
    };
    const { category } = classifyPrep(evt);
    expect(category).toBe('IGNORE');
  });

  test('classifyPrep returns UNKNOWN when data missing', () => {
    const evt: EarningsEvent = {
      id: 'E',
      ticker: 'AMZN',
      eventDate: '2026-01-05'
    };
    const { category } = classifyPrep(evt);
    expect(category).toBe('UNKNOWN');
  });

  test('classifyReaction identifies underreaction', () => {
    const evt: EarningsEvent = {
      id: 'F',
      ticker: 'IBM',
      eventDate: '2026-01-06',
      expectedEPS: 1.0,
      actualEPS: 1.3,
      priceBefore: 100,
      priceAfter: 105
    };
    const result = classifyReaction(evt);
    expect(result.quality).toBe('UNDERREACTED');
  });

  test('classifyReaction identifies justified reaction', () => {
    const evt: EarningsEvent = {
      id: 'G',
      ticker: 'NFLX',
      eventDate: '2026-01-07',
      expectedEPS: 2.0,
      actualEPS: 2.3,
      priceBefore: 100,
      priceAfter: 130
    };
    const result = classifyReaction(evt);
    expect(result.quality).toBe('JUSTIFIED');
  });

  test('classifyReaction identifies ambiguous reaction when signs differ', () => {
    const evt: EarningsEvent = {
      id: 'H',
      ticker: 'ORCL',
      eventDate: '2026-01-08',
      expectedEPS: 1.0,
      actualEPS: 0.8,
      priceBefore: 100,
      priceAfter: 105
    };
    const result = classifyReaction(evt);
    expect(result.quality).toBe('AMBIGUOUS');
  });

  test('classifyDrift classifies follow‑through', () => {
    const evt: EarningsEvent = {
      id: 'I',
      ticker: 'META',
      eventDate: '2026-01-09',
      postEventDrift: 0.03
    };
    const result = classifyDrift(evt);
    expect(result.classification).toBe('FOLLOW_THROUGH');
  });

  test('classifyDrift classifies fade', () => {
    const evt: EarningsEvent = {
      id: 'J',
      ticker: 'INTC',
      eventDate: '2026-01-10',
      postEventDrift: -0.04
    };
    const result = classifyDrift(evt);
    expect(result.classification).toBe('FADE');
  });

  test('classifyDrift returns UNKNOWN when drift missing', () => {
    const evt: EarningsEvent = {
      id: 'K',
      ticker: 'NVDA',
      eventDate: '2026-01-11'
    };
    const result = classifyDrift(evt);
    expect(result.classification).toBe('UNKNOWN');
  });
});