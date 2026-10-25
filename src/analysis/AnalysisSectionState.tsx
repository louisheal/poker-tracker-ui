import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { PostflopBetResponseStreet } from "./dto";

export type AnalysisSectionStatus =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; hasData: boolean };

interface Props {
  title: string;
  street: PostflopBetResponseStreet;
  status: AnalysisSectionStatus;
  emptyMessage: string;
  children: ReactNode;
}

export const AnalysisSectionState = (props: Props) => {
  if (props.status.status === "idle") return null;

  return (
    <Box component="section" aria-label={`${props.street} ${props.title}`} sx={{ display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}>
      <Typography component="h3" variant="h6" sx={{ fontWeight: 600 }}>
        {props.title}
      </Typography>
      {props.status.status === "loading" && (
        <Box role="status" aria-label={`Loading ${props.street.toLowerCase()} ${props.title.toLowerCase()}`} sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      )}
      {props.status.status === "error" && <Alert severity="error">{props.status.message}</Alert>}
      {props.status.status === "loaded" && (
        <>
          {!props.status.hasData && (
            <Typography role="status" color="text.secondary">
              {props.emptyMessage}
            </Typography>
          )}
          {props.children}
        </>
      )}
    </Box>
  );
};
