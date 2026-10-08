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

export type PostflopAnalysisTab = "Flop" | "Turn" | "River";

export type PostflopActionSequence = "XX" | "XBC" | "XBRC" | "BC";

export type PostflopFlopRankTexture = "Trips" | "Paired" | "Unpaired";

export type PostflopRunout = "Overcard" | "FlushCompleting" | "Paired" | "Other";

export type RiverAggressionType = "Bet" | "Raise";

export type RiverBetSizeCategory = "Small" | "Medium" | "Large" | "Overbet";

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

export interface RiverBettingStatDto {
  aggressionType: RiverAggressionType;
  opportunityCount: number;
  heroOpportunityCount: number;
  showdownCount: number;
  villainWinCount: number;
  opponentWinCount: number;
  chopCount: number;
  heroCallCount: number;
  heroCallVillainWinCount: number;
  heroCallHeroWinCount: number;
  heroCallChopCount: number;
}

export interface RiverBetResponseStatDto {
  line: "BF" | "XBF";
  opportunityCount: number;
  villainFoldCount: number;
}

export interface PostflopBettingAnalysisDto {
  stats: PostflopBettingStatDto[];
  riverStats: RiverBettingStatDto[];
  riverBetResponseStats: RiverBetResponseStatDto[];
}
