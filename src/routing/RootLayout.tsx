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
  const isRangeTracker = pathname === "/range-tracker";

  return (
    <Box sx={rootLayoutSx}>
      <NavigationPanel isRangeTracker={isRangeTracker} />
      <Box sx={contentSx}>
        <Outlet />
      </Box>
    </Box>
  );
};
