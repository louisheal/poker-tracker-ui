import { useState } from "react";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { HandHistoryFilters } from "./HandHistoryFilters";
import { HandHistoryTable } from "./HandHistoryTable";
import { HandReplayDialog } from "../handReplays/HandReplayDialog";
import { useHandHistoryBrowser } from "./useHandHistoryBrowser";

const unlabelledFilterValue = "__unlabelled__";

const handHistoryBrowserSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  width: "100%",
} satisfies SxProps<Theme>;

const tableLoadingContainerSx = {
  position: "relative",
  width: "min(100%, 1350px)",
} satisfies SxProps<Theme>;

const loadingOverlaySx = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  display: "grid",
  placeItems: "center",
  bgcolor: "action.disabledBackground",
  backdropFilter: "blur(2px)",
  cursor: "progress",
  pointerEvents: "auto",
} satisfies SxProps<Theme>;

const errorAlertSx = {
  width: "100%",
} satisfies SxProps<Theme>;

interface Props {
  handIds?: readonly string[];
  refreshVersion?: number;
}

export const HandHistoryBrowser = (props: Props) => {
  const [selectedLabelFilters, setSelectedLabelFilters] = useState<string[]>([]);
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const historyState = useHandHistoryBrowser({
    handIds: props.handIds,
    selectedLabelFilters,
    includeUnlabelled: selectedLabelFilters.includes(unlabelledFilterValue),
    flaggedOnly,
    refreshVersion: props.refreshVersion ?? 0,
  });
  const isFilteredHistoryView = props.handIds === undefined;

  return (
    <Box sx={handHistoryBrowserSx}>
      {isFilteredHistoryView && (
        <HandHistoryFilters
          labelOptions={historyState.labelOptions}
          selectedLabelFilters={selectedLabelFilters}
          flaggedOnly={flaggedOnly}
          onLabelFiltersChanged={(labels) => {
            historyState.clearError();
            setSelectedLabelFilters(labels);
          }}
          onFlaggedOnlyChanged={(value) => {
            historyState.clearError();
            setFlaggedOnly(value);
          }}
        />
      )}
      <Box sx={tableLoadingContainerSx} aria-busy={historyState.isLoading}>
        <HandHistoryTable
          hands={historyState.hands}
          labelOptions={historyState.labelOptions}
          isLoading={historyState.isLoading}
          onSelectHand={historyState.selectHand}
          onFlaggedChanged={historyState.handleFlaggedChanged}
          onFlagSaveError={historyState.reportError}
        />
        {historyState.isLoading && (
          <Box role="status" aria-label="Loading hand histories" sx={loadingOverlaySx}>
            <CircularProgress aria-label="Loading hand histories" />
          </Box>
        )}
      </Box>
      <HandReplayDialog
        handId={historyState.selectedHand?.handId ?? ""}
        labels={historyState.selectedHand?.labels ?? []}
        note={historyState.selectedHand?.note ?? ""}
        labelOptions={historyState.labelOptions}
        open={historyState.selectedHand !== null}
        onLabelsChanged={historyState.handleLabelsChanged}
        onNoteChanged={historyState.handleNoteChanged}
        onNoteSaveError={historyState.reportError}
        onClose={historyState.closeReplay}
      />
      <Snackbar
        open={historyState.errorMessage !== null}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={historyState.clearError}
      >
        <Alert onClose={historyState.clearError} severity="error" variant="filled" sx={errorAlertSx}>
          {historyState.errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
