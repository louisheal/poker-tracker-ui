import { Box, Typography } from "@mui/material";
import type { HoleCardsDto } from "../api";
import { CardBack } from "./CardBack";
import { PlayingCard } from "./PlayingCard";

interface Props {
  name: string;
  stackBB: number;
  active: boolean;
  holeCards?: HoleCardsDto;
}

export const PlayerSeat = (props: Props) => {
  return (
    <Box sx={{ position: "relative", width: 144, pt: 4 }}>
      {props.active && (
        <Box
          aria-label={`${props.name} hole cards`}
          sx={{
            position: "absolute",
            zIndex: 1,
            top: 0,
            left: "50%",
            display: "flex",
            gap: 0.5,
            transform: "translateX(-50%)",
          }}
        >
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
      <Box
        sx={{
          display: "flex",
          minHeight: 76,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0.25,
          px: 1,
          pt: 5,
          pb: 1,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography component="div" noWrap variant="subtitle2" sx={{ maxWidth: "100%" }}>
          {props.name}
        </Typography>
        <Typography color="text.secondary" component="div" variant="body2">
          {props.stackBB} BB
        </Typography>
      </Box>
    </Box>
  );
};
