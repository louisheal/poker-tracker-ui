import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { SxProps, Theme } from "@mui/material/styles";
import type { HandLabelAssignment, HandLabelOption } from "../api";
import { HandLabelEditor } from "../handHistories/HandLabelEditor";
import { HandNoteCell } from "../handHistories/HandNoteCell";
import { HandReplay } from "./HandReplay";
import CloseIcon from "@mui/icons-material/Close";

const dialogTitleSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
} satisfies SxProps<Theme>;

const dialogContentSx = {
  px: { xs: 1, sm: 0 },
  py: 0,
  overflowX: "hidden",
} satisfies SxProps<Theme>;

const replayLayoutSx = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 320px" },
  alignItems: "start",
  gap: { xs: 1, lg: 2 },
  width: "100%",
  minWidth: 0,
} satisfies SxProps<Theme>;

const replaySx = {
  minWidth: 0,
} satisfies SxProps<Theme>;

const inputsPaneSx = {
  minWidth: 0,
  width: "100%",
  borderTop: { xs: 1, lg: 0 },
  borderLeft: { xs: 0, lg: 1 },
  borderColor: "divider",
  pt: { xs: 2, lg: 0 },
  pl: { xs: 0, lg: 2 },
} satisfies SxProps<Theme>;

interface Props {
  handId: string;
  labels: HandLabelAssignment[];
  note: string;
  labelOptions: readonly HandLabelOption[];
  open: boolean;
  onLabelsChanged: (handId: string, labels: HandLabelAssignment[]) => void;
  onNoteChanged: (handId: string, note: string) => void;
  onNoteSaveError: (message: string) => void;
  onClose: () => void;
}

export const HandReplayDialog = (props: Props) => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      fullScreen={isSmallScreen}
      maxWidth="lg"
      aria-labelledby="hand-replay-dialog-title"
    >
      <DialogTitle id="hand-replay-dialog-title" sx={dialogTitleSx}>
        Hand replay · {props.handId}
        <IconButton aria-label="Close hand replay" onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={dialogContentSx}>
        <Box sx={replayLayoutSx}>
          <Box sx={replaySx}>
            <HandReplay key={props.handId} handId={props.handId} />
          </Box>
          {props.open && (
            <Box sx={inputsPaneSx}>
              <Typography component="h2" variant="subtitle1" sx={{ mb: 1 }}>
                Notes
              </Typography>
              <HandNoteCell
                key={`${props.handId}:${props.note}`}
                handId={props.handId}
                note={props.note}
                onNoteChanged={props.onNoteChanged}
                onError={props.onNoteSaveError}
              />
              <Typography component="h2" variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Labels
              </Typography>
              <HandLabelEditor
                key={`${props.handId}:${props.labels.map((label) => `${label.street}:${label.label}`).join(",")}`}
                handId={props.handId}
                labels={props.labels}
                labelOptions={props.labelOptions}
                onLabelsChanged={props.onLabelsChanged}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
