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

interface Props {
  street: PostflopBetResponseStreet;
  state: PostflopBetResponseBucketsState;
}

export const PostflopBetResponseSection = (props: Props) => {
  if (props.state.status === "idle") return null;

  if (props.state.status === "loading") {
    return (
      <Box role="status" aria-label={`Loading ${props.street.toLowerCase()} response charts`} sx={sectionSx}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (props.state.status === "error") {
    return (
      <Alert severity="error" sx={sectionSx}>
        {props.state.message}
      </Alert>
    );
  }

  return (
    <Box component="section" sx={sectionSx}>
      {props.state.buckets.every((bucket) => bucket.opportunityCount === 0) && (
        <Typography role="status" color="text.secondary">
          No {props.street.toLowerCase()} response observations are available.
        </Typography>
      )}
      <RiverBetResponseCharts buckets={props.state.buckets} street={props.street} />
    </Box>
  );
};
