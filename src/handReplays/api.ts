import type { HandReplayDto } from "./dto";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export const getHandReplay = async (
	handId: string,
	signal?: AbortSignal,
): Promise<HandReplayDto> => {
	const response = await fetch(
		`${apiBaseUrl}/api/handreplay/${encodeURIComponent(handId)}`,
		{ signal },
	);

	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}

	return response.json() as Promise<HandReplayDto>;
};
