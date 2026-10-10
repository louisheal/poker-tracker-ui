import type { PostflopBetResponseBucketDto } from "./dto";

export interface PostflopBetResponseChartPoint {
  betSizeThresholdPercent: number;
  foldRatePercent: number | null;
  breakevenPercent: number;
}

export const getPostflopBetResponseChartData = (
  buckets: PostflopBetResponseBucketDto[],
  line: PostflopBetResponseBucketDto["line"],
): PostflopBetResponseChartPoint[] =>
  Array.from({ length: 30 }, (_, thresholdIndex) => (thresholdIndex + 1) * 10).map((thresholdPercent) => {
    const bucket = buckets.find(
      (candidate) => candidate.line === line && candidate.betSizeThresholdPercent === thresholdPercent,
    );
    const betToPot = thresholdPercent / 100;

    return {
      betSizeThresholdPercent: thresholdPercent,
      foldRatePercent:
        bucket === undefined || bucket.opportunityCount === 0
          ? null
          : (100 * bucket.villainFoldCount) / bucket.opportunityCount,
      breakevenPercent: (100 * betToPot) / (2 * betToPot + 1),
    };
  });
