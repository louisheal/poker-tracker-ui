import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { NavigationPanel } from "./NavigationPanel";

const rootLayoutSx = {
  display: "flex",
  minHeight: "100vh",
} satisfies SxProps<Theme>;

const contentSx = {
  flexGrow: 1,
  minWidth: 0,
} satisfies SxProps<Theme>;

export const RootLayout = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  return (
    <Box sx={rootLayoutSx}>
      <NavigationPanel pathname={pathname} />
      <Box sx={contentSx}>
        <Outlet />
      </Box>
    </Box>
  );
};
