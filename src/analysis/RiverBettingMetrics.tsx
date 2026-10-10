import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { MetricSpeedDial } from "../metrics/MetricSpeedDial";
import type { RiverAggressionType, RiverBettingStatDto } from "./dto";

const dialGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
  gap: 2,
} satisfies SxProps<Theme>;

const metricGroupSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
} satisfies SxProps<Theme>;

interface Props {
  stats: RiverBettingStatDto[];
}

const getRate = (numerator: number, denominator: number) =>
  denominator === 0 ? null : (numerator / denominator) * 100;

const getRiverMetrics = (stats: RiverBettingStatDto[], aggressionType: RiverAggressionType) => {
  const totals = stats
    .filter((stat) => stat.aggressionType === aggressionType)
    .reduce(
      (aggregate, stat) => ({
        opportunityCount: aggregate.opportunityCount + stat.opportunityCount,
        heroOpportunityCount: aggregate.heroOpportunityCount + stat.heroOpportunityCount,
        showdownCount: aggregate.showdownCount + stat.showdownCount,
        villainWinCount: aggregate.villainWinCount + stat.villainWinCount,
        opponentWinCount: aggregate.opponentWinCount + stat.opponentWinCount,
        chopCount: aggregate.chopCount + stat.chopCount,
        heroCallCount: aggregate.heroCallCount + stat.heroCallCount,
        heroCallVillainWinCount: aggregate.heroCallVillainWinCount + stat.heroCallVillainWinCount,
        heroCallHeroWinCount: aggregate.heroCallHeroWinCount + stat.heroCallHeroWinCount,
        heroCallChopCount: aggregate.heroCallChopCount + stat.heroCallChopCount,
      }),
      {
        opportunityCount: 0,
        heroOpportunityCount: 0,
        showdownCount: 0,
        villainWinCount: 0,
        opponentWinCount: 0,
        chopCount: 0,
        heroCallCount: 0,
        heroCallVillainWinCount: 0,
        heroCallHeroWinCount: 0,
        heroCallChopCount: 0,
      },
    );
  const resolvedShowdownCount = totals.villainWinCount + totals.opponentWinCount + totals.chopCount;
  const resolvedCallShowdownCount =
    totals.heroCallVillainWinCount + totals.heroCallHeroWinCount + totals.heroCallChopCount;

  return {
    wtsd: getRate(totals.showdownCount, totals.opportunityCount),
    villainWsd: getRate(totals.villainWinCount + 0.5 * totals.chopCount, resolvedShowdownCount),
    heroCallRate: getRate(totals.heroCallCount, totals.heroOpportunityCount),
    heroCallWsd: getRate(totals.heroCallHeroWinCount + totals.heroCallChopCount / 2, resolvedCallShowdownCount),
    opportunityCount: totals.opportunityCount,
    heroOpportunityCount: totals.heroOpportunityCount,
    resolvedShowdownCount,
    resolvedCallShowdownCount,
  };
};

export const RiverBettingMetrics = (props: Props) => {
  return (
    <Box sx={metricGroupSx}>
      {props.stats.length > 0 &&
        (["Bet", "Raise"] as const).map((aggressionType) => {
          const metrics = getRiverMetrics(props.stats, aggressionType);
          const heading = aggressionType === "Bet" ? "Villain river Bet" : "Villain river Raise";

          return (
            <Box key={aggressionType} sx={metricGroupSx}>
              <Typography component="h4" variant="subtitle1" sx={{ fontWeight: 600 }}>
                {heading}
              </Typography>
              <Box sx={dialGridSx}>
                <MetricSpeedDial
                  label="WTSD"
                  value={metrics.wtsd}
                  min={0}
                  max={100}
                  suffix="%"
                  sampleCount={metrics.heroOpportunityCount}
                />
                <MetricSpeedDial
                  label="Villain W$SD"
                  value={metrics.villainWsd}
                  min={0}
                  max={100}
                  suffix="%"
                  sampleCount={metrics.resolvedShowdownCount}
                />
                <MetricSpeedDial
                  label="Hero call rate"
                  value={metrics.heroCallRate}
                  min={0}
                  max={100}
                  suffix="%"
                  sampleCount={metrics.opportunityCount}
                />
                <MetricSpeedDial
                  label="Hero W$SD after call"
                  value={metrics.heroCallWsd}
                  min={0}
                  max={100}
                  suffix="%"
                  sampleCount={metrics.resolvedCallShowdownCount}
                />
              </Box>
            </Box>
          );
        })}
    </Box>
  );
};
