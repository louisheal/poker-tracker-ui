import { useState } from "react";
import { Box } from "@mui/material";
import { Header } from "./Header";
import { HandHistoryTable } from "./HandHistoryTable";
import { UploadHandHistoriesButton } from "./UploadHandHistoriesButton";

export interface HandHistoryViewProps {
  handIds?: readonly string[];
}

export function HandHistoryView({ handIds = [] }: HandHistoryViewProps) {
  const [uploadedHandIds, setUploadedHandIds] = useState<string[] | null>(null);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Header>
        <UploadHandHistoriesButton onUploaded={setUploadedHandIds} />
      </Header>
      <Box
        component="main"
        sx={{
          display: "flex",
          minHeight: "calc(100vh - 65px)",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          px: 2.5,
          py: 4,
        }}
      >
        <HandHistoryTable handIds={uploadedHandIds ?? handIds} />
      </Box>
    </Box>
  );
}
