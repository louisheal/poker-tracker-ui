import { useCallback, useState } from "react";
import type { PostflopFlopHighCard, PostflopFlopTexture, PostflopPotType, PostflopSeatPosition } from "./dto";

export const usePostflopBettingFilters = () => {
  const [pfrInPosition, setPfrInPosition] = useState<boolean | null>(null);
  const [ipPosition, setIpPosition] = useState<PostflopSeatPosition | null>(null);
  const [oopPosition, setOopPosition] = useState<PostflopSeatPosition | null>(null);
  const [potTypes, setPotTypes] = useState<PostflopPotType[]>([]);
  const [flopHighCard, setFlopHighCard] = useState<PostflopFlopHighCard | null>(null);
  const [flopTextures, setFlopTextures] = useState<PostflopFlopTexture[]>([]);

  const selectPfrPosition = useCallback((value: boolean | null) => setPfrInPosition(value), []);
  const selectIpPosition = useCallback((value: PostflopSeatPosition | null) => setIpPosition(value), []);
  const selectOopPosition = useCallback((value: PostflopSeatPosition | null) => setOopPosition(value), []);
  const selectPotTypes = useCallback((value: PostflopPotType[]) => setPotTypes(value), []);
  const selectFlopHighCard = useCallback((value: PostflopFlopHighCard | null) => setFlopHighCard(value), []);
  const selectFlopTextures = useCallback((value: PostflopFlopTexture[]) => setFlopTextures(value), []);

  return {
    pfrInPosition,
    ipPosition,
    oopPosition,
    potTypes,
    flopHighCard,
    flopTextures,
    selectPfrPosition,
    selectIpPosition,
    selectOopPosition,
    selectPotTypes,
    selectFlopHighCard,
    selectFlopTextures,
  };
};
