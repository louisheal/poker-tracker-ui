import { AppBar, Toolbar, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
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
          sx={{ fontWeight: 600, flexGrow: 1 }}
        >
          Poker Tracker
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  );
}
