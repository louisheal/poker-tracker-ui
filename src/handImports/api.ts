import { apiBaseUrl, parseResponse } from "../api";

export type HandImportStatus = "queued" | "processing" | "completed" | "failed";

export interface HandImportFileDto {
  fileId: string;
  fileName: string;
  status: HandImportStatus;
  handsSaved: number;
  duplicateHands: number;
  invalidHands: number;
  errorMessage: string | null;
}

export interface HandImportJobDto {
  jobId: string;
  status: HandImportStatus;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  filesReceived: number;
  handsSaved: number;
  duplicateHands: number;
  invalidHands: number;
  files: HandImportFileDto[];
}

export const uploadHandHistories = async (files: readonly File[]): Promise<HandImportJobDto> => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file, file.name);
  }

  const response = await fetch(`${apiBaseUrl}/api/imports`, {
    method: "POST",
    body: formData,
  });

  if (response.status !== 202) {
    throw new Error(`Response status: ${response.status}`);
  }

  return parseHandImportJobDto(await response.json());
};

export const getActiveHandImportJobs = async (signal?: AbortSignal): Promise<HandImportJobDto[]> => {
  const response = await fetch(`${apiBaseUrl}/api/imports/active`, { signal });
  const payload: unknown = await parseResponse<unknown>(response);
  if (!Array.isArray(payload) || !payload.every(isHandImportJobDto)) {
    throw new Error("Invalid active hand import response.");
  }

  return payload;
};

export const getHandImportJob = async (jobId: string, signal?: AbortSignal): Promise<HandImportJobDto> => {
  const response = await fetch(`${apiBaseUrl}/api/imports/${encodeURIComponent(jobId)}`, { signal });
  return parseHandImportJobDto(await parseResponse<unknown>(response));
};

const isHandImportStatus = (value: unknown): value is HandImportStatus =>
  value === "queued" || value === "processing" || value === "completed" || value === "failed";

const isHandImportFileDto = (value: unknown): value is HandImportFileDto =>
  typeof value === "object" &&
  value !== null &&
  "fileId" in value &&
  typeof value.fileId === "string" &&
  "fileName" in value &&
  typeof value.fileName === "string" &&
  "status" in value &&
  isHandImportStatus(value.status) &&
  "handsSaved" in value &&
  typeof value.handsSaved === "number" &&
  "duplicateHands" in value &&
  typeof value.duplicateHands === "number" &&
  "invalidHands" in value &&
  typeof value.invalidHands === "number" &&
  "errorMessage" in value &&
  (typeof value.errorMessage === "string" || value.errorMessage === null);

const isHandImportJobDto = (value: unknown): value is HandImportJobDto =>
  typeof value === "object" &&
  value !== null &&
  "jobId" in value &&
  typeof value.jobId === "string" &&
  "status" in value &&
  isHandImportStatus(value.status) &&
  "createdAt" in value &&
  typeof value.createdAt === "string" &&
  "startedAt" in value &&
  (typeof value.startedAt === "string" || value.startedAt === null) &&
  "completedAt" in value &&
  (typeof value.completedAt === "string" || value.completedAt === null) &&
  "filesReceived" in value &&
  typeof value.filesReceived === "number" &&
  "handsSaved" in value &&
  typeof value.handsSaved === "number" &&
  "duplicateHands" in value &&
  typeof value.duplicateHands === "number" &&
  "invalidHands" in value &&
  typeof value.invalidHands === "number" &&
  "files" in value &&
  Array.isArray(value.files) &&
  value.files.every(isHandImportFileDto);

const parseHandImportJobDto = (payload: unknown): HandImportJobDto => {
  if (!isHandImportJobDto(payload)) {
    throw new Error("Invalid hand import response.");
  }

  return payload;
};
