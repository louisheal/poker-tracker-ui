import { Box, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { PostflopActionSequence, PostflopRunout } from "./dto";
import { PostflopActionSequenceFilter } from "./PostflopActionSequenceFilter";

const filterGroupSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1.5,
} satisfies SxProps<Theme>;

const runoutOptions = [
  { value: "Overcard", label: "Overcard" },
  { value: "FlushCompleting", label: "Flush completing" },
  { value: "Paired", label: "Paired" },
  { value: "Other", label: "Other" },
] satisfies { value: PostflopRunout; label: string }[];

const readRunoutSelection = (value: unknown): PostflopRunout[] =>
  Array.isArray(value)
    ? runoutOptions
        .filter((option) => value.some((selected) => selected === option.value))
        .map((option) => option.value)
    : [];

interface Props {
  runouts: PostflopRunout[];
  actionSequences: PostflopActionSequence[];
  showActionSequence?: boolean;
  onRunoutsChange: (values: PostflopRunout[]) => void;
  onActionSequencesChange: (values: PostflopActionSequence[]) => void;
}

export const TurnFilterSet = (props: Props) => (
  <Box>
    <Typography component="h3" variant="subtitle2" sx={{ mb: 1 }}>
      Turn context
    </Typography>
    <Box sx={filterGroupSx}>
      <FormControl size="small" sx={{ minWidth: 190 }}>
        <InputLabel id="postflop-turn-runouts-label">Turn runout</InputLabel>
        <Select<PostflopRunout[]>
          labelId="postflop-turn-runouts-label"
          multiple
          value={props.runouts}
          label="Turn runout"
          renderValue={(selected) =>
            runoutOptions
              .filter((option) => selected.includes(option.value))
              .map((option) => option.label)
              .join(", ")
          }
          onChange={(event) => props.onRunoutsChange(readRunoutSelection(event.target.value))}
        >
          {runoutOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={props.runouts.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {props.showActionSequence && (
        <PostflopActionSequenceFilter
          id="postflop-turn-action-sequences"
          label="Turn action sequence"
          values={props.actionSequences}
          onChange={props.onActionSequencesChange}
        />
      )}
    </Box>
  </Box>
);
