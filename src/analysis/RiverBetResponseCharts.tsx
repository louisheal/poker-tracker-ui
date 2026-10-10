import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { PostflopBetResponseBucketDto, PostflopBetResponseStreet } from "./dto";
import { RiverBetResponseChart } from "./RiverBetResponseChart";

const chartsGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", xl: "repeat(2, minmax(0, 1fr))" },
  gap: 2,
} satisfies SxProps<Theme>;

interface Props {
  buckets: PostflopBetResponseBucketDto[];
  street: PostflopBetResponseStreet;
}

export const RiverBetResponseCharts = (props: Props) => (
  <Box sx={chartsGridSx}>
    <RiverBetResponseChart buckets={props.buckets} line="BF" street={props.street} />
    <RiverBetResponseChart buckets={props.buckets} line="XBF" street={props.street} />
  </Box>
);
