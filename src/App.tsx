import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { HandHistoryView } from "./handHistories/HandHistoryView";
import { NavigationPanel } from "./NavigationPanel";
import { theme } from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <NavigationPanel />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <HandHistoryView />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
