import { Alert, Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useState } from "react";
import { Header } from "../Header";
import { MetricSpeedDial } from "../metrics/MetricSpeedDial";
import { AnalysisContextFilters } from "./AnalysisContextFilters";
import { getFlopMetrics } from "./flopMetrics";
import { PostflopBetResponseSection } from "./PostflopBetResponseSection";
import { PostflopBettingFilters } from "./PostflopBettingFilters";
import { RiverBettingMetrics } from "./RiverBettingMetrics";
import { RiverBetResponseCharts } from "./RiverBetResponseCharts";
import type { PostflopAnalysisTab } from "./dto";
import { getDelayedContinuationBetMetric } from "./turnMetrics";
import { usePostflopBettingFilters } from "./usePostflopBettingFilters";
import { usePostflopBettingAnalysis } from "./usePostflopBettingAnalysis";
import { usePostflopBetResponseBuckets } from "./usePostflopBetResponseBuckets";

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

const tabsSx = {
  borderBottom: 1,
  borderColor: "divider",
} satisfies SxProps<Theme>;

const dialsSx = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
  gap: 2,
} satisfies SxProps<Theme>;

export const AnalysisView = () => {
  const [activeTab, setActiveTab] = useState<PostflopAnalysisTab>("Flop");
  const filters = usePostflopBettingFilters();
  const analysisState = usePostflopBettingAnalysis(
    filters.pfrInPosition,
    filters.ipPosition,
    filters.oopPosition,
    filters.potTypes,
    filters.flopHighCard,
    filters.flopTextures,
    activeTab,
    filters.flopActionSequences,
    filters.flopRankTextures,
    filters.turnActionSequences,
    filters.turnRunouts,
    filters.riverRunouts,
    filters.riverBetSizeCategory,
    filters.minRiverBetToPotPercent,
    filters.maxRiverBetToPotPercent,
  );
  const betResponseBucketsState = usePostflopBetResponseBuckets(activeTab === "River" ? null : activeTab, {
    pfrInPosition: filters.pfrInPosition,
    ipPosition: filters.ipPosition,
    oopPosition: filters.oopPosition,
    potTypes: filters.potTypes,
    flopHighCard: filters.flopHighCard,
    flopTextures: filters.flopTextures,
    flopActionSequences: filters.flopActionSequences,
    flopRankTextures: filters.flopRankTextures,
    turnActionSequences: filters.turnActionSequences,
    turnRunouts: filters.turnRunouts,
  });
  const flopMetrics = analysisState.status === "loaded" ? getFlopMetrics(analysisState.analysis.stats) : null;
  const turnMetric =
    analysisState.status === "loaded" ? getDelayedContinuationBetMetric(analysisState.analysis.stats) : null;

  const selectTab = (_event: React.SyntheticEvent, value: PostflopAnalysisTab) => setActiveTab(value);

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
          onPfrInPositionChange={filters.selectPfrPosition}
          onIpPositionChange={filters.selectIpPosition}
          onOopPositionChange={filters.selectOopPosition}
          onPotTypesChange={filters.selectPotTypes}
        />
        <Tabs value={activeTab} onChange={selectTab} aria-label="Postflop analysis street" sx={tabsSx}>
          <Tab label="Flop" value="Flop" id="postflop-tab-flop" aria-controls="postflop-panel-flop" />
          <Tab label="Turn" value="Turn" id="postflop-tab-turn" aria-controls="postflop-panel-turn" />
          <Tab label="River" value="River" id="postflop-tab-river" aria-controls="postflop-panel-river" />
        </Tabs>
        <AnalysisContextFilters
          activeTab={activeTab}
          flopActionSequences={filters.flopActionSequences}
          flopHighCard={filters.flopHighCard}
          flopTextures={filters.flopTextures}
          flopRankTextures={filters.flopRankTextures}
          turnActionSequences={filters.turnActionSequences}
          turnRunouts={filters.turnRunouts}
          riverRunouts={filters.riverRunouts}
          riverBetSizeCategory={filters.riverBetSizeCategory}
          minRiverBetToPotPercent={filters.minRiverBetToPotPercent}
          maxRiverBetToPotPercent={filters.maxRiverBetToPotPercent}
          onFlopHighCardChange={filters.selectFlopHighCard}
          onFlopTexturesChange={filters.selectFlopTextures}
          onFlopActionSequencesChange={filters.selectFlopActionSequences}
          onFlopRankTexturesChange={filters.selectFlopRankTextures}
          onTurnActionSequencesChange={filters.selectTurnActionSequences}
          onTurnRunoutsChange={filters.selectTurnRunouts}
          onRiverRunoutsChange={filters.selectRiverRunouts}
          onRiverBetSizeCategoryChange={filters.selectRiverBetSizeCategory}
          onMinRiverBetToPotPercentChange={filters.selectMinRiverBetToPotPercent}
          onMaxRiverBetToPotPercentChange={filters.selectMaxRiverBetToPotPercent}
        />
        {analysisState.status === "loading" && (
          <Box role="status" aria-label="Loading postflop analysis" sx={loadingSx}>
            <CircularProgress size={28} />
          </Box>
        )}
        {analysisState.status === "error" && <Alert severity="error">{analysisState.message}</Alert>}
        <Box
          component="section"
          role="tabpanel"
          id="postflop-panel-flop"
          aria-labelledby="postflop-tab-flop"
          hidden={activeTab !== "Flop"}
          sx={{ display: activeTab === "Flop" ? "flex" : "none", flexDirection: "column", gap: 2 }}
        >
          <Typography component="h3" variant="h6" sx={headingSx}>
            Flop
          </Typography>
          {flopMetrics !== null && (
            <>
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
            </>
          )}
          <PostflopBetResponseSection street="Flop" state={betResponseBucketsState} />
        </Box>
        <Box
          component="section"
          role="tabpanel"
          id="postflop-panel-turn"
          aria-labelledby="postflop-tab-turn"
          hidden={activeTab !== "Turn"}
          sx={{ display: activeTab === "Turn" ? "flex" : "none", flexDirection: "column", gap: 2 }}
        >
          <Typography component="h3" variant="h6" sx={headingSx}>
            Turn
          </Typography>
          {turnMetric !== null && (
            <>
              {turnMetric.sampleCount === 0 ? (
                <Typography color="text.secondary">No delayed continuation bet opportunities are available.</Typography>
              ) : (
                <Box sx={dialsSx}>
                  <MetricSpeedDial
                    label="Delayed C-Bet %"
                    value={turnMetric.percent}
                    min={0}
                    max={100}
                    suffix="%"
                    sampleCount={turnMetric.sampleCount}
                  />
                </Box>
              )}
            </>
          )}
          <PostflopBetResponseSection street="Turn" state={betResponseBucketsState} />
        </Box>
        <Box
          component="section"
          role="tabpanel"
          id="postflop-panel-river"
          aria-labelledby="postflop-tab-river"
          hidden={activeTab !== "River"}
          sx={{ display: activeTab === "River" ? "flex" : "none", flexDirection: "column", gap: 2 }}
        >
          {analysisState.status === "loaded" && (
            <>
              <Typography component="h3" variant="h6" sx={headingSx}>
                River
              </Typography>
              {analysisState.analysis.riverStats.length === 0 &&
                analysisState.analysis.riverBetResponseStats.length === 0 &&
                analysisState.analysis.riverBetResponseBuckets.length === 0 && (
                  <Typography color="text.secondary">No river aggression observations are available.</Typography>
                )}
              <RiverBettingMetrics stats={analysisState.analysis.riverStats} />
              <RiverBetResponseCharts buckets={analysisState.analysis.riverBetResponseBuckets} street="River" />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
