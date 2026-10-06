import { useEffect, useState } from "react";
import { getMetrics } from "./api";
import type { MetricsDto } from "./dto";

type MetricsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; metrics: MetricsDto };

export const useMetrics = () => {
  const [state, setState] = useState<MetricsState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    void getMetrics(controller.signal)
      .then((metrics) => {
        if (!controller.signal.aborted) setState({ status: "loaded", metrics });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Metrics could not be loaded.",
          });
        }
      });

    return () => controller.abort();
  }, []);

  return state;
};
