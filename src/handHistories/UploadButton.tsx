import { FileUpload } from "@mui/icons-material";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import { useState } from "react";
import { getHandHistories, uploadHandHistories } from "../api";

interface UploadHandHistoriesButtonProps {
  onUploaded: (handIds: string[]) => void;
}

export function UploadButton({ onUploaded }: UploadHandHistoriesButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    setIsUploading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const summary = await uploadHandHistories(files);
      const fileLabel = summary.filesReceived === 1 ? "file" : "files";
      const handLabel = summary.handsSaved === 1 ? "hand" : "hands";
      setSuccessMessage(
        `Processed ${summary.filesReceived} ${fileLabel}: ${summary.handsSaved} ${handLabel} saved, ${summary.duplicateHands} duplicates, and ${summary.invalidHands} invalid hands.`,
      );

      try {
        const handHistories = await getHandHistories();
        onUploaded(handHistories.map(({ handId }) => handId));
      } catch {
        setErrorMessage(
          "Files uploaded, but hand histories could not be refreshed.",
        );
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "File upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button
        component="label"
        variant="contained"
        disabled={isUploading}
        startIcon={
          isUploading ? (
            <CircularProgress color="inherit" size={18} />
          ) : (
            <FileUpload />
          )
        }
      >
        {isUploading ? "Processing..." : "Upload files"}
        <input
          hidden
          type="file"
          accept=".txt,text/plain"
          multiple
          onChange={(event) => {
            const files = Array.from(event.currentTarget.files ?? []);
            event.currentTarget.value = "";
            if (files.length > 0) {
              void handleFilesSelected(files);
            }
          }}
        />
      </Button>
      <Snackbar
        open={successMessage !== null}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ top: "80px !important", width: "min(calc(100vw - 32px), 560px)" }}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorMessage !== null}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setErrorMessage(null)}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
