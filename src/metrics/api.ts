import type { MetricsDto } from "./dto";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

const isMetricsDto = (value: unknown): value is MetricsDto => {
  if (typeof value !== "object" || value === null) return false;

  return (
    "handsPlayed" in value &&
    typeof value.handsPlayed === "number" &&
    Number.isFinite(value.handsPlayed) &&
    "winningsBBPer100" in value &&
    typeof value.winningsBBPer100 === "number" &&
    Number.isFinite(value.winningsBBPer100) &&
    "wentToShowdownPercent" in value &&
    typeof value.wentToShowdownPercent === "number" &&
    Number.isFinite(value.wentToShowdownPercent) &&
    "wonMoneyAtShowdownPercent" in value &&
    typeof value.wonMoneyAtShowdownPercent === "number" &&
    Number.isFinite(value.wonMoneyAtShowdownPercent)
  );
};

export const getMetrics = async (signal?: AbortSignal): Promise<MetricsDto> => {
  const response = await fetch(`${apiBaseUrl}/api/metrics`, { signal });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!isMetricsDto(payload)) {
    throw new Error("Invalid metrics response.");
  }

  return payload;
};
