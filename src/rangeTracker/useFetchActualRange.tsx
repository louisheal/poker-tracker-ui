import { useEffect, useState } from "react";
import { getObservedRange } from "../api";
import type { RangeActions } from "../model";

type RangeResult = { spotKey: string; range?: RangeActions; error?: string };

export const useFetchActualRange = (spotKey: string | null) => {
  const [rangeResult, setRangeResult] = useState<RangeResult | null>(null);

  useEffect(() => {
    if (!spotKey) {
      return;
    }

    const loadActualRange = async () => {
      try {
        const nextRange = await getObservedRange(spotKey);
        setRangeResult({ spotKey, range: nextRange });
      } catch (error: unknown) {
        setRangeResult({ spotKey, error: error instanceof Error ? error.message : "Could not load this range." });
      }
    };

    void loadActualRange();
  }, [spotKey]);

  const activeResult = rangeResult?.spotKey === spotKey ? rangeResult : null;
  const isLoading = spotKey !== null && activeResult === null;
  const range = activeResult?.range ?? null;
  const errorMessage = activeResult?.error ?? null;

  return { range, isLoading, errorMessage };
};
