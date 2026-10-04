import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { HoleCardsDto } from "../api";
import { CardBack } from "./CardBack";
import { PlayingCard } from "./PlayingCard";

const playerSeatSx = {
  position: "relative",
  width: { xs: 76, md: 144 },
  minWidth: 0,
  pt: { xs: 2.5, md: 4 },
} satisfies SxProps<Theme>;

const holeCardsSx = {
  position: "absolute",
  zIndex: 1,
  top: 0,
  left: "50%",
  display: "flex",
  gap: 0.5,
  transform: "translateX(-50%)",
} satisfies SxProps<Theme>;

const playerInfoSx = {
  display: "flex",
  minHeight: { xs: 56, md: 76 },
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 0.25,
  px: { xs: 0.5, md: 1 },
  pt: { xs: 4, md: 5 },
  pb: { xs: 0.5, md: 1 },
  border: 1,
  borderColor: "divider",
  borderRadius: 1,
  bgcolor: "background.paper",
  boxShadow: "none",
  textAlign: "center",
} satisfies SxProps<Theme>;

const nextToActPlayerInfoSx = {
  ...playerInfoSx,
  borderColor: "#ffd740",
  boxShadow: "0 0 0 1px rgba(255, 215, 64, 0.6), 0 0 12px rgba(255, 215, 64, 0.55)",
} satisfies SxProps<Theme>;

const playerNameSx = {
  maxWidth: "100%",
  fontSize: { xs: "0.72rem", md: "0.875rem" },
} satisfies SxProps<Theme>;

const playerStackSx = {
  fontSize: { xs: "0.68rem", md: "0.875rem" },
} satisfies SxProps<Theme>;

interface Props {
  name: string;
  stackBB: number;
  active: boolean;
  nextToAct: string | null;
  holeCards?: HoleCardsDto;
}

export const PlayerSeat = (props: Props) => {
  const isNextToAct = props.nextToAct === props.name;

  return (
    <Box sx={playerSeatSx}>
      {props.active && (
        <Box aria-label={`${props.name} hole cards`} sx={holeCardsSx}>
          {props.holeCards ? (
            <>
              <PlayingCard rank={props.holeCards.first.rank} suit={props.holeCards.first.suit} />
              <PlayingCard rank={props.holeCards.second.rank} suit={props.holeCards.second.suit} />
            </>
          ) : (
            <>
              <CardBack />
              <CardBack />
            </>
          )}
        </Box>
      )}
      <Box sx={isNextToAct ? nextToActPlayerInfoSx : playerInfoSx}>
        <Typography component="div" noWrap variant="subtitle2" sx={playerNameSx}>
          {props.name}
        </Typography>
        <Typography color="text.secondary" component="div" variant="body2" sx={playerStackSx}>
          {props.stackBB} BB
        </Typography>
      </Box>
    </Box>
  );
};
