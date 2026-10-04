import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { PlayingCardDto } from "../api";
import { PlayingCard } from "./PlayingCard";

const communityCardsSx = {
  display: "flex",
} satisfies SxProps<Theme>;

interface Props {
  cards: PlayingCardDto[];
}

export const CommunityCards = (props: Props) => {
  return (
    <Box sx={communityCardsSx}>
      {props.cards.map((card) => (
        <PlayingCard key={`${card.rank}${card.suit}`} rank={card.rank} suit={card.suit} />
      ))}
    </Box>
  );
};
