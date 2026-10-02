import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { HandReplay } from "./HandReplay";
import CloseIcon from "@mui/icons-material/Close";

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
      <DialogTitle
        id="hand-replay-dialog-title"
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}
      >
        Hand replay · {props.handId}
        <IconButton aria-label="Close hand replay" onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <HandReplay key={props.handId} handId={props.handId} />
      </DialogContent>
    </Dialog>
  );
};
