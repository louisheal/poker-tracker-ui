import { Box, Typography } from "@mui/material";
import { cardFrameSx } from "./cardStyles";

export const CardBack = () => {
  return (
    <Box
      role="img"
      aria-label="Face-down card"
      sx={{
        ...cardFrameSx,
        border: "1px solid rgba(255, 255, 255, 0.3)",
        bgcolor: "#29445b",
        color: "rgba(255, 255, 255, 0.85)",
        "&::before": {
          position: "absolute",
          inset: 3,
          border: "1px solid rgba(255, 255, 255, 0.35)",
          borderRadius: 0.5,
          content: '""',
        },
      }}
    >
      <Typography aria-hidden="true" component="span" sx={{ fontSize: 20, lineHeight: 1 }}>
        ◆
      </Typography>
    </Box>
  );
};
