export interface HandHistoryDto {
  handId: string;
}

export interface HandHistoryImportSummary {
  filesReceived: number;
  handsSaved: number;
  duplicateHands: number;
  invalidHands: number;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export const getHandHistories = async (): Promise<HandHistoryDto[]> => {
  const response = await fetch(`${apiBaseUrl}/api/handhistories`);
  return parseResponse<HandHistoryDto[]>(response);
};

export const uploadHandHistories = async (
  files: readonly File[],
): Promise<HandHistoryImportSummary> => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file, file.name);
  }

  const response = await fetch(`${apiBaseUrl}/api/imports`, {
    method: "POST",
    body: formData,
  });

  return parseResponse<HandHistoryImportSummary>(response);
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};
