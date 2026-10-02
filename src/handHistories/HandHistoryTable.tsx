import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { HandHistoryRow } from "./HandHistoryRow";
import type { HandHistory } from "./HandHistoryView";

const handHistoryTableSx = {
  width: "min(100%, 560px)",
  minHeight: 196,
  display: "grid",
  placeItems: "center",
  overflow: "hidden",
  bgcolor: "background.paper",
  border: 1,
  borderColor: "divider",
  borderRadius: 2,
} satisfies SxProps<Theme>;

const statusMessageSx = {
  px: 3,
  py: 5,
  textAlign: "center",
} satisfies SxProps<Theme>;

type Props = {
  hands: readonly HandHistory[];
  isLoading?: boolean;
  onSelectHand: (handId: string) => void;
};

export const HandHistoryTable = (props: Props) => {
  return (
    <Paper component="section" aria-label="Hand histories" elevation={0} sx={handHistoryTableSx}>
      {props.isLoading ? (
        <Box role="status" sx={statusMessageSx}>
          <CircularProgress aria-label="Loading hand histories" size={24} />
        </Box>
      ) : props.hands.length === 0 ? (
        <Box role="status" sx={statusMessageSx}>
          <Typography color="text.secondary" variant="body2">
            no hands found
          </Typography>
        </Box>
      ) : (
        <Table size="small" aria-label="Hand histories">
          <TableHead>
            <TableRow>
              <TableCell>Hand ID</TableCell>
              <TableCell>Hole Cards</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.hands.map((hand) => (
              <HandHistoryRow
                key={hand.handId}
                hand={hand}
                onSelect={() => props.onSelectHand(hand.handId)}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};
