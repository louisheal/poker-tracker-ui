import { useState, type MouseEvent } from "react";
import { createSpotKey, pokerPositions, type SpotType } from "./spotKey";
import type { PokerPosition } from "../model";
import type { SelectChangeEvent } from "@mui/material";

export const usePreflopSpotSelection = () => {
  const [spotType, setSpotType] = useState<SpotType>("RFI");
  const [heroPosition, setHeroPosition] = useState<PokerPosition>("Lojack");
  const [villainPosition, setVillainPosition] = useState<PokerPosition>("Lojack");

  const spotKey = createSpotKey(spotType, heroPosition, spotType === "3Bet" ? villainPosition : undefined);

  const heroOptions = spotType === "RFI" ? pokerPositions.slice(0, 5) : pokerPositions.slice(1);
  const villainOptions = pokerPositions.slice(0, pokerPositions.indexOf(heroPosition));

  const handleSpotTypeChange = (_event: MouseEvent<HTMLElement>, nextSpotType: SpotType | null) => {
    if (!nextSpotType) {
      return;
    }

    setSpotType(nextSpotType);
    setHeroPosition(nextSpotType === "RFI" ? "Lojack" : "Hijack");
    setVillainPosition("Lojack");
  };

  const handleHeroPositionChange = (event: SelectChangeEvent<PokerPosition>) => {
    const nextPosition = event.target.value as PokerPosition;
    setHeroPosition(nextPosition);
    if (spotType === "3Bet" && pokerPositions.indexOf(villainPosition) >= pokerPositions.indexOf(nextPosition)) {
      setVillainPosition("Lojack");
    }
  };

  const handleVillainPositionChange = (event: SelectChangeEvent<PokerPosition>) => {
    setVillainPosition(event.target.value as PokerPosition);
  };

  return {
    spotKey,
    spotType,
    heroPosition,
    villainPosition,
    heroOptions,
    villainOptions,
    handleSpotTypeChange,
    handleHeroPositionChange,
    handleVillainPositionChange,
  };
};
