import { Box, Paper, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import type { PostflopBetResponseBucketDto, PostflopBetResponseStreet } from "./dto";
import { getPostflopBetResponseChartData } from "./riverBetResponseChartData";

const chartFrameSx = {
  minWidth: 0,
  p: { xs: 1.5, sm: 2 },
  borderRadius: 1,
  bgcolor: "background.paper",
} satisfies SxProps<Theme>;

const chartPalette = {
  observed: "#54c7c3",
  breakeven: "#f0ad4e",
  grid: "#555b63",
  labels: "#a4a8ae",
  volume: "#ffffff",
};

interface Props {
  buckets: PostflopBetResponseBucketDto[];
  line: PostflopBetResponseBucketDto["line"];
  street: PostflopBetResponseStreet;
}

export const RiverBetResponseChart = (props: Props) => {
  const isWideChart = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);
  const width = isWideChart ? 760 : 360;
  const height = isWideChart ? 410 : 470;
  const plotLeft = isWideChart ? 58 : 44;
  const plotRight = width - (isWideChart ? 68 : 64);
  const plotTop = 28;
  const plotBottom = isWideChart ? 330 : 390;
  const chartData = getPostflopBetResponseChartData(props.buckets, props.line);
  const volumeBarWidth = Math.min(
    (isWideChart ? 12 : 6) + 2,
    (plotRight - plotLeft) / Math.max(1, chartData.length - 1),
  );
  const volumeMaximum = Math.max(1, ...chartData.map((point) => point.opportunityCount));
  const volumeTickCount = Math.min(4, volumeMaximum);
  const chartId = `${props.street.toLowerCase()}-bet-response-${props.line.toLowerCase()}`;
  const titleId = `${chartId}-chart-title`;
  const descriptionId = `${chartId}-chart-description`;
  const xForIndex = (index: number) => plotLeft + (index / (chartData.length - 1)) * (plotRight - plotLeft);
  const yForPercent = (value: number) => plotTop + ((100 - value) / 100) * (plotBottom - plotTop);
  const yForOpportunityCount = (count: number) => plotBottom - (count / volumeMaximum) * (plotBottom - plotTop);
  const breakevenPath = chartData
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xForIndex(index)} ${yForPercent(point.breakevenPercent)}`)
    .join(" ");
  const observedPath = chartData
    .flatMap((point, index) => {
      if (point.foldRatePercent === null) {
        return [];
      }
      const previousPoint = chartData[index - 1];
      const command = previousPoint?.foldRatePercent === null || previousPoint === undefined ? "M" : "L";
      return [`${command} ${xForIndex(index)} ${yForPercent(point.foldRatePercent)}`];
    })
    .join(" ");

  return (
    <Paper component="section" variant="outlined" sx={chartFrameSx}>
      <Typography component="h4" variant="subtitle1" sx={{ fontWeight: 600 }}>
        {props.line === "BF" ? "BF (Bet-Fold)" : "XBF (Check-Bet-Fold)"}
      </Typography>
      <Box sx={{ width: "100%", minWidth: 0 }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          style={{ display: "block", width: "100%", height: "auto" }}
        >
          <title id={titleId}>
            {props.street} {props.line} fold rate and breakeven by bet size
          </title>
          <desc id={descriptionId}>
            The x-axis shows cumulative bet-to-pot thresholds from 10% to 300% in 10% steps. The left y-axis shows
            population fold rate; gaps indicate thresholds with no opportunities. The dashed amber line shows
            theoretical breakeven fold rate. Neutral bars behind the lines show cumulative population response
            opportunities on the independent right y-axis scale for this chart.
          </desc>
          {chartData.map((point, index) => {
            return (
              <rect
                key={`volume-${point.betSizeThresholdPercent}`}
                x={xForIndex(index) - volumeBarWidth / 2}
                y={yForOpportunityCount(point.opportunityCount)}
                width={volumeBarWidth}
                height={plotBottom - yForOpportunityCount(point.opportunityCount)}
                fill={chartPalette.volume}
                opacity="0.06"
                tabIndex={0}
                role="img"
                aria-label={`${point.betSizeThresholdPercent}% threshold: ${point.opportunityCount.toLocaleString()} cumulative opportunities`}
                onFocus={() => setSelectedOpportunity(index)}
                onClick={() => setSelectedOpportunity(index)}
              />
            );
          })}
          <text x={plotLeft} y={15} textAnchor="start" fill={chartPalette.labels} fontSize={isWideChart ? "10" : "9"}>
            Fold rate (%)
          </text>
          <text x={width - 4} y={15} textAnchor="end" fill={chartPalette.labels} fontSize={isWideChart ? "10" : "9"}>
            Cumulative opportunities
          </text>
          {[0, 25, 50, 75, 100].map((tick) => (
            <g key={tick}>
              <line
                x1={plotLeft}
                x2={plotRight}
                y1={yForPercent(tick)}
                y2={yForPercent(tick)}
                stroke={chartPalette.grid}
                strokeDasharray="3 6"
              />
              <text
                x={plotLeft - 10}
                y={yForPercent(tick) + 4}
                textAnchor="end"
                fill={chartPalette.labels}
                fontSize="11"
              >
                {tick}%
              </text>
            </g>
          ))}
          <line x1={plotRight} x2={plotRight} y1={plotTop} y2={plotBottom} stroke={chartPalette.labels} />
          {Array.from({ length: volumeTickCount + 1 }, (_, tickIndex) => {
            const count = Math.round((volumeMaximum * tickIndex) / volumeTickCount);
            const y = plotBottom - (tickIndex / volumeTickCount) * (plotBottom - plotTop);
            return (
              <g key={`volume-tick-${count}`}>
                <line x1={plotRight} x2={plotRight + 4} y1={y} y2={y} stroke={chartPalette.labels} />
                <text
                  x={plotRight + 7}
                  y={y + 4}
                  textAnchor="start"
                  fill={chartPalette.labels}
                  fontSize={isWideChart ? "10" : "9"}
                >
                  {new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(count)}
                </text>
              </g>
            );
          })}
          <path
            d={breakevenPath}
            fill="none"
            stroke={chartPalette.breakeven}
            strokeWidth="2.5"
            strokeDasharray="7 5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {chartData.map((point, index) => {
            const x = xForIndex(index);
            const y = yForPercent(point.breakevenPercent);
            return (
              <polygon
                key={`breakeven-${point.betSizeThresholdPercent}`}
                points={`${x},${y - 3.5} ${x + 3.5},${y} ${x},${y + 3.5} ${x - 3.5},${y}`}
                fill={chartPalette.breakeven}
              >
                <title>
                  {point.betSizeThresholdPercent}% threshold breakeven: {point.breakevenPercent.toFixed(1)}%
                </title>
              </polygon>
            );
          })}
          <path
            d={observedPath}
            fill="none"
            stroke={chartPalette.observed}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {chartData.map((point, index) =>
            point.foldRatePercent === null ? null : (
              <circle
                key={`observed-${point.betSizeThresholdPercent}`}
                cx={xForIndex(index)}
                cy={yForPercent(point.foldRatePercent)}
                r="3.5"
                fill={chartPalette.observed}
              >
                <title>
                  {point.betSizeThresholdPercent}% threshold observed fold rate: {point.foldRatePercent.toFixed(1)}%
                </title>
              </circle>
            ),
          )}
          {chartData.map((point, index) => (
            <g key={`threshold-${point.betSizeThresholdPercent}`}>
              <line
                x1={xForIndex(index)}
                x2={xForIndex(index)}
                y1={plotBottom}
                y2={plotBottom + 4}
                stroke={chartPalette.labels}
              />
              {(isWideChart ||
                point.betSizeThresholdPercent === 10 ||
                point.betSizeThresholdPercent % 50 === 0 ||
                point.betSizeThresholdPercent === 300) && (
                <text
                  x={xForIndex(index)}
                  y={plotBottom + 17}
                  textAnchor="middle"
                  fill={chartPalette.labels}
                  fontSize={isWideChart ? "9" : "11"}
                >
                  {point.betSizeThresholdPercent}%
                </text>
              )}
            </g>
          ))}
          <text
            x={(plotLeft + plotRight) / 2}
            y={height - 10}
            textAnchor="middle"
            fill={chartPalette.labels}
            fontSize="12"
          >
            Bet size to pot (%)
          </text>
        </svg>
      </Box>
      <Box
        component="table"
        aria-label={`${props.street} ${props.line} cumulative opportunity counts by threshold`}
        sx={{
          position: "absolute",
          width: "1px",
          height: "1px",
          p: 0,
          m: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        <thead>
          <tr>
            <th scope="col">Bet size threshold</th>
            <th scope="col">Cumulative opportunities</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((point) => (
            <tr key={`accessible-volume-${point.betSizeThresholdPercent}`}>
              <th scope="row">{point.betSizeThresholdPercent}%</th>
              <td>{point.opportunityCount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box component="span" sx={{ width: 20, borderTop: `2px solid ${chartPalette.observed}` }} />
          <Typography variant="caption">Observed fold rate</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box component="span" sx={{ width: 20, borderTop: `2px dashed ${chartPalette.breakeven}` }} />
          <Typography variant="caption">Breakeven (theoretical)</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box component="span" sx={{ width: 12, height: 8, bgcolor: chartPalette.volume, opacity: 0.8 }} />
          <Typography variant="caption">Cumulative opportunities (right axis)</Typography>
        </Box>
      </Box>
      {selectedOpportunity !== null && (
        <Typography variant="caption" aria-live="polite" sx={{ display: "block", mt: 0.5 }}>
          {chartData[selectedOpportunity]?.betSizeThresholdPercent}% threshold:{" "}
          {chartData[selectedOpportunity]?.opportunityCount.toLocaleString()} cumulative opportunities
        </Typography>
      )}
    </Paper>
  );
};
