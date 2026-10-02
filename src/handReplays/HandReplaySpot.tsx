import { Box, Typography } from "@mui/material";
import type { HoleCardsDto } from "../api";
import { CommunityCards } from "./CommunityCards";
import type { HandReplaySpotDto } from "./dto";
import { PokerChip } from "./PokerChip";
import { PlayerSeat } from "./PlayerSeat";

const positionOrder = ["LJ", "HJ", "CO", "BTN", "SB", "BB"];

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

  const renderBetSlot = (position: string) => (
    <Box sx={{ display: "flex", minHeight: 32, alignItems: "center", justifyContent: "center" }}>
      <PokerChip amountBB={getBetAmount(position)} />
    </Box>
  );

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box
        role="region"
        aria-label={`${props.handReplaySpot.street} poker table`}
        sx={{
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
        }}
      >
        <Box
          sx={{
            gridArea: "leftGroup",
            alignSelf: "stretch",
            justifySelf: "start",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {leftPositions.map((position) => (
            <Box key={position} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PlayerSeat
                name={position}
                stackBB={props.handReplaySpot.remainingStacksBB[position]}
                active={props.handReplaySpot.activePlayers.includes(position)}
                holeCards={getHoleCards(position)}
              />
              <PokerChip amountBB={getBetAmount(position)} />
            </Box>
          ))}
        </Box>
        {topPosition !== undefined && (
          <Box
            sx={{
              gridArea: "topCenter",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PlayerSeat
              name={topPosition}
              stackBB={props.handReplaySpot.remainingStacksBB[topPosition]}
              active={props.handReplaySpot.activePlayers.includes(topPosition)}
              holeCards={getHoleCards(topPosition)}
            />
            {renderBetSlot(topPosition)}
          </Box>
        )}
        <Box
          sx={{
            gridArea: "rightGroup",
            alignSelf: "stretch",
            justifySelf: "end",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {rightPositions.map((position) => (
            <Box key={position} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PokerChip amountBB={getBetAmount(position)} />
              <PlayerSeat
                name={position}
                stackBB={props.handReplaySpot.remainingStacksBB[position]}
                active={props.handReplaySpot.activePlayers.includes(position)}
                holeCards={getHoleCards(position)}
              />
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            gridArea: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography color="common.white" variant="body2">
            Pot: {props.handReplaySpot.potBB} BB
          </Typography>
          <CommunityCards cards={props.handReplaySpot.board} />
        </Box>
        <Box
          sx={{
            gridArea: "hero",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          {renderBetSlot(props.heroPosition)}
          <PlayerSeat
            name={props.heroPosition}
            stackBB={props.handReplaySpot.remainingStacksBB[props.heroPosition]}
            active={props.handReplaySpot.activePlayers.includes(props.heroPosition)}
            holeCards={props.heroHoleCards}
          />
        </Box>
      </Box>
    </Box>
  );
};
