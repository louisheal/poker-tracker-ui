import { Box } from "@mui/material";
import type { PokerAction, PokerRange } from "../model";

type Props = {
  grid: PokerRange;
  label?: string;
  size?: "default" | "small";
};

const actionColors: Record<PokerAction, { background: string; color: string }> =
  {
    Fold: { background: "#60a5fa", color: "#111827" },
    Call: { background: "#22c55e", color: "#102218" },
    Raise: { background: "#dc2626", color: "#ffffff" },
  };

export const RangeGrid = (props: Props) => (
  <Box
    role="grid"
    aria-label={props.label ?? "Poker hand range"}
    aria-rowcount={props.grid.length}
    sx={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxWidth: props.size === "small" ? 480 : 560,
      aspectRatio: "1 / 1",
      overflow: "hidden",
      border: 1,
      borderColor: "divider",
      borderRadius: 1,
    }}
  >
    {props.grid.map((row, rowIndex) => (
      <Box
        role="row"
        aria-rowindex={rowIndex + 1}
        key={`row-${rowIndex}`}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(13, minmax(0, 1fr))",
          flex: 1,
          minHeight: 0,
        }}
      >
        {row.map(({ HandKey, Action }, columnIndex) => (
          <Box
            role="gridcell"
            aria-colindex={columnIndex + 1}
            aria-label={`${HandKey}: ${Action}`}
            key={HandKey}
            sx={{
              display: "grid",
              placeItems: "center",
              minWidth: 0,
              overflow: "hidden",
              borderRight: 1,
              borderBottom: 1,
              borderColor: "background.default",
              bgcolor: actionColors[Action].background,
              color: actionColors[Action].color,
              fontSize: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
              fontWeight: 600,
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {HandKey}
          </Box>
        ))}
      </Box>
    ))}
  </Box>
);
