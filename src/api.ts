import type { RangeActions } from "./model";

export interface HandHistoryDto {
  handId: string;
  holeCards: HoleCardsDto;
  labels: HandLabelAssignment[];
  note: string;
}

export const handLabelStreets = ["Flop", "Turn", "River"] as const;

export type HandLabelStreet = (typeof handLabelStreets)[number];

export interface HandLabelAssignment {
  street: HandLabelStreet;
  label: string;
}

export type HandLabelsByStreet = Record<HandLabelStreet, string[]>;

export interface HandLabelOption {
  value: string;
  name: string;
  category: string;
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

export const getHandHistories = async (
  signal?: AbortSignal,
  heroSawFlop?: boolean,
  labels: readonly string[] = [],
  includeUnlabelled = false,
): Promise<HandHistoryDto[]> => {
  const query = new URLSearchParams();
  if (heroSawFlop !== undefined) {
    query.set("heroSawFlop", String(heroSawFlop));
  }
  labels.forEach((label) => query.append("labels", label));
  if (includeUnlabelled) {
    query.set("includeUnlabelled", "true");
  }
  const queryString = query.toString();
  const response = await fetch(`${apiBaseUrl}/api/handhistories${queryString.length > 0 ? `?${queryString}` : ""}`, {
    signal,
  });
  return parseResponse<HandHistoryDto[]>(response);
};

export const getHandLabelOptions = async (signal?: AbortSignal): Promise<HandLabelOption[]> => {
  const response = await fetch(`${apiBaseUrl}/api/handnotes/labels`, { signal });
  return parseResponse<HandLabelOption[]>(response);
};

export const replaceHandLabels = async (
  handId: string,
  labelsByStreet: HandLabelsByStreet,
): Promise<HandLabelAssignment[]> => {
  const response = await fetch(`${apiBaseUrl}/api/handnotes/${encodeURIComponent(handId)}/labels`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ labelsByStreet }),
  });
  return parseResponse<HandLabelAssignment[]>(response);
};

export const replaceHandNote = async (handId: string, note: string): Promise<string> => {
  const response = await fetch(`${apiBaseUrl}/api/handnotes/${encodeURIComponent(handId)}/note`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  return parseResponse<string>(response);
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
