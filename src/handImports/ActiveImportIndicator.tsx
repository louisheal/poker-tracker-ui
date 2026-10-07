import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { HandImportJobDto, HandImportStatus } from "./api";

const indicatorSx = {
  display: "inline-flex",
  alignItems: "center",
  ml: 1,
  // cursor: "help",
} satisfies SxProps<Theme>;

const tooltipContentSx = {
  display: "grid",
  gap: 1,
  minWidth: 250,
  maxWidth: 400,
} satisfies SxProps<Theme>;

const fileRowSx = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "center",
  columnGap: 2,
} satisfies SxProps<Theme>;

const statusLabel = (status: HandImportStatus): string => {
  switch (status) {
    case "queued":
      return "Queued";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
  }
};

interface Props {
  jobs: HandImportJobDto[];
}

export const ActiveImportIndicator = (props: Props) => {
  const activeJobs = props.jobs.filter(
    (job) =>
      job.status === "queued" ||
      job.status === "processing" ||
      job.files.some((file) => file.status === "queued" || file.status === "processing"),
  );
  const files = activeJobs.flatMap((job) => job.files.map((file) => ({ jobId: job.jobId, file })));
  if (files.length === 0) return null;

  return (
    <Tooltip
      // arrow
      placement="bottom-end"
      title={
        <Box sx={tooltipContentSx}>
          {files.map(({ jobId, file }) => (
            <Box key={`${jobId}:${file.fileId}`}>
              <Box sx={fileRowSx}>
                <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                  {file.fileName}
                </Typography>
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                  {file.status === "processing" && <CircularProgress color="inherit" size={14} />}
                  <Typography variant="caption">{statusLabel(file.status)}</Typography>
                </Box>
              </Box>
              {file.errorMessage !== null && (
                <Typography variant="caption" color="error.light" sx={{ overflowWrap: "anywhere" }}>
                  {file.errorMessage}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      }
    >
      <Box component="span" role="status" aria-label="Hand imports in progress" sx={indicatorSx}>
        <CircularProgress size={20} aria-label="Hand imports in progress" />
      </Box>
    </Tooltip>
  );
};
