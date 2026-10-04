import { useEffect, useRef, useState } from "react";
import { Alert, Box, FormControlLabel, Snackbar, Switch } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";
import { getHandHistories, getHandLabelOptions } from "../api";
import type { HandLabelAssignment, HandLabelOption } from "../api";
import { Header } from "../Header";
import { HandHistoryTable } from "./HandHistoryTable";
import { UploadButton } from "./UploadButton";
import { getHandLabelColor } from "./handLabelStyles";
import { HandReplayDialog } from "../handReplays/HandReplayDialog";

const handHistoryViewSx = {
  minHeight: "100vh",
  bgcolor: "background.default",
  color: "text.primary",
} satisfies SxProps<Theme>;

const handHistoryContentSx = {
  display: "flex",
  minHeight: "calc(100vh - 65px)",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  px: 2.5,
  py: 4,
} satisfies SxProps<Theme>;

const handHistoryFilterSx = {
  width: "min(100%, 560px)",
} satisfies SxProps<Theme>;

const errorAlertSx = {
  width: "100%",
} satisfies SxProps<Theme>;

const unlabelledFilterValue = "__unlabelled__";

export interface HandHistory {
  handId: string;
  holeCards: HoleCards;
  labels: HandLabelAssignment[];
  note: string;
}

export interface HoleCards {
  first: PlayingCard;
  second: PlayingCard;
}

export interface PlayingCard {
  rank: string;
  suit: string;
}

export const HandHistoryView = () => {
  const [uploadedHands, setUploadedHands] = useState<HandHistory[]>([]);
  const [selectedHand, setSelectedHand] = useState<HandHistory | null>(null);
  const [labelOptions, setLabelOptions] = useState<HandLabelOption[]>([]);
  const [selectedLabelFilters, setSelectedLabelFilters] = useState<string[]>([]);
  const [showHeroSawFlopOnly, setShowHeroSawFlopOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handHistoryRequestVersion = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    void getHandLabelOptions(controller.signal)
      .then(setLabelOptions)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setErrorMessage(error instanceof Error ? error.message : "Hand labels could not be loaded.");
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const requestVersion = ++handHistoryRequestVersion.current;
    const controller = new AbortController();

    const loadUploadedHands = async () => {
      try {
        const includeUnlabelled = selectedLabelFilters.includes(unlabelledFilterValue);
        const selectedLabels = selectedLabelFilters.filter((label) => label !== unlabelledFilterValue);
        const handHistories = await getHandHistories(
          controller.signal,
          showHeroSawFlopOnly ? true : undefined,
          selectedLabels,
          includeUnlabelled,
        );

        if (requestVersion !== handHistoryRequestVersion.current) {
          return;
        }

        const mappedHands = handHistories.map((hand) => ({
          handId: hand.handId,
          labels: hand.labels,
          note: hand.note,
          holeCards: {
            first: {
              rank: hand.holeCards.first.rank,
              suit: hand.holeCards.first.suit,
            },
            second: {
              rank: hand.holeCards.second.rank,
              suit: hand.holeCards.second.suit,
            },
          },
        }));

        setUploadedHands(mappedHands);
      } catch (error) {
        if (requestVersion === handHistoryRequestVersion.current) {
          setErrorMessage(error instanceof Error ? error.message : "Hand histories could not be loaded.");
        }
      } finally {
        if (requestVersion === handHistoryRequestVersion.current) {
          setIsLoading(false);
        }
      }
    };

    void loadUploadedHands();

    return () => {
      controller.abort();
      handHistoryRequestVersion.current += 1;
    };
  }, [refreshVersion, selectedLabelFilters, showHeroSawFlopOnly]);

  const handleLabelsChanged = (handId: string, labels: HandLabelAssignment[]) => {
    const selectedLabels = selectedLabelFilters.filter((label) => label !== unlabelledFilterValue);
    const includeUnlabelled = selectedLabelFilters.includes(unlabelledFilterValue);
    setUploadedHands((hands) =>
      hands
        .map((hand) => (hand.handId === handId ? { ...hand, labels } : hand))
        .filter(
          (hand) =>
            selectedLabelFilters.length === 0 ||
            hand.labels.some((label) => selectedLabels.includes(label.label)) ||
            (includeUnlabelled && hand.labels.length === 0),
        ),
    );
    setSelectedHand((hand) => (hand?.handId === handId ? { ...hand, labels } : hand));
    if (selectedLabelFilters.length > 0) {
      setIsLoading(true);
      setRefreshVersion((version) => version + 1);
    }
  };

  const handleNoteChanged = (handId: string, note: string) => {
    setUploadedHands((hands) => hands.map((hand) => (hand.handId === handId ? { ...hand, note } : hand)));
    setSelectedHand((hand) => (hand?.handId === handId ? { ...hand, note } : hand));
  };

  const handleUploaded = () => {
    handHistoryRequestVersion.current += 1;
    setIsLoading(true);
    setErrorMessage(null);
    setRefreshVersion((version) => version + 1);
  };

  return (
    <Box sx={handHistoryViewSx}>
      <Header>
        <UploadButton onUploaded={handleUploaded} />
      </Header>
      <Box component="main" sx={handHistoryContentSx}>
        <Box sx={handHistoryFilterSx}>
          <Autocomplete
            multiple
            options={[...labelOptions, { value: unlabelledFilterValue, name: "Unlabelled", category: "No labels" }]}
            value={[
              ...labelOptions,
              { value: unlabelledFilterValue, name: "Unlabelled", category: "No labels" },
            ].filter((option) => selectedLabelFilters.includes(option.value))}
            groupBy={(option) => option.category}
            getOptionLabel={(option) => option.name}
            onChange={(_, options) => {
              setErrorMessage(null);
              setIsLoading(true);
              setSelectedLabelFilters(options.map((option) => option.value));
            }}
            renderInput={(params) => <TextField {...params} label="Filter by labels" />}
            renderOption={(optionProps, option) => (
              <li {...optionProps}>
                {option.value !== unlabelledFilterValue && (
                  <Chip
                    label={option.category}
                    size="small"
                    sx={{ bgcolor: getHandLabelColor(option.category), color: "common.white", mr: 1 }}
                  />
                )}
                {option.name}
              </li>
            )}
            renderValue={(options, getItemProps) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {options.map((option, index) => {
                  const { key, ...itemProps } = getItemProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option.name}
                      size="small"
                      {...itemProps}
                      sx={{ bgcolor: getHandLabelColor(option.category), color: "common.white" }}
                    />
                  );
                })}
              </Box>
            )}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showHeroSawFlopOnly}
                onChange={(_, checked) => {
                  setIsLoading(true);
                  setErrorMessage(null);
                  setShowHeroSawFlopOnly(checked);
                }}
              />
            }
            label="Show hands where hero saw the flop"
          />
        </Box>
        <HandHistoryTable
          hands={uploadedHands}
          labelOptions={labelOptions}
          isLoading={isLoading}
          onSelectHand={setSelectedHand}
          onLabelsChanged={handleLabelsChanged}
          onLabelSaveError={setErrorMessage}
          onNoteChanged={handleNoteChanged}
          onNoteSaveError={setErrorMessage}
        />
      </Box>
      <HandReplayDialog
        handId={selectedHand?.handId ?? ""}
        labels={selectedHand?.labels ?? []}
        note={selectedHand?.note ?? ""}
        labelOptions={labelOptions}
        open={selectedHand !== null}
        onLabelsChanged={handleLabelsChanged}
        onNoteChanged={handleNoteChanged}
        onNoteSaveError={setErrorMessage}
        onClose={() => setSelectedHand(null)}
      />
      <Snackbar
        open={errorMessage !== null}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setErrorMessage(null)}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error" variant="filled" sx={errorAlertSx}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
