import { Alert, Box, CircularProgress } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { MetricSpeedDial } from "./MetricSpeedDial";
import { useMetrics } from "./useMetrics";

const loadingSx = {
  display: "flex",
  justifyContent: "center",
  py: 8,
} satisfies SxProps<Theme>;

const dialsSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
  gap: 2,
} satisfies SxProps<Theme>;

export const MetricsView = () => {
  const metricsState = useMetrics();

  if (metricsState.status === "loading") {
    return (
      <Box role="status" aria-label="Loading metrics" sx={loadingSx}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (metricsState.status === "error") {
    return <Alert severity="error">{metricsState.message}</Alert>;
  }

  return (
    <Box sx={dialsSx}>
      <MetricSpeedDial label="Winnings (BB/100)" value={metricsState.metrics.winningsBBPer100} min={-20} max={20} />
      <MetricSpeedDial label="WTSD" value={metricsState.metrics.wentToShowdownPercent} min={0} max={50} suffix="%" />
      <MetricSpeedDial
        label="W$SD"
        value={metricsState.metrics.wonMoneyAtShowdownPercent}
        min={0}
        max={100}
        suffix="%"
      />
    </Box>
  );
};
