import { AppBar, Toolbar, Typography } from "@mui/material";

export function Header() {
  return (
    <AppBar
      component="header"
      position="static"
      elevation={0}
      sx={{ bgcolor: "transparent", borderBottom: 1, borderColor: "divider" }}
    >
      <Toolbar sx={{ minHeight: "64px !important", px: { xs: 2.5, sm: 4 } }}>
        <Typography
          component="h1"
          variant="h6"
          sx={{ fontWeight: 600, letterSpacing: 0 }}
        >
          Poker Tracker
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
