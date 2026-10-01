export type PokerAction = "Fold" | "Call" | "Raise";

export type PokerPosition = "Lojack" | "Hijack" | "Cutoff" | "Button" | "Small Blind" | "Big Blind";

export interface HandActions {
  handKey: string;
  fold: number;
  call: number;
  raise: number;
}

export interface RangeActions {
  spotKey: string;
  hands: HandActions[];
}
