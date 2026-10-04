import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from "@mui/material";
import type { HandLabelAssignment, HandLabelOption, HandLabelsByStreet } from "../api";
import { handLabelStreets } from "../api";
import { replaceHandLabels } from "../api";
import { getHandLabelColor } from "./handLabelStyles";

const categoryOrder = ["Red", "Blue", "Green", "Purple"];

const toLabelsByStreet = (labels: readonly HandLabelAssignment[]): HandLabelsByStreet =>
  Object.fromEntries(
    handLabelStreets.map((street) => [
      street,
      labels.filter((label) => label.street === street).map((label) => label.label),
    ]),
  ) as HandLabelsByStreet;

interface Props {
  handId: string;
  labels: HandLabelAssignment[];
  labelOptions: readonly HandLabelOption[];
  onLabelsChanged: (handId: string, labels: HandLabelAssignment[]) => void;
}

export const HandLabelEditor = (props: Props) => {
  const [selectedLabelsByStreet, setSelectedLabelsByStreet] = useState(() => toLabelsByStreet(props.labels));
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const originalLabelsByStreet = toLabelsByStreet(props.labels);
  const labelsAreUnchanged = handLabelStreets.every(
    (street) =>
      originalLabelsByStreet[street].every((label) => selectedLabelsByStreet[street].includes(label)) &&
      selectedLabelsByStreet[street].every((label) => originalLabelsByStreet[street].includes(label)),
  );

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaved(false);

    try {
      const labels = await replaceHandLabels(props.handId, selectedLabelsByStreet);
      setSelectedLabelsByStreet(toLabelsByStreet(labels));
      setSaved(true);
      props.onLabelsChanged(props.handId, labels);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Labels could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack spacing={1.5}>
      {handLabelStreets.map((street) => (
        <FormControl key={street} fullWidth size="small">
          <InputLabel id={`hand-labels-${street}-label`}>{street}</InputLabel>
          <Select
            labelId={`hand-labels-${street}-label`}
            multiple
            value={selectedLabelsByStreet[street]}
            onChange={(event) => {
              const value = event.target.value;
              const labels = typeof value === "string" ? value.split(",") : value;
              setSelectedLabelsByStreet((current) => ({ ...current, [street]: labels }));
              setSaved(false);
            }}
            input={<OutlinedInput label={street} />}
            renderValue={(values) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {values.map((value) => {
                  const option = props.labelOptions.find((label) => label.value === value);
                  return (
                    <Box
                      key={value}
                      component="span"
                      sx={{
                        bgcolor: getHandLabelColor(option?.category ?? ""),
                        color: "common.white",
                        borderRadius: 1,
                        px: 1,
                        py: 0.25,
                        fontSize: "0.75rem",
                      }}
                    >
                      {option?.name ?? value}
                    </Box>
                  );
                })}
              </Box>
            )}
          >
            {categoryOrder.flatMap((category) => [
              <ListSubheader key={`${street}-${category}-header`}>{category}</ListSubheader>,
              ...props.labelOptions
                .filter((option) => option.category === category)
                .map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                      checked={selectedLabelsByStreet[street].includes(option.value)}
                      sx={{
                        color: getHandLabelColor(category),
                        "&.Mui-checked": { color: getHandLabelColor(category) },
                      }}
                    />
                    <ListItemText primary={option.name} />
                  </MenuItem>
                )),
            ])}
          </Select>
        </FormControl>
      ))}
      <Box>
        <Button
          startIcon={<SaveIcon />}
          disabled={isSaving || labelsAreUnchanged}
          onClick={() => void handleSave()}
          variant="contained"
          size="small"
        >
          {isSaving ? "Saving..." : "Save labels"}
        </Button>
      </Box>
      {errorMessage !== null && <Alert severity="error">{errorMessage}</Alert>}
      {saved && <Alert severity="success">Labels saved.</Alert>}
    </Stack>
  );
};
