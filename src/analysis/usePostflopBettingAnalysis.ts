import { useEffect, useState } from "react";
import { getPostflopBettingAnalysis } from "./api";
import type {
  PostflopBettingAnalysisDto,
  PostflopFlopHighCard,
  PostflopFlopTexture,
  PostflopPotType,
  PostflopSeatPosition,
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
) => {
  const [state, setState] = useState<AnalysisState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    void getPostflopBettingAnalysis(
      pfrInPosition,
      ipPosition,
      oopPosition,
      potTypes,
      flopHighCard,
      flopTextures,
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
  }, [pfrInPosition, ipPosition, oopPosition, potTypes, flopHighCard, flopTextures]);

  return state;
};
