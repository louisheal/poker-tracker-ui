import { Button, TableCell, TableRow } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { HandLabelAssignment, HandLabelOption } from "../api";
import { handLabelStreets } from "../api";
import type { HandHistory } from "./HandHistoryView";
import { HandLabelCell } from "./HandLabelCell";
import { HandNoteCell } from "./HandNoteCell";

const handIdButtonSx = {
  justifyContent: "flex-start",
  minWidth: 0,
  px: 0,
} satisfies SxProps<Theme>;

type Props = {
  hand: HandHistory;
  labelOptions: readonly HandLabelOption[];
  onSelect: (hand: HandHistory) => void;
  onLabelsChanged: (handId: string, labels: HandLabelAssignment[]) => void;
  onLabelSaveError: (message: string) => void;
  onNoteChanged: (handId: string, note: string) => void;
  onNoteSaveError: (message: string) => void;
};

export const HandHistoryRow = (props: Props) => {
  const labelsKey = props.hand.labels.map((label) => `${label.street}:${label.label}`).join(",");

  return (
    <TableRow hover>
      <TableCell component="th" scope="row">
        <Button
          aria-label={`Open replay for hand ${props.hand.handId}`}
          onClick={() => props.onSelect(props.hand)}
          sx={handIdButtonSx}
          variant="text"
        >
          {props.hand.handId}
        </Button>
      </TableCell>
      <TableCell>
        {props.hand.holeCards.first.rank}
        {props.hand.holeCards.first.suit} {props.hand.holeCards.second.rank}
        {props.hand.holeCards.second.suit}
      </TableCell>
      {handLabelStreets.map((street) => (
        <TableCell key={street}>
          <HandLabelCell
            key={`${props.hand.handId}:${street}:${labelsKey}`}
            hand={props.hand}
            street={street}
            labelOptions={props.labelOptions}
            onLabelsChanged={props.onLabelsChanged}
            onError={props.onLabelSaveError}
          />
        </TableCell>
      ))}
      <TableCell sx={{ minWidth: 320 }}>
        <HandNoteCell
          key={`${props.hand.handId}:${props.hand.note}`}
          handId={props.hand.handId}
          note={props.hand.note}
          onNoteChanged={props.onNoteChanged}
          onError={props.onNoteSaveError}
        />
      </TableCell>
    </TableRow>
  );
};
