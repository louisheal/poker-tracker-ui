import { TableCell, TableRow } from "@mui/material";

export interface HandHistoryRowProps {
  handId: string;
}

export function HandHistoryRow({ handId }: HandHistoryRowProps) {
  return (
    <TableRow hover>
      <TableCell>{handId}</TableCell>
    </TableRow>
  );
}
