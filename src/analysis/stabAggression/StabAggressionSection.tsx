import { Box, Paper, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { PostflopActionActorRole, PostflopActionFrequencyDto, PostflopBetResponseStreet } from "../dto";
import { AnalysisPanelGrid } from "../AnalysisPanelGrid";
import { AnalysisSectionState } from "../AnalysisSectionState";
import type { AnalysisSectionStatus } from "../AnalysisSectionState";
import type { PostflopActionFrequenciesState } from "./usePostflopActionFrequencies";

const actionLines = [
  { line: "B", title: "B (Bet)" },
  { line: "XB", title: "XB (Check-Bet)" },
  { line: "BR", title: "BR (Bet-Raise)" },
  { line: "XBR", title: "XBR (Check-Bet-Raise)" },
] as const;

const actorRoles = [
  { value: "Pfr", label: "PFR" },
  { value: "Defender", label: "Defender" },
] as const satisfies { value: PostflopActionActorRole; label: string }[];

const panelSx = {
  minWidth: 0,
  p: { xs: 1.5, sm: 2 },
  borderRadius: 1,
  bgcolor: "background.paper",
} satisfies SxProps<Theme>;

interface Props {
  street: PostflopBetResponseStreet;
  state: PostflopActionFrequenciesState;
}

const getFrequency = (
  frequencies: PostflopActionFrequencyDto[],
  line: string,
  actorRole: PostflopActionActorRole,
) => frequencies.find((frequency) => frequency.line === line && frequency.actorRole === actorRole);

export const StabAggressionSection = (props: Props) => {
  const loadedState = props.state.status === "loaded" ? props.state : null;
  const sectionStatus: AnalysisSectionStatus =
    props.state.status === "loaded"
      ? {
          status: "loaded",
          hasData: props.state.frequencies.some((frequency) =>
            actionLines.some((line) => line.line === frequency.line),
          ),
        }
      : props.state;

  return (
    <AnalysisSectionState
      title="Stab / Aggression"
      street={props.street}
      status={sectionStatus}
      emptyMessage={`No ${props.street.toLowerCase()} stab or aggression observations are available.`}
    >
      {loadedState !== null && (
        <AnalysisPanelGrid>
          {actionLines.map((actionLine) => (
            <Paper key={actionLine.line} component="section" variant="outlined" sx={panelSx}>
              <Typography component="h4" variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                {actionLine.title}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2 }}>
                {actorRoles.map((actorRole) => {
                  const frequency = getFrequency(loadedState.frequencies, actionLine.line, actorRole.value);
                  const rate =
                    frequency === undefined || frequency.opportunityCount === 0
                      ? null
                      : (100 * frequency.actionCount) / frequency.opportunityCount;

                  return (
                    <Box
                      key={actorRole.value}
                      component="section"
                      aria-label={`${actorRole.label} ${actionLine.line} frequency`}
                    >
                      <Typography variant="overline" color="text.secondary">
                        {actorRole.label}
                      </Typography>
                      <Typography variant="h5" sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {rate === null ? "—" : `${rate.toFixed(1)}%`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {frequency === undefined
                          ? "No opportunities"
                          : `${frequency.actionCount.toLocaleString()} of ${frequency.opportunityCount.toLocaleString()} decisions`}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          ))}
        </AnalysisPanelGrid>
      )}
    </AnalysisSectionState>
  );
};
