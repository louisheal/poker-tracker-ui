import { TableCell, TableRow } from "@mui/material";
import type { HandHistory } from "./HandHistoryView";

type Props = {
  hand: HandHistory;
};

export const HandHistoryRow = (props: Props) => {
  return (
    <TableRow hover>
      <TableCell>{props.hand.handId}</TableCell>
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
