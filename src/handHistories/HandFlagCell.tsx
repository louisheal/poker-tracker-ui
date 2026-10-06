import { useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { setHandFlagged } from "../api";

interface Props {
  handId: string;
  flagged: boolean;
  onFlaggedChanged: (handId: string, flagged: boolean) => void;
  onError: (message: string) => void;
}

export const HandFlagCell = (props: Props) => {
  const [isSaving, setIsSaving] = useState(false);

  const toggleFlag = async () => {
    const flagged = !props.flagged;
    setIsSaving(true);
    try {
      const savedFlag = await setHandFlagged(props.handId, flagged);
      props.onFlaggedChanged(props.handId, savedFlag);
    } catch (error) {
      props.onError(error instanceof Error ? error.message : "The flag could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ width: 36, height: 36, display: "grid", placeItems: "center" }}>
      {isSaving ? (
        <CircularProgress size={24} />
      ) : (
        <IconButton
          onClick={() => void toggleFlag()}
          size="small"
          sx={{ width: "100%", height: "100%", color: props.flagged ? "warning.main" : "action.disabled" }}
        >
          <FlagIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
