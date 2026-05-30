/**
 * Core domain types for EarningsFlow.
 * These interfaces describe the shape of our event objects and the
 * intermediate structures produced by the analysis pipeline.
 */
export interface EarningsEvent {
    /**
     * Unique identifier for the event, typically a combination of ticker and date.
     */
    id: string;
    /** The stock ticker symbol */
    ticker: string;
    /** ISO‑8601 date string for when the earnings are/were released */
    eventDate: string;
    /** Consensus EPS estimate going into the print */
    expectedEPS?: number | null;
    /** Reported EPS from the company */
    actualEPS?: number | null;
    /** Consensus revenue estimate going into the print (in millions) */
    expectedRevenue?: number | null;
    /** Reported revenue from the company (in millions) */
    actualRevenue?: number | null;
    /** Forward EPS guidance provided during the call */
    guidanceEPS?: number | null;
    /** Forward revenue guidance provided during the call (in millions) */
    guidanceRevenue?: number | null;
    /** EPS from the prior comparable quarter */
    priorQuarterEPS?: number | null;
    /** Prior surprise metric (actual minus expected for previous quarter) */
    priorSurprise?: number | null;
    /** Close price before the earnings release */
    priceBefore?: number | null;
    /** Close price after the earnings release */
    priceAfter?: number | null;
    /** List of peer tickers for context analysis */
    peerGroup?: string[];
    /**
     * Market‑implied move from options prices. A fractional representation (e.g. 0.05 for 5%).
     */
    optionsImpliedMove?: number | null;
    /** Whether a full transcript is available */
    transcriptsAvailable?: boolean;
    /** Whether options data is available */
    optionsDataAvailable?: boolean;
    /** A 0‑1 score indicating how crowded the trade is (higher means more crowded) */
    crowdingScore?: number | null;
    /** A 0‑1 score describing the health of the price base going into the event */
    baseStructureScore?: number | null;
    /** Post‑event drift (percentage move after the reaction period) */
    postEventDrift?: number | null;
}
export type ReactionQuality = 'JUSTIFIED' | 'UNDERREACTED' | 'OVERREACTED' | 'AMBIGUOUS' | 'UNKNOWN';
export type PrepCategory = 'WORTH_STALKING' | 'AVOID_CROWDING' | 'WATCH_POST_PRINT' | 'IGNORE' | 'UNKNOWN';
export interface PrepBoardItem {
    event: EarningsEvent;
    /** Absolute difference between consensus EPS and prior EPS; used as a proxy for surprise potential */
    surprisePotential: number | null;
    /** Crowding risk used to temper entries */
    crowdingRisk: number | null;
    /** Assigned category for anticipation */
    category: PrepCategory;
    /** Human‑readable reasons explaining the classification */
    reasons: string[];
}
export interface ReactionItem {
    event: EarningsEvent;
    /** Actual surprise (actualEPS minus expectedEPS) */
    surprise: number | null;
    /** Price reaction expressed as a fractional return */
    priceReaction: number | null;
    /** Classification of reaction quality */
    reactionQuality: ReactionQuality;
    /** Reasons supporting the classification */
    reasons: string[];
}
export interface DriftItem {
    event: EarningsEvent;
    /** Post‑event drift measured over a subsequent window */
    drift: number | null;
    /** Classification of the drift behaviour */
    classification: 'FOLLOW_THROUGH' | 'FADE' | 'AMBIGUOUS' | 'UNKNOWN';
    /** Explanatory notes */
    reasons: string[];
}
