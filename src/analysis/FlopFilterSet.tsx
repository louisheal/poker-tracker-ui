import { Box, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { PostflopActionSequence, PostflopFlopHighCard, PostflopFlopRankTexture, PostflopFlopTexture } from "./dto";
import { PostflopActionSequenceFilter } from "./PostflopActionSequenceFilter";

const filterGroupSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1.5,
} satisfies SxProps<Theme>;

const flopHighCardOptions = [
  { value: "", label: "All" },
  { value: "Ace", label: "A" },
  { value: "King", label: "K" },
  { value: "Queen", label: "Q" },
  { value: "Jack", label: "J" },
  { value: "Ten", label: "T" },
  { value: "Nine", label: "9" },
  { value: "Eight", label: "8" },
  { value: "Seven", label: "7" },
  { value: "Six", label: "6" },
  { value: "Five", label: "5" },
  { value: "Four", label: "4" },
  { value: "Three", label: "3" },
  { value: "Two", label: "2" },
] satisfies { value: PostflopFlopHighCard | ""; label: string }[];

const flopTextureOptions = [
  { value: "Monotone", label: "Monotone" },
  { value: "TwoTone", label: "TwoTone" },
  { value: "Rainbow", label: "Rainbow" },
] satisfies { value: PostflopFlopTexture; label: string }[];

const flopRankTextureOptions = [
  { value: "Trips", label: "Trips" },
  { value: "Paired", label: "Paired" },
  { value: "Unpaired", label: "Unpaired" },
] satisfies { value: PostflopFlopRankTexture; label: string }[];

type FlopTextureSelectionValue = PostflopFlopTexture | "All";

const readFlopTextureSelection = (value: unknown): PostflopFlopTexture[] =>
  Array.isArray(value) && !value.includes("All")
    ? flopTextureOptions
        .filter((option) => value.some((selected) => selected === option.value))
        .map((option) => option.value)
    : [];

const readFlopRankTextureSelection = (value: unknown): PostflopFlopRankTexture[] =>
  Array.isArray(value)
    ? flopRankTextureOptions
        .filter((option) => value.some((selected) => selected === option.value))
        .map((option) => option.value)
    : [];

interface Props {
  highCard: PostflopFlopHighCard | null;
  textures: PostflopFlopTexture[];
  rankTextures: PostflopFlopRankTexture[];
  actionSequences: PostflopActionSequence[];
  showActionSequence?: boolean;
  onHighCardChange: (value: PostflopFlopHighCard | null) => void;
  onTexturesChange: (values: PostflopFlopTexture[]) => void;
  onRankTexturesChange: (values: PostflopFlopRankTexture[]) => void;
  onActionSequencesChange: (values: PostflopActionSequence[]) => void;
}

export const FlopFilterSet = (props: Props) => (
  <Box>
    <Typography component="h3" variant="subtitle2" sx={{ mb: 1 }}>
      Flop context
    </Typography>
    <Box sx={filterGroupSx}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="postflop-flop-high-card-label">Flop high card</InputLabel>
        <Select<PostflopFlopHighCard | "">
          labelId="postflop-flop-high-card-label"
          value={props.highCard ?? ""}
          label="Flop high card"
          onChange={(event) => props.onHighCardChange(event.target.value === "" ? null : event.target.value)}
        >
          {flopHighCardOptions.map((option) => (
            <MenuItem key={option.value || "All"} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 170 }}>
        <InputLabel id="postflop-flop-textures-label">Flop texture</InputLabel>
        <Select<FlopTextureSelectionValue[]>
          labelId="postflop-flop-textures-label"
          multiple
          value={props.textures}
          label="Flop texture"
          renderValue={(selected) =>
            selected.length === 0 || selected.includes("All")
              ? "All"
              : flopTextureOptions
                  .filter((option) => selected.includes(option.value))
                  .map((option) => option.label)
                  .join(", ")
          }
          onChange={(event) => props.onTexturesChange(readFlopTextureSelection(event.target.value))}
        >
          <MenuItem value="All">
            <Checkbox checked={props.textures.length === 0} />
            <ListItemText primary="All" />
          </MenuItem>
          {flopTextureOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={props.textures.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 190 }}>
        <InputLabel id="postflop-flop-rank-textures-label">Flop rank texture</InputLabel>
        <Select<PostflopFlopRankTexture[]>
          labelId="postflop-flop-rank-textures-label"
          multiple
          value={props.rankTextures}
          label="Flop rank texture"
          renderValue={(selected) =>
            flopRankTextureOptions
              .filter((option) => selected.includes(option.value))
              .map((option) => option.label)
              .join(", ")
          }
          onChange={(event) => props.onRankTexturesChange(readFlopRankTextureSelection(event.target.value))}
        >
          {flopRankTextureOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={props.rankTextures.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {props.showActionSequence && (
        <PostflopActionSequenceFilter
          id="postflop-flop-action-sequences"
          label="Flop action sequence"
          values={props.actionSequences}
          onChange={props.onActionSequencesChange}
        />
      )}
    </Box>
  </Box>
);
