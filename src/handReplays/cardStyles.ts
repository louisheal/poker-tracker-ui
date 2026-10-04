import type { SxProps, Theme } from "@mui/material/styles";

export const cardFrameSx = {
  position: "relative",
  display: "grid",
  placeItems: "center",
  flex: "0 0 auto",
  width: { xs: 36, md: "clamp(36px, 4vw, 52px)" },
  aspectRatio: "5 / 7",
  overflow: "hidden",
  borderRadius: 1,
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
} satisfies SxProps<Theme>;
