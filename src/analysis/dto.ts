export type PostflopOpportunityType = "FlopContinuationBet" | "DonkBet" | "DelayedContinuationBet";

export type PostflopMatchupDirection = "HeroVsVillain" | "VillainVsHero" | "VillainVsVillain";

export type PostflopPotType = "SingleRaisedPot" | "ThreeBetPot" | "FourBetPot";

export type PostflopFlopTexture = "Monotone" | "TwoTone" | "Rainbow";

export type PostflopFlopHighCard =
  | "Ace"
  | "King"
  | "Queen"
  | "Jack"
  | "Ten"
  | "Nine"
  | "Eight"
  | "Seven"
  | "Six"
  | "Five"
  | "Four"
  | "Three"
  | "Two";

export type PostflopSeatPosition = "LJ" | "HJ" | "CO" | "BTN" | "SB" | "BB";

export interface PostflopResponseDto {
  responseType: string;
  count: number;
  rate: number;
}

export interface PostflopBettingStatDto {
  opportunityType: PostflopOpportunityType;
  matchupDirection: PostflopMatchupDirection;
  actorPosition: string;
  responderPosition: string | null;
  delayedContext: string | null;
  opportunityCount: number;
  betCount: number;
  betRate: number;
  responseBreakdown: PostflopResponseDto[];
}

export interface PostflopBettingAnalysisDto {
  stats: PostflopBettingStatDto[];
}
