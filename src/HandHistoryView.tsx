import { Box } from "@mui/material";
import { Header } from "./Header";
import { HandHistoryTable } from "./HandHistoryTable";

export interface HandHistoryViewProps {
  handIds?: readonly string[];
}

export function HandHistoryView({ handIds = [] }: HandHistoryViewProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          display: "grid",
          minHeight: "calc(100vh - 65px)",
          placeItems: "center",
          px: 2.5,
          py: 4,
        }}
      >
        <HandHistoryTable handIds={handIds} />
      </Box>
    </Box>
  );
}
