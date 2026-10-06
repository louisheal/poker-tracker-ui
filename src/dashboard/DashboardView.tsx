import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Header } from "../Header";
import { MetricsView } from "../metrics/MetricsView";
import { WinrateGraph } from "../winrate/WinrateGraph";

const dashboardViewSx = {
  minHeight: "100vh",
  bgcolor: "background.default",
  color: "text.primary",
} satisfies SxProps<Theme>;

const dashboardContentSx = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  px: { xs: 2, sm: 3, lg: 5 },
  py: 4,
  maxWidth: 1440,
  mx: "auto",
} satisfies SxProps<Theme>;

export const DashboardView = () => {
  return (
    <Box sx={dashboardViewSx}>
      <Header />
      <Box component="main" sx={dashboardContentSx}>
        <Box>
          <Typography component="h2" variant="h5" sx={{ fontWeight: 600 }}>
            Dashboard
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Cumulative winnings in big blinds, per 100 hands
          </Typography>
        </Box>
        <MetricsView />
        <WinrateGraph />
      </Box>
    </Box>
  );
};
