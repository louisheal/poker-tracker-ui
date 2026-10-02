import { Box, Typography } from "@mui/material";
import { cardFrameSx } from "./cardStyles";

interface Props {
  rank: string;
  suit: string;
}

const suitStyles: Record<string, { color: string; symbol: string; name: string }> = {
  s: { color: "#17191c", symbol: "♠", name: "spades" },
  h: { color: "#d83c45", symbol: "♥", name: "hearts" },
  c: { color: "#188350", symbol: "♣", name: "clubs" },
  d: { color: "#287fc8", symbol: "♦", name: "diamonds" },
};

export const PlayingCard = (props: Props) => {
  const suit = suitStyles[props.suit.toLowerCase()] ?? {
    color: "#383c42",
    symbol: props.suit,
    name: "unknown suit",
  };

  return (
    <Box
      role="img"
      aria-label={`${props.rank} of ${suit.name}`}
      sx={{
        ...cardFrameSx,
        border: "1px solid rgba(255, 255, 255, 0.22)",
        bgcolor: suit.color,
        color: "#fff",
      }}
    >
      <Typography component="span" sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: "inherit" }}>
        {props.rank}
      </Typography>
      <Typography
        component="span"
        aria-hidden="true"
        sx={{ position: "absolute", top: 4, left: 5, fontSize: 12, lineHeight: 1 }}
      >
        {suit.symbol}
      </Typography>
    </Box>
  );
};
