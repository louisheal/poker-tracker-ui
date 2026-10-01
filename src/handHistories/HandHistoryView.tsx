import { useEffect, useRef, useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { getHandHistories } from "../api";
import { Header } from "../Header";
import { HandHistoryTable } from "./HandHistoryTable";
import { UploadButton } from "./UploadButton";

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

export const HandHistoryView = () => {
  const [uploadedHandIds, setUploadedHandIds] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handHistoryRequestVersion = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const requestVersion = handHistoryRequestVersion.current;

    void getHandHistories(controller.signal)
      .then((handHistories) => {
        if (requestVersion === handHistoryRequestVersion.current) {
          setUploadedHandIds(handHistories.map(({ handId }) => handId));
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted && requestVersion === handHistoryRequestVersion.current) {
          setErrorMessage(error instanceof Error ? error.message : "Could not load hand histories.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const handleUploaded = (handIds: string[]) => {
    handHistoryRequestVersion.current += 1;
    setUploadedHandIds(handIds);
  };

  return (
    <Box sx={handHistoryViewSx}>
      <Header>
        <UploadButton onUploaded={handleUploaded} />
      </Header>
      <Box component="main" sx={handHistoryContentSx}>
        <HandHistoryTable handIds={uploadedHandIds ?? []} isLoading={isLoading && uploadedHandIds === null} />
      </Box>
      <Snackbar
        open={errorMessage !== null}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setErrorMessage(null)}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error" variant="filled" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
