import { Box, Tab, Tabs, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useState } from "react";
import { Header } from "../Header";
import { AnalysisContextFilters } from "./AnalysisContextFilters";
import { PostflopBetResponseSection } from "./PostflopBetResponseSection";
import { PostflopBettingFilters } from "./PostflopBettingFilters";
import type { PostflopAnalysisTab } from "./dto";
import { usePostflopBettingFilters } from "./usePostflopBettingFilters";
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

const headingSx = {
  fontWeight: 600,
} satisfies SxProps<Theme>;

const tabsSx = {
  borderBottom: 1,
  borderColor: "divider",
} satisfies SxProps<Theme>;

export const AnalysisView = () => {
  const [activeTab, setActiveTab] = useState<PostflopAnalysisTab>("Flop");
  const filters = usePostflopBettingFilters();
  const betResponseBucketsState = usePostflopBetResponseBuckets(activeTab, {
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
    riverRunouts: filters.riverRunouts,
    riverBetSizeCategory: filters.riverBetSizeCategory,
  });

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
          onFlopHighCardChange={filters.selectFlopHighCard}
          onFlopTexturesChange={filters.selectFlopTextures}
          onFlopActionSequencesChange={filters.selectFlopActionSequences}
          onFlopRankTexturesChange={filters.selectFlopRankTextures}
          onTurnActionSequencesChange={filters.selectTurnActionSequences}
          onTurnRunoutsChange={filters.selectTurnRunouts}
          onRiverRunoutsChange={filters.selectRiverRunouts}
          onRiverBetSizeCategoryChange={filters.selectRiverBetSizeCategory}
        />
        <Box
          component="section"
          role="tabpanel"
          id="postflop-panel-flop"
          aria-labelledby="postflop-tab-flop"
          hidden={activeTab !== "Flop"}
          sx={{ display: activeTab === "Flop" ? "flex" : "none", flexDirection: "column", gap: 2 }}
        >
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
          <PostflopBetResponseSection street="River" state={betResponseBucketsState} />
        </Box>
      </Box>
    </Box>
  );
};
