import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

const chartLegendSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: { xs: 1.5, sm: 3 },
  mb: 1,
} satisfies SxProps<Theme>;

interface Props {
  series: readonly {
    key: string;
    label: string;
    color: string;
  }[];
}

export const DailyWinningsChartLegend = (props: Props) => (
  <Box sx={chartLegendSx} aria-label="Chart legend">
    {props.series.map((series) => (
      <Box key={series.key} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box aria-hidden="true" sx={{ width: 18, height: 3, bgcolor: series.color, flexShrink: 0 }} />
        <Typography variant="body2" color="text.secondary">
          {series.label}
        </Typography>
      </Box>
    ))}
  </Box>
);
