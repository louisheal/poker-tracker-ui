import HistoryIcon from "@mui/icons-material/History";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

const drawerWidth = { xs: 56, sm: 224 };

export const NavigationPanel = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
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
      }}
    >
      <Box component="nav" aria-label="Main navigation" sx={{ pt: 1 }}>
        <List sx={{ px: { xs: 0.5, sm: 1 } }}>
          <Tooltip title="Hand histories" placement="right">
            <ListItemButton
              component="a"
              href="/"
              selected
              aria-current="page"
              aria-label="Hand histories"
              sx={{
                minHeight: 48,
                justifyContent: { xs: "center", sm: "flex-start" },
                px: { xs: 0, sm: 2 },
                borderRadius: 1,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: { xs: 0, sm: 40 },
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText
                primary="Hand histories"
                sx={{ display: { xs: "none", sm: "block" } }}
              />
            </ListItemButton>
          </Tooltip>
        </List>
      </Box>
    </Drawer>
  );
};
