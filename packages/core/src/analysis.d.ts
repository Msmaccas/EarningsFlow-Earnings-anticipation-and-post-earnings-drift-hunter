import { EarningsEvent, PrepBoardItem, PrepCategory, ReactionItem, ReactionQuality, DriftItem } from './entities';
/**
 * Compute the absolute difference between the consensus EPS and prior quarter EPS.
 * This is used as a proxy for how much surprise potential exists.
 */
export declare function computeSurprisePotential(event: EarningsEvent): number | null;
/**
 * Compute a simple crowding risk score based on the provided crowdingScore.
 * Missing data yields null.
 */
export declare function computeCrowdingRisk(event: EarningsEvent): number | null;
/**
 * Determine the anticipation category and reasons for a given event.
 * The heuristics here are intentionally simple and transparent. They should be
 * replaced with more sophisticated logic as data availability improves.
 */
export declare function classifyPrep(event: EarningsEvent): {
    category: PrepCategory;
    reasons: string[];
};
/**
 * Build a prep board entry for an event.
 */
export declare function buildPrepBoardItem(event: EarningsEvent): PrepBoardItem;
/**
 * Compute the raw earnings surprise (actual minus expected EPS).
 */
export declare function computeEpsSurprise(event: EarningsEvent): number | null;
/**
 * Compute the fractional price reaction relative to the pre‑earnings close.
 */
export declare function computePriceReaction(event: EarningsEvent): number | null;
/**
 * Classify the quality of the market’s reaction to the earnings surprise.
 * This function compares the sign and magnitude of the price reaction relative
 * to the EPS surprise. If guidance or revenue beats are available you could
 * incorporate them too, but to keep this deterministic the model sticks to EPS.
 */
export declare function classifyReaction(event: EarningsEvent): {
    quality: ReactionQuality;
    reasons: string[];
    surprise: number | null;
    priceReaction: number | null;
};
/**
 * Build a reaction board entry summarising the post‑print classification.
 */
export declare function buildReactionItem(event: EarningsEvent): ReactionItem;
/**
 * Classify post‑event drift into follow‑through, fade or ambiguous categories.
 */
export declare function classifyDrift(event: EarningsEvent): {
    classification: DriftItem['classification'];
    reasons: string[];
    drift: number | null;
};
/**
 * Build a drift board entry summarising post‑event drift classification.
 */
export declare function buildDriftItem(event: EarningsEvent): DriftItem;
