import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from "@mui/material";
import type { PostflopActionSequence } from "./dto";

const actionSequenceOptions = [
  { value: "XX", label: "XX" },
  { value: "XBC", label: "XBC" },
  { value: "XBRC", label: "XBRC" },
  { value: "BC", label: "BC" },
] satisfies { value: PostflopActionSequence; label: string }[];

const readSelection = (value: unknown): PostflopActionSequence[] =>
  Array.isArray(value)
    ? actionSequenceOptions
        .filter((option) => value.some((selected) => selected === option.value))
        .map((option) => option.value)
    : [];

interface Props {
  id: string;
  label: string;
  values: PostflopActionSequence[];
  onChange: (values: PostflopActionSequence[]) => void;
}

export const PostflopActionSequenceFilter = (props: Props) => (
  <FormControl size="small" sx={{ minWidth: 190 }}>
    <InputLabel id={`${props.id}-label`}>{props.label}</InputLabel>
    <Select<PostflopActionSequence[]>
      labelId={`${props.id}-label`}
      multiple
      value={props.values}
      label={props.label}
      renderValue={(selected) =>
        actionSequenceOptions
          .filter((option) => selected.includes(option.value))
          .map((option) => option.label)
          .join(", ")
      }
      onChange={(event) => props.onChange(readSelection(event.target.value))}
    >
      {actionSequenceOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Checkbox checked={props.values.includes(option.value)} />
          <ListItemText primary={option.label} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
