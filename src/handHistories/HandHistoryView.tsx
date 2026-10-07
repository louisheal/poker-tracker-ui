import { useState } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Header } from "../Header";
import type { HandImportJobDto } from "../handImports/api";
import { HandHistoryBrowser } from "./HandHistoryBrowser";

const handHistoryViewSx = {
  minHeight: "100vh",
  bgcolor: "background.default",
  color: "text.primary",
} satisfies SxProps<Theme>;

const handHistoryContentSx = {
  display: "flex",
  minHeight: "calc(100vh - 65px)",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  px: 2.5,
  py: 4,
} satisfies SxProps<Theme>;

export const HandHistoryView = () => {
  const [refreshVersion, setRefreshVersion] = useState(0);
  const handleImportCompleted = (job: HandImportJobDto) => {
    if (job.handsSaved > 0 || job.files.some((file) => file.status === "completed")) {
      setRefreshVersion((version) => version + 1);
    }
  };

  return (
    <Box sx={handHistoryViewSx}>
      <Header onHandImportCompleted={handleImportCompleted} />
      <Box component="main" sx={handHistoryContentSx}>
        <HandHistoryBrowser refreshVersion={refreshVersion} />
      </Box>
    </Box>
  );
};
