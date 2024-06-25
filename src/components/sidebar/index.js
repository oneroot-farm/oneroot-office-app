"use client";

import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Components
import DesktopSidebar from "@/components/sidebar/desktop";
import MobileSidebar from "@/components/sidebar/mobile";

const Sidebar = (props) => {
  const theme = useTheme();

  // media query that will be true when the screen width is less than or equal to the sm breakpoint
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  return matches ? <MobileSidebar {...props} /> : <DesktopSidebar {...props} />;
};

export default Sidebar;
