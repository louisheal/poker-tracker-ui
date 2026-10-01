import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routing/router";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
