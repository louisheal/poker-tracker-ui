import type { HoleCardsDto, PlayingCardDto } from "../api";

export interface HandReplayDto {
	handId: string;
	heroCards: HoleCardsDto;
	heroPosition: string;
	startingStacksBB: Record<string, number>;
	actionSequence: HandReplaySpotDto[];
}

export interface HandReplaySpotDto {
	potBB: number;
	activePlayers: string[];
	nextToAct: string | null;
	playersBetsBB: Record<string, number>;
	remainingStacksBB: Record<string, number>;
	revealedHoleCards: Record<string, HoleCardsDto>;
	street: string;
	board: PlayingCardDto[];
	winningsBB: Record<string, number>;
}
