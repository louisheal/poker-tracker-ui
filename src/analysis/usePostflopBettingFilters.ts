import { useCallback, useState } from "react";
import type {
  PostflopActionSequence,
  PostflopFlopHighCard,
  PostflopFlopRankTexture,
  PostflopFlopTexture,
  PostflopPotType,
  PostflopRunout,
  PostflopSeatPosition,
  RiverBetSizeCategory,
} from "./dto";

export const usePostflopBettingFilters = () => {
  const [pfrInPosition, setPfrInPosition] = useState<boolean | null>(null);
  const [ipPosition, setIpPosition] = useState<PostflopSeatPosition | null>(null);
  const [oopPosition, setOopPosition] = useState<PostflopSeatPosition | null>(null);
  const [potTypes, setPotTypes] = useState<PostflopPotType[]>([]);
  const [flopHighCard, setFlopHighCard] = useState<PostflopFlopHighCard | null>(null);
  const [flopTextures, setFlopTextures] = useState<PostflopFlopTexture[]>([]);
  const [flopActionSequences, setFlopActionSequences] = useState<PostflopActionSequence[]>([]);
  const [flopRankTextures, setFlopRankTextures] = useState<PostflopFlopRankTexture[]>([]);
  const [turnActionSequences, setTurnActionSequences] = useState<PostflopActionSequence[]>([]);
  const [turnRunouts, setTurnRunouts] = useState<PostflopRunout[]>([]);
  const [riverRunouts, setRiverRunouts] = useState<PostflopRunout[]>([]);
  const [riverBetSizeCategory, setRiverBetSizeCategory] = useState<RiverBetSizeCategory | null>(null);

  const selectPfrPosition = useCallback((value: boolean | null) => setPfrInPosition(value), []);
  const selectIpPosition = useCallback((value: PostflopSeatPosition | null) => setIpPosition(value), []);
  const selectOopPosition = useCallback((value: PostflopSeatPosition | null) => setOopPosition(value), []);
  const selectPotTypes = useCallback((value: PostflopPotType[]) => setPotTypes(value), []);
  const selectFlopHighCard = useCallback((value: PostflopFlopHighCard | null) => setFlopHighCard(value), []);
  const selectFlopTextures = useCallback((value: PostflopFlopTexture[]) => setFlopTextures(value), []);
  const selectFlopActionSequences = useCallback((value: PostflopActionSequence[]) => setFlopActionSequences(value), []);
  const selectFlopRankTextures = useCallback((value: PostflopFlopRankTexture[]) => setFlopRankTextures(value), []);
  const selectTurnActionSequences = useCallback((value: PostflopActionSequence[]) => setTurnActionSequences(value), []);
  const selectTurnRunouts = useCallback((value: PostflopRunout[]) => setTurnRunouts(value), []);
  const selectRiverRunouts = useCallback((value: PostflopRunout[]) => setRiverRunouts(value), []);
  const selectRiverBetSizeCategory = useCallback(
    (value: RiverBetSizeCategory | null) => setRiverBetSizeCategory(value),
    [],
  );

  return {
    pfrInPosition,
    ipPosition,
    oopPosition,
    potTypes,
    flopHighCard,
    flopTextures,
    flopActionSequences,
    flopRankTextures,
    turnActionSequences,
    turnRunouts,
    riverRunouts,
    riverBetSizeCategory,
    selectPfrPosition,
    selectIpPosition,
    selectOopPosition,
    selectPotTypes,
    selectFlopHighCard,
    selectFlopTextures,
    selectFlopActionSequences,
    selectFlopRankTextures,
    selectTurnActionSequences,
    selectTurnRunouts,
    selectRiverRunouts,
    selectRiverBetSizeCategory,
  };
};
