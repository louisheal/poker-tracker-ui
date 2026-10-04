import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

const pokerChipContainerSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
} satisfies SxProps<Theme>;

const pokerChipSx = {
  display: "grid",
  width: 24,
  aspectRatio: "1",
  placeItems: "center",
  border: "3px dashed #fff",
  borderRadius: "50%",
  bgcolor: "#b33d45",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.35)",
} satisfies SxProps<Theme>;

const pokerChipAmountSx = {
  fontWeight: 700,
  whiteSpace: "nowrap",
} satisfies SxProps<Theme>;

interface Props {
  amountBB: number;
}

export const PokerChip = (props: Props) => {
  if (props.amountBB <= 0) {
    return null;
  }

  return (
    <Box role="img" aria-label={`Bet ${props.amountBB} big blinds`} sx={pokerChipContainerSx}>
      <Box aria-hidden="true" sx={pokerChipSx} />
      <Typography color="common.white" variant="caption" sx={pokerChipAmountSx}>
        {props.amountBB} BB
      </Typography>
    </Box>
  );
};
