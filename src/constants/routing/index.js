"use client";

// Icons
import CallIcon from "@mui/icons-material/Call";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";

export const TOP_MENU = [
  {
    name: "Dashboard",
    icon: <SpaceDashboardIcon />,
  },
  {
    name: "Reservations",
    icon: <BookmarkIcon />,
  },
  {
    name: "Farms",
    icon: <AgricultureIcon />,
  },
  {
    name: "Call Logs",
    icon: <CallIcon />,
  },
];

export const MIDDLE_MENU = [];

export const BOTTOM_MENU = [];

export const LOWER_MENU = [];

export const SIDEBAR_MENU = {
  TOP_MENU,
  MIDDLE_MENU,
  BOTTOM_MENU,
};
