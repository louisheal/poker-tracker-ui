import type { PostflopBettingStatDto, PostflopOpportunityType } from "./dto";

const actorVillainDirections = new Set(["VillainVsHero", "VillainVsVillain"]);
const responderVillainDirections = new Set(["HeroVsVillain", "VillainVsVillain"]);
const countedResponses = new Set(["Fold", "Call", "Raise"]);

interface BetMetric {
  percent: number | null;
  sampleCount: number;
}

interface FoldMetric {
  percent: number | null;
  sampleCount: number;
}

export interface FlopMetrics {
  villainCBet: BetMetric;
  foldToCBet: FoldMetric;
  villainDonk: BetMetric;
  foldToDonk: FoldMetric;
}

const getBetMetric = (stats: PostflopBettingStatDto[], opportunityType: PostflopOpportunityType): BetMetric => {
  const matchingStats = stats.filter(
    (stat) => stat.opportunityType === opportunityType && actorVillainDirections.has(stat.matchupDirection),
  );
  const sampleCount = matchingStats.reduce((total, stat) => total + stat.opportunityCount, 0);
  const betCount = matchingStats.reduce((total, stat) => total + stat.betCount, 0);

  return {
    percent: sampleCount === 0 ? null : (betCount / sampleCount) * 100,
    sampleCount,
  };
};

const getFoldMetric = (stats: PostflopBettingStatDto[], opportunityType: PostflopOpportunityType): FoldMetric => {
  const matchingStats = stats.filter(
    (stat) => stat.opportunityType === opportunityType && responderVillainDirections.has(stat.matchupDirection),
  );
  const responseCounts = matchingStats.flatMap((stat) => stat.responseBreakdown);
  const sampleCount = responseCounts
    .filter((response) => countedResponses.has(response.responseType))
    .reduce((total, response) => total + response.count, 0);
  const foldCount = responseCounts
    .filter((response) => response.responseType === "Fold")
    .reduce((total, response) => total + response.count, 0);

  return {
    percent: sampleCount === 0 ? null : (foldCount / sampleCount) * 100,
    sampleCount,
  };
};

export const getFlopMetrics = (stats: PostflopBettingStatDto[]): FlopMetrics => ({
  villainCBet: getBetMetric(stats, "FlopContinuationBet"),
  foldToCBet: getFoldMetric(stats, "FlopContinuationBet"),
  villainDonk: getBetMetric(stats, "DonkBet"),
  foldToDonk: getFoldMetric(stats, "DonkBet"),
});
