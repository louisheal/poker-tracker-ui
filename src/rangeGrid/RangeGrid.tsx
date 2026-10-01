import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { getHandKeysByRow } from "./handGrid";
import { rangeActionColors } from "./actionColors";
import type { HandActions } from "../model";

type Props = {
  hands: readonly HandActions[];
  label?: string;
  size?: "default" | "small";
};

const getRangeGridSx = (size: Props["size"]) =>
  ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: size === "small" ? 480 : 560,
    aspectRatio: "1 / 1",
    overflow: "hidden",
    border: 1,
    borderColor: "divider",
    borderRadius: 1,
  }) satisfies SxProps<Theme>;

const rangeGridRowSx = {
  display: "grid",
  gridTemplateColumns: "repeat(13, minmax(0, 1fr))",
  flex: 1,
  minHeight: 0,
} satisfies SxProps<Theme>;

const getRangeCellSx = (background: string) =>
  ({
    display: "grid",
    placeItems: "center",
    minWidth: 0,
    overflow: "hidden",
    borderRight: 1,
    borderBottom: 1,
    borderColor: "background.default",
    background,
    color: "#ffffff",
    fontSize: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
    fontWeight: 600,
    lineHeight: 1,
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
    userSelect: "none",
  }) satisfies SxProps<Theme>;

export const RangeGrid = (props: Props) => {
  const handsByKey = new Map(props.hands.map((hand) => [hand.handKey, hand]));
  const handKeys = getHandKeysByRow();

  return (
    <Box
      role="grid"
      aria-label={props.label ?? "Poker hand range"}
      aria-rowcount={handKeys.length}
      sx={getRangeGridSx(props.size)}
    >
      {handKeys.map((row, rowIndex) => (
        <Box role="row" aria-rowindex={rowIndex + 1} key={`row-${rowIndex}`} sx={rangeGridRowSx}>
          {row.map((handKey, columnIndex) => {
            const hand = handsByKey.get(handKey);
            const segments = hand
              ? [
                  { action: "Fold" as const, percentage: hand.fold },
                  { action: "Call" as const, percentage: hand.call },
                  { action: "Raise" as const, percentage: hand.raise },
                ].filter((segment) => segment.percentage > 0)
              : [];
            let start = 0;
            const gradientStops = segments.map((segment, index) => {
              const end = index === segments.length - 1 ? 100 : Math.min(100, start + segment.percentage * 100);
              const stop = `${rangeActionColors[segment.action]} ${start}% ${end}%`;
              start = end;
              return stop;
            });
            const actionLabel = segments
              .map(({ action, percentage }) => `${action} ${Math.round(percentage * 100)}%`)
              .join(", ");

            return (
              <Box
                role="gridcell"
                aria-colindex={columnIndex + 1}
                aria-label={actionLabel.length > 0 ? `${handKey}: ${actionLabel}` : `${handKey}: no observations`}
                key={handKey}
                sx={getRangeCellSx(
                  gradientStops.length > 0 ? `linear-gradient(90deg, ${gradientStops.join(", ")})` : "#383c42",
                )}
              >
                {handKey}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};
