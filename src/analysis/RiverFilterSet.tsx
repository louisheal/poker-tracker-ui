import { Box, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { PostflopRunout, RiverBetSizeCategory } from "./dto";

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

const betSizeCategoryOptions = [
  { value: "Small", label: "Small (<40%)" },
  { value: "Medium", label: "Medium (40-<70%)" },
  { value: "Large", label: "Large (70-100%)" },
  { value: "Overbet", label: "Overbet (>100%)" },
] satisfies { value: RiverBetSizeCategory; label: string }[];

const readRunoutSelection = (value: unknown): PostflopRunout[] =>
  Array.isArray(value)
    ? runoutOptions
        .filter((option) => value.some((selected) => selected === option.value))
        .map((option) => option.value)
    : [];

interface Props {
  runouts: PostflopRunout[];
  betSizeCategory: RiverBetSizeCategory | null;
  onRunoutsChange: (values: PostflopRunout[]) => void;
  onBetSizeCategoryChange: (value: RiverBetSizeCategory | null) => void;
}

export const RiverFilterSet = (props: Props) => (
  <Box>
    <Typography component="h3" variant="subtitle2" sx={{ mb: 1 }}>
      River context
    </Typography>
    <Box sx={filterGroupSx}>
      <FormControl size="small" sx={{ minWidth: 190 }}>
        <InputLabel id="postflop-river-runouts-label">River runout</InputLabel>
        <Select<PostflopRunout[]>
          labelId="postflop-river-runouts-label"
          multiple
          value={props.runouts}
          label="River runout"
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
      <FormControl size="small" sx={{ minWidth: 190 }}>
        <InputLabel id="postflop-river-bet-size-category-label">River bet size</InputLabel>
        <Select<RiverBetSizeCategory | "">
          labelId="postflop-river-bet-size-category-label"
          value={props.betSizeCategory ?? ""}
          label="River bet size"
          onChange={(event) => props.onBetSizeCategoryChange(event.target.value === "" ? null : event.target.value)}
        >
          <MenuItem value="">All sizes</MenuItem>
          {betSizeCategoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  </Box>
);
