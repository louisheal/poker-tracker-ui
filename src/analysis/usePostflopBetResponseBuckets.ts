import { useEffect, useState } from "react";
import { getPostflopBetResponseBuckets } from "./api";
import type { PostflopBetResponseBucketFilters } from "./api";
import type { PostflopBetResponseBucketDto, PostflopBetResponseStreet } from "./dto";

type LoadedState = { status: "loaded"; buckets: PostflopBetResponseBucketDto[] };
type RequestState = { status: "loading" } | { status: "error"; message: string };

export type PostflopBetResponseBucketsState = { status: "idle" } | RequestState | LoadedState;

type StoredState = {
  street: Exclude<PostflopBetResponseStreet, "River">;
  state: RequestState | LoadedState;
};

export const usePostflopBetResponseBuckets = (
  street: Exclude<PostflopBetResponseStreet, "River"> | null,
  filters: PostflopBetResponseBucketFilters,
): PostflopBetResponseBucketsState => {
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
  } = filters;
  const [storedState, setStoredState] = useState<StoredState>(() => ({
    street: street ?? "Flop",
    state: { status: "loading" },
  }));

  useEffect(() => {
    if (street === null) return;

    const controller = new AbortController();
    void getPostflopBetResponseBuckets(
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
      },
      controller.signal,
    )
      .then((buckets) => {
        if (!controller.signal.aborted) {
          setStoredState({ street, state: { status: "loaded", buckets } });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setStoredState({
            street,
            state: {
              status: "error",
              message: error instanceof Error ? error.message : `${street} response charts could not be loaded.`,
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
  ]);

  if (street === null) return { status: "idle" };
  return storedState.street === street ? storedState.state : { status: "loading" };
};
