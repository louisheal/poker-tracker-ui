import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { HandLabelAssignment, HandLabelOption } from "../api";
import { HandLabelEditor } from "../handHistories/HandLabelEditor";
import { HandReplay } from "./HandReplay";
import CloseIcon from "@mui/icons-material/Close";

const dialogTitleSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
} satisfies SxProps<Theme>;

const dialogContentSx = {
  p: 0,
} satisfies SxProps<Theme>;

interface Props {
  handId: string;
  labels: HandLabelAssignment[];
  labelOptions: readonly HandLabelOption[];
  open: boolean;
  onLabelsChanged: (handId: string, labels: HandLabelAssignment[]) => void;
  onClose: () => void;
}

export const HandReplayDialog = (props: Props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
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
        <HandReplay key={props.handId} handId={props.handId} />
        {props.open && (
          <Box sx={{ px: 2, py: 2 }}>
            <HandLabelEditor
              key={`${props.handId}:${props.labels.map((label) => `${label.street}:${label.label}`).join(",")}`}
              handId={props.handId}
              labels={props.labels}
              labelOptions={props.labelOptions}
              onLabelsChanged={props.onLabelsChanged}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
