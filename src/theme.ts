import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#111315",
      paper: "#25282d",
    },
    divider: "#383c42",
    text: {
      primary: "#f2f3f4",
      secondary: "#a4a8ae",
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
  },
});
