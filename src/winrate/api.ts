import type { WinrateHandBatchPointDto, WinrateGraphDto } from "./dto";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

const isWinrateHandBatchPointDto = (value: unknown): value is WinrateHandBatchPointDto => {
  if (typeof value !== "object" || value === null) return false;

  return (
    "handCount" in value &&
    typeof value.handCount === "number" &&
    Number.isInteger(value.handCount) &&
    "netWinningsBB" in value &&
    typeof value.netWinningsBB === "number" &&
    Number.isFinite(value.netWinningsBB) &&
    "withShowdownWinningsBB" in value &&
    typeof value.withShowdownWinningsBB === "number" &&
    Number.isFinite(value.withShowdownWinningsBB) &&
    "withoutShowdownWinningsBB" in value &&
    typeof value.withoutShowdownWinningsBB === "number" &&
    Number.isFinite(value.withoutShowdownWinningsBB)
  );
};

const isWinrateGraphDto = (value: unknown): value is WinrateGraphDto =>
  typeof value === "object" &&
  value !== null &&
  "points" in value &&
  Array.isArray(value.points) &&
  value.points.every(isWinrateHandBatchPointDto);

export const getWinrateGraph = async (signal?: AbortSignal): Promise<WinrateGraphDto> => {
  const response = await fetch(`${apiBaseUrl}/api/winrate/graph`, { signal });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!isWinrateGraphDto(payload)) {
    throw new Error("Invalid winrate graph response.");
  }

  return payload;
};
