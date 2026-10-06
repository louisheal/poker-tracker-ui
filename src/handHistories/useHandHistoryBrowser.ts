import { useEffect, useRef, useState } from "react";
import { getHandHistories, getHandLabelOptions } from "../api";
import type { HandHistoryDto, HandLabelAssignment, HandLabelOption } from "../api";
import { getHandHistoriesByIds } from "./api";
import type { HandHistory } from "./types";

interface Props {
  handIds?: readonly string[];
  selectedLabelFilters: readonly string[];
  includeUnlabelled: boolean;
  flaggedOnly: boolean;
  refreshVersion: number;
}

const unlabelledFilterValue = "__unlabelled__";

const mapHandHistory = (hand: HandHistoryDto): HandHistory => ({
  handId: hand.handId,
  labels: hand.labels,
  note: hand.note,
  flagged: hand.flagged,
  holeCards: {
    first: { rank: hand.holeCards.first.rank, suit: hand.holeCards.first.suit },
    second: { rank: hand.holeCards.second.rank, suit: hand.holeCards.second.suit },
  },
});

export const useHandHistoryBrowser = (props: Props) => {
  const [hands, setHands] = useState<HandHistory[]>([]);
  const [selectedHand, setSelectedHand] = useState<HandHistory | null>(null);
  const [labelOptions, setLabelOptions] = useState<HandLabelOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestVersion = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    void getHandLabelOptions(controller.signal)
      .then((options) => {
        if (!controller.signal.aborted) setLabelOptions(options);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setErrorMessage(error instanceof Error ? error.message : "Hand labels could not be loaded.");
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const currentRequest = ++requestVersion.current;
    const controller = new AbortController();

    const loadHands = async () => {
      setIsLoading(true);
      try {
        const histories =
          props.handIds !== undefined
            ? props.handIds.length === 0
              ? []
              : await getHandHistoriesByIds(props.handIds, controller.signal)
            : await getHandHistories(
                controller.signal,
                props.selectedLabelFilters.filter((label) => label !== unlabelledFilterValue),
                props.includeUnlabelled,
                props.flaggedOnly,
              );

        if (currentRequest === requestVersion.current) {
          setHands(histories.map(mapHandHistory));
        }
      } catch (error) {
        if (currentRequest === requestVersion.current) {
          setErrorMessage(error instanceof Error ? error.message : "Hand histories could not be loaded.");
        }
      } finally {
        if (currentRequest === requestVersion.current) setIsLoading(false);
      }
    };

    void loadHands();

    return () => {
      controller.abort();
      requestVersion.current += 1;
    };
  }, [
    props.handIds,
    props.selectedLabelFilters,
    props.includeUnlabelled,
    props.flaggedOnly,
    props.refreshVersion,
    refreshVersion,
  ]);

  const handleLabelsChanged = (handId: string, labels: HandLabelAssignment[]) => {
    const selectedLabels = props.selectedLabelFilters.filter((label) => label !== unlabelledFilterValue);
    setHands((currentHands) =>
      currentHands
        .map((hand) => (hand.handId === handId ? { ...hand, labels } : hand))
        .filter(
          (hand) =>
            props.selectedLabelFilters.length === 0 ||
            hand.labels.some((label) => selectedLabels.includes(label.label)) ||
            (props.includeUnlabelled && hand.labels.length === 0),
        ),
    );
    setSelectedHand((currentHand) => (currentHand?.handId === handId ? { ...currentHand, labels } : currentHand));
    if (props.selectedLabelFilters.length > 0 || props.includeUnlabelled) {
      setRefreshVersion((currentVersion) => currentVersion + 1);
    }
  };

  const handleNoteChanged = (handId: string, note: string) => {
    setHands((currentHands) => currentHands.map((hand) => (hand.handId === handId ? { ...hand, note } : hand)));
    setSelectedHand((currentHand) => (currentHand?.handId === handId ? { ...currentHand, note } : currentHand));
  };

  const handleFlaggedChanged = (handId: string, flagged: boolean) => {
    setHands((currentHands) =>
      currentHands
        .map((hand) => (hand.handId === handId ? { ...hand, flagged } : hand))
        .filter((hand) => !props.flaggedOnly || hand.flagged),
    );
    setSelectedHand((currentHand) => (currentHand?.handId === handId ? { ...currentHand, flagged } : currentHand));
  };

  return {
    hands,
    labelOptions,
    isLoading,
    errorMessage,
    selectedHand,
    selectHand: (hand: HandHistory) => setSelectedHand(hand),
    closeReplay: () => setSelectedHand(null),
    reportError: (message: string) => setErrorMessage(message),
    clearError: () => setErrorMessage(null),
    handleLabelsChanged,
    handleNoteChanged,
    handleFlaggedChanged,
  };
};
