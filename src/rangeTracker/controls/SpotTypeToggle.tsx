import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { MouseEvent } from "react";
import type { SpotType } from "../spotKey";

interface Props {
  spotType: SpotType;
  handleSpotTypeChange: (_event: MouseEvent<HTMLElement>, nextSpotType: SpotType | null) => void;
}

export const SpotTypeToggle = (props: Props) => {
  return (
    <ToggleButtonGroup
      exclusive
      value={props.spotType}
      onChange={props.handleSpotTypeChange}
      aria-label="Spot type"
      size="small"
    >
      <ToggleButton value="RFI">RFI</ToggleButton>
      <ToggleButton value="3Bet">3Bet</ToggleButton>
    </ToggleButtonGroup>
  );
};
