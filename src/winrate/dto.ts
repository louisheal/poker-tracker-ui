export interface WinrateGraphDto {
  points: WinrateHandBatchPointDto[];
}

export interface WinrateHandBatchPointDto {
  handCount: number;
  netWinningsBB: number;
  withShowdownWinningsBB: number;
  withoutShowdownWinningsBB: number;
}
