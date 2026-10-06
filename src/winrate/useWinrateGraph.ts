import { useEffect, useState } from "react";
import { getWinrateGraph } from "./api";
import type { WinrateHandBatchPointDto } from "./dto";

type WinrateGraphState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "loaded"; points: WinrateHandBatchPointDto[] };

export const useWinrateGraph = () => {
  const [state, setState] = useState<WinrateGraphState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    void getWinrateGraph(controller.signal)
      .then((graph) => {
        if (controller.signal.aborted) return;
        setState(graph.points.length === 0 ? { status: "empty" } : { status: "loaded", points: graph.points });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Winrate graph could not be loaded.",
          });
        }
      });

    return () => controller.abort();
  }, []);

  return state;
};
