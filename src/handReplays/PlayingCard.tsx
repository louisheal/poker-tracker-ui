import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { cardFrameSx } from "./cardStyles";

const playingCardBaseSx = {
  ...cardFrameSx,
  border: "1px solid rgba(255, 255, 255, 0.22)",
  color: "#fff",
} satisfies SxProps<Theme>;

const getPlayingCardSx = (backgroundColor: string): SxProps<Theme> => ({
  ...playingCardBaseSx,
  bgcolor: backgroundColor,
});

const cardRankSx = {
  fontSize: 28,
  fontWeight: 800,
  lineHeight: 1,
  color: "inherit",
} satisfies SxProps<Theme>;

const cardSuitSx = {
  position: "absolute",
  top: 4,
  left: 5,
  fontSize: 12,
  lineHeight: 1,
} satisfies SxProps<Theme>;

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
    <Box role="img" aria-label={`${props.rank} of ${suit.name}`} sx={getPlayingCardSx(suit.color)}>
      <Typography component="span" sx={cardRankSx}>
        {props.rank}
      </Typography>
      <Typography component="span" aria-hidden="true" sx={cardSuitSx}>
        {suit.symbol}
      </Typography>
    </Box>
  );
};
