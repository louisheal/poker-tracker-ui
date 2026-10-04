import { useEffect, useRef, useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handHistoryRequestVersion = useRef(0);

  const loadUploadedHands = async () => {
    const requestVersion = handHistoryRequestVersion.current;
    const handHistories = await getHandHistories();

    if (requestVersion !== handHistoryRequestVersion.current) {
      setIsLoading(false);
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
    setIsLoading(false);
  };

  useEffect(() => {
    void loadUploadedHands();
  }, []);

  const handleUploaded = () => {
    handHistoryRequestVersion.current += 1;
    loadUploadedHands();
  };

  return (
    <Box sx={handHistoryViewSx}>
      <Header>
        <UploadButton onUploaded={handleUploaded} />
      </Header>
      <Box component="main" sx={handHistoryContentSx}>
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
