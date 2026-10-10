import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { PostflopBetResponseStreet } from "./dto";
import { RiverBetResponseCharts } from "./RiverBetResponseCharts";
import type { PostflopBetResponseBucketsState } from "./usePostflopBetResponseBuckets";

const sectionSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  minWidth: 0,
} satisfies SxProps<Theme>;

const loadingSx = {
  display: "flex",
  justifyContent: "center",
  py: 6,
} satisfies SxProps<Theme>;

interface Props {
  street: PostflopBetResponseStreet;
  state: PostflopBetResponseBucketsState;
}

export const PostflopBetResponseSection = (props: Props) => {
  if (props.state.status === "idle") return null;

  return (
    <Box component="section" sx={sectionSx}>
      <Typography component="h3" variant="h6" sx={{ fontWeight: 600 }}>
        Fold Equity
      </Typography>
      {props.state.status === "loading" && (
        <Box role="status" aria-label={`Loading ${props.street.toLowerCase()} response charts`} sx={loadingSx}>
          <CircularProgress size={28} />
        </Box>
      )}
      {props.state.status === "error" && <Alert severity="error">{props.state.message}</Alert>}
      {props.state.status === "loaded" && (
        <>
          {props.state.buckets.every((bucket) => bucket.opportunityCount === 0) && (
            <Typography role="status" color="text.secondary">
              No {props.street.toLowerCase()} response observations are available.
            </Typography>
          )}
          <RiverBetResponseCharts buckets={props.state.buckets} street={props.street} />
        </>
      )}
    </Box>
  );
};
