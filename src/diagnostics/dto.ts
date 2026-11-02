export interface RiverDiagnosticsDto {
  rows: RiverSpotRowDto[];
}

export interface RiverSpotRowDto {
  spot: string;
  hands: number;
  winningsBBPer100: number;
  handIds: string[];
  sizeBreakdown: RiverBetSizeRowDto[];
}

export interface RiverBetSizeRowDto {
  size: string;
  hands: number;
  winningsBBPer100: number;
  handIds: string[];
}

export type TurnPotType = "SRP" | "ThreeBet";

export type TurnSpot = "DelayedCBet" | "Barrel" | "Probe";

export type TurnAction = "Check" | "Bet";

export interface TurnDiagnosticsDto {
  rows: TurnSpotRowDto[];
}

export interface TurnSpotRowDto {
  spot: TurnSpot;
  hands: number;
  winningsBBPer100: number;
  handIds: string[];
  actionBreakdown: TurnActionRowDto[];
}

export interface TurnActionRowDto {
  action: TurnAction;
  hands: number;
  winningsBBPer100: number;
  handIds: string[];
}
