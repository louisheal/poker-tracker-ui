import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { DailyWinningsChart } from "./DailyWinningsChart";
import { useWinrateGraph } from "./useWinrateGraph";

const chartLoadingSx = {
  display: "flex",
  justifyContent: "center",
  py: 8,
} satisfies SxProps<Theme>;

export const WinrateGraph = () => {
  const graphState = useWinrateGraph();

  if (graphState.status === "loading") {
    return (
      <Box role="status" aria-label="Loading winrate graph" sx={chartLoadingSx}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (graphState.status === "error") {
    return <Alert severity="error">{graphState.message}</Alert>;
  }

  if (graphState.status === "empty") {
    return <Typography color="text.secondary">No daily results yet.</Typography>;
  }

  return <DailyWinningsChart points={graphState.points} />;
};
