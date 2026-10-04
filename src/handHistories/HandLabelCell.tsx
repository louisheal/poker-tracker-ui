import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import type { HandLabelAssignment, HandLabelOption, HandLabelStreet, HandLabelsByStreet } from "../api";
import { handLabelStreets } from "../api";
import { replaceHandLabels } from "../api";
import type { HandHistory } from "./HandHistoryView";
import { getHandLabelColor } from "./handLabelStyles";

interface Props {
  hand: HandHistory;
  street: HandLabelStreet;
  labelOptions: readonly HandLabelOption[];
  onLabelsChanged: (handId: string, labels: HandLabelAssignment[]) => void;
  onError: (message: string) => void;
}

export const HandLabelCell = (props: Props) => {
  const [labels, setLabels] = useState(props.hand.labels);
  const [isSaving, setIsSaving] = useState(false);

  const saveLabels = async (selectedOptions: HandLabelOption[]) => {
    const previousLabels = labels;
    const nextLabels = [
      ...labels.filter((label) => label.street !== props.street),
      ...selectedOptions.map((option) => ({ street: props.street, label: option.value })),
    ];
    const labelsByStreet = Object.fromEntries(
      handLabelStreets.map((street) => [
        street,
        nextLabels.filter((label) => label.street === street).map((label) => label.label),
      ]),
    ) as HandLabelsByStreet;
    setLabels(nextLabels);
    setIsSaving(true);

    try {
      const savedLabels = await replaceHandLabels(props.hand.handId, labelsByStreet);
      setLabels(savedLabels);
      props.onLabelsChanged(props.hand.handId, savedLabels);
    } catch (error) {
      setLabels(previousLabels);
      props.onError(error instanceof Error ? error.message : "Labels could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      disabled={isSaving}
      options={props.labelOptions}
      value={props.labelOptions.filter((option) =>
        labels.some((label) => label.street === props.street && label.label === option.value),
      )}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      onChange={(_, selectedOptions) => {
        void saveLabels(selectedOptions);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          aria-label={`${props.street} labels for hand ${props.hand.handId}`}
          placeholder={`Add ${props.street.toLowerCase()} label`}
          size="small"
        />
      )}
      renderOption={(optionProps, option) => (
        <li {...optionProps}>
          <Chip
            label={option.category}
            size="small"
            sx={{ bgcolor: getHandLabelColor(option.category), color: "common.white", mr: 1 }}
          />
          {option.name}
        </li>
      )}
      renderValue={(selectedOptions, getItemProps) =>
        selectedOptions.map((option, index) => {
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
        })
      }
      sx={{ width: "100%", minWidth: 0 }}
    />
  );
};
