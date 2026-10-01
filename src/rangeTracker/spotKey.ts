import type { PokerPosition } from "../model";

export const pokerPositions: PokerPosition[] = ["Lojack", "Hijack", "Cutoff", "Button", "Small Blind", "Big Blind"];

export type SpotType = "RFI" | "3Bet";

export const createSpotKey = (
  spotType: SpotType,
  heroPosition: PokerPosition,
  villainPosition?: PokerPosition,
): string | null => {
  const heroIndex = pokerPositions.indexOf(heroPosition);
  if (heroIndex < 0) {
    return null;
  }

  if (spotType === "RFI") {
    if (heroPosition === "Big Blind") {
      return null;
    }
    return (
      "X" +
      pokerPositions
        .slice(0, heroIndex)
        .map((position) => `_${position}_Fold`)
        .join("")
    );
  }

  const villainIndex = villainPosition ? pokerPositions.indexOf(villainPosition) : -1;
  if (villainIndex < 0 || villainIndex >= heroIndex) {
    return null;
  }

  const foldsBeforeOpener = pokerPositions
    .slice(0, villainIndex)
    .map((position) => `_${position}_Fold`)
    .join("");
  const foldsAfterOpener = pokerPositions
    .slice(villainIndex + 1, heroIndex)
    .map((position) => `_${position}_Fold`)
    .join("");

  return `X${foldsBeforeOpener}_${villainPosition}_Raise${foldsAfterOpener}`;
};
