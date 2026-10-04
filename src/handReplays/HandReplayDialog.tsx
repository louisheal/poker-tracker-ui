import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
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
  open: boolean;
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
      </DialogContent>
    </Dialog>
  );
};
