import { Box, type SelectChangeEvent } from "@mui/material";
import type { Theme, SxProps } from "@mui/material/styles";
import type { MouseEvent } from "react";
import { SpotTypeToggle } from "./SpotTypeToggle";
import { PositionSelector } from "./PositionSelector";
import type { SpotType } from "../spotKey";
import type { PokerPosition } from "../../model";

const spotControlsSx = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 1.5,
} satisfies SxProps<Theme>;

interface Props {
  spotType: SpotType;
  heroPosition: PokerPosition;
  villainPosition: PokerPosition;
  heroOptions: PokerPosition[];
  villainOptions: PokerPosition[];
  handleSpotTypeChange: (_event: MouseEvent<HTMLElement>, nextSpotType: SpotType | null) => void;
  handleHeroPositionChange: (event: SelectChangeEvent<PokerPosition>) => void;
  handleVillainPositionChange: (event: SelectChangeEvent<PokerPosition>) => void;
}

export const RangeTrackerControls = (props: Props) => {
  return (
    <Box sx={spotControlsSx}>
      <SpotTypeToggle spotType={props.spotType} handleSpotTypeChange={props.handleSpotTypeChange} />
      <PositionSelector
        id="hero-position-label"
        label="Hero Position"
        value={props.heroPosition}
        options={props.heroOptions}
        onChange={props.handleHeroPositionChange}
      />
      {props.spotType === "3Bet" && (
        <PositionSelector
          id="villain-position-label"
          label="Villain Position"
          value={props.villainPosition}
          options={props.villainOptions}
          onChange={props.handleVillainPositionChange}
        />
      )}
    </Box>
  );
};
