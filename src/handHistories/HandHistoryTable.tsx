import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { HandHistoryRow } from "./HandHistoryRow";

export interface HandHistoryTableProps {
  handIds: readonly string[];
  isLoading?: boolean;
}

export const HandHistoryTable = ({
  handIds,
  isLoading = false,
}: HandHistoryTableProps) => {
  return (
    <Paper
      component="section"
      aria-label="Hand histories"
      elevation={0}
      sx={{
        width: "min(100%, 560px)",
        minHeight: 196,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      {isLoading ? (
        <Box role="status" sx={{ px: 3, py: 5, textAlign: "center" }}>
          <CircularProgress aria-label="Loading hand histories" size={24} />
        </Box>
      ) : handIds.length === 0 ? (
        <Box role="status" sx={{ px: 3, py: 5, textAlign: "center" }}>
          <Typography color="text.secondary" variant="body2">
            no hands found
          </Typography>
        </Box>
      ) : (
        <Table size="small" aria-label="Hand histories">
          <TableHead>
            <TableRow>
              <TableCell>Hand ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {handIds.map((handId) => (
              <HandHistoryRow key={handId} handId={handId} />
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};
