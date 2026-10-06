import { Box, Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { WinrateHandBatchPointDto } from "./dto";
import { DailyWinningsChartLegend } from "./DailyWinningsChartLegend";

const chartFrameSx = {
  p: { xs: 1.5, sm: 2.5 },
  border: 1,
  borderColor: "divider",
  borderRadius: 1,
  bgcolor: "background.paper",
} satisfies SxProps<Theme>;

const chartColors = {
  net: "#00ff00",
  showdown: "#1a7dff",
  nonShowdown: "#ff0000",
};

const chartSeries = [
  { key: "netWinningsBB", label: "Net winnings", color: chartColors.net },
  {
    key: "withShowdownWinningsBB",
    label: "With showdown",
    color: chartColors.showdown,
  },
  {
    key: "withoutShowdownWinningsBB",
    label: "Without showdown",
    color: chartColors.nonShowdown,
  },
] as const;

type ChartSeriesKey = (typeof chartSeries)[number]["key"];

interface Props {
  points: WinrateHandBatchPointDto[];
}

export const DailyWinningsChart = (props: Props) => {
  const width = 960;
  const height = 400;
  const plotLeft = 68;
  const plotRight = 940;
  const plotTop = 24;
  const plotBottom = 344;
  const allValues = props.points.flatMap((point) => chartSeries.map((series) => point[series.key]));
  let minimum = Math.min(0, ...allValues);
  let maximum = Math.max(0, ...allValues);
  const valueRange = maximum - minimum || 1;
  minimum -= valueRange * 0.08;
  maximum += valueRange * 0.08;

  const xForIndex = (index: number) =>
    props.points.length === 1
      ? (plotLeft + plotRight) / 2
      : plotLeft + (index / (props.points.length - 1)) * (plotRight - plotLeft);
  const yForValue = (value: number) => plotTop + ((maximum - value) / (maximum - minimum)) * (plotBottom - plotTop);
  const yTicks = Array.from({ length: 5 }, (_, index) => maximum - (index / 4) * (maximum - minimum));
  const xTickIndices = [
    ...new Set(Array.from({ length: 5 }, (_, index) => Math.round((index / 4) * (props.points.length - 1)))),
  ];

  const buildPath = (key: ChartSeriesKey) =>
    props.points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${xForIndex(index)} ${yForValue(point[key])}`)
      .join(" ");

  return (
    <Paper component="section" elevation={0} sx={chartFrameSx}>
      <DailyWinningsChartLegend series={chartSeries} />
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Cumulative winnings in big blinds by number of hands"
          style={{ display: "block", width: "100%", height: "auto" }}
        >
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={plotLeft}
                x2={plotRight}
                y1={yForValue(tick)}
                y2={yForValue(tick)}
                stroke="#444950"
                strokeDasharray="3 6"
              />
              <text x={plotLeft - 12} y={yForValue(tick) + 4} textAnchor="end" fill="#a4a8ae" fontSize="12">
                {tick.toFixed(1)}
              </text>
            </g>
          ))}
          <line x1={plotLeft} x2={plotRight} y1={yForValue(0)} y2={yForValue(0)} stroke="#81868d" strokeWidth="1.5" />
          {chartSeries.map((series) => (
            <path
              key={series.key}
              d={buildPath(series.key)}
              fill="none"
              stroke={series.color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <title>{series.label}</title>
            </path>
          ))}
          {xTickIndices.map((index) => {
            const point = props.points[index];
            if (point === undefined) return null;

            return (
              <text
                key={point.handCount}
                x={xForIndex(index)}
                y={plotBottom + 28}
                textAnchor="middle"
                fill="#a4a8ae"
                fontSize="12"
              >
                {point.handCount}
              </text>
            );
          })}
          <text x={plotLeft} y={height - 4} fill="#a4a8ae" fontSize="11">
            BB
          </text>
        </svg>
      </Box>
    </Paper>
  );
};
