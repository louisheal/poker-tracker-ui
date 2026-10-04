import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { HoleCardsDto } from "../api";
import { CommunityCards } from "./CommunityCards";
import type { HandReplaySpotDto } from "./dto";
import { PokerChip } from "./PokerChip";
import { PlayerSeat } from "./PlayerSeat";

const positionOrder = ["LJ", "HJ", "CO", "BTN", "SB", "BB"];

const handReplaySpotSx = {
  overflowX: "auto",
} satisfies SxProps<Theme>;

const pokerTableSx = {
  display: "grid",
  width: "100%",
  minWidth: 520,
  minHeight: 420,
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gridTemplateRows: "auto minmax(240px, 1fr) auto",
  gridTemplateAreas: '". topCenter ." "leftGroup center rightGroup" ". hero ."',
  alignItems: "center",
  justifyItems: "center",
  gap: 2,
  border: "8px solid #075435",
  borderRadius: "48% / 32%",
  bgcolor: "#167a4d",
  boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.12)",
} satisfies SxProps<Theme>;

const leftPlayerGroupSx = {
  gridArea: "leftGroup",
  alignSelf: "stretch",
  justifySelf: "start",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: 2,
} satisfies SxProps<Theme>;

const rightPlayerGroupSx = {
  gridArea: "rightGroup",
  alignSelf: "stretch",
  justifySelf: "end",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "center",
  gap: 2,
} satisfies SxProps<Theme>;

const sideSeatAndBetSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
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
  minHeight: 32,
  alignItems: "center",
  justifyContent: "center",
} satisfies SxProps<Theme>;

const tableCenterSx = {
  gridArea: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 1.5,
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
