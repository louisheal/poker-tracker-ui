import { AppBar, Toolbar, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

const appBarSx = {
  bgcolor: "transparent",
  borderBottom: 1,
  borderColor: "divider",
} satisfies SxProps<Theme>;

const toolbarSx = {
  minHeight: "64px !important",
  px: { xs: 1, sm: 4 },
} satisfies SxProps<Theme>;

const titleSx = {
  fontWeight: 600,
  flexGrow: 1,
} satisfies SxProps<Theme>;

type Props = {
  children?: ReactNode;
};

export const Header = (props: Props) => {
  return (
    <AppBar component="header" position="static" elevation={0} sx={appBarSx}>
      <Toolbar sx={toolbarSx}>
        <Typography component="h1" variant="h6" sx={titleSx}>
          Poker Tracker
        </Typography>
        {props.children}
      </Toolbar>
    </AppBar>
  );
};
