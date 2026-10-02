import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";

interface Props {
  index: number;
  length: number;
  onBack: () => void;
  onForward: () => void;
}

export const HandReplayControls = (props: Props) => {
  const isFirstStep = props.index <= 0;
  const isLastStep = props.length === 0 || props.index >= props.length - 1;
  const displayedIndex = props.length === 0 ? 0 : props.index + 1;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Tooltip title="Previous action">
        <span>
          <IconButton
            aria-label="Previous action"
            disabled={isFirstStep || props.length === 0}
            onClick={props.onBack}
            size="small"
          >
            <ArrowBackIosNew fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Typography aria-live="polite" component="span" variant="body2">
        {displayedIndex} / {props.length}
      </Typography>
      <Tooltip title="Next action">
        <span>
          <IconButton aria-label="Next action" disabled={isLastStep} onClick={props.onForward} size="small">
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};
