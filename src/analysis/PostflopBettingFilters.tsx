import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  ListItemText,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { PostflopPotType, PostflopSeatPosition } from "./dto";

const filtersSx = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 2,
} satisfies SxProps<Theme>;

const pfrPositionOptions = [
  { value: true, label: "IP" },
  { value: false, label: "OOP" },
];

const seatPositionOptions = [
  { value: "", label: "All" },
  { value: "LJ", label: "LJ" },
  { value: "HJ", label: "HJ" },
  { value: "CO", label: "CO" },
  { value: "BTN", label: "BTN" },
  { value: "SB", label: "SB" },
  { value: "BB", label: "BB" },
] satisfies { value: PostflopSeatPosition | ""; label: string }[];

const potTypeOptions = [
  { value: "SingleRaisedPot", label: "SRP" },
  { value: "ThreeBetPot", label: "3Bet" },
  { value: "FourBetPot", label: "4Bet" },
] satisfies { value: PostflopPotType; label: string }[];

const readPotTypeSelection = (value: unknown): PostflopPotType[] =>
  Array.isArray(value)
    ? potTypeOptions
        .filter((option) => value.some((selected) => selected === option.value))
        .map((option) => option.value)
    : [];

interface Props {
  pfrInPosition: boolean | null;
  ipPosition: PostflopSeatPosition | null;
  oopPosition: PostflopSeatPosition | null;
  potTypes: PostflopPotType[];
  onPfrInPositionChange: (value: boolean | null) => void;
  onIpPositionChange: (value: PostflopSeatPosition | null) => void;
  onOopPositionChange: (value: PostflopSeatPosition | null) => void;
  onPotTypesChange: (value: PostflopPotType[]) => void;
}

export const PostflopBettingFilters = (props: Props) => (
  <Box sx={filtersSx}>
    <Box component="fieldset" sx={{ border: 0, m: 0, p: 0, display: "flex", alignItems: "center", gap: 1 }}>
      {/* <FormLabel component="legend">PFR position</FormLabel> */}
      <ToggleButtonGroup
        size="small"
        exclusive
        value={props.pfrInPosition}
        aria-label="PFR position"
        onChange={(_event, value: boolean | null) => props.onPfrInPositionChange(value)}
      >
        {pfrPositionOptions.map((option) => (
          <ToggleButton key={option.label} value={option.value} aria-label={option.label}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="postflop-ip-position-label">IP seat</InputLabel>
      <Select<PostflopSeatPosition | "">
        labelId="postflop-ip-position-label"
        value={props.ipPosition ?? ""}
        label="IP seat"
        onChange={(event) => props.onIpPositionChange(event.target.value === "" ? null : event.target.value)}
      >
        {seatPositionOptions.map((option) => (
          <MenuItem key={option.value || "All"} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="postflop-oop-position-label">OOP seat</InputLabel>
      <Select<PostflopSeatPosition | "">
        labelId="postflop-oop-position-label"
        value={props.oopPosition ?? ""}
        label="OOP seat"
        onChange={(event) => props.onOopPositionChange(event.target.value === "" ? null : event.target.value)}
      >
        {seatPositionOptions.map((option) => (
          <MenuItem key={option.value || "All"} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel id="postflop-pot-types-label">Pot type</InputLabel>
      <Select<PostflopPotType[]>
        labelId="postflop-pot-types-label"
        multiple
        value={props.potTypes}
        label="Pot type"
        renderValue={(selected) =>
          potTypeOptions
            .filter((option) => selected.includes(option.value))
            .map((option) => option.label)
            .join(", ")
        }
        onChange={(event) => props.onPotTypesChange(readPotTypeSelection(event.target.value))}
      >
        {potTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={props.potTypes.includes(option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);
