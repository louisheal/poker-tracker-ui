import type { HandLabelAssignment, HandLabelOption } from "../api";

export interface HandHistory {
  handId: string;
  holeCards: HoleCards;
  labels: HandLabelAssignment[];
  note: string;
  flagged: boolean;
}

export interface HoleCards {
  first: PlayingCard;
  second: PlayingCard;
}

export interface PlayingCard {
  rank: string;
  suit: string;
}

export type { HandLabelAssignment, HandLabelOption };
