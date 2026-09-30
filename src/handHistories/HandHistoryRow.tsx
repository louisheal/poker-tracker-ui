import { TableCell, TableRow } from "@mui/material";

type Props = {
  handId: string;
};

export const HandHistoryRow = (props: Props) => {
  return (
    <TableRow hover>
      <TableCell>{props.handId}</TableCell>
    </TableRow>
  );
};
