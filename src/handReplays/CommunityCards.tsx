import { Box } from "@mui/material";
import type { PlayingCardDto } from "../api";
import { PlayingCard } from "./PlayingCard";

interface Props {
  cards: PlayingCardDto[];
}

export const CommunityCards = (props: Props) => {
  return (
    <Box sx={{ display: "flex" }}>
      {props.cards.map((card) => (
        <PlayingCard key={`${card.rank}${card.suit}`} rank={card.rank} suit={card.suit} />
      ))}
    </Box>
  );
};
