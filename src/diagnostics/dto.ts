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
