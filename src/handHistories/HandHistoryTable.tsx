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
import type { HandLabelAssignment, HandLabelOption } from "../api";
import { HandHistoryRow } from "./HandHistoryRow";
import type { HandHistory } from "./HandHistoryView";

const handHistoryTableSx = {
  width: "min(100%, 1350px)",
  minHeight: 196,
  display: "grid",
  placeItems: "center",
  overflowX: "hidden",
  bgcolor: "background.paper",
  border: 1,
  borderColor: "divider",
  borderRadius: 2,
} satisfies SxProps<Theme>;

const fluidCellPadding = "clamp(4px, calc(2px + 0.55vw), 10px)";
const fluidFontSize = "clamp(0.7rem, calc(0.6rem + 0.25vw), 0.875rem)";
const fluidControlHeight = "clamp(32px, calc(28px + 1vw), 40px)";
const fluidChipHeight = "clamp(20px, calc(16px + 0.65vw), 28px)";

const handHistoryTableContentSx = ((theme: Theme) => ({
  width: "100%",
  minWidth: 0,
  tableLayout: "fixed",
  "& .MuiTableCell-root": {
    minWidth: 0,
    padding: fluidCellPadding,
    fontSize: fluidFontSize,
    lineHeight: 1.3,
  },
  "& .MuiTableCell-root:nth-of-type(1)": { width: "14%" },
  "& .MuiTableCell-root:nth-of-type(2)": { width: "10%" },
  "& .MuiTableCell-root:nth-of-type(3), & .MuiTableCell-root:nth-of-type(4), & .MuiTableCell-root:nth-of-type(5)": {
    width: "14%",
  },
  "& .MuiTableCell-root:nth-of-type(6)": { width: "34%" },
  "& .MuiAutocomplete-root": { width: "100%", minWidth: 0 },
  "& .MuiAutocomplete-inputRoot": {
    minWidth: 0,
    minHeight: fluidControlHeight,
    flexWrap: "wrap",
  },
  "& .MuiAutocomplete-input": { minWidth: "0 !important", fontSize: fluidFontSize },
  "& .MuiChip-root": { maxWidth: "100%", height: fluidChipHeight, fontSize: fluidFontSize },
  "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis", px: "clamp(4px, 0.6vw, 8px)" },
  "& .MuiInputBase-input": { fontSize: fluidFontSize },
  "& .MuiButton-root": { fontSize: fluidFontSize, whiteSpace: "normal", overflowWrap: "anywhere" },
  [theme.breakpoints.down("sm")]: {
    display: "block",
    "& .MuiTableHead-root": { display: "none" },
    "& .MuiTableBody-root": {
      display: "grid",
      gap: 0,
      width: "100%",
      padding: 0,
    },
    "& .MuiTableRow-root": {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr)",
      width: "100%",
      overflow: "hidden",
      border: 0,
      borderBottom: "2px solid",
      borderColor: "common.white",
      borderRadius: 0,
      "&:last-child": { borderBottom: 0 },
    },
    "& .MuiTableRow-root .MuiTableCell-root": {
      display: "grid",
      gridTemplateColumns: "minmax(5.5rem, 31%) minmax(0, 1fr)",
      alignItems: "center",
      gap: 1,
      width: "100%",
      borderBottom: 1,
      borderColor: "divider",
      "&::before": {
        content: "attr(data-label)",
        color: "text.secondary",
        fontWeight: 600,
        fontSize: fluidFontSize,
      },
      "&:last-child": { borderBottom: 0 },
    },
  },
})) satisfies SxProps<Theme>;

const statusMessageSx = {
  px: 3,
  py: 5,
  textAlign: "center",
} satisfies SxProps<Theme>;

type Props = {
  hands: readonly HandHistory[];
  labelOptions: readonly HandLabelOption[];
  isLoading?: boolean;
  onSelectHand: (hand: HandHistory) => void;
  onLabelsChanged: (handId: string, labels: HandLabelAssignment[]) => void;
  onLabelSaveError: (message: string) => void;
  onNoteChanged: (handId: string, note: string) => void;
  onNoteSaveError: (message: string) => void;
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
        <Table size="small" aria-label="Hand histories" sx={handHistoryTableContentSx}>
          <TableHead>
            <TableRow>
              <TableCell>Hand ID</TableCell>
              <TableCell>Hole Cards</TableCell>
              <TableCell>Flop</TableCell>
              <TableCell>Turn</TableCell>
              <TableCell>River</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.hands.map((hand) => (
              <HandHistoryRow
                key={hand.handId}
                hand={hand}
                labelOptions={props.labelOptions}
                onSelect={props.onSelectHand}
                onLabelsChanged={props.onLabelsChanged}
                onLabelSaveError={props.onLabelSaveError}
                onNoteChanged={props.onNoteChanged}
                onNoteSaveError={props.onNoteSaveError}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};
