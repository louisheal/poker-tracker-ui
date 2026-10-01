import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { PokerPosition } from "../../model";

const positionSelectSx = {
  minWidth: 170,
} satisfies SxProps<Theme>;

interface Props {
  id: string;
  label: string;
  value: PokerPosition;
  options: PokerPosition[];
  onChange: (event: SelectChangeEvent<PokerPosition>) => void;
}

export const PositionSelector = (props: Props) => {
  return (
    <FormControl size="small" sx={positionSelectSx}>
      <InputLabel id={props.id}>{props.label}</InputLabel>
      <Select labelId={props.id} value={props.value} label={props.label} onChange={props.onChange}>
        {props.options.map((position) => (
          <MenuItem key={position} value={position}>
            {position}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
