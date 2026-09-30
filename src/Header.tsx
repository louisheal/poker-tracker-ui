import { AppBar, Toolbar, Typography } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export const Header = (props: Props) => {
  return (
    <AppBar
      component="header"
      position="static"
      elevation={0}
      sx={{ bgcolor: "transparent", borderBottom: 1, borderColor: "divider" }}
    >
      <Toolbar sx={{ minHeight: "64px !important", px: { xs: 1, sm: 4 } }}>
        <Typography
          component="h1"
          variant="h6"
          sx={{ fontWeight: 600, flexGrow: 1 }}
        >
          Poker Tracker
        </Typography>
        {props.children}
      </Toolbar>
    </AppBar>
  );
};
