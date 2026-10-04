import { Button, TableCell, TableRow } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { HandHistory } from "./HandHistoryView";

const handIdButtonSx = {
  justifyContent: "flex-start",
  minWidth: 0,
  px: 0,
} satisfies SxProps<Theme>;

type Props = {
  hand: HandHistory;
  onSelect: () => void;
};

export const HandHistoryRow = (props: Props) => {
  return (
    <TableRow hover>
      <TableCell component="th" scope="row">
        <Button
          aria-label={`Open replay for hand ${props.hand.handId}`}
          onClick={props.onSelect}
          sx={handIdButtonSx}
          variant="text"
        >
          {props.hand.handId}
        </Button>
      </TableCell>
      <TableCell>
        {props.hand.holeCards.first.rank}
        {props.hand.holeCards.first.suit}
      </TableCell>
      <TableCell>
        {props.hand.holeCards.second.rank}
        {props.hand.holeCards.second.suit}
      </TableCell>
    </TableRow>
  );
};
