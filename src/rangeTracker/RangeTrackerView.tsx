import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Header } from "../Header";
import { RangeGrid } from "../rangeGrid/RangeGrid";
import { ActionLegend } from "./ActionLegend";
import { RangeTrackerControls } from "./controls/RangeTrackerControls";
import { usePreflopSpotSelection } from "./usePreflopSpotSelection";
import { useFetchActualRange } from "./useFetchActualRange";

const rangeTrackerViewSx = {
  minHeight: "100vh",
  bgcolor: "background.default",
  color: "text.primary",
} satisfies SxProps<Theme>;

const rangeTrackerContentSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
  px: { xs: 2, sm: 4 },
  py: 3,
} satisfies SxProps<Theme>;

const rangeLoadingSx = {
  display: "flex",
  justifyContent: "center",
  py: 4,
} satisfies SxProps<Theme>;

const rangeHeadingSx = {
  fontWeight: 600,
} satisfies SxProps<Theme>;

export const RangeTrackerView = () => {
  const {
    spotKey,
    spotType,
    heroPosition,
    villainPosition,
    heroOptions,
    villainOptions,
    handleSpotTypeChange,
    handleHeroPositionChange,
    handleVillainPositionChange,
  } = usePreflopSpotSelection();

  const { range, isLoading, errorMessage } = useFetchActualRange(spotKey);

  const heading = spotType === "RFI" ? `Hero ${heroPosition} RFI` : `Hero ${heroPosition} vs ${villainPosition} open`;

  return (
    <Box sx={rangeTrackerViewSx}>
      <Header />
      <Box component="main" sx={rangeTrackerContentSx}>
        <Typography component="h2" variant="h5" sx={rangeHeadingSx}>
          Range Tracker
        </Typography>
        <RangeTrackerControls
          spotType={spotType}
          heroPosition={heroPosition}
          villainPosition={villainPosition}
          heroOptions={heroOptions}
          villainOptions={villainOptions}
          handleSpotTypeChange={handleSpotTypeChange}
          handleHeroPositionChange={handleHeroPositionChange}
          handleVillainPositionChange={handleVillainPositionChange}
        />
        <Typography variant="subtitle1" color="text.secondary">
          {heading}
        </Typography>
        <ActionLegend />
        {isLoading && (
          <Box role="status" aria-label="Loading range" sx={rangeLoadingSx}>
            <CircularProgress size={28} />
          </Box>
        )}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {!isLoading && !errorMessage && range?.hands.length === 0 && (
          <Typography color="text.secondary">No observations for this spot.</Typography>
        )}
        {!isLoading && !errorMessage && range && range.hands.length > 0 && (
          <RangeGrid hands={range.hands} label={`${heading} observed range`} />
        )}
      </Box>
    </Box>
  );
};
