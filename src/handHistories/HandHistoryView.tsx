import { useState } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Header } from "../Header";
import { HandHistoryBrowser } from "./HandHistoryBrowser";
import { UploadButton } from "./UploadButton";

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

  return (
    <Box sx={handHistoryViewSx}>
      <Header>
        <UploadButton onUploaded={() => setRefreshVersion((version) => version + 1)} />
      </Header>
      <Box component="main" sx={handHistoryContentSx}>
        <HandHistoryBrowser refreshVersion={refreshVersion} />
      </Box>
    </Box>
  );
};
