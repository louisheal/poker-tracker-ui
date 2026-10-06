import type { HandHistoryDto, HandLabelAssignment, HoleCardsDto, PlayingCardDto } from "../api";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

const isPlayingCardDto = (value: unknown): value is PlayingCardDto =>
  typeof value === "object" &&
  value !== null &&
  "rank" in value &&
  typeof value.rank === "string" &&
  "suit" in value &&
  typeof value.suit === "string";

const isHoleCardsDto = (value: unknown): value is HoleCardsDto =>
  typeof value === "object" &&
  value !== null &&
  "first" in value &&
  isPlayingCardDto(value.first) &&
  "second" in value &&
  isPlayingCardDto(value.second);

const isHandLabelAssignment = (value: unknown): value is HandLabelAssignment =>
  typeof value === "object" &&
  value !== null &&
  "street" in value &&
  typeof value.street === "string" &&
  "label" in value &&
  typeof value.label === "string";

const isHandHistoryDto = (value: unknown): value is HandHistoryDto =>
  typeof value === "object" &&
  value !== null &&
  "handId" in value &&
  typeof value.handId === "string" &&
  "holeCards" in value &&
  isHoleCardsDto(value.holeCards) &&
  "labels" in value &&
  Array.isArray(value.labels) &&
  value.labels.every(isHandLabelAssignment) &&
  "note" in value &&
  typeof value.note === "string" &&
  "flagged" in value &&
  typeof value.flagged === "boolean";

export const getHandHistoriesByIds = async (
  handIds: readonly string[],
  signal?: AbortSignal,
): Promise<HandHistoryDto[]> => {
  const response = await fetch(`${apiBaseUrl}/api/handhistories/by-ids`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(handIds),
    signal,
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isHandHistoryDto)) {
    throw new Error("Invalid hand history response.");
  }

  return payload;
};
