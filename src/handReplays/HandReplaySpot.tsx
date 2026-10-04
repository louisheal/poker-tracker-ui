import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { HoleCardsDto } from "../api";
import { CommunityCards } from "./CommunityCards";
import type { HandReplaySpotDto } from "./dto";
import { PokerChip } from "./PokerChip";
import { PlayerSeat } from "./PlayerSeat";

const positionOrder = ["LJ", "HJ", "CO", "BTN", "SB", "BB"];

const handReplaySpotSx = {
  width: "100%",
  minWidth: 0,
} satisfies SxProps<Theme>;

const pokerTableSx = {
  display: "grid",
  width: "100%",
  minWidth: 0,
  minHeight: { xs: 0, md: 420 },
  gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" },
  gridTemplateRows: { xs: "auto auto auto auto", md: "auto minmax(240px, 1fr) auto" },
  gridTemplateAreas: {
    xs: '"topCenter topCenter" "leftGroup rightGroup" "center center" "hero hero"',
    md: '". topCenter ." "leftGroup center rightGroup" ". hero ."',
  },
  alignItems: "center",
  justifyItems: "center",
  gap: { xs: 0.5, md: 2 },
  border: { xs: "4px solid #075435", md: "8px solid #075435" },
  borderRadius: "48% / 32%",
  bgcolor: "#167a4d",
  boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.12)",
} satisfies SxProps<Theme>;

const leftPlayerGroupSx = {
  gridArea: "leftGroup",
  alignSelf: "stretch",
  justifySelf: { xs: "stretch", md: "start" },
  display: "flex",
  flexDirection: "column",
  alignItems: { xs: "center", md: "flex-start" },
  justifyContent: "center",
  minWidth: 0,
  gap: { xs: 0.5, md: 2 },
} satisfies SxProps<Theme>;

const rightPlayerGroupSx = {
  gridArea: "rightGroup",
  alignSelf: "stretch",
  justifySelf: { xs: "stretch", md: "end" },
  display: "flex",
  flexDirection: "column",
  alignItems: { xs: "center", md: "flex-end" },
  justifyContent: "center",
  minWidth: 0,
  gap: { xs: 0.5, md: 2 },
} satisfies SxProps<Theme>;

const sideSeatAndBetSx = {
  display: "flex",
  width: { xs: "100%", md: "auto" },
  minWidth: 0,
  flexDirection: { xs: "column", md: "row" },
  alignItems: "center",
  gap: { xs: 0, md: 1 },
} satisfies SxProps<Theme>;

const topSeatAndBetSx = {
  gridArea: "topCenter",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 1,
} satisfies SxProps<Theme>;

const betSlotSx = {
  display: "flex",
  width: { xs: "100%", md: "auto" },
  minHeight: { xs: 16, md: 32 },
  alignItems: "center",
  justifyContent: "center",
} satisfies SxProps<Theme>;

const tableCenterSx = {
  gridArea: "center",
  display: "flex",
  minWidth: 0,
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  gap: { xs: 0.5, md: 1.5 },
} satisfies SxProps<Theme>;

const heroSeatAndBetSx = {
  gridArea: "hero",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 1,
} satisfies SxProps<Theme>;

interface Props {
  heroPosition: string;
  heroHoleCards: HoleCardsDto;
  handReplaySpot: HandReplaySpotDto;
}

export const HandReplaySpot = (props: Props) => {
  const players = Object.keys(props.handReplaySpot.remainingStacksBB).sort((first, second) => {
    const firstIndex = positionOrder.indexOf(first);
    const secondIndex = positionOrder.indexOf(second);
    return (
      (firstIndex < 0 ? positionOrder.length : firstIndex) - (secondIndex < 0 ? positionOrder.length : secondIndex)
    );
  });
  const heroIndex = players.indexOf(props.heroPosition);
  const clockwisePlayers = heroIndex < 0 ? players : [...players.slice(heroIndex + 1), ...players.slice(0, heroIndex)];
  const leftPositions = [clockwisePlayers[1], clockwisePlayers[0]].filter(
    (position): position is string => position !== undefined,
  );
  const topPosition = clockwisePlayers[2];
  const rightPositions = clockwisePlayers.slice(3);

  const getHoleCards = (position: string): HoleCardsDto | undefined => {
    if (position === props.heroPosition) {
      return props.heroHoleCards;
    }

    return props.handReplaySpot.revealedHoleCards[position];
  };

  const getBetAmount = (position: string) => props.handReplaySpot.playersBetsBB[position] ?? 0;
  const getAwardAmount = (position: string) => props.handReplaySpot.winningsBB[position] ?? 0;

  const renderBetSlot = (amountBB: number) => (
    <Box sx={betSlotSx}>
      <PokerChip amountBB={amountBB} />
    </Box>
  );

  return (
    <Box sx={handReplaySpotSx}>
      <Box role="region" aria-label={`${props.handReplaySpot.street} poker table`} sx={pokerTableSx}>
        <Box sx={leftPlayerGroupSx}>
          {leftPositions.map((position) => (
            <Box key={position} sx={sideSeatAndBetSx}>
              <PlayerSeat
                name={position}
                stackBB={props.handReplaySpot.remainingStacksBB[position]}
                active={props.handReplaySpot.activePlayers.includes(position)}
                nextToAct={props.handReplaySpot.nextToAct}
                holeCards={getHoleCards(position)}
              />
              {renderBetSlot(getBetAmount(position))}
              {renderBetSlot(getAwardAmount(position))}
            </Box>
          ))}
        </Box>
        {topPosition !== undefined && (
          <Box sx={topSeatAndBetSx}>
            <PlayerSeat
              name={topPosition}
              stackBB={props.handReplaySpot.remainingStacksBB[topPosition]}
              active={props.handReplaySpot.activePlayers.includes(topPosition)}
              nextToAct={props.handReplaySpot.nextToAct}
              holeCards={getHoleCards(topPosition)}
            />
            {renderBetSlot(getBetAmount(topPosition))}
            {renderBetSlot(getAwardAmount(topPosition))}
          </Box>
        )}
        <Box sx={rightPlayerGroupSx}>
          {rightPositions.map((position) => (
            <Box key={position} sx={sideSeatAndBetSx}>
              {renderBetSlot(getBetAmount(position))}
              {renderBetSlot(getAwardAmount(position))}
              <PlayerSeat
                name={position}
                stackBB={props.handReplaySpot.remainingStacksBB[position]}
                active={props.handReplaySpot.activePlayers.includes(position)}
                nextToAct={props.handReplaySpot.nextToAct}
                holeCards={getHoleCards(position)}
              />
            </Box>
          ))}
        </Box>
        <Box sx={tableCenterSx}>
          <Typography color="common.white" variant="body2">
            Pot: {props.handReplaySpot.potBB} BB
          </Typography>
          <CommunityCards cards={props.handReplaySpot.board} />
        </Box>
        <Box sx={heroSeatAndBetSx}>
          {renderBetSlot(getBetAmount(props.heroPosition))}
          {renderBetSlot(getAwardAmount(props.heroPosition))}
          <PlayerSeat
            name={props.heroPosition}
            stackBB={props.handReplaySpot.remainingStacksBB[props.heroPosition]}
            active={props.handReplaySpot.activePlayers.includes(props.heroPosition)}
            nextToAct={props.handReplaySpot.nextToAct}
            holeCards={props.heroHoleCards}
          />
        </Box>
      </Box>
    </Box>
  );
};
