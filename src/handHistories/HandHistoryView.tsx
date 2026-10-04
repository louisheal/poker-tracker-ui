import { useEffect, useRef, useState } from "react";
import { Alert, Box, FormControlLabel, Snackbar, Switch } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { getHandHistories } from "../api";
import { Header } from "../Header";
import { HandHistoryTable } from "./HandHistoryTable";
import { UploadButton } from "./UploadButton";
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

export interface HandHistory {
  handId: string;
  holeCards: HoleCards;
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
  const [selectedHandId, setSelectedHandId] = useState<string | null>(null);
  const [showHeroSawFlopOnly, setShowHeroSawFlopOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handHistoryRequestVersion = useRef(0);

  useEffect(() => {
    const requestVersion = ++handHistoryRequestVersion.current;
    const controller = new AbortController();

    const loadUploadedHands = async () => {
      try {
        const handHistories = await getHandHistories(controller.signal, showHeroSawFlopOnly ? true : undefined);

        if (requestVersion !== handHistoryRequestVersion.current) {
          return;
        }

        const mappedHands = handHistories.map((hand) => ({
          handId: hand.handId,
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
  }, [refreshVersion, showHeroSawFlopOnly]);

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
        <HandHistoryTable hands={uploadedHands} isLoading={isLoading} onSelectHand={setSelectedHandId} />
      </Box>
      <HandReplayDialog
        handId={selectedHandId ?? ""}
        open={selectedHandId !== null}
        onClose={() => setSelectedHandId(null)}
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
