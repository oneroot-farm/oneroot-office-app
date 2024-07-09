"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment, useState, useEffect } from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slice/user";

// Icons
import MenuIcon from "@mui/icons-material/Menu";

// Utils
import { capitalizeString } from "@/utils";

// Constants
import { LOWER_MENU } from "@/constants";

// Define constants.
const drawerWidth = 240;

const MobileSideBar = (props) => {
  // Destructuring props
  const { children, menu } = props;

  // States
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const user = useSelector((state) => state.user.data ?? {});

  // Pathname
  const pathName = usePathname();

  // Router
  const router = useRouter();

  const dispatch = useDispatch();

  // Update active state when route changes
  useEffect(() => {
    const currentRoute = pathName.split("/")[1]; // Extract the route name from the path

    const route = currentRoute === "" ? "Dashboard" : currentRoute;

    if (route) {
      setActive(capitalizeString(route.replace(/_/g, " ")));
    }
  }, [pathName]);

  // Not rendering sidebar for login page 🚨
  if (pathName === "login" || pathName?.includes("login"))
    return <Fragment>{children}</Fragment>;

  // Toggle handler
  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  // List Item click handler
  const listItemClickHandler = (e, text) => {
    e.preventDefault();

    const path =
      text === "Dashboard" ? "/" : text.toLowerCase().replace(/ /g, "_");

    // Closing sidebar on small screens 📱
    handleDrawerToggle();

    router.push(`/${path}`);
  };

  const filterMenu = (items) => {
    if (user?.role === "CC_MANAGER") {
      return items.filter(
        (item) => item.name !== "Users" && item.name !== "Outward"
      );
    }

    return items;
  };

  const logoutClickHandler = () => {
    dispatch(logoutUser());

    router.replace("/login");
  };

  // List Item Container
  const Container = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        flex="1"
        sx={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Sidebar header */}
        <Toolbar>
          <div className="w-full h-full relative">
            <Image
              alt="logo"
              layout="fill"
              objectFit="contain"
              src="/assets/logo.png"
              unoptimized
            />
          </div>
        </Toolbar>

        {/* Profile */}
        {open && (
          <div className="flex flex-col gap-4 justify-center items-center mt-2">
            <Avatar
              alt="Rohit"
              sx={{ width: 100, height: 100 }}
              src="/assets/card-fallback.png"
            />

            <Typography
              fontWeight={"600"}
              variant="h4"
              noWrap
              component="div"
              textAlign={"center"}
            >
              {user?.name}
              <Typography
                noWrap
                variant="h6"
                component="div"
                fontWeight={"500"}
              >
                {user?.role} - {user?.id}
              </Typography>
            </Typography>
          </div>
        )}

        {/* Menu */}
        <List>
          {filterMenu(menu.TOP_MENU).map((route, _) => (
            <ListItem
              key={route.name}
              disablePadding
              onClick={(e) => listItemClickHandler(e, route.name)}
            >
              <ListItemButton>
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Divider */}
        {/* <Divider /> */}

        {/* Menu */}
        {/* <List>
          {filterMenu(menu.MIDDLE_MENU).map((route, _) => (
            <ListItem
              key={route.name}
              disablePadding
              onClick={(e) => listItemClickHandler(e, route.name)}
            >
              <ListItemButton>
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}

        {/* Divider */}
        {/* <Divider /> */}

        {/* Menu */}
        {/* <List>
          {filterMenu(menu.BOTTOM_MENU).map((route, _) => (
            <ListItem
              key={route.name}
              disablePadding
              onClick={(e) => listItemClickHandler(e, route.name)}
            >
              <ListItemButton>
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Box>

      {/* Menu */}
      {/* <List sx={{ mt: "auto" }}>
        {LOWER_MENU.map((route, _) => (
          <ListItem
            key={route.name}
            disablePadding
            onClick={logoutClickHandler}
          >
            <ListItemButton>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Topbar */}
      <AppBar
        position="fixed"
        sx={(theme) => ({
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.primary.white,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        })}
      >
        {/* Menu Icon - Mobile only 📱 */}
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            width={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            {/* Active route name */}
            <Typography
              variant="h4"
              noWrap
              component="div"
              fontWeight={"600"}
              letterSpacing={"0.1rem"}
            >
              {active}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        {/* Drawer - Mobile only 📱 */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {Container}
        </Drawer>
      </Box>

      {/* Children Wrapper */}
      <Box
        component="main"
        sx={{
          p: 3,
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        {children}
      </Box>
    </Box>
  );
};

export default MobileSideBar;
