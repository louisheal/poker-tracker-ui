import HistoryIcon from "@mui/icons-material/History";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
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

type Props = {
  isRangeTracker: boolean;
};

export const NavigationPanel = (props: Props) => {
  return (
    <Drawer variant="permanent" sx={navigationDrawerSx}>
      <Box component="nav" aria-label="Main navigation" sx={{ pt: 1 }}>
        <List sx={{ px: { xs: 0.5, sm: 1 } }}>
          <NavigationItem icon={<HistoryIcon />} label="Hand Histories" route="/" selected={!props.isRangeTracker} />
          <NavigationItem
            icon={<QueryStatsIcon />}
            label="Range Tracker"
            route="/range-tracker"
            selected={props.isRangeTracker}
          />
        </List>
      </Box>
    </Drawer>
  );
};
