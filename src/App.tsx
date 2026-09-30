import { CssBaseline, ThemeProvider } from "@mui/material";
import { HandHistoryView } from "./HandHistoryView";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HandHistoryView />
    </ThemeProvider>
  );
}

export default App;
