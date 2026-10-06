import { Box, Paper, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

const centerX = 100;
const centerY = 100;
const radius = 80;
const needleLength = 68;

const dialSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  p: 2,
} satisfies SxProps<Theme>;

const svgSx = {
  color: "primary.main",
  width: "100%",
  maxWidth: 260,
} satisfies SxProps<Theme>;

const pointOnDial = (fraction: number, distance: number) => {
  const angle = Math.PI * (1 - fraction);
  return {
    x: centerX + distance * Math.cos(angle),
    y: centerY - distance * Math.sin(angle),
  };
};

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  decimals?: number;
  suffix?: string;
}

export const MetricSpeedDial = (props: Props) => {
  const fraction = Math.min(1, Math.max(0, (props.value - props.min) / (props.max - props.min)));
  const valueEnd = pointOnDial(fraction, radius);
  const needleTip = pointOnDial(fraction, needleLength);
  const trackPath = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`;
  const valuePath = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${valueEnd.x} ${valueEnd.y}`;
  const formattedValue = `${props.value.toFixed(props.decimals ?? 1)}${props.suffix ?? ""}`;

  return (
    <Paper variant="outlined" sx={dialSx}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {props.label}
      </Typography>
      <Box component="svg" viewBox="0 0 200 120" role="img" aria-label={`${props.label}: ${formattedValue}`} sx={svgSx}>
        <path
          d={trackPath}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path d={valuePath} fill="none" stroke="currentColor" strokeWidth={14} strokeLinecap="round" />
        <line
          x1={centerX}
          y1={centerY}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={centerX} cy={centerY} r={6} fill="currentColor" />
        <text
          x={centerX - radius}
          y={centerY + 16}
          textAnchor="middle"
          fontSize={10}
          fill="currentColor"
          fillOpacity={0.6}
        >
          {props.min}
        </text>
        <text
          x={centerX + radius}
          y={centerY + 16}
          textAnchor="middle"
          fontSize={10}
          fill="currentColor"
          fillOpacity={0.6}
        >
          {props.max}
        </text>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {formattedValue}
      </Typography>
    </Paper>
  );
};
