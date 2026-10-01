import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Link } from "@tanstack/react-router";

const navigationItemSx = {
  minHeight: 48,
  justifyContent: { xs: "center", sm: "flex-start" },
  px: { xs: 0, sm: 2 },
  borderRadius: 1,
} satisfies SxProps<Theme>;

const navigationIconSx = {
  minWidth: { xs: 0, sm: 40 },
  justifyContent: "center",
  color: "inherit",
} satisfies SxProps<Theme>;

const navigationTextSx = {
  display: { xs: "none", sm: "block" },
} satisfies SxProps<Theme>;

interface Props {
  route: string;
  selected: boolean;
  icon: React.ReactNode;
  label: string;
}

export const NavigationItem = (props: Props) => {
  return (
    <Tooltip title={props.label} placement="right">
      <ListItemButton
        component={Link}
        to={props.route}
        selected={props.selected}
        aria-current={props.selected ? "page" : undefined}
        aria-label={props.label}
        sx={navigationItemSx}
      >
        <ListItemIcon sx={navigationIconSx}>{props.icon}</ListItemIcon>
        <ListItemText primary={props.label} sx={navigationTextSx} />
      </ListItemButton>
    </Tooltip>
  );
};
