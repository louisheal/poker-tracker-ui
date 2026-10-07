import { FileUpload } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Snackbar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import type { HandImportJobDto } from "./api";
import { uploadHandHistories } from "./api";
import { ActiveImportIndicator } from "./ActiveImportIndicator";

const uploadSnackbarSx = {
  top: "80px !important",
  width: "min(calc(100vw - 32px), 560px)",
} satisfies SxProps<Theme>;

const snackbarAlertSx = {
  width: "100%",
} satisfies SxProps<Theme>;

interface Props {
  jobs: HandImportJobDto[];
  onJobAccepted: (job: HandImportJobDto) => void;
  onJobCompleted?: (job: HandImportJobDto) => void;
  statusError: string | null;
  onDismissStatusError: () => void;
}

export const UploadButton = (props: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const [summaryJob, setSummaryJob] = useState<HandImportJobDto | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const notifiedJobIds = useRef(new Set<string>());
  const jobs = props.jobs;
  const onJobCompleted = props.onJobCompleted;

  useEffect(() => {
    const terminalJobs = jobs.filter(
      (job) => (job.status === "completed" || job.status === "failed") && !notifiedJobIds.current.has(job.jobId),
    );
    terminalJobs.forEach((job) => {
      notifiedJobIds.current.add(job.jobId);
      onJobCompleted?.(job);
    });
    const latestTerminalJob = terminalJobs[terminalJobs.length - 1];
    if (latestTerminalJob !== undefined) setSummaryJob(latestTerminalJob);
  }, [jobs, onJobCompleted]);

  const handleFilesSelected = async (files: File[]) => {
    setIsUploading(true);
    setSummaryJob(null);
    setErrorMessage(null);

    try {
      props.onJobAccepted(await uploadHandHistories(files));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const displayedErrorMessage = errorMessage ?? props.statusError;
  const closeError = () => {
    if (errorMessage !== null) {
      setErrorMessage(null);
    } else {
      props.onDismissStatusError();
    }
  };
  const summaryFileLabel = summaryJob?.filesReceived === 1 ? "file" : "files";
  const summaryHandLabel = summaryJob?.handsSaved === 1 ? "hand" : "hands";
  const failedFiles = summaryJob?.files.filter((file) => file.status === "failed") ?? [];
  const hasSummaryErrors = summaryJob?.status === "failed" || failedFiles.length > 0;
  const fileErrorMessages = failedFiles
    .slice(0, 3)
    .map((file) => `${file.fileName}: ${file.errorMessage ?? "Import failed."}`);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          component="label"
          variant="contained"
          disabled={isUploading}
          startIcon={isUploading ? <CircularProgress color="inherit" size={18} /> : <FileUpload />}
        >
          {isUploading ? "Uploading..." : "Upload files"}
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
        <ActiveImportIndicator jobs={props.jobs} />
      </Box>
      <Snackbar
        open={summaryJob !== null}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={uploadSnackbarSx}
        onClose={() => setSummaryJob(null)}
      >
        <Alert
          onClose={() => setSummaryJob(null)}
          severity={summaryJob?.status === "failed" ? "error" : "success"}
          sx={snackbarAlertSx}
        >
          {hasSummaryErrors ? "Import finished with errors" : "Import completed"}: {summaryJob?.filesReceived}{" "}
          {summaryFileLabel}, {summaryJob?.handsSaved} {summaryHandLabel} saved, {summaryJob?.duplicateHands}{" "}
          duplicates, and {summaryJob?.invalidHands} invalid hands.
          {fileErrorMessages.length > 0 && ` ${fileErrorMessages.join(" ")}`}
          {failedFiles.length > fileErrorMessages.length &&
            ` ${failedFiles.length - fileErrorMessages.length} additional file errors.`}
        </Alert>
      </Snackbar>
      <Snackbar
        open={displayedErrorMessage !== null}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={closeError}
      >
        <Alert onClose={closeError} severity="error" variant="filled" sx={snackbarAlertSx}>
          {displayedErrorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
