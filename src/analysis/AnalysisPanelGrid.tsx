import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

const panelGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", xl: "repeat(2, minmax(0, 1fr))" },
  gap: 2,
} satisfies SxProps<Theme>;

interface Props {
  children: ReactNode;
}

export const AnalysisPanelGrid = (props: Props) => <Box sx={panelGridSx}>{props.children}</Box>;
