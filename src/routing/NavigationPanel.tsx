import HistoryIcon from "@mui/icons-material/History";
import InsightsIcon from "@mui/icons-material/Insights";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import { Box, Drawer, List } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { NavigationItem } from "./NavigationItem";

const drawerWidth = { xs: 56, sm: 224 };

const navigationDrawerSx = {
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    position: "relative",
    width: drawerWidth,
    boxSizing: "border-box",
    bgcolor: "background.paper",
    borderRight: 1,
    borderColor: "divider",
  },
} satisfies SxProps<Theme>;

const navigationSx = {
  pt: 1,
} satisfies SxProps<Theme>;

const navigationListSx = {
  px: { xs: 0.5, sm: 1 },
} satisfies SxProps<Theme>;

type Props = {
  pathname: string;
};

export const NavigationPanel = (props: Props) => {
  return (
    <Drawer variant="permanent" sx={navigationDrawerSx}>
      <Box component="nav" aria-label="Main navigation" sx={navigationSx}>
        <List sx={navigationListSx}>
          <NavigationItem icon={<HistoryIcon />} label="Hand Histories" route="/" selected={props.pathname === "/"} />
          <NavigationItem
            icon={<QueryStatsIcon />}
            label="Range Tracker"
            route="/range-tracker"
            selected={props.pathname === "/range-tracker"}
          />
          <NavigationItem
            icon={<SpaceDashboardIcon />}
            label="Dashboard"
            route="/dashboard"
            selected={props.pathname === "/dashboard"}
          />
          <NavigationItem
            icon={<InsightsIcon />}
            label="Diagnostics"
            route="/diagnostics"
            selected={props.pathname === "/diagnostics"}
          />
        </List>
      </Box>
    </Drawer>
  );
};
