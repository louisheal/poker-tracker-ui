import { useState } from "react";
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Header } from "../Header";
import { HandHistoryBrowser } from "../handHistories/HandHistoryBrowser";
import type { TurnPotType } from "./dto";
import { RiverSpotsTable } from "./RiverSpotsTable";
import { TurnSpotsTable } from "./TurnSpotsTable";
import { useRiverDiagnostics } from "./useRiverDiagnostics";
import { useTurnDiagnostics } from "./useTurnDiagnostics";

const diagnosticsViewSx = {
  minHeight: "100vh",
  bgcolor: "background.default",
  color: "text.primary",
} satisfies SxProps<Theme>;

const diagnosticsContentSx = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  px: { xs: 2, sm: 3, lg: 5 },
  py: 4,
  maxWidth: 1440,
  mx: "auto",
} satisfies SxProps<Theme>;

const loadingSx = {
  display: "flex",
  justifyContent: "center",
  py: 8,
} satisfies SxProps<Theme>;

const diagnosticsPanelSx = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
} satisfies SxProps<Theme>;

interface DiagnosticsPanelProps {
  selectedHandIds: string[];
  selectedHandIdSet: ReadonlySet<string>;
  onToggleHandIds: (handIds: readonly string[]) => void;
}

interface TurnDiagnosticsPanelProps extends DiagnosticsPanelProps {
  potTypes: TurnPotType[];
  onTogglePotType: (potType: TurnPotType) => void;
}

const TurnDiagnosticsPanel = (props: TurnDiagnosticsPanelProps) => {
  const diagnosticsState = useTurnDiagnostics(props.potTypes);

  return (
    <>
      <Typography color="text.secondary">Turn betting spots</Typography>
      <FormGroup row aria-label="Pot types">
        <FormControlLabel
          control={
            <Checkbox checked={props.potTypes.includes("SRP")} onChange={() => props.onTogglePotType("SRP")} />
          }
          label="Single-raised pot (SRP)"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={props.potTypes.includes("ThreeBet")}
              onChange={() => props.onTogglePotType("ThreeBet")}
            />
          }
          label="3-bet pot"
        />
      </FormGroup>
      {diagnosticsState.status === "loading" && (
        <Box role="status" aria-label="Loading turn diagnostics" sx={loadingSx}>
          <CircularProgress size={28} />
        </Box>
      )}
      {diagnosticsState.status === "error" && <Alert severity="error">{diagnosticsState.message}</Alert>}
      {diagnosticsState.status === "loaded" && (
        <>
          <TurnSpotsTable
            rows={diagnosticsState.rows}
            selectedHandIds={props.selectedHandIdSet}
            onToggleHandIds={props.onToggleHandIds}
          />
          {props.selectedHandIds.length > 0 ? (
            <HandHistoryBrowser handIds={props.selectedHandIds} />
          ) : (
            <Typography color="text.secondary">Select diagnostic rows to review their hands.</Typography>
          )}
        </>
      )}
    </>
  );
};

const RiverDiagnosticsPanel = (props: DiagnosticsPanelProps) => {
  const diagnosticsState = useRiverDiagnostics();

  return (
    <>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        River spots that went to showdown
      </Typography>
      {diagnosticsState.status === "loading" && (
        <Box role="status" aria-label="Loading river diagnostics" sx={loadingSx}>
          <CircularProgress size={28} />
        </Box>
      )}
      {diagnosticsState.status === "error" && <Alert severity="error">{diagnosticsState.message}</Alert>}
      {diagnosticsState.status === "loaded" && (
        <>
          <RiverSpotsTable
            rows={diagnosticsState.rows}
            selectedHandIds={props.selectedHandIdSet}
            onToggleHandIds={props.onToggleHandIds}
          />
          {props.selectedHandIds.length > 0 ? (
            <HandHistoryBrowser handIds={props.selectedHandIds} />
          ) : (
            <Typography color="text.secondary">Select diagnostic rows to review their hands.</Typography>
          )}
        </>
      )}
    </>
  );
};

export const DiagnosticsView = () => {
  const [potTypes, setPotTypes] = useState<TurnPotType[]>(["SRP", "ThreeBet"]);
  const [selectedHandIds, setSelectedHandIds] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<"turn" | "river">("turn");
  const selectedHandIdSet = new Set(selectedHandIds);

  const togglePotType = (potType: TurnPotType) => {
    setPotTypes((currentPotTypes) =>
      currentPotTypes.includes(potType)
        ? currentPotTypes.filter((currentPotType) => currentPotType !== potType)
        : [...currentPotTypes, potType],
    );
    setSelectedHandIds([]);
  };

  const toggleHandIds = (handIds: readonly string[]) => {
    setSelectedHandIds((currentHandIds) => {
      const currentSet = new Set(currentHandIds);
      const allSelected = handIds.every((handId) => currentSet.has(handId));
      if (allSelected) {
        const handIdsToRemove = new Set(handIds);
        return currentHandIds.filter((handId) => !handIdsToRemove.has(handId));
      }

      return [...new Set([...currentHandIds, ...handIds])];
    });
  };

  const panelProps = {
    selectedHandIds,
    selectedHandIdSet,
    onToggleHandIds: toggleHandIds,
  };

  return (
    <Box sx={diagnosticsViewSx}>
      <Header />
      <Box component="main" sx={diagnosticsContentSx}>
        <Typography component="h2" variant="h5" sx={{ fontWeight: 600 }}>
          Diagnostics
        </Typography>
        <Tabs
          aria-label="Diagnostics view"
          value={selectedTab}
          onChange={(_, value: "turn" | "river") => setSelectedTab(value)}
        >
          <Tab id="diagnostics-tab-turn" aria-controls="diagnostics-tabpanel" label="Turn" value="turn" />
          <Tab id="diagnostics-tab-river" aria-controls="diagnostics-tabpanel" label="River" value="river" />
        </Tabs>
        <Box
          role="tabpanel"
          id="diagnostics-tabpanel"
          aria-labelledby={`diagnostics-tab-${selectedTab}`}
          sx={diagnosticsPanelSx}
        >
          {selectedTab === "turn" ? (
            <TurnDiagnosticsPanel {...panelProps} potTypes={potTypes} onTogglePotType={togglePotType} />
          ) : (
            <RiverDiagnosticsPanel {...panelProps} />
          )}
        </Box>
      </Box>
    </Box>
  );
};
