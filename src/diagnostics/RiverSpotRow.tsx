import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Checkbox, Collapse, IconButton, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import type { RiverSpotRowDto } from "./dto";

const spotLabels: Record<string, string> = {
  HeroBetRiver: "Hero bet river (called)",
  HeroCallRiver: "Hero call river",
  HeroRaiseRiver: "Hero raise river (called)",
  HeroCheckRiver: "Hero check river",
};

const sizeLabels: Record<string, string> = {
  Small: "Small (<40% pot)",
  Medium: "Medium (40-<70% pot)",
  Large: "Large (70-<100% pot)",
  Overbet: "Overbet (100%+ pot)",
};

interface Props {
  row: RiverSpotRowDto;
  selectedHandIds: ReadonlySet<string>;
  onToggleHandIds: (handIds: readonly string[]) => void;
}

export const RiverSpotRow = (props: Props) => {
  const [expanded, setExpanded] = useState(false);
  const allHandsSelected =
    props.row.handIds.length > 0 && props.row.handIds.every((handId) => props.selectedHandIds.has(handId));
  const someHandsSelected = props.row.handIds.some((handId) => props.selectedHandIds.has(handId));

  return (
    <>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={allHandsSelected}
            indeterminate={someHandsSelected && !allHandsSelected}
            disabled={props.row.handIds.length === 0}
            slotProps={{ input: { "aria-label": `Select ${spotLabels[props.row.spot] ?? props.row.spot} hands` } }}
            onChange={() => props.onToggleHandIds(props.row.handIds)}
            size="small"
          />
        </TableCell>
        <TableCell padding="checkbox">
          <IconButton
            aria-label={`${expanded ? "Hide" : "Show"} size breakdown for ${spotLabels[props.row.spot] ?? props.row.spot}`}
            aria-expanded={expanded}
            size="small"
            onClick={() => setExpanded((currentExpanded) => !currentExpanded)}
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{spotLabels[props.row.spot] ?? props.row.spot}</TableCell>
        <TableCell align="right">{props.row.hands}</TableCell>
        <TableCell align="right">{props.row.winningsBBPer100.toFixed(2)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5} sx={{ border: 0, py: 0 }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {props.row.sizeBreakdown.length > 0 ? (
              <Table size="small" aria-label={`Bet size breakdown for ${spotLabels[props.row.spot] ?? props.row.spot}`}>
                <TableBody>
                  {props.row.sizeBreakdown.map((sizeRow) => (
                    <TableRow key={sizeRow.size}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            sizeRow.handIds.length > 0 &&
                            sizeRow.handIds.every((handId) => props.selectedHandIds.has(handId))
                          }
                          indeterminate={
                            sizeRow.handIds.some((handId) => props.selectedHandIds.has(handId)) &&
                            !sizeRow.handIds.every((handId) => props.selectedHandIds.has(handId))
                          }
                          disabled={sizeRow.handIds.length === 0}
                          slotProps={{
                            input: { "aria-label": `Select ${sizeLabels[sizeRow.size] ?? sizeRow.size} hands` },
                          }}
                          onChange={() => props.onToggleHandIds(sizeRow.handIds)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{sizeLabels[sizeRow.size] ?? sizeRow.size}</TableCell>
                      <TableCell align="right">{sizeRow.hands}</TableCell>
                      <TableCell align="right">{sizeRow.winningsBBPer100.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography color="text.secondary" variant="body2" sx={{ py: 1.5 }}>
                No bet size to categorize for this spot.
              </Typography>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
