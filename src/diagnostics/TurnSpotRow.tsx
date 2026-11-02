import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Checkbox, Collapse, IconButton, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import type { TurnSpotRowDto } from "./dto";

const spotDetails: Record<TurnSpotRowDto["spot"], { label: string; context: string }> = {
  DelayedCBet: { label: "Delayed c-bet", context: "Hero IP, Flop XX" },
  Barrel: { label: "Barrel", context: "Hero IP, Flop XBC" },
  Probe: { label: "Probe", context: "Hero OOP, Flop XX" },
};

interface Props {
  row: TurnSpotRowDto;
  selectedHandIds: ReadonlySet<string>;
  onToggleHandIds: (handIds: readonly string[]) => void;
}

export const TurnSpotRow = (props: Props) => {
  const [expanded, setExpanded] = useState(false);
  const details = spotDetails[props.row.spot];
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
            slotProps={{ input: { "aria-label": `Select ${details.label} hands` } }}
            onChange={() => props.onToggleHandIds(props.row.handIds)}
            size="small"
          />
        </TableCell>
        <TableCell padding="checkbox">
          <IconButton
            aria-label={`${expanded ? "Hide" : "Show"} actions for ${details.label}`}
            aria-expanded={expanded}
            size="small"
            onClick={() => setExpanded((currentExpanded) => !currentExpanded)}
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography>{details.label}</Typography>
          <Typography color="text.secondary" variant="body2">
            {details.context}
          </Typography>
        </TableCell>
        <TableCell align="right">{props.row.hands}</TableCell>
        <TableCell align="right">{props.row.winningsBBPer100.toFixed(2)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5} sx={{ border: 0, py: 0 }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {props.row.actionBreakdown.length > 0 ? (
              <Table size="small" aria-label={`${details.label} action breakdown`}>
                <TableBody>
                  {props.row.actionBreakdown.map((actionRow) => {
                    const allActionHandsSelected =
                      actionRow.handIds.length > 0 &&
                      actionRow.handIds.every((handId) => props.selectedHandIds.has(handId));
                    const someActionHandsSelected = actionRow.handIds.some((handId) =>
                      props.selectedHandIds.has(handId),
                    );

                    return (
                      <TableRow key={actionRow.action}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={allActionHandsSelected}
                            indeterminate={someActionHandsSelected && !allActionHandsSelected}
                            disabled={actionRow.handIds.length === 0}
                            slotProps={{ input: { "aria-label": `Select Hero ${actionRow.action === "Check" ? "X" : "B"} hands` } }}
                            onChange={() => props.onToggleHandIds(actionRow.handIds)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>Hero {actionRow.action === "Check" ? "X" : "B"}</TableCell>
                        <TableCell align="right">{actionRow.hands}</TableCell>
                        <TableCell align="right">{actionRow.winningsBBPer100.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Typography color="text.secondary" variant="body2" sx={{ py: 1.5 }}>
                No turn actions to categorize for this spot.
              </Typography>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
