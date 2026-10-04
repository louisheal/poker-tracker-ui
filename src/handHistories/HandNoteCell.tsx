import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { Box, CircularProgress, IconButton, TextField, Tooltip } from "@mui/material";
import { replaceHandNote } from "../api";

interface Props {
  handId: string;
  note: string;
  onNoteChanged: (handId: string, note: string) => void;
  onError: (message: string) => void;
}

export const HandNoteCell = (props: Props) => {
  const [draft, setDraft] = useState(props.note);
  const [isSaving, setIsSaving] = useState(false);
  const hasChanges = draft !== props.note;

  const saveNote = async () => {
    setIsSaving(true);
    try {
      const savedNote = await replaceHandNote(props.handId, draft);
      setDraft(savedNote);
      props.onNoteChanged(props.handId, savedNote);
    } catch (error) {
      props.onError(error instanceof Error ? error.message : "The note could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
      <TextField
        aria-label={`Note for hand ${props.handId}`}
        fullWidth
        multiline
        minRows={2}
        maxRows={4}
        placeholder="Add a note"
        size="small"
        sx={{ flex: "1 1 auto", minWidth: 0 }}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <Tooltip title="Save note">
        <span>
          <IconButton
            aria-label={`Save note for hand ${props.handId}`}
            disabled={!hasChanges || isSaving}
            onClick={() => void saveNote()}
            size="small"
          >
            {isSaving ? <CircularProgress size={18} /> : <SaveIcon fontSize="small" />}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};
