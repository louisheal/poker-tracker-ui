import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Header } from "../Header";
import { MetricSpeedDial } from "../metrics/MetricSpeedDial";
import { getFlopMetrics } from "./flopMetrics";
import { PostflopBettingFilters } from "./PostflopBettingFilters";
import { usePostflopBettingFilters } from "./usePostflopBettingFilters";
import { usePostflopBettingAnalysis } from "./usePostflopBettingAnalysis";

const analysisViewSx = {
  minHeight: "100vh",
  bgcolor: "background.default",
  color: "text.primary",
} satisfies SxProps<Theme>;

const analysisContentSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
  px: { xs: 2, sm: 4 },
  py: 3,
} satisfies SxProps<Theme>;

const loadingSx = {
  display: "flex",
  justifyContent: "center",
  py: 6,
} satisfies SxProps<Theme>;

const headingSx = {
  fontWeight: 600,
} satisfies SxProps<Theme>;

const dialsSx = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
  gap: 2,
} satisfies SxProps<Theme>;

export const AnalysisView = () => {
  const filters = usePostflopBettingFilters();
  const analysisState = usePostflopBettingAnalysis(
    filters.pfrInPosition,
    filters.ipPosition,
    filters.oopPosition,
    filters.potTypes,
    filters.flopHighCard,
    filters.flopTextures,
  );
  const flopMetrics = analysisState.status === "loaded" ? getFlopMetrics(analysisState.analysis.stats) : null;

  return (
    <Box sx={analysisViewSx}>
      <Header />
      <Box component="main" sx={analysisContentSx}>
        <Typography component="h2" variant="h5" sx={headingSx}>
          Analysis
        </Typography>
        <PostflopBettingFilters
          pfrInPosition={filters.pfrInPosition}
          ipPosition={filters.ipPosition}
          oopPosition={filters.oopPosition}
          potTypes={filters.potTypes}
          flopHighCard={filters.flopHighCard}
          flopTextures={filters.flopTextures}
          onPfrInPositionChange={filters.selectPfrPosition}
          onIpPositionChange={filters.selectIpPosition}
          onOopPositionChange={filters.selectOopPosition}
          onPotTypesChange={filters.selectPotTypes}
          onFlopHighCardChange={filters.selectFlopHighCard}
          onFlopTexturesChange={filters.selectFlopTextures}
        />
        {analysisState.status === "loading" && (
          <Box role="status" aria-label="Loading postflop analysis" sx={loadingSx}>
            <CircularProgress size={28} />
          </Box>
        )}
        {analysisState.status === "error" && <Alert severity="error">{analysisState.message}</Alert>}
        {flopMetrics !== null && (
          <Box
            component="section"
            aria-labelledby="flop-analysis-heading"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography id="flop-analysis-heading" component="h3" variant="h6" sx={headingSx}>
              Flop
            </Typography>
            {flopMetrics.villainCBet.sampleCount === 0 &&
              flopMetrics.foldToCBet.sampleCount === 0 &&
              flopMetrics.villainDonk.sampleCount === 0 &&
              flopMetrics.foldToDonk.sampleCount === 0 && (
                <Typography color="text.secondary">No flop betting observations are available.</Typography>
              )}
            <Box sx={dialsSx}>
              <MetricSpeedDial
                label="Villain C-Bet %"
                value={flopMetrics.villainCBet.percent}
                min={0}
                max={100}
                suffix="%"
                sampleCount={flopMetrics.villainCBet.sampleCount}
              />
              <MetricSpeedDial
                label="Fold to C-Bet %"
                value={flopMetrics.foldToCBet.percent}
                min={0}
                max={100}
                suffix="%"
                sampleCount={flopMetrics.foldToCBet.sampleCount}
              />
              <MetricSpeedDial
                label="Villain Donk %"
                value={flopMetrics.villainDonk.percent}
                min={0}
                max={100}
                suffix="%"
                sampleCount={flopMetrics.villainDonk.sampleCount}
              />
              <MetricSpeedDial
                label="Fold to Donk %"
                value={flopMetrics.foldToDonk.percent}
                min={0}
                max={100}
                suffix="%"
                sampleCount={flopMetrics.foldToDonk.sampleCount}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
