import { useEffect, useState } from "react";
import { getTurnDiagnostics } from "./api";
import type { TurnPotType, TurnSpotRowDto } from "./dto";

type TurnDiagnosticsState =
  | { key: string; status: "loading" }
  | { key: string; status: "error"; message: string }
  | { key: string; status: "loaded"; rows: TurnSpotRowDto[] };

type TurnDiagnosticsViewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; rows: TurnSpotRowDto[] };

export const useTurnDiagnostics = (potTypes: readonly TurnPotType[]): TurnDiagnosticsViewState => {
  const potTypesKey = potTypes.join(",");
  const [result, setResult] = useState<TurnDiagnosticsState>(() => ({ key: potTypesKey, status: "loading" }));

  useEffect(() => {
    const controller = new AbortController();
    const selectedPotTypes = potTypesKey ? (potTypesKey.split(",") as TurnPotType[]) : [];

    void getTurnDiagnostics(selectedPotTypes, controller.signal)
      .then((diagnostics) => {
        if (!controller.signal.aborted) {
          setResult({ key: potTypesKey, status: "loaded", rows: diagnostics.rows });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            key: potTypesKey,
            status: "error",
            message: error instanceof Error ? error.message : "Turn diagnostics could not be loaded.",
          });
        }
      });

    return () => controller.abort();
  }, [potTypesKey]);

  if (result.key !== potTypesKey) return { status: "loading" };
  if (result.status === "loading") return { status: "loading" };
  if (result.status === "error") return { status: "error", message: result.message };
  return { status: "loaded", rows: result.rows };
};
