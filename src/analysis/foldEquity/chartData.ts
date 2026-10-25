import type { PostflopBetResponseBucketDto } from "../dto";

export interface FoldEquityChartPoint {
  betSizeThresholdPercent: number;
  opportunityCount: number;
  foldRatePercent: number | null;
  breakevenPercent: number;
}

export const getFoldEquityChartData = (
  buckets: PostflopBetResponseBucketDto[],
  line: PostflopBetResponseBucketDto["line"],
): FoldEquityChartPoint[] =>
  Array.from({ length: 30 }, (_, thresholdIndex) => (thresholdIndex + 1) * 10).map((thresholdPercent) => {
    const bucket = buckets.find(
      (candidate) => candidate.line === line && candidate.betSizeThresholdPercent === thresholdPercent,
    );
    const betToPot = thresholdPercent / 100;

    return {
      betSizeThresholdPercent: thresholdPercent,
      opportunityCount: bucket?.opportunityCount ?? 0,
      foldRatePercent:
        bucket === undefined || bucket.opportunityCount === 0
          ? null
          : (100 * bucket.villainFoldCount) / bucket.opportunityCount,
      breakevenPercent: (100 * betToPot) / (2 * betToPot + 1),
    };
  });
