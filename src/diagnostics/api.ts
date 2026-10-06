import type { RiverBetSizeRowDto, RiverDiagnosticsDto, RiverSpotRowDto } from "./dto";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

const isRiverBetSizeRowDto = (value: unknown): value is RiverBetSizeRowDto => {
  if (typeof value !== "object" || value === null) return false;

  return (
    "size" in value &&
    typeof value.size === "string" &&
    "hands" in value &&
    typeof value.hands === "number" &&
    Number.isInteger(value.hands) &&
    "winningsBBPer100" in value &&
    typeof value.winningsBBPer100 === "number" &&
    Number.isFinite(value.winningsBBPer100) &&
    "handIds" in value &&
    Array.isArray(value.handIds) &&
    value.handIds.every((handId) => typeof handId === "string")
  );
};

const isRiverSpotRowDto = (value: unknown): value is RiverSpotRowDto => {
  if (typeof value !== "object" || value === null) return false;

  return (
    "spot" in value &&
    typeof value.spot === "string" &&
    "hands" in value &&
    typeof value.hands === "number" &&
    Number.isInteger(value.hands) &&
    "winningsBBPer100" in value &&
    typeof value.winningsBBPer100 === "number" &&
    Number.isFinite(value.winningsBBPer100) &&
    "handIds" in value &&
    Array.isArray(value.handIds) &&
    value.handIds.every((handId) => typeof handId === "string") &&
    "sizeBreakdown" in value &&
    Array.isArray(value.sizeBreakdown) &&
    value.sizeBreakdown.every(isRiverBetSizeRowDto)
  );
};

const isRiverDiagnosticsDto = (value: unknown): value is RiverDiagnosticsDto =>
  typeof value === "object" &&
  value !== null &&
  "rows" in value &&
  Array.isArray(value.rows) &&
  value.rows.every(isRiverSpotRowDto);

export const getRiverDiagnostics = async (signal?: AbortSignal): Promise<RiverDiagnosticsDto> => {
  const response = await fetch(`${apiBaseUrl}/api/diagnostics/river`, { signal });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!isRiverDiagnosticsDto(payload)) {
    throw new Error("Invalid river diagnostics response.");
  }

  return payload;
};
