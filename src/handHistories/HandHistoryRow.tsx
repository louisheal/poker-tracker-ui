import { Button, TableCell, TableRow } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { HandLabelOption } from "../api";
import type { HandHistory } from "./types";
import { HandFlagCell } from "./HandFlagCell";
import { HandLabelsCell } from "./HandLabelsCell";

const handIdButtonSx = {
  justifyContent: "flex-start",
  minWidth: 0,
  px: 0,
  textAlign: "left",
} satisfies SxProps<Theme>;

interface Props {
  hand: HandHistory;
  labelOptions: readonly HandLabelOption[];
  onSelect: (hand: HandHistory) => void;
  onFlaggedChanged: (handId: string, flagged: boolean) => void;
  onFlagSaveError: (message: string) => void;
}

export const HandHistoryRow = (props: Props) => {
  return (
    <TableRow hover>
      <TableCell component="th" scope="row" data-label="Hand ID">
        <Button
          aria-label={`Open replay for hand ${props.hand.handId}`}
          onClick={() => props.onSelect(props.hand)}
          sx={handIdButtonSx}
          variant="text"
        >
          {props.hand.handId}
        </Button>
      </TableCell>
      <TableCell data-label="Hole Cards">
        {props.hand.holeCards.first.rank}
        {props.hand.holeCards.first.suit} {props.hand.holeCards.second.rank}
        {props.hand.holeCards.second.suit}
      </TableCell>
      <TableCell data-label="Labels">
        <HandLabelsCell labels={props.hand.labels} labelOptions={props.labelOptions} />
      </TableCell>
      <TableCell data-label="Flag">
        <HandFlagCell
          handId={props.hand.handId}
          flagged={props.hand.flagged}
          onFlaggedChanged={props.onFlaggedChanged}
          onError={props.onFlagSaveError}
        />
      </TableCell>
    </TableRow>
  );
};
