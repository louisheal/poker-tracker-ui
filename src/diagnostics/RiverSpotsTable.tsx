import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { RiverSpotRowDto } from "./dto";
import { RiverSpotRow } from "./RiverSpotRow";

const tableFrameSx = {
  border: 1,
  borderColor: "divider",
  borderRadius: 1,
  bgcolor: "background.paper",
} satisfies SxProps<Theme>;

interface Props {
  rows: RiverSpotRowDto[];
  selectedHandIds: ReadonlySet<string>;
  onToggleHandIds: (handIds: readonly string[]) => void;
}

export const RiverSpotsTable = (props: Props) => (
  <Paper component="section" elevation={0} sx={tableFrameSx}>
    <Table aria-label="River spots at showdown">
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell />
          <TableCell>Spot</TableCell>
          <TableCell align="right">Hands</TableCell>
          <TableCell align="right">BB/100</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.rows.map((row) => (
          <RiverSpotRow
            key={row.spot}
            row={row}
            selectedHandIds={props.selectedHandIds}
            onToggleHandIds={props.onToggleHandIds}
          />
        ))}
      </TableBody>
    </Table>
  </Paper>
);
