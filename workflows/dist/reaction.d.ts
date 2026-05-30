import { ReactionItem } from '@earningsflow/core';
/**
 * Generate the reaction board by evaluating how the market responded to each
 * earnings event. The board is not sorted because reactions could be
 * interpreted in multiple ways; downstream consumers may sort based on their
 * own criteria (e.g. magnitude of mispricing).
 */
export declare function runReactionBoard(): Promise<ReactionItem[]>;
