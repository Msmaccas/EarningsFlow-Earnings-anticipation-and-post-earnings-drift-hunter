import {
  EarningsEvent,
  PrepBoardItem,
  PrepCategory,
  ReactionItem,
  ReactionQuality,
  DriftItem
} from './entities';

/**
 * Compute the absolute difference between the consensus EPS and prior quarter EPS.
 * This is used as a proxy for how much surprise potential exists.
 */
export function computeSurprisePotential(event: EarningsEvent): number | null {
  if (typeof event.expectedEPS !== 'number' || typeof event.priorQuarterEPS !== 'number') {
    return null;
  }
  return Math.abs(event.expectedEPS - event.priorQuarterEPS);
}

/**
 * Compute a simple crowding risk score based on the provided crowdingScore.
 * Missing data yields null.
 */
export function computeCrowdingRisk(event: EarningsEvent): number | null {
  if (typeof event.crowdingScore !== 'number') {
    return null;
  }
  return event.crowdingScore;
}

/**
 * Determine the anticipation category and reasons for a given event.
 * The heuristics here are intentionally simple and transparent. They should be
 * replaced with more sophisticated logic as data availability improves.
 */
export function classifyPrep(event: EarningsEvent): { category: PrepCategory; reasons: string[] } {
  const reasons: string[] = [];

  const surprisePotential = computeSurprisePotential(event);
  const crowding = computeCrowdingRisk(event) ?? 0;
  const baseScore = event.baseStructureScore ?? 0;

  // If we lack core inputs, we cannot make a strong judgement.
  if (surprisePotential === null) {
    reasons.push('Missing expected or prior EPS data');
    return { category: 'UNKNOWN', reasons };
  }

  // High surprise potential coupled with a decent base and low crowding is attractive.
  if (surprisePotential > 0.2 && baseScore > 0.5 && crowding < 0.6) {
    reasons.push('High surprise potential and healthy base');
    return { category: 'WORTH_STALKING', reasons };
  }
  // Avoid when crowding is excessive.
  if (crowding >= 0.6) {
    reasons.push('Elevated crowding risk');
    return { category: 'AVOID_CROWDING', reasons };
  }
  // Ignore if the base is very weak (low relative strength or poor technical structure).
  if (baseScore < 0.3) {
    reasons.push('Weak base structure');
    return { category: 'IGNORE', reasons };
  }
  // Otherwise watch for post print setups.
  reasons.push('Moderate setup – monitor after the event');
  return { category: 'WATCH_POST_PRINT', reasons };
}

/**
 * Build a prep board entry for an event.
 */
export function buildPrepBoardItem(event: EarningsEvent): PrepBoardItem {
  const surprisePotential = computeSurprisePotential(event);
  const crowdingRisk = computeCrowdingRisk(event);
  const { category, reasons } = classifyPrep(event);
  return {
    event,
    surprisePotential,
    crowdingRisk,
    category,
    reasons
  };
}

/**
 * Compute the raw earnings surprise (actual minus expected EPS).
 */
export function computeEpsSurprise(event: EarningsEvent): number | null {
  if (typeof event.actualEPS !== 'number' || typeof event.expectedEPS !== 'number') {
    return null;
  }
  return event.actualEPS - event.expectedEPS;
}

/**
 * Compute the fractional price reaction relative to the pre‑earnings close.
 */
export function computePriceReaction(event: EarningsEvent): number | null {
  if (typeof event.priceBefore !== 'number' || typeof event.priceAfter !== 'number' || event.priceBefore === 0) {
    return null;
  }
  return (event.priceAfter - event.priceBefore) / event.priceBefore;
}

/**
 * Classify the quality of the market’s reaction to the earnings surprise.
 * This function compares the sign and magnitude of the price reaction relative
 * to the EPS surprise. If guidance or revenue beats are available you could
 * incorporate them too, but to keep this deterministic the model sticks to EPS.
 */
export function classifyReaction(event: EarningsEvent): { quality: ReactionQuality; reasons: string[]; surprise: number | null; priceReaction: number | null } {
  const reasons: string[] = [];
  const surprise = computeEpsSurprise(event);
  const priceReaction = computePriceReaction(event);
  // If we cannot compute the inputs, we mark as unknown.
  if (surprise === null || priceReaction === null) {
    reasons.push('Missing earnings or price data');
    return { quality: 'UNKNOWN', reasons, surprise, priceReaction };
  }
  const surpriseAbs = Math.abs(surprise);
  const reactionAbs = Math.abs(priceReaction);
  // Compare signs
  const sameDirection = Math.sign(surprise) === Math.sign(priceReaction);
  if (!sameDirection) {
    reasons.push('Price moved opposite to earnings surprise');
    return { quality: 'AMBIGUOUS', reasons, surprise, priceReaction };
  }
  // Assess magnitude
  if (reactionAbs < 0.5 * surpriseAbs) {
    reasons.push('Price reaction smaller than half of surprise magnitude');
    return { quality: 'UNDERREACTED', reasons, surprise, priceReaction };
  }
  if (reactionAbs > 1.5 * surpriseAbs) {
    reasons.push('Price reaction larger than 1.5× surprise magnitude');
    return { quality: 'OVERREACTED', reasons, surprise, priceReaction };
  }
  reasons.push('Price reaction aligns with earnings surprise');
  return { quality: 'JUSTIFIED', reasons, surprise, priceReaction };
}

/**
 * Build a reaction board entry summarising the post‑print classification.
 */
export function buildReactionItem(event: EarningsEvent): ReactionItem {
  const { quality, reasons, surprise, priceReaction } = classifyReaction(event);
  return {
    event,
    surprise,
    priceReaction,
    reactionQuality: quality,
    reasons
  };
}

/**
 * Classify post‑event drift into follow‑through, fade or ambiguous categories.
 */
export function classifyDrift(event: EarningsEvent): { classification: DriftItem['classification']; reasons: string[]; drift: number | null } {
  const reasons: string[] = [];
  const drift = typeof event.postEventDrift === 'number' ? event.postEventDrift : null;
  if (drift === null) {
    reasons.push('Missing post‑event drift data');
    return { classification: 'UNKNOWN', reasons, drift };
  }
  if (drift > 0.02) {
    reasons.push('Price continued higher after the event');
    return { classification: 'FOLLOW_THROUGH', reasons, drift };
  }
  if (drift < -0.02) {
    reasons.push('Price reversed lower after the event');
    return { classification: 'FADE', reasons, drift };
  }
  reasons.push('Drift is small or mixed');
  return { classification: 'AMBIGUOUS', reasons, drift };
}

/**
 * Build a drift board entry summarising post‑event drift classification.
 */
export function buildDriftItem(event: EarningsEvent): DriftItem {
  const { classification, reasons, drift } = classifyDrift(event);
  return {
    event,
    drift,
    classification,
    reasons
  };
}