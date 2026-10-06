import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { Box, FormControlLabel, Switch } from "@mui/material";
import type { HandLabelOption } from "../api";
import { getHandLabelColor } from "./handLabelStyles";

const unlabelledFilterValue = "__unlabelled__";

interface Props {
  labelOptions: readonly HandLabelOption[];
  selectedLabelFilters: readonly string[];
  onLabelFiltersChanged: (labels: string[]) => void;
  flaggedOnly: boolean;
  onFlaggedOnlyChanged: (flaggedOnly: boolean) => void;
}

export const HandHistoryFilters = (props: Props) => {
  const options = [...props.labelOptions, { value: unlabelledFilterValue, name: "Unlabelled", category: "No labels" }];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "min(100%, 560px)" }}>
      <Autocomplete
        sx={{ flex: "1 1 auto", minWidth: 0 }}
        multiple
        options={options}
        value={options.filter((option) => props.selectedLabelFilters.includes(option.value))}
        groupBy={(option) => option.category}
        getOptionLabel={(option) => option.name}
        onChange={(_, selectedOptions) => props.onLabelFiltersChanged(selectedOptions.map((option) => option.value))}
        renderInput={(params) => <TextField {...params} label="Filter by labels" />}
        renderOption={(optionProps, option) => (
          <li {...optionProps}>
            {option.value !== unlabelledFilterValue && (
              <Chip
                label={option.category}
                size="small"
                sx={{ bgcolor: getHandLabelColor(option.category), color: "common.white", mr: 1 }}
              />
            )}
            {option.name}
          </li>
        )}
        renderValue={(selectedOptions, getItemProps) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selectedOptions.map((option, index) => {
              const { key, ...itemProps } = getItemProps({ index });
              return (
                <Chip
                  key={key}
                  label={option.name}
                  size="small"
                  {...itemProps}
                  sx={{ bgcolor: getHandLabelColor(option.category), color: "common.white" }}
                />
              );
            })}
          </Box>
        )}
      />
      <FormControlLabel
        control={<Switch checked={props.flaggedOnly} onChange={(_, checked) => props.onFlaggedOnlyChanged(checked)} />}
        label="Flagged only"
      />
    </Box>
  );
};
