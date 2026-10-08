import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { PostflopBettingStatDto, PostflopOpportunityType } from "./dto";

const tableContainerSx = {
  overflowX: "auto",
} satisfies SxProps<Theme>;

const tableSx = {
  minWidth: 1040,
} satisfies SxProps<Theme>;

const headerCellSx = {
  whiteSpace: "nowrap",
  fontWeight: 600,
} satisfies SxProps<Theme>;

const numberCellSx = {
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
} satisfies SxProps<Theme>;

const opportunityLabels: Record<PostflopOpportunityType, string> = {
  FlopContinuationBet: "Flop c-bet",
  DonkBet: "Flop donk-bet",
  DelayedContinuationBet: "Delayed c-bet",
};

const matchupLabels = {
  HeroVsVillain: "Hero to Villain",
  VillainVsHero: "Villain to Hero",
  VillainVsVillain: "Villain to Villain",
};

const formatRate = (rate: number) => `${rate.toFixed(1)}%`;

interface Props {
  stats: PostflopBettingStatDto[];
}

export const PostflopBettingTable = (props: Props) => {
  return (
    <TableContainer component={Paper} variant="outlined" sx={tableContainerSx}>
      <Table size="small" aria-label="Postflop betting analysis" sx={tableSx}>
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellSx}>Opportunity</TableCell>
            <TableCell sx={headerCellSx}>Matchup</TableCell>
            <TableCell sx={headerCellSx}>Positions</TableCell>
            <TableCell align="right" sx={headerCellSx}>
              Eligible
            </TableCell>
            <TableCell align="right" sx={headerCellSx}>
              Bets
            </TableCell>
            <TableCell align="right" sx={headerCellSx}>
              Bet rate
            </TableCell>
            <TableCell sx={headerCellSx}>Delayed context</TableCell>
            <TableCell sx={headerCellSx}>Responses</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.stats.map((stat) => (
            <TableRow
              key={`${stat.opportunityType}-${stat.matchupDirection}-${stat.actorPosition}-${stat.responderPosition ?? "none"}-${stat.delayedContext ?? "none"}`}
              hover
            >
              <TableCell>{opportunityLabels[stat.opportunityType]}</TableCell>
              <TableCell>{matchupLabels[stat.matchupDirection]}</TableCell>
              <TableCell sx={numberCellSx}>
                {stat.actorPosition} to {stat.responderPosition ?? "-"}
              </TableCell>
              <TableCell align="right" sx={numberCellSx}>
                {stat.opportunityCount.toLocaleString()}
              </TableCell>
              <TableCell align="right" sx={numberCellSx}>
                {stat.betCount.toLocaleString()}
              </TableCell>
              <TableCell align="right" sx={numberCellSx}>
                {formatRate(stat.betRate)}
              </TableCell>
              <TableCell>{stat.delayedContext ?? "—"}</TableCell>
              <TableCell>
                {stat.responseBreakdown.length === 0 ? (
                  <Typography component="span" variant="body2" color="text.secondary">
                    -
                  </Typography>
                ) : (
                  stat.responseBreakdown
                    .map((response) => `${response.responseType}: ${response.count} (${formatRate(response.rate)})`)
                    .join(", ")
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
