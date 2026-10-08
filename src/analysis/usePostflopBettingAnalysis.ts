import { useEffect, useState } from "react";
import { getPostflopBettingAnalysis } from "./api";
import type {
  PostflopBettingAnalysisDto,
  PostflopActionSequence,
  PostflopAnalysisTab,
  PostflopFlopHighCard,
  PostflopFlopRankTexture,
  PostflopFlopTexture,
  PostflopPotType,
  PostflopRunout,
  PostflopSeatPosition,
  RiverBetSizeCategory,
} from "./dto";

type AnalysisState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; analysis: PostflopBettingAnalysisDto };

export const usePostflopBettingAnalysis = (
  pfrInPosition: boolean | null,
  ipPosition: PostflopSeatPosition | null,
  oopPosition: PostflopSeatPosition | null,
  potTypes: readonly PostflopPotType[],
  flopHighCard: PostflopFlopHighCard | null,
  flopTextures: readonly PostflopFlopTexture[],
  activeTab: PostflopAnalysisTab,
  flopActionSequences: readonly PostflopActionSequence[],
  flopRankTextures: readonly PostflopFlopRankTexture[],
  turnActionSequences: readonly PostflopActionSequence[],
  turnRunouts: readonly PostflopRunout[],
  riverRunouts: readonly PostflopRunout[],
  riverBetSizeCategory: RiverBetSizeCategory | null,
  minRiverBetToPotPercent: string,
  maxRiverBetToPotPercent: string,
) => {
  const [state, setState] = useState<AnalysisState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    void getPostflopBettingAnalysis(
      {
        activeTab,
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
        minRiverBetToPotPercent,
        maxRiverBetToPotPercent,
      },
      controller.signal,
    )
      .then((analysis) => {
        if (!controller.signal.aborted) setState({ status: "loaded", analysis });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Postflop analysis could not be loaded.",
          });
        }
      });

    return () => controller.abort();
  }, [
    pfrInPosition,
    ipPosition,
    oopPosition,
    potTypes,
    flopHighCard,
    flopTextures,
    activeTab,
    flopActionSequences,
    flopRankTextures,
    turnActionSequences,
    turnRunouts,
    riverRunouts,
    riverBetSizeCategory,
    minRiverBetToPotPercent,
    maxRiverBetToPotPercent,
  ]);

  return state;
};
