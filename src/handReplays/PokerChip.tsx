import { Box, Typography } from "@mui/material";

interface Props {
  amountBB: number;
}

export const PokerChip = (props: Props) => {
  if (props.amountBB <= 0) {
    return null;
  }

  return (
    <Box
      role="img"
      aria-label={`Bet ${props.amountBB} big blinds`}
      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
    >
      <Box
        aria-hidden="true"
        sx={{
          display: "grid",
          width: 24,
          aspectRatio: "1",
          placeItems: "center",
          border: "3px dashed #fff",
          borderRadius: "50%",
          bgcolor: "#b33d45",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.35)",
        }}
      />
      <Typography color="common.white" variant="caption" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
        {props.amountBB} BB
      </Typography>
    </Box>
  );
};
