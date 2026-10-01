import type { RangeActions } from "./model";

export interface HandHistoryDto {
  handId: string;
  holeCards: HoleCardsDto;
}

export interface HoleCardsDto {
  first: PlayingCardDto;
  second: PlayingCardDto;
}

export interface PlayingCardDto {
  rank: string;
  suit: string;
}

export interface HandImportSummary {
  filesReceived: number;
  handsSaved: number;
  duplicateHands: number;
  invalidHands: number;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export const getHandHistories = async (signal?: AbortSignal): Promise<HandHistoryDto[]> => {
  const response = await fetch(`${apiBaseUrl}/api/handhistories`, { signal });
  return parseResponse<HandHistoryDto[]>(response);
};

export const uploadHandHistories = async (files: readonly File[]): Promise<HandImportSummary> => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file, file.name);
  }

  const response = await fetch(`${apiBaseUrl}/api/imports`, {
    method: "POST",
    body: formData,
  });

  return parseResponse<HandImportSummary>(response);
};

export const getObservedRange = async (spotKey: string, signal?: AbortSignal): Promise<RangeActions> => {
  const query = new URLSearchParams({ spotKey });
  const response = await fetch(`${apiBaseUrl}/api/preflopspots/range?${query}`, { signal });
  return parseResponse<RangeActions>(response);
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};
