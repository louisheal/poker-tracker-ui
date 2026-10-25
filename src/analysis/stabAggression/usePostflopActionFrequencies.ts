import { useEffect, useState } from "react";
import { getPostflopActionFrequencies } from "../api";
import type { PostflopActionFrequencyFilters } from "../api";
import type { PostflopActionFrequencyDto, PostflopBetResponseStreet } from "../dto";

type LoadedState = { status: "loaded"; frequencies: PostflopActionFrequencyDto[] };
type RequestState = { status: "loading" } | { status: "error"; message: string };

export type PostflopActionFrequenciesState = { status: "idle" } | RequestState | LoadedState;

type StoredState = {
  street: PostflopBetResponseStreet;
  state: RequestState | LoadedState;
};

export const usePostflopActionFrequencies = (
  street: PostflopBetResponseStreet | null,
  filters: PostflopActionFrequencyFilters,
): PostflopActionFrequenciesState => {
  const {
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
  } = filters;
  const [storedState, setStoredState] = useState<StoredState>(() => ({
    street: street ?? "Flop",
    state: { status: "loading" },
  }));

  useEffect(() => {
    if (street === null) return;

    const controller = new AbortController();
    void getPostflopActionFrequencies(
      street,
      {
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
      },
      controller.signal,
    )
      .then((frequencies) => {
        if (!controller.signal.aborted) {
          setStoredState({ street, state: { status: "loaded", frequencies } });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setStoredState({
            street,
            state: {
              status: "error",
              message: error instanceof Error ? error.message : `${street} action frequencies could not be loaded.`,
            },
          });
        }
      });

    return () => controller.abort();
  }, [
    street,
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
  ]);

  if (street === null) return { status: "idle" };
  return storedState.street === street ? storedState.state : { status: "loading" };
};
