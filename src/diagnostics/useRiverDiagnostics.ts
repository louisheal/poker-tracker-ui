import { useEffect, useState } from "react";
import { getRiverDiagnostics } from "./api";
import type { RiverSpotRowDto } from "./dto";

type RiverDiagnosticsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; rows: RiverSpotRowDto[] };

export const useRiverDiagnostics = () => {
  const [state, setState] = useState<RiverDiagnosticsState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    void getRiverDiagnostics(controller.signal)
      .then((diagnostics) => {
        if (!controller.signal.aborted) setState({ status: "loaded", rows: diagnostics.rows });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "River diagnostics could not be loaded.",
          });
        }
      });

    return () => controller.abort();
  }, []);

  return state;
};
