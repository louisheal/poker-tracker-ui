import type { PostflopBettingStatDto } from "./dto";

const villainActorDirections = new Set(["VillainVsHero", "VillainVsVillain"]);

export interface DelayedContinuationBetMetric {
  percent: number | null;
  sampleCount: number;
}

export const getDelayedContinuationBetMetric = (stats: PostflopBettingStatDto[]): DelayedContinuationBetMetric => {
  const delayedStats = stats.filter(
    (stat) => stat.opportunityType === "DelayedContinuationBet" && villainActorDirections.has(stat.matchupDirection),
  );
  const sampleCount = delayedStats.reduce((total, stat) => total + stat.opportunityCount, 0);
  const betCount = delayedStats.reduce((total, stat) => total + stat.betCount, 0);

  return {
    percent: sampleCount === 0 ? null : (betCount / sampleCount) * 100,
    sampleCount,
  };
};
