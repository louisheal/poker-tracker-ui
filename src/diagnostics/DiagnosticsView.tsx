import { useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Header } from "../Header";
import { HandHistoryBrowser } from "../handHistories/HandHistoryBrowser";
import { RiverSpotsTable } from "./RiverSpotsTable";
import { useRiverDiagnostics } from "./useRiverDiagnostics";

const diagnosticsViewSx = {
  minHeight: "100vh",
  bgcolor: "background.default",
  color: "text.primary",
} satisfies SxProps<Theme>;

const diagnosticsContentSx = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  px: { xs: 2, sm: 3, lg: 5 },
  py: 4,
  maxWidth: 1440,
  mx: "auto",
} satisfies SxProps<Theme>;

const loadingSx = {
  display: "flex",
  justifyContent: "center",
  py: 8,
} satisfies SxProps<Theme>;

export const DiagnosticsView = () => {
  const diagnosticsState = useRiverDiagnostics();
  const [selectedHandIds, setSelectedHandIds] = useState<string[]>([]);
  const selectedHandIdSet = new Set(selectedHandIds);

  const toggleHandIds = (handIds: readonly string[]) => {
    setSelectedHandIds((currentHandIds) => {
      const currentSet = new Set(currentHandIds);
      const allSelected = handIds.every((handId) => currentSet.has(handId));
      if (allSelected) {
        const handIdsToRemove = new Set(handIds);
        return currentHandIds.filter((handId) => !handIdsToRemove.has(handId));
      }

      return [...new Set([...currentHandIds, ...handIds])];
    });
  };

  return (
    <Box sx={diagnosticsViewSx}>
      <Header />
      <Box component="main" sx={diagnosticsContentSx}>
        <Box>
          <Typography component="h2" variant="h5" sx={{ fontWeight: 600 }}>
            Diagnostics
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            River spots that went to showdown
          </Typography>
        </Box>
        {diagnosticsState.status === "loading" && (
          <Box role="status" aria-label="Loading river diagnostics" sx={loadingSx}>
            <CircularProgress size={28} />
          </Box>
        )}
        {diagnosticsState.status === "error" && <Alert severity="error">{diagnosticsState.message}</Alert>}
        {diagnosticsState.status === "loaded" && (
          <>
            <RiverSpotsTable
              rows={diagnosticsState.rows}
              selectedHandIds={selectedHandIdSet}
              onToggleHandIds={toggleHandIds}
            />
            {selectedHandIds.length > 0 ? (
              <HandHistoryBrowser handIds={selectedHandIds} />
            ) : (
              <Typography color="text.secondary">Select diagnostic rows to review their hands.</Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};
