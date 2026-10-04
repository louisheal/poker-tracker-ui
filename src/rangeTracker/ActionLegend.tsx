import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { rangeActionColors } from "../rangeGrid/actionColors";

const actionLegendSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 2,
} satisfies SxProps<Theme>;

const actionLegendItemSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.75,
} satisfies SxProps<Theme>;

const actionSwatchSx = {
  width: 12,
  height: 12,
  borderRadius: 0.5,
} satisfies SxProps<Theme>;

const getActionSwatchSx = (action: keyof typeof rangeActionColors): SxProps<Theme> => ({
  ...actionSwatchSx,
  bgcolor: rangeActionColors[action],
});

export const ActionLegend = () => {
  return (
    <Box sx={actionLegendSx} aria-label="Action colors">
      {(["Fold", "Call", "Raise"] as const).map((action) => (
        <Box key={action} sx={actionLegendItemSx}>
          <Box sx={getActionSwatchSx(action)} />
          <Typography variant="caption">{action}</Typography>
        </Box>
      ))}
    </Box>
  );
};
