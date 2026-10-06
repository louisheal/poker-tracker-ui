import { Box, Chip, Typography } from "@mui/material";
import type { HandLabelAssignment, HandLabelOption } from "../api";
import { handLabelStreets } from "../api";
import { getHandLabelColor } from "./handLabelStyles";

interface Props {
  labels: readonly HandLabelAssignment[];
  labelOptions: readonly HandLabelOption[];
}

export const HandLabelsCell = (props: Props) => {
  const labels = handLabelStreets.flatMap((street) => props.labels.filter((label) => label.street === street));

  if (labels.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No labels
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, minWidth: 0 }}>
      {labels.map((label) => {
        const option = props.labelOptions.find((item) => item.value === label.label);

        return (
          <Chip
            key={`${label.street}:${label.label}`}
            label={`${label.street}: ${option?.name ?? label.label}`}
            size="small"
            sx={{
              maxWidth: "100%",
              bgcolor: getHandLabelColor(option?.category ?? ""),
              color: "common.white",
            }}
          />
        );
      })}
    </Box>
  );
};
